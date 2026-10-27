#!/usr/bin/env python3
"""Tempo de cada palavra das quatro narrações, para cravar batida e legenda.

O texto é o das legendas entregues (docs/legenda/*.srt); o tempo vem da
própria gravação:

1. o reconhecedor (parakeet, sherpa-onnx) ouve cada narração inteira e dá
   um tempo para cada palavra que ouviu;
2. o texto da legenda é alinhado a essas palavras (difflib); palavra sem
   par é interpolada entre as vizinhas;
3. a energia do áudio diz onde há fala (ilhas); quando o reconhecedor põe a
   palavra a até 3 frames de um começo de ilha, ela é puxada para ele.

Uso: python3 -I palavras.py <projeto> <pasta do modelo parakeet>
Saída: <projeto>/src/data/palavras.json
  {short: {frames, palavras: [{t, cue, de, ate}], cues: [{de, ate, linhas}]}}
"""
import difflib
import json
import os
import re
import subprocess
import sys
import unicodedata

import numpy as np

PROJ, MODELO = sys.argv[1], sys.argv[2]
SHORTS = {'1-contagem': 781, '2-anel': 1261, '3-sagas': 1257, '4-oficina': 1213}
FPS = 30


def pcm(arq, sr):
    return np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', arq, '-ac', '1', '-ar', str(sr),
                                         '-f', 'f32le', '-'], capture_output=True, check=True).stdout, np.float32)


def norm(p):
    p = unicodedata.normalize('NFD', p.lower())
    return ''.join(c for c in p if c.isalnum() and not unicodedata.combining(c))


def ler_srt(arq):
    blocos = open(arq, encoding='utf-8').read().strip().split('\n\n')
    cues = []
    for b in blocos:
        ls = b.strip().split('\n')
        m = re.match(r'(\d+):(\d+):(\d+),(\d+) --> (\d+):(\d+):(\d+),(\d+)', ls[1])
        t = [int(v) for v in m.groups()]
        de = (t[0] * 3600 + t[1] * 60 + t[2] + t[3] / 1000) * FPS
        ate = (t[4] * 3600 + t[5] * 60 + t[6] + t[7] / 1000) * FPS
        cues.append(dict(de=round(de, 1), ate=round(ate, 1), linhas=ls[2:]))
    return cues


def ilhas(x, sr):
    """(começo, fim) das ilhas de fala, em frames (janela de 10 ms)."""
    w = sr // 100
    n = len(x) // w
    db = 20 * np.log10(np.sqrt((x[:n * w].reshape(n, w) ** 2).mean(1)) + 1e-9)
    p95 = np.percentile(db, 95)
    fala = db > p95 - 30
    out, i = [], 0
    while i < n:
        if fala[i]:
            j = i
            while j < n and (fala[j] or fala[j + 1:j + 8].any()):
                j += 1
            # respiração: ilha que nunca chega a 15 dB do pico da fala
            if db[i:j].max() >= p95 - 15:
                out.append((i * 0.3, j * 0.3))
            i = j
        i += 1
    return out


def main():
    import sherpa_onnx
    rec = sherpa_onnx.OfflineRecognizer.from_transducer(
        encoder=os.path.join(MODELO, 'encoder.int8.onnx'), decoder=os.path.join(MODELO, 'decoder.int8.onnx'),
        joiner=os.path.join(MODELO, 'joiner.int8.onnx'), tokens=os.path.join(MODELO, 'tokens.txt'),
        num_threads=4, model_type='nemo_transducer')
    saida = {}
    for sid, frames in SHORTS.items():
        arq = os.path.join(PROJ, 'public/audio', sid + '.mp3')
        s = rec.create_stream()
        s.accept_waveform(16000, pcm(arq, 16000))
        rec.decode_stream(s)
        ouvidas = []
        for tok, ts in zip(s.result.tokens, s.result.timestamps):
            if tok[:1] in ('▁', ' ') or not ouvidas:
                ouvidas.append([ts * FPS, tok.lstrip('▁ ')])
            else:
                ouvidas[-1][1] += tok
        il = ilhas(pcm(arq, 48000), 48000)
        comecos = np.array([a for a, _ in il])
        cues = ler_srt(os.path.join(PROJ, 'docs/legenda', sid + '.srt'))
        texto = [(w, k) for k, c in enumerate(cues) for w in ' '.join(c['linhas']).split()]
        a = [norm(w) for w, _ in texto]
        o = [norm(w) for _, w in ouvidas]
        t = [None] * len(a)
        for bl in difflib.SequenceMatcher(None, a, o, autojunk=False).get_matching_blocks():
            for k in range(bl.size):
                t[bl.a + k] = ouvidas[bl.b + k][0]
        com = [i for i, v in enumerate(t) if v is not None]
        for i in range(len(t)):
            if t[i] is None:
                an = max((j for j in com if j < i), default=None)
                de = min((j for j in com if j > i), default=None)
                if an is None:
                    t[i] = t[de] - 6
                elif de is None:
                    t[i] = t[an] + 6
                else:
                    t[i] = t[an] + (t[de] - t[an]) * (i - an) / (de - an)
        for i in range(len(t)):
            perto = comecos[np.abs(comecos - t[i]) <= 3]
            if len(perto):
                t[i] = float(perto[np.argmin(np.abs(perto - t[i]))])
        fim_fala = [b for _, b in il]
        pal = []
        for i, (w, k) in enumerate(texto):
            prox = t[i + 1] if i + 1 < len(t) else frames
            # fim: o fim da ilha em que a palavra está, sem passar da próxima
            fins = [b for a_, b in il if a_ <= t[i] + 1 and b > t[i]]
            ate = min(prox, fins[0]) if fins else prox
            pal.append(dict(t=w, cue=k, de=round(t[i], 1), ate=round(max(ate, t[i] + 3), 1)))
        sem_par = sum(1 for i in range(len(a)) if i not in com)
        saida[sid] = dict(frames=frames, palavras=pal, cues=cues)
        print(f'{sid}: {len(pal)} palavras ({sem_par} sem par no reconhecedor), fala até {fim_fala[-1]:.0f}/{frames}')
        for c_i, c in enumerate(cues):
            primeira = next(p for p in pal if p['cue'] == c_i)
            print(f'   legenda {c_i + 1:2d}: srt {c["de"]:6.1f}  fala {primeira["de"]:6.1f}  ({primeira["t"]})')
    os.makedirs(os.path.join(PROJ, 'src/data'), exist_ok=True)
    json.dump(saida, open(os.path.join(PROJ, 'src/data/palavras.json'), 'w'), ensure_ascii=False, indent=0)


if __name__ == '__main__':
    main()

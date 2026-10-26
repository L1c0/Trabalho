#!/usr/bin/env python3
"""Tempo de cada palavra da narração, para cravar data e tipografia na fala.

O AUDIO.md dá o frame de cada fala (marca encaixada na pausa medida). Isso
basta para troca de plano, mas a data de uma fala como "19º dia do quinto
mês de Shoho 2, 1645" tem que chegar no "1645", não no começo da frase.

1. o reconhecedor (parakeet, sherpa-onnx) ouve a narração em trechos que
   começam nas marcas do AUDIO.md e dá um tempo para cada palavra;
2. a energia do áudio diz onde há fala (ilhas) e onde há pausa;
3. quando o reconhecedor põe a palavra a até 3 frames de um começo de
   ilha, ela é puxada para ele (a ilha é o começo real da fala; mais longe
   que isso a ilha é de outra palavra).

Uso: python3 -I palavras.py <projeto> <pasta do modelo parakeet>
Saída: <projeto>/src/data/palavras.json  ->  [[frame, palavra], ...]
"""
import json
import os
import re
import subprocess
import sys

import numpy as np

PROJ, MODELO = sys.argv[1], sys.argv[2]
NARRACAO = os.path.join(PROJ, 'public/audio/vag-narracao.mp3')
SR = 16000


def pcm(arq, sr):
    return np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', arq, '-ac', '1', '-ar', str(sr),
                                         '-f', 'f32le', '-'], capture_output=True, check=True).stdout,
                         np.float32)


def marcas_do_audio_md():
    txt = open(os.path.join(PROJ, 'docs/vagabond-AUDIO.md'), encoding='utf-8').read()
    fala = txt[txt.index('## Todas as falas'):]
    return sorted({int(m.group(1)) for m in re.finditer(r'^\| (\d+) \| \d+:\d+,\d+ \|', fala, re.M)})


def ilhas_de_fala(x, sr):
    """Começo das ilhas de fala, em frames de 30 fps (janela de 10 ms)."""
    w = sr // 100
    n = len(x) // w
    db = 20 * np.log10(np.sqrt((x[:n * w].reshape(n, w) ** 2).mean(1)) + 1e-9)
    p95 = np.percentile(db, 95)
    fala = db > p95 - 30
    inicios, i = [], 0
    while i < n:
        if fala[i]:
            j = i
            while j < n and (fala[j] or fala[j + 1:j + 8].any()):
                j += 1
            if db[i:j].max() >= p95 - 15:
                inicios.append(i * 0.3)
            i = j
        i += 1
    return np.array(inicios)


def main():
    import sherpa_onnx
    rec = sherpa_onnx.OfflineRecognizer.from_transducer(
        encoder=os.path.join(MODELO, 'encoder.int8.onnx'), decoder=os.path.join(MODELO, 'decoder.int8.onnx'),
        joiner=os.path.join(MODELO, 'joiner.int8.onnx'), tokens=os.path.join(MODELO, 'tokens.txt'),
        num_threads=4, model_type='nemo_transducer')
    x = pcm(NARRACAO, SR)
    total = len(x) / SR * 30
    marcas = marcas_do_audio_md()
    # trechos de até ~25 s, cortados sempre numa marca (que cai em pausa)
    cortes = [0]
    for m in marcas:
        if m - cortes[-1] >= 600:
            cortes.append(m)
    cortes.append(int(total) + 1)
    palavras = []
    for a, b in zip(cortes[:-1], cortes[1:]):
        trecho = x[int(a / 30 * SR):int(b / 30 * SR)]
        s = rec.create_stream()
        s.accept_waveform(SR, trecho)
        rec.decode_stream(s)
        r = s.result
        atual = None
        for tok, ts in zip(r.tokens, r.timestamps):
            # o modelo marca começo de palavra com '▁' ou com espaço
            if tok[:1] in ('▁', ' ') or atual is None:
                if atual:
                    palavras.append(atual)
                atual = [a + ts * 30, tok.lstrip('▁ ')]
            else:
                atual[1] += tok
        if atual:
            palavras.append(atual)
    ilhas = ilhas_de_fala(pcm(NARRACAO, 48000), 48000)
    out = []
    for f, p in palavras:
        perto = ilhas[np.abs(ilhas - f) <= 3]
        f2 = float(perto[np.argmin(np.abs(perto - f))]) if len(perto) else f
        out.append([round(f2, 1), p])
    os.makedirs(os.path.join(PROJ, 'src/data'), exist_ok=True)
    json.dump(out, open(os.path.join(PROJ, 'src/data/palavras.json'), 'w'), ensure_ascii=False, indent=0)
    print(len(out), 'palavras;', 'última em', out[-1])


if __name__ == '__main__':
    main()

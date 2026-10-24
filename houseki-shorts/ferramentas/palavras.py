#!/usr/bin/env python3
"""Tempo de cada palavra da narração, para a legenda palavra por palavra.

O texto vem do roteiro (src/data/roteiro.json, a transcrição do
houseki-shorts-AUDIO.md); o tempo vem da própria gravação:

1. um reconhecedor de fala (parakeet, rodado à parte) dá um tempo grosso
   para cada palavra que ele ouviu, com erro de até ~20 frames;
2. o texto do roteiro é alinhado a essas palavras, só para saber onde cada
   batida começa de verdade;
3. a energia do áudio diz onde há fala (ilhas) e onde há pausa;
4. dentro de cada batida, o tempo de fala (só as ilhas, sem as pausas) é
   dividido entre as palavras pelo tamanho delas.

Uso: python3 -I palavras.py <projeto> <pasta com os json do reconhecedor>
Saída: src/data/palavras.json
"""
import difflib, json, os, subprocess, sys, unicodedata
import numpy as np

PROJ, ASR = sys.argv[1], sys.argv[2]
roteiro = json.load(open(os.path.join(PROJ, "src/data/roteiro.json")))


def norm(p):
    p = unicodedata.normalize("NFD", p.lower())
    return "".join(c for c in p if c.isalnum() and not unicodedata.combining(c))


def ilhas_de_fala(arq):
    sr = 48000
    x = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", arq, "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"],
                                     capture_output=True, check=True).stdout, np.float32)
    w = sr // 100
    n = len(x) // w
    db = 20 * np.log10(np.sqrt((x[:n * w].reshape(n, w) ** 2).mean(1)) + 1e-9)
    p95 = np.percentile(db, 95)
    fala = db > p95 - 30
    ilhas, i = [], 0
    while i < n:
        if fala[i]:
            j = i
            # pausa de menos de 80 ms não separa palavra (é consoante, não respiro)
            while j < n and (fala[j] or fala[j + 1:j + 8].any()):
                j += 1
            # respiração: ilha que nunca chega a 15 dB do pico da fala
            if db[i:j].max() >= p95 - 15:
                ilhas.append([i * 0.3, j * 0.3])       # em frames de 30 fps
            i = j
        i += 1
    return ilhas


saida = {}
for sid, s in roteiro.items():
    asr = json.load(open(os.path.join(ASR, s["arquivo"] + ".json")))
    ilhas = ilhas_de_fala(os.path.join(PROJ, "public/audio/shorts", s["arquivo"] + ".flac"))
    palavras = []                    # (texto, batida)
    for b, (_, txt) in enumerate(s["batidas"]):
        palavras += [(p, b) for p in txt.split()]
    a = [norm(p) for p, _ in palavras]
    o = [norm(p[0]) for p in asr]
    grosso = [None] * len(a)
    for bl in difflib.SequenceMatcher(None, a, o, autojunk=False).get_matching_blocks():
        for k in range(bl.size):
            grosso[bl.a + k] = asr[bl.b + k][1] * 30
    # palavras sem par: interpola entre vizinhas com par
    idx = [i for i, g in enumerate(grosso) if g is not None]
    for i in range(len(grosso)):
        if grosso[i] is None:
            antes = max((j for j in idx if j < i), default=None)
            depois = min((j for j in idx if j > i), default=None)
            if antes is None:
                grosso[i] = grosso[depois]
            elif depois is None:
                grosso[i] = grosso[antes]
            else:
                grosso[i] = grosso[antes] + (grosso[depois] - grosso[antes]) * (i - antes) / (depois - antes)
    # início real de cada batida: a primeira ilha de fala depois da marca do
    # AUDIO.md (todas as marcas caem em pausa; conferido uma a uma). O tempo
    # do reconhecedor erra até 20 frames e não serve para isso.
    inicios = [min(il[0] for il in ilhas if il[0] >= f) for f, _ in s["batidas"]]
    fim_fala = ilhas[-1][1]
    out = []
    for b in range(len(s["batidas"])):
        ini = inicios[b]
        fim = inicios[b + 1] if b + 1 < len(inicios) else s["frames"]
        trechos = [[max(il[0], ini), min(il[1], fim)] for il in ilhas if il[1] > ini and il[0] < fim]
        trechos = [t for t in trechos if t[1] - t[0] > 0.5]
        total = sum(t[1] - t[0] for t in trechos)
        ws = [p for p, bb in palavras if bb == b]
        pesos = [len(norm(p)) + 1 for p in ws]
        acum = np.concatenate([[0], np.cumsum(pesos)]) / sum(pesos) * total

        def real(v):                 # tempo de fala acumulado -> frame
            for t0, t1 in trechos:
                if v <= t1 - t0 + 1e-9:
                    return t0 + v
                v -= t1 - t0
            return trechos[-1][1]
        for k, p in enumerate(ws):
            out.append(dict(t=p, b=b, de=round(real(acum[k] + 1e-6), 1), ate=round(real(acum[k + 1]), 1)))
    saida[sid] = dict(frames=s["frames"],
                      batidas=[dict(doc=s["batidas"][b][0], fala=round(inicios[b], 1)) for b in range(len(inicios))],
                      palavras=out)
    print(sid, "batidas (doc -> fala):", [(s["batidas"][b][0], round(inicios[b], 1)) for b in range(len(inicios))])
json.dump(saida, open(os.path.join(PROJ, "src/data/palavras.json"), "w"), ensure_ascii=False, indent=0)

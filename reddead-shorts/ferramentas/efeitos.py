#!/usr/bin/env python3
"""
Os efeitos sonoros dos Shorts, todos feitos por síntese (nenhum arquivo de
banco de sons). Cada função devolve um som estéreo em 48 kHz, com pico 1,0;
quem dá o volume e a posição no tempo é a partitura (ferramentas/mixagem.py).

Cada som aceita uma semente: dois carimbos seguidos nunca saem idênticos.

  python3 -I ferramentas/efeitos.py <pasta>   grava um .wav de cada efeito, para ouvir
"""
import sys

import numpy as np
from scipy import signal

SR = 48000


# ---------- peças básicas ----------

def gera(sem):
    return np.random.default_rng(sem)


def n_de(seg):
    return max(1, int(round(seg * SR)))


def tempo(n):
    return np.arange(n) / SR


def passa(x, tipo, freq, ordem=2):
    sos = signal.butter(ordem, freq, btype=tipo, fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=0)


def cai(n, tau):
    """Envelope que decai: exp(-t / tau)."""
    return np.exp(-tempo(n) / tau)


def sobe(n, ataque):
    """Ataque em cosseno, para não estalar."""
    e = np.ones(n)
    k = min(n, max(1, int(ataque * SR)))
    e[:k] = 0.5 - 0.5 * np.cos(np.pi * np.arange(k) / k)
    return e


def fecha(x, seg=0.01):
    """Fecha o fim do som em cosseno."""
    k = min(len(x), max(1, int(seg * SR)))
    x = x.copy()
    x[-k:] = x[-k:] * (0.5 + 0.5 * np.cos(np.pi * np.arange(k) / k))[(...,) + (None,) * (x.ndim - 1)]
    return x


def pico(x, v=1.0):
    return x * (v / (np.abs(x).max() + 1e-12))


def estereo(x, pos=0.0):
    """Mono -> estéreo com potência constante. `pos` vai de -1 (esquerda) a 1 (direita), e pode variar no tempo."""
    if x.ndim == 2:
        return x
    a = (np.asarray(pos) + 1) * np.pi / 4
    return np.stack([x * np.cos(a), x * np.sin(a)], axis=1)


def senoide(freq, n, fase=0.0):
    """Senoide com frequência fixa ou variável (vetor)."""
    f = np.broadcast_to(np.asarray(freq, float), (n,))
    return np.sin(2 * np.pi * np.cumsum(f) / SR + fase)


def sala(x, g, dur=1.2, brilho=3500, quanto=0.25, pre=0.012):
    """Reverberação simples: convolução com ruído que decai, diferente em cada canal."""
    n = n_de(dur)
    out = np.zeros((len(x) + n + n_de(pre), 2))
    x2 = estereo(x)
    out[:len(x)] += x2
    for c in range(2):
        ri = g.standard_normal(n) * cai(n, dur / 5.5)
        ri = passa(ri, 'low', brilho)
        ri = passa(ri, 'high', 160)
        ri /= np.sqrt((ri ** 2).sum())
        molhado = signal.fftconvolve(x2[:, c], ri)[:len(x) + n]
        out[n_de(pre):n_de(pre) + len(molhado), c] += quanto * molhado
    return out


def faixa_movel(g, dur, f0, f1, larg=0.9, curva=1.0, sem_grave=120):
    """Ruído por uma faixa que anda de f0 a f1 (em oitavas de largura `larg`). É a base dos sopros."""
    n = n_de(dur)
    x = g.standard_normal(n + 4096)
    f, t, Z = signal.stft(x, fs=SR, nperseg=2048, noverlap=1536)
    pos = np.clip(t / dur, 0, 1) ** curva
    centro = f0 * (f1 / f0) ** pos
    with np.errstate(divide='ignore'):
        oit = np.log2(np.maximum(f[:, None], 1.0) / centro[None, :])
    masc = np.exp(-0.5 * (oit / (larg / 2)) ** 2)
    masc[f < sem_grave] = 0
    _, y = signal.istft(Z * masc, fs=SR, nperseg=2048, noverlap=1536)
    return y[:n]


# ---------- impactos ----------

def impacto(sem=1, grave=46, dur=1.6, estalo=1.0):
    """Batida grave de cinema: um mergulho de frequência, um corpo de ruído e a sala."""
    g = gera(sem)
    n = n_de(dur)
    t = tempo(n)
    f = grave + (150 - grave) * np.exp(-t / 0.035)
    corpo = senoide(f, n) * cai(n, dur / 4.2) * sobe(n, 0.002)
    sub = senoide(grave * 0.5 + 20 * np.exp(-t / 0.2), n) * cai(n, dur / 3.2) * 0.5
    chiado = passa(g.standard_normal(n), 'low', 420, 3) * cai(n, 0.11) * 0.9
    tapa = passa(g.standard_normal(n), 'band', [900, 5200]) * cai(n, 0.012) * 0.55 * estalo
    x = np.tanh(1.5 * (corpo + sub + chiado + tapa))
    return pico(sala(x, g, dur=1.4, brilho=1800, quanto=0.22))


def baque(sem=1, peso=1.0):
    """Baque seco: carimbo na mesa, tarja batendo."""
    g = gera(sem)
    n = n_de(0.34)
    t = tempo(n)
    k = g.uniform(0.93, 1.07)
    corpo = senoide((62 + 110 * np.exp(-t / 0.018)) * k / peso ** 0.3, n) * cai(n, 0.055 * peso) * sobe(n, 0.0015)
    madeira = passa(g.standard_normal(n), 'band', [220 * k, 760 * k]) * cai(n, 0.03) * 0.8
    tapa = passa(g.standard_normal(n), 'high', 2600) * cai(n, 0.007) * 0.5
    x = np.tanh(1.3 * (corpo + madeira + tapa))
    return pico(sala(x, g, dur=0.35, brilho=2600, quanto=0.12))


def carimbo(sem=1):
    """Carimbo: o baque, o papel cedendo e a borracha grudando na tinta."""
    g = gera(sem)
    b = baque(sem, peso=1.25)
    n = len(b)
    papel = passa(g.standard_normal(n), 'band', [1500, 6500]) * np.exp(-((tempo(n) - 0.03) / 0.022) ** 2) * 0.28
    gruda = passa(g.standard_normal(n), 'band', [500, 1800]) * np.exp(-((tempo(n) - 0.12) / 0.03) ** 2) * 0.12
    return pico(b + estereo(papel + gruda))


# ---------- sopros ----------

def sopro(sem=1, dur=0.5, f0=350, f1=3200, de=-0.8, para=0.8, pico_em=0.6):
    """Passagem de ar: a faixa do ruído sobe (ou desce) e o som cruza de um lado ao outro."""
    g = gera(sem)
    x = faixa_movel(g, dur, f0, f1, larg=1.3)
    n = len(x)
    t = np.linspace(0, 1, n)
    env = np.where(t < pico_em, (t / pico_em) ** 2.2, ((1 - t) / (1 - pico_em)) ** 1.6)
    grave = passa(g.standard_normal(n), 'band', [70, 240]) * env * 0.35
    return pico(estereo((x * env + grave), np.linspace(de, para, n)))


def subida(sem=1, dur=1.4, f0=180, f1=7000):
    """Tensão que cresce e corta seco no fim, para entregar a um impacto."""
    g = gera(sem)
    x = faixa_movel(g, dur, f0, f1, larg=1.1, curva=1.6)
    n = len(x)
    t = np.linspace(0, 1, n)
    env = t ** 3.2
    tom = senoide(70 * (2 ** (t * 2.2)), n) * env * 0.25 + senoide(105 * (2 ** (t * 2.2)), n) * env * 0.16
    treme = 1 + 0.25 * np.sin(2 * np.pi * (6 + 18 * t) * t * dur)
    y = (x * env * treme + tom)
    y[-n_de(0.006):] *= np.linspace(1, 0, n_de(0.006))
    return pico(estereo(y, 0.5 * np.sin(2 * np.pi * 3 * t)))


def vento(sem=1, dur=3.0):
    """Leito de vento: ruído grave e médio que respira."""
    g = gera(sem)
    n = n_de(dur)
    t = tempo(n)
    out = np.zeros((n, 2))
    for c in range(2):
        a = passa(g.standard_normal(n), 'band', [180, 620]) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.31 * t + g.uniform(0, 6)))
        b = passa(g.standard_normal(n), 'band', [700, 1900]) * (0.35 + 0.35 * np.sin(2 * np.pi * 0.47 * t + g.uniform(0, 6))) * 0.5
        out[:, c] = a + b
    env = np.minimum(1, np.minimum(t / 0.8, (dur - t) / 0.8))
    return pico(out * env[:, None])


# ---------- armas ----------

def engatilha(sem=1):
    """O cão do revólver sendo armado: dois cliques de metal."""
    g = gera(sem)
    n = n_de(0.5)
    x = np.zeros(n)
    for t0, tom, forca in ((0.0, 1.0, 0.75), (0.13, 0.82, 1.0)):
        i = n_de(t0)
        m = n - i
        clique = passa(g.standard_normal(m), 'band', [2200, 9000]) * cai(m, 0.0035)
        metal = sum(a * senoide(f * tom * g.uniform(0.98, 1.02), m) * cai(m, d) for f, a, d in ((2850, 1.0, 0.022), (4320, 0.7, 0.016), (6100, 0.5, 0.011), (1240, 0.6, 0.03)))
        mola = senoide(520 * tom, m) * cai(m, 0.012) * 0.5
        x[i:] += forca * (clique * 1.2 + metal * 0.5 + mola) * sobe(m, 0.0004)
    return pico(sala(x, g, dur=0.3, brilho=6000, quanto=0.1))


def tiro(sem=1):
    """Tiro de revólver ao ar livre: o estouro, o corpo grave e o eco voltando dos morros."""
    g = gera(sem)
    n = n_de(2.4)
    t = tempo(n)
    estouro = g.standard_normal(n) * cai(n, 0.016)
    estouro = passa(estouro, 'high', 300)
    corpo = senoide(52 + 190 * np.exp(-t / 0.02), n) * cai(n, 0.12)
    medio = passa(g.standard_normal(n), 'band', [350, 2400]) * cai(n, 0.07)
    seco = np.tanh(3.2 * (1.3 * estouro + 1.0 * corpo + 0.9 * medio)) * sobe(n, 0.0003)
    # o eco: cópias que chegam mais tarde, mais fracas e mais abafadas
    out = estereo(seco, 0.0)
    for atraso, ganho, corte, pos in ((0.105, 0.34, 3200, -0.5), (0.19, 0.25, 2400, 0.6), (0.33, 0.18, 1700, -0.3), (0.52, 0.12, 1200, 0.4), (0.8, 0.08, 900, 0.0)):
        i = n_de(atraso)
        e = passa(seco, 'low', corte)[:n - i] * ganho
        out[i:] += estereo(e, pos)
    cauda = passa(g.standard_normal(n), 'band', [250, 1800]) * cai(n, 0.55) * 0.1
    out += estereo(cauda * sobe(n, 0.04), 0.0)
    return pico(fecha(out, 0.3))


def trovao(sem=1, dur=3.2):
    """Trovão: o estalo e o ronco que rola e some."""
    g = gera(sem)
    n = n_de(dur)
    t = tempo(n)
    out = np.zeros((n, 2))
    for c in range(2):
        ronco = passa(g.standard_normal(n), 'low', 140, 3)
        mexe = np.abs(passa(g.standard_normal(n), 'low', 5)) + 0.1
        mexe /= mexe.max()
        out[:, c] = ronco * mexe * (cai(n, dur / 2.6) + 0.35 * np.exp(-((t - 0.9) / 0.35) ** 2))
    out = pico(out)
    estalo = passa(g.standard_normal(n), 'band', [700, 5200]) * cai(n, 0.05) * sobe(n, 0.001)
    rasga = passa(g.standard_normal(n), 'band', [300, 2600]) * cai(n, 0.3) * (np.abs(passa(g.standard_normal(n), 'low', 28)) * 6).clip(0, 1) * 0.6
    out += estereo(pico(estalo) * 0.7 + rasga * 0.5, 0.15)
    return pico(fecha(np.tanh(1.6 * out), 0.5))


# ---------- papel, pena, máquina ----------

def papel(sem=1, dur=0.32):
    """Folha de papel passando."""
    g = gera(sem)
    n = n_de(dur)
    t = np.linspace(0, 1, n)
    x = passa(g.standard_normal(n), 'band', [1300, 9000])
    env = np.exp(-((t - 0.3) / 0.16) ** 2) + 0.6 * np.exp(-((t - 0.7) / 0.12) ** 2)
    granula = 0.55 + 0.45 * np.abs(passa(g.standard_normal(n), 'low', 90)) * 6
    return pico(estereo(x * env * granula.clip(0, 1.5), np.linspace(-0.4, 0.4, n)))


def pena(sem=1, dur=1.2, tracos=6):
    """Pena riscando o papel: o arranhado sobe e desce a cada traço da letra."""
    g = gera(sem)
    n = n_de(dur)
    t = np.linspace(0, 1, n)
    fino = passa(g.standard_normal(n), 'band', [2600, 8500])
    grosso = passa(g.standard_normal(n), 'band', [450, 1500]) * 0.45
    env = np.zeros(n)
    for k in range(tracos):
        c = (k + 0.5 + g.uniform(-0.2, 0.2)) / tracos
        env += g.uniform(0.6, 1.0) * np.exp(-((t - c) / (0.3 / tracos)) ** 2)
    treme = 0.7 + 0.3 * np.abs(passa(g.standard_normal(n), 'low', 60)) * 5
    x = (fino + grosso) * env * treme.clip(0, 1.4)
    return pico(estereo(x, np.linspace(-0.5, 0.5, n)))


def risco(sem=1, dur=0.22):
    """Um risco só, rápido: sublinhar, riscar por cima."""
    g = gera(sem)
    x = faixa_movel(g, dur, 1800, 5200, larg=1.0)
    n = len(x)
    t = np.linspace(0, 1, n)
    env = np.sin(np.pi * t) ** 0.7
    return pico(estereo(x * env, np.linspace(-0.6, 0.6, n)))


def tecla(sem=1):
    """Uma tecla de máquina de escrever: o tipo bate no papel e o metal responde."""
    g = gera(sem)
    n = n_de(0.11)
    k = g.uniform(0.9, 1.1)
    clique = passa(g.standard_normal(n), 'band', [1800, 7500]) * cai(n, 0.0028)
    rolo = senoide(190 * k, n) * cai(n, 0.014) + passa(g.standard_normal(n), 'band', [500, 1300]) * cai(n, 0.011) * 0.7
    metal = senoide(3350 * k, n) * cai(n, 0.02) * 0.16 + senoide(5200 * k, n) * cai(n, 0.012) * 0.1
    x = (clique * 1.1 + rolo * 0.8 + metal) * sobe(n, 0.0003)
    return pico(estereo(x, g.uniform(-0.25, 0.25)))


def datilografia(sem=1, texto='abc', cps=24.0):
    """Datilografia de um texto: uma tecla por letra (o espaço bate mais grave e as quebras de linha não soam)."""
    g = gera(sem)
    n = n_de(len(texto) / cps + 0.2)
    out = np.zeros((n, 2))
    for i, ch in enumerate(texto):
        if ch == '\n':
            continue
        t0 = i / cps + g.uniform(-0.004, 0.004)
        s = tecla(int(g.integers(1, 1 << 30)))
        if ch == ' ':
            s = passa(s, 'low', 1600) * 0.8
        j = n_de(max(0, t0))
        m = min(len(s), n - j)
        out[j:j + m] += s[:m] * g.uniform(0.75, 1.0)
    return pico(out)


def campainha(sem=1):
    """A campainha do fim da linha da máquina de escrever."""
    g = gera(sem)
    n = n_de(1.0)
    x = sum(a * senoide(f, n) * cai(n, d) for f, a, d in ((2093, 1.0, 0.28), (4186 * 1.004, 0.4, 0.16), (5560, 0.22, 0.1), (6950, 0.12, 0.07)))
    x += passa(g.standard_normal(n), 'band', [3000, 9000]) * cai(n, 0.004) * 0.6
    return pico(sala(x * sobe(n, 0.0005), g, dur=0.5, brilho=7000, quanto=0.1))


def tique(sem=1, tom=1.0):
    """Tique seco de contador ou de régua."""
    g = gera(sem)
    n = n_de(0.06)
    k = tom * g.uniform(0.95, 1.05)
    x = senoide(1750 * k, n) * cai(n, 0.006) + senoide(2900 * k, n) * cai(n, 0.004) * 0.5 + passa(g.standard_normal(n), 'high', 3000) * cai(n, 0.0018) * 0.8
    return pico(estereo(x * sobe(n, 0.0003), g.uniform(-0.2, 0.2)))


def estalinho(sem=1, tom=1.0):
    """Estalinho redondo: um ponto que aparece no mapa."""
    g = gera(sem)
    n = n_de(0.07)
    t = tempo(n)
    k = tom * g.uniform(0.85, 1.2)
    x = senoide(620 * k * (1 + 0.9 * np.exp(-t / 0.008)), n) * cai(n, 0.014)
    return pico(estereo(x * sobe(n, 0.0006), g.uniform(-0.5, 0.5)))


# ---------- sinos, vidro, corda ----------

def sino(sem=1, base=196.0, dur=4.5):
    """Sino de igreja: parciais desafinados entre si, cada um com a sua queda."""
    g = gera(sem)
    n = n_de(dur)
    parciais = ((0.5, 0.55, 3.2), (1.0, 1.0, 2.6), (1.183, 0.7, 2.0), (1.506, 0.5, 1.5), (2.0, 0.75, 1.3), (2.514, 0.34, 0.9), (2.662, 0.28, 0.8), (3.011, 0.22, 0.6), (4.166, 0.16, 0.4), (5.433, 0.1, 0.28))
    x = np.zeros(n)
    for razao, amp, tau in parciais:
        bat = 1 + 0.12 * np.sin(2 * np.pi * g.uniform(0.4, 1.6) * tempo(n) + g.uniform(0, 6))
        x += amp * senoide(base * razao * g.uniform(0.998, 1.002), n, g.uniform(0, 6)) * cai(n, tau) * bat
    martelo = passa(g.standard_normal(n), 'band', [600, 4200]) * cai(n, 0.009) * 1.4
    x = (x + martelo) * sobe(n, 0.0015)
    return pico(fecha(sala(x, g, dur=2.2, brilho=3000, quanto=0.3), 0.6))


def vidro(sem=1):
    """Vidro tocando em vidro: o frasco na bancada."""
    g = gera(sem)
    n = n_de(0.7)
    k = g.uniform(0.95, 1.05)
    x = sum(a * senoide(f * k, n) * cai(n, d) for f, a, d in ((2380, 1.0, 0.11), (3920, 0.6, 0.08), (6240, 0.4, 0.05), (8100, 0.2, 0.035)))
    x += passa(g.standard_normal(n), 'high', 5000) * cai(n, 0.002) * 0.7
    return pico(sala(x * sobe(n, 0.0004), g, dur=0.4, brilho=8000, quanto=0.12))


def corda(sem=1):
    """Corda que arrebenta: o estalo, a nota que despenca e o chicote."""
    g = gera(sem)
    n = n_de(1.1)
    t = tempo(n)
    f = 92 + 240 * np.exp(-t / 0.05)
    nota = sum(senoide(f * h, n) * cai(n, 0.26 / h ** 0.6) / h for h in (1, 2, 3, 4, 5, 6))
    estalo = passa(g.standard_normal(n), 'band', [1500, 9000]) * cai(n, 0.006) * 2.2
    chicote = faixa_movel(g, 0.16, 6000, 900, larg=1.2)
    x = (nota * 0.9 + estalo) * sobe(n, 0.0004)
    x[:len(chicote)] += chicote * np.sin(np.pi * np.linspace(0, 1, len(chicote))) * 1.4
    return pico(sala(np.tanh(1.4 * x), g, dur=0.7, brilho=3500, quanto=0.18))


def cacos(sem=1, dur=0.8, quantos=14):
    """Pedaços caindo: estalos de madeira miúdos, cada vez mais espaçados."""
    g = gera(sem)
    n = n_de(dur + 0.2)
    out = np.zeros((n, 2))
    for i in range(quantos):
        t0 = dur * (i / quantos) ** 1.5 + g.uniform(0, 0.02)
        s = baque(int(g.integers(1, 1 << 30)), peso=g.uniform(0.35, 0.6))
        s = passa(s, 'high', 260) * g.uniform(0.4, 1.0)
        j = n_de(t0)
        m = min(len(s), n - j)
        out[j:j + m] += s[:m] * np.array([g.uniform(0.5, 1), g.uniform(0.5, 1)])
    return pico(out)


# ---------- corpo, cavalo ----------

def coracao(sem=1, forca=1.0):
    """Uma batida do coração: tum-tum."""
    g = gera(sem)
    n = n_de(0.55)
    t = tempo(n)
    x = np.zeros(n)
    for t0, amp, freq in ((0.0, 1.0, 58), (0.16, 0.7, 70)):
        i = n_de(t0)
        m = n - i
        tt = tempo(m)
        x[i:] += amp * senoide(freq + 40 * np.exp(-tt / 0.02), m) * cai(m, 0.055) * sobe(m, 0.004)
    x += passa(g.standard_normal(n), 'low', 120) * cai(n, 0.08) * 0.15
    return pico(estereo(np.tanh(1.2 * x * forca), 0.0))


def tosse_surda(sem=1):
    """Dois baques abafados no peito: a tosse, sem imitar a voz."""
    g = gera(sem)
    n = n_de(0.6)
    x = np.zeros(n)
    for t0, amp in ((0.0, 1.0), (0.21, 0.8)):
        i = n_de(t0)
        m = n - i
        sopro_ = passa(g.standard_normal(m), 'band', [240, 1500]) * np.exp(-((tempo(m) - 0.035) / 0.03) ** 2)
        peito = senoide(95 + 60 * np.exp(-tempo(m) / 0.03), m) * cai(m, 0.05)
        x[i:] += amp * (sopro_ * 0.9 + peito * 0.8)
    return pico(sala(x, g, dur=0.4, brilho=1800, quanto=0.15))


def casco(sem=1, chao=1.0):
    """Um casco no chão duro."""
    g = gera(sem)
    n = n_de(0.16)
    k = g.uniform(0.88, 1.12) * chao
    toc = passa(g.standard_normal(n), 'band', [650 * k, 1700 * k]) * cai(n, 0.013)
    oco = senoide(410 * k, n) * cai(n, 0.02) * 0.9 + senoide(128 * k, n) * cai(n, 0.035) * 0.8
    return pico((toc * 1.3 + oco) * sobe(n, 0.0006))


def galope(sem=1, dur=1.6, passada=0.44, de=-0.7, para=0.7):
    """Galope: três cascos juntos e o quarto atrasado, uma passada depois da outra."""
    g = gera(sem)
    n = n_de(dur + 0.2)
    out = np.zeros((n, 2))
    t0 = 0.0
    while t0 < dur:
        for d, amp in ((0.0, 0.8), (0.085, 1.0), (0.17, 0.9), (0.27, 0.65)):
            tt = t0 + d + g.uniform(-0.006, 0.006)
            if tt >= dur:
                break
            s = casco(int(g.integers(1, 1 << 30))) * amp * g.uniform(0.8, 1.0)
            j = n_de(tt)
            m = min(len(s), n - j)
            pos = de + (para - de) * tt / dur
            out[j:j + m] += estereo(s[:m], pos)
        t0 += passada * g.uniform(0.97, 1.03)
    env = np.minimum(1, np.minimum(tempo(n) / 0.15 + 0.4, (dur + 0.2 - tempo(n)) / 0.3))
    return pico(out * env[:, None])


# ---------- líquidos, cozinha ----------

def tinta(sem=1):
    """Tinta caindo no papel: o baque molhado e as gotas que espirram."""
    g = gera(sem)
    n = n_de(0.5)
    t = tempo(n)
    molhado = passa(g.standard_normal(n), 'low', 1400) * cai(n, 0.03)
    varre = senoide(760 * np.exp(-t / 0.05) + 150, n) * cai(n, 0.04) * 0.7
    x = (molhado + varre) * sobe(n, 0.001)
    out = estereo(x, 0.0)
    for _ in range(7):
        t0 = g.uniform(0.04, 0.3)
        m = n_de(0.03)
        gota = senoide(g.uniform(700, 1900) * (1 + 0.5 * np.exp(-tempo(m) / 0.004)), m) * cai(m, 0.006) * g.uniform(0.15, 0.4)
        j = n_de(t0)
        out[j:j + m] += estereo(gota, g.uniform(-0.8, 0.8))
    return pico(out)


def gole(sem=1):
    """Líquido servido: dois borbulhos."""
    g = gera(sem)
    n = n_de(0.5)
    x = np.zeros(n)
    for t0, f0 in ((0.0, 260), (0.14, 330), (0.27, 420)):
        m = n_de(0.12)
        tt = tempo(m)
        b = senoide(f0 * (1 + 1.1 * tt / 0.12), m) * np.sin(np.pi * tt / 0.12) ** 2
        j = n_de(t0)
        x[j:j + m] += b * g.uniform(0.7, 1.0)
    x += passa(g.standard_normal(n), 'band', [900, 3200]) * np.exp(-((tempo(n) - 0.2) / 0.15) ** 2) * 0.08
    return pico(estereo(x, 0.1))


def cutelo(sem=1):
    """Cutelo na tábua."""
    g = gera(sem)
    n = n_de(0.3)
    t = tempo(n)
    fio = passa(g.standard_normal(n), 'high', 3500) * cai(n, 0.003) * 1.2
    tabua = senoide(310, n) * cai(n, 0.03) + senoide(86 + 60 * np.exp(-t / 0.02), n) * cai(n, 0.06) + passa(g.standard_normal(n), 'band', [300, 1100]) * cai(n, 0.02) * 0.8
    return pico(sala((fio + tabua) * sobe(n, 0.0005), g, dur=0.3, brilho=2500, quanto=0.12))


def suspiro(sem=1):
    """Ar saindo devagar: descanso."""
    g = gera(sem)
    x = faixa_movel(g, 0.9, 900, 380, larg=1.4)
    n = len(x)
    t = np.linspace(0, 1, n)
    return pico(estereo(x * np.sin(np.pi * t) ** 1.5, 0.0))


# ---------- graves e brilhos ----------

def queda(sem=1, dur=2.0, de=95, para=28):
    """Grave que despenca e some: o chão sai de baixo."""
    n = n_de(dur)
    t = tempo(n)
    f = para + (de - para) * np.exp(-t / (dur / 4))
    x = senoide(f, n) * cai(n, dur / 3) * sobe(n, 0.004)
    x += 0.3 * senoide(f * 2, n) * cai(n, dur / 6)
    return pico(estereo(fecha(np.tanh(1.5 * x), 0.2), 0.0))


def brilho(sem=1, dur=0.9):
    """Brilho de luz: agudos que acendem e apagam."""
    g = gera(sem)
    n = n_de(dur)
    x = sum(senoide(f, n, g.uniform(0, 6)) * cai(n, d) for f, d in ((3520, 0.3), (5274, 0.22), (7040, 0.16), (10548, 0.1)))
    ar = passa(g.standard_normal(n), 'high', 6000) * cai(n, 0.12) * 0.3
    return pico(sala((x + ar) * sobe(n, 0.02), g, dur=0.8, brilho=9000, quanto=0.3))


def zumbido(sem=1, dur=4.0, nota=55.0):
    """Leito grave de tensão: duas notas quase iguais que batem entre si."""
    g = gera(sem)
    n = n_de(dur)
    t = tempo(n)
    x = senoide(nota, n) + 0.8 * senoide(nota * 1.006, n) + 0.4 * senoide(nota * 1.5, n) + 0.25 * senoide(nota * 2.01, n)
    x += passa(g.standard_normal(n), 'band', [90, 300]) * 0.25
    env = np.minimum(1, np.minimum(t / 1.2, (dur - t) / 0.6))
    return pico(estereo(np.tanh(0.8 * x) * env, 0.0))


EFEITOS = {
    'impacto': impacto, 'baque': baque, 'carimbo': carimbo, 'sopro': sopro, 'subida': subida, 'vento': vento,
    'engatilha': engatilha, 'tiro': tiro, 'trovao': trovao, 'papel': papel, 'pena': pena, 'risco': risco,
    'tecla': tecla, 'datilografia': datilografia, 'campainha': campainha, 'tique': tique, 'estalinho': estalinho,
    'sino': sino, 'vidro': vidro, 'corda': corda, 'cacos': cacos, 'coracao': coracao, 'tosse_surda': tosse_surda,
    'casco': casco, 'galope': galope, 'tinta': tinta, 'gole': gole, 'cutelo': cutelo, 'suspiro': suspiro,
    'queda': queda, 'brilho': brilho, 'zumbido': zumbido,
}

if __name__ == '__main__':
    import subprocess
    from pathlib import Path
    pasta = Path(sys.argv[1])
    pasta.mkdir(parents=True, exist_ok=True)
    for nome, fn in EFEITOS.items():
        x = estereo(fn())
        ff = subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', str(pasta / f'{nome}.wav')],
                            input=(x * 0.7).astype(np.float32).tobytes())
        e = np.abs(x).max(1)
        print('%-13s %5.2f s  pico %.2f  rms %6.1f dB' % (nome, len(x) / SR, e.max(), 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-9)))

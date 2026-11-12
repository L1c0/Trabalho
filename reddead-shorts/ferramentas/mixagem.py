#!/usr/bin/env python3
"""
A mixagem de cada Short: narração + música + efeitos sonoros.

  python3 -I ferramentas/mixagem.py 1      ->  public/audio/short1.wav
  python3 -I ferramentas/mixagem.py 2      ->  public/audio/short2.wav

Os tempos vêm dos mesmos arquivos que a imagem usa: as palavras de
src/data/sN.ts e os cortes de cena de src/sN/tempo.ts. Um efeito marcado para
a palavra "tabela" cai no mesmo quadro em que o carimbo bate na tela.

O que a mixagem faz:
- a narração perde o silêncio do começo, ganha volume (ela veio em -27 LUFS)
  e passa por um compressor leve;
- a música fica por baixo, abre um pouco nas pausas da fala e fecha de vez
  onde a partitura pede silêncio;
- os efeitos entram nos tempos da partitura (ferramentas/partitura.py);
- o conjunto é limitado em -3 dBTP e levado a -14 LUFS. A folga é para a
  compressão AAC, que cria picos de até 3 dB nas batidas secas.
"""
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from scipy import signal

sys.path.insert(0, str(Path(__file__).resolve().parent))
import efeitos as fx  # noqa: E402
import partitura  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
SR = fx.SR
FPS = 30
ALVO_LUFS = -14.0
TETO = 10 ** (-3.0 / 20)


def le(arq, ini=0.0, dur=None):
    cmd = ['ffmpeg', '-v', 'error', '-ss', f'{ini:.4f}', '-i', str(arq), '-vn']
    if dur:
        cmd += ['-t', f'{dur:.4f}']
    cmd += ['-ac', '2', '-ar', str(SR), '-f', 'f32le', '-']
    x = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(x, np.float32).reshape(-1, 2).astype(np.float64)


def grava(arq, x, bits=24):
    codec = 'pcm_s24le' if bits == 24 else 'pcm_s16le'
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'f64le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', codec, str(arq)],
                   input=x.astype(np.float64).tobytes(), check=True)


def medir(x):
    """Volume integrado (LUFS) e pico real (dBTP), medidos pelo ffmpeg."""
    with tempfile.NamedTemporaryFile(suffix='.wav') as tmp:
        grava(tmp.name, x)
        o = subprocess.run(['ffmpeg', '-nostdin', '-i', tmp.name, '-af', 'ebur128=peak=true:framelog=quiet', '-f', 'null', '-'], capture_output=True, text=True).stderr
    s = o[o.index('Summary'):]
    return float(re.search(r'I:\s+(-?[0-9.]+) LUFS', s).group(1)), float(re.search(r'Peak:\s+(-?[0-9.]+)', s).group(1))


class Tempo:
    """Os tempos de um Short, lidos dos mesmos arquivos que a imagem usa."""

    def __init__(self, n):
        dados = (RAIZ / 'src' / 'data' / f's{n}.ts').read_text(encoding='utf-8')
        self.corte = float(re.search(r'CORTE_S\d = ([0-9.]+)', dados).group(1))
        self.fim = float(re.search(r'FIM_S\d = ([0-9.]+)', dados).group(1))
        fala = re.search(r'`\n(.*?)`', dados, re.S).group(1)
        self.palavras = []
        for linha in fala.strip().split('\n'):
            partes = linha.split()
            if partes[-1].startswith('|'):
                partes.pop()
            self.palavras.append((float(partes[0]), self.limpa(' '.join(partes[1:]))))
        tempo_ts = (RAIZ / 'src' / f's{n}' / 'tempo.ts').read_text(encoding='utf-8')
        bloco = re.search(r'export const C = \{(.*?)\}', tempo_ts, re.S).group(1)
        self.C = {k: float(v) for k, v in re.findall(r'(\w+):\s*([0-9.]+)', bloco)}
        self.dur = self.q(self.fim) / FPS

    @staticmethod
    def limpa(s):
        return re.sub(r'[“”".,:;!?]', '', s.lower())

    def t(self, palavra, n=1):
        """Segundo da narração em que a palavra é dita (como `t` em tempo.ts)."""
        k = 0
        for seg, p in self.palavras:
            if p == self.limpa(palavra):
                k += 1
                if k == n:
                    return seg
        raise KeyError(f'a palavra "{palavra}" ({n}ª) não está na fala')

    def q(self, seg):
        return round((seg - self.corte) * FPS)

    def v(self, seg):
        """Segundo da narração -> segundo do vídeo, no quadro."""
        return self.q(seg) / FPS

    def vp(self, palavra, n=1, quadros=0):
        """Segundo do vídeo em que a imagem reage à palavra (um quadro antes, como `qp`)."""
        return (self.q(self.t(palavra, n)) - 1 + quadros) / FPS

    def vc(self, cena, quadros=0):
        """Segundo do vídeo de um corte de cena."""
        return (self.q(self.C[cena]) + quadros) / FPS


def compressor(x, limiar_db=-26.0, razao=2.6, ataque=0.006, solta=0.16):
    """Compressor simples sobre o envelope do sinal (o mesmo ganho nos dois canais)."""
    mono = np.abs(x).max(1)
    a_at, a_so = np.exp(-1 / (ataque * SR)), np.exp(-1 / (solta * SR))
    env = np.empty(len(mono))
    e = 0.0
    for i, v in enumerate(mono):
        e = a_at * e + (1 - a_at) * v if v > e else a_so * e + (1 - a_so) * v
        env[i] = e
    db = 20 * np.log10(env + 1e-9)
    excesso = np.maximum(db - limiar_db, 0)
    ganho = 10 ** (-(excesso * (1 - 1 / razao)) / 20)
    return x * ganho[:, None]


def limitador(x, teto=TETO, antecipa=0.005, solta=0.09):
    """
    Limitador com antecipação. O ganho necessário é calculado olhando alguns
    milissegundos à frente; ele volta devagar depois de cada pico e, por fim,
    é alisado numa média do tamanho da antecipação. Assim o ganho desce em
    rampa antes do pico chegar, sem degrau (o degrau criava picos entre as
    amostras).
    """
    k = int(antecipa * SR)
    # o pico é medido no sinal reamostrado em 4x: é o pico real, entre as amostras
    cima = np.abs(signal.resample_poly(x, 4, 1, axis=0))[:len(x) * 4]
    pico = np.maximum(np.abs(x).max(1), cima.reshape(len(x), 4, 2).max((1, 2)))
    janela = np.lib.stride_tricks.sliding_window_view(np.concatenate([pico, np.zeros(k)]), k + 1).max(1)
    alvo = np.minimum(1.0, teto / np.maximum(janela, 1e-9))
    a = np.exp(-1 / (solta * SR))
    g = np.empty(len(alvo))
    atual = 1.0
    for i, v in enumerate(alvo):
        atual = v if v < atual else a * atual + (1 - a) * v
        g[i] = atual
    # média dos últimos k valores: cada um deles já respeita o pico que vem, então a média também
    soma = np.cumsum(np.concatenate([np.full(k, g[0]), g]))
    g = (soma[k:] - soma[:-k]) / k
    return x * g[:, None]


def presenca(voz, limiar_db=-40.0, ataque=0.05, solta=0.42):
    """De 0 a 1: há fala neste instante? Sobe depressa quando a voz entra e desce devagar quando ela para."""
    h = int(0.02 * SR)
    mono = voz.mean(1)
    rms = np.sqrt(signal.fftconvolve(mono ** 2, np.ones(h) / h, mode='same').clip(0))
    tem = (20 * np.log10(rms + 1e-9) > limiar_db).astype(float)
    a_at, a_so = np.exp(-1 / (ataque * SR)), np.exp(-1 / (solta * SR))
    out = np.empty(len(tem))
    e = 0.0
    for i, v in enumerate(tem):
        e = a_at * e + (1 - a_at) * v if v > e else a_so * e + (1 - a_so) * v
        out[i] = e
    return out


def monta(n):
    T = Tempo(n)
    total = int(round(T.dur * SR))
    spec = partitura.SHORTS[n](T)
    print(f'Short {n}: {T.dur:.2f} s ({T.q(T.fim)} quadros), {len(spec["efeitos"])} efeitos')

    # ---- a voz ----
    voz = le(RAIZ / 'originais' / f'narracao-{n}.mp3', ini=T.corte)
    voz = voz[:total]
    voz = np.pad(voz, ((0, total - len(voz)), (0, 0)))
    voz = signal.sosfilt(signal.butter(2, 70, btype='high', fs=SR, output='sos'), voz, axis=0)
    voz = compressor(voz)
    lufs, _ = medir(voz)
    voz *= 10 ** ((spec.get('voz_lufs', -15.6) - lufs) / 20)
    voz = limitador(voz, teto=10 ** (-2.0 / 20))
    print('  voz: %.1f LUFS -> %.1f LUFS' % (lufs, medir(voz)[0]))

    # ---- a música ----
    mus = le(RAIZ / 'originais' / 'musica.mp3', ini=spec['musica_ini'], dur=T.dur + 1)[:total]
    mus = np.pad(mus, ((0, total - len(mus)), (0, 0)))
    # abre espaço para a voz: menos grave e um vale na região da fala
    grave = signal.sosfilt(signal.butter(2, 140, btype='low', fs=SR, output='sos'), mus, axis=0)
    fala = signal.sosfilt(signal.butter(2, [1700, 4200], btype='band', fs=SR, output='sos'), mus, axis=0)
    mus = mus - 0.32 * grave - 0.3 * fala
    pres = presenca(voz)
    ganho_db = spec.get('musica_db', -13.0) + (1 - pres) * spec.get('musica_pausa_db', 5.0)
    t = np.arange(total) / SR
    env = 10 ** (ganho_db / 20)
    # trechos em que a partitura muda o volume da música: (início, fim, dB, rampa de entrada, rampa de saída)
    for ini, fim, db, r_in, r_out in spec.get('musica_trechos', []):
        w = np.clip((t - ini) / max(r_in, 1e-3), 0, 1) * np.clip((fim - t) / max(r_out, 1e-3), 0, 1)
        env *= 10 ** (db * w / 20)
    env *= np.clip(t / 0.04, 0, 1) * np.clip((T.dur - t) / spec.get('musica_fim', 0.6), 0, 1)
    mus *= env[:, None]

    # ---- os efeitos ----
    sfx = np.zeros((total, 2))
    for ef in spec['efeitos']:
        quando, nome, db = ef[0], ef[1], ef[2]
        extra = dict(ef[3]) if len(ef) > 3 else {}
        pos = extra.pop('pos', None)
        some = extra.pop('some', None)          # corta o som com uma rampa, nesta duração
        som = fx.estereo(fx.EFEITOS[nome](**extra))
        if pos is not None:
            mono = som.mean(1) * 1.2
            som = fx.estereo(mono, pos)
        if some:
            k = min(len(som), int(some * SR))
            som = fx.fecha(som[:k], min(0.25, some / 2))
        som = som * 10 ** (db / 20)
        i = int(round(max(0.0, quando) * SR))
        m = min(len(som), total - i)
        if m > 0:
            sfx[i:i + m] += som[:m]

    # ---- a soma ----
    mix = voz + mus + sfx
    mix = limitador(mix)
    lufs, pico = medir(mix)
    mix *= 10 ** ((ALVO_LUFS - lufs) / 20)
    mix = limitador(mix)
    lufs2, pico2 = medir(mix)
    if abs(lufs2 - ALVO_LUFS) > 0.25:      # o limitador tirou volume: mais um passo
        mix *= 10 ** ((ALVO_LUFS - lufs2) / 20)
        mix = limitador(mix)
        lufs2, pico2 = medir(mix)
    destino = RAIZ / 'public' / 'audio' / f'short{n}.wav'
    destino.parent.mkdir(parents=True, exist_ok=True)
    grava(destino, mix)
    print('  mixagem: %.1f LUFS, pico %.1f dBTP -> %s' % (lufs2, pico2, destino.relative_to(RAIZ)))

    # ---- conferência: o volume de cada parte, segundo a segundo ----
    def db(x, a, b):
        return 20 * np.log10(np.sqrt((x[a:b] ** 2).mean()) + 1e-9)
    if '--tabela' in sys.argv:
        print('   s    voz  música efeitos')
        for s in range(0, int(T.dur) + 1):
            a, b = s * SR, min(total, (s + 1) * SR)
            if b > a:
                print('  %3d  %5.1f  %5.1f  %5.1f' % (s, db(voz, a, b), db(mus, a, b), db(sfx, a, b)))
    return T


if __name__ == '__main__':
    for arg in sys.argv[1:]:
        if arg.isdigit():
            monta(int(arg))

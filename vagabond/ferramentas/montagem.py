#!/usr/bin/env python3
"""
A montagem do Vagabond: folhas, camadas e planos, amarrados à narração.

Este arquivo é a fonte da verdade da imagem. Ele trata cada peça (sumi.py),
compõe a tipografia, gera os campos de chegada e escreve
src/data/montagem.json, que o Remotion só compõe.

  folha   uma folha de washi com tom e camadas de tinta. Camada = peça
          tratada, linha de texto ou traço de pincel, numa posição da folha
          (px de quadro), com o frame em que a tinta encosta.
  plano   um intervalo de frames olhando uma folha: câmera em linha reta do
          começo ao fim (empurrão ou deriva lateral, velocidade constante).
          Os planos se encostam: troca de plano é corte seco.

Uso: python3 -I ferramentas/montagem.py [--so A,B] (blocos)  -> public/ + src/data/montagem.json
"""
import hashlib
import json
import os
import subprocess
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sumi as S  # noqa: E402

RAIZ = S.RAIZ
PUB = os.path.join(RAIZ, 'public')
ORI = os.path.join(RAIZ, 'originais')
K = S.K
FPS = 30
FRAMES = 16538
W, H = 1920, 1080

TOM = {
    'limpo': None,
    'washi': [round(a / b, 4) for a, b in zip(S.WASHI, S.WASHI_LIMPO)],
    'velho': [round(a / b, 4) for a, b in zip(S.WASHI_VELHO, S.WASHI_LIMPO)],
}
TINTA = {'sumi': S.k_sumi(), 'vermelhao': S.k_de(S.VERMELHAO)}
for i, c in enumerate(S.SUMI_PASSOS):
    TINTA[f'sumi{i}'] = S.k_de(c)

# --------------------------------------------------------------------- #
#  TEMPO: a narração manda                                               #
# --------------------------------------------------------------------- #
PALAVRAS = json.load(open(os.path.join(RAIZ, 'src/data/palavras.json'), encoding='utf-8'))


def _norm(p):
    import unicodedata
    p = unicodedata.normalize('NFD', p.lower())
    return ''.join(c for c in p if c.isalnum() and not unicodedata.combining(c))


def w(palavra, depois=0):
    """Frame em que a palavra começa a ser dita (a primeira depois de `depois`)."""
    alvo = _norm(palavra)
    for f, p in PALAVRAS:
        if f >= depois and _norm(p).startswith(alvo):
            return int(round(f))
    raise KeyError(f'palavra {palavra!r} não encontrada depois de {depois}')


_db = None


def _energia():
    global _db
    if _db is None:
        sr = 48000
        x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(PUB, 'audio/vag-narracao.mp3'),
                                          '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'],
                                         capture_output=True, check=True).stdout, np.float32)
        jn = sr // 100
        n = len(x) // jn
        db = 20 * np.log10(np.sqrt((x[:n * jn].reshape(n, jn) ** 2).mean(1)) + 1e-9)
        _db = db > np.percentile(db, 95) - 30
    return _db


def corte(marca, folga=24):
    """Onde cortar perto de uma marca do AUDIO.md: dentro da pausa real mais
    próxima, 3 frames antes da fala voltar (a imagem chega um tico antes da
    voz). Pausa = 150 ms ou mais sem fala."""
    fala = _energia()
    melhor = None
    a = max(0, int((marca - folga) / 0.3))
    b = min(len(fala) - 1, int((marca + folga) / 0.3))
    i = a
    while i <= b:
        if not fala[i]:
            j = i
            while j < len(fala) and not fala[j]:
                j += 1
            if j - i >= 15:
                ini, fim = i * 0.3, j * 0.3
                alvo = max(ini, fim - 3)
                if melhor is None or abs(alvo - marca) < abs(melhor - marca):
                    melhor = alvo
            i = j
        i += 1
    return int(round(melhor if melhor is not None else marca))


# --------------------------------------------------------------------- #
#  MATERIAL                                                              #
# --------------------------------------------------------------------- #
INDICE_ARQ = os.path.join(PUB, 'pecas', '.indice.json')
INDICE = json.load(open(INDICE_ARQ)) if os.path.exists(INDICE_ARQ) else {}


def _chave(*partes):
    return hashlib.sha1(json.dumps(partes, sort_keys=True, default=str).encode()).hexdigest()[:12]


def _feito(chave, arquivos):
    return INDICE.get(chave) == arquivos and all(os.path.exists(os.path.join(PUB, a)) for a in arquivos)


def papel_e_fibra():
    """O washi periódico (um ladrilho) e a fibra fina da frente da tinta."""
    pw, ph = 2800, 1580
    arq = 'papel/washi.jpg'
    ch = _chave('papel', pw, ph, S.GRAO, S.WASHI_LIMPO)
    if not _feito(ch, [arq]):
        p = S.papel(pw, ph, semente=1)
        os.makedirs(os.path.join(PUB, 'papel'), exist_ok=True)
        Image.fromarray(np.clip(np.round(p), 0, 255).astype(np.uint8)).save(os.path.join(PUB, arq), quality=93,
                                                                          subsampling=0)
        INDICE[ch] = [arq]
    fib = 'campos/fibra.png'
    chf = _chave('fibra', 1024)
    if not _feito(chf, [fib]):
        os.makedirs(os.path.join(PUB, 'campos'), exist_ok=True)
        S.fibra_fina(1024).save(os.path.join(PUB, fib), optimize=True)
        INDICE[chf] = [fib]
    return dict(src=arq, w=round(pw / K, 3), h=round(ph / K, 3)), dict(src=fib, lado=1024)


def _material(nome, cob=None, T=None, Tc=None, png=False):
    """Salva a transmitância de uma camada (e a versão colorida)."""
    ext = 'png' if png else 'jpg'
    a = f'pecas/{nome}.{ext}'
    S.salvar_t(T, os.path.join(PUB, a))
    out = [a]
    if Tc is not None:
        b = f'pecas/{nome}-cor.jpg'
        S.salvar_t(Tc, os.path.join(PUB, b))
        out.append(b)
    return out


def _campo(nome, cob, entradas, semente, atrai=1.4, fibra=1.0, janela=None):
    h, wd = cob.shape
    t = S.campo(h, wd, entradas, semente, cob=cob, atrai=atrai, fibra=fibra, janela=janela)
    arq = f'campos/{nome}.png'
    S.salvar_campo(t, os.path.join(PUB, arq))
    return arq


def _centro_da_tinta(cob):
    ys, xs = np.mgrid[0:cob.shape[0], 0:cob.shape[1]]
    p = cob ** 2 + 1e-9
    return float((xs * p).sum() / p.sum() / cob.shape[1]), float((ys * p).sum() / p.sum() / cob.shape[0])


# --------------------------------------------------------------------- #
#  FOLHA                                                                 #
# --------------------------------------------------------------------- #
class Folha:
    def __init__(self, mont, id, tom='washi'):
        self.m, self.id, self.tom = mont, id, tom
        sem = int(hashlib.sha1(id.encode()).hexdigest()[:6], 16)
        self.ox, self.oy = sem % 2100, (sem >> 11) % 1185
        self.camadas = []

    def _camada(self, nome, arqs, x, y, wd, ht, iw, ih, chega, campo, borda, plano):
        c = dict(id=f'{self.id}-{nome}', src=arqs[0], x=round(x, 2), y=round(y, 2), w=round(wd, 2), h=round(ht, 2),
                 iw=iw, ih=ih)
        if len(arqs) > 1:
            c['cor'] = arqs[1]
        if chega is not None:
            c['chega'] = [int(chega[0]), int(chega[1])]
            c['campo'] = campo
            c['borda'] = borda
        if plano:
            c['plano'] = plano
        self.camadas.append(c)
        return c

    # -- peça (imagem) ------------------------------------------------- #
    def peca(self, nome, src, x, y, wd=None, ht=None, tipo='sumi', recorte=None, apagar=None, chega=None,
             entradas=None, borda=0.22, plano=None, semente=3, mascara=None, res=1.0, janela=None, clonar=None,
             buraco=None, alfa=None, **trat):
        """Uma peça tratada na folha. `wd`/`ht` em px de quadro (um dos dois);
        `chega` = (frame, duração) ou None (já está na folha). `res` > 1 guarda
        o material mais fino que o 1440p (para plano fechado sem amolecer).
        `mascara`: (nome, função (iw, ih) -> 0..1) que recorta a peça.
        Profundidade: `buraco` = (nome, função (iw, ih) -> bool) tapa o que
        um plano da frente cobre (tapar()); `alfa` = (nome, função (iw, ih)
        -> 0..1) faz desta camada um recorte opaco, com papel próprio, para
        um plano da frente."""
        im0 = S.abrir(os.path.join(ORI, src), recorte=recorte, apagar=apagar, clonar=clonar)
        if wd is None:
            wd = ht * im0.width / im0.height
        ht = wd * im0.height / im0.width
        iw, ih = int(round(wd * K * res)), int(round(ht * K * res))
        ch = _chave('peca', src, recorte, apagar, clonar, iw, ih, tipo, semente, trat, mascara[0] if mascara else None,
                    buraco[0] if buraco else None)
        base = f'{self.id}-{nome}'
        arqs = INDICE.get(ch)
        cob = None
        if not (arqs and all(os.path.exists(os.path.join(PUB, a)) for a in arqs)):
            im = im0.resize((iw, ih), Image.LANCZOS)
            if tipo == 'sumi':
                cob = S.sumi_cobertura(im, semente=semente, **trat)
                if mascara is not None:
                    cob = cob * mascara[1](iw, ih)
                arqs = _material(ch, T=S.transmitancia(cob, S.k_sumi()))
            else:
                Tc, Tm = S.cor_tinta(im, **trat)
                if mascara is not None:
                    mk = mascara[1](iw, ih)[..., None]
                    Tc, Tm = 1 - (1 - Tc) * mk, 1 - (1 - Tm) * mk
                if buraco is not None:
                    bu = buraco[1](iw, ih)
                    Tc, Tm = S.tapar(Tc, bu), S.tapar(Tm, bu)
                arqs = _material(ch, T=Tm, Tc=Tc)
            INDICE[ch] = arqs
        campo = None
        if chega is not None:
            chc = _chave('campo', ch, entradas, semente, janela)
            campo = f'campos/{chc}.png'
            if not os.path.exists(os.path.join(PUB, campo)):
                if cob is None:
                    T = np.asarray(Image.open(os.path.join(PUB, arqs[0])).convert('L'), float) / 255
                    cob = np.clip((1 - T) / (1 - S.k_sumi().mean()), 0, 1)
                ent = entradas or [_centro_da_tinta(cob)]
                _campo(chc, cob, ent, semente, janela=janela)
        c = self._camada(nome, arqs, x, y, wd, ht, iw, ih, chega, campo, borda, plano)
        if alfa is not None:
            cha = _chave('alfa', alfa[0], iw, ih)
            arq = f'pecas/{cha}-alfa.png'
            if not os.path.exists(os.path.join(PUB, arq)):
                a = np.clip(alfa[1](iw, ih), 0, 1)
                rgba = np.zeros((ih, iw, 4), np.uint8)
                rgba[..., 3] = np.round(a * 255).astype(np.uint8)
                Image.fromarray(rgba, 'RGBA').save(os.path.join(PUB, arq), optimize=True)
            c['alfa'] = arq
        return c

    # -- tipo ---------------------------------------------------------- #
    def texto(self, nome, linhas, x, y, tinta='sumi', chega=None, entradas=None, borda=0.22, ancora='esq',
              entrelinha=None, semente=5, plano=None, res=1.5):
        """Linhas de tipo, empilhadas pela tinta medida (caixa_tinta), nunca
        por passo fixo. `linhas`: [(texto, fonte, corpo_em_px_de_quadro,
        tracking)]. (x, y) em px de quadro: x = origem da linha (esquerda,
        centro ou direita do avanço, pela âncora); y = topo da caixa-alta da
        primeira linha. Assim duas camadas com o mesmo y alinham pela letra,
        não pelo acento nem pela haste."""
        KT = K * res
        lin = [(t, f, c * KT, tr) for t, f, c, tr in linhas]
        ch = _chave('texto', lin, tinta, ancora, entrelinha, semente)
        larg = max(S.largura(t, S.fonte(f, c), tr) for t, f, c, tr in lin)
        pad = int(max(c for _, _, c, _ in lin) * 0.9)
        alt_tot = int(sum(c * 1.6 for _, _, c, _ in lin)) + 2 * pad
        lar_tot = int(larg) + 2 * pad
        chapa = Image.new('L', (lar_tot, alt_tot), 0)
        yy = pad
        topo_tinta = None
        for i, (t, f, c, tr) in enumerate(lin):
            fnt = S.fonte(f, c)
            tb = S.tinta_de(t, f, c, tr)
            hb = S.tinta_de('H', f, c)
            # a linha assenta pela caixa-alta (ritmo regular); o acento sobe
            # acima dela e nunca chega a menos de 0,12 corpo da tinta de cima
            alvo = yy - hb[1]
            if topo_tinta is not None:
                alvo = max(alvo, topo_tinta + 0.12 * c - tb[1])
            lw = S.largura(t, fnt, tr)
            xx = pad + {'esq': 0, 'centro': (larg - lw) / 2, 'dir': larg - lw}[ancora]
            S.linha(chapa, t, fnt, xx, alvo, tracking=tr)
            topo_tinta = S.caixa_tinta(chapa)[3]
            gap = entrelinha * KT if entrelinha is not None else 0.42 * c
            # a próxima caixa-alta começa abaixo da base desta (pela linha
            # de base, não pela descendente)
            yy = alvo + hb[3] + gap
        cx = S.caixa_tinta(chapa)
        m = int(6 * KT)
        x0, y0 = max(0, cx[0] - m), max(0, cx[1] - m)
        x1, y1 = min(lar_tot, cx[2] + m), min(alt_tot, cx[3] + m)
        ref_x = pad + {'esq': 0, 'centro': larg / 2, 'dir': larg}[ancora]
        px = x - (ref_x - x0) / KT
        py = y - (pad - y0) / KT
        iw, ih = x1 - x0, y1 - y0
        arqs = INDICE.get(ch)
        if not (arqs and all(os.path.exists(os.path.join(PUB, a)) for a in arqs)):
            cob = S.tipo_em_tinta(chapa.crop((x0, y0, x1, y1)), semente=semente, escala=res)
            arqs = _material(ch, T=S.transmitancia(cob, TINTA[tinta]), png=True)
            INDICE[ch] = arqs
        campo = None
        if chega is not None:
            if entradas is None:
                # a tinta brota em dois ou três pontos da linha ao mesmo
                # tempo: nunca da esquerda para a direita (seria letra por
                # letra, que o briefing proíbe)
                g = np.random.default_rng(semente + len(nome))
                n = 1 if iw < 3.2 * ih else (2 if iw < 7 * ih else 3)
                xs = (np.arange(n) + 0.5) / n + g.uniform(-0.12, 0.12, n) / n
                entradas = [(float(np.clip(v, 0.05, 0.95)), float(g.uniform(0.45, 0.7))) for v in xs]
            chc = _chave('campo-t', ch, entradas, semente)
            campo = f'campos/{chc}.png'
            if not os.path.exists(os.path.join(PUB, campo)):
                T = np.asarray(Image.open(os.path.join(PUB, arqs[0])).convert('L'), float) / 255
                cob = np.clip((1 - T) * 3, 0, 1)
                _campo(chc, cob, entradas, semente, atrai=1.8)
        return self._camada(nome, arqs, px, py, iw / KT, ih / KT, iw, ih, chega, campo, borda, plano)

    # -- carimbo ------------------------------------------------------ #
    def carimbo(self, nome, linhas, x, y, wd, ht, quando, semente=7, giro=-2.4):
        """O hanko cai em `quando`: escala 1,05 -> 1,0 e a tinta subindo em 7
        frames, torto como todo carimbo. `linhas`: [(texto, corpo px de quadro)]."""
        iw, ih = int(round(wd * K)), int(round(ht * K))
        ch = _chave('selo', linhas, iw, ih, semente)
        arqs = INDICE.get(ch)
        if not (arqs and all(os.path.exists(os.path.join(PUB, a)) for a in arqs)):
            cob = S.selo(iw, ih, [(t, c * K) for t, c in linhas], semente=semente)
            arqs = _material(ch, T=S.transmitancia(cob, TINTA['vermelhao']), png=True)
            INDICE[ch] = arqs
        c = self._camada(nome, arqs, x, y, wd, ht, iw, ih, None, None, None, None)
        c['carimbo'] = [int(quando), giro]
        return c

    # -- pincel -------------------------------------------------------- #
    def traco(self, nome, pontos, espessura, seco=0.5, tinta='sumi', chega=None, borda=0.24, semente=7,
              plano=None, res=1.5):
        """Traço de pincel gerado (sempre com kasure). Pontos em px de quadro."""
        pts = np.asarray(pontos, float)
        m = espessura * 2 + 8
        x0, y0 = pts.min(0) - m
        x1, y1 = pts.max(0) + m
        KT = K * res
        iw, ih = int(round((x1 - x0) * KT)), int(round((y1 - y0) * KT))
        ch = _chave('traco', pontos, espessura, seco, tinta, semente, res)
        arqs = INDICE.get(ch)
        if not (arqs and all(os.path.exists(os.path.join(PUB, a)) for a in arqs)):
            cob = S.pincelada(iw, ih, (pts - [x0, y0]) * KT, espessura * KT, semente=semente, seco=seco, escala=res)
            arqs = _material(ch, T=S.transmitancia(cob, TINTA[tinta]), png=True)
            INDICE[ch] = arqs
        campo = None
        if chega is not None:
            chc = _chave('campo-p', ch, semente)
            campo = f'campos/{chc}.png'
            if not os.path.exists(os.path.join(PUB, campo)):
                T = np.asarray(Image.open(os.path.join(PUB, arqs[0])).convert('L'), float) / 255
                cob = np.clip((1 - T) * 3, 0, 1)
                e = (pts[0] - [x0, y0]) / [x1 - x0, y1 - y0]
                _campo(chc, cob, [tuple(e)], semente, atrai=2.4)
        return self._camada(nome, arqs, x0, y0, x1 - x0, y1 - y0, iw, ih, chega, campo, borda, plano)


# --------------------------------------------------------------------- #
#  MONTAGEM                                                              #
# --------------------------------------------------------------------- #
class Montagem:
    def __init__(self):
        self.folhas = {}
        self.planos = []

    def folha(self, id, tom='washi'):
        assert id not in self.folhas, f'folha {id} repetida'
        f = Folha(self, id, tom)
        self.folhas[id] = f
        return f

    def plano(self, de, ate, folha, cam_de, cam_ate=None, px=None, clip=None, nota=''):
        """`px`: {plano: [ganho de escala, deriva em fração da largura, subida
        em px]} ao longo do plano; o primeiro é o fundo. `clip`: retângulo da
        folha (o da peça) fora do qual os planos da frente não aparecem."""
        cam_ate = cam_ate or cam_de
        if px:
            for nome, v in px.items():
                g, d = v[0], v[1]
                s0, s1 = cam_de[0], cam_ate[0]
                assert (s1 / s0) * (1 + g) <= 1.13 + 1e-9, f'{nome}: ganho total acima de 13%'
                assert abs(d) < 0.035, f'{nome}: deriva acima de 3,5% da largura'
        self.planos.append(dict(de=int(de), ate=int(ate), folha=folha.id if isinstance(folha, Folha) else folha,
                                cam=[[round(v, 5) for v in cam_de], [round(v, 5) for v in cam_ate]],
                                **({'px': px} if px else {}), **({'clip': clip} if clip else {}),
                                **({'nota': nota} if nota else {})))

    def escrever(self, papel, fibra, partitura):
        planos = sorted(self.planos, key=lambda p: p['de'])
        for a, b in zip(planos[:-1], planos[1:]):
            assert a['ate'] == b['de'], f"buraco ou sobreposição entre {a['de']}-{a['ate']} e {b['de']}-{b['ate']}"
        assert planos[0]['de'] == 0 and planos[-1]['ate'] == FRAMES, (planos[0]['de'], planos[-1]['ate'])
        # o papel de cada folha cobre tudo que os planos dela mostram
        folhas = {}
        for fid, f in self.folhas.items():
            vis = []
            for p in planos:
                if p['folha'] != fid:
                    continue
                for s, cx, cy in p['cam']:
                    vis.append((cx - 960 / s, cy - 540 / s, cx + 960 / s, cy + 540 / s))
            if not vis:
                continue
            v = np.array(vis)
            caixa = [float(v[:, 0].min() - 80), float(v[:, 1].min() - 80), float(v[:, 2].max() + 80),
                     float(v[:, 3].max() + 80)]
            folhas[fid] = dict(tom=TOM[f.tom], ox=f.ox, oy=f.oy, caixa=[round(c, 1) for c in caixa],
                               camadas=f.camadas)
        out = dict(fps=FPS, frames=FRAMES, K=K, papel=papel, fibra=fibra, partitura=partitura, folhas=folhas,
                   planos=planos)
        json.dump(out, open(os.path.join(RAIZ, 'src/data/montagem.json'), 'w'), ensure_ascii=False, indent=1)
        json.dump(INDICE, open(INDICE_ARQ, 'w'), indent=0)
        print(f'{len(planos)} planos, {len(folhas)} folhas, '
              f'{sum(len(f["camadas"]) for f in folhas.values())} camadas')


# --------------------------------------------------------------------- #
#  CÂMERA PACIENTE                                                       #
# --------------------------------------------------------------------- #
def empurra(s0, cx, cy, frames, taxa=0.0050):
    """Empurrão a velocidade constante: ~0,5% por segundo (4 a 7% em 8 a 14
    s). Nunca passa de 7% no plano."""
    s1 = s0 * (1 + min(0.07, taxa * frames / FPS))
    return [s0, cx, cy], [s1, cx, cy]


def deriva(s, cx0, cx1, cy):
    """Deriva lateral lenta. Nunca diagonal."""
    return [s, cx0, cy], [s, cx1, cy]


def parado(s, cx, cy):
    return [s, cx, cy], [s, cx, cy]


def empurra_para(s0, s1, c0, p):
    """Empurrão ancorado num ponto `p` da folha (ele fica parado na tela):
    o centro da câmera anda em direção a ele na proporção da escala."""
    (cx0, cy0), (px, py) = c0, p
    return [s0, cx0, cy0], [s1, px - (px - cx0) * s0 / s1, py - (py - cy0) * s0 / s1]


def borda_suave(frac=0.04):
    """Máscara que some com a peça nas bordas (o papel da peça vira o nosso
    sem desenhar retângulo)."""
    def f(iw, ih):
        m = frac * min(iw, ih)
        x = np.minimum(np.arange(iw), np.arange(iw)[::-1]) / m
        y = np.minimum(np.arange(ih), np.arange(ih)[::-1]) / m
        return np.clip(np.minimum(y[:, None], x[None, :]), 0, 1) ** 1.5
    return (f'borda{frac}', f)


def borda_tinta(frac=0.012, semente=5):
    """Borda de peça impressa a pincel: o papel come a borda de forma
    irregular, como no carimbo. Sem degradê (degradê é desfoque)."""
    def f(iw, ih):
        yy, xx = np.mgrid[0:ih, 0:iw]
        d = np.minimum.reduce([xx, yy, iw - 1 - xx, ih - 1 - yy]).astype(float)
        ru = S.ruido(ih, iw, 6 * K, semente) * 0.6 + S.ruido(ih, iw, 1.5 * K, semente + 1) * 0.4
        m = frac * min(iw, ih)
        return np.clip((d - m * (0.5 + 0.35 * ru)) / (1.2 * K), 0, 1)
    return (f'tinta{frac}-{semente}', f)


def altura(texto, fonte, corpo, tracking=0.0):
    """(topo, base) da tinta de uma linha em px de quadro, a partir da origem."""
    x0, y0, x1, y1 = S.tinta_de(texto, fonte, corpo * K, tracking)
    return y0 / K, y1 / K


def caixa_alta(fonte, corpo):
    """Altura da caixa-alta (tinta do H) em px de quadro."""
    x0, y0, x1, y1 = S.tinta_de('H', fonte, corpo * K)
    return (y1 - y0) / K


def avanco(texto, fonte, corpo, tracking=0.0):
    """Largura de avanço da linha em px de quadro."""
    return S.largura(texto, S.fonte(fonte, corpo * K), tracking) / K


def largura_tinta(texto, fonte, corpo, tracking=0.0):
    x0, y0, x1, y1 = S.tinta_de(texto, fonte, corpo * K, tracking)
    return (x1 - x0) / K

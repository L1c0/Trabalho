#!/usr/bin/env python3
"""
Pincel, não prensa.

O Vinland simulava tinta empurrada contra papel. Aqui a tinta CHEGA: entra
no papel úmido e anda pela fibra. Este módulo faz as três coisas físicas
que o vídeo precisa, e nada mais:

  papel    -> washi: tom irregular, fibra, grão, fios de kozo soltos
  tinta    -> o que encosta no papel, como TRANSMITÂNCIA (1 = papel limpo).
              O Remotion multiplica a tinta sobre o papel, então papel e
              tinta andam juntos debaixo da câmera e o grão nunca é filtro
              de tela.
  chegada  -> o campo t(x,y) da tinta se espalhando a partir de um ponto
              de entrada: distância geodésica com o custo modulado pela
              fibra. No quadro T, tinta = t < T, e a borda |t - T| < w
              escurece (pigmento acumula na frente do avanço).

Todo material sai na escala de 1440p (K = 4/3 px por px de quadro): o
Remotion compõe em 1920x1080 e o master renderiza com --scale=4/3 sem
ampliar nada.
"""
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.normpath(os.path.join(AQUI, '..'))
FONTES = os.path.join(RAIZ, 'fontes')
K = 4 / 3

WASHI_LIMPO = (0xE8, 0xE4, 0xDA)
WASHI = (0xE3, 0xDF, 0xD5)
WASHI_VELHO = (0xD9, 0xD4, 0xC6)
SUMI = (0x1A, 0x17, 0x14)
VERMELHAO = (0x9E, 0x3B, 0x2E)
# sumi diluído em cinco passos, do cheio até #BDB8AE
SUMI_PASSOS = [tuple(int(round(a + (b - a) * i / 4)) for a, b in zip(SUMI, (0xBD, 0xB8, 0xAE)))
               for i in range(5)]


# ===================================================================== #
#  RUÍDO PERIÓDICO                                                      #
# ===================================================================== #
def ruido(H, W, sigma, semente, angulo=0.0):
    """Ruído gaussiano filtrado no domínio da frequência, então PERIÓDICO:
    a folha pode ser ladrilhada sem costura. `sigma` = (ao longo, através)
    da fibra em px; `angulo` em graus. Sai com média 0 e desvio 1."""
    g = np.random.default_rng(semente)
    n = g.standard_normal((H, W))
    fy = np.fft.fftfreq(H)[:, None]
    fx = np.fft.fftfreq(W)[None, :]
    if np.isscalar(sigma):
        s_along = s_across = float(sigma)
    else:
        s_along, s_across = sigma
    a = np.deg2rad(angulo)
    u = fx * np.cos(a) + fy * np.sin(a)
    v = -fx * np.sin(a) + fy * np.cos(a)
    filtro = np.exp(-2 * np.pi ** 2 * ((u * s_along) ** 2 + (v * s_across) ** 2))
    r = np.real(np.fft.ifft2(np.fft.fft2(n) * filtro))
    return (r - r.mean()) / (r.std() + 1e-12)


# ===================================================================== #
#  PAPEL                                                                #
# ===================================================================== #
# grão calibrado: desvio local 5x5 numa área lisa, medido no master 1440p
# já comprimido (CRF 16), alvo da casa 6 a 8. O navegador filtra o ladrilho
# (a escala 4/3 e o empurrão põem o papel em fração de pixel): o grão que
# sai na tela é ~0,75 do que está no arquivo, então o arquivo mede ~9.
GRAO = dict(nuvem=2.6, mancha=2.0, fibra=7.0, fibra2=4.2, fino=9.6, kozo=5.0)


def papel(W, H, tom=WASHI_LIMPO, semente=0, grao=None):
    """Washi periódico (ladrilhável). Nunca de tom chapado.

    nuvem   a folha não secou igual (escala de centenas de px)
    mancha  polpa mal distribuída
    fibra   duas famílias de fibra curta, uma quase horizontal (a tela de
            secagem) e outra cruzada, mais fraca
    fino    o que sobra
    kozo    fios longos e soltos, mais claros que a massa, poucos
    """
    p = dict(GRAO, **(grao or {}))
    base = np.zeros((H, W))
    base += ruido(H, W, 260, semente + 1) * p['nuvem']
    base += ruido(H, W, 28, semente + 2) * p['mancha']
    base += ruido(H, W, (3.6, 0.7), semente + 3, angulo=4) * p['fibra']
    base += ruido(H, W, (2.8, 0.6), semente + 4, angulo=-37) * p['fibra2']
    base += np.random.default_rng(semente + 5).standard_normal((H, W)) * p['fino']
    base += _kozo(H, W, semente + 6) * p['kozo']
    out = np.array(tom, float)[None, None, :] + base[..., None]
    return np.clip(out, 0, 255)


def _kozo(H, W, semente):
    """Fios de kozo: curvas finas e longas, um pouco mais claras que a
    massa. Desenhadas numa folha com margem e dobradas de volta, para o
    papel continuar periódico."""
    g = np.random.default_rng(semente)
    m = 220
    im = Image.new('L', (W + 2 * m, H + 2 * m), 0)
    d = ImageDraw.Draw(im)
    n = int(W * H / 90000)
    for _ in range(n):
        x, y = g.uniform(m, W + m), g.uniform(m, H + m)
        ang = g.uniform(0, np.pi)
        comp = g.uniform(40, 210)
        curva = g.normal(0, 0.006)
        pts = []
        for k in range(24):
            s = comp * k / 23
            a = ang + curva * s
            pts.append((x + s * np.cos(a), y + s * np.sin(a)))
        intensidade = int(g.uniform(70, 255))
        d.line(pts, fill=intensidade, width=1)
    a = np.asarray(im, float) / 255
    a = ndimage.gaussian_filter(a, 0.55)
    # dobra a margem de volta (periódico)
    out = a[m:m + H, m:m + W].copy()
    out[:, :m] += a[m:m + H, W + m:]
    out[:, W - m:] += a[m:m + H, :m]
    out[:m, :] += a[H + m:, m:m + W]
    out[H - m:, :] += a[:m, m:m + W]
    out[:m, :m] += a[H + m:, W + m:]
    out[:m, W - m:] += a[H + m:, :m]
    out[H - m:, :m] += a[:m, W + m:]
    out[H - m:, W - m:] += a[:m, :m]
    return np.clip(out, 0, 1.4)


def medir_grao(arr, caixa=None):
    """Desvio local 5x5 numa região lisa. Alvo da casa: 6 a 8."""
    a = np.asarray(arr, float)
    if a.ndim == 3:
        a = a[..., 0] * 0.299 + a[..., 1] * 0.587 + a[..., 2] * 0.114
    if caixa:
        y0, y1, x0, x1 = caixa
        a = a[y0:y1, x0:x1]
    return float(np.std(a - ndimage.uniform_filter(a, 5)))


# ===================================================================== #
#  TINTA                                                                #
# ===================================================================== #
LUM = np.array([0.299, 0.587, 0.114])


def k_sumi():
    """Transmitância do sumi cheio sobre o washi limpo, por canal."""
    return np.array(SUMI, float) / np.array(WASHI_LIMPO, float)


def k_de(cor):
    """Transmitância de uma tinta qualquer (vermelhão, sumi diluído)."""
    return np.clip(np.array(cor, float) / np.array(WASHI_LIMPO, float), 0, 1)


def abrir(src, recorte=None, apagar=None, clonar=None, modo='RGB'):
    """Abre a peça original. `apagar`: retângulos (x0, y0, x1, y1) ou
    polígonos [(x, y), ...] em px da original que voltam a ser papel (balão
    esvaziado, marca d'água). `clonar`: (x0, y0, x1, y1, dx, dy) cobre o
    retângulo com o desenho que está (dx, dy) ao lado (letra em inglês por
    cima de hachura). `recorte`: (x0, y0, x1, y1) em px."""
    im = Image.open(src).convert('RGB')
    for x0, y0, x1, y1, dx, dy in (clonar or []):
        pedaco = im.crop((x0 + dx, y0 + dy, x1 + dx, y1 + dy))
        # borda macia: o remendo some na hachura em volta
        m = Image.new('L', pedaco.size, 0)
        ImageDraw.Draw(m).rectangle((3, 3, pedaco.width - 4, pedaco.height - 4), fill=255)
        from PIL import ImageFilter
        im.paste(pedaco, (x0, y0), m.filter(ImageFilter.GaussianBlur(2)))
    if apagar:
        a = np.asarray(im, float)
        for z in apagar:
            m = Image.new('L', im.size, 0)
            d = ImageDraw.Draw(m)
            if len(z) == 4 and not isinstance(z[0], (tuple, list)):
                d.rectangle(z, fill=255)
            else:
                d.polygon([tuple(p) for p in z], fill=255)
            mk = np.asarray(m) > 0
            # o papel em volta (anel de 14 px), não o branco geral da peça
            anel = ndimage.binary_dilation(mk, iterations=14) & ~mk
            cor = np.median(a[anel], axis=0) if anel.any() else np.percentile(a.reshape(-1, 3), 99, axis=0)
            a[mk] = cor
        im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    if recorte:
        im = im.crop(tuple(int(v) for v in recorte))
    return im.convert(modo)


def no_tamanho(im, larg=None, alt=None):
    if larg is None:
        larg = im.width * alt / im.height
    alt = im.height * larg / im.width
    return im.resize((max(1, int(round(larg))), max(1, int(round(alt)))), Image.LANCZOS)


def cobertura(a, branco_pct=97, preto_pct=3, branco=None, preto=None):
    """Pontos de branco e preto da PRÓPRIA peça, nunca contraste simétrico:
    contraste simétrico puxa o branco para cinza e desenha moldura."""
    hi = branco if branco is not None else np.percentile(a, branco_pct)
    lo = preto if preto is not None else np.percentile(a, preto_pct)
    return np.clip((hi - a) / max(hi - lo, 1e-6), 0, 1)


def achatar_papel(a, escala):
    """Divide a peça pelo papel dela: o tom do papel (estimado por um máximo
    robusto numa vizinhança de `escala` px) vira 1, então mancha, gradiente
    de luz e borda de foto somem e só a tinta fica."""
    f = max(1, int(escala // 24))
    p = a[::f, ::f]
    k = max(3, int(escala / f))
    fundo = ndimage.percentile_filter(p, 92, size=k, mode='nearest')
    fundo = ndimage.gaussian_filter(fundo, k / 3, mode='nearest')
    fundo = np.asarray(Image.fromarray(fundo.astype(np.float32), mode='F').resize(a.shape[::-1], Image.BICUBIC))
    return np.clip(a / np.maximum(fundo, 1e-3), 0, 1.2)


def sumi_cobertura(im, semente=3, branco_pct=97, preto_pct=3, branco=None, preto=None,
                   mordida=0.40, fibra=0.08, firmeza=0.35, gama=0.92, achatar=None):
    """Página de mangá (já no tamanho de saída) -> cobertura de sumi 0..1.

    firmeza  a borda do traço ampliado fica firme (resgate de resolução);
             só perto da borda, a aguada não é tocada
    fibra    a tinta assenta desigual, pela fibra
    mordida  a borda úmida do traço acumula pigmento
    """
    a = np.asarray(im.convert('L'), float) / 255
    if achatar:
        a = achatar_papel(a, achatar)
    cob = cobertura(a, branco_pct, preto_pct, branco, preto)
    H, W = cob.shape
    if firmeza:
        gy, gx = np.gradient(ndimage.gaussian_filter(cob, 0.8 * K))
        perto = np.clip(np.hypot(gy, gx) * 6, 0, 1)
        sig = 1 / (1 + np.exp(-(cob - 0.5) * 8))
        sig = (sig - 1 / (1 + np.exp(4))) / (1 / (1 + np.exp(-4)) - 1 / (1 + np.exp(4)))
        cob = cob * (1 - firmeza * perto) + sig * firmeza * perto
    fib = ruido(H, W, (3.2 * K, 0.9 * K), semente, angulo=4)
    borda = np.abs(ndimage.gaussian_filter(cob, 1.0 * K) - ndimage.gaussian_filter(cob, 2.6 * K))
    cob = np.clip(cob * (1 + fibra * fib * cob) + borda * mordida, 0, 1)
    return np.clip(cob, 0, 1) ** gama


def transmitancia(cob, k):
    """Cobertura 0..1 -> transmitância RGB (1 = papel limpo)."""
    return 1 - cob[..., None] * (1 - np.asarray(k, float))[None, None, :]


def cor_tinta(im, branco_pct=99.0, preto_pct=0.4, branco=None, preto=None, achatar=None):
    """Peça colorida (já no tamanho de saída) -> (T_cor, T_mono).

    O branco por canal sai do papel da própria peça (o papel envelhecido da
    gravura vira o nosso washi); o preto dela vira sumi cheio. T_mono tem a
    mesma luminância, no tom do sumi: é a peça com 0% de saturação. A
    partitura interpola as duas no Remotion."""
    a = np.asarray(im.convert('RGB'), float) / 255
    if achatar:
        # o papel da gravura não é uniforme (luz da foto, mancha, borda):
        # cada canal dividido pelo papel em volta
        a = np.stack([achatar_papel(a[..., k], achatar) for k in range(3)], axis=-1)
    w = np.percentile(a.reshape(-1, 3), branco_pct, axis=0) if branco is None else np.asarray(branco, float)
    t = np.clip(a / np.maximum(w, 1e-6)[None, None, :], 0, 1)
    lum = t @ LUM
    lo = np.percentile(lum, preto_pct) if preto is None else preto
    tl = np.clip((t - lo) / max(1 - lo, 1e-6), 0, 1)
    k = k_sumi()
    T_cor = k + (1 - k) * tl
    L = np.clip(tl @ LUM, 0, 1)
    T_mono = transmitancia(1 - L, k)
    return T_cor, T_mono


def salvar_t(T, caminho, q=95):
    """Transmitância em JPEG (4:4:4) ou PNG, pela extensão."""
    im = Image.fromarray(np.clip(np.round(np.asarray(T) * 255), 0, 255).astype(np.uint8))
    os.makedirs(os.path.dirname(caminho), exist_ok=True)
    if caminho.endswith('.png'):
        im.save(caminho, optimize=True)
    else:
        im.save(caminho, quality=q, subsampling=0)
    return im.size


# ===================================================================== #
#  CHEGADA                                                              #
# ===================================================================== #
def campo(H, W, entradas, semente, cob=None, fibra=1.0, atrai=1.4, escala=4, janela=None):
    """Campo de chegada t(x, y), 0..1, numa grade reduzida (1/escala).

    Distância geodésica a partir dos pontos de entrada (frações da camada),
    com o custo modulado por ruído de várias oitavas, alongado na direção da
    fibra: a tinta corre mais rápido em alguns caminhos. `atrai` deixa a
    tinta correr mais depressa por onde a peça tem tinta, então o traço
    escuro chega antes da aguada clara. `janela` (x0, y0, x1, y1, em fração):
    o ritmo é medido só pela tinta que o plano mostra (num plano fechado, o
    resto da peça chega fora de quadro e não pode roubar a duração)."""
    from skimage.graph import MCP_Geometric
    h, w = max(8, int(np.ceil(H / escala))), max(8, int(np.ceil(W / escala)))
    n = np.zeros((h, w))
    for i, (s, peso) in enumerate([(1.5, 0.35), (4, 0.6), (10, 0.8), (26, 0.6)]):
        n += ruido(h, w, (s * 1.8, s * 0.8), semente * 17 + i, angulo=4 + 25 * (i % 2)) * peso
    n /= n.std()
    custo = np.exp(fibra * n)
    if cob is not None:
        c = np.asarray(Image.fromarray((np.clip(cob, 0, 1) * 255).astype(np.uint8)).resize((w, h), Image.BOX),
                       float) / 255
        custo *= np.exp(-atrai * c)
    m = MCP_Geometric(custo, fully_connected=True)
    ini = [(min(h - 1, max(0, int(y * h))), min(w - 1, max(0, int(x * w)))) for x, y in entradas]
    dist, _ = m.find_costs(ini)
    t = dist / dist.max()
    if cob is not None:
        # o ritmo é o da TINTA que chega, não o da área: sem isto a peça
        # aparece quase toda no começo (o traço escuro corre na frente) e o
        # resto da duração só molha papel vazio
        peso = c + 0.12 * c.mean()
        if janela is not None:
            x0, y0, x1, y1 = janela
            dentro = np.zeros_like(peso)
            dentro[int(y0 * h):max(int(y0 * h) + 1, int(y1 * h)), int(x0 * w):max(int(x0 * w) + 1, int(x1 * w))] = 1
            peso = peso * (dentro + 1e-4)
        peso = peso.ravel()
        ordem = np.argsort(t.ravel(), kind='stable')
        acum = np.cumsum(peso[ordem])
        eq = np.empty_like(acum)
        eq[ordem] = acum / acum[-1]
        t = eq.reshape(t.shape)
    return t


def salvar_campo(t, caminho):
    """16 bits: vermelho = byte alto, verde = byte baixo."""
    v = np.clip(np.round(t * 65535), 0, 65535).astype(np.uint32)
    rgb = np.zeros(t.shape + (3,), np.uint8)
    rgb[..., 0] = v >> 8
    rgb[..., 1] = v & 255
    os.makedirs(os.path.dirname(caminho), exist_ok=True)
    Image.fromarray(rgb).save(caminho, optimize=True)
    return t.shape[1], t.shape[0]


def fibra_fina(lado, semente=11):
    """Textura periódica da fibra fina, que o Remotion soma ao campo
    reduzido para a frente da tinta sair desfiada no px."""
    n = ruido(lado, lado, (2.6 * K, 0.55 * K), semente, angulo=4) * 0.8 + \
        ruido(lado, lado, (1.2 * K, 0.5 * K), semente + 1, angulo=-30) * 0.6
    n = (n - n.min()) / (n.max() - n.min())
    return Image.fromarray((n * 255).astype(np.uint8))


# ===================================================================== #
#  TIPO                                                                 #
# ===================================================================== #
EBG, EBG7, OSW, ANT = 'ebg-500.ttf', 'ebg-700.ttf', 'oswald.ttf', 'anton.ttf'
MACRON = {'ō': 'o', 'ū': 'u', 'ā': 'a', 'Ō': 'O', 'Ū': 'U', 'Ā': 'A'}
_AGUDO = {'o': 'ó', 'u': 'ú', 'a': 'á', 'O': 'Ó', 'U': 'Ú', 'A': 'Á'}
_fontes = {}


def fonte(nome, corpo):
    k = (nome, int(round(corpo)))
    if k not in _fontes:
        _fontes[k] = ImageFont.truetype(os.path.join(FONTES, nome), int(round(corpo)),
                                        layout_engine=ImageFont.Layout.RAQM)
    return _fontes[k]


def _mascara(texto, fnt):
    """Desenha numa tela com origem conhecida; devolve (array, ox, oy)."""
    c = fnt.size
    W, H = int(c * (len(texto) + 3)), int(c * 3)
    im = Image.new('L', (W, H), 0)
    ImageDraw.Draw(im).text((c, c), texto, font=fnt, fill=255)
    return np.asarray(im), c, c


_mac = {}


def _macron(fnt, base):
    """Onde o mácron (o glifo ¯ da própria fonte) assenta sobre `base`:
    centrado na tinta da vogal, na altura em que a fonte põe o agudo. As
    quatro fontes do canal não têm ō nem ū, mas todas têm o ¯."""
    k = (fnt.path, fnt.size, base)
    if k not in _mac:
        b, ox, oy = _mascara(base, fnt)
        r, _, _ = _mascara(_AGUDO[base], fnt)
        m, mx, my = _mascara('¯', fnt)
        acento = (r > 128) & ~(ndimage.binary_dilation(b > 128, iterations=2))
        ys = np.where(acento.any(1))[0]
        xs_b = np.where((b > 128).any(0))[0]
        ys_m = np.where((m > 128).any(1))[0]
        xs_m = np.where((m > 128).any(0))[0]
        # centro vertical do mácron = 60% da altura do agudo, a partir do topo
        alvo_y = ys.min() + 0.6 * (ys.max() - ys.min())
        cy_m = (ys_m.min() + ys_m.max()) / 2
        alvo_x = (xs_b.min() + xs_b.max()) / 2
        cx_m = (xs_m.min() + xs_m.max()) / 2
        _mac[k] = (alvo_x - cx_m, alvo_y - cy_m)
    return _mac[k]


def _segmentos(texto):
    seg, cur = [], ''
    for c in texto:
        if c in MACRON:
            if cur:
                seg.append(cur)
            seg.append(c)
            cur = ''
        else:
            cur += c
    if cur:
        seg.append(cur)
    return seg


def largura(texto, fnt, tracking=0.0):
    if tracking:
        return sum(fnt.getlength(MACRON.get(c, c)) for c in texto) + tracking * fnt.size * max(0, len(texto) - 1)
    return sum(fnt.getlength(MACRON.get(s, s)) for s in _segmentos(texto))


def linha(ch, texto, fnt, x, y, cor=255, tracking=0.0, ancora='esq'):
    """Escreve uma linha na chapa (L). Kerning do RAQM; mácron composto.
    (x, y) é a origem do PIL (topo da caixa da fonte)."""
    d = ImageDraw.Draw(ch)
    total = largura(texto, fnt, tracking)
    if ancora == 'centro':
        x -= total / 2
    elif ancora == 'dir':
        x -= total
    partes = list(texto) if tracking else _segmentos(texto)
    extra = tracking * fnt.size
    cx = x
    for p in partes:
        if p in MACRON:
            base = MACRON[p]
            d.text((cx, y), base, font=fnt, fill=cor)
            dx, dy = _macron(fnt, base)
            d.text((cx + dx, y + dy), '¯', font=fnt, fill=cor)
            cx += fnt.getlength(base) + extra
        else:
            d.text((cx, y), p, font=fnt, fill=cor)
            cx += fnt.getlength(p) + extra
    return total


def caixa_tinta(ch):
    """Onde a tinta realmente encosta, em px (x0, y0, x1, y1)."""
    a = np.asarray(ch)
    ys, xs = np.where(a > 8)
    if len(ys) == 0:
        return None
    return int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1


_med = {}


def tinta_de(texto, nome, corpo, tracking=0.0):
    """Caixa de tinta real de uma linha desenhada na origem (0, 0)."""
    k = (texto, nome, int(round(corpo)), round(tracking, 4))
    if k not in _med:
        pad = int(corpo)
        fnt = fonte(nome, corpo)
        ch = Image.new('L', (int(largura(texto, fnt, tracking) + 4 * pad), int(corpo * 2.6) + 2 * pad), 0)
        linha(ch, texto, fnt, pad, pad, tracking=tracking)
        cx = caixa_tinta(ch)
        _med[k] = (cx[0] - pad, cx[1] - pad, cx[2] - pad, cx[3] - pad) if cx else (0, 0, 0, 0)
    return _med[k]


def tipo_em_tinta(ch, semente=0, mordida=0.30, sangra=0.45, escala=1.0):
    """Chapa de tipo (L, 0..255) -> cobertura com tinta de pincel: a letra
    bebe um pouco de papel em volta e a borda fica mais densa. `escala`: a
    chapa está em `escala` vezes o 1440p."""
    a = np.asarray(ch, float) / 255
    H, W = a.shape
    k = K * escala
    sang = ndimage.gaussian_filter(a, sangra * k)
    a = np.maximum(a, sang * 0.85)
    fib = ruido(H, W, (2.4 * k, 0.6 * k), semente, angulo=4)
    borda = np.abs(ndimage.gaussian_filter(a, 0.8 * k) - ndimage.gaussian_filter(a, 2.0 * k))
    a = np.clip(a * (1 + 0.10 * fib * a) + borda * mordida, 0, 1)
    return a


# ===================================================================== #
#  PINCEL (traço gerado, sempre com kasure)                             #
# ===================================================================== #
def pincelada(W, H, pontos, espessura, semente=0, seco=0.5, escala=1.0):
    """Um traço de pincel ao longo de `pontos` (px), numa chapa W x H.

    O pincel encosta (entrada curta e cheia), corre, e sai levantando. O
    kasure é o pincel ficando sem tinta: as cerdas da borda secam antes, e
    cada uma falha em trechos longos, paralelos ao traço. Do meio para o
    fim o traço vira estria. Sem isso o traço denuncia que é vetor."""
    g = np.random.default_rng(semente)
    pts = np.asarray(pontos, float)
    seg = np.hypot(*np.diff(pts, axis=0).T)
    L = float(seg.sum())
    s = np.concatenate([[0], np.cumsum(seg)])
    n = max(16, int(L))
    u = np.linspace(0, L, n)
    xs = np.interp(u, s, pts[:, 0])
    ys = np.interp(u, s, pts[:, 1])
    # cantos suaves: o pincel não faz quina viva
    xs = ndimage.gaussian_filter1d(xs, max(1.0, espessura * 0.35), mode='nearest')
    ys = ndimage.gaussian_filter1d(ys, max(1.0, espessura * 0.35), mode='nearest')
    tx, ty = np.gradient(xs), np.gradient(ys)
    tn = np.hypot(tx, ty) + 1e-9
    nx, ny = -ty / tn, tx / tn
    v = u / L
    ent = np.clip(v * L / max(espessura * 0.9, 1), 0, 1) ** 0.5
    sai = 0.55 + 0.45 * np.clip((1 - v) / 0.22, 0, 1) ** 0.6
    onda = ruido(1, n, (max(20.0, L / 6), 0.01), semente)[0]
    larg = espessura * ent * sai * (1 + 0.07 * onda)
    nc = max(28, int(espessura * 1.5))
    pos = np.linspace(-0.5, 0.5, nc)
    # cada cerda carrega uma quantidade de tinta; as da borda menos
    carga = 1 - seco * (0.25 + 0.75 * (2 * np.abs(pos)) ** 1.4) * g.uniform(0.6, 1.4, nc)
    falha = ruido(nc, n, (max(10.0, L / 18), 0.01), semente + 1)
    im = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(im)
    r = max(1, int(round(espessura / nc * 2.0)))
    for i in range(nc):
        resto = carga[i] - seco * 1.7 * v ** 1.25 + 0.30 * falha[i]
        resto[:max(2, int(espessura * 0.8))] = np.maximum(resto[:max(2, int(espessura * 0.8))], 0.5)
        # densidade da cerda: cheia enquanto tem tinta, rala quando acaba
        dens = np.clip(0.45 + resto * 1.4, 0, 1) * (resto > 0)
        px = xs + nx * pos[i] * larg
        py = ys + ny * pos[i] * larg
        j = 0
        while j < n - 1:
            if dens[j] > 0:
                k = j
                while k < n - 1 and dens[k + 1] > 0 and abs(dens[k + 1] - dens[j]) < 0.12:
                    k += 1
                if k > j:
                    d.line(list(zip(px[j:k + 1], py[j:k + 1])), fill=int(255 * dens[j]), width=r, joint='curve')
                j = k + 1
            else:
                j += 1
    a = ndimage.gaussian_filter(np.asarray(im, float) / 255, 0.6 * escala)
    # o papel bebe desigual
    fib = ruido(H, W, (2.6 * K * escala, 0.6 * K * escala), semente + 2, angulo=4)
    return np.clip(a * (1.12 + 0.12 * fib), 0, 1)


# ===================================================================== #
#  CARIMBO                                                              #
# ===================================================================== #
def selo(lw, lh, linhas, semente=7):
    """Um hanko: vermelhão irregular, letra em RESERVA (papel), borda
    mordida, miolo entintado desigual. A letra nunca é desenhada por cima:
    ela é o papel que o carimbo não cobriu. (De ferramentas/entregues/
    carimbo-hanko.py, na escala do material.)"""
    g = np.random.default_rng(semente)
    a = np.ones((lh, lw))
    yy, xx = np.mgrid[0:lh, 0:lw]
    ru = ruido(lh, lw, 3.0 * K, semente)
    borda = np.minimum.reduce([xx, yy, lw - 1 - xx, lh - 1 - yy]).astype(float)
    a = a * np.clip((borda - 3 * K - ru * 2.6 * K) / (4.0 * K), 0, 1)
    dens = ruido(lh, lw, 22.0 * K, semente + 1)
    a = np.clip(a * (0.93 + 0.085 * dens), 0, 1)
    poro = ruido(lh, lw, 2.2 * K, semente + 2)
    perto = np.clip(1 - borda / (26.0 * K), 0, 1)
    a = a * (1 - np.clip((poro * 0.5 + 0.42) * perto, 0, 1) * 0.55)
    tipo = Image.new('L', (lw, lh), 0)
    y = int(lh * 0.30)
    for t, corpo in linhas:
        linha(tipo, t, fonte(OSW, corpo), lw // 2, y, tracking=0.18, ancora='centro')
        y += int(corpo * 1.72)
    tt = np.clip(ndimage.gaussian_filter(np.asarray(tipo, float) / 255, 0.7 * K) * 1.9, 0, 1)
    return np.clip(a * (1 - tt), 0, 1)


# ===================================================================== #
#  PROFUNDIDADE: tapar o buraco atrás de um plano recortado              #
# ===================================================================== #
def tapar(T, buraco):
    """Preenche `buraco` (bool) de uma transmitância HxWx3 com o que está do
    outro lado da borda, refletido: a textura do fundo (onda, céu, fibra)
    continua no lugar de virar borrão. Só a faixa perto da borda aparece
    quando o plano da frente se desloca; o miolo nunca é visto."""
    H, W = buraco.shape
    _, (iy, ix) = ndimage.distance_transform_edt(buraco, return_indices=True)
    yy, xx = np.mgrid[0:H, 0:W]
    ry = np.clip(2 * iy - yy, 0, H - 1)
    rx = np.clip(2 * ix - xx, 0, W - 1)
    ok = ~buraco[ry, rx]
    out = np.array(T, float, copy=True)
    a = buraco & ok
    out[a] = out[ry[a], rx[a]]
    b = buraco & ~ok
    out[b] = out[iy[b], ix[b]]
    return out

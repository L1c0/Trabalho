#!/usr/bin/env python3
"""
A prensa.

O que entrega imagem gerada nao e a falta de textura, e a REGULARIDADE
dela: grao igual em toda a tela, tinta da mesma densidade do canto
esquerdo ao direito, tipo alinhado ao pixel, nada fora de registro.
Filtro de 'film grain' nao resolve porque filtro tambem e uniforme.

Entao aqui nao tem filtro. Tem um modelo do que acontece quando tinta
encosta em papel sob pressao:

  papel   -> tom irregular, fibra anisotropica, pintas de polpa
  forme   -> a chapa entra levemente torta, como toda chapa entra
  ganho   -> a tinta espalha; traco fino engorda mais que traco grosso
  mordida -> letterpress empurra tinta pras bordas, que ficam mais densas
  batida  -> a pressao nao e igual na folha; um lado entrega mais tinta
  falha   -> onde entrou pouca tinta e a cobertura e baixa, chapa

Cada numero abaixo e um fenomeno, nao um gosto. E por isso que o
resultado nao fica simetrico: ele herda uma historia fisica.
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

# as fontes moram ao lado deste arquivo (anton, ebg-500, ebg-700, oswald)
FONTES = os.path.dirname(os.path.abspath(__file__))


def _suave(g, H, W, sigma):
    """Ruído borrado com sigma grande, sem pagar a convolução inteira.

    Borrar ruído branco com sigma de centenas de pixels custa minutos numa
    folha de 1440p. O resultado é um campo liso, então dá para sortear o
    ruído numa grade reduzida, borrar lá e ampliar: a estatística é a mesma
    (quem usa o campo sempre normaliza depois). Sigma pequeno vai direto."""
    if sigma < 24:
        return ndimage.gaussian_filter(g.random((H, W)), sigma)
    f = max(2, int(sigma // 8))
    h, w = H // f + 3, W // f + 3
    n = ndimage.gaussian_filter(g.random((h, w)), sigma / f, mode="wrap")
    n = ndimage.zoom(n, f, order=3)[:H, :W]
    return n


# ===================================================================== #
#  PAPEL                                                                #
# ===================================================================== #
def papel(W, H, tom=(0xCD, 0xC7, 0xBB), semente=0, aspereza=1.0, grao=0.0):
    """Folha. Nunca de tom chapado.

    grao: desvio do grão de superfície, por cima do grão fino. Fica na folha,
    então anda junto com ela quando a câmera se move, e a tinta cobre ele onde
    a cobertura é cheia. Calibrado pelo desvio local medido no frame (6 a 8)."""
    g = np.random.default_rng(semente)
    base = np.broadcast_to(np.array(tom, float), (H, W, 3)).copy()

    def campo(sigma, amp):
        n = _suave(g, H, W, sigma)
        n = (n - n.mean()) / (n.std() + 1e-9)
        return n[..., None] * amp

    # nuvem larga: a folha nao secou igual
    base += campo(max(W, H) * 0.17, 3.1 * aspereza)
    # mancha media: polpa mal distribuida
    base += campo(26, 2.2 * aspereza)

    # fibra: o papel tem direcao de maquina. ruido mais longo em x que em y.
    f = g.random((H, W))
    f = ndimage.gaussian_filter(f, (0.7, 3.4))
    f = (f - f.mean()) / (f.std() + 1e-9)
    base += f[..., None] * 4.2 * aspereza

    # grao fino, o que sobra
    base += g.normal(0, 2.1 * aspereza, (H, W, 1))

    # pintas de polpa: pontinhos escuros, poucos e espalhados
    n_pintas = int(W * H / 26000)
    ys = g.integers(0, H, n_pintas)
    xs = g.integers(0, W, n_pintas)
    for y, x in zip(ys, xs):
        r = int(g.integers(1, 3))
        base[max(0, y - r):y + r, max(0, x - r):x + r] -= g.uniform(10, 26)

    # grão de superfície: levemente correlacionado (grão de verdade tem corpo,
    # não é um pixel solto), normalizado e somado só na luminância.
    if grao > 0:
        gs = ndimage.gaussian_filter(g.normal(0, 1, (H, W)), 0.55)
        base += (gs / (gs.std() + 1e-9))[..., None] * grao

    return np.clip(base, 0, 255)


# ===================================================================== #
#  CHAPA                                                                #
# ===================================================================== #
def chapa(W, H):
    """Mascara vazia onde se desenha o que vai ser impresso (0..255)."""
    return Image.new("L", (W, H), 0)


def _torta(cob, graus, desloc, semente):
    """A forme entra torta. Sempre entra."""
    g = np.random.default_rng(semente + 991)
    im = Image.fromarray((cob * 255).astype(np.uint8))
    im = im.rotate(graus, resample=Image.BICUBIC, fillcolor=0)
    a = np.asarray(im, float) / 255
    dy, dx = desloc
    return ndimage.shift(a, (dy, dx), order=1, mode="constant", cval=0.0)


# ===================================================================== #
#  IMPRESSAO                                                            #
# ===================================================================== #
def imprimir(folha, chapa_img, tinta=(0x14, 0x12, 0x0E), semente=0,
             ganho=1.0, mordida=0.55, batida=0.30, falha=0.5,
             torcao=0.22, desloc=(0.0, 0.0), forca=1.0):
    """
    Passa uma chapa na folha.

    ganho   : quanto a tinta espalha (0 = nenhum, 1 = normal)
    mordida : o quanto a borda do traco fica mais densa que o miolo
    batida  : variacao de pressao pela folha (0 = prensa perfeita)
    falha   : chance de chapar onde faltou tinta
    torcao  : graus de desalinho da forme
    forca   : densidade geral da tinta
    """
    g = np.random.default_rng(semente)
    H, W = folha.shape[:2]
    cob = np.asarray(chapa_img, float) / 255
    cob = _torta(cob, torcao, desloc, semente)

    # --- ganho de ponto: a tinta sai do traco -----------------------
    # traco fino engorda proporcionalmente mais, entao borra e re-ganha
    if ganho > 0:
        esp = ndimage.gaussian_filter(cob, 1.15 * ganho)
        cob = np.clip(cob + esp * 0.42 * ganho, 0, 1)
        cob = np.clip(cob ** (1 / (1 + 0.16 * ganho)), 0, 1)

    # --- mordida: letterpress empurra tinta pra borda ---------------
    if mordida > 0:
        gy, gx = np.gradient(ndimage.gaussian_filter(cob, 1.1))
        borda = np.hypot(gy, gx)
        borda = borda / (borda.max() + 1e-9)
        cob = np.clip(cob + borda * mordida * 0.85, 0, 1)

    # --- batida: a pressao nao e igual na folha ---------------------
    pres = np.ones((H, W))
    if batida > 0:
        n = _suave(g, H, W, max(W, H) * 0.16)
        n = (n - n.min()) / (n.max() - n.min() + 1e-9)
        # rampa diagonal: um canto da forme encosta primeiro
        yy, xx = np.mgrid[0:H, 0:W]
        ang = g.uniform(0, 2 * np.pi)          # que canto encosta primeiro
        rampa = (xx / W) * np.cos(ang) + (yy / H) * np.sin(ang)
        rampa = (rampa - rampa.min()) / (rampa.max() - rampa.min() + 1e-9)
        pres = 1.0 + (n - 0.5) * batida * 0.85 + (rampa - 0.5) * batida * 0.40

    densidade = np.clip(cob * pres * forca, 0, 1)

    # --- falha: onde entrou pouca tinta, chapa -----------------------
    if falha > 0:
        # sigma alto de proposito: falha de tinta sai em MANCHA, nao em
        # pontinho. Pontinho fino e espalhado le como ruido digital, que e
        # exatamente o que se quer evitar.
        poro = ndimage.gaussian_filter(g.random((H, W)), 4.2)
        poro = (poro - poro.min()) / (poro.max() - poro.min() + 1e-9)
        limiar = 0.085 * falha * np.clip(1.9 - pres, 0, 2)
        densidade = np.where(poro < limiar, densidade * (poro / (limiar + 1e-9)),
                             densidade)

    d = np.clip(densidade, 0, 1)[..., None]
    return folha * (1 - d) + np.array(tinta, float) * d


def arrancar(folha, chapa_img, semente=0, **kw):
    """Tipo vazado: a chapa e o FUNDO, o texto fica em reserva (papel).

    E assim que sai o branco riscado da identidade do canal: nao e texto
    branco por cima, e tinta que nao cobriu aquela area. A falha acontece
    na tinta em volta, nao na letra.
    """
    inv = Image.fromarray(255 - np.asarray(chapa_img, dtype=np.uint8))
    return imprimir(folha, inv, semente=semente, **kw)


# ===================================================================== #
#  TIPOGRAFIA                                                           #
# ===================================================================== #
def fonte(nome, corpo):
    return ImageFont.truetype(f"{FONTES}/{nome}", corpo)


def linha(ch, texto, fnt, x, y, cor=255, tracking=0.0, semente=0,
          tremor=0.0, ancora="esq"):
    """Escreve com tracking e, se pedido, com a linha de base bamba.

    `tremor` desloca cada letra em fracao de pixel. Tipo de metal nunca
    assentou perfeito na linha, e e esse micro-desalinho que o olho le
    como 'alguem compos isso'.
    """
    g = np.random.default_rng(semente + 17)
    d = ImageDraw.Draw(ch)
    larguras = [d.textlength(c, font=fnt) for c in texto]
    extra = tracking * fnt.size
    total = sum(larguras) + extra * max(0, len(texto) - 1)
    if ancora == "centro":
        x -= total / 2
    elif ancora == "dir":
        x -= total
    cx = x
    for c, w in zip(texto, larguras):
        dx = g.normal(0, tremor) if tremor else 0.0
        dy = g.normal(0, tremor * 1.3) if tremor else 0.0
        d.text((cx + dx, y + dy), c, font=fnt, fill=cor)
        cx += w + extra
    return total


def caixa_tinta(ch):
    """Onde a tinta realmente encosta, em pixel. Serve pra empilhar blocos
    sem chutar: o proximo bloco comeca depois do fundo deste."""
    a = np.asarray(ch, float)
    ys, xs = np.where(a > 8)
    if len(ys) == 0:
        return None
    return int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1


def gravura(caminho, largura, branco=0.94, preto=0.10):
    """Converte um PNG cinza em chapa (cobertura de tinta 0..255).

    Usa pontos de branco e preto, NAO contraste simetrico. Contraste
    simetrico puxa o branco pra cinza, e aí a margem branca da PNG vira
    9% de tinta — o que desenha uma moldura cinza em volta do quadro e
    entrega na hora que aquilo é uma imagem colada, não impressa.

    branco: acima disso, papel limpo (zero tinta)
    preto : abaixo disso, tinta cheia
    """
    im = Image.open(caminho).convert("L")
    k = largura / im.width
    im = im.resize((int(largura), max(1, int(im.height * k))), Image.LANCZOS)
    a = np.asarray(im, float) / 255
    cob = np.clip((branco - a) / (branco - preto), 0, 1)
    return Image.fromarray((cob * 255).astype(np.uint8))


def colar_chapa(ch, peca, x, y):
    """Soma uma chapa menor dentro da chapa da folha."""
    base = np.asarray(ch, float)
    p = np.asarray(peca, float)
    h, w = p.shape
    H, W = base.shape
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(W, x + w), min(H, y + h)
    if x1 <= x0 or y1 <= y0:
        return ch
    base[y0:y1, x0:x1] = np.maximum(base[y0:y1, x0:x1],
                                    p[y0 - y:y1 - y, x0 - x:x1 - x])
    return Image.fromarray(base.astype(np.uint8))


def reservar(ch_arte, ch_tipo, folga=0):
    """Uma chapa só, com o tipo como área NÃO imprimente.

    É assim que sai o branco riscado por cima de arte: não é texto branco
    desenhado em cima, é papel que a chapa nunca cobriu. A letra fica
    limpa e toda a irregularidade acontece na tinta em volta dela — que é
    exatamente a diferença entre identidade e filtro de distress.
    """
    a = np.asarray(ch_arte, float)
    t = np.asarray(ch_tipo, float) / 255
    if folga:
        t = np.clip(ndimage.gaussian_filter(t, folga) * 2.2, 0, 1)
    return Image.fromarray(np.clip(a * (1 - t), 0, 255).astype(np.uint8))


def salvar(arr, caminho, q=94):
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(caminho,
                                                                quality=q)


def medir_grao(arr, caixa=None):
    """Desvio local 5x5 numa regiao lisa. Alvo da casa: 6 a 8."""
    g = np.asarray(Image.fromarray(
        np.clip(arr, 0, 255).astype(np.uint8)).convert("L"), float)
    if caixa:
        y0, y1, x0, x1 = caixa
        g = g[y0:y1, x0:x1]
    return float(np.std(g - ndimage.uniform_filter(g, 5)))

#!/usr/bin/env python3
"""
As oito cartelas de bloco do Vinland.

Duas regras de projeto aqui:

1. O PAPEL CLAREIA. De #B3ABA0 no primeiro bloco a #EDECE7 no último. O
   ensaio sai do registro do fracasso e chega na pergunta, e o fundo faz
   esse caminho junto. Ninguém percebe de um corte pro outro; aos nove
   minutos, sente.

2. NENHUMA DUAS IGUAIS. Se as oito saem do mesmo molde com o texto
   trocado, elas leem como template — e template é a outra metade do que
   entrega imagem gerada, junto com o grão uniforme. Então cada uma tem
   composição própria: corpo diferente, alinhamento diferente, uma é
   vazada, uma é em duas colunas, uma é quase só ar.
"""
import numpy as np
from PIL import Image, ImageDraw
import prensa as P

W, H = 1920, 1080
OUT = "/mnt/user-data/outputs/vinland/public/cartelas"
import os
os.makedirs(OUT, exist_ok=True)

TINTA = (0x14, 0x12, 0x0E)
FERRUGEM = (0x7A, 0x3B, 0x22)
TURFA = (0x15, 0x13, 0x0F)
ESQ, DIR = 240, 1920 - 180

PAPEL = ["#B3ABA0", "#B8B1A6", "#BFB8AD", "#C6C0B4",
         "#CDC7BB", "#D6D1C6", "#E2DFD6", "#EDECE7"]
hx = lambda s: tuple(int(s[i:i + 2], 16) for i in (1, 3, 5))

PR = dict(ganho=0.95, mordida=0.56, batida=0.29, falha=0.55)


def novo(i, aspereza=1.0):
    return P.papel(W, H, hx(PAPEL[i]), semente=100 + i * 7, aspereza=aspereza)


# =================================================================== #
def b1():
    """Ar em cima, tipo pesado embaixo. Duas chapas fora de registro."""
    folha = novo(0, 1.15)
    ch = P.chapa(W, H)
    f = P.fonte("ebg-700.ttf", 191)
    P.linha(ch, "THORFINN", f, ESQ, 548, tracking=0.012, semente=1, tremor=0.9)
    P.linha(ch, "EXISTIU", f, ESQ, 760, tracking=0.012, semente=2, tremor=0.9)
    folha = P.imprimir(folha, ch, tinta=FERRUGEM, semente=11, torcao=0.34,
                       desloc=(-1.9, 2.3), forca=0.52, **PR)
    return P.imprimir(folha, ch, tinta=TINTA, semente=12, torcao=0.16, **PR)


def b2():
    """O copista. Texto longo, corpo pequeno, bloco alto à esquerda."""
    folha = novo(1)
    ch = P.chapa(W, H)
    fr = P.fonte("oswald.ttf", 23)
    P.linha(ch, "A FONTE", fr, ESQ, 262, tracking=0.24, semente=20)
    f = P.fonte("ebg-700.ttf", 106)
    P.linha(ch, "Haukr Erlendsson", f, ESQ, 328, semente=21, tremor=0.7)
    fc = P.fonte("ebg-500.ttf", 38)
    for i, l in enumerate([
            "copiou o manuscrito que sobreviveu.",
            "Dizia-se descendente do Thorfinn.",
            "Os estudiosos suspeitam que acrescentou",
            "material para lisonjear o antepassado."]):
        P.linha(ch, l, fc, ESQ, 506 + i * 58, semente=22 + i)
    return P.imprimir(folha, ch, tinta=TINTA, semente=29,
                      torcao=-0.21, desloc=(1.1, -0.9), **PR)


def b3():
    """Alinhado à DIREITA. Quebra o eixo depois de duas cartelas à esquerda."""
    folha = novo(2)
    ch = P.chapa(W, H)
    f = P.fonte("ebg-700.ttf", 122)
    for i, l in enumerate(["O mundo é histórico.", "O motivo é ficção."]):
        P.linha(ch, l, f, DIR, 404 + i * 150, semente=30 + i, tremor=0.8,
                ancora="dir")
    fr = P.fonte("oswald.ttf", 22)
    # 730, não 664: a descendente do "ficção" desce até ~682 e as duas
    # linhas pequenas estavam encavaladas nela.
    P.linha(ch, "ASKELADD, THORS E EINAR NÃO EXISTIRAM", fr, DIR, 736,
            tracking=0.17, semente=34, ancora="dir")
    P.linha(ch, "CANUTE, THORKELL, SWEYN E LEIF EXISTIRAM", fr, DIR, 776,
            tracking=0.17, semente=35, ancora="dir")
    return P.imprimir(folha, ch, tinta=TINTA, semente=39, torcao=0.24, **PR)


def b4():
    """A fala. Vazada: a tinta cobre a folha e a letra fica em reserva."""
    folha = novo(4)
    ch = P.chapa(W, H)
    f = P.fonte("anton.ttf", 196)
    P.linha(ch, "EU NÃO TENHO", f, ESQ, 404, tracking=-0.004, semente=41, tremor=1.0)
    P.linha(ch, "INIMIGOS", f, ESQ, 614, tracking=-0.004, semente=42, tremor=1.0)
    fr = P.fonte("oswald.ttf", 23)
    P.linha(ch, "VINLAND SAGA, CAPÍTULO 96", fr, ESQ, 872,
            tracking=0.19, semente=43)
    return P.arrancar(folha, ch, tinta=TURFA, semente=49, ganho=0.55,
                      mordida=0.22, batida=0.26, falha=0.85, torcao=0.14)


def b5():
    """Tolstói. O ano grande em ferrugem, a frase pequena em preto."""
    folha = novo(3)
    ch_ano = P.chapa(W, H)
    fa = P.fonte("anton.ttf", 300)
    P.linha(ch_ano, "1893", fa, ESQ - 10, 300, tracking=-0.02, semente=50,
            tremor=1.3)
    _, _, _, fundo = P.caixa_tinta(ch_ano)

    ch = P.chapa(W, H)
    f = P.fonte("ebg-700.ttf", 77)
    P.linha(ch, "Não resistir ao mal.", f, ESQ, fundo + 54, semente=51, tremor=0.7)
    fc = P.fonte("ebg-500.ttf", 34)
    P.linha(ch, "Aceitar ser morto antes de matar. Nada de punição,", fc,
            ESQ, fundo + 176, semente=52)
    P.linha(ch, "nada de força, nem para se defender.", fc, ESQ,
            fundo + 222, semente=53)
    fr = P.fonte("oswald.ttf", 19)
    P.linha(ch, "TOLSTÓI, O REINO DE DEUS ESTÁ EM VÓS", fr, ESQ,
            fundo + 292, tracking=0.2, semente=54)

    folha = P.imprimir(folha, ch_ano, tinta=FERRUGEM, semente=55,
                       torcao=-0.18, forca=0.88, **PR)
    return P.imprimir(folha, ch, tinta=TINTA, semente=56, torcao=0.13, **PR)


def b6():
    """A discordância, em duas colunas. O layout É o argumento."""
    folha = novo(5)
    ch = P.chapa(W, H)
    meio = 980
    fr = P.fonte("oswald.ttf", 22)
    fn = P.fonte("ebg-700.ttf", 67)
    fc = P.fonte("ebg-500.ttf", 32)

    P.linha(ch, "TOLSTÓI", fr, ESQ, 300, tracking=0.26, semente=60)
    P.linha(ch, "Nunca.", fn, ESQ, 348, semente=61, tremor=0.7)
    for i, l in enumerate(["Matar só pode vir de raiva,",
                           "medo ou ódio. Nenhum dos", "três é amor."]):
        P.linha(ch, l, fc, ESQ, 474 + i * 48, semente=62 + i)

    P.linha(ch, "GANDHI", fr, meio, 300, tracking=0.26, semente=65)
    P.linha(ch, "Quase nunca.", fn, meio, 348, semente=66, tremor=0.7)
    for i, l in enumerate(["Entre covardia e violência,",
                           "ele aconselharia a", "violência."]):
        P.linha(ch, l, fc, meio, 474 + i * 48, semente=67 + i)

    d = ImageDraw.Draw(ch)
    d.rectangle([meio - 86, 296, meio - 84, 618], fill=255)
    f2 = P.fonte("ebg-500.ttf", 36)
    P.linha(ch, "Um pode mudar de ideia diante dos fatos. O outro não pode.",
            f2, ESQ, 748, semente=70)
    P.linha(ch, "É por isso que o segundo parece ingênuo.", f2, ESQ, 798,
            semente=71)
    return P.imprimir(folha, ch, tinta=TINTA, semente=79, torcao=-0.15, **PR)


def b7():
    """O dado. Numeral enorme, apoio medido pela caixa de tinta."""
    folha = novo(6, 0.85)
    ch = P.chapa(W, H)
    fr = P.fonte("oswald.ttf", 24)
    P.linha(ch, "O ANO EM QUE CORTARAM A MADEIRA", fr, ESQ, 338,
            tracking=0.22, semente=80)
    so = P.chapa(W, H)
    fn = P.fonte("anton.ttf", 356)
    P.linha(so, "1021", fn, ESQ - 12, 372, tracking=-0.018, semente=81, tremor=1.5)
    _, _, _, fundo = P.caixa_tinta(so)
    ch = P.colar_chapa(ch, so, 0, 0)
    fc = P.fonte("ebg-500.ttf", 33)
    P.linha(ch, "L'Anse aux Meadows, ponta norte de Newfoundland.", fc,
            ESQ, fundo + 62, semente=82)
    P.linha(ch, "Datado pelo pico de carbono-14 da tempestade solar de 993.",
            fc, ESQ, fundo + 110, semente=83)
    fp = P.fonte("oswald.ttf", 19)
    P.linha(ch, "KUITEMS ET AL., NATURE, 2021", fp, ESQ, fundo + 182,
            tracking=0.2, semente=84)
    return P.imprimir(folha, ch, tinta=TINTA, semente=89, torcao=-0.19,
                      desloc=(1.2, -0.8), **PR)


def b8():
    """A pergunta. Quase só ar. Papel mais limpo do vídeo."""
    folha = novo(7, 0.78)
    ch = P.chapa(W, H)
    f = P.fonte("ebg-700.ttf", 94)
    P.linha(ch, "E você,", f, ESQ, 452, semente=90, tremor=0.6)
    P.linha(ch, "continuaria tentando?", f, ESQ, 574, semente=91, tremor=0.6)
    return P.imprimir(folha, ch, tinta=TINTA, semente=99, torcao=0.11,
                      ganho=0.8, mordida=0.5, batida=0.22, falha=0.35)


if __name__ == "__main__":
    blocos = [b1, b2, b3, b4, b5, b6, b7, b8]
    for i, fn in enumerate(blocos, 1):
        arr = fn()
        P.salvar(arr, f"{OUT}/bloco-{i}.jpg")
        print(f"bloco {i}  papel {PAPEL[i-1]}")

    ims = [Image.open(f"{OUT}/bloco-{i}.jpg") for i in range(1, 9)]
    for im in ims:
        im.thumbnail((620, 349))
    cw, ch_ = ims[0].width + 10, ims[0].height + 10
    sh = Image.new("RGB", (cw * 2, ch_ * 4), (252, 252, 250))
    for i, im in enumerate(ims):
        sh.paste(im, ((i % 2) * cw + 5, (i // 2) * ch_ + 5))
    sh.save("/mnt/user-data/outputs/vin-blocos.jpg", quality=92)

    # faixa só das cores, pra ver a progressão do papel sem o tipo atrapalhar
    faixa = Image.new("RGB", (1600, 150))
    dd = ImageDraw.Draw(faixa)
    for i, c in enumerate(PAPEL):
        dd.rectangle([i * 200, 0, (i + 1) * 200, 150], fill=hx(c))
    faixa.save("/mnt/user-data/outputs/vin-progressao.png")
    print("folha", sh.size)

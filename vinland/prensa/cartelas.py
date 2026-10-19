#!/usr/bin/env python3
"""Tres cartelas do Vinland, impressas pela prensa."""
import numpy as np
from PIL import Image
import prensa as P

W, H = 1920, 1080
OUT = "/mnt/user-data/outputs"

TINTA = (0x14, 0x12, 0x0E)
FERRUGEM = (0x7A, 0x3B, 0x22)
TURFA = (0x15, 0x13, 0x0F)

PAPEL_SUJO = (0xB3, 0xAB, 0xA0)
PAPEL_MEIO = (0xCD, 0xC7, 0xBB)
PAPEL_LIMPO = (0xE4, 0xE1, 0xD8)

ESQ = 240


# ------------------------------------------------------------------ #
# A — a abertura
# ------------------------------------------------------------------ #
def cartela_a():
    folha = P.papel(W, H, PAPEL_SUJO, semente=3, aspereza=1.15)

    f = P.fonte("ebg-700.ttf", 191)
    ch = P.chapa(W, H)
    P.linha(ch, "THORFINN", f, ESQ, 548, tracking=0.012, semente=1, tremor=0.9)
    P.linha(ch, "EXISTIU", f, ESQ, 760, tracking=0.012, semente=2, tremor=0.9)

    # duas chapas fora de registro: a fantasma de ferrugem, depois a preta
    folha = P.imprimir(folha, ch, tinta=FERRUGEM, semente=11,
                       torcao=0.34, desloc=(-1.9, 2.3),
                       ganho=1.2, mordida=0.3, batida=0.34, falha=0.8,
                       forca=0.52)
    folha = P.imprimir(folha, ch, tinta=TINTA, semente=12,
                       torcao=0.16, desloc=(0.0, 0.0),
                       ganho=1.0, mordida=0.62, batida=0.30, falha=0.55)
    return folha


# ------------------------------------------------------------------ #
# B — a fala, vazada na tinta
# ------------------------------------------------------------------ #
def cartela_b():
    folha = P.papel(W, H, PAPEL_MEIO, semente=21, aspereza=1.0)

    f = P.fonte("anton.ttf", 196)
    ch = P.chapa(W, H)
    P.linha(ch, "EU NÃO TENHO", f, ESQ, 404, tracking=-0.004, semente=31, tremor=1.0)
    P.linha(ch, "INIMIGOS", f, ESQ, 614, tracking=-0.004, semente=32, tremor=1.0)

    fr = P.fonte("oswald.ttf", 23)
    P.linha(ch, "VINLAND SAGA, CAPÍTULO 96", fr, ESQ, 872,
            tracking=0.19, semente=33)

    # a tinta cobre a folha e a letra fica em reserva. a falha de tinta
    # acontece NA TINTA, nao na letra — por isso o branco sai riscado
    # sem nenhum efeito de 'distress' por cima.
    folha = P.arrancar(folha, ch, tinta=TURFA, semente=41,
                       ganho=0.55, mordida=0.22, batida=0.26, falha=0.85,
                       torcao=0.14, forca=0.97)
    return folha


# ------------------------------------------------------------------ #
# C — o dado
# ------------------------------------------------------------------ #
def cartela_c():
    folha = P.papel(W, H, PAPEL_LIMPO, semente=51, aspereza=0.85)

    ch = P.chapa(W, H)
    fr = P.fonte("oswald.ttf", 24)
    P.linha(ch, "O ANO EM QUE CORTARAM A MADEIRA", fr, ESQ, 338,
            tracking=0.22, semente=61)

    # o numeral vai numa chapa propria so pra eu medir onde a tinta
    # dele termina de verdade. Anton tem caixa muito maior que o olho do
    # numero, entao empilhar pela metrica da fonte sempre atropela.
    so_num = P.chapa(W, H)
    fn = P.fonte("anton.ttf", 356)
    P.linha(so_num, "1021", fn, ESQ - 12, 372, tracking=-0.018, semente=62,
            tremor=1.5)
    _, _, _, fundo = P.caixa_tinta(so_num)
    ch = P.colar_chapa(ch, so_num, 0, 0)

    fc = P.fonte("ebg-500.ttf", 33)
    P.linha(ch, "L'Anse aux Meadows, ponta norte de Newfoundland.", fc,
            ESQ, fundo + 62, semente=63)
    P.linha(ch, "Datado pelo pico de carbono-14 da tempestade solar de 993.",
            fc, ESQ, fundo + 110, semente=64)

    fp = P.fonte("oswald.ttf", 19)
    P.linha(ch, "KUITEMS ET AL., NATURE, 2021", fp, ESQ, fundo + 182,
            tracking=0.2, semente=65)

    folha = P.imprimir(folha, ch, tinta=TINTA, semente=71,
                       ganho=0.85, mordida=0.58, batida=0.26, falha=0.45,
                       torcao=-0.19, desloc=(1.2, -0.8))
    return folha


# ------------------------------------------------------------------ #
# D — o quadro de mangá impresso na MESMA prensa que o tipo
# ------------------------------------------------------------------ #
def cartela_d():
    """Aqui mora a ideia toda.

    Se o quadro entra por cima como imagem e o tipo entra como texto,
    são duas coisas coladas — e é isso que se lê como montagem. Se os
    dois viram CHAPA e passam na mesma prensa, herdam a mesma batida, a
    mesma falha, o mesmo papel. Aí o frame vira superfície única.
    """
    folha = P.papel(W, H, PAPEL_MEIO, semente=81, aspereza=1.05)

    quadro = P.gravura(
        "/mnt/user-data/outputs/vinland/public/manga/v11-sem-inimigos.png",
        largura=640, branco=0.95, preto=0.12)
    ch = P.chapa(W, H)
    ch = P.colar_chapa(ch, quadro, 1030, 34)

    f = P.fonte("ebg-700.ttf", 94)
    P.linha(ch, "Ele apostou", f, ESQ, 352, tracking=0.008, semente=91, tremor=0.8)
    P.linha(ch, "que aguentava", f, ESQ, 462, tracking=0.008, semente=92, tremor=0.8)
    P.linha(ch, "cem socos.", f, ESQ, 572, tracking=0.008, semente=93, tremor=0.8)

    fr = P.fonte("oswald.ttf", 22)
    P.linha(ch, "O HOMEM QUE BATIA DESMAIOU ANTES DELE", fr, ESQ, 736,
            tracking=0.17, semente=94)

    folha = P.imprimir(folha, ch, tinta=TINTA, semente=95,
                       ganho=0.9, mordida=0.46, batida=0.30, falha=0.6,
                       torcao=0.17, desloc=(0.8, -1.4))
    return folha


if __name__ == "__main__":
    for nome, fn in [("a-abertura", cartela_a), ("b-fala", cartela_b),
                     ("c-dado", cartela_c), ("d-quadro", cartela_d)]:
        arr = fn()
        P.salvar(arr, f"{OUT}/vin-cartela-{nome}.jpg")
        print(nome, "grao:", round(P.medir_grao(arr, (40, 180, 1500, 1860)), 2))

    # folha de contato
    ims = [Image.open(f"{OUT}/vin-cartela-{n}.jpg")
           for n in ("a-abertura", "b-fala", "c-dado", "d-quadro")]
    for i in ims:
        i.thumbnail((900, 520))
    sh = Image.new("RGB", (ims[0].width, sum(i.height + 14 for i in ims)),
                   (255, 255, 255))
    y = 0
    for i in ims:
        sh.paste(i, (0, y)); y += i.height + 14
    sh.save(f"{OUT}/vin-cartelas.jpg", quality=92)
    print("folha", sh.size)

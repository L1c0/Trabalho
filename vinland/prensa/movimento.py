#!/usr/bin/env python3
"""
A regra que faz ou quebra isso em vídeo.

Se a prensa rodar a cada frame, a semente muda, e aí o papel FERVE: o
grão pisca, a mancha anda, a falha de tinta troca de lugar 30 vezes por
segundo. Grão fervendo é o tell mais óbvio que existe — é assim que se
reconhece filtro de ruído aplicado em camada de vídeo.

Papel de verdade não muda. Só a câmera se move.

Então a arquitetura é: imprime UMA vez, num tamanho maior que o frame, e
depois trata o resultado como se fosse uma folha na mesa. A revelação da
tinta não re-imprime nada — ela descobre pixel que já estava lá, com uma
máscara que avança. É literalmente o que a tinta faz ao secar, e é de
graça.
"""
import os
import numpy as np
from PIL import Image
from scipy import ndimage
import prensa as P

W, H = 1920, 1080
SOBRA = 1.16                  # imprime maior pro empurrão não estourar borda
PW, PH = int(W * SOBRA), int(H * SOBRA)
TMP = "/tmp/claude-0/-home-claude/910b9125-9f14-5862-8a0a-396e2e4a9b5d/scratchpad/mov"
os.makedirs(TMP, exist_ok=True)

TINTA = (0x14, 0x12, 0x0E)
PAPEL_MEIO = (0xCD, 0xC7, 0xBB)
ESQ = int(240 * SOBRA)
FPS, N = 30, 132


# ================================================================== #
# 1. A FOLHA, impressa uma vez só
# ================================================================== #
def compor():
    """Devolve (folha_so_papel_e_quadro, folha_completa, mascara_do_tipo)."""
    folha = P.papel(PW, PH, PAPEL_MEIO, semente=81, aspereza=1.05)

    # --- chapa do quadro ---
    quadro = P.gravura(
        "/mnt/user-data/outputs/vinland/public/manga/v11-sem-inimigos.png",
        largura=int(640 * SOBRA), branco=0.95, preto=0.12)
    ch_q = P.chapa(PW, PH)
    ch_q = P.colar_chapa(ch_q, quadro, int(1030 * SOBRA), int(34 * SOBRA))

    # --- chapa do tipo ---
    ch_t = P.chapa(PW, PH)
    f = P.fonte("cormorant-700.ttf", int(104 * SOBRA))
    for i, t in enumerate(["Ele apostou", "que aguentava", "cem socos."]):
        P.linha(ch_t, t, f, ESQ, int((352 + i * 110) * SOBRA),
                tracking=0.008, semente=91 + i, tremor=0.8)
    fr = P.fonte("oswald.ttf", int(22 * SOBRA))
    P.linha(ch_t, "O HOMEM QUE BATIA DESMAIOU ANTES DELE", fr, ESQ,
            int(736 * SOBRA), tracking=0.17, semente=94)

    pr = dict(tinta=TINTA, ganho=0.9, mordida=0.46, batida=0.30,
              falha=0.6, torcao=0.17, desloc=(0.8, -1.4))

    so_quadro = P.imprimir(folha, ch_q, semente=95, **pr)
    completa = P.imprimir(so_quadro, ch_t, semente=96, **pr)

    masc = np.asarray(ch_t, float) / 255
    masc = np.clip(ndimage.gaussian_filter(masc, 2.0) * 3, 0, 1)
    return so_quadro, completa, masc, P.caixa_tinta(ch_t)


# ================================================================== #
# 2. A REVELAÇÃO — tinta secando, não fade
# ================================================================== #
def campo_de_tinta(caixa, semente=7):
    """Campo que decide a ORDEM em que a tinta aparece.

    Tem que seguir ORDEM DE LEITURA, senão a palavra do meio nasce antes
    do começo da frase e o olho tropeça. Então o peso maior é no y (linha
    por linha), o menor no x (esquerda pra direita), e o ruído só entra
    pra que a borda do avanço seja irregular — tinta chegando, não
    cortina descendo.

    O gradiente é normalizado pela caixa do TIPO, não pela folha: usar a
    folha inteira desperdiça quase toda a faixa do gradiente em papel
    vazio, e aí as três linhas revelam quase juntas.
    """
    x0, y0, x1, y1 = caixa
    g = np.random.default_rng(semente)
    c = ndimage.gaussian_filter(g.random((PH, PW)), 70)
    c = (c - c.min()) / (c.max() - c.min())

    yy = np.clip((np.arange(PH) - y0) / max(1, y1 - y0), 0, 1)[:, None]
    xx = np.clip((np.arange(PW) - x0) / max(1, x1 - x0), 0, 1)[None, :]
    return np.clip(c * 0.17 + yy * 0.56 + xx * 0.27, 0, 1)


def principal():
    so_quadro, completa, masc, caixa = compor()
    campo = campo_de_tinta(caixa)
    print("folha impressa", completa.shape, "grao:",
          round(P.medir_grao(completa, (40, 200, 1400, 2000)), 2))

    for n in range(N):
        t = n / (N - 1)

        # --- a tinta do tipo entra entre os frames 22 e 96 ---
        p = np.clip((n - 20) / 86, 0, 1)
        limite = p * 1.22 - 0.11
        # borda estreita: tinta chega, não desbota
        reve = np.clip((limite - campo) / 0.095, 0, 1) * masc
        quadro = so_quadro * (1 - reve[..., None]) + completa * reve[..., None]

        # --- a câmera: 2,2% em 5,6 s. se der pra ver, é grande demais ---
        esc = 1.0 + 0.022 * t
        # a folha também não está perfeitamente paralela à câmera
        panx = -14 * t
        pany = -5 * t

        vw, vh = W / esc, H / esc
        cx, cy = PW / 2 + panx, PH / 2 + pany
        cx = min(max(cx, vw / 2), PW - vw / 2)
        cy = min(max(cy, vh / 2), PH - vh / 2)
        caixa = (cx - vw / 2, cy - vh / 2, cx + vw / 2, cy + vh / 2)

        im = Image.fromarray(np.clip(quadro, 0, 255).astype(np.uint8))
        im = im.resize((W, H), Image.LANCZOS, box=caixa)
        im.save(f"{TMP}/f{n:04d}.png")

    os.system(
        f"ffmpeg -y -loglevel error -framerate {FPS} -i {TMP}/f%04d.png "
        f"-c:v libx264 -crf 15 -pix_fmt yuv420p -movflags +faststart "
        f"/mnt/user-data/outputs/vin-prensa.mp4")
    os.system(
        f"ffmpeg -y -loglevel error -i /mnt/user-data/outputs/vin-prensa.mp4 "
        f"-vf 'fps=12,scale=620:-1:flags=lanczos,split[a][b];"
        f"[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer:bayer_scale=3' "
        f"/mnt/user-data/outputs/vin-prensa.gif")
    print("video pronto")


if __name__ == "__main__":
    principal()

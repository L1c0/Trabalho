exec(open('base.py').read().split('TURFA =')[0])   # reaproveita a separacao

def faixa(valores, mascara, p_claro, p_escuro, teto):
    """Ponto de branco e de preto tirados da PROPRIA regiao, como no
    gravura(): fora disso a rocha vira silhueta e o cristal vira adesivo."""
    v = valores[mascara]
    hi, lo = np.percentile(v, p_claro), np.percentile(v, p_escuro)
    return np.clip((hi - valores) / max(hi - lo, 1e-6), 0, 1) * mascara * teto

# matriz: tom proprio, teto em 0,80 — rocha escura mas com textura viva
cm = faixa(lum, matriz, 96, 6, 0.80)
# cristal, chapa escura: so fratura e aresta, nada de corpo
dx = ndimage.sobel(ndimage.gaussian_filter(lum, 0.9), 0)
dy = ndimage.sobel(ndimage.gaussian_filter(lum, 0.9), 1)
arestas = np.clip(np.hypot(dx, dy) / 42, 0, 1) * cristal
interno = faixa(lum, cristal, 88, 10, 1.0)
cd = np.clip(cm + arestas*0.80 + interno*0.30, 0, 1)
# cristal, chapa verde: o corpo, com o tom proprio preservado
cv = np.clip(faixa(lum, cristal, 94, 8, 0.86) * 0.80 + 0.26*cristal, 0, 1)

TURFA = (0x15, 0x13, 0x0F)
def monta(largura_px, tinta_v, papel_tom=(0xDE, 0xDA, 0xD0), semente=5, asp=1.5):
    TW, TH = 1080, 1920
    k = largura_px / W
    nv = Image.fromarray((cv*255).astype(np.uint8)).resize((int(W*k), int(H*k)), Image.LANCZOS)
    nd = Image.fromarray((cd*255).astype(np.uint8)).resize((int(W*k), int(H*k)), Image.LANCZOS)
    x = (TW - nv.width)//2; y = (TH - nv.height)//2
    folha = P.papel(TW, TH, papel_tom, semente=semente, aspereza=asp)
    for arr, tinta, sem, kw in (
        (nd, TURFA,   semente+1, dict(ganho=0.66, mordida=0.30, falha=0.40, torcao=0.13)),
        (nv, tinta_v, semente+2, dict(ganho=0.58, mordida=0.20, falha=0.52, torcao=0.24,
                                      desloc=(2.0, -1.4)))):
        ch = P.colar_chapa(P.chapa(TW, TH), arr, x, y)
        folha = P.imprimir(folha, ch, tinta=tinta, semente=sem, batida=0.26, **kw)
    return folha

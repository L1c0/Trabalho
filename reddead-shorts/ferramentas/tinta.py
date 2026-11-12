#!/usr/bin/env python3
"""
Tinta: transforma um take do vídeo de takes (848x478, escuro) numa silhueta
de tinta, lisa e nítida em qualquer tamanho.

O recorte é por brilho relativo: cada ponto é comparado com o fundo em volta
dele (o máximo local, alisado). O que é bem mais escuro que o fundo vira
tinta. Como a conta é feita no quadro ampliado e alisado, a borda sai limpa,
sem os blocos da compressão. O resultado é um vídeo em tons de cinza: fundo
branco, tinta preta. No Remotion ele entra por modo de mistura (multiplica
sobre o papel, ou clareia sobre outra imagem).

  python3 -I ferramentas/tinta.py [id ...]     (sem id: todos os de takes.json)
"""
import json
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / 'originais' / 'takes.mp4'
FPS_ORIGEM = 60.0


def fundo_local(lum, raio):
    """O brilho do fundo em volta de cada ponto: máximo local, alisado (numa cópia reduzida)."""
    p = cv2.resize(lum, None, fx=0.25, fy=0.25, interpolation=cv2.INTER_AREA)
    r = max(2, raio // 4)
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))
    f = cv2.GaussianBlur(cv2.dilate(p, k), (0, 0), r * 0.7)
    return cv2.resize(f, (lum.shape[1], lum.shape[0]), interpolation=cv2.INTER_CUBIC)


def limpa(m, t):
    """Mantém só a tinta ligada à base do quadro (o chão e quem está em pé nele) ou a uma semente."""
    pequeno = cv2.resize(m, None, fx=0.5, fy=0.5, interpolation=cv2.INTER_AREA)
    tinta = (pequeno < 128).astype(np.uint8)
    if t.get('corroi'):
        # ligações finas não contam (uma nuvem que encosta na orelha do cavalo, por exemplo)
        r = t['corroi']
        tinta = cv2.erode(tinta, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1)))
    n, rot = cv2.connectedComponents(tinta, connectivity=8)
    fica = np.zeros(n, bool)
    modo = t.get('mantem')
    if modo == 'base':
        fica[np.unique(rot[-2, :])] = True
    for sx, sy in t.get('sementes', []):
        fica[rot[min(rot.shape[0] - 1, int(sy * rot.shape[0])), min(rot.shape[1] - 1, int(sx * rot.shape[1]))]] = True
    fica[0] = False
    guarda = fica[rot].astype(np.uint8) * 255
    d = 9 + 4 * t.get('corroi', 0)
    guarda = cv2.dilate(guarda, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (d, d)))
    guarda = cv2.GaussianBlur(cv2.resize(guarda, (m.shape[1], m.shape[0]), interpolation=cv2.INTER_LINEAR), (0, 0), 2)
    return 255 - ((255 - m.astype(np.float32)) * (guarda / 255.0)).astype(np.uint8)


def preenche(m):
    """Fecha os buracos da tinta: o que é fundo mas não se liga à borda de cima vira tinta."""
    pequeno = cv2.resize(m, None, fx=0.5, fy=0.5, interpolation=cv2.INTER_AREA)
    claro = (pequeno >= 128).astype(np.uint8)
    n, rot = cv2.connectedComponents(claro, connectivity=4)
    fora = np.zeros(n, bool)
    fora[np.unique(rot[0, :])] = True
    fora[np.unique(rot[:, 0])] = True
    fora[np.unique(rot[:, -1])] = True
    fora[0] = False
    buraco = ((~fora[rot]) & (claro > 0)).astype(np.uint8) * 255
    buraco = cv2.dilate(buraco, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
    buraco = cv2.GaussianBlur(cv2.resize(buraco, (m.shape[1], m.shape[0]), interpolation=cv2.INTER_LINEAR), (0, 0), 1.5)
    return (m.astype(np.float32) * (1 - buraco / 255.0)).astype(np.uint8)


def le_quadros(ini, fim, alisa, passo):
    """Os quadros do trecho, em brilho, decodificados pelo ffmpeg no tempo exato. Cada um é a média com os dois vizinhos."""
    dur = fim - ini + 2 / FPS_ORIGEM
    le = subprocess.Popen(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-ss', f'{max(0, ini - 1 / FPS_ORIGEM):.4f}', '-i', str(ORIGEM), '-t', f'{dur:.4f}',
                           '-vf', 'fps=60', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], stdout=subprocess.PIPE)
    quadros = []
    q = -1
    while True:
        bruto = le.stdout.read(848 * 478 * 3)
        if len(bruto) < 848 * 478 * 3:
            break
        q += 1
        a = np.frombuffer(bruto, np.uint8).reshape(478, 848, 3).astype(np.float32)
        quadros.append(0.114 * a[..., 0] + 0.587 * a[..., 1] + 0.299 * a[..., 2])
        if len(quadros) < 3:
            continue
        if len(quadros) > 3:
            quadros.pop(0)
        k = q - 1                                # o quadro do meio
        if k < 1 or (k - 1) % passo:
            continue
        yield 0.25 * quadros[0] + 0.5 * quadros[1] + 0.25 * quadros[2] if alisa else quadros[1]
    le.wait()


def trilha(t, passada, th, raio, piso):
    """Onde está a cabeça em cada quadro (centro em x e topo do chapéu), alisado no tempo."""
    y0, y1 = t['segue'].get('faixa', [0.02, 0.45])
    cxs, topos = [], []
    for lum in passada():
        lum = cv2.GaussianBlur(lum, (0, 0), 1.2)
        v = (lum + piso) / (fundo_local(lum, raio) + piso)
        tinta = v < th
        faixa = tinta[int(y0 * 478):int(y1 * 478)]
        col = faixa.sum(0).astype(np.float64)
        cxs.append(float((col * np.arange(848)).sum() / max(col.sum(), 1)))
        lin = tinta.sum(1)
        cheias = np.nonzero(lin > 12)[0]
        topos.append(float(cheias[0]) if len(cheias) else 0.0)
    def alisa(v, s=10.0):
        v = np.array(v)
        k = np.exp(-0.5 * (np.arange(-30, 31) / s) ** 2)
        pad = np.pad(v, 30, mode='edge')
        return np.convolve(pad, k / k.sum(), mode='valid')
    return list(zip(alisa(cxs), alisa(topos)))


def processa(t):
    x, y, w, h = t.get('corte', [0, 0, 848, 478])
    ow, oh = t['saida']
    th, larg, raio = t.get('limiar', 0.25), t.get('largura', 0.35), t.get('raio', 110)
    piso, sig = t.get('piso', 1.5), t.get('sigma', 2.2)
    passo = t.get('passo', 2)                   # 2 = tempo real (60 -> 30 fps); 1 = câmera lenta pela metade
    passada = lambda: le_quadros(t['ini'], t['fim'], t.get('alisa_tempo', True), passo)
    segue = None
    if t.get('segue'):
        segue = trilha(t, passada, th, raio, piso)
    destino = RAIZ / 'public' / 'takes' / (t['id'] + '.mp4')
    ff = subprocess.Popen(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'gray', '-s', f'{ow}x{oh}',
                           '-r', '30', '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', str(t.get('crf', 14)), '-g', '12', '-pix_fmt', 'yuv420p',
                           '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
                           '-vf', 'scale=in_range=full:out_range=tv', '-movflags', '+faststart', str(destino)], stdin=subprocess.PIPE)
    n = 0
    for lum in passada():
        lum = cv2.GaussianBlur(lum, (0, 0), t.get('sigma_origem', 0.7))
        if t.get('modo', 'rel') == 'rel':
            v = (lum + piso) / (fundo_local(lum, raio) + piso)
        else:
            v = lum / 255.0
        if segue is not None:
            # o corte acompanha a figura: a cabeça fica parada no quadro
            cx, topo = segue[n]
            esc = ow / w
            x0 = cx - w * t['segue'].get('x', 0.5)
            y0 = topo - h * t['segue'].get('y', 0.08) if t['segue'].get('vertical') else y
            v = cv2.warpAffine(v, np.float32([[esc, 0, -x0 * esc], [0, esc, -y0 * esc]]), (ow, oh), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
        else:
            v = v[y:y + h, x:x + w]
            v = cv2.resize(v, (ow, oh), interpolation=cv2.INTER_CUBIC)
        v = cv2.GaussianBlur(v, (0, 0), sig)
        m = np.clip((v - th * (1 - larg)) / (th * 2 * larg), 0, 1)
        m = (255 * m * m * (3 - 2 * m)).astype(np.uint8)
        for r in t.get('branco', []):   # regiões forçadas a fundo (frações da saída); com 6 valores, só entre dois segundos
            bx, by, bw, bh = r[:4]
            if len(r) == 6 and not (r[4] <= n / 30 <= r[5]):
                continue
            m[int(by * oh):int((by + bh) * oh), int(bx * ow):int((bx + bw) * ow)] = 255
        if t.get('mantem') or t.get('sementes'):
            m = limpa(m, t)
        if t.get('preenche'):
            m = preenche(m)
        ff.stdin.write(m.tobytes())
        n += 1
    ff.stdin.close()
    ff.wait()
    print(f"{t['id']}: {n} quadros ({n / 30:.2f} s) {ow}x{oh} -> {destino.relative_to(RAIZ)}", flush=True)


if __name__ == '__main__':
    takes = json.loads((RAIZ / 'ferramentas' / (__import__('os').environ.get('TAKES', 'takes.json'))).read_text(encoding='utf-8'))
    quais = sys.argv[1:] or [t['id'] for t in takes]
    for t in takes:
        if t['id'] in quais:
            processa(t)

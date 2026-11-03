#!/usr/bin/env python3
"""
Monta src/data/agenda.json: para cada Short, quando cada peça de papel entra
(e sai) e onde a folha está em cada quadro.

Lê src/data/s{n}-cena.json e s{n}-pos.json, que são do pacote, e
ferramentas/tempos.json, com os grupos e os quadros estimados pelas pausas
da fala.

  python3 -I ferramentas/agenda.py

Regras do LEIA-PRIMEIRO:
- as peças entram de cima para baixo, com 2 quadros entre letras do mesmo
  bloco e 10 entre blocos (o LEIA pede de 8 a 14);
- r* e fim entram letra a letra, com passo 2. n* e GANRYŪ entram dígito a
  dígito, com passo 4. As duas têm 6 quadros de opacidade e 20 px de
  subida, sem mola;
- s* entra por varredura da esquerda, em 10 quadros;
- v* e x* são riscados de cima para baixo em 4 quadros, um traço a cada
  `passo`;
- o eixo varre de cima, e t, a e m estalam quando a varredura passa pela
  marca;
- prancha e colchete entram com escala de 1,04 para 1, em 16 quadros;
- no S1, os 48 traços que não ficam saem de 2 em 2 quadros, com 14 de
  opacidade, do último ao primeiro, antes do n12.

A janela segue a escolha do usuário: a folha desce com a escrita.
- A folha fica parada enquanto as peças entram.
- Quando um grupo cairia abaixo da caixa útil (y 1540), ela desliza na
  vertical até a peça mais baixa ficar a 30 px do fundo da caixa. O
  deslize já leva em conta os grupos seguintes do mesmo trecho, se o topo
  do grupo atual continuar dentro da caixa: menos deslizes.
- Uma peça mais alta que a caixa (a prancha do S2) fica com o topo onde o
  bloco anterior ainda aparece inteiro, sem passar do fundo da tela.
- Quando a folha volta depois de um plano, ela já volta na posição que
  serve ao maior número possível de grupos daquele trecho. Isso é um corte.
- O deslize dura 1 quadro a cada 30 px, entre 14 e 40, com seno na
  aceleração e no freio. Ele termina no quadro em que o grupo começa e só
  começa depois que a última entrada anterior terminou.
"""
import json
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DADOS = RAIZ / 'src' / 'data'
TOPO, FUNDO = 150, 1540  # caixa útil, y
ESQ, DIR = 72, 1008      # caixa útil, x
MARGEM = 30              # folga do fundo da caixa
TELA = 1920
ENTRE_BLOCOS = 10
DUR = {'letra': 6, 'digito': 6, 'varre': 10, 'risca': 4, 'estala': 2, 'escala': 16}
PASSO = {'letra': 2, 'digito': 4}
IMAGENS = ('prancha', 'colchete')  # não são peças de tipo: a caixa não vale para elas


def bloco_de(i):
    for pad in (r'^(r\d)\d\d$', r'^(n\d+?)\d\d$', r'^(fim)\d\d$', r'^(ganryu)\d\d$'):
        m = re.match(pad, i)
        if m:
            return m.group(1)
    if re.match(r'^[vx]\d', i):
        return 'tracos'
    if i == 'eixo' or re.match(r'^[tam]\d{4}$', i):
        return 'regua'
    return i


def estilo_de(i):
    if re.match(r'^(r\d{3}|fim\d\d)$', i):
        return 'letra'
    if re.match(r'^(n\d+|ganryu\d\d)$', i):
        return 'digito'
    if re.match(r'^s\d$', i):
        return 'varre'
    if re.match(r'^[vx]\d', i):
        return 'risca'
    if i == 'eixo':
        return 'eixo'
    if re.match(r'^[tam]\d{4}$', i):
        return 'estala'
    if i in IMAGENS:
        return 'escala'
    raise SystemExit(f'peça sem estilo conhecido: {i}')


def seno(p):
    import math
    return 0.5 - 0.5 * math.cos(math.pi * p)


def monta(n, tempos):
    cena = json.loads((DADOS / f's{n}-cena.json').read_text(encoding='utf-8'))
    pos = json.loads((DADOS / f's{n}-pos.json').read_text(encoding='utf-8'))
    altura = pos['altura']
    blocos = {}
    for it in pos['itens']:
        blocos.setdefault(bloco_de(it['id']), []).append(it)
    pecas = {}  # id -> agenda da peça
    avisos = []

    def agenda(it, e, estilo, d):
        if it['id'] in pecas:
            raise SystemExit(f'S{n}: {it["id"]} agendada duas vezes')
        pecas[it['id']] = dict(id=it['id'], x=it['x'], y=it['y'], w=it['w'], h=it['h'], e=int(e), d=int(d), estilo=estilo)

    # ---------------------------------------------------------- as entradas
    grupos = []
    for g in tempos:
        t = g['em']
        ids, fim_grupo = [], t
        if 'ficam' in g:
            saem = [i for i in blocos['tracos'] if i['id'] not in g['ficam']]
            if len(saem) != 48 or len(g['ficam']) != 12:
                raise SystemExit(f'S{n}: deviam sair 48 traços e ficar 12')
            for k, it in enumerate(reversed(saem)):
                pecas[it['id']]['s'] = t + 2 * k
                pecas[it['id']]['sd'] = 14
            fim_grupo = t + 2 * (len(saem) - 1) + 14
            grupos.append(dict(em=t, fim=fim_grupo, itens=saem, saida=True))
            continue
        for b in g['blocos']:
            itens = blocos[b]
            if b == 'tracos':
                passo = g.get('passo', 8)
                for k, it in enumerate(itens):
                    agenda(it, t + k * passo, 'risca', DUR['risca'])
                fim_bloco = t + (len(itens) - 1) * passo + DUR['risca']
            elif b == 'regua':
                varre = g.get('varre', 110)
                eixo = next(i for i in itens if i['id'] == 'eixo')
                agenda(eixo, t, 'eixo', varre)
                fim_bloco = t + varre
                for it in itens:
                    if it['id'] == 'eixo':
                        continue
                    marca = next(i for i in itens if i['id'] == 't' + it['id'][1:])
                    passa = t + varre * (marca['y'] + marca['h'] / 2 - eixo['y']) / eixo['h']
                    e = round(passa) + {'t': 0, 'a': 2, 'm': 4}[it['id'][0]]
                    agenda(it, e, 'estala', DUR['estala'])
                    fim_bloco = max(fim_bloco, e + DUR['estala'])
            else:
                estilo = estilo_de(itens[0]['id'])
                if estilo in PASSO:
                    itens = sorted(itens, key=lambda i: (i['x'], i['y']))
                    for k, it in enumerate(itens):
                        agenda(it, t + k * PASSO[estilo], estilo, DUR[estilo])
                    fim_bloco = t + (len(itens) - 1) * PASSO[estilo] + DUR[estilo]
                else:
                    if len(itens) != 1:
                        raise SystemExit(f'S{n}: bloco {b} com {len(itens)} peças')
                    agenda(itens[0], t, estilo, DUR[estilo])
                    fim_bloco = t + DUR[estilo]
            ids += itens
            t = fim_bloco + ENTRE_BLOCOS
            fim_grupo = fim_bloco
        grupos.append(dict(em=g['em'], fim=fim_grupo, itens=ids, saida=False))

    faltam = [i['id'] for i in pos['itens'] if i['id'] not in pecas]
    if faltam:
        raise SystemExit(f'S{n}: peças sem agenda: {faltam}')

    # ------------------------------------------------------------- a janela
    def faixa(g):
        return min(i['y'] for i in g['itens']), max(i['y'] + i['h'] for i in g['itens'])

    def alta(g):
        y0, y1 = faixa(g)
        return y1 - y0 > FUNDO - MARGEM - (TOPO + 20)

    def precisa(g, anterior):
        """O menor T (topo da janela, em y da folha) que serve ao grupo."""
        y0, y1 = faixa(g)
        if alta(g):
            lo, hi = y1 - (TELA - MARGEM), y0 - (TOPO + 20)
            alvo = faixa(anterior)[0] - TOPO if anterior else hi
            return max(lo, min(hi, alvo))
        return y1 - (FUNDO - MARGEM)

    def teto(g):
        """O maior T em que o topo do grupo ainda fica dentro da caixa (ou na tela, se é saída)."""
        y0 = faixa(g)[0]
        return y0 - (20 if g['saida'] else TOPO + 20)

    janela = []
    T = 0
    for k, (a, b, _desc) in enumerate(cena['papel']):
        gs = [g for g in grupos if a <= g['em'] < b]
        if not gs:
            continue
        lim = teto(gs[0])
        alvo = T if k else 0
        anterior = None
        for g in gs:
            nec = precisa(g, anterior)
            if nec > lim:
                break
            alvo = max(alvo, nec)
            anterior = g
        if k == 0 and alvo > 0:
            janela.append([a, a, 0, alvo])
        elif k and alvo != T:
            janela.append([a, a, T, alvo])  # corte: a folha volta noutra altura
        T = alvo
        fim_ant = a
        anterior = None
        for i, g in enumerate(gs):
            nec = precisa(g, anterior)
            if nec > T:
                lim = teto(g)
                alvo = nec
                # blocos já escritos: o deslize não olha adiante se isso deixar
                # um deles reduzido a uma tira no topo da tela
                feitos = {}
                for p in pecas.values():
                    if p['e'] + p['d'] <= g['em']:
                        b = bloco_de(p['id'])
                        y0, y1 = feitos.get(b, (p['y'], p['y'] + p['h']))
                        feitos[b] = (min(y0, p['y']), max(y1, p['y'] + p['h']))

                def tira(t):
                    return any(y0 < t < y1 and y1 - t < min(200, 0.35 * (y1 - y0)) for y0, y1 in feitos.values())

                for h in gs[i + 1:]:
                    nh = precisa(h, g)
                    if nh > lim or (nh > alvo and tira(nh)):
                        break
                    alvo = max(alvo, nh)
                dist = alvo - T
                dur = max(14, min(40, round(dist / 30)))
                f1 = g['em']
                f0 = max(fim_ant + 2, f1 - dur)
                if f1 - f0 < 10:
                    avisos.append(f'deslize curto antes de f{f1}: {f1 - f0} quadros para {dist} px')
                janela.append([f0, f1, T, alvo])
                T = alvo
            fim_ant = max(fim_ant, g['fim'])
            anterior = g

    max_t = max([j[3] for j in janela] + [0])
    estende = max(0, max_t - (altura - TELA))

    # ------------------------------------------------------------ conferência
    def t_em(f):
        t = 0
        for f0, f1, t0, t1 in janela:
            if f >= f1:
                t = t1
            elif f >= f0:
                return t0 + (t1 - t0) * seno((f - f0) / (f1 - f0))
        return t

    for p in pecas.values():
        tela_y = p['y'] - t_em(p['e'])
        if p['id'] in IMAGENS:
            if tela_y < 0 or tela_y + p['h'] > TELA:
                avisos.append(f'{p["id"]} sai da tela ao entrar: y {tela_y:.0f}-{tela_y + p["h"]:.0f}')
            continue
        if tela_y < TOPO or tela_y + p['h'] > FUNDO or p['x'] < ESQ or p['x'] + p['w'] > DIR:
            avisos.append(f'{p["id"]} fora da caixa ao entrar (f{p["e"]}): x {p["x"]}-{p["x"] + p["w"]}, y {tela_y:.0f}-{tela_y + p["h"]:.0f}')
        for f0, f1, _t0, _t1 in janela:
            if f0 < p['e'] + p['d'] and p['e'] < f1 and f0 != f1:
                avisos.append(f'{p["id"]} entra durante um deslize (f{p["e"]}, deslize f{f0}-{f1})')
    for g in grupos:
        papel = next(((a, b) for a, b, _ in cena['papel'] if a <= g['em'] < b), None)
        if papel is None or g['fim'] > papel[1]:
            avisos.append(f'grupo de f{g["em"]} não cabe no trecho de papel {papel}')

    tam = {}
    for a, b, plano, leg, _desc in cena['planos']:
        if leg:
            from PIL import Image
            tam[leg] = Image.open(RAIZ / 'public' / f'{leg}.png').size
    planos = [[a, b, plano, leg, *(tam[leg] if leg else (0, 0))] for a, b, plano, leg, _ in cena['planos']]
    out = dict(dur=cena['dur'], altura=altura, estende=estende, planos=planos,
               papel=[[a, b] for a, b, _ in cena['papel']], janela=janela,
               pecas=sorted(pecas.values(), key=lambda p: p['e']))
    return out, avisos


def main():
    tempos = json.loads((RAIZ / 'ferramentas' / 'tempos.json').read_text(encoding='utf-8'))
    tudo = {}
    for n in (1, 2, 3, 4):
        out, avisos = monta(n, tempos[f's{n}'])
        tudo[f's{n}'] = out
        print(f'S{n}: {len(out["pecas"])} peças, janela {out["janela"]}, estende {out["estende"]} px')
        for a in avisos:
            print('   aviso:', a)
    (DADOS / 'agenda.json').write_text(json.dumps(tudo, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print('pronto: src/data/agenda.json')


if __name__ == '__main__':
    main()

import React from 'react';
import { AbsoluteFill } from 'remotion';
import { c01, COR, entraSai, H, mix, prog, rnd, saiExpo, saiVolta, tremores, W } from '../kit/base';
import { Brasas, Camera, Clarao, Papel, Poeira, Raios, Sol } from '../kit/Cena';
import { Carimbo, Etiqueta, Traco } from '../kit/Pecas';
import { A, Cinetico, Cz, D, Hodometro, O, Sl } from '../kit/Texto';
import { Mancha, Tinta } from '../kit/Tinta';
import { ALVO, Pagina, VistaDaPagina } from './Pagina';
import { C, q, qp } from './tempo';

/**
 * 0,8-3,9 · "O Velho Oeste não acabou no tiroteio ao meio-dia,"
 * Arthur vem andando pela rua, em tinta sobre ouro. No "tiroteio" a tela
 * estala; no "meio-dia" o sol sobe atrás do título.
 */
export const Abertura: React.FC<{ f: number }> = ({ f }) => {
  const tiro = qp('tiroteio');
  const meio = qp('meio-dia');
  const tr = tremores(f, [[tiro, 30, 14]]);
  const pulso = f >= tiro ? 1 + 0.08 * Math.pow(1 - prog(f, tiro, 12), 2) : 1;
  const sol = saiVolta(prog(f, meio, 13), 1.2);
  return (
    <Papel cor={COR.ouro}>
      <Camera fundo={COR.ouro} x={tr.x} y={tr.y} rot={tr.rot} escala={1.03}>
        <Raios f={f} x={540} y={372} op={0.12} />
        <Sol x={540} y={372} r={262} cor={COR.sangue} escala={sol} />
        {/* TIROTEIO fica atrás da figura: a tinta passa por cima das letras */}
        {f >= tiro && (
          <div style={{ position: 'absolute', left: 0, width: W, top: 800, textAlign: 'center', ...A(252, COR.sangue), transform: `scale(${(1 + 0.5 * Math.pow(1 - prog(f, tiro, 6), 3)).toFixed(4)})`, opacity: c01((f - tiro + 1) / 2) }}>
            TIROTEIO
          </div>
        )}
        <Mancha arq="mancha-3.png" x={170} y={640} w={760} cor={COR.sangue} giro={24} escala={f >= tiro ? saiExpo(prog(f, tiro, 5)) : 0} op={0.92} />
        <Tinta
          take="rua"
          k={16 + f}
          style={{
            transform: `scale(${pulso.toFixed(4)})`,
            transformOrigin: '50% 62%',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 15%, #000 31%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 15%, #000 31%)',
          }}
        />
        {/* o título */}
        <Cinetico texto="O VELHO" f={f} ini={qp('O')} por="letra" passo={1.1} dur={9} estilo="foco" style={{ position: 'absolute', left: 0, width: W, top: 196, textAlign: 'center', ...Cz(112, COR.tinta, 0.26, { fontWeight: 700, paddingLeft: '0.26em' }) }} />
        <Cinetico texto="OESTE" f={f} ini={qp('Oeste')} por="letra" passo={1.1} dur={9} estilo="foco" style={{ position: 'absolute', left: 0, width: W, top: 326, textAlign: 'center', ...Cz(112, COR.tinta, 0.26, { fontWeight: 700, paddingLeft: '0.26em' }) }} />
        <Cinetico
          texto="NÃO ACABOU"
          f={f}
          ini={qp('não')}
          tempos={[qp('não'), qp('acabou')]}
          por="palavra"
          dur={7}
          estilo="mascara"
          style={{ position: 'absolute', left: 0, width: W, top: 468, textAlign: 'center', ...O(58, COR.tinta, 0.34, { paddingLeft: '0.34em' }) }}
        />
        <Etiqueta f={f} t0={qp('no')} fim={meio} x={540} y={1408} texto="no tiroteio" tam={58} centro giro={-2} />
        <Etiqueta f={f} t0={meio} x={540} y={1408} texto="ao meio-dia" tam={58} centro giro={2} fundo={COR.sangue} />
      </Camera>
      <Clarao f={f} ini={tiro} dur={8} forca={0.95} />
    </Papel>
  );
};

/**
 * 3,9-5,0 · "acabou numa tabela."
 * A cena inteira encolhe e vira uma casa da tabela de densidade do censo:
 * a linha "menos de 2 habitantes por milha quadrada".
 */
const TOPO = 410;
const CEL = { x: 366, y: TOPO + 154, w: 216, h: 154 };
const CLASSES = ['MENOS DE 2', '2 A 6', '6 A 18', '18 A 45', '45 A 90', '90 OU MAIS'];
export const Tabela: React.FC<{ f: number }> = ({ f }) => {
  const f0 = q(C.tabela);
  const bate = qp('tabela');
  const e = saiExpo(prog(f, f0, 12));
  const esc = mix(1, CEL.w / W, e);
  const cx = mix(540, CEL.x + CEL.w / 2, e);
  const cy = mix(960, CEL.y + CEL.h / 2, e);
  const clip = `inset(${mix(0, CEL.y, e).toFixed(1)}px ${mix(0, W - CEL.x - CEL.w, e).toFixed(1)}px ${mix(0, H - CEL.y - CEL.h, e).toFixed(1)}px ${mix(0, CEL.x, e).toFixed(1)}px)`;
  const tr = tremores(f, [[bate, 22, 12]]);
  const lin = (i: number) => saiExpo(prog(f, f0 + 1 + i * 1.2, 9));
  const xs = [66, 366, 582, 798, 1014];
  return (
    <Papel cor={COR.papel}>
      <Camera fundo={COR.papel} x={tr.x} y={tr.y} rot={tr.rot}>
        {/* a grade */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={`h${i}`} style={{ position: 'absolute', left: 66, top: TOPO + i * 154 - (i === 0 || i === 7 ? 3 : 1), width: 948, height: i === 0 || i === 1 || i === 7 ? 6 : 3, background: COR.tinta, transform: `scaleX(${lin(i).toFixed(4)})`, transformOrigin: i % 2 ? 'left' : 'right' }} />
        ))}
        {xs.map((x, i) => (
          <div key={`v${i}`} style={{ position: 'absolute', left: x - (i === 0 || i === 4 ? 3 : 1), top: TOPO, width: i === 0 || i === 1 || i === 4 ? 6 : 3, height: 1078, background: COR.tinta, transform: `scaleY(${lin(i + 2).toFixed(4)})`, transformOrigin: 'top' }} />
        ))}
        {/* cabeçalho */}
        <div style={{ position: 'absolute', left: 82, top: TOPO + 32, width: 270, ...O(28, COR.tinta, 0.1, { lineHeight: 1.25, opacity: lin(3) }) }}>
          habitantes por
          <br />
          milha quadrada
        </div>
        {['ÁREA', 'GENTE', '%'].map((r, i) => (
          <div key={r} style={{ position: 'absolute', left: xs[i + 1], top: TOPO + 46, width: 216, textAlign: 'center', ...O(40, COR.tinta, 0.2, { opacity: lin(3 + i) }) }}>
            {r}
          </div>
        ))}
        {/* as classes e os números */}
        {CLASSES.map((c, i) => (
          <React.Fragment key={c}>
            <div style={{ position: 'absolute', left: 82, top: TOPO + (i + 1) * 154 + 52, ...Sl(i === 0 ? 33 : 34, i === 0 ? COR.sangue : COR.tinta, { opacity: lin(4 + i) }) }}>{c}</div>
            {[0, 1, 2].map((j) =>
              i === 0 && j === 0 ? null : (
                <div key={j} style={{ position: 'absolute', left: xs[j + 1], top: TOPO + (i + 1) * 154 + 50, width: 216, textAlign: 'center', ...D(46, COR.tinta, { opacity: 0.85 * lin(5 + i + j), fontVariantNumeric: 'tabular-nums' }) }}>
                  {j === 2 ? `${(rnd(i, j, Math.floor(f / 3)) * 60).toFixed(1).replace('.', ',')}` : `${Math.floor(rnd(i, j, Math.floor(f / 3)) * 900 + 100)}.${String(Math.floor(rnd(i, j, 7, Math.floor(f / 2)) * 1000)).padStart(3, '0')}`}
                </div>
              ),
            )}
          </React.Fragment>
        ))}
        {/* a cena anterior, encolhendo até caber numa casa */}
        <div style={{ position: 'absolute', inset: 0, clipPath: clip }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: `translate(${(cx - 540 * esc).toFixed(2)}px, ${(cy - 960 * esc).toFixed(2)}px) scale(${esc.toFixed(5)})` }}>
            <Abertura f={f0 - 1} />
          </div>
        </div>
        {/* moldura vermelha na casa dele */}
        <div style={{ position: 'absolute', left: CEL.x - 5, top: CEL.y - 5, width: CEL.w + 10, height: CEL.h + 10, border: `8px solid ${COR.vermelho}`, boxSizing: 'border-box', opacity: c01((e - 0.85) * 8) }} />
        <Cinetico texto="ACABOU NUMA" f={f} ini={f0 + 1} tempos={[f0 + 1, qp('numa')]} por="palavra" dur={6} estilo="mascara" style={{ position: 'absolute', left: 0, width: W, top: 104, textAlign: 'center', ...O(54, COR.tinta, 0.34, { paddingLeft: '0.34em' }) }} />
        <Carimbo f={f} t0={bate} x={540} y={308} linhas={['TABELA']} tam={128} cor={COR.sangue} giro={-4} />
      </Camera>
    </Papel>
  );
};

/**
 * 5,0-7,5 · "20 de abril de 1891,"
 * Noite. O perfil dele contra a lua, e a data carimbada por cima.
 */
export const Data: React.FC<{ f: number }> = ({ f }) => {
  const f0 = q(C.data);
  const t20 = qp('20');
  const tAbril = qp('abril');
  const tAno = qp('1891');
  const tr = tremores(f, [
    [t20, 16, 9],
    [tAbril, 12, 8],
    [tAno, 26, 13],
  ]);
  const sobe = saiExpo(prog(f, f0, 26));
  return (
    <Papel cor={COR.noite}>
      <Camera fundo={COR.noite} x={tr.x} y={tr.y} rot={tr.rot} escala={1.02 + 0.03 * prog(f, f0, 80)}>
        <Sol x={560} y={mix(1140, 960, sobe)} r={430} cor={COR.osso} halo="rgba(244,236,216,0.22)" />
        <Tinta take="lua" k={70 + (f - f0) * 1.0} y={570} />
        <div style={{ position: 'absolute', left: 0, top: 1900, width: W, height: 60, background: COR.tinta }} />
        <Poeira f={f} cor={COR.osso} forca={0.5} n={26} />
        {/* a data */}
        {f >= t20 && (
          <div style={{ position: 'absolute', left: 84, top: 150, ...A(214, COR.osso), transform: `scale(${(1 + 0.9 * Math.pow(1 - prog(f, t20, 5), 3)).toFixed(4)})`, transformOrigin: '20% 50%' }}>20</div>
        )}
        {f >= tAbril && (
          <div style={{ position: 'absolute', left: 300, top: 186, ...A(118, COR.osso), transform: `scale(${(1 + 0.9 * Math.pow(1 - prog(f, tAbril, 5), 3)).toFixed(4)})`, transformOrigin: '30% 50%' }}>
            DE ABRIL
          </div>
        )}
        {f >= qp('de', 2) && <div style={{ position: 'absolute', left: 310, top: 312, ...O(44, COR.osso, 0.5), opacity: prog(f, qp('de', 2), 4) }}>de</div>}
        {f >= tAno && (
          <div style={{ position: 'absolute', left: 78, top: 350, ...A(318, COR.vermelho, { letterSpacing: '0.01em' }), transform: `scale(${(1 + 1.2 * Math.pow(1 - prog(f, tAno, 6), 3)).toFixed(4)})`, transformOrigin: '50% 50%' }}>1891</div>
        )}
      </Camera>
      <Clarao f={f} ini={tAno} dur={5} forca={0.35} cor={COR.vermelho} />
    </Papel>
  );
};

/**
 * 7,5-20,7 · O boletim: Washington, o cabeçalho, o título e a assinatura.
 * A página é montada no tempo da fala, e a câmera desce por ela.
 */
export const Boletim: React.FC<{ f: number }> = ({ f }) => {
  const f0 = q(C.boletim);
  const tTit = qp('“Distribuição') - 8;
  const tAss = qp('assinado') - 6;
  // o ponto da página que fica no meio da tela
  const py = mix(mix(mix(1010, 960, saiExpo(prog(f, f0, 18))), 1340, entraSai(prog(f, tTit, 22))), 2010, entraSai(prog(f, tAss, 24)));
  const s = 1 + 0.035 * prog(f, f0, 130) + 0.05 * prog(f, tAss + 24, 110);
  const entra = saiExpo(prog(f, f0, 12));
  return (
    <Papel cor={COR.noite}>
      <VistaDaPagina py={py} s={s} sy={mix(2400, 960, entra)} rot={mix(4, 0, entra)}>
        <Pagina f={f} />
      </VistaDaPagina>
    </Papel>
  );
};

/**
 * 20,7-24,7 · "É um documento de escritório: coluna, número, assinatura."
 * A página recua para cima da mesa; depois, três batidas.
 */
export const Escritorio: React.FC<{ f: number }> = ({ f }) => {
  const f0 = q(C.escritorio);
  const tCol = qp('coluna');
  const tNum = qp('número', 2);
  const tAss = qp('assinatura');
  if (f < tCol) {
    const e = entraSai(prog(f, f0, 20));
    return (
      <Papel cor={COR.noite}>
        <AbsoluteFill style={{ background: 'radial-gradient(ellipse 70% 46% at 50% 44%, rgba(233,168,43,0.22) 0%, rgba(0,0,0,0) 70%)' }} />
        <VistaDaPagina py={mix(2010, 1150, e)} s={mix(1.08, 0.5, e)} sy={mix(960, 850, e)} rot={mix(0, -5, e) + 0.6 * Math.sin(f / 30)}>
          <Pagina f={99999} />
        </VistaDaPagina>
        <Poeira f={f} cor={COR.ouro} forca={0.6} n={30} />
      </Papel>
    );
  }
  const tr = tremores(f, [
    [tCol, 22, 9],
    [tNum, 22, 9],
    [tAss, 22, 10],
  ]);
  const caso = f >= tAss ? 2 : f >= tNum ? 1 : 0;
  const t0 = [tCol, tNum, tAss][caso];
  const bate = 1 + 0.5 * Math.pow(1 - prog(f, t0, 5), 3);
  return (
    <Papel cor={[COR.ouro, COR.sangue, COR.papel][caso]}>
      <Camera fundo={[COR.ouro, COR.sangue, COR.papel][caso]} x={tr.x} y={tr.y} rot={tr.rot}>
        {caso === 0 && (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={{ position: 'absolute', left: 120 + i * 210 - 7, top: 0, width: 14, height: H, background: COR.tinta, transform: `scaleY(${saiExpo(prog(f, tCol + i * 0.8, 6)).toFixed(4)})`, transformOrigin: 'top' }} />
            ))}
            {[0, 1, 2, 3].map((i) =>
              [0, 1, 2, 3, 4, 5, 6, 7].map((j) => <div key={`${i}-${j}`} style={{ position: 'absolute', left: 150 + i * 210, top: 250 + j * 190, width: 150 * (0.5 + rnd(i, j) * 0.5), height: 16, background: COR.tinta, opacity: 0.32 }} />),
            )}
            <div style={{ position: 'absolute', left: 0, width: W, top: 800, textAlign: 'center', transform: `scale(${bate.toFixed(4)})` }}>
              <span style={{ ...A(250, COR.tinta), background: COR.ouro, padding: '0 28px' }}>COLUNA</span>
            </div>
          </>
        )}
        {caso === 1 && (
          <>
            <div style={{ position: 'absolute', left: 0, width: W, top: 300, textAlign: 'center', ...A(420, 'rgba(18,10,7,0.3)') }}>
              <Hodometro valor={(f - tNum) * 37.3 + 1890} casas={4} />
            </div>
            <div style={{ position: 'absolute', left: 0, width: W, top: 1180, textAlign: 'center', ...A(420, 'rgba(18,10,7,0.3)') }}>
              <Hodometro valor={9999 - (f - tNum) * 53.1} casas={4} />
            </div>
            <div style={{ position: 'absolute', left: 0, width: W, top: 800, textAlign: 'center', ...A(250, COR.osso), transform: `scale(${bate.toFixed(4)})` }}>NÚMERO</div>
          </>
        )}
        {caso === 2 && (
          <>
            <div style={{ position: 'absolute', left: 60, top: 560, width: 1000, transform: 'rotate(-7deg)' }}>
              <div style={{ width: `${(c01((f - tAss) / 10) * 100).toFixed(1)}%`, overflow: 'hidden', whiteSpace: 'nowrap', padding: '40px 0 90px' }}>
                <span style={{ fontFamily: "'RS Assina', cursive", fontSize: 250, color: COR.tinta, lineHeight: 1.1, paddingRight: 80 }}>R. P. Porter</span>
              </div>
            </div>
            <Traco f={f} t0={tAss + 3} dur={8} x={120} y={1010} w={840} h={8} cor={COR.vermelho} giro={-4} />
            <div style={{ position: 'absolute', left: 0, width: W, top: 1110, textAlign: 'center', ...A(196, COR.tinta), transform: `scale(${bate.toFixed(4)})` }}>ASSINATURA</div>
          </>
        )}
      </Camera>
      <Clarao f={f} ini={t0} dur={4} forca={0.5} />
    </Papel>
  );
};

/**
 * 24,7-28,6 · "E o que ele diz é que a linha da fronteira não existe mais."
 * Ele no alto do morro, ao lado da linha. No "não existe mais" a linha se
 * desfaz em cacos e o cavalo empina.
 */
export const Linha: React.FC<{ f: number }> = ({ f }) => {
  const f0 = q(C.linha);
  const tLinha = qp('linha');
  const tNao = qp('não', 2);
  const tr = tremores(f, [[tNao, 24, 14]]);
  const k = Math.max(0, 292 + (f - tNao) * 1.45);
  const desenha = saiExpo(prog(f, tLinha, 14));
  const cai = f - tNao;
  const X = 252;
  const cacos = [];
  for (let i = 0; i < 16; i++) {
    const y0 = i * 86;
    const h = 86 * desenha;
    let dx = 0;
    let dy = 0;
    let rot = 0;
    let op = 1;
    if (cai >= 0) {
      const atraso = rnd(i, 3) * 5;
      const tt = Math.max(0, cai - atraso);
      dx = (rnd(i, 1) - 0.5) * 30 * tt;
      dy = 0.9 * tt * tt + (rnd(i, 4) - 0.7) * 14 * tt;
      rot = (rnd(i, 2) - 0.5) * 16 * tt;
      op = 1 - prog(tt, 12, 14);
    }
    if (y0 > 1330 || i * 86 > 1376 * desenha) continue;
    cacos.push(<div key={i} style={{ position: 'absolute', left: X - 9 + dx, top: y0 + dy, width: 18, height: Math.min(h, 80), background: COR.sangue, transform: `rotate(${rot.toFixed(2)}deg)`, opacity: op }} />);
  }
  return (
    <Papel cor={COR.ouro}>
      <Camera fundo={COR.ouro} x={tr.x} y={tr.y} rot={tr.rot} escala={1.02 + 0.04 * prog(f, f0, 118)} origem="50% 60%">
        <Raios f={f} x={600} y={1020} op={0.1} />
        <Sol x={600} y={1020} r={330} cor={COR.sangue} />
        {cacos}
        <Tinta take="morro" k={k} y={386} />
        <div style={{ position: 'absolute', left: 0, top: 1816, width: W, height: 140, background: COR.tinta }} />
        {/* o nome da linha, de pé ao lado dela */}
        <div style={{ position: 'absolute', left: 150, top: 1180, transform: 'rotate(-90deg)', transformOrigin: '0 0', whiteSpace: 'nowrap', ...Cz(40, COR.tinta, 0.42, { fontWeight: 700 }), opacity: c01(desenha * 2 - 0.6) * (1 - prog(f, tNao, 6)) }}>
          a linha da fronteira · 1880
        </div>
        {f >= tNao && (
          <Cinetico
            texto={'NÃO EXISTE\nMAIS'}
            f={f}
            ini={tNao}
            tempos={[tNao, qp('existe'), qp('mais')]}
            por="palavra"
            dur={6}
            estilo="bate"
            style={{ position: 'absolute', left: 0, width: W, top: 250, textAlign: 'center', ...A(172, COR.tinta, { lineHeight: 1.0 }) }}
          />
        )}
      </Camera>
      <Clarao f={f} ini={tNao} dur={5} forca={0.5} />
    </Papel>
  );
};

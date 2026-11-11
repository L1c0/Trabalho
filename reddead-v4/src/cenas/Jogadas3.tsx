import React from 'react';
import { AbsoluteFill } from 'remotion';
import { c01, COR, mix, prog, rnd, saiCubica, saiExpo, W } from '../kit/base';
import { Jogo } from '../kit/Jogo';
import { Centro, Eletrico, Etiqueta, Impacto, Maquina, Sombra, Tarja } from '../kit/Letreiro';
import { Grade, Legenda, Tique } from '../kit/Pecas';
import { Cinetico, Risco } from '../kit/Texto';
import { A, em, O, S } from '../kit/tipos';
import { s } from '../tempo';
import { soco } from './Jogadas1';

const P = (...seg: number[]) => seg.map(s);
type Cena = { f: number; clipes: boolean };

/** Lâmpada que acende falhando: quanto escurecer a imagem nos primeiros quadros. */
const acende = (f: number, ini: number, dur = 16) => {
  if (f < ini || f >= ini + dur) return 0;
  const t = (f - ini) / dur;
  return rnd(f, ini) > 0.35 + 0.6 * t ? 0.92 : 0.15 * (1 - t);
};

/** 518,4-566,2 s · Saint Denis: o futuro já tinha chegado */
export const SaintDenis: React.FC<Cena> = ({ f, clipes }) => {
  const c = f < 16230 ? 0 : f < 16650 ? 1 : 2;
  const arq = ['c21-G.mp4', 'c22-H.mp4', 'c23-I.mp4'][c];
  const k = f - [15566, 16230, 16650][c];
  const cor = [
    { sat: 0.7, temp: -0.5, brilho: 1.35 },
    { sat: 0.9, temp: -0.45, brilho: 1.12 },
    { sat: 0.75, temp: -0.3, brilho: 1.12 },
  ][c];
  const de = [15552, 16230, 16650][c];
  const ate = [16230, 16650, 16986][c];
  return (
    <Jogo arq={arq} k={k} f={f} id="c21" clipes={clipes} cor={cor} zoom={1.02 + 0.04 * prog(f, de, ate - de) + soco(f, s(551.26), 0.05)} escurece={acende(f, 15552) + acende(f, 16230) + acende(f, s(551.2), 8)}>
      <Sombra f={f} ini={s(518.5)} fim={s(566.0)} forca={0.82} />
      <Tarja f={f} ini={s(518.52)} fim={s(526.4)} texto="TEM UM MOMENTO EM QUE O ARTHUR CHEGA EM" y={452} tam={38} tempos={P(518.52, 518.96, 519.04, 519.88, 520.04, 520.12, 520.24, 520.42, 520.76)} />
      <Eletrico f={f} ini={s(520.9)} fim={s(526.4)} texto="SAINT DENIS" y={530} tam={236} />
      <Etiqueta f={f} ini={s(522.32)} fim={s(526.4)} texto="BONDE" x={1300} y={190} tam={52} giro={-3} />
      <Etiqueta f={f} ini={s(523.12)} fim={s(526.4)} texto="LUZ ELÉTRICA" x={1420} y={296} tam={52} giro={2} fundo="#F4F1E6" />
      <Etiqueta f={f} ini={s(524.02)} fim={s(526.4)} texto="FUMAÇA DE FÁBRICA" x={1250} y={402} tam={52} giro={-2} />
      <Etiqueta f={f} ini={s(525.28)} fim={s(526.4)} texto="GENTE DE GRAVATA" x={1330} y={620} tam={52} giro={3} />
      <Tarja f={f} ini={s(526.58)} fim={s(531.6)} texto="E ELE PARADO NO MEIO DAQUILO" y={748} tempos={P(526.58, 527.38, 527.54, 527.96, 528.1, 528.28)} />
      <Tarja f={f} ini={s(528.6)} fim={s(531.6)} texto="DE CHAPÉU DE COWBOY E REVÓLVER NO COLDRE" y={820} cor={COR.creme} tempos={P(528.66, 528.82, 529.24, 529.34, 529.7, 530.22, 530.58, 530.76)} />
      <Legenda f={f} ini={s(531.9)} fim={s(533.4)} x={140} y={500} texto="PARECENDO" tam={34} cor={COR.papel} />
      <Impacto f={f} ini={s(532.3)} fim={s(533.4)} texto={'ERRO DE\nFIGURINO.'} y={548} tam={176} tempos={P(532.38, 532.6, 532.76)} por="palavra" />
      <Tarja f={f} ini={s(533.54)} fim={s(537.2)} texto="O QUE MAIS ME IMPRESSIONA:" y={540} tempos={P(533.72, 533.78, 533.86, 534.08, 534.22)} />
      <Impacto f={f} ini={s(535.6)} fim={s(537.2)} texto={'NÃO É LICENÇA\nPOÉTICA.'} y={620} tam={140} tempos={P(535.84, 535.98, 536.06, 536.44)} por="palavra" />
      <Tarja f={f} ini={s(539.1)} fim={s(540.9)} texto="A CIDADE REAL POR TRÁS DE SAINT DENIS" y={452} tam={38} tempos={P(539.2, 539.32, 539.52, 539.88, 540.14, 540.42, 540.54, 540.68)} />
      <Eletrico f={f} ini={s(537.6)} fim={s(540.9)} texto="NOVA ORLEANS" y={530} tam={220} brilho="#ffd9a0" />
      <Impacto f={f} ini={s(541.1)} fim={s(545.5)} texto="O BONDE ELÉTRICO" y={470} tam={136} tempos={P(541.14, 541.3, 541.54)} por="palavra" destaque={{ 2: '#F4F1E6' }} />
      <Tarja f={f} ini={s(541.9)} fim={s(545.5)} texto="JÁ TINHA SUBSTITUÍDO A MULA" y={648} tempos={P(541.92, 542.08, 542.26, 542.88, 543.0)} />
      <Tarja f={f} ini={s(543.2)} fim={s(545.5)} texto="EM MEADOS DA DÉCADA DE 1890" y={720} cor={COR.creme} tempos={P(543.28, 543.42, 543.7, 543.92, 544.28, 544.42)} />
      <Maquina f={f} ini={s(546.3)} fim={s(549.3)} texto={'linha Annunciation:\neletrificada em 1895.'} y={600} tam={54} cps={15} />
      <Tarja f={f} ini={s(549.46)} fim={s(552.0)} texto="EM 1899 AQUELA CIDADE ERA" y={500} tempos={P(549.46, 549.56, 550.4, 550.68, 551.04)} />
      <Eletrico f={f} ini={s(551.22)} fim={s(552.0)} texto="ELÉTRICA." y={580} tam={260} />
      <Tarja f={f} ini={s(552.08)} fim={s(554.95)} texto="NÃO É QUE O FUTURO ESTAVA CHEGANDO." y={520} tempos={P(552.5, 552.62, 552.68, 552.76, 552.84, 553.12, 553.38)} />
      <Impacto f={f} ini={s(553.9)} fim={s(554.95)} texto={'O FUTURO JÁ\nTINHA CHEGADO.'} y={600} tam={146} tempos={P(553.92, 554.12, 554.44, 554.6, 554.8)} por="palavra" />
      <Tarja f={f} ini={s(555.2)} fim={s(559.2)} texto="ELE ESTAVA ALI, FUNCIONANDO." y={500} tempos={P(555.2, 555.62, 555.88, 556.08)} />
      <Impacto f={f} ini={s(556.8)} fim={s(559.2)} texto="A 2 DIAS DE CAVALO" y={580} tam={136} tempos={P(556.82, 557.2, 557.38, 557.56, 557.7)} por="palavra" />
      <Tarja f={f} ini={s(558.0)} fim={s(559.2)} texto="DO ACAMPAMENTO." y={750} cor={COR.creme} tempos={P(558.02, 558.12)} />
      <Centro
        f={f}
        ini={s(559.6)}
        fim={s(562.3)}
        y={330}
        escurece={0.5}
        vao={14}
        linhas={[
          { texto: 'O BANDO SIMPLESMENTE', tempos: P(559.6, 560.08, 560.44), fonte: 'oswald', tam: 54, estilo: 'sobe' },
          { texto: 'NUNCA FOI VER.', tempos: P(561.02, 561.44, 561.66), tam: 220 },
        ]}
      />
      <Tarja f={f} ini={s(562.5)} fim={s(566.05)} texto="VOLTA PRO ARTHUR." y={748} tempos={P(562.52, 563.0, 563.16)} />
      <Tarja f={f} ini={s(563.7)} fim={s(566.05)} texto="A ÚLTIMA PARTE DO JOGO É ESTRANHA DE JOGAR" y={820} cor={COR.creme} tempos={P(563.78, 563.92, 564.1, 564.42, 564.56, 564.76, 564.84, 565.2, 565.3)} />
    </Jogo>
  );
};

/** 566,2-601,8 s · o jogo para de dar missões e começa a dar contas */
export const Contas: React.FC<Cena> = ({ f, clipes }) => {
  const ini = 16986;
  const prazo = 1 - prog(f, s(572.0), s(600.5) - s(572.0));
  const linhas: [string, number, number[]][] = [
    ['VOLTA AONDE FEZ ESTRAGO', 579.02, [579.02, 579.7, 580.02, 580.28]],
    ['PROCURA QUEM PREJUDICOU', 580.92, [580.92, 581.44, 581.6]],
    ['DEVOLVE DINHEIRO', 582.42, [582.42, 582.68]],
    ['ENTREGA CARTAS QUE NÃO SÃO DELE', 583.32, [583.32, 583.76, 584.12, 584.26, 584.4, 584.58]],
    ['ESCREVE NO DIÁRIO O QUE NUNCA DIRIA EM VOZ ALTA', 585.36, [585.36, 585.86, 586.0, 586.38, 586.68, 586.86, 587.06, 587.38, 587.46, 587.64]],
  ];
  const fimLista = s(588.6);
  const premios: [string, number, number][] = [
    ['ARMA NOVA', 591.32, 250],
    ['NÍVEL', 592.26, 790],
    ['CONQUISTA', 593.58, 1150],
  ];
  return (
    <Jogo arq="c24-A.mp4" k={f - ini} f={f} id="c24" clipes={clipes} cor={{ sat: 0.5, temp: 0.1 }} zoom={1.02 + 0.04 * prog(f, ini, 1068) + soco(f, s(568.44), 0.05)} escurece={prog(f, s(601.1), 20)}>
      <Sombra f={f} ini={s(566.1)} fim={s(601.0)} forca={0.84} />
      {/* o prazo corre no alto da tela */}
      {f >= s(571.9) && (
        <div style={{ opacity: saiExpo(prog(f, s(571.9), 10)) * (1 - prog(f, s(600.6), 12)) }}>
          <div style={em(135, 166, O(24, COR.vermelho, 0.4))}>PRAZO</div>
          <div style={{ ...em(260, 176), width: 1525, height: 8, background: 'rgba(233,198,147,0.2)' }} />
          <div style={{ ...em(260, 176), width: 1525 * prazo, height: 8, background: COR.vermelho }} />
        </div>
      )}
      <Tarja f={f} ini={s(566.1)} fim={s(567.8)} texto="E É ESTRANHA DE PROPÓSITO." y={800} tempos={P(566.1, 566.44, 566.52, 566.86, 566.96)} />
      <Impacto f={f} ini={s(567.96)} fim={s(568.95)} texto="ELE SABE." y={560} tam={230} tempos={P(568.0, 568.44)} por="palavra" />
      <Tarja f={f} ini={s(569.02)} fim={s(571.75)} texto="TEM A INFORMAÇÃO QUE NINGUÉM DO BANDO TEM" y={800} tempos={P(569.26, 569.42, 569.52, 570.02, 570.78, 571.02, 571.2, 571.46)} />
      <Impacto f={f} ini={s(571.94)} fim={s(573.25)} texto="ELE TEM PRAZO." y={580} tam={190} tempos={P(571.98, 572.42, 572.58)} por="palavra" destaque={{ 2: COR.vermelho }} />
      <Tarja f={f} ini={s(573.36)} fim={s(578.3)} texto="O JOGO PARA DE TE DAR" y={500} tempos={P(573.58, 573.7, 574.52, 574.96, 575.14, 575.34)} />
      {f < s(577.4) && (
        <div style={{ ...em(135, 590), opacity: 1 - prog(f, s(577.2), 5) }}>
          <Risco f={f} ini={s(576.4)} dur={9} alt={12}>
            <Cinetico texto="MISSÕES DE BANDIDO" f={f} ini={0} tempos={P(575.46, 575.82, 575.98)} por="palavra" dur={6} estilo="mascara" style={A(120, COR.creme, { textShadow: '0 6px 30px rgba(0,0,0,0.6)' })} />
          </Risco>
        </div>
      )}
      <Tarja f={f} ini={s(576.42)} fim={s(578.3)} texto="E COMEÇA A TE DAR" y={770} cor={COR.creme} tempos={P(576.42, 576.58, 576.96, 577.08, 577.14)} />
      <Impacto f={f} ini={s(577.3)} fim={s(578.3)} texto="CONTAS." y={560} tam={200} cor={COR.vermelho} barra={false} />
      {/* as contas, uma a uma */}
      {f >= s(578.4) && f < fimLista + 10 && (
        <div style={{ opacity: 1 - prog(f, fimLista, 8) }}>
          <AbsoluteFill style={{ background: 'rgba(0,0,0,0.42)', opacity: saiExpo(prog(f, s(578.4), 10)) }} />
          {linhas.map(([txt, t0, tempos], i) => (
            <React.Fragment key={i}>
              <Tique f={f} ini={s(tempos[tempos.length - 1]) + 4} x={135} y={252 + i * 122} tam={66} cor={COR.vermelho} />
              <Cinetico texto={txt} f={f} ini={s(t0)} tempos={P(...tempos)} por="palavra" dur={6} estilo="sobe" style={em(232, 246 + i * 122, A(i === 4 ? 68 : 90, COR.creme, { textShadow: '0 4px 20px rgba(0,0,0,0.7)' }))} />
            </React.Fragment>
          ))}
        </div>
      )}
      <Centro
        f={f}
        ini={s(588.9)}
        fim={s(590.75)}
        y={300}
        escurece={0.55}
        vao={6}
        linhas={[
          { texto: 'NADA DISSO TE DÁ', tempos: P(588.92, 589.36, 589.64, 589.82), fonte: 'oswald', tam: 60, estilo: 'sobe' },
          { texto: 'NADA.', t: s(590.44), tam: 330, estilo: 'bate', por: 'letra', passo: 1 },
        ]}
      />
      {/* não tem prêmio */}
      <Tarja f={f} ini={s(590.86)} fim={s(594.3)} texto="NÃO TEM:" y={420} tam={50} />
      {premios.map(([txt, t0, x], i) =>
        f >= s(t0) && f < s(594.4) ? (
          <div key={i} style={{ opacity: 1 - prog(f, s(594.25), 5) }}>
            <Etiqueta f={f} ini={s(t0)} texto={txt} x={x} y={560} tam={74} />
            <Tique f={f} ini={s(t0) + 7} x={x + [150, 60, 150][i]} y={540} tam={150} tipo="x" larg={16} />
          </div>
        ) : null,
      )}
      <Tarja f={f} ini={s(594.7)} fim={s(601.0)} texto="HORAS DE JOGO CUJA ÚNICA FUNÇÃO É VOCÊ DECIDIR" y={470} tam={38} tempos={P(595.8, 596.08, 596.2, 596.44, 596.72, 596.94, 597.32, 597.52, 597.74)} />
      <Impacto f={f} ini={s(598.1)} fim={s(601.0)} texto={'QUE TIPO DE HOMEM\nVAI FICAR NO REGISTRO.'} y={550} tam={132} tempos={P(598.2, 598.32, 598.56, 598.7, 598.88, 599.04, 599.24, 599.38)} por="palavra" destaque={{ 7: COR.vermelho }} />
    </Jogo>
  );
};

/** 638-678 s · o epílogo: John Marston vira proprietário */
export const Epilogo: React.FC<Cena> = ({ f, clipes }) => {
  const ini = 19140;
  const posses: [string, number][] = [
    ['TERRENO  ✓', 648.4],
    ['CASA  ✓', 649.82],
    ['PASTO  ✓', 651.18],
  ];
  const cadeia: [string, number][] = [
    ['TERRA', 665.56],
    ['DONO', 666.44],
    ['ESCRITURA', 668.46],
    ['PAPEL', 670.06],
  ];
  const cartao = saiCubica(prog(f, s(670.5), 10));
  return (
    <Jogo arq="c26-E.mp4" k={f - ini} f={f} id="c26" clipes={clipes} cor={{ sat: 0.65, temp: 0.25 }} zoom={1.02 + 0.04 * prog(f, ini, 1200) + soco(f, s(644.12), 0.05)}>
      <Centro
        f={f}
        ini={s(638.3)}
        fim={s(639.72)}
        y={330}
        escurece={0.5}
        vao={10}
        linhas={[
          { texto: 'E DEPOIS TEM O', tempos: P(638.3, 638.64, 638.86, 639.02), fonte: 'oswald', tam: 50, estilo: 'sobe' },
          { texto: 'EPÍLOGO', t: s(639.06), tam: 300, por: 'letra', passo: 1.4 },
        ]}
      />
      <Sombra f={f} ini={s(639.7)} fim={s(665.2)} forca={0.84} />
      <Tarja f={f} ini={s(639.76)} fim={s(643.8)} texto="A PARTE QUE VEJO MENOS GENTE COMENTAR" y={748} tempos={P(640.08, 640.2, 640.4, 640.58, 640.94, 641.28, 641.56)} />
      <Tarja f={f} ini={s(642.3)} fim={s(643.8)} texto="E QUE FECHA O ARGUMENTO INTEIRO." y={820} cor={COR.creme} tempos={P(642.38, 642.44, 642.54, 642.8, 642.88, 643.28)} />
      <Impacto f={f} ini={s(644.08)} fim={s(645.6)} texto="JOHN MARSTON" y={530} tam={196} tempos={P(644.12, 644.38)} por="palavra" />
      <Etiqueta f={f} ini={s(644.76)} fim={s(645.6)} texto="SOBREVIVE." x={135} y={760} tam={60} fundo={COR.vermelho} cor={COR.papel} />
      <Tarja f={f} ini={s(645.74)} fim={s(652.65)} texto="O QUE ELE FAZ COM A SOBREVIDA:" y={420} tempos={P(646.16, 646.26, 646.32, 646.46, 646.74, 646.9, 647.0)} />
      <Impacto f={f} ini={s(647.8)} fim={s(649.1)} texto={'COMPRA UM\nTERRENO.'} y={510} tam={150} tempos={P(647.86, 648.22, 648.4)} por="palavra" />
      <Impacto f={f} ini={s(649.14)} fim={s(650.5)} texto={'LEVANTA\nUMA CASA.'} y={510} tam={150} tempos={P(649.18, 649.66, 649.82)} por="palavra" />
      <Impacto f={f} ini={s(650.56)} fim={s(651.6)} texto={'CERCA\nUM PASTO.'} y={510} tam={150} tempos={P(650.6, 651.02, 651.18)} por="palavra" />
      <Impacto f={f} ini={s(651.64)} fim={s(652.65)} texto={'E VIRA\nPROPRIETÁRIO.'} y={510} tam={150} tempos={P(651.66, 651.74, 652.04)} por="palavra" destaque={{ 2: COR.vermelho }} />
      {posses.map(([txt, t0], i) => (
        <Etiqueta key={i} f={f} ini={s(t0) + 4} fim={s(652.65)} texto={txt} x={1400} y={300 + i * 96} tam={46} giro={[-2, 2, -1][i]} />
      ))}
      <Tarja f={f} ini={s(652.7)} fim={s(659.3)} texto="O ÚLTIMO SOBREVIVENTE DO BANDO DO DUTCH" y={440} tam={38} tempos={P(652.7, 653.62, 653.9, 654.66, 654.82, 655.04, 655.22)} />
      <Impacto f={f} ini={s(655.5)} fim={s(659.3)} texto={'ACABA O JOGO\nPREENCHENDO PAPEL\nNO BANCO.'} y={520} tam={120} tempos={P(655.56, 656.12, 656.24, 656.52, 657.66, 657.96, 658.16)} por="palavra" destaque={{ 4: COR.vermelho }} />
      <Centro
        f={f}
        ini={s(659.5)}
        fim={s(662.4)}
        y={330}
        escurece={0.5}
        vao={14}
        linhas={[
          { texto: 'NÃO É TRAIÇÃO AO PERSONAGEM.', tempos: P(659.56, 659.88, 660.02, 660.46, 660.62), fonte: 'oswald', tam: 54, estilo: 'sobe' },
          { texto: 'É A CONCLUSÃO.', tempos: P(661.34, 661.56, 661.66), tam: 220 },
        ]}
      />
      <Tarja f={f} ini={s(662.58)} fim={s(665.15)} texto="FECHAR A FRONTEIRA SIGNIFICA EXATAMENTE ISSO:" y={800} tempos={P(662.58, 662.96, 663.12, 663.5, 663.92, 664.7)} />
      {/* terra, dono, escritura, papel */}
      {f >= s(665.2) && f < s(670.75) && (
        <div style={{ opacity: Math.min(saiExpo(prog(f, s(665.2), 8)), 1 - prog(f, s(670.6), 5)) }}>
          <AbsoluteFill style={{ background: 'rgba(0,0,0,0.62)' }} />
          <div style={{ ...em(0, 410), width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22 }}>
            {cadeia.map(([txt, t0], i) => {
              const e = saiExpo(prog(f, s(t0), 8));
              return (
                <React.Fragment key={i}>
                  {i > 0 && <span style={{ ...A(60, COR.cinza), opacity: e }}>→</span>}
                  <span style={{ ...A(i === 3 ? 140 : 100, i === 3 ? COR.vermelho : COR.creme), opacity: c01(e * 3), transform: `scale(${mix(1.5, 1, e).toFixed(3)})`, display: 'inline-block' }}>{txt}</span>
                </React.Fragment>
              );
            })}
          </div>
          <Cinetico texto="A TERRA PASSA A TER DONO." f={f} ini={0} fim={s(667.2)} tempos={P(665.3, 665.56, 665.72, 666.16, 666.3, 666.44)} por="palavra" dur={6} estilo="sobe" style={{ ...em(0, 680), width: W, textAlign: 'center', ...O(50, COR.papel, 0.3) }} />
          <Cinetico texto="DONO PASSA A TER ESCRITURA." f={f} ini={0} fim={s(669.05)} tempos={P(667.32, 667.88, 668.2, 668.32, 668.46)} por="palavra" dur={6} estilo="sobe" style={{ ...em(0, 680), width: W, textAlign: 'center', ...O(50, COR.papel, 0.3) }} />
          <Cinetico texto="E ESCRITURA É PAPEL." f={f} ini={0} tempos={P(669.18, 669.4, 669.94, 670.06)} por="palavra" dur={6} estilo="sobe" style={{ ...em(0, 680), width: W, textAlign: 'center', ...O(50, COR.papel, 0.3) }} />
        </div>
      )}
      {/* as duas pontas (o painel do cavalo do jogo aparece no clipe de 671,2 a 674,8 s: cartão preto) */}
      {cartao > 0 && (
        <>
          <AbsoluteFill style={{ background: '#000', opacity: cartao }} />
          <Cinetico texto="O JOGO TE DEIXA JOGAR AS DUAS PONTAS." f={f} ini={0} tempos={P(670.7, 671.12, 671.4, 671.62, 671.9, 672.2, 672.44, 672.62)} por="palavra" dur={6} estilo="sobe" style={{ ...em(0, 200), width: W, textAlign: 'center', ...O(52, COR.papel, 0.3) }} />
          <div style={{ ...em(W / 2 - 2, 330), width: 4, height: 500 * saiExpo(prog(f, s(672.7), 16)), background: COR.vermelho }} />
          <div style={{ ...em(0, 340), width: W / 2, textAlign: 'center' }}>
            <Risco f={f} ini={s(674.36)} dur={10} alt={14}>
              <Cinetico texto="ARTHUR" f={f} ini={s(673.3)} por="letra" passo={1} dur={6} estilo="mascara" style={A(210)} />
            </Risco>
          </div>
          <Cinetico texto={'O HOMEM QUE\nO REGISTRO APAGOU.'} f={f} ini={0} tempos={P(673.34, 673.5, 673.7, 673.86, 673.94, 674.36)} por="palavra" dur={6} estilo="sobe" style={{ ...em(0, 600), width: W / 2, textAlign: 'center', ...O(46, COR.papel, 0.24) }} />
          <Cinetico texto="JOHN" f={f} ini={s(674.96)} por="letra" passo={1} dur={6} estilo="mascara" style={{ ...em(W / 2, 340), width: W / 2, textAlign: 'center', ...A(210, COR.vermelho) }} />
          <Cinetico texto={'O HOMEM QUE ENTROU\nNO REGISTRO PRA VIVER.'} f={f} ini={0} tempos={P(675.24, 675.3, 675.5, 675.64, 675.92, 676.04, 676.48, 676.92)} por="palavra" dur={6} estilo="sobe" style={{ ...em(W / 2, 600), width: W / 2, textAlign: 'center', ...O(46, COR.papel, 0.24) }} />
        </>
      )}
    </Jogo>
  );
};

/** 678-734 s · a última cavalgada: o que sobra */
export const Ultima: React.FC<Cena> = ({ f, clipes }) => {
  const ini = 20340;
  const dreno = prog(f, ini + 200, 1400);
  const cartao = 1 - prog(f, s(681.3), 12);
  const grade = Math.min(prog(f, s(717.38), 4), 1 - prog(f, s(719.95), 8));
  return (
    <Jogo arq="c27-F.mp4" k={f - ini} f={f} id="c27" clipes={clipes} cor={{ sat: mix(0.5, 0.15, dreno), temp: mix(0.1, -0.1, dreno) }} zoom={1.02 + 0.05 * prog(f, ini, 1680) + soco(f, s(684.52), 0.05)} escurece={prog(f, s(733.5), 14)}>
      {/* o começo do clipe tem um filtro laranja do jogo: a volta à abertura entra em cartão preto */}
      {cartao > 0 && (
        <>
          <AbsoluteFill style={{ background: '#000', opacity: cartao }} />
          <div style={{ opacity: cartao }}>
            <Cinetico texto="EU ABRI FALANDO DAQUELE" f={f} ini={ini} tempos={[ini + 2, s(678.38), s(678.6), s(678.94)]} por="palavra" dur={6} estilo="sobe" style={em(140, 250, O(44, COR.cinza, 0.3))} />
            <Cinetico texto="TIPO DE MORTE" f={f} ini={0} tempos={P(679.28, 679.54, 679.68)} por="palavra" dur={6} estilo="sobe" style={em(135, 330, A(176))} />
            <Cinetico texto="QUE NINGUÉM AVISA." f={f} ini={0} tempos={P(679.98, 680.14, 680.32)} por="palavra" dur={7} estilo="bate" destaque={{ 0: COR.creme }} style={em(135, 520, A(206, COR.vermelho))} />
          </div>
        </>
      )}
      <Sombra f={f} ini={s(681.3)} fim={s(733.9)} forca={0.84} />
      <Impacto f={f} ini={s(681.4)} fim={s(683.4)} texto={'ARTHUR NÃO SALVA\nO VELHO OESTE.'} y={540} tam={132} tempos={P(681.46, 682.02, 682.26, 682.64, 682.74, 682.92)} por="palavra" />
      <Impacto f={f} ini={s(683.5)} fim={s(685.0)} texto={'NÃO EXISTIA\nJOGADA.'} y={530} tam={160} tempos={P(683.54, 683.96, 684.52)} por="palavra" />
      <Impacto f={f} ini={s(685.8)} fim={s(689.35)} texto={'TINHA ACABADO\nEM 1890.'} y={500} tam={150} tempos={P(685.9, 686.1, 686.46, 686.54)} por="palavra" destaque={{ 3: COR.vermelho }} />
      <Maquina f={f} ini={s(687.74)} fim={s(689.35)} texto="num boletim do censo." y={836} tam={44} cps={18} />
      <Tarja f={f} ini={s(689.42)} fim={s(693.1)} texto="ELE NUNCA IA LER AQUILO." y={748} tempos={P(689.5, 689.64, 690.0, 690.22, 690.44)} />
      <Tarja f={f} ini={s(691.0)} fim={s(693.1)} texto="NEM IA PODER FAZER NADA A RESPEITO." y={820} cor={COR.creme} tempos={P(691.04, 691.18, 691.3, 691.48, 691.74, 691.96, 692.06)} />
      <Tarja f={f} ini={s(693.44)} fim={s(698.3)} texto="UMA ÚNICA DECISÃO DISPONÍVEL:" y={460} tempos={P(694.02, 694.18, 694.56, 695.02)} />
      <Impacto f={f} ini={s(695.6)} fim={s(698.3)} texto={'O QUE VAI FICAR\nESCRITO SOBRE ELE.'} y={540} tam={144} tempos={P(695.7, 695.88, 696.0, 696.2, 696.62, 697.28, 697.64)} por="palavra" destaque={{ 4: COR.vermelho }} />
      <Tarja f={f} ini={s(698.62)} fim={s(703.8)} texto="POR ISSO ESSE JOGO PEGOU UM MONTE DE GENTE" y={748} tempos={P(699.6, 699.78, 700.12, 700.28, 700.52, 701.08, 701.2, 701.48, 701.64)} />
      <Tarja f={f} ini={s(701.9)} fim={s(703.8)} texto="QUE NUNCA LIGOU PRA FAROESTE NENHUM." y={820} cor={COR.creme} tempos={P(701.96, 702.06, 702.3, 702.62, 702.76, 703.2)} />
      <Impacto f={f} ini={s(704.5)} fim={s(709.6)} texto={'QUASE NINGUÉM AQUI\nVAI MUDAR O RUMO DA COISA\nEM QUE ESTÁ METIDO.'} y={500} tam={110} tempos={P(704.62, 704.9, 705.52, 706.48, 706.86, 707.18, 707.38, 707.82, 708.52, 708.74, 708.86, 708.9, 709.06)} por="palavra" />
      <Impacto f={f} ini={s(709.8)} fim={s(710.78)} texto={'A PROFISSÃO\nVAI MUDAR.'} y={540} tam={150} tempos={P(709.86, 710.08, 710.44, 710.6)} por="palavra" />
      <Impacto f={f} ini={s(710.82)} fim={s(712.2)} texto={'A FERRAMENTA\nVAI MUDAR.'} y={540} tam={150} tempos={P(710.84, 711.18, 711.66, 711.82)} por="palavra" />
      <Tarja f={f} ini={s(712.28)} fim={s(715.6)} texto="O QUE VOCÊ FAZ BEM HOJE" y={440} tempos={P(712.28, 712.56, 712.64, 712.92, 713.18, 713.36)} />
      <Impacto f={f} ini={s(713.6)} fim={s(715.6)} texto={'PODE NÃO SER\nNECESSÁRIO'} y={520} tam={146} tempos={P(713.62, 713.88, 714.04, 714.22)} por="palavra" />
      <Etiqueta f={f} ini={s(714.8)} fim={s(715.6)} texto="EM 8 ANOS." x={135} y={846} tam={54} fundo={COR.vermelho} cor={COR.papel} />
      <Impacto f={f} ini={s(716.2)} fim={s(717.3)} texto={'NÃO VAI TER\nREUNIÃO.'} y={540} tam={150} tempos={P(716.28, 716.38, 716.5, 716.64)} por="palavra" />
      {/* a planilha que já decidiu */}
      {grade > 0 && (
        <div style={{ opacity: grade }}>
          <Grade f={f} ini={s(717.38)} x={-4} y={138} w={1928} h={804} cols={12} lins={8} cor="rgba(233,198,147,0.5)" larg={3} passo={0.8} />
          {f >= s(718.9) && <div style={{ ...em(160.67 * 8, 138 + 100.5 * 2), width: 160.67, height: 100.5, background: COR.vermelho, opacity: 0.85 * saiExpo(prog(f, s(718.9), 6)) }} />}
        </div>
      )}
      <Tarja f={f} ini={s(717.38)} fim={s(719.95)} texto="VAI TER UMA PLANILHA EM ALGUM LUGAR" y={520} tempos={P(717.38, 717.64, 717.78, 717.96, 718.46, 718.56, 718.76)} />
      <Impacto f={f} ini={s(718.95)} fim={s(719.95)} texto="QUE JÁ DECIDIU." y={610} tam={170} cor={COR.vermelho} tempos={P(719.0, 719.18, 719.3)} por="palavra" />
      <Tarja f={f} ini={s(720.02)} fim={s(724.5)} texto="O PESSOAL DE TECNOLOGIA SABE MUITO BEM" y={748} tempos={P(720.02, 720.38, 720.58, 720.78, 721.38, 722.0, 722.26)} />
      <Tarja f={f} ini={s(722.4)} fim={s(724.5)} texto="DO QUE EU ESTOU FALANDO. INCLUSIVE." y={820} cor={COR.creme} tempos={P(722.46, 722.58, 722.72, 723.3, 723.48, 724.22)} />
      {/* o que sobra */}
      {f >= s(724.5) && f < s(731.5) && (
        <div style={{ opacity: 1 - prog(f, s(731.2), 8) }}>
          <AbsoluteFill style={{ background: 'rgba(0,0,0,0.5)', opacity: saiExpo(prog(f, s(724.5), 12)) }} />
          <Cinetico texto="O que sobra é o que você faz" f={f} ini={0} tempos={P(724.58, 725.5, 725.6, 726.04, 726.64, 726.72, 726.82, 727.1)} por="palavra" dur={8} estilo="foco" style={{ ...em(0, 300), width: W, textAlign: 'center', ...S(92, COR.papel, { fontWeight: 600 }) }} />
          <Cinetico texto="com o tempo que você tem" f={f} ini={0} tempos={P(727.5, 727.96, 728.12, 728.38, 728.54, 728.82)} por="palavra" dur={8} estilo="foco" style={{ ...em(0, 430), width: W, textAlign: 'center', ...S(92, COR.papel, { fontWeight: 600 }) }} />
          <Cinetico texto="dentro de uma coisa que está acabando." f={f} ini={0} tempos={P(729.08, 729.36, 729.56, 729.68, 729.94, 730.06, 730.24)} por="palavra" dur={8} estilo="foco" destaque={{ 6: COR.vermelho }} style={{ ...em(0, 560), width: W, textAlign: 'center', ...S(92, COR.creme, { fontWeight: 600 }) }} />
        </div>
      )}
      <Impacto f={f} ini={s(731.56)} fim={s(733.95)} texto={'ARTHUR GASTOU O DELE\nPAGANDO DÍVIDAS.'} y={540} tam={136} tempos={P(731.62, 731.98, 732.4, 732.48, 732.76, 733.22)} por="palavra" destaque={{ 4: COR.vermelho, 5: COR.vermelho }} />
    </Jogo>
  );
};

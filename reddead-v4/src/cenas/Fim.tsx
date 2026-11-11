import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { COR, mix, prog, saiCubica, saiExpo, W } from '../kit/base';
import { Camera, Fundo, Grao, Poeira, Vinheta } from '../kit/Cena';
import { Floresta } from '../kit/Floresta';
import { Impacto, Tarja } from '../kit/Letreiro';
import { Legenda, Seta, Tique } from '../kit/Pecas';
import { Cinetico } from '../kit/Texto';
import { A, em, O, S } from '../kit/tipos';
import { s } from '../tempo';

const P = (...seg: number[]) => seg.map(s);
type Cena = { f: number; clipes: boolean };

/** 601,8-638 s · "I'm afraid." */
export const Medo: React.FC<Cena> = ({ f }) => {
  const ini = 18054;
  const anda = prog(f, ini, 1086);
  const entra = saiCubica(prog(f, s(602.2), 70));
  const seca = saiCubica(prog(f, s(632.8), 110));
  const lista: [string, number[]][] = [
    ['O MAIS COMPETENTE DO JOGO', [618.54, 618.76, 618.98, 620.4, 620.56]],
    ['O QUE ATIRA MELHOR', [621.22, 621.66, 621.76, 622.04]],
    ['O QUE DECIDE MAIS RÁPIDO', [622.56, 622.86, 622.96, 623.32, 623.58]],
    ['O QUE TODO MUNDO CHAMA', [624.16, 624.46, 624.54, 624.76, 624.96]],
  ];
  const encolhe = saiCubica(prog(f, s(617.9), 12));
  const fimFrase = s(626.75);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <Img
        src={staticFile('arte/arthur.jpg')}
        style={{
          position: 'absolute',
          left: 790,
          top: -14,
          width: 1208,
          height: 1108,
          opacity: entra * 0.92,
          transform: `scale(${(1.02 + 0.1 * anda).toFixed(5)})`,
          transformOrigin: '55% 45%',
          filter: `saturate(${mix(0.75, 0, seca).toFixed(3)}) contrast(1.08) brightness(${mix(0.95, 0.82, seca).toFixed(3)})`,
        }}
      />
      <AbsoluteFill style={{ background: 'linear-gradient(to right, #000 0%, #000 43%, rgba(0,0,0,0.6) 57%, rgba(0,0,0,0) 74%)' }} />
      <Poeira f={f} n={22} />
      {/* a cena */}
      <Cinetico texto="PERTO DO FIM, ELE ESTÁ SENTADO NUM BANCO." f={f} ini={0} fim={s(613.0)} tempos={P(603.98, 604.26, 604.44, 605.38, 605.52, 605.72, 606.2, 606.36)} por="palavra" dur={7} estilo="sobe" style={em(140, 360, O(44, COR.papel, 0.2))} />
      <Cinetico texto="AO LADO DE UMA FREIRA." f={f} ini={0} fim={s(613.0)} tempos={P(606.82, 607.54, 607.74, 607.9, 608.04)} por="palavra" dur={7} estilo="sobe" style={em(140, 446, O(44, COR.papel, 0.2))} />
      <Cinetico texto="ELA PERGUNTA COMO ELE ESTÁ." f={f} ini={0} fim={s(613.0)} tempos={P(611.4, 611.52, 611.86, 612.12, 612.28)} por="palavra" dur={7} estilo="sobe" style={em(140, 532, O(44, COR.creme, 0.2))} />
      <Tarja f={f} ini={s(613.4)} fim={s(617.9)} texto="ELE RESPONDE TRÊS PALAVRAS:" y={270} tempos={P(613.5, 613.64, 614.26, 614.52)} />
      {/* I'm afraid */}
      {f >= s(615.3) && f < fimFrase + 10 && (
        <div style={{ ...em(135, mix(370, 150, encolhe)), transform: `scale(${mix(1, 0.42, encolhe).toFixed(4)})`, transformOrigin: 'left top', opacity: 1 - prog(f, fimFrase, 8) }}>
          <Cinetico texto="“I’m afraid.”" f={f} ini={s(615.38)} por="letra" passo={1.5} dur={9} estilo="foco" style={S(200, COR.papel, { fontWeight: 600, lineHeight: 1.1 })} />
        </div>
      )}
      <Cinetico texto="ESTOU COM MEDO." f={f} ini={0} fim={s(617.95)} tempos={P(616.82, 617.28, 617.44)} por="palavra" dur={7} estilo="mascara" saida="sobe" style={em(135, 640, A(160, COR.vermelho))} />
      {/* quem está dizendo isso */}
      {f >= s(618.0) && f < fimFrase + 10 && (
        <div style={{ opacity: 1 - prog(f, fimFrase, 8) }}>
          {lista.map(([txt, tempos], i) => (
            <React.Fragment key={i}>
              <Tique f={f} ini={s(tempos[tempos.length - 1]) + 5} x={135} y={318 + i * 112} tam={58} cor={COR.creme} />
              <Cinetico texto={txt} f={f} ini={0} tempos={P(...tempos)} por="palavra" dur={6} estilo="sobe" style={em(222, 310 + i * 112, A(78))} />
            </React.Fragment>
          ))}
          <Legenda f={f} ini={s(625.42)} x={226} y={748} texto="QUANDO A COISA DESANDA" tam={32} cor={COR.papel} />
        </div>
      )}
      <Tarja f={f} ini={s(626.84)} fim={s(629.3)} texto="O QUE ELE TEM PRA DIZER NO FIM:" y={360} tempos={P(627.3, 627.38, 627.44, 627.6, 627.8, 627.98, 628.2, 628.36)} />
      <Impacto f={f} ini={s(628.7)} fim={s(629.3)} texto="ESTÁ COM MEDO." y={450} tam={176} tempos={P(628.84, 628.98, 629.2)} por="palavra" cor={COR.vermelho} />
      <Impacto f={f} ini={s(629.3)} fim={s(632.6)} texto="NÃO DO TIRO." y={380} tam={160} tempos={P(629.34, 629.88, 630.04)} por="palavra" />
      <Tarja f={f} ini={s(630.5)} fim={s(632.6)} texto="DO TIRO ELE NUNCA TEVE MEDO NENHUM." y={590} tempos={P(630.58, 630.74, 630.96, 631.4, 631.66, 631.9, 632.12)} />
      <Tarja f={f} ini={s(632.76)} texto="MEDO DA ÚNICA COISA QUE ELE" y={300} tam={38} tempos={P(633.36, 633.5, 633.6, 633.76, 634.12, 634.28)} />
      <Tarja f={f} ini={s(634.3)} texto="NUNCA APRENDEU A ENFRENTAR:" y={366} tam={38} cor={COR.creme} tempos={P(634.4, 634.6, 635.02, 635.12)} />
      <Impacto f={f} ini={s(636.5)} texto={'NÃO TER\nO QUE FAZER.'} y={470} tam={190} tempos={P(636.58, 636.78, 637.02, 637.16, 637.24)} por="palavra" cor={COR.vermelho} />
      <Vinheta forca={0.5} />
      <Grao f={f} forca={0.16} />
      <AbsoluteFill style={{ background: '#000', opacity: 1 - saiCubica(prog(f, ini, 20)) }} />
    </AbsoluteFill>
  );
};

/** 734-749 s · o fim: a pergunta para os comentários (a direita fica livre para a tela final do YouTube) */
export const Final: React.FC<Cena> = ({ f }) => {
  const ini = 22020;
  const entra = saiCubica(prog(f, ini + 4, 30));
  const caixa = saiExpo(prog(f, s(740.4), 12));
  const quica = Math.abs(Math.sin((f - s(737.2)) * 0.2)) * 14;
  return (
    <AbsoluteFill style={{ backgroundColor: COR.preto, overflow: 'hidden' }}>
      <AbsoluteFill style={{ opacity: entra * 0.9 }}>
        <Camera escala={1.03 + 0.04 * prog(f, ini, 450)}>
          <Floresta f={f} camX={(f - ini) * 0.9} topo={600} base={1140} brilho={0.9} />
        </Camera>
      </AbsoluteFill>
      <Fundo f={f} tom="neutro" semente={77} luz={0.5} />
      <AbsoluteFill style={{ opacity: entra * 0.55, mixBlendMode: 'screen' }}>
        <Camera escala={1.03 + 0.04 * prog(f, ini, 450)}>
          <Floresta f={f} camX={(f - ini) * 0.9} topo={600} base={1140} brilho={0.9} />
        </Camera>
      </AbsoluteFill>
      <Cinetico texto="SEMANA QUE VEM TEM OUTRO." f={f} ini={0} tempos={P(734.5, 735.06, 735.18, 735.32, 735.46)} por="palavra" dur={7} estilo="mascara" style={em(135, 96, A(112))} />
      <Tarja f={f} ini={s(736.1)} texto="ME RESPONDE UMA COISA AQUI EMBAIXO" y={270} tempos={P(736.48, 736.58, 736.9, 736.98, 737.16, 738.2)} />
      <Tarja f={f} ini={s(739.3)} texto="PORQUE EU LEIO." y={342} cor={COR.creme} tempos={P(739.34, 739.9, 740.04)} />
      {f >= s(737.2) && <div style={{ transform: `translateY(${quica.toFixed(1)}px)` }}><Seta f={f} ini={s(737.2)} dur={10} de={[1010, 262]} para={[1010, 352]} cor={COR.vermelho} larg={9} /></div>}
      {/* a pergunta, como um comentário a escrever */}
      {caixa > 0 && (
        <div style={{ ...em(135, 440), width: 1130, height: 330, boxSizing: 'border-box', border: `4px solid rgba(233,198,147,0.7)`, background: 'rgba(0,0,0,0.72)', borderRadius: 18, opacity: caixa, transform: `translateY(${((1 - caixa) * 60).toFixed(1)}px)` }}>
          <div style={{ position: 'absolute', left: 36, top: 36, width: 76, height: 76, borderRadius: 38, background: COR.vermelho }} />
          <div style={{ position: 'absolute', left: 136, top: 46, ...O(26, COR.cinza, 0.3) }}>SUA RESPOSTA NOS COMENTÁRIOS</div>
          <Cinetico texto={'VOCÊ ACHA QUE O ARTHUR\nSABIA ANTES DA TOSSE?'} f={f} ini={0} tempos={P(740.74, 741.3, 742.2, 742.36, 742.48, 742.68, 743.04, 743.48, 743.88)} por="palavra" dur={6} estilo="mascara" destaque={{ 5: COR.vermelho, 6: COR.vermelho, 7: COR.vermelho, 8: COR.vermelho }} style={{ position: 'absolute', left: 136, top: 100, ...A(88) }} />
          {f >= s(744.2) && Math.floor(f / 9) % 2 === 0 && <div style={{ position: 'absolute', left: 1010, top: 204, width: 8, height: 84, background: COR.vermelho }} />}
        </div>
      )}
      <Legenda f={f} ini={s(744.6)} x={140} y={806} texto="ANTES DA LENDA" tam={30} cor={COR.creme} />
      <Vinheta forca={0.45} />
      <Grao f={f} forca={0.16} />
      <AbsoluteFill style={{ background: '#000', opacity: prog(f, 22470 - 24, 22) }} />
    </AbsoluteFill>
  );
};

export { W };

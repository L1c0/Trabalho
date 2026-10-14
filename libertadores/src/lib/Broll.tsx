import React from 'react';
import {AbsoluteFill, getStaticFiles, OffthreadVideo, staticFile} from 'remotion';
import {fontes, medidas, paleta} from '../theme';
import {useFormato} from './formato';

// B-ROLL. Cobre o quadro. Tratamento: dessatura para 40% e mapeia a escala entre a sombra
// #0D1117 e a luz #F0EDE6, para conversar com os diagramas. Entra e sai em corte seco.
// O mapeamento é feito por duas camadas de cor: "screen" com a sombra leva o preto à sombra,
// "multiply" com a luz leva o branco à luz; juntas dão a reta sombra→luz em cada canal.
// (Filtro SVG por url() não é aplicado ao quadro do vídeo no render; CSS puro é.)
export const Broll: React.FC<{arquivo: string; taxa?: number; faltando?: string}> = ({arquivo, taxa = 1, faltando}) => {
  const fm = useFormato();
  const existe = getStaticFiles().some((s) => s.name === arquivo);
  if (!existe) {
    return (
      <AbsoluteFill style={{backgroundColor: paleta.fundo, alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: fontes.corpo, fontWeight: 600, fontSize: 14 * fm.k, letterSpacing: medidas.rotulo.espacamento, color: paleta.secundario}}>
          B-ROLL FALTANDO · {(faltando ?? arquivo).toUpperCase()}
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{backgroundColor: paleta.fundo}}>
      <OffthreadVideo src={staticFile(arquivo)} playbackRate={taxa} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: `saturate(${medidas.broll.saturacao})`}} />
      <AbsoluteFill style={{backgroundColor: paleta.fundo, mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{backgroundColor: paleta.texto, mixBlendMode: 'multiply'}} />
    </AbsoluteFill>
  );
};

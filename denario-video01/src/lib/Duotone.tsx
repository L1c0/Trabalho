import React, {useId} from 'react';
import {AbsoluteFill, Img, getStaticFiles, staticFile} from 'remotion';

const existe = (arquivo: string) => getStaticFiles().some((f) => f.name === arquivo);
const avisados = new Set<string>();

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

// Dessatura e pinta: sombras em preto, luzes na cor dada. Uma feColorMatrix só:
// cada canal de saída = luminância × canal da cor.
export const FiltroDuotone: React.FC<{id: string; cor: string}> = ({id, cor}) => {
  const [r, g, b] = rgb(cor);
  const lum = [0.2126, 0.7152, 0.0722];
  const linha = (c: number) => `${lum.map((l) => (l * c).toFixed(4)).join(' ')} 0 0`;
  return (
    <svg width={0} height={0} style={{position: 'absolute'}}>
      <defs>
        <filter id={id} colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values={`${linha(r)} ${linha(g)} ${linha(b)} 0 0 0 1 0`} />
        </filter>
      </defs>
    </svg>
  );
};

type Props = {
  src: string; // caminho dentro de public/
  cor: string;
  opacidade?: number;
} & (
  | {modo: 'recorte'; x: number; y: number; largura: number; altura?: number; posicao?: string} // PNG com alfa
  | {modo: 'telaCheia'} // JPG, cobre o quadro
);

// PNG ou JPG de public/img/ em duotone. Arquivo ausente: não desenha nada e avisa no console.
export const Duotone: React.FC<Props> = (props) => {
  const id = `duo${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  if (!existe(props.src)) {
    if (!avisados.has(props.src)) {
      avisados.add(props.src);
      console.warn(`[duotone] arquivo ausente em public/: ${props.src}`);
    }
    return null;
  }
  const filtro = <FiltroDuotone id={id} cor={props.cor} />;
  const img = {filter: `url(#${id})`, display: 'block'} as const;
  if (props.modo === 'telaCheia') {
    return (
      <AbsoluteFill style={{opacity: props.opacidade ?? 1}}>
        {filtro}
        <Img src={staticFile(props.src)} style={{...img, width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
    );
  }
  return (
    <div
      style={{
        position: 'absolute',
        left: props.x,
        top: props.y,
        width: props.largura,
        height: props.altura,
        overflow: 'hidden',
        opacity: props.opacidade ?? 1,
      }}
    >
      {filtro}
      <Img src={staticFile(props.src)} style={{...img, width: '100%', ...(props.altura ? {height: 'auto', objectPosition: props.posicao} : {})}} />
    </div>
  );
};

import React from 'react';
import {useCurrentFrame} from 'remotion';
import {cores, tratamento as t} from '../theme';

// Um filtro SVG só para toda imagem: dessatura, sobe o contraste, deixa 8% do vermelho
// do fundo entrar nas sombras (lighten: só o que é mais escuro que o fundo fica vermelho),
// soma um grão de ±5% e devolve o alfa original (o recorte continua recortado).
export const FiltroDeArquivo: React.FC<{id: string; semente: number}> = ({id, semente}) => {
  const frame = useCurrentFrame();
  const inclinacao = t.contraste;
  const intercepto = 0.5 - 0.5 * inclinacao;
  return (
    <svg width={0} height={0} style={{position: 'absolute'}}>
      <defs>
        <filter id={id} colorInterpolationFilters="sRGB" x="0" y="0" width="1" height="1">
          <feColorMatrix in="SourceGraphic" type="saturate" values="0" result="cinza" />
          <feComponentTransfer in="cinza" result="contraste">
            <feFuncR type="linear" slope={inclinacao} intercept={intercepto} />
            <feFuncG type="linear" slope={inclinacao} intercept={intercepto} />
            <feFuncB type="linear" slope={inclinacao} intercept={intercepto} />
          </feComponentTransfer>
          <feFlood floodColor={cores.pompeia} result="vermelho" />
          <feBlend in="contraste" in2="vermelho" mode="lighten" result="sombraVermelha" />
          <feComposite in="contraste" in2="sombraVermelha" operator="arithmetic" k2={1 - t.vermelhoNasSombras} k3={t.vermelhoNasSombras} result="tinto" />
          <feTurbulence type="fractalNoise" baseFrequency={t.graoFrequencia} numOctaves={2} seed={semente + Math.floor(frame / t.graoTroca)} result="ruido" />
          <feColorMatrix in="ruido" type="saturate" values="0" result="ruidoCinza" />
          <feComposite in="tinto" in2="ruidoCinza" operator="arithmetic" k2={1} k3={2 * t.grao} k4={-t.grao} result="granulado" />
          <feComposite in="granulado" in2="SourceAlpha" operator="in" />
        </filter>
      </defs>
    </svg>
  );
};

import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {Pt} from './formato';
import {projetor, ProjetorProvider, useFormato} from './formato';
import {Gramado} from './Gramado';
import {curvas, fontes, medidas, paleta} from '../theme';

const CampoApagado: React.FC<{opacidade: number}> = ({opacidade}) => {
  const fm = useFormato();
  return (
    <svg width={fm.largura} height={fm.altura} style={{position: 'absolute', inset: 0, opacity: opacidade}}>
      <ProjetorProvider valor={projetor(fm)}>
        <Gramado />
      </ProjetorProvider>
    </svg>
  );
};

// TRÊS CARTÕES PEQUENOS ("PONTA VELOZ" / "VOLANTE A MAIS" / "SEGUNDO ATACANTE"), entrando um
// a cada 20 quadros. Quando a narração chega a um, ele acende; os outros ficam a meia luz.
export const Cartoes: React.FC<{itens: {texto: string; frame: number}[]; intervalo: number; inicio: number}> = ({itens, intervalo, inicio}) => {
  const q = useCurrentFrame();
  const f = q + inicio;
  const fm = useFormato();
  const atual = [...itens].reverse().findIndex((i) => f >= i.frame);
  const ativo = atual < 0 ? -1 : itens.length - 1 - atual;
  return (
    <AbsoluteFill style={{backgroundColor: paleta.fundo}}>
      <CampoApagado opacidade={0.35} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: fm.vertical ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28 * fm.k,
        }}
      >
        {itens.map((it, i) => {
          const e = curvas.saida(Math.min(1, Math.max(0, (q - i * intervalo) / 10)));
          const luz = ativo === -1 || ativo === i ? 1 : 0.5;
          return (
            <div
              key={it.texto}
              style={{
                opacity: e * luz,
                transform: `translateY(${(1 - e) * 16}px)`,
                backgroundColor: paleta.fundo,
                borderLeft: `4px solid ${paleta.taca}`,
                padding: `${22 * fm.k}px ${30 * fm.k}px`,
                minWidth: fm.vertical ? 640 : 400,
                fontFamily: fontes.display,
                fontSize: 40 * fm.k,
                color: paleta.texto,
                textTransform: 'uppercase',
              }}
            >
              {it.texto}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// CINCO RÓTULOS em volta do campo vazio (CARTÕES / DISCUSSÕES / CERA / VAIAS / ARBITRAGEM),
// cada um entrando quando a narração o diz.
export const Rotulos: React.FC<{itens: {texto: string; frame: number; onde: Pt}[]; inicio: number}> = ({itens, inicio}) => {
  const f = useCurrentFrame() + inicio;
  const fm = useFormato();
  const pr = projetor(fm);
  return (
    <AbsoluteFill style={{backgroundColor: paleta.fundo}}>
      <CampoApagado opacidade={1} />
      {itens.map((it) => {
        const p = curvas.saida(Math.min(1, Math.max(0, (f - it.frame) / medidas.cartela.mascara)));
        if (p <= 0) return null;
        const q = pr.p(it.onde);
        return (
          <div
            key={it.texto}
            style={{
              position: 'absolute',
              left: q.X,
              top: q.Y,
              transform: 'translate(-50%, -50%)',
              backgroundColor: paleta.fundo,
              padding: `${10 * fm.k}px ${18 * fm.k}px`,
              fontFamily: fontes.display,
              fontSize: 40 * fm.k,
              color: paleta.texto,
              whiteSpace: 'nowrap',
              clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
              borderBottom: `3px solid ${paleta.taca}`,
            }}
          >
            {it.texto}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

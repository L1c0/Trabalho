import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COR, H, W } from './kit/base';
import { Acabamento, Brasas, Papel, Raios, Sol } from './kit/Cena';
import { Carimbo, Filtros } from './kit/Pecas';
import { A, Cz } from './kit/Texto';
import { DentroDaTinta, Mancha, QuadroDe, Sangra, Tinta } from './kit/Tinta';

/** Quadros de prova das misturas: tinta sobre papel, negativo, cor e dupla exposição. */
export const Teste: React.FC = () => {
  const f = useCurrentFrame();
  const caso = Math.floor(f / 10);
  return (
    <AbsoluteFill>
      <Filtros />
      {caso === 0 && (
        <Papel cor={COR.ouro}>
          <Raios f={f} x={540} y={900} />
          <Sol x={540} y={900} r={300} cor={COR.sangue} />
          <Tinta take="rua" k={90} />
          <div style={{ position: 'absolute', left: 0, top: 240, width: W, textAlign: 'center', ...Cz(84) }}>O VELHO OESTE</div>
          <Carimbo f={f} t0={0} x={540} y={1250} linhas={['FECHADA']} tam={150} />
        </Papel>
      )}
      {caso === 1 && (
        <Papel cor={COR.noite}>
          <Sol x={560} y={700} r={420} cor={COR.osso} halo="rgba(244,236,216,0.25)" />
          <Tinta take="lua" k={120} y={486} modo="multiplica" />
          <Brasas f={f + 40} />
          <div style={{ position: 'absolute', left: 80, top: 230, ...A(170, COR.sangue) }}>20 ABR 1891</div>
        </Papel>
      )}
      {caso === 2 && (
        <Papel cor={COR.sangue}>
          <Tinta take="morro" k={300} y={300} />
          <div style={{ position: 'absolute', left: 0, top: 1734, width: W, height: 200, background: COR.tinta }} />
          <Mancha arq="mancha-2.png" x={140} y={220} w={800} cor={COR.ouro} />
          <div style={{ position: 'absolute', left: 0, top: 420, width: W, textAlign: 'center', ...A(300, COR.tinta) }}>1899</div>
        </Papel>
      )}
      {caso === 3 && (
        <Papel cor={COR.papel}>
          <DentroDaTinta take="busto" k={100} y={486}>
            <QuadroDe arq="takes/sol-cor.mp4" k={120} style={{ position: 'absolute', left: 0, top: -300, width: 1080, height: 1920, opacity: 0.9 }} />
            <Sangra n={1} k={30} x={240} y={640} w={600} cor={COR.vermelho} modo="clareia" />
          </DentroDaTinta>
          <div style={{ position: 'absolute', left: 0, top: 1900, width: W, height: 40, background: COR.tinta }} />
          <div style={{ position: 'absolute', left: 0, top: 200, width: W, textAlign: 'center', ...A(330, COR.sangue) }}>1899</div>
        </Papel>
      )}
      {caso === 4 && (
        <Papel cor={COR.noite}>
          <Tinta take="raio" k={30} y={300} modo="clareia" cor={COR.osso} />
          <Sangra n={2} k={40} x={0} y={200} w={1080} cor={COR.sangue} modo="clareia" />
          <Brasas f={f} />
        </Papel>
      )}
      <Acabamento f={f} />
    </AbsoluteFill>
  );
};

import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {cores, escala, fontes} from '../theme';

// Credito · Inter 12, canto inferior esquerdo, osso a 40%.
export const Credito: React.FC<{texto: string; entra: number}> = ({texto, entra}) => {
  const {height} = useVideoConfig();
  return useCurrentFrame() >= entra ? (
    <div style={{position: 'absolute', left: escala.margemCanto, top: height - escala.margemCanto - escala.credito * 1.4, fontFamily: fontes.texto, fontSize: escala.credito, color: cores.osso, opacity: 0.4, whiteSpace: 'nowrap'}}>
      {texto}
    </div>
  ) : null;
};

import React from 'react';

// Uma célula da coluna vertical: centralizada na espinha, topo definido pelo layout.
export const TateColumn: React.FC<{cx: number; topo: number; tamanho: number; children: React.ReactNode}> = ({
  cx,
  topo,
  tamanho,
  children,
}) => (
  <div
    style={{
      position: 'absolute',
      left: cx - tamanho / 2,
      top: topo,
      width: tamanho,
      height: tamanho,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {children}
  </div>
);

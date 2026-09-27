import React from 'react';

// Número em dígito tabular: cada algarismo numa caixa de largura fixa, então nada desliza
// quando o valor muda.
export const Digitos: React.FC<{texto: string; largura?: number}> = ({texto, largura = 0.7}) => (
  <>
    {[...texto].map((c, i) => (
      <span key={i} style={{display: 'inline-block', width: /[0-9]/.test(c) ? `${largura}em` : undefined, textAlign: 'center'}}>
        {c}
      </span>
    ))}
  </>
);

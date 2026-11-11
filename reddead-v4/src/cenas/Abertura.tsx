import React from 'react';
import { AbsoluteFill } from 'remotion';
import { c01, COR, entraSai, H, mix, prog, saiCubica, saiExpo, tremor, W } from '../kit/base';
import { Camera, Clarao, Fundo, Grao, Poeira } from '../kit/Cena';
import { Floresta } from '../kit/Floresta';
import { Cinetico, Risco } from '../kit/Texto';
import { A, em, M, O, S } from '../kit/tipos';
import { s } from '../tempo';

/**
 * A abertura falada (0 a 52,6 s da trilha): a tese do vídeo, dita antes de o
 * jogo aparecer. É tipografia pura, palavra por palavra no tempo da voz, e
 * cada frase tem o seu desenho.
 */
const P = (...seg: number[]) => seg.map(s);
export const ABERTURA_FIM = s(52.6);

/** 1 · "Tem um tipo de morte que ninguém avisa que está acontecendo." */
const TipoDeMorte: React.FC<{ f: number }> = ({ f }) => {
  const fim = s(5.42);
  const t = tremor(f, s(3.98), 10, 10);
  return (
    <Camera escala={1 + 0.04 * prog(f, s(0.9), 140)} x={t.x} y={t.y}>
      <Cinetico texto="TEM UM TIPO DE MORTE" f={f} ini={0} tempos={P(0.93, 1.1, 1.24, 1.44, 1.62)} por="palavra" dur={6} estilo="sobe" fim={fim} saida="sobe" style={em(135, 250, A(176))} />
      <Cinetico
        texto="QUE NINGUÉM AVISA"
        f={f}
        ini={0}
        tempos={P(2.1, 3.74, 3.96)}
        por="palavra"
        dur={7}
        estilo="bate"
        fim={fim}
        saida="sobe"
        destaque={{ 0: COR.creme }}
        style={em(135, 440, A(206, COR.vermelho))}
      />
      <Cinetico texto="QUE ESTÁ ACONTECENDO." f={f} ini={s(4.38)} por="palavra" passo={4} dur={8} estilo="sobe" fim={fim} style={em(142, 690, O(46, COR.cinza, 0.34))} />
    </Camera>
  );
};

/** 2 · "Não é a sua, é a do que você faz." */
const NaoEASua: React.FC<{ f: number }> = ({ f }) => {
  const fim = s(8.3);
  const cede = saiCubica(prog(f, s(6.7), 10));
  return (
    <AbsoluteFill>
      <div style={{ ...em(0, mix(400, 250, cede), { width: W, textAlign: 'center' }), opacity: mix(1, 0.34, cede), transform: `scale(${mix(1, 0.62, cede)})` }}>
        <Risco f={f} ini={s(6.72)} dur={8}>
          <Cinetico texto="NÃO É A SUA." f={f} ini={0} tempos={P(5.6, 5.96, 6.08, 6.28)} por="palavra" dur={6} estilo="sobe" fim={fim} style={A(200)} />
        </Risco>
      </div>
      <Cinetico
        texto="É A DO QUE VOCÊ FAZ."
        f={f}
        ini={0}
        tempos={P(6.8, 7.12, 7.2, 7.26, 7.38, 7.64)}
        por="palavra"
        dur={6}
        estilo="mascara"
        fim={fim}
        saida="sobe"
        destaque={{ 5: COR.vermelho }}
        style={em(0, 470, { ...A(210), width: W, textAlign: 'center' })}
      />
    </AbsoluteFill>
  );
};

/** 3 · "Você aprendeu uma coisa, levou anos nisso, ficou bom." e as duas frases seguintes */
const FicouBom: React.FC<{ f: number }> = ({ f }) => {
  const fim = s(16.6);
  const enche = entraSai(prog(f, s(10.0), s(11.35) - s(10.0)));
  const t = tremor(f, s(11.46), 16, 12);
  const some = 1 - prog(f, fim, 8);
  return (
    <Camera x={t.x} y={t.y} escala={1 + 0.03 * prog(f, s(8.4), 250)}>
      <Cinetico texto="VOCÊ APRENDEU UMA COISA," f={f} ini={0} tempos={P(8.48, 8.92, 9.28, 9.44)} por="palavra" dur={7} estilo="sobe" fim={fim} style={em(138, 170, O(52, COR.papel, 0.26))} />
      <Cinetico texto="LEVOU ANOS NISSO," f={f} ini={0} tempos={P(10.06, 10.44, 10.76)} por="palavra" dur={7} estilo="mascara" fim={fim} style={em(135, 250, A(128))} />
      {/* a barra que enche enquanto os anos passam */}
      {f >= s(9.9) && (
        <div style={{ ...em(138, 420), width: 1180, height: 26, border: `3px solid ${COR.creme}`, opacity: saiCubica(prog(f, s(9.9), 8)) * some }}>
          <div style={{ width: `${(enche * 100).toFixed(2)}%`, height: '100%', background: COR.vermelho }} />
        </div>
      )}
      <Cinetico texto="FICOU BOM." f={f} ini={0} tempos={P(11.24, 11.46)} por="palavra" dur={6} estilo="bate" fim={fim} style={em(128, 470, A(300))} />
      <Cinetico
        texto="do tipo que as pessoas em volta comentam,"
        f={f}
        ini={s(12.05)}
        por="palavra"
        passo={5}
        dur={8}
        estilo="sobe"
        fim={fim}
        style={em(142, 820, S(50, COR.papel))}
      />
      <Cinetico texto="que te chamam quando aperta." f={f} ini={s(14.72)} por="palavra" passo={6} dur={8} estilo="sobe" fim={fim} style={em(142, 892, S(50, COR.creme))} />
    </Camera>
  );
};

/** 4 · "E num ponto qualquer, sem reunião, ... aquilo para de ser necessário." */
const ParaDeSerNecessario: React.FC<{ f: number }> = ({ f }) => {
  const fim1 = s(21.72);
  const fim2 = s(23.62);
  // o ponto: nasce no meio da tela, pulsa e some quando as frases começam
  const ponto = saiExpo(prog(f, s(17.0), 6)) * (1 - prog(f, s(17.8), 6));
  const anel = prog(f, s(17.0), 20);
  const palavra = 'NECESSÁRIO.';
  return (
    <AbsoluteFill>
      <Cinetico texto="E NUM PONTO QUALQUER," f={f} ini={s(16.84)} por="palavra" passo={3} dur={7} estilo="sobe" fim={s(17.85)} style={em(0, 400, { ...O(54, COR.papel, 0.3), width: W, textAlign: 'center' })} />
      {ponto > 0 && (
        <>
          <div style={{ ...em(W / 2 - 13, 520), width: 26, height: 26, borderRadius: '50%', background: COR.vermelho, transform: `scale(${ponto})` }} />
          <div
            style={{
              ...em(W / 2 - 13, 520),
              width: 26,
              height: 26,
              borderRadius: '50%',
              border: `3px solid ${COR.vermelho}`,
              transform: `scale(${1 + anel * 7})`,
              opacity: (1 - anel) * ponto,
            }}
          />
        </>
      )}
      <Cinetico texto="SEM REUNIÃO," f={f} ini={0} tempos={P(17.9, 18.04)} por="palavra" dur={6} estilo="mascara" fim={fim1} saida="sobe" style={em(135, 250, A(150))} />
      <Cinetico
        texto="SEM NINGUÉM TE CHAMAR"
        f={f}
        ini={0}
        tempos={P(18.98, 19.84, 20.06, 20.2)}
        por="palavra"
        dur={6}
        estilo="mascara"
        fim={fim1}
        saida="sobe"
        style={em(135, 430, A(150))}
      />
      <Cinetico
        texto="NUMA SALA PRA CONVERSAR,"
        f={f}
        ini={0}
        tempos={P(20.52, 20.68, 21.02, 21.18)}
        por="palavra"
        dur={6}
        estilo="mascara"
        fim={fim1}
        saida="sobe"
        style={em(135, 610, A(150))}
      />
      <Cinetico texto="AQUILO PARA DE SER" f={f} ini={0} tempos={P(21.92, 22.26, 22.68, 22.84)} por="palavra" dur={6} estilo="sobe" fim={fim2} style={em(0, 300, { ...O(66, COR.papel, 0.3), width: W, textAlign: 'center' })} />
      {/* NECESSÁRIO entra inteiro e vai apagando, letra por letra, de trás para a frente */}
      {f >= s(23.0) && f < fim2 + 8 && (
        <div style={{ ...em(0, 400, { ...A(330), width: W, textAlign: 'center', whiteSpace: 'pre' }), opacity: 1 - prog(f, fim2, 8) }}>
          {palavra.split('').map((ch, i) => {
            const entra = saiCubica(prog(f, s(23.0) + i, 6));
            const apaga = prog(f, s(23.32) + (palavra.length - 1 - i) * 0.9, 6);
            return (
              <span key={i} style={{ display: 'inline-block', opacity: entra * mix(1, 0.1, apaga), transform: `translateY(${((1 - entra) * 40).toFixed(1)}px)` }}>
                {ch}
              </span>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};

/** 5 · "O mundo não te demite, ele só deixa de precisar." */
const OMundo: React.FC<{ f: number }> = ({ f }) => {
  const fim = s(27.66);
  const t = tremor(f, s(26.8), 12, 10);
  return (
    <Camera x={t.x} y={t.y} escala={1 + 0.035 * prog(f, s(23.7), 120)}>
      <div style={em(0, 280, { width: W, textAlign: 'center' })}>
        <Cinetico
          texto="O MUNDO NÃO TE "
          f={f}
          ini={0}
          tempos={P(23.9, 24.64, 24.86, 25.06)}
          por="palavra"
          dur={6}
          estilo="sobe"
          fim={fim}
          style={{ ...A(176), display: 'inline-block' }}
        />
        <Risco f={f} ini={s(25.9)} dur={8}>
          <Cinetico texto="DEMITE." f={f} ini={s(25.22)} por="palavra" dur={6} estilo="sobe" fim={fim} style={{ ...A(176), display: 'inline-block' }} />
        </Risco>
      </div>
      <Cinetico
        texto="ELE SÓ DEIXA DE PRECISAR."
        f={f}
        ini={0}
        tempos={P(25.94, 26.08, 26.32, 26.66, 26.8)}
        por="palavra"
        dur={6}
        estilo="mascara"
        fim={fim}
        saida="sobe"
        style={em(0, 520, { ...A(176, COR.vermelho), width: W, textAlign: 'center' })}
      />
    </Camera>
  );
};

/** O relógio que gira: linha fina, ponteiros rápidos. */
const Relogio: React.FC<{ f: number; ini: number; fim: number; x: number; y: number; r: number }> = ({ f, ini, fim, x, y, r }) => {
  const e = saiExpo(prog(f, ini, 16));
  const some = 1 - prog(f, fim, 8);
  if (e <= 0 || some <= 0) return null;
  const circ = 2 * Math.PI * r;
  const min = ((f - ini) * 14) % 360;
  const hora = ((f - ini) * 14) / 12 + 150;
  return (
    <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, opacity: some }}>
      <circle cx={x} cy={y} r={r} fill="none" stroke={COR.creme} strokeWidth={5} strokeDasharray={circ} strokeDashoffset={circ * (1 - e)} transform={`rotate(-90 ${x} ${y})`} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        return (
          <line
            key={i}
            x1={x + Math.sin(a) * (r - 22)}
            y1={y - Math.cos(a) * (r - 22)}
            x2={x + Math.sin(a) * (r - 8)}
            y2={y - Math.cos(a) * (r - 8)}
            stroke={COR.creme}
            strokeWidth={i % 3 === 0 ? 5 : 2}
            opacity={e}
          />
        );
      })}
      <line x1={x} y1={y} x2={x} y2={y - r * 0.72} stroke={COR.creme} strokeWidth={5} strokeLinecap="round" transform={`rotate(${min} ${x} ${y})`} opacity={e} />
      <line x1={x} y1={y} x2={x} y2={y - r * 0.46} stroke={COR.vermelho} strokeWidth={8} strokeLinecap="round" transform={`rotate(${hora} ${x} ${y})`} opacity={e} />
      <circle cx={x} cy={y} r={9} fill={COR.creme} opacity={e} />
    </svg>
  );
};

/** 6 · "E você continua acordando cedo, continua fazendo, continua bom." */
const Continua: React.FC<{ f: number }> = ({ f }) => {
  const fim = s(33.14);
  const linhas: [number, number, string, number][] = [
    [28.68, 29.28, 'ACORDANDO CEDO,', 250],
    [30.44, 30.96, 'FAZENDO,', 420],
    [31.8, 32.22, 'BOM.', 590],
  ];
  return (
    <AbsoluteFill>
      <Cinetico texto="E VOCÊ" f={f} ini={s(27.84)} por="palavra" passo={16} dur={7} estilo="sobe" fim={fim} style={em(140, 160, O(52, COR.papel, 0.3))} />
      {linhas.map(([t1, t2, txt, y], i) => (
        <React.Fragment key={i}>
          <Cinetico texto="CONTINUA" f={f} ini={s(t1)} por="letra" passo={0.8} dur={6} estilo="mascara" fim={fim} saida="sobe" style={em(135, y, A(146, COR.cinza))} />
          <Cinetico texto={txt} f={f} ini={s(t2)} por="palavra" passo={7} dur={6} estilo="mascara" fim={fim} saida="sobe" style={em(720, y, A(146, i === 2 ? COR.vermelho : COR.creme))} />
        </React.Fragment>
      ))}
      <Relogio f={f} ini={s(28.5)} fim={fim} x={1610} y={790} r={170} />
    </AbsoluteFill>
  );
};

/** 7 · "O pior não é perder, é que não tem com quem brigar." */
const SemAdversario: React.FC<{ f: number }> = ({ f }) => {
  const fim = s(37.86);
  const caixa = saiExpo(prog(f, s(35.3), 12));
  const pisca = Math.floor((f - s(36.4)) / 8) % 2 === 0 ? 1 : 0.15;
  const some = 1 - prog(f, fim, 8);
  return (
    <AbsoluteFill>
      <Cinetico texto="O PIOR NÃO É PERDER." f={f} ini={0} tempos={P(33.38, 33.98, 34.26, 34.48, 34.58)} por="palavra" dur={6} estilo="sobe" fim={fim} style={em(0, 150, { ...O(62, COR.papel, 0.3), width: W, textAlign: 'center' })} />
      <Cinetico
        texto={'É QUE NÃO TEM\nCOM QUEM BRIGAR.'}
        f={f}
        ini={0}
        tempos={P(35.36, 36.02, 36.08, 36.2, 36.38, 36.82, 37.06)}
        por="palavra"
        dur={6}
        estilo="mascara"
        fim={fim}
        saida="sobe"
        destaque={{ 6: COR.vermelho }}
        style={em(0, 250, { ...A(180), width: W, textAlign: 'center' })}
      />
      {/* VOCÊ x [ninguém]: o lugar do adversário fica vazio */}
      {caixa > 0 && (
        <div style={{ ...em(0, 740, { width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 70 }), opacity: caixa * some }}>
          <div style={{ ...A(120), border: `5px solid ${COR.creme}`, padding: '14px 64px 6px', transform: `translateX(${((1 - caixa) * -80).toFixed(1)}px)` }}>VOCÊ</div>
          <div style={{ ...A(120, COR.vermelho) }}>×</div>
          <div
            style={{
              ...A(120, COR.cinza),
              border: `5px dashed ${COR.cinza}`,
              padding: '14px 64px 6px',
              minWidth: 380,
              textAlign: 'center',
              transform: `translateX(${((1 - caixa) * 80).toFixed(1)}px)`,
            }}
          >
            <span style={{ opacity: f >= s(36.4) ? pisca : 0 }}>?</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** 8 · "Não existe o cara que fechou a porta, não existe a decisão, não existe o momento." */
const NaoExiste: React.FC<{ f: number }> = ({ f }) => {
  const fim = s(43.0);
  const linhas: [number, number, string, number][] = [
    [38.42, 39.95, 'O CARA QUE FECHOU A PORTA', 400],
    [40.54, 41.2, 'A DECISÃO', 570],
    [42.02, 42.62, 'O MOMENTO', 740],
  ];
  return (
    <AbsoluteFill>
      <Cinetico texto="NÃO EXISTE" f={f} ini={s(38.0)} por="letra" passo={1} dur={6} estilo="bate" fim={fim} style={em(135, 130, A(210, COR.vermelho))} />
      {linhas.map(([t1, t2, txt, y], i) => (
        <div key={i} style={{ ...em(135, y), opacity: mix(1, 0.45, prog(f, s(t2) + 6, 10)) }}>
          <Risco f={f} ini={s(t2)} dur={8} cor={COR.vermelho} alt={14}>
            <Cinetico texto={txt} f={f} ini={s(t1)} por="palavra" passo={4} dur={6} estilo="mascara" fim={fim} saida="sobe" style={A(140)} />
          </Risco>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/** 9 e 10 · o papel: "Alguém em algum escritório escreveu num papel..." */
const OPapel: React.FC<{ f: number }> = ({ f }) => {
  const fim = s(49.52);
  const troca = s(47.2);
  const entra = saiExpo(prog(f, s(44.5), 16));
  const frase = 'aquilo não existe mais.';
  const n = Math.floor(c01((f - s(45.5)) / (s(46.95) - s(45.5))) * frase.length);
  const cursor = Math.floor(f / 6) % 2 === 0;
  const carimbo = saiExpo(prog(f, s(48.38), 6));
  const t = tremor(f, s(49.3), 16, 12);
  const linhasCinza = [0.86, 0.94, 0.7, 0, 0.9, 0.8, 0.95, 0.55];
  return (
    <Camera x={t.x} y={t.y}>
      {/* a grade do escritório, em perspectiva */}
      <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, opacity: 0.22 * saiCubica(prog(f, s(43.2), 20)) * (1 - prog(f, fim, 6)) }}>
        {Array.from({ length: 13 }, (_, i) => {
          const y = 620 + Math.pow(i / 12, 1.8) * 520;
          return <line key={`h${i}`} x1={0} y1={y} x2={W} y2={y} stroke={COR.gelo} strokeWidth={1.5} />;
        })}
        {Array.from({ length: 25 }, (_, i) => {
          const x = (i - 12) * 220;
          return <line key={`v${i}`} x1={W / 2 + x * 0.35} y1={620} x2={W / 2 + x * 2.2} y2={H + 60} stroke={COR.gelo} strokeWidth={1.5} />;
        })}
      </svg>
      <Cinetico texto="ALGUÉM," f={f} ini={s(43.24)} por="letra" passo={1} dur={6} estilo="mascara" fim={troca} saida="sobe" style={em(135, 200, A(150))} />
      <Cinetico texto="EM ALGUM ESCRITÓRIO," f={f} ini={0} tempos={P(43.7, 43.86, 44.08)} por="palavra" dur={6} estilo="mascara" fim={troca} saida="sobe" style={em(135, 370, A(110))} />
      <Cinetico texto="ESCREVEU NUM PAPEL" f={f} ini={0} tempos={P(44.6, 45.08, 45.18)} por="palavra" dur={6} estilo="mascara" fim={troca} saida="sobe" style={em(135, 500, A(110))} />
      <Cinetico texto="O PAPEL ESTAVA CERTO." f={f} ini={0} tempos={P(47.36, 47.9, 48.1, 48.4)} por="palavra" dur={6} estilo="sobe" fim={fim} style={em(135, 250, A(112))} />
      <Cinetico texto={'E VOCÊ\nNÃO LEU.'} f={f} ini={0} tempos={P(48.78, 48.9, 49.14, 49.3)} por="palavra" dur={5} estilo="bate" fim={fim} style={em(130, 400, A(220, COR.vermelho))} />
      {/* a folha */}
      {entra > 0 && f < fim + 6 && (
        <div
          style={{
            ...em(1130, 120),
            width: 660,
            height: 840,
            background: 'linear-gradient(160deg, #ECE3CF 0%, #DCD0B6 100%)',
            boxShadow: '0 40px 90px rgba(0,0,0,0.65)',
            transform: `translate(${((1 - entra) * 700).toFixed(1)}px, ${((1 - entra) * 120).toFixed(1)}px) rotate(${mix(9, -3.5, entra).toFixed(2)}deg)`,
            opacity: 1 - prog(f, fim, 5),
            padding: '70px 60px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ ...M(22, '#5c5648'), letterSpacing: '0.22em' }}>ASSUNTO:</div>
          <div style={{ height: 3, background: '#b9ad92', margin: '14px 0 40px' }} />
          {linhasCinza.map((w, i) =>
            i === 3 ? (
              <div key={i} style={{ ...M(40, '#1b1814'), height: 60, margin: '18px 0', whiteSpace: 'pre', letterSpacing: 0 }}>
                {frase.slice(0, n)}
                <span style={{ opacity: n < frase.length && cursor && f >= s(45.4) ? 1 : 0 }}>▌</span>
              </div>
            ) : (
              <div key={i} style={{ height: 12, width: `${w * 100}%`, background: '#b9ad92', margin: '22px 0', opacity: 0.7 }} />
            ),
          )}
          <div style={{ position: 'absolute', left: 60, bottom: 70, width: 220, height: 3, background: '#5c5648' }} />
          <div style={{ position: 'absolute', left: 60, bottom: 36, ...M(18, '#5c5648'), letterSpacing: '0.2em' }}>ASSINATURA</div>
          {carimbo > 0 && (
            <div
              style={{
                position: 'absolute',
                right: 44,
                bottom: 120,
                ...A(84, COR.vermelho),
                border: `7px solid ${COR.vermelho}`,
                padding: '6px 26px 0',
                transform: `rotate(-12deg) scale(${mix(2.4, 1, carimbo).toFixed(3)})`,
                opacity: 0.88 * c01(carimbo * 3),
              }}
            >
              CERTO
            </div>
          )}
        </div>
      )}
    </Camera>
  );
};

/** 11 · "Red Dead Redemption 2 é sobre isso." */
const TituloDoJogo: React.FC<{ f: number }> = ({ f }) => {
  const ini = s(49.56);
  const t1 = tremor(f, s(49.56), 18, 10);
  const t2 = tremor(f, s(50.74), 14, 10);
  const banda = saiExpo(prog(f, s(51.5), 10));
  return (
    <AbsoluteFill style={{ backgroundColor: COR.preto }}>
      <Camera x={t1.x + t2.x} y={t1.y + t2.y} escala={1.02 + 0.05 * prog(f, ini, 100)}>
        <Floresta f={f} camX={(f - ini) * 1.4} topo={-30} base={900} />
        <Cinetico texto="RED DEAD" f={f} ini={0} tempos={P(49.56, 50.5)} por="palavra" dur={5} estilo="bate" style={em(0, 110, { ...A(300), width: W, textAlign: 'center', textShadow: '10px 10px 0 #2a0403' })} />
        <Cinetico
          texto="REDEMPTION 2"
          f={f}
          ini={0}
          tempos={P(50.74, 51.3)}
          por="palavra"
          dur={5}
          estilo="bate"
          style={em(0, 410, { ...A(300), width: W, textAlign: 'center', textShadow: '10px 10px 0 #2a0403' })}
        />
      </Camera>
      {banda > 0 && (
        <div style={{ ...em(0, 800), width: W, height: 120, background: '#000', transform: `scaleX(${banda})`, transformOrigin: 'left center' }}>
          <Cinetico texto="É SOBRE ISSO." f={f} ini={0} tempos={P(51.58, 51.9, 52.16)} por="palavra" dur={6} estilo="sobe" style={{ ...O(64, COR.creme, 0.5), width: W, textAlign: 'center', paddingTop: 20 }} />
        </div>
      )}
      <Clarao f={f} ini={ini} dur={8} forca={0.9} />
    </AbsoluteFill>
  );
};

export const Abertura: React.FC<{ f: number }> = ({ f }) => {
  if (f >= s(49.56)) {
    return (
      <AbsoluteFill>
        <TituloDoJogo f={f} />
        <Grao f={f} forca={0.2} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ backgroundColor: COR.preto }}>
      <AbsoluteFill style={{ opacity: 0.75 * saiCubica(prog(f, s(0.8), 30)) }}>
        <Fundo f={f} tom="neutro" luz={0.9} />
      </AbsoluteFill>
      <Poeira f={f} forca={saiCubica(prog(f, s(0.8), 40))} />
      {f < s(5.8) && <TipoDeMorte f={f} />}
      {f >= s(5.5) && f < s(8.7) && <NaoEASua f={f} />}
      {f >= s(8.3) && f < s(17.0) && <FicouBom f={f} />}
      {f >= s(16.7) && f < s(24.0) && <ParaDeSerNecessario f={f} />}
      {f >= s(23.6) && f < s(28.0) && <OMundo f={f} />}
      {f >= s(27.7) && f < s(33.5) && <Continua f={f} />}
      {f >= s(33.2) && f < s(38.2) && <SemAdversario f={f} />}
      {f >= s(37.9) && f < s(43.4) && <NaoExiste f={f} />}
      {f >= s(43.1) && <OPapel f={f} />}
      <Grao f={f} forca={0.16} />
    </AbsoluteFill>
  );
};

import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {CenaCampo, CenaDuelo, Id} from '../data/tipos';
import {corDoTime, curvas, fontes, medidas, paleta} from '../theme';
import {emMovimento, escalaEntrada, montarElenco, opacidadeNo, posNo} from './elenco';
import type {Pt} from './formato';
import {ProjetorProvider, projetor, useFormato} from './formato';
import {Gramado} from './Gramado';
import {Jogador, Rastro} from './Jogador';
import {Linhas} from './Linhas';
import {Seta} from './Seta';
import {TextoDisplay} from './TextoDisplay';
import {Zona} from './Zona';

// O CAMPO: o componente central. Recebe a cena (time, formação, quem aparece, destaques,
// zonas, setas, linhas, pressões, duelos, texto) e desenha tudo no mesmo SVG, na orientação
// do formato. Os frames da cena são absolutos; aqui viram locais.
export const Campo: React.FC<{cena: CenaCampo | CenaDuelo}> = ({cena}) => {
  const f = useCurrentFrame() + cena.frame;
  const formato = useFormato();
  const proj = useMemo(() => projetor(formato, cena.recorte), [formato, cena.recorte]);
  const elenco = useMemo(() => montarElenco(cena), [cena]);
  const atleta = (id: Id) => elenco.find((a) => a.id === id)!;
  const tela = (pt: Pt) => proj.p(pt);
  const noQuadro = (id: Id, q: number) => tela(posNo(atleta(id), q));
  const c = proj.caixa;
  const folga = 3 * proj.pxPorMetro;
  const duelo = cena.tipo === 'duelo' ? cena : null;
  const corZona = (cor: 'time' | 'perigo' | 'adversario' | undefined) =>
    cor === 'perigo' ? paleta.perigo : cor === 'adversario' && cena.adversario ? corDoTime(cena.adversario.time, cena.confronto) : corDoTime(cena.time, cena.confronto);

  // opacidade: a da cena, e no duelo o contexto a 15%
  const opac = (id: Id) => (duelo && duelo.contexto.includes(id) ? medidas.duelo.contexto : 1) * opacidadeNo(cena, id, f);

  // anéis: destaque (dourado), pressionado (vermelho), envolvidos no duelo (dourado)
  const anel = (id: Id) => {
    const pr = (cena.pressoes ?? []).find((p) => p.alvo === id && f >= p.frame);
    if (pr) return {cor: paleta.perigo, desde: pr.frame};
    const d = (cena.destaques ?? []).find((x) => x.quem === id && f >= x.frame && (x.ate === undefined || f < x.ate));
    if (d) return {cor: paleta.taca, desde: d.frame};
    if (duelo && !duelo.semAneis && duelo.pares.some(([a, b]) => a === id || b === id)) return {cor: paleta.taca, desde: duelo.frame};
    return null;
  };

  const ordem = [...elenco].sort((a, b) => opac(a.id) - opac(b.id));

  return (
    <AbsoluteFill style={{backgroundColor: paleta.fundo}}>
      <svg width={formato.largura} height={formato.altura} style={{position: 'absolute', inset: 0}}>
        <defs>
          <clipPath id={`campo-${cena.frame}`}>
            <rect x={c.x - folga} y={c.y - folga} width={c.w + 2 * folga} height={c.h + 2 * folga} />
          </clipPath>
        </defs>
        <ProjetorProvider valor={proj}>
          <g clipPath={`url(#campo-${cena.frame})`}>
            <Gramado />
            {(cena.zonas ?? []).map((z, i) => (
              <Zona key={i} pontos={z.pontos.map(tela)} cor={corZona(z.cor)} quadro={f - z.frame} ate={z.ate === undefined ? undefined : z.ate - z.frame} />
            ))}
            {cena.linhas && <Linhas d={cena.linhas} f={f} />}
            {(cena.pressoes ?? []).map((pr, i) => {
              if (f < pr.frame) return null;
              const t = Math.min(1, (f - pr.frame) / medidas.pressao.duracao);
              const raio = (medidas.pressao.raioInicial + (medidas.pressao.raioFinal - medidas.pressao.raioInicial) * curvas.suave(t)) * 105 * proj.pxPorMetro;
              const centro = noQuadro(pr.alvo, f);
              const quem = atleta(pr.quem[0]);
              const fim = pr.frame + medidas.pressao.duracao + 12;
              return (
                <g key={i}>
                  <circle cx={centro.X} cy={centro.Y} r={raio} fill="none" stroke={quem.cor} strokeOpacity={0.55} strokeWidth={2} strokeDasharray="6 6" />
                  {f < fim &&
                    pr.quem.map((q) => (
                      <g key={q} opacity={Math.min(1, (fim - f) / 8)}>
                        <Seta de={noQuadro(q, pr.frame)} para={noQuadro(pr.alvo, pr.frame)} quadro={f - pr.frame} tipo="movimento" cor={atleta(q).cor} curva={0.4} alvoJogador />
                      </g>
                    ))}
                </g>
              );
            })}
            {duelo?.pares.map(([a, b], i) => {
              const [pa, pb] = [noQuadro(a, f), noQuadro(b, f)];
              const q = curvas.saida(Math.min(1, (f - (duelo.ligarEm ?? duelo.frame + 12)) / 14));
              if (q <= 0) return null;
              return <line key={i} x1={pa.X} y1={pa.Y} x2={pa.X + (pb.X - pa.X) * q} y2={pa.Y + (pb.Y - pa.Y) * q} stroke={paleta.taca} strokeWidth={3} strokeDasharray="8 6" />;
            })}
            {(cena.setas ?? []).map((s, i) => {
              if (f < s.frame || (s.ate !== undefined && f >= s.ate)) return null;
              const de = noQuadro(s.de, s.frame);
              const alvoJ = typeof s.para === 'string';
              const para = alvoJ ? noQuadro(s.para as Id, s.frame) : tela(s.para as Pt);
              const cor = s.cor === 'taca' ? paleta.taca : atleta(s.de).cor;
              return <Seta key={i} de={de} para={para} quadro={f - s.frame} tipo={s.tipo} cor={cor} curva={s.curva ?? 1} alvoJogador={alvoJ} />;
            })}
            {elenco.map((a) =>
              emMovimento(a, f) ? (
                <Rastro
                  key={`r${a.id}`}
                  cor={a.cor}
                  pontos={medidas.formacao.rastro
                    .map(([atras, o]) => ({...tela(posNo(a, f - atras)), o: o * opac(a.id), d: Math.hypot(posNo(a, f - atras).x - posNo(a, f).x, posNo(a, f - atras).y - posNo(a, f).y)}))
                    .filter((p) => p.d > 0.003)}
                />
              ) : null,
            )}
            {ordem.map((a) => {
              const q = tela(posNo(a, f));
              const saindo = a.saiEm !== undefined ? Math.max(0, Math.min(1, (a.saiEm + 10 - f) / 10)) : 1;
              return (
                <Jogador key={a.id} X={q.X} Y={q.Y} cor={a.cor} numero={a.n} escala={escalaEntrada(f - a.entraEm)} opacidade={opac(a.id) * saindo} anel={anel(a.id)} quadro={f} />
              );
            })}
            {(cena.marcas ?? []).map((m) => {
              const q = noQuadro(m.quem, f);
              const o = Math.min(1, Math.max(0, (f - atleta(m.quem).entraEm - 8) / 8));
              return (
                <text
                  key={m.quem}
                  x={q.X}
                  y={q.Y - 28 * formato.k}
                  textAnchor="middle"
                  opacity={o}
                  fill={paleta.texto}
                  style={{fontFamily: fontes.corpo, fontWeight: 600, fontSize: medidas.rotulo.tamanho * formato.k, letterSpacing: medidas.rotulo.espacamento}}
                >
                  {m.texto.toUpperCase()}
                </text>
              );
            })}
          </g>
        </ProjetorProvider>
      </svg>
      {cena.texto && f >= cena.texto.frame && (
        <TextoDisplay linhas={cena.texto.linhas} quadro={f - cena.texto.frame} atrasos={cena.texto.quadros?.map((q) => q - cena.texto!.frame)} />
      )}
      {(() => {
        const l = [...(cena.legenda ?? [])].reverse().find((x) => f >= x.frame);
        if (!l || duelo) return null;
        return (
          <div
            key={l.texto}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: formato.rotuloY - medidas.duelo.rotulo * formato.k,
              textAlign: 'center',
              fontFamily: fontes.corpo,
              fontWeight: 700,
              fontSize: medidas.duelo.rotulo * formato.k,
              letterSpacing: medidas.rotulo.espacamento,
              color: paleta.taca,
              fontVariantNumeric: fontes.numeros,
              opacity: Math.min(1, (f - l.frame) / 8),
            }}
          >
            {l.texto}
          </div>
        );
      })()}
      {duelo && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: formato.rotuloY - medidas.duelo.rotulo * formato.k,
            textAlign: 'center',
            fontFamily: fontes.corpo,
            fontWeight: 700,
            fontSize: medidas.duelo.rotulo * formato.k,
            letterSpacing: medidas.rotulo.espacamento,
            color: paleta.texto,
            opacity: Math.min(1, Math.max(0, (f - duelo.frame - 10) / 10)),
          }}
        >
          {duelo.rotulo}
        </div>
      )}
    </AbsoluteFill>
  );
};

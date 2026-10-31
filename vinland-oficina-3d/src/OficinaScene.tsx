/**
 * A OFICINA — cena 3D
 * Canal @MangaEm60 · L'Anse aux Meadows
 *
 * 1080×1920 · 30 fps · 1215 frames (40,49 s)
 *
 * O PRINCÍPIO
 * -----------
 * Parede de turfa tem altura, e turfa abandonada **afunda de volta no
 * chão**. É literalmente o que a arqueologia acha no sítio: depressões no
 * terreno. Então as construções não somem por fade — elas baixam até o
 * chão e deixam a marca. A câmera sobe junto e termina no alto, olhando
 * pra um terraço vazio.
 *
 * O desaparecer é o argumento: "eles foram embora em ordem, esvaziaram
 * tudo e não deixaram ninguém para trás".
 *
 * O QUE NÃO TEM, DE PROPÓSITO
 * ---------------------------
 * Nenhuma luz na cena. Nenhum material além de LineBasicMaterial.
 * Sem sombra, sem bloom, sem profundidade de campo, sem névoa.
 * É desenho de reconstrução arqueológica: só linha.
 *
 * Sem spring, sem easing nos movimentos de câmera. A subida é linear.
 */

import React, {useMemo} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';

import geo from './of-geo.json';
import cam from './of-camera.json';

const W = cam.formato.larg;   // 1080
const H = cam.formato.alt;    // 1920

const TURFA = '#15130F';
const FERRUGEM = '#7A3B22';

/** Centro do sítio em coordenadas de planta. O mundo 3D é centrado nele. */
const CX = 582;
const CZ = 840;

type Quadro = (typeof cam.quadros)[number];

// ------------------------------------------------------------- utilidades
/** planta (x,y) -> mundo (X, altura, Z). Y é para cima. */
const pt = (p: number[], y: number) =>
  new THREE.Vector3(p[0] - CX, y, p[1] - CZ);

/** Uma polilinha fechada numa altura dada. */
const anel = (pts: number[][], y: number) => {
  const v = pts.map((p) => pt(p, y));
  v.push(v[0].clone());
  return v;
};

const Linha: React.FC<{
  pontos: THREE.Vector3[];
  cor: string;
  opacidade?: number;
}> = ({pontos, cor, opacidade = 1}) => {
  const geom = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(pontos),
    [pontos]
  );
  if (opacidade <= 0.01) return null;
  return (
    // @ts-expect-error — primitivo do three-fiber
    <line geometry={geom}>
      <lineBasicMaterial
        color={cor}
        transparent
        opacity={opacidade}
        // nada de luz: material plano, como nanquim
        toneMapped={false}
      />
      {/* @ts-expect-error */}
    </line>
  );
};

// ------------------------------------------------------------ construção
const Construcao: React.FC<{
  c: (typeof geo.construcoes)[number];
  fatorAltura: number; // 1 = de pé, 0 = afundada
  marca: number; // opacidade da depressão no chão
}> = ({c, fatorAltura, marca}) => {
  const cor = c.id === 'J' ? FERRUGEM : TURFA;
  const h = c.altura * fatorAltura;
  const dePe = h > 0.6;

  const baseExt = useMemo(() => anel(c.externo, 0), [c.externo]);
  const baseInt = useMemo(() => anel(c.interno, 0), [c.interno]);
  const topoExt = useMemo(() => anel(c.externo, h), [c.externo, h]);
  const topoInt = useMemo(() => anel(c.interno, h), [c.interno, h]);

  /** montantes: de 9 em 9 pontos. Mais que isso vira engradado. */
  const montantes = useMemo(() => {
    const L: THREE.Vector3[][] = [];
    for (let j = 0; j < c.externo.length; j += 9) {
      L.push([pt(c.externo[j], 0), pt(c.externo[j], h)]);
    }
    return L;
  }, [c.externo, h]);

  return (
    <group>
      {/* O contorno externo no chão fica sempre, fraco: dá base à parede. */}
      <Linha pontos={baseExt} cor={cor} opacidade={Math.max(0.2, marca) * 0.38} />

      {/* A marca interna é a DEPRESSÃO: só aparece quando a turfa afunda.
          É a revelação da peça — o que sobrou depois que foram embora. */}
      {marca > 0.06 ? (
        <Linha pontos={baseInt} cor={cor} opacidade={marca * 0.38} />
      ) : null}

      {dePe ? (
        <>
          <Linha pontos={topoExt} cor={cor} opacidade={0.92} />
          <Linha pontos={topoInt} cor={cor} opacidade={0.78} />
          {montantes.map((m, i) => (
            <Linha key={i} pontos={m} cor={cor} opacidade={0.82} />
          ))}
          {c.divisorias.map((dv, i) => (
            <group key={i}>
              <Linha pontos={dv.map((p) => pt(p, h))} cor={cor} opacidade={0.8} />
              <Linha pontos={[pt(dv[0], 0), pt(dv[0], h)]} cor={cor} opacidade={0.8} />
              <Linha pontos={[pt(dv[1], 0), pt(dv[1], h)]} cor={cor} opacidade={0.8} />
            </group>
          ))}
        </>
      ) : null}
    </group>
  );
};

// ---------------------------------------------------------------- terreno
const Terreno: React.FC = () => {
  const a = useMemo(() => geo.terreno.borda_a.map((p) => pt(p, 0)), []);
  const b = useMemo(() => geo.terreno.borda_b.map((p) => pt(p, 0)), []);
  const r = useMemo(() => geo.terreno.riacho.map((p) => pt(p, 0)), []);
  return (
    <group>
      <Linha pontos={a} cor={TURFA} opacidade={0.34} />
      <Linha pontos={b} cor={TURFA} opacidade={0.34} />
      {/* o riacho é a única linha forte do chão: separa a oficina das casas */}
      <Linha pontos={r} cor={TURFA} opacidade={0.75} />
    </group>
  );
};

// ------------------------------------------------------------------- cena
const Mundo: React.FC<{q: Quadro}> = ({q}) => {
  return (
    <>
      <Terreno />
      {geo.construcoes.map((c) => (
        <Construcao
          key={c.id}
          c={c}
          fatorAltura={(q.alt as Record<string, number>)[c.id]}
          marca={(q.marca as Record<string, number>)[c.id]}
        />
      ))}
    </>
  );
};

/**
 * CÂMERA
 * ------
 * `olho`, `alvo` e `desloca` vêm prontos do of-camera.json, frame a frame.
 * O enquadramento foi resolvido por busca binária na distância, com o
 * recorte verificado contra a zona segura. **Não recalcula.**
 *
 * `desloca` está em PIXELS de tela e entra por setViewOffset, que é a
 * forma exata de deslocar o quadro sem mexer na perspectiva.
 */
const Camera: React.FC<{q: Quadro}> = ({q}) => {
  const ref = React.useRef<THREE.PerspectiveCamera>(null);

  // [montagem] `makeDefault` não existe no <perspectiveCamera> do three-fiber
  // (é do <PerspectiveCamera> do drei): sem isto o canvas renderiza pela
  // câmera padrão dele, em (0, 0, 5), e esta câmera nunca é usada.
  const set = useThree((s) => s.set);
  React.useLayoutEffect(() => {
    if (ref.current) set({camera: ref.current});
  }, [set]);

  React.useLayoutEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.position.set(q.olho[0], q.olho[1], q.olho[2]);
    c.up.set(0, 1, 0);
    c.lookAt(q.alvo[0], q.alvo[1], q.alvo[2]);
    c.setViewOffset(W, H, -q.desloca[0], -q.desloca[1], W, H);
    c.updateProjectionMatrix();
  }, [q]);

  return (
    <perspectiveCamera
      ref={ref}
      makeDefault
      fov={cam.camera.fov_vertical_graus}
      aspect={W / H}
      near={cam.camera.near}
      far={cam.camera.far}
    />
  );
};

export const OficinaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const f = Math.max(0, Math.min(cam.formato.frames - 1, Math.round(frame)));
  const q = cam.quadros[f] as Quadro;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#D6D1C6',
        backgroundImage: `url(${staticFile('papel.jpg')})`,
        backgroundSize: '2600px 2600px', // papel sem emenda
      }}
    >
      <ThreeCanvas
        width={W}
        height={H}
        // fundo transparente: o papel é a camada de baixo, não uma textura 3D
        gl={{antialias: true, alpha: true}}
        style={{position: 'absolute', left: 0, top: 0}}
      >
        <Camera q={q} />
        <Mundo q={q} />
      </ThreeCanvas>

      {/* ----------------------------------------------- CAMADAS CHAPADAS
          Rótulo, achados e fecho ficam FORA do 3D. Tipografia em
          perspectiva perde legibilidade, e num Short legibilidade ganha. */}
      {q.rotulo > 0.004 ? (
        <Img
          src={staticFile('rotulo.png')}
          style={{position: 'absolute', left: 0, top: 0, opacity: q.rotulo}}
        />
      ) : null}

      {q.achados > 0.004 ? (
        <Img
          src={staticFile('achados.png')}
          style={{
            position: 'absolute',
            left: 0,
            // a peça original colide com a planta; desce 260px
            top: cam.achados.deslocar_y,
            opacity: q.achados,
          }}
        />
      ) : null}

      {q.fecho > 0.004 ? (
        <Img
          src={staticFile('fecho.png')}
          style={{position: 'absolute', left: 0, top: 0, opacity: q.fecho}}
        />
      ) : null}
    </AbsoluteFill>
  );
};

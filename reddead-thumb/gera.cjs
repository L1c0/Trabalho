// Gera as thumbs (1280x720) em HTML e tira a foto com o Chromium:
//   node gera.cjs [a] [b] [c] [d]   ->  out/thumb-<variante>.png (2560x1440)
// Depois, `python3 -I acaba.py` reduz para 1280x720 e grava os JPG.
// As imagens ficam em img/ (ref.jpg, deserto.png, silhueta.jpg, arthur.jpg) e as fontes em fontes/.
// A, B e C partem da arte de referência (ref.jpg). A D é uma composição própria: o deserto
// de fundo e o cavaleiro em silhueta (img/heroi.png, que sai de `python3 -I recorta.py`).
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = __dirname;
const b64 = (f) => fs.readFileSync(path.join(RAIZ, f)).toString('base64');
const fonte = (nome, arq) => `@font-face{font-family:'${nome}';src:url(data:font/woff2;base64,${b64('fontes/' + arq)}) format('woff2');}`;
const img = (arq) => `data:image/${arq.endsWith('.png') ? 'png' : 'jpeg'};base64,${b64('img/' + arq)}`;

// número pseudoaleatório fixo, para o desenho sair sempre igual
const rnd = (sem) => {
  let a = sem >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const W = 1280;
const H = 720;

/* ---------- a arte da referência (mãos e revólver), 2856 x 1300 ---------- */
const ESC = H / 1300;
const L = 96; // quanto a arte anda para a esquerda
const fx = (x) => x * ESC - L;
const fy = (y) => y * ESC;
// a borda do painel da direita fica em x = 1500 da arte (logo à esquerda do logotipo antigo)
const BORDA = fx(1500);
// a ponta do cano, que passa por cima do painel (contorno traçado sobre a arte)
const BOCA = [
  [1496, 256], [1530, 256], [1546, 268], [1555, 294], [1563, 318], [1571, 342], [1577, 366], [1581, 390], [1589, 408], [1607, 438],
  [1592, 431], [1573, 415], [1558, 403], [1548, 407], [1530, 415], [1496, 428],
].map(([x, y]) => `${(x * ESC).toFixed(1)}px ${fy(y).toFixed(1)}px`).join(', ');

/** Borda irregular do painel: desce de cima a baixo com um tremido de pincel. */
const borda = (sem, inclina = 0) => {
  const r = rnd(sem);
  const pts = [];
  let lento = 0;
  for (let y = -10; y <= H + 10; y += 9) {
    lento = lento * 0.9 + (r() - 0.5) * 4.2;
    const x = BORDA + inclina * (y / H - 0.5) + lento + (r() - 0.5) * 1.6;
    pts.push([Math.min(x, BORDA + 7), y]);
  }
  return pts;
};

const brasas = (sem, n, x0, x1) => {
  const r = rnd(sem);
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * (x1 - x0);
    const y = 120 + r() * 600;
    const t = 2 + r() * r() * 9;
    const op = 0.35 + r() * 0.65;
    s += `<div style="position:absolute;left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;width:${t.toFixed(1)}px;height:${(t * (0.8 + r() * 1.4)).toFixed(1)}px;border-radius:50%;background:#ffd27a;box-shadow:0 0 ${(t * 2).toFixed(0)}px ${(t * 0.8).toFixed(0)}px rgba(255,120,20,.9);opacity:${op.toFixed(2)};transform:rotate(${(r() * 60 - 30).toFixed(0)}deg)"></div>`;
  }
  return s;
};

const riscos = (sem, n) => {
  const r = rnd(sem);
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = 700 + r() * 600;
    const y = 380 + r() * 360;
    const comp = 120 + r() * 320;
    s += `<div style="position:absolute;left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;width:${comp.toFixed(0)}px;height:${(1 + r() * 2.5).toFixed(1)}px;background:linear-gradient(90deg,rgba(255,235,190,0),rgba(255,235,190,.75),rgba(255,235,190,0));transform:rotate(${(-62 - r() * 16).toFixed(1)}deg);transform-origin:left center;opacity:${(0.25 + r() * 0.5).toFixed(2)}"></div>`;
  }
  return s;
};

const CSS = `
${fonte('Pincel', 'knewave-latin-400-normal.woff2')}
${fonte('Logo', 'black-ops-one-latin-400-normal.woff2')}
${fonte('Anton', 'anton-latin-400-normal.woff2')}
*{box-sizing:border-box}
html,body{margin:0;background:#000}
#t{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#120403;font-family:'Anton',sans-serif}
.cheio{position:absolute;left:0;top:0;width:${W}px;height:${H}px}
.arte{position:absolute;left:${-L}px;top:0;width:${(2856 * ESC).toFixed(2)}px;height:${H}px;filter:contrast(1.12) saturate(1.18)}
.logo{position:absolute;font-family:'Logo';color:#fff;line-height:.92;letter-spacing:.01em;text-shadow:0 0 0 #000,5px 5px 0 #0a0302,0 0 18px rgba(0,0,0,.85)}
.grande{position:absolute;font-family:'Pincel';color:#fff;line-height:.86;white-space:nowrap;letter-spacing:-.012em}
.grande .sombra{position:absolute;left:0;top:0;color:#070201;transform:translate(9px,10px);filter:blur(.6px)}
.grande .brilho{position:absolute;left:0;top:0;color:#000;filter:blur(16px);opacity:.75}
.grande .tinta{position:relative;filter:url(#pincel)}
.imp{font-family:'Anton';color:#fff;line-height:.98;letter-spacing:.004em;white-space:nowrap;text-shadow:7px 8px 0 #0b0302,0 0 46px rgba(0,0,0,.75),0 0 12px rgba(0,0,0,.45)}
.caixa{font-family:'Anton';color:#fff;background:#cb130d;line-height:.98;padding:6px 20px 0;white-space:nowrap;box-shadow:8px 9px 0 #0b0302;letter-spacing:.01em}
.fita{display:inline-block;margin-top:30px;background:#0b0302;color:#f4ead4;font-family:'Anton';font-size:47px;line-height:1;letter-spacing:.055em;padding:11px 22px 9px 18px;border-left:13px solid #cb130d;white-space:nowrap;box-shadow:0 10px 30px rgba(0,0,0,.5)}
`;

const FILTROS = `
<svg width="0" height="0" style="position:absolute"><defs>
  <filter id="pincel" x="-6%" y="-12%" width="112%" height="124%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.005 0.5" numOctaves="2" seed="11" result="r"/>
    <feColorMatrix in="r" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -40 28.2" result="m"/>
    <feComposite in="SourceGraphic" in2="m" operator="in" result="t"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.11" numOctaves="2" seed="4" result="d"/>
    <feDisplacementMap in="t" in2="d" scale="3.2" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="grao" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="2"/>
    <feColorMatrix type="matrix" values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .5 0"/>
  </filter>
</defs></svg>`;

/** Texto grande em pincel, com sombra dura e brilho escuro por trás. */
const grande = (linhas, x, y, giro = -5) =>
  `<div style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${giro}deg);transform-origin:left top">` +
  linhas
    .map(
      (l) =>
        `<div class="grande" data-max="${l.max ?? 452}" style="position:relative;font-size:${l.tam}px;margin-top:${l.sobe ?? 0}px;margin-left:${l.dx ?? 0}px;color:${l.cor ?? '#fff'}">` +
        `<span class="brilho">${l.t}</span><span class="sombra">${l.t}</span><span class="tinta">${l.t}</span></div>`,
    )
    .join('') +
  `</div>`;

const logo = (x, y, k = 1) => `
<div style="position:absolute;left:${x}px;top:${y}px;transform:scale(${k});transform-origin:left top">
  <div class="logo" style="position:relative;font-size:62px;white-space:nowrap">RED DEAD</div>
  <div class="logo" style="position:relative;font-size:47.5px;white-space:nowrap;margin-top:4px">REDEMPTION</div>
  <div class="logo" style="left:358px;top:-9px;font-size:136px;color:#d3140f;letter-spacing:-.04em">II</div>
</div>`;

/** Etiqueta de papel rasgado com texto de carimbo. */
const papel = (txt, x, y, giro = -5, tam = 54) => `
<div style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${giro}deg);transform-origin:left top;filter:drop-shadow(7px 8px 0 rgba(0,0,0,.85))">
  <div style="background:linear-gradient(170deg,#f6edd8,#e0d0ac);color:#160806;font-family:'Anton';font-size:${tam}px;line-height:1;padding:10px 24px 8px 22px;letter-spacing:.02em;white-space:nowrap;clip-path:polygon(0 6%,3% 0,22% 4%,41% 0,63% 5%,82% 1%,100% 6%,98% 48%,100% 94%,84% 100%,61% 95%,40% 100%,19% 96%,2% 100%,1% 52%)">${txt}</div>
</div>`;

const VARIANTES = {
  /* a: as mãos e o revólver da referência, painel de fogo com o deserto, "NÃO FOI TIRO." */
  a: (o = {}) => {
    const pts = borda(5, 22);
    const poli = `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y}px`).join(', ')}, ${W + 10}px ${H + 10}px, ${W + 10}px -10px)`;
    const caminho = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y}`).join(' ');
    const texto = o.texto ?? [
      { t: 'NÃO FOI', tam: 112 },
      { t: 'TIRO.', tam: 186, sobe: -6, dx: -4 },
    ];
    return `
<div id="t">
  ${o.esq ?? `<img class="arte" src="${img('ref.jpg')}">
  <div class="cheio" style="background:linear-gradient(100deg,rgba(60,8,0,.0) 30%,rgba(255,140,40,.20) 62%);mix-blend-mode:multiply"></div>
  <div class="cheio" style="background:radial-gradient(ellipse 60% 70% at 30% 50%,rgba(0,0,0,0) 55%,rgba(0,0,0,.6) 100%)"></div>
  <div class="cheio" style="background:radial-gradient(ellipse 190px 200px at ${(BORDA - 40).toFixed(0)}px 30px,rgba(150,40,8,.95) 0%,rgba(150,40,8,.7) 55%,rgba(150,40,8,0) 100%);mix-blend-mode:multiply"></div>`}

  <div class="cheio" style="clip-path:${poli}">
    <div class="cheio" style="background:radial-gradient(ellipse 46% 62% at 80% 56%,#ff9a24 0%,#f0560f 30%,#b01a09 58%,#3d0704 84%,#140302 100%)"></div>
    <img src="${img('deserto.png')}" style="position:absolute;left:${o.fundoX ?? 560}px;top:-70px;width:1160px;height:870px;filter:blur(5px) saturate(1.3) contrast(1.3);mix-blend-mode:soft-light;opacity:.8">
    <div class="cheio" style="background:linear-gradient(180deg,rgba(10,2,1,.86) 0%,rgba(10,2,1,.55) 20%,rgba(10,2,1,0) 36%,rgba(10,2,1,0) 74%,rgba(10,2,1,.8) 100%)"></div>
    ${riscos(21, 26)}
    <div class="cheio" style="background:linear-gradient(90deg,rgba(0,0,0,.78) ${(BORDA - 14).toFixed(0)}px,rgba(0,0,0,.28) ${(BORDA + 70).toFixed(0)}px,rgba(0,0,0,0) ${(BORDA + 190).toFixed(0)}px)"></div>
    ${brasas(8, 34, BORDA, W)}
  </div>
  <svg class="cheio" viewBox="0 0 ${W} ${H}"><path d="${caminho}" fill="none" stroke="#fff3d6" stroke-width="4" stroke-linejoin="round" style="filter:drop-shadow(0 0 9px rgba(255,150,40,.95))"/></svg>

  ${o.esq ? '' : `<div class="cheio" style="filter:drop-shadow(5px 6px 5px rgba(0,0,0,.75))"><img class="arte" src="${img('ref.jpg')}" style="clip-path:polygon(${BOCA})"></div>`}

  ${logo(BORDA + 44, 26, o.logoK ?? 0.98)}
  ${grande(texto, o.textoX ?? BORDA + 56, o.textoY ?? 268, o.giro ?? -5)}
  ${o.papel === null ? '' : papel(o.papel ?? 'FOI UM PAPEL.', o.papelX ?? BORDA + 70, o.papelY ?? 584, -5, o.papelTam ?? 56)}

  <div class="cheio" style="background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 62%,rgba(0,0,0,.5) 100%)"></div>
  <div class="cheio" style="filter:url(#grao);opacity:.10;mix-blend-mode:overlay"></div>
</div>`;
  },
};
/* b: a silhueta do cavaleiro (captura oficial do jogo) em laranja e preto, "MORTO POR UM PAPEL" */
VARIANTES.b = () =>
  VARIANTES.a({
    esq: `<img src="${img('silhueta.jpg')}" style="position:absolute;left:-196px;top:-6px;width:1296px;height:729px;filter:contrast(1.5) saturate(1.1) brightness(.9)">
  <div class="cheio" style="background:linear-gradient(180deg,#ffc35e 0%,#f2650f 50%,#8a1406 100%);mix-blend-mode:multiply"></div>
  <div class="cheio" style="background:radial-gradient(ellipse 380px 300px at 470px 150px,rgba(255,220,130,.65),rgba(255,160,40,0) 75%);mix-blend-mode:screen"></div>
  <div class="cheio" style="background:radial-gradient(ellipse 62% 78% at 33% 48%,rgba(0,0,0,0) 55%,rgba(0,0,0,.62) 100%)"></div>`,
    texto: [
      { t: 'MORTO POR', tam: 90 },
      { t: 'UM PAPEL', tam: 118, sobe: -2, dx: -4 },
    ],
    textoY: 300,
    papel: 'SEM UM TIRO.',
    papelY: 566,
  });

/* c: o rosto do Arthur, "ELE JÁ SABIA?" */
VARIANTES.c = () =>
  VARIANTES.a({
    esq: `<img src="${img('arthur.jpg')}" style="position:absolute;left:-96px;top:-52px;width:1010px;height:927px;filter:blur(.7px) brightness(1.75) contrast(1.18) saturate(1.2)">
  <div class="cheio" style="background:linear-gradient(100deg,#ff9a4a 0%,#ffb066 45%,#ff7a2a 100%);mix-blend-mode:soft-light;opacity:.9"></div>
  <div class="cheio" style="background:linear-gradient(90deg,rgba(0,0,0,0) 46%,rgba(20,4,2,.82) 60%)"></div>
  <div class="cheio" style="background:linear-gradient(90deg,rgba(170,34,10,.95) 0%,rgba(170,34,10,.55) 12%,rgba(170,34,10,0) 30%);mix-blend-mode:multiply"></div>
  <div class="cheio" style="background:radial-gradient(ellipse 330px 560px at ${(BORDA + 10).toFixed(0)}px 380px,rgba(255,120,20,.55),rgba(255,120,20,0) 78%);mix-blend-mode:screen"></div>
  <div class="cheio" style="background:linear-gradient(90deg,rgba(0,0,0,.72) 0%,rgba(0,0,0,0) 26%)"></div>
  <div class="cheio" style="background:radial-gradient(ellipse 58% 82% at 34% 46%,rgba(0,0,0,0) 58%,rgba(0,0,0,.66) 100%)"></div>`,
    texto: [
      { t: 'ELE JÁ', tam: 132 },
      { t: 'SABIA?', tam: 152, sobe: -4, dx: -4 },
    ],
    textoY: 262,
    papel: 'ANTES DA TOSSE',
    papelY: 580,
  });

/* ------------------------------------------------------------------ */
/* d: feita do zero com as duas fotos. O deserto ao pôr do sol é o fundo */
/* inteiro; o cavalo empinado da foto da floresta entra recortado em     */
/* silhueta (recorta.py), na frente do sol; o texto fica à esquerda.     */
/* ------------------------------------------------------------------ */
const chao = (sem) => {
  // capim em silhueta: uma encosta que sobe da esquerda até o pé do cavalo
  const r = rnd(sem);
  const pts = [`-10,${H + 10}`];
  let x = -10;
  while (x < 760) {
    const t = Math.min(1, Math.max(0, (x - 250) / 320));
    const onda = 7 * Math.sin(x / 47) + 4 * Math.sin(x / 19 + 2);
    const base = H - (46 + onda + 122 * t * t * (3 - 2 * t));
    const folha = 3 + r() * 11 + (r() > 0.9 ? 10 + r() * 16 : 0);
    const larg = 3 + r() * 6;
    pts.push(`${x.toFixed(1)},${(base + 4).toFixed(1)}`, `${(x + larg * (0.15 + r() * 0.7)).toFixed(1)},${(base - folha).toFixed(1)}`, `${(x + larg).toFixed(1)},${(base + 4).toFixed(1)}`);
    x += larg * (0.6 + r() * 0.5);
  }
  pts.push(`760,${H + 10}`);
  return pts.join(' ');
};

const poeira = (sem, n) => {
  const r = rnd(sem);
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = r() * W;
    const y = 60 + r() * 600;
    const t = 1.5 + r() * r() * 7;
    s += `<div style="position:absolute;left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;width:${t.toFixed(1)}px;height:${t.toFixed(1)}px;border-radius:50%;background:#ffe2a0;box-shadow:0 0 ${(t * 2.2).toFixed(0)}px ${(t * 0.7).toFixed(0)}px rgba(255,150,40,.85);opacity:${(0.25 + r() * 0.6).toFixed(2)}"></div>`;
  }
  return s;
};

VARIANTES.d = (o = {}) => {
  const SOL = [1028, 214];
  return `
<div id="t" style="background:#1a0703">
  <img src="${img('deserto.png')}" style="position:absolute;left:0;top:-66px;width:1280px;height:960px;filter:saturate(1.35) contrast(1.14) brightness(1.06)">
  <div class="cheio" style="background:linear-gradient(180deg,#ffb23e 0%,#ff9426 34%,#ee6a16 62%,#a82a0a 100%);mix-blend-mode:multiply;opacity:.66"></div>
  <div class="cheio" style="background:radial-gradient(circle 94px at ${SOL[0]}px ${SOL[1]}px,#fffbe6 0%,#fff0b8 62%,rgba(255,225,140,0) 100%)"></div>
  <div class="cheio" style="background:radial-gradient(circle 520px at ${SOL[0]}px ${SOL[1]}px,rgba(255,214,120,.92) 0%,rgba(255,150,40,.5) 34%,rgba(255,110,20,0) 72%);mix-blend-mode:screen"></div>
  <div class="cheio" style="background:repeating-conic-gradient(from 8deg at ${SOL[0]}px ${SOL[1]}px,rgba(255,235,170,.15) 0deg 2.2deg,rgba(255,235,170,0) 2.2deg 9deg,rgba(255,235,170,.08) 9deg 10.4deg,rgba(255,235,170,0) 10.4deg 17deg);-webkit-mask-image:radial-gradient(circle 640px at ${SOL[0]}px ${SOL[1]}px,#000 10%,transparent 100%);mask-image:radial-gradient(circle 640px at ${SOL[0]}px ${SOL[1]}px,#000 10%,transparent 100%);mix-blend-mode:screen"></div>
  <div class="cheio" style="background:linear-gradient(90deg,rgba(18,4,2,.50) 0%,rgba(18,4,2,.30) 28%,rgba(18,4,2,0) 52%)"></div>
  <div class="cheio" style="background:radial-gradient(ellipse 760px 430px at 0px 0px,rgba(170,44,8,.85) 0%,rgba(170,44,8,.45) 55%,rgba(170,44,8,0) 100%);mix-blend-mode:multiply"></div>

  <div class="cheio" style="filter:drop-shadow(0 0 16px rgba(255,170,60,.65)) drop-shadow(0 0 3px rgba(255,220,150,.75))">
    <img src="${img('heroi.png')}" style="position:absolute;left:327px;top:-22px;width:1320px;height:742.5px">
    <svg class="cheio" viewBox="0 0 ${W} ${H}"><polygon points="${chao(31)}" fill="#0c0403"/></svg>
  </div>
  <div class="cheio" style="background:linear-gradient(180deg,rgba(0,0,0,0) 80%,rgba(8,2,1,.75) 100%)"></div>
  ${poeira(12, 40)}

  <div style="position:absolute;left:52px;top:30px;transform:scale(.6);transform-origin:left top">${logo(0, 0, 1)}</div>

  <div style="position:absolute;left:52px;top:${o.textoY ?? 150}px;transform:rotate(-3deg);transform-origin:left center">
    <div class="imp" style="font-size:${o.tam1 ?? 172}px">${o.l1 ?? 'ACABOU'}</div>
    <div style="display:flex;align-items:flex-end;gap:22px;margin-top:2px">
      <div class="imp" style="font-size:${o.tam2 ?? 172}px">${o.l2 ?? 'EM'}</div>
      <div class="caixa" style="font-size:${o.tam2 ?? 172}px">${o.destaque ?? '1890'}</div>
    </div>
    <div class="fita">${o.fita ?? '9 ANOS ANTES DO JOGO'}</div>
  </div>

  <div class="cheio" style="background:radial-gradient(ellipse at 50% 46%,rgba(0,0,0,0) 60%,rgba(0,0,0,.52) 100%)"></div>
  <div class="cheio" style="filter:url(#grao);opacity:.09;mix-blend-mode:overlay"></div>
</div>`;
};

(async () => {
  const quais = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(VARIANTES);
  const nav = await chromium.launch();
  const pag = await nav.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  fs.mkdirSync(path.join(RAIZ, 'out'), { recursive: true });
  for (const v of quais) {
    await pag.setContent(`<html><head><style>${CSS}</style></head><body>${FILTROS}${VARIANTES[v]()}</body></html>`);
    await pag.evaluate(() => document.fonts.ready);
    await pag.evaluate(() => {
      document.querySelectorAll('.grande[data-max]').forEach((el) => {
        const max = Number(el.dataset.max);
        let tam = parseFloat(getComputedStyle(el).fontSize);
        while (el.querySelector('.tinta').offsetWidth > max && tam > 30) {
          tam -= 1;
          el.style.fontSize = `${tam}px`;
        }
      });
    });
    await pag.waitForTimeout(400);
    await pag.locator('#t').screenshot({ path: path.join(RAIZ, 'out', `thumb-${v}.png`) });
    console.log(`out/thumb-${v}.png`);
  }
  await nav.close();
})();

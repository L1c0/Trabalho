# Prompt de abertura para o Claude Code

Cole isto na primeira mensagem, dentro da pasta do projeto.

---

Você vai montar um ensaio em vídeo de 8min42 em Remotion. Todo o material
já existe e todas as decisões já foram tomadas — seu trabalho é
construir, não redesenhar.

**Leia nesta ordem, antes de escrever qualquer código:**

1. `README.md` — a ideia central, o estilo de edição e a especificação de
   cada componente com tamanho e posição
2. `src/theme.ts` — cor, fonte, escala, grade
3. `src/data/assets.ts` — as 31 peças, com uma nota de uso em cada uma
4. `src/data/timeline.ts` — a montagem inteira, frame a frame

Depois crie `src/lib/` com os componentes que o README especifica
(`Papel`, `Painel`, `Tingido`, `Regua`, `Tres`, `Citacao`, `TituloBloco`,
`Grao`), `src/Ensaio.tsx` encadeando a partir de `timeline.ts`, e
`src/Root.tsx` com uma composição de 15671 frames a 30fps, 1920x1080.

**Três coisas que quebram o filme se você errar:**

- Os arquivos de `public/classico/` são cinza+alfa e **não têm cor**. A
  cor vem do componente `Tingido`, que mapeia o cinza contra o papel do
  momento. Num `<Img>` cru eles saem cinza morto.
- O papel muda de cor ao longo do filme e isso **não é um bug**. Começa
  no verde da fosfofilita. Se parecer "errado", leia o README de novo.
- Preto puro só existe em três frames marcados em `timeline.ts`. Em
  qualquer outro lugar o preto é `cor.tinta`.

**Não invente nada que não esteja nos arquivos.** Se faltar informação,
pergunte em vez de preencher. Sem transição, sem spring, sem partícula,
sem parallax — a lista de proibições está no README e ela é literal.

Quando terminar, rode `npx remotion studio` e me diga a URL. Renderize só
os três trechos de `aprovacao` em `timeline.ts` antes de qualquer render
completo.

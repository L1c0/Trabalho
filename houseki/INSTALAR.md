# Como montar o projeto

Baixe as cinco partes e descompacte **todas na mesma pasta**. Elas se
encaixam numa arvore so:

```
houseki/
  README.md          <- leia este primeiro
  PROMPT.md          <- a mensagem para colar no Claude Code
  INSTALAR.md        <- este arquivo
  transcricao.txt    o que a voz diz em cada instante
  mockup-mohs.png    referencia de layout da regua
  src/
    theme.ts         cor, fonte, escala, grade, o papel
    data/assets.ts   as 32 pecas, com nota de uso em cada uma
    data/timeline.ts a montagem inteira: 44 planos, o som, os pretos
  public/
    audio/           6 arquivos, todos ja no nivel final
    manga/           21 quadros
    classico/        11 pranchas
```

Confira que chegou tudo:

```bash
ls public/manga | wc -l      # 21
ls public/classico | wc -l   # 11
ls public/audio | wc -l      # 6
```

Depois:

```bash
npm create video@latest houseki-video   # template "Blank"
cd houseki-video
npm i @remotion/google-fonts
```

Copie `src/` e `public/` desta pasta por cima do projeto novo, abra o
Claude Code ali dentro e cole o conteudo de `PROMPT.md`.

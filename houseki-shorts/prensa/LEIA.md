# A prensa

O que entrega imagem gerada não é falta de textura. É a **regularidade**
dela: grão igual em toda a tela, tinta da mesma densidade do canto
esquerdo ao direito, tipo alinhado ao pixel, nada fora de registro.

Filtro de *film grain* não resolve, porque filtro também é uniforme. Ele
só troca um tipo de regularidade por outro.

Então aqui não tem filtro. Tem um modelo do que acontece quando tinta
encosta em papel sob pressão:

| fenômeno | o que faz |
|---|---|
| papel | tom irregular, fibra com direção de máquina, pintas de polpa |
| forme | a chapa entra torta. sempre entra. 0,1° a 0,4° |
| ganho | a tinta espalha; traço fino engorda proporcionalmente mais |
| mordida | a prensa empurra tinta pra borda do traço, que fica mais densa |
| batida | a pressão não é igual na folha; um canto entrega mais tinta |
| falha | onde entrou pouca tinta, chapa — em **mancha**, não em pontinho |

Cada parâmetro é um fenômeno, não um gosto. É por isso que o resultado
não sai simétrico: ele herda uma história física.

---

## A regra que faz ou quebra isso em vídeo

**A prensa roda uma vez por cartela. Nunca por frame.**

Se a semente mudar a cada frame, o papel ferve: o grão pisca, a mancha
anda, a falha troca de lugar 30 vezes por segundo. Grão fervendo é o tell
mais óbvio que existe — é exatamente assim que se reconhece ruído
aplicado em camada de vídeo.

Papel de verdade não muda. Só a câmera se move.

Arquitetura:

```
Python (prensa.py)          Remotion
─────────────────────       ─────────────────────
imprime a cartela      →    <Img> da cartela pronta
em 1,16x o frame            câmera: escala + pan
                            revelação: máscara por cima
```

A revelação da tinta **não re-imprime nada.** Ela descobre pixel que já
estava impresso, com uma máscara que avança por um campo irregular. É o
que a tinta faz ao secar, e sai de graça.

O Remotion não consegue fazer a prensa — filtro de CSS é uniforme por
definição. Ele faz bem a outra metade: mover a câmera sobre a folha.

---

## Uso

```python
import prensa as P

folha = P.papel(1920, 1080, (0xCD, 0xC7, 0xBB), semente=7)

ch = P.chapa(1920, 1080)
f = P.fonte("cormorant-700.ttf", 212)
P.linha(ch, "THORFINN", f, x=240, y=548, tracking=0.012,
        semente=1, tremor=0.9)        # tremor = linha de base bamba

folha = P.imprimir(folha, ch, tinta=(0x14,0x12,0x0E), semente=11,
                   ganho=1.0, mordida=0.62, batida=0.30, falha=0.55,
                   torcao=0.16)

P.salvar(folha, "cartela.png")
```

**`P.arrancar()`** em vez de `P.imprimir()` faz tipo vazado: a chapa vira
o fundo e a letra fica em reserva. É assim que sai o branco riscado da
identidade do canal — a falha acontece **na tinta em volta**, não na
letra. Nenhum efeito de *distress* por cima.

**`P.gravura()`** converte um PNG do mangá em chapa. Usa pontos de branco
e preto, nunca contraste simétrico: contraste simétrico puxa o branco pra
cinza, a margem branca da PNG vira 9% de tinta, e aquilo desenha uma
moldura cinza em volta do quadro. A moldura entrega na hora que é imagem
colada, não impressa.

**`P.caixa_tinta()`** diz onde a tinta termina de verdade. Anton tem
caixa muito maior que o olho do número, então empilhar bloco pela métrica
da fonte sempre atropela. Mede.

---

## Duas chapas fora de registro

A cartela de abertura passa duas vezes: uma de ferrugem deslocada 2px, e
a preta por cima. O deslocamento tem que ficar entre 1 e 3 pixels — acima
disso para de ler como desalinho de registro e vira sombra de Word Art.

---

## O que não entra

Dourado. Vermelho sangue. Serifa com degradê e brilho atrás. Preto
profundo como fundo de quadro de mangá (multiply sobre escuro achata o
traço e deixa a tela cor de barro — o preto trabalha nas cartelas de
tipo, que é onde ele é bom).

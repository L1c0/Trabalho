import sys; sys.path.insert(0,'/mnt/user-data/outputs/vinland/prensa')
import numpy as np
from PIL import Image, ImageDraw
import prensa as P
TW,TH=1080,1920; MG=96; COL=TW-2*MG
TURFA=(0x15,0x13,0x0F); FERRUGEM=(0x7A,0x3B,0x22); PAPEL=(0xE0,0xDC,0xD2)
AN=lambda c:P.fonte('anton.ttf',c); EG=lambda c:P.fonte('ebg-500.ttf',c)
EB=lambda c:P.fonte('ebg-700.ttf',c); OS=lambda c:P.fonte('oswald.ttf',c)

def cabe(txt,fab,alvo,lo=40,hi=460,tr=-0.02):
    """Maior corpo cujo desenho real caiba na coluna. Mede, nao estima."""
    melhor=lo
    while lo<=hi:
        m=(lo+hi)//2
        c=P.chapa(TW,TH); P.linha(c,txt,fab(m),0,0,tracking=tr)
        cx=P.caixa_tinta(c)
        w=(cx[2]-cx[0]) if cx else 0
        if w<=alvo: melhor=m; lo=m+2
        else: hi=m-2
    return melhor

def poe(ch,txt,fab,corpo,x,y,tr=0.0,sem=0,trem=0.0):
    """Desenha e devolve a caixa de tinta REAL (x0,y0,x1,y1)."""
    antes=P.caixa_tinta(ch)
    P.linha(ch,txt,fab(corpo),x,y,tracking=tr,semente=sem,tremor=trem)
    dep=P.caixa_tinta(ch)
    return dep if antes is None else (
        min(antes[0],dep[0]),min(antes[1],dep[1]),max(antes[2],dep[2]),max(antes[3],dep[3]))

def folha(s): return P.papel(TW,TH,PAPEL,semente=s,aspereza=2.0)
def bate(f,ch,tinta=TURFA,sem=4,grande=False,**kw):
    # tipo grande precisa manchar: area solida nunca entinta uniforme
    k=dict(ganho=0.62,mordida=0.30,batida=0.26,falha=0.78,torcao=0.10) if grande \
      else dict(ganho=0.58,mordida=0.26,batida=0.26,falha=0.46,torcao=0.10)
    k.update(kw); return P.imprimir(f,ch,tinta=tinta,semente=sem,**k)

def q3():
    f=folha(21)
    c=P.chapa(TW,TH); P.linha(c,'DUREZA NA ESCALA MOHS',OS(38),MG,230,tracking=0.22,semente=1)
    f=bate(f,c,sem=22)
    # 3,5 — corpo medido pra ocupar 56% da coluna
    cp=cabe('3,5',AN,COL*0.56)
    c=P.chapa(TW,TH); cx=poe(c,'3,5',AN,cp,MG-14,330,tr=-0.03,sem=2,trem=1.4)
    f=bate(f,c,sem=23,grande=True)
    yb=cx[3]+54                                  # DEPOIS da tinta, nao do passo fixo
    c=P.chapa(TW,TH); P.linha(c,'FOSFOFILITA',OS(52),MG,yb,tracking=0.14,semente=3)
    f=bate(f,c,tinta=FERRUGEM,sem=24,ganho=0.62,desloc=(1.8,-1.2))
    c=P.chapa(TW,TH); cx2=poe(c,'10',AN,int(cp*0.44),MG-8,yb+210,tr=-0.03,sem=4,trem=1.0)
    f=bate(f,c,sem=25,grande=True)
    c=P.chapa(TW,TH); P.linha(c,'DIAMANTE',OS(40),MG+4,cx2[3]+40,tracking=0.14,semente=5)
    f=bate(f,c,sem=27)
    c=P.chapa(TW,TH); d=ImageDraw.Draw(c); rx=TW-180
    y0,y1=330,cx2[3]+40
    d.rectangle([rx,y0,rx+5,y1],fill=255)
    for i in range(1,11):
        yy=y0+(i-1)*((y1-y0)/9); L=84 if i in (4,10) else 36
        d.rectangle([rx-L,yy-2,rx,yy+2],fill=255)
    return bate(f,c,sem=26,ganho=0.6,mordida=0.2,falha=0.45)

def q4():
    f=folha(31)
    c=P.chapa(TW,TH)
    P.linha(c,'a autora escolheu, pra protagonista',EG(48),MG,420,semente=1,tremor=0.5)
    P.linha(c,'de um manga sobre perder o corpo',EG(48),MG,484,semente=2,tremor=0.5)
    f=bate(f,c,sem=32)
    c=P.chapa(TW,TH); cx=poe(c,'PEDACO POR PEDACO,',EB,cabe('PEDACO POR PEDACO,',EB,COL,tr=0.02),
                             MG,580,tr=0.02,sem=3,trem=0.8)
    f=bate(f,c,sem=33,ganho=0.64,mordida=0.3,falha=0.55)
    linhas=['A PEDRA','MAIS FRAGIL','QUE EXISTE']
    cp=min(cabe(t,AN,COL) for t in linhas)       # mesma medida pras tres
    c=P.chapa(TW,TH); y=cx[3]+58
    for i,t in enumerate(linhas):
        b=poe(c,t,AN,cp,MG-8,y,tr=-0.02,sem=4+i,trem=1.2)
        y=b[3]+18
    f=bate(f,c,sem=34,grande=True)
    print('corpo das tres linhas:',cp,flush=True)
    return f

sh=Image.new('RGB',(2*368+28,700),(244,244,241))
d=ImageDraw.Draw(sh); fo=P.fonte('oswald.ttf',21)
for i,(rot,fn) in enumerate([('3  numero contra numero',q3),('4  frase que acumula',q4)]):
    a=fn(); P.salvar(a,f'tipo-{i+3}.jpg',q=95)
    sh.paste(Image.fromarray(np.clip(a,0,255).astype(np.uint8)).resize((344,611),Image.LANCZOS),(20+i*368,56))
    d.text((20+i*368,22),rot,font=fo,fill=(22,22,22)); print(rot,'ok',flush=True)
sh.save('/mnt/user-data/outputs/shorts-tipo-corrigido.jpg',quality=94); print('ok')

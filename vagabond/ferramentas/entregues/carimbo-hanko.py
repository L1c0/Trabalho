import sys, os, subprocess; sys.path.insert(0,'/mnt/user-data/outputs/vinland/prensa')
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
import prensa as P

W,H=1920,1080
WASHI=(0xE3,0xDF,0xD5); VERM=(0x9E,0x3B,0x2E); SUMI=(0x1A,0x17,0x14)
OS=lambda c:P.fonte('oswald.ttf',c)

def selo(lado_w, lado_h, linhas, semente=7):
    """Um hanko: tinta vermelha irregular, letra em RESERVA (papel),
    borda mordida. A letra nunca e desenhada por cima — ela e o papel
    que o carimbo nao cobriu."""
    g=np.random.default_rng(semente)
    cx=P.chapa(lado_w,lado_h); d=ImageDraw.Draw(cx)
    d.rectangle([0,0,lado_w-1,lado_h-1],fill=255)
    a=np.asarray(cx,float)/255
    # borda mordida: o contorno de um carimbo nunca e reto
    yy,xx=np.mgrid[0:lado_h,0:lado_w]
    ru=ndimage.gaussian_filter(g.random((lado_h,lado_w)),3.0)
    ru=(ru-ru.mean())/(ru.std()+1e-9)
    borda=np.minimum.reduce([xx,yy,lado_w-1-xx,lado_h-1-yy]).astype(float)
    a=a*np.clip((borda-3-ru*2.6)/4.0,0,1)
    # tinta desigual: o miolo do carimbo entinta menos que as bordas
    dens=ndimage.gaussian_filter(g.random((lado_h,lado_w)),22.0)
    dens=(dens-dens.mean())/(dens.std()+1e-9)
    a=np.clip(a*(0.93+0.085*dens),0,1)
    poro=ndimage.gaussian_filter(g.random((lado_h,lado_w)),2.2)
    poro=(poro-poro.mean())/(poro.std()+1e-9)
    perto=np.clip(1-borda/26.0,0,1)
    a=a*(1-np.clip((poro*0.5+0.42)*perto,0,1)*0.55)
    # a letra, em reserva
    tipo=P.chapa(lado_w,lado_h)
    y=int(lado_h*0.30)
    for t,corpo in linhas:
        P.linha(tipo,t,OS(corpo),lado_w//2,y,tracking=0.18,ancora='centro',semente=3)
        y+=int(corpo*1.72)
    tt=np.clip(ndimage.gaussian_filter(np.asarray(tipo,float)/255,0.7)*1.9,0,1)
    return np.clip(a*(1-tt),0,1)

LW,LH=330,430
S=selo(LW,LH,[('INSCREVA-SE',40),('E DEIXA',40),('O LIKE',40)])
base=P.papel(W,H,WASHI,semente=5,aspereza=1.9)
# um pouco de conteudo atras, pro selo ter sobre o que cair
c=P.chapa(W,H)
P.linha(c,'eu só falo o que consigo checar',P.fonte('ebg-500.ttf',58),150,430,semente=2,tremor=0.6)
P.linha(c,'e quando não consigo, eu digo',P.fonte('ebg-500.ttf',58),150,510,semente=3,tremor=0.6)
P.linha(c,'que não consegui.',P.fonte('ebg-500.ttf',58),150,590,semente=4,tremor=0.6)
base=P.imprimir(base,c,tinta=SUMI,semente=9,ganho=0.52,mordida=0.24,falha=0.5,torcao=0.08)

os.makedirs('cb',exist_ok=True)
X0,Y0=W-LW-170, 300
N=54
for f in range(N):
    quadro=base.copy()
    if f>=10:
        t=min(1.0,(f-10)/7.0)
        # o carimbo desce: escala de 1.05 a 1.0 e tinta subindo
        s=1.05-0.05*t
        lw,lh=int(LW*s),int(LH*s)
        sel=np.asarray(Image.fromarray((S*255).astype(np.uint8)).resize((lw,lh),Image.LANCZOS),float)/255
        # inclinacao: ninguem carimba reto
        sel=ndimage.rotate(sel,-2.4,reshape=False,order=1,mode='constant',cval=0)
        cob=sel*np.clip(t*1.25,0,1)
        if f>=17:                       # assentou: pequeno ganho de tinta
            cob=np.clip(cob*1.04,0,1)
        x,y=X0-(lw-LW)//2, Y0-(lh-LH)//2
        reg=quadro[y:y+lh, x:x+lw]
        tinta=np.array(VERM,float)[None,None,:]
        quadro[y:y+lh, x:x+lw]=reg*(1-cob[...,None])+tinta*cob[...,None]
    Image.fromarray(np.clip(quadro,0,255).astype(np.uint8)).save(f'cb/{f:03d}.png')
subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-framerate','30','-i','cb/%03d.png',
 '-c:v','libx264','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart',
 '/mnt/user-data/outputs/vag-carimbo.mp4'])
Image.open(f'cb/{N-1:03d}.png').save('/mnt/user-data/outputs/vag-carimbo.jpg',quality=95)
print('pronto')

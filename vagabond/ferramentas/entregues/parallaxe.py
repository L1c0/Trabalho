import numpy as np, subprocess, os
from PIL import Image
from scipy import ndimage
SRC='/mnt/user-data/attachments/910b9125-9f14-5862-8a0a-396e2e4a9b5d/895b4439-image.webp'
im=Image.open(SRC).convert('RGB')
im=im.resize((2400,int(2400*im.height/im.width)),Image.LANCZOS)
a=np.asarray(im,float); H,W,_=a.shape
lum=0.30*a[...,0]+0.59*a[...,1]+0.11*a[...,2]
yy,xx=np.mgrid[0:H,0:W]; fx,fy=xx/W,yy/H

# regioes marcadas A MAO, olhando a gravura. A forma dentro delas ainda
# sai do traco (limiar local), mas o limiar nunca sai da regiao.
REG=[(0.00,0.00,0.26,0.30),   # galho superior esquerdo
     (0.42,0.00,0.62,0.10),   # ramo central no topo
     (0.66,0.00,1.00,0.62)]   # o tronco grosso da direita e seus galhos
reg=np.zeros((H,W),bool)
for x0,y0,x1,y1 in REG:
    reg |= (fx>=x0)&(fx<x1)&(fy>=y0)&(fy<y1)
pinheiro = reg & (lum<110)
pinheiro = ndimage.binary_closing(pinheiro,np.ones((9,9)))
rot,n=ndimage.label(pinheiro)
if n:
    t=np.bincount(rot.ravel()); t[0]=0
    pinheiro=np.isin(rot,np.where(t>2500)[0])
pinheiro=ndimage.binary_dilation(pinheiro,np.ones((3,3)))
mar=((a[...,2]>110)&(a[...,2]-a[...,0]>25)&(fy>0.25))
print(f'pinheiro {100*pinheiro.mean():.1f}% do quadro   invade mar {100*(pinheiro&mar).sum()/max(mar.sum(),1):.2f}%')

def tapar(img,m,passos=30):
    out=img.copy(); mm=m.astype(float)[...,None]
    for _ in range(passos):
        out=out*(1-mm)+ndimage.uniform_filter(out,size=(25,25,1))*mm
    return out
fundo=tapar(a,pinheiro)
Image.fromarray((pinheiro*255).astype(np.uint8)).save('/mnt/user-data/outputs/vag-mascara.jpg')

# so DOIS planos: pinheiro e o resto. Sem costura no horizonte.
mp=ndimage.gaussian_filter(pinheiro.astype(float),1.2)[...,None]
planos=[(fundo,np.ones_like(mp),0.055,0.008),(a,mp,0.135,0.032)]
OW,OH=1920,1080; N=150
os.makedirs('px2',exist_ok=True)
for f in range(N):
    t=f/(N-1); e=t*t*(3-2*t)
    acc=np.zeros((OH,OW,3))
    for img,msc,ganho,drift in planos:
        s=1.0+ganho*e; nw,nh=int(W*s),int(H*s)
        p=np.asarray(Image.fromarray(np.clip(img,0,255).astype(np.uint8)).resize((nw,nh),Image.LANCZOS),float)
        mm=np.asarray(Image.fromarray((np.clip(msc[...,0],0,1)*255).astype(np.uint8)).resize((nw,nh),Image.LANCZOS),float)[...,None]/255
        x0=int(nw/2+drift*W*e-OW/2); y0=int(nh*0.54-OH/2)
        X0,Y0=max(0,x0),max(0,y0); X1,Y1=min(nw,x0+OW),min(nh,y0+OH)
        sub=p[Y0:Y1,X0:X1]; sm=mm[Y0:Y1,X0:X1]; h2,w2=sub.shape[:2]
        dy,dx=Y0-y0,X0-x0
        acc[dy:dy+h2,dx:dx+w2]=acc[dy:dy+h2,dx:dx+w2]*(1-sm)+sub*sm
    Image.fromarray(np.clip(acc,0,255).astype(np.uint8)).save(f'px2/{f:04d}.png')
subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-framerate','30','-i','px2/%04d.png',
  '-c:v','libx264','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',
  '/mnt/user-data/outputs/vag-parallaxe.mp4'])
Image.open(f'px2/{N-1:04d}.png').save('/mnt/user-data/outputs/vag-px-fim.jpg',quality=94)
print('pronto')

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
A='/mnt/user-data/attachments/910b9125-9f14-5862-8a0a-396e2e4a9b5d'
WASHI=(0xE3,0xDF,0xD5); SUMI=(0x1A,0x17,0x14)

def tratar(src, larg, semente=3):
    """Equivalente da prensa, mas para pincel: fibra do papel, mordida
    umida na borda do traco, e grao de washi. Sem retícula, sem prensa."""
    im=Image.open(src).convert('L')
    k=larg/im.width
    im=im.resize((int(larg),int(im.height*k)),Image.LANCZOS)
    a=np.asarray(im,float)/255
    # pontos de branco e preto da propria peca (nunca contraste simetrico)
    hi,lo=np.percentile(a,97),np.percentile(a,3)
    cob=np.clip((hi-a)/max(hi-lo,1e-6),0,1)
    g=np.random.default_rng(semente)
    H,W=cob.shape
    # fibra: a tinta corre um pouco mais em alguns caminhos
    fibra=ndimage.gaussian_filter(g.normal(0,1,(H,W)),(0.6,2.8))
    fibra=(fibra-fibra.mean())/(fibra.std()+1e-9)
    # mordida umida: a borda do traco acumula pigmento
    borda=np.abs(ndimage.gaussian_filter(cob,1.0)-ndimage.gaussian_filter(cob,2.6))
    cob=np.clip(cob*(1+0.16*fibra*cob)+borda*0.55,0,1)
    cob=np.clip(cob**0.92,0,1)
    # papel
    yy,xx=np.mgrid[0:H,0:W]
    tom=np.array(WASHI,float)[None,None,:]*np.ones((H,W,1))
    nuvem=ndimage.gaussian_filter(g.random((H,W)),26); nuvem=(nuvem-nuvem.mean())/(nuvem.std()+1e-9)
    tom=tom*(1+0.028*nuvem[...,None])
    grao=g.normal(0,3.4,(H,W,1))+ndimage.gaussian_filter(g.normal(0,1,(H,W)),(0.4,1.6))[...,None]*2.6
    folha=tom+grao
    tinta=np.array(SUMI,float)[None,None,:]
    out=folha*(1-cob[...,None])+tinta*cob[...,None]
    return np.clip(out,0,255)

SRC=f'{A}/fa61940e-image.jpg'
print('origem', Image.open(SRC).size)
sh=Image.new('RGB',(3*640+40,520),(244,244,241))
d=ImageDraw.Draw(sh)
import sys; sys.path.insert(0,'/mnt/user-data/outputs/vinland/prensa'); import prensa as P
fo=P.fonte('oswald.ttf',20)
for i,pct in enumerate([50,80,100]):
    larg=int(1920*pct/100)
    r=tratar(SRC,larg,semente=3+i)
    im=Image.fromarray(r.astype(np.uint8))
    gr=P.medir_grao(r)
    im.save(f'/mnt/user-data/outputs/sumi-{pct}.jpg',quality=95)
    th=im.resize((620,int(620*im.height/im.width)),Image.LANCZOS)
    sh.paste(th,(14+i*640,44))
    d.text((14+i*640,14),f'{pct}% da largura  ({larg}px)   grao {gr:.1f}',font=fo,fill=(22,22,22))
sh.save('/mnt/user-data/outputs/sumi-prova.jpg',quality=94)
print('prova pronta')

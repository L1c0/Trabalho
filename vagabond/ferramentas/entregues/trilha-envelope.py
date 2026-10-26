import subprocess, numpy as np, re, os
SRC='/root/.claude/uploads/910b9125-9f14-5862-8a0a-396e2e4a9b5d/6e1e37a9-_____.mp3'
DUR=551.26; SR=48000

# leito continuo de 551s: duas passadas emendadas num vale de energia
subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-ss','0','-t','186','-i',SRC,
                '-ar',str(SR),'-ac','2','-c:a','pcm_f32le','a.wav'])
subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-ss','23','-t','200','-i',SRC,
                '-ar',str(SR),'-ac','2','-c:a','pcm_f32le','b.wav'])
subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i','a.wav','-i','b.wav',
  '-filter_complex','[0][1]acrossfade=d=9:c1=tri:c2=tri[o]','-map','[o]',
  '-c:a','pcm_f32le','bed.wav'])

d=subprocess.run(['ffmpeg','-nostdin','-v','error','-i','bed.wav','-f','f32le','-ac','2',
                  '-ar',str(SR),'-'],capture_output=True).stdout
x=np.frombuffer(d,dtype=np.float32).astype(np.float64).reshape(-1,2)
need=int(DUR*SR)
while len(x)<need: x=np.vstack([x,x[:need-len(x)]])
x=x[:need]

# --- o envelope SEGUE A SATURACAO. Cinza nao tem batida. ---
# (segundo, ganho relativo). 0 = mudo.
PTS=[(0,0.0),(150,0.0),(155,0.10),(224,0.34),(289,0.62),(314,1.00),(330,1.00),
     (333,0.42),(346,0.30),(360,0.22),(401,0.12),(440,0.07),(500,0.03),
     (515,0.0),(551,0.0)]
t=np.arange(need)/SR
ts=np.array([p[0] for p in PTS]); gs=np.array([p[1] for p in PTS])
env=np.interp(t,ts,gs)
env=np.convolve(env,np.ones(int(SR*1.5))/int(SR*1.5),'same')  # sem degrau
y=x*env[:,None]

y.astype(np.float32).tofile('bed_env.f32')
subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2',
                '-i','bed_env.f32','-c:a','flac','tr_tmp.flac'])
o=subprocess.run(['ffmpeg','-nostdin','-i','tr_tmp.flac','-af','ebur128=framelog=quiet',
                  '-f','null','-'],capture_output=True,text=True).stderr
I=float(re.search(r'I:\s+(-?[0-9.]+) LUFS',o[o.index('Summary'):]).group(1))
# o PICO da trilha (bloco do kabuki) tem que ficar em -30 LUFS
pico=subprocess.run(['ffmpeg','-nostdin','-ss','314','-t','16','-i','tr_tmp.flac','-af',
                     'ebur128=framelog=quiet','-f','null','-'],capture_output=True,text=True).stderr
Ip=float(re.search(r'I:\s+(-?[0-9.]+) LUFS',pico[pico.index('Summary'):]).group(1))
g=-30.0-Ip
subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i','tr_tmp.flac','-af',f'volume={g:.2f}dB',
                '-ar',str(SR),'-ac','2','-c:a','libmp3lame','-b:a','192k','vag-trilha.mp3'])
print(f'trilha: integrada {I+g:.1f} LUFS   pico do bloco kabuki {Ip+g:.1f} LUFS')
for a,b,rot in [(0,150,'abertura cinza'),(160,220,'Yoshikawa entra'),(314,330,'kabuki — pico'),
                (420,500,'Inoue / drenando'),(520,548,'fecho — o picanco')]:
    r=subprocess.run(['ffmpeg','-nostdin','-ss',str(a),'-t',str(b-a),'-i','vag-trilha.mp3','-af',
                      'ebur128=framelog=quiet','-f','null','-'],capture_output=True,text=True).stderr
    s=r[r.index('Summary'):]; v=re.search(r'I:\s+(-?[0-9.]+)',s).group(1)
    print(f'   {rot:<22} {float(v):7.1f} LUFS' + ('   (mudo)' if float(v)<-65 else ''))

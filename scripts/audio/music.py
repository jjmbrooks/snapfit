import subprocess, numpy as np, wave, os
SR=44100
T={'intro':('Skye Cuillin',68,10.0,12),'menu':('Teller of the Tales',130,15.0,24),'sesion':('Village Consort',95,30.0,18),'celebracion':('Enchanted Valley',117,25.0,12)}
X=2.0
for key,(t,bpm,s,bars) in T.items():
    L=bars*4*60/bpm
    raw=subprocess.run(['ffmpeg','-v','error','-ss',str(s),'-t',str(L+X+0.1),'-i',f'mm-{t}.mp3','-ac','1','-ar',str(SR),'-f','s16le','-'],capture_output=True).stdout
    x=np.frombuffer(raw,np.int16).astype(float)/32768
    n=int(L*SR); k=int(X*SR); x=x[:n+k]
    y=x[:n].copy()
    ramp=np.linspace(0,1,k)
    # equal-power crossfade: tail after loop end fades out over the head
    y[:k]=x[:k]*np.sin(ramp*np.pi/2)+x[n:n+k]*np.cos(ramp*np.pi/2)
    pcm=(np.clip(y,-1,1)*32767).astype(np.int16)
    with wave.open(f'out/{key}.wav','wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    out=f'out/musica-{key}.ogg'
    subprocess.run(['ffmpeg','-v','error','-y','-i',f'out/{key}.wav','-af','loudnorm=I=-20:TP=-2:LRA=11','-ar','44100','-ac','1','-c:a','libvorbis','-q:a','2',out],check=True)
    print(key,t,f'{L:.2f}s',os.path.getsize(out))

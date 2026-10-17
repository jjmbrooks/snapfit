import numpy as np, wave, subprocess, os
SR=44100; rng=np.random.default_rng(7)
def reverb(x, taps=((0.031,0.5),(0.047,0.42),(0.071,0.35),(0.113,0.28),(0.167,0.2))):
    y=np.concatenate([x,np.zeros(int(0.8*SR))])
    out=y.copy()
    for d,g in taps:
        k=int(d*SR); z=np.zeros_like(y); z[k:]=y[:-k]*g; out+=z
        z2=np.zeros_like(y); z2[2*k:]=y[:-2*k]*g*g*0.8; out+=z2
    return out
def bpnoise(n, lo, hi):
    w=rng.standard_normal(n); F=np.fft.rfft(w); f=np.fft.rfftfreq(n,1/SR)
    F[(f<lo)|(f>hi)]=0; return np.fft.irfft(F,n)/ (np.std(np.fft.irfft(F,n))+1e-9)
def bell(freq,dur,amp=1.0):
    t=np.arange(int(dur*SR))/SR; s=np.zeros_like(t)
    for ratio,a,dec in ((1,1,3.2),(2.0,0.35,5),(2.76,0.25,7),(5.4,0.12,11)):
        s+=a*np.sin(2*np.pi*freq*ratio*t)*np.exp(-dec*t)
    att=np.minimum(1,t/0.004); return amp*s*att
def save(name,x,peak=0.8):
    x=x/np.max(np.abs(x))*peak
    fade=int(0.02*SR); x[-fade:]*=np.linspace(1,0,fade)
    p=f'out/{name}.wav'
    with wave.open(p,'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x*32767).astype(np.int16).tobytes())
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-c:a','libvorbis','-q:a','3',f'out/sfx-{name}.ogg'],check=True)
    print(name, round(len(x)/SR,2), os.path.getsize(f'out/sfx-{name}.ogg'))
# listo: aliento (soplo) + arpegio de campanas en re dórico (D5 F5 A5 D6)
n=int(1.0*SR); t=np.arange(n)/SR
breath=bpnoise(n,700,3800)*np.sin(np.pi*np.clip(t/0.42,0,1))**2*0.18
notes=[(587.33,0.00),(698.46,0.07),(880.0,0.14),(1174.66,0.22)]
x=np.zeros(int(1.6*SR)); x[:n]+=breath
for f,st in notes:
    b=bell(f,1.2,0.5); i=int(st*SR); x[i:i+len(b)]+=b[:len(x)-i]
save('listo',reverb(x))
# niebla: intro de historia, soplo grave que crece y se disipa + bordón re/la
n=int(3.0*SR); t=np.arange(n)/SR
env=np.sin(np.pi*np.clip(t/3.0,0,1))**1.5
mist=bpnoise(n,180,1400)*0.22*env
drone=(np.sin(2*np.pi*146.83*t)+0.6*np.sin(2*np.pi*220*t)+0.25*np.sin(2*np.pi*293.66*t))*0.12*env
shimmer=np.zeros(n)
for f,st in ((1174.66,1.1),(1760,1.5),(1318.5,1.9)):
    b=bell(f,1.1,0.12); i=int(st*SR); shimmer[i:i+len(b)]+=b[:n-i]
save('intro',reverb(mist+drone+shimmer),0.7)

"""Aprendiz de Vitalia dibujado por código (PIL, plano, de perfil mirando a la derecha).
Se dibuja a 4x (824x1280) y se reduce a 206x320 como las demás posturas."""
import math
from PIL import Image, ImageDraw
S=4; W,H=206*S,320*S; F=1150  # piso
OUT=(58,36,18); GREEN=(46,104,60); GREEN_D=(31,74,42); GOLD=(214,170,62); SKIN=(246,212,180)
HAIR=(110,70,38); HAIR_D=(80,50,26); BOOT=(112,72,40); BOOT_D=(84,52,28); PANT=(52,52,60); PANT_D=(36,36,44)
BELT=(96,60,30); WOOD=(128,84,46); WOOD_D=(96,60,32); TOWEL=(236,226,200); TOWEL_L=(196,184,150); AIR=(120,190,170)
LW=9
def rot(v,t): x,y=v; c,s=math.cos(t),math.sin(t); return (x*c-y*s, x*s+y*c)
def add(a,b): return (a[0]+b[0],a[1]+b[1])
def poly(d,pts,fill,w=LW): d.polygon(pts,fill=fill,outline=OUT,width=w)
def cap(d,a,b,r,fill):
    """segmento con extremos redondos y contorno."""
    ang=math.atan2(b[1]-a[1],b[0]-a[0]); nx,ny=-math.sin(ang)*r,math.cos(ang)*r
    for p in (a,b): d.ellipse((p[0]-r-LW/2,p[1]-r-LW/2,p[0]+r+LW/2,p[1]+r+LW/2),fill=OUT)
    d.polygon([(a[0]+nx,a[1]+ny),(b[0]+nx,b[1]+ny),(b[0]-nx,b[1]-ny),(a[0]-nx,a[1]-ny)],fill=OUT)
    r2=r-LW/2
    nx2,ny2=-math.sin(ang)*r2,math.cos(ang)*r2
    for p in (a,b): d.ellipse((p[0]-r2,p[1]-r2,p[0]+r2,p[1]+r2),fill=fill)
    d.polygon([(a[0]+nx2,a[1]+ny2),(b[0]+nx2,b[1]+ny2),(b[0]-nx2,b[1]-ny2),(a[0]-nx2,a[1]-ny2)],fill=fill)
def ik(s,h,l1,l2,bend=1):
    dx,dy=h[0]-s[0],h[1]-s[1]; dd=min(math.hypot(dx,dy),l1+l2-1)
    a=math.atan2(dy,dx); c=(l1*l1+dd*dd-l2*l2)/(2*l1*dd); t=a-bend*math.acos(max(-1,min(1,c)))
    return (s[0]+l1*math.cos(t), s[1]+l1*math.sin(t))
def boot(d,bx,theta,col,cold):
    """bota: la base de los dedos queda fija en (bx,F) y solo rota la parte de atrás (talón sube theta);
    la caña queda vertical sobre el tobillo. Devuelve el tobillo."""
    B=(bx,F)
    ank=add(B,rot((-92,-64),theta))
    rear=[add(B,rot(p,theta)) for p in [(0,0),(0,-46),(-60,-80),(-140,-80),(-152,-40),(-146,0)]]
    poly(d,rear,col)
    shaft=[(ank[0]-50,ank[1]+14),(ank[0]+38,ank[1]+30),(ank[0]+40,ank[1]-120),(ank[0]-50,ank[1]-120)]
    poly(d,shaft,col)
    d.line([(ank[0]-56,ank[1]-112),(ank[0]+46,ank[1]-112)],fill=cold,width=16)
    poly(d,[(bx-30,F),(bx+84,F),(bx+84,F-22),(bx+54,F-54),(bx-30,F-60)],col)
    d.line([(bx-30,F-4),(bx+84,F-4)],fill=cold,width=14)
    d.line([add(B,rot((-146,-4),theta)),add(B,rot((-30,-4),theta))],fill=cold,width=14)
    return (ank[0]-4,ank[1]-100)
def head(d,neck,tilt=0,breath=False):
    cx,cy=neck[0]+8,neck[1]-150
    R=150
    # capucha detrás
    d.ellipse((cx-R-30,cy-R+5,cx+R-40,cy+R+30),fill=GREEN,outline=OUT,width=LW)
    d.arc((cx-R-14,cy-R+20,cx+R-56,cy+R+14),200,330,fill=GOLD,width=10)
    # cara
    d.ellipse((cx-R+30,cy-R+30,cx+R,cy+R-10),fill=SKIN,outline=OUT,width=LW)
    # cabello: casquete y flequillo hacia el frente
    d.chord((cx-R+20,cy-R+5,cx+R+8,cy+R-40),180,360,fill=HAIR,outline=OUT,width=LW)
    d.polygon([(cx+R+6,cy-30),(cx+R-10,cy+18),(cx+R-60,cy-24),(cx+60,cy+6),(cx+30,cy-30),(cx-20,cy+4),(cx-40,cy-34)],fill=HAIR)
    d.line([(cx-R+40,cy-34),(cx+R+4,cy-34)],fill=HAIR,width=40)
    d.polygon([(cx-40,cy-R+10),(cx+20,cy-R-30),(cx+40,cy-R+20)],fill=HAIR,outline=OUT)
    # oreja, ojo, boca
    d.ellipse((cx+82,cy+8,cx+112,cy+52),fill=(40,90,50),outline=OUT,width=5)
    d.ellipse((cx+92,cy+14,cx+102,cy+26),fill=(255,255,255))
    d.line([(cx+80,cy-2),(cx+118,cy-6)],fill=HAIR_D,width=7)
    d.line([(cx+112,cy+92),(cx+128,cy+90)],fill=OUT,width=6)
    if breath:
        for k in range(3):
            d.arc((cx+R+12+k*26,cy+60-k*6,cx+R+60+k*26,cy+108-k*6),300,60,fill=AIR,width=9)
    return (cx,cy)
def tunic(d,hip,sh,lean=0,chest=0):
    """túnica de perfil: hombro sh, cadera hip; chest = abombado del pecho (px)."""
    hx,hy=hip; sx,sy=sh
    back_sh=(sx-62,sy+10); front_sh=(sx+52,sy+18)
    chest_p=(sx+66+chest,sy+110); waist_f=(hx+60,hy-40); hem_f=(hx+92,hy+190); hem_b=(hx-96,hy+190); waist_b=(hx-62,hy-40)
    pts=[back_sh,(sx-10,sy-14),front_sh,chest_p,waist_f,hem_f,hem_b,waist_b,(sx-70-chest//3,sy+120)]
    poly(d,pts,GREEN)
    d.line([front_sh,chest_p,waist_f,hem_f],fill=GOLD,width=12)
    d.line([hem_f,hem_b],fill=GOLD,width=14)
    d.line([waist_b,(waist_f[0]+4,waist_f[1])],fill=BELT,width=30)
    d.rectangle((hx+8,hy-56,hx+40,hy-24),outline=GOLD,width=7)
    return pts
def leg(d,ankle,hip,col,w=30):
    cap(d,ankle,hip,w,col)
def arrow(d,p,up=True,col=AIR,L=110):
    x,y=p; s=-1 if up else 1
    d.line([(x,y),(x,y+s*L)],fill=col,width=12)
    d.polygon([(x-26,y+s*(L-22)),(x+26,y+s*(L-22)),(x,y+s*(L+18))],fill=col)
def chair(d,x0,top):
    # respaldo a la izquierda, asiento hacia la izquierda (silla de perfil detrás de la figura)
    poly(d,[(x0,top),(x0+34,top),(x0+34,F),(x0,F)],WOOD)
    poly(d,[(x0-230,top+250),(x0+34,top+250),(x0+34,top+290),(x0-230,top+290)],WOOD)
    poly(d,[(x0-226,top+290),(x0-196,top+290),(x0-196,F),(x0-226,F)],WOOD_D)
    poly(d,[(x0-6,top-16),(x0+40,top-16),(x0+40,top+20),(x0-6,top+20)],WOOD)
    d.line([(x0+4,top+80),(x0+30,top+80)],fill=WOOD_D,width=8)
def new():
    im=Image.new('RGB',(W,H),'white'); d=ImageDraw.Draw(im)
    d.ellipse((140,F-26,700,F+26),fill=(232,232,228))
    return im,d
def save(im,path):
    im.resize((206,320),Image.LANCZOS).save(path,'WEBP',quality=86,method=6)

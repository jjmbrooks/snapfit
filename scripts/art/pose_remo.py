import sys,math; import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from aprendiz_dibujo import *
def towel(d,h):
    x,y=h
    poly(d,[(x-14,y-30),(x+44,y-34),(x+56,y+120),(x+30,y+150),(x-6,y+128)],TOWEL)
    for k in range(3): d.line([(x-2+k*16,y-20),(x+8+k*16,y+126)],fill=TOWEL_L,width=6)
def frame(alpha,back,chest,scap,breath,path):
    im,d=new()
    bx=470
    a2=boot(d,bx-22,0,BOOT_D,OUT); hip2=(a2[0]+4,a2[1]-230); leg(d,(a2[0],a2[1]+10),hip2,PANT_D); boot(d,bx-22,0,BOOT_D,OUT)
    a1=boot(d,bx,0,BOOT,BOOT_D); hip=(a1[0]+6,a1[1]-230); leg(d,(a1[0],a1[1]+10),hip,PANT); boot(d,bx,0,BOOT,BOOT_D)
    sh=(hip[0]+6-back,hip[1]-250-chest//3)
    A=math.radians(alpha)
    def arm(dx,col,coll):
        s=(sh[0]+dx,sh[1]+44); e=(s[0]+150*math.sin(A),s[1]+150*math.cos(A)); h=(e[0]+150,e[1])
        cap(d,s,e,32,col); cap(d,e,h,28,col)
        return s,e,h
    s2,e2,h2=arm(-14,GREEN_D,OUT)
    tunic(d,hip,sh,chest=chest)
    s,e,h=arm(0,(70,140,84),OUT)
    d.line([(e[0]+40,e[1]-22),(h[0]-30,h[1]-22)],fill=GOLD,width=9)
    towel(d,(h[0]+18,h[1]))
    d.ellipse((h[0]-8,h[1]-30,h[0]+44,h[1]+26),fill=SKIN,outline=OUT,width=LW)
    # codo a 90°: pequeña escuadra
    head(d,(sh[0]+10-back//3,sh[1]-chest//4),breath=breath)
    if back and not scap:
        # hombros atrás: flecha corta hacia atrás sobre el hombro
        x,y=sh[0]-150,sh[1]+40
        d.line([(x+70,y),(x,y)],fill=AIR,width=12); d.polygon([(x-30,y),(x+8,y-24),(x+8,y+24)],fill=AIR)
    if chest:
        x,y=sh[0]+150,sh[1]+70
        d.arc((x-40,y-50,x+20,y+50),300,60,fill=AIR,width=10)
    if scap:
        # escápulas juntas: insignia pequeña junto a la espalda (dos omóplatos que se acercan)
        cx,cy=sh[0]-178,sh[1]+70; R=66
        d.ellipse((cx-R,cy-R,cx+R,cy+R),fill=(255,250,236),outline=GOLD,width=9)
        d.polygon([(cx-10,cy-34),(cx-40,cy-20),(cx-36,cy+34),(cx-10,cy+16)],fill=SKIN,outline=OUT)
        d.polygon([(cx+10,cy-34),(cx+40,cy-20),(cx+36,cy+34),(cx+10,cy+16)],fill=SKIN,outline=OUT)
        d.line([(cx,cy-44),(cx,cy+44)],fill=OUT,width=6)
        for sg in (-1,1):
            x0=cx+sg*92
            d.line([(x0,cy),(x0-sg*22,cy)],fill=GOLD,width=10)
            d.polygon([(x0-sg*40,cy),(x0-sg*20,cy-16),(x0-sg*20,cy+16)],fill=GOLD)
    if alpha<0:
        x,y=e[0]-40,e[1]
        d.line([(x+30,y+60),(x-40,y+60)],fill=AIR,width=12); d.polygon([(x-70,y+60),(x-32,y+36),(x-32,y+84)],fill=AIR)
    save(im,path)
P=sys.argv[1]
cfg=[(0,0,0,False,False),(0,18,26,False,False),(-30,18,26,True,False),(-30,18,26,True,True)]
for n,c in enumerate(cfg,1): frame(*c,f'{P}/remo-toalla-iso-l1-{n}.webp')

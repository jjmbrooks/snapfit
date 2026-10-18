import sys,math; import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from aprendiz_dibujo import *
def frame(theta,mark,path):
    im,d=new(); chair(d,150,F-560)
    bx=520
    # pierna de fondo (un poco atrás y más oscura)
    from aprendiz_dibujo import boot as _b
    import PIL
    a2=_b(d,bx-22,theta,BOOT_D,OUT)
    hip2=(a2[0]+4,a2[1]-230); leg(d,(a2[0],a2[1]+10),hip2,PANT_D); _b(d,bx-22,theta,BOOT_D,OUT)
    a1=boot(d,bx,theta,BOOT,BOOT_D)
    hip=(a1[0]+6,a1[1]-230); leg(d,(a1[0],a1[1]+10),hip,PANT); boot(d,bx,theta,BOOT,BOOT_D)
    sh=(hip[0]+6,hip[1]-250)
    # brazo de atrás (apoyado en la silla) detrás del torso
    hand=(196,F-574)
    el=ik((sh[0]-20,sh[1]+40),hand,150,150,bend=-1)
    cap(d,(sh[0]-20,sh[1]+40),el,30,GREEN_D); cap(d,el,hand,26,GREEN_D)
    d.ellipse((hand[0]-28,hand[1]-30,hand[0]+28,hand[1]+18),fill=SKIN,outline=OUT,width=LW)
    tunic(d,hip,sh)
    # brazo de adelante relajado
    e=(sh[0]+20,sh[1]+150); h=(sh[0]+50,sh[1]+275)
    cap(d,(sh[0]+4,sh[1]+40),e,32,GREEN); cap(d,e,h,28,GREEN)
    d.line([(e[0]+20,e[1]+100),(h[0]+28,h[1]-20)],fill=GOLD,width=9)
    d.ellipse((h[0]-26,h[1]-6,h[0]+26,h[1]+46),fill=SKIN,outline=OUT,width=LW)
    head(d,(sh[0]+10,sh[1]))
    heel=add((bx,F),rot((-150,0),theta))
    if theta>0:
        hb=add((bx,F),rot((-146,0),theta))
        d.line([(hb[0]-6,F-2),(bx-40,F-2)],fill=AIR,width=6)
    if mark=='up': arrow(d,(heel[0]-60,heel[1]-40),True)
    if mark=='down': arrow(d,(heel[0]-60,heel[1]-150),False)
    if mark=='top':
        # dedos en el piso: marca de apoyo
        for k in (-1,0,1): d.line([(bx+30+k*30,F+40),(bx+30+k*30,F+70)],fill=AIR,width=10)
        arrow(d,(heel[0]-60,heel[1]-40),True,L=60)
    save(im,path)
P=sys.argv[1]
for n,(t,m) in enumerate([(0,None),(18,"up"),(42,"top"),(18,"down")],1):
    frame(math.radians(t),m,f'{P}/talones-l1-{n}.webp')

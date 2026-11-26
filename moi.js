/* Forme · moi.js · Onglet Moi : apparence, Liquid Glass, emojis, silhouette, chrono, musique, appareils, mensurations, pesée */
/* =====================================================================
   Onglet « Moi » : silhouette 3D, mensurations, chrono, musique, appareils, photos
   ===================================================================== */
var MES=[],MF=[['w','Poids','kg',1],['h','Taille','cm',0],['taille','Tour de taille','cm',1],['poitrine','Poitrine','cm',1],['bras','Bras','cm',1],['cuisse','Cuisse','cm',1],['mollet','Mollet','cm',1],['hanches','Hanches','cm',1],['cou','Cou','cm',1]];
try{MES=JSON.parse(localStorage.getItem('forme_mes')||'[]')}catch(e){MES=[]}
/* ---------- Apparence : Premium, Verre léger, Sobre + couleur du fond ---------- */
var FX='premium',TINT='graphite';try{FX=localStorage.getItem('forme_fx')||'premium';TINT=localStorage.getItem('forme_tint')||'graphite'}catch(e){}
var FXS=[['liquid','Liquid Glass','Verre poli, bords lumineux, reflets qui suivent ton téléphone.'],['premium','Premium','Verre flouté, cartes qui flottent. Très beau, gourmand.'],['glass','Verre léger','Verre transparent sans flou. Joli et économe.'],['sobre','Sobre','Cartes pleines, rien ne bouge. Pour tous les téléphones.']];
var TINTS=[['graphite','Graphite','#FFFFFF','#A4A8B0'],['ocean','Océan','#3D7BFF','#5AC8FA'],['lagon','Lagon','#2EC4B6','#7FE3D8'],['amethyst','Améthyste','#8E6CFF','#D3A6FF'],['rose','Rose','#FF6B9A','#FFB3C7'],['aurore','Aurore','#8E6CFF','#2EC4B6'],['champagne','Champagne','#E2B86B','#F2D9A6']];
function applyFx(){var b=document.body;b.classList.remove('fx-glass','fx-sobre','fx-liquid');if(FX!=='premium'){b.classList.add('fx-'+FX)}
  TINTS.forEach(function(t){b.classList.remove('tint-'+t[0])});if(TINT!=='graphite'){b.classList.add('tint-'+TINT)}}
function fxHtml(){var T=TINTS.filter(function(t){return t[0]===TINT})[0]||TINTS[0];
  return '<div class="lab" style="margin:18px 4px 8px;font-size:15px;color:var(--t);font-weight:600">Apparence</div><div class="fxg" id="fxg">'+
   FXS.map(function(x){return '<button class="g fxt'+(FX===x[0]?' on':'')+'" onclick="setFx(\''+x[0]+'\')"><div class="fxp fxp-'+x[0]+'" style="--p1:'+T[2]+'66;--p2:'+T[3]+'55"><i></i><i></i></div><b>'+x[1]+'</b><small>'+x[2]+'</small></button>'}).join('')+'</div>'+
   '<div class="lab" style="margin:16px 4px 6px">Couleur du fond</div><div class="tng" id="tng">'+TINTS.map(function(t){return '<button class="tnb'+(TINT===t[0]?' on':'')+'" onclick="setTint(\''+t[0]+'\')"><i style="background:linear-gradient(135deg,'+t[2]+','+t[3]+')"></i>'+t[1]+'</button>'}).join('')+'</div>'+
   '<div class="g setrow" style="margin-top:12px"><div><b style="font-weight:600">Emojis</b><div class="note">Dans les titres et les messages. Coupe-les pour un style plus sobre.</div></div><button class="sw'+(EMO?' on':'')+'" id="emsw" onclick="setEmo(this)" aria-label="Emojis"><i></i></button></div>';}
function fxRepaint(){var g=$('#fxg');if(g){var w=document.createElement('div');w.innerHTML=fxHtml();var nf=w.children[1],nt=w.children[3],t=$('#tng');g.parentNode.replaceChild(nf,g);t.parentNode.replaceChild(nt,t);emoStrip(nf.parentNode)}}
function setFx(v){FX=v;try{localStorage.setItem('forme_fx',v)}catch(e){}applyFx();lqBuild();lqSensor();fxRepaint();calm();if(window.g3Wake){g3Wake()}if(navigator.vibrate){navigator.vibrate(8)}}
function setTint(v){TINT=v;try{localStorage.setItem('forme_tint',v)}catch(e){}applyFx();fxRepaint();calm();if(navigator.vibrate){navigator.vibrate(8)}}
applyFx();
/* ---------- Liquid Glass : reflet qui suit l'inclinaison du téléphone, carte de réfraction ---------- */
function lqMap(W,H,R,bev){
  var w=Math.max(8,Math.round(W/2)),hh=Math.max(8,Math.round(H/2)),c=document.createElement('canvas');c.width=w;c.height=hh;var x=c.getContext('2d'),im=x.createImageData(w,hh),sx=W/w,sy=H/hh;
  function sd(px,py){var qx=Math.abs(px-W/2)-(W/2-R),qy=Math.abs(py-H/2)-(H/2-R),ox=Math.max(qx,0),oy=Math.max(qy,0);return Math.hypot(ox,oy)+Math.min(Math.max(qx,qy),0)-R}
  for(var j=0;j<hh;j++){for(var i=0;i<w;i++){var px=(i+.5)*sx,py=(j+.5)*sy,d=-sd(px,py),k=(j*w+i)*4,dx=0,dy=0;
    if(d<bev){var m=Math.pow(Math.max(0,1-Math.max(0,d)/bev),2),gx=sd(px+1,py)-sd(px-1,py),gy=sd(px,py+1)-sd(px,py-1),gl=Math.hypot(gx,gy)||1;dx=-gx/gl*m;dy=-gy/gl*m}
    im.data[k]=Math.round(128+127*dx);im.data[k+1]=Math.round(128+127*dy);im.data[k+2]=128;im.data[k+3]=255}}
  x.putImageData(im,0,0);return c.toDataURL();
}
function lqFilter(id,W,H,R,bev,sc){
  var key=id+W+'x'+H;if(lqFilter[id]===key){return}lqFilter[id]=key;var defs=document.getElementById('lgdefs');if(!defs||W<4||H<4){return}
  var old=document.getElementById(id);if(old){old.remove()}var f=document.createElementNS('http://www.w3.org/2000/svg','filter');
  f.setAttribute('id',id);f.setAttribute('x','0');f.setAttribute('y','0');f.setAttribute('width',W);f.setAttribute('height',H);f.setAttribute('filterUnits','userSpaceOnUse');f.setAttribute('primitiveUnits','userSpaceOnUse');f.setAttribute('color-interpolation-filters','sRGB');
  f.innerHTML='<feImage href="'+lqMap(W,H,R,bev)+'" x="0" y="0" width="'+W+'" height="'+H+'" preserveAspectRatio="none" result="m"/><feDisplacementMap in="SourceGraphic" in2="m" scale="'+sc+'" xChannelSelector="R" yChannelSelector="G"/>';
  defs.appendChild(f);
}
function lqBuild(){if(FX!=='liquid'){return}try{var n=document.querySelector('nav div');if(n){var r=n.getBoundingClientRect(),R=Math.min(r.width,r.height)/2;lqFilter('lgf-nav',Math.round(r.width),Math.round(r.height),Math.min(R,30),Math.min(16,R),26)}
  lqFilter('lgf-btn',44,44,22,13,18)}catch(e){}}
window.addEventListener('resize',function(){clearTimeout(lqBuild.t);lqBuild.t=setTimeout(lqBuild,250)});
var LQ={g:0,b:45,px:.5,py:.3,raf:0};
function lqApply(){LQ.raf=0;if(FX!=='liquid'){return}var r=document.documentElement.style,b=document.body.style,
  gx=Math.max(-1,Math.min(1,LQ.g/35)),gy=Math.max(-1,Math.min(1,(LQ.b-45)/35));
  b.setProperty('--la',(150+gx*55).toFixed(1)+'deg');b.setProperty('--lx',(50+gx*40).toFixed(1)+'%');b.setProperty('--ly',(10+gy*35).toFixed(1)+'%');
  b.setProperty('--tx',(-gx*14).toFixed(1)+'px');b.setProperty('--ty',(-gy*14).toFixed(1)+'px')}
function lqQueue(){if(FX!=='liquid'||document.body.classList.contains('calm')||LQ.raf){return}var t=performance.now();if(LQ.lt&&t-LQ.lt<33){return}LQ.lt=t;LQ.raf=requestAnimationFrame(lqApply)}
function lqOri(e){if(e.gamma==null){return}LQ.g=e.gamma;LQ.b=e.beta==null?45:e.beta;lqQueue()}
function lqSensor(){window.removeEventListener('deviceorientation',lqOri);if(FX==='liquid'){window.addEventListener('deviceorientation',lqOri,{passive:true})}}
window.addEventListener('pointermove',function(e){if(e.pointerType!=='mouse'){return}LQ.g=(e.clientX/innerWidth-.5)*60;LQ.b=45+(e.clientY/innerHeight-.5)*60;lqQueue()},{passive:true});
document.addEventListener('pointerdown',function(){if(FX==='liquid'&&document.body.classList.contains('calm')){calm()}},{passive:true});

/* ---------- Emojis : option pour une interface plus sobre ---------- */
var EMO=true;try{EMO=localStorage.getItem('forme_emo')!=='0'}catch(e){}
var EMT=/(?:\p{Extended_Pictographic}|\p{Regional_Indicator})/u,EMR=/[ \u00A0]?(?:\p{Extended_Pictographic}|\p{Regional_Indicator})(?:\uFE0F|\uFE0E|\u20E3|\p{Emoji_Modifier}|\u200D(?:\p{Extended_Pictographic}|\p{Regional_Indicator}))*/gu;
var EMKEEP='.avl em,.prbtns span,.prmini,.sefat span,.prtr,.dwz,.hb,.keepemo,script,style';
function emoStrip(root){
  if(EMO||!root){return}if(root.nodeType===3){root=root.parentNode}if(!root||!root.ownerDocument){return}
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),n,L=[];while((n=w.nextNode())){L.push(n)}
  L.forEach(function(t){var v=t.nodeValue;if(!EMT.test(v)){return}var p=t.parentElement;if(p&&p.closest(EMKEEP)){return}
    var nv=v.replace(EMR,'');if(EMT.test(v.charAt(0)+v.charAt(1))){nv=nv.replace(/^\s+/,'')}if(nv!==v){t.nodeValue=nv}});
}
var EMOB=new MutationObserver(function(ms){if(EMO){return}ms.forEach(function(m){if(m.type==='characterData'){emoStrip(m.target)}else{m.addedNodes.forEach(function(x){if(x.nodeType===1||x.nodeType===3){emoStrip(x)}})}})});function emoWatch(){EMOB.disconnect();if(!EMO){EMOB.observe(document.body,{childList:true,subtree:true,characterData:true})}}emoWatch();
function setEmo(btn){EMO=!EMO;try{localStorage.setItem('forme_emo',EMO?'1':'0')}catch(e){}emoWatch();if(btn){btn.classList.toggle('on',EMO)}document.body.classList.toggle('noemo',!EMO);
  if(EMO){setHead.l='';if(D){renderWeek();renderForce();renderBilan()}if(TAB==='moi'){renderMoi()}setHead();openSet();var r=$('#emsw');if(r){r.scrollIntoView({block:'center'})}}else{emoStrip(document.body)}}
document.body.classList.toggle('noemo',!EMO);
/* petites vibrations, comme un vrai bouton */
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('.sw,.seg button,nav button,.pill,.obc,.fxt,.tnb');if(t&&navigator.vibrate){navigator.vibrate(6)}},{passive:true});
/* économie : les cartes flottent à l'arrivée, puis se posent (moins de calcul, moins de chauffe) */
function calm(){document.body.classList.remove('calm');clearTimeout(calm.t);calm.t=setTimeout(function(){document.body.classList.add('calm')},10000)}
document.addEventListener('visibilitychange',function(){if(!document.hidden){calm()}});
function goTab(t){var b=document.querySelector('nav button[data-t='+t+']');if(b){b.click()}}
function mesLatest(){var o={};MES.slice().sort(function(a,b){return a.date<b.date?-1:1}).forEach(function(m){MF.forEach(function(f){if(m[f[0]]!=null&&m[f[0]]!==''){o[f[0]]=+m[f[0]];o[f[0]+'_d']=m.date}})});return o}
function mesPrev(k){var a=MES.filter(function(m){return m[k]!=null&&m[k]!==''}).sort(function(a,b){return a.date<b.date?-1:1});return a.length>1?+a[a.length-2][k]:null}
function saveMesLocal(){try{localStorage.setItem('forme_mes',JSON.stringify(MES))}catch(e){}}
function loadMesSheet(){
  if(!live()||gs()){return Promise.resolve()}
  return call('sheet','Saisies').then(function(d){
    var v=d.values||[];if(v.length<2){return}var h=v[0].map(function(x){return String(x).toLowerCase()});
    var map={w:/poids/,h:/^taille \(/,taille:/tour de taille/,poitrine:/poitrine/,bras:/bras/,cuisse:/cuisse/,mollet:/mollet/,hanches:/hanches/,cou:/cou/};
    v.slice(1).forEach(function(r){var k=toKey(r[0]);if(!k){return}var o={date:k};
      Object.keys(map).forEach(function(f){var i=-1;h.forEach(function(x,j){if(i<0&&map[f].test(x)){i=j}});if(i>=0){var n=pn(r[i]);if(n!=null&&n>0){o[f]=n}}});
      var ex=MES.filter(function(m){return m.date===k})[0];if(ex){Object.assign(ex,o)}else{MES.push(o)}});
    saveMesLocal();
  }).catch(function(){});
}
function mergeWeights(){
  if(!D){return}var seen={};D.weights.forEach(function(x){seen[x.d]=1});
  MES.forEach(function(m){if(m.w&&!seen[m.date]){D.weights.push({d:m.date,v:+m.w});seen[m.date]=1}});
  D.weights.sort(function(a,b){return a.d<b.d?1:-1});
}

/* ---------- Silhouette 3D (sans bibliothèque) ---------- */
var B3={ang:.5,vel:0,drag:false,raf:0,goal:0,goalT:0,mesh:null,key:''};
function defaultsMes(){
  var L=mesLatest(),w=L.w||(D&&D.weights.length?D.weights[0].v:75),h=L.h||(PROF&&pn(PROF.taille))||175,k=w/75;
  return{w:w,h:h,cou:L.cou||38*Math.pow(k,.35),poitrine:L.poitrine||100*Math.pow(k,.5),taille:L.taille||84*Math.pow(k,.9),hanches:L.hanches||97*Math.pow(k,.6),bras:L.bras||33*Math.pow(k,.5),cuisse:L.cuisse||56*Math.pow(k,.55),mollet:L.mollet||37*Math.pow(k,.3)};
}
function goalMes(M){
  var g=D?D.targets.weight:74,d=M.w-g,o=Object.assign({},M);
  o.taille-=d*1.0;o.hanches-=d*.7;o.poitrine-=d*.5;o.bras-=d*.22;o.cuisse-=d*.35;o.cou-=d*.15;o.mollet-=d*.1;o.w=g;return o;
}
function lerpMes(a,b,t){var o={};for(var k in a){o[k]=a[k]+(b[k]-a[k])*t}return o}
function buildBody(M){
  var H=M.h,PI2=Math.PI*2,R=function(c){return c/PI2},parts=[];
  function v3(x,y,z){return[x,y,z]}
  function tube(pts,n){ // pts: [[x,y,z,r],...]
    var rings=[],step=H*.014;
    for(var i=0;i<pts.length-1;i++){var a=pts[i],b=pts[i+1],dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],L=Math.hypot(dx,dy,dz),cnt=Math.max(1,Math.round(L/step));
      var d=[dx/L,dy/L,dz/L],ax=Math.abs(d[2])<.9?[0,0,1]:[1,0,0];
      var u=[d[1]*ax[2]-d[2]*ax[1],d[2]*ax[0]-d[0]*ax[2],d[0]*ax[1]-d[1]*ax[0]],ul=Math.hypot(u[0],u[1],u[2]);u=[u[0]/ul,u[1]/ul,u[2]/ul];
      var w=[d[1]*u[2]-d[2]*u[1],d[2]*u[0]-d[0]*u[2],d[0]*u[1]-d[1]*u[0]];
      for(var s=(i?1:0);s<=cnt;s++){var t=s/cnt,c=[a[0]+dx*t,a[1]+dy*t,a[2]+dz*t],r=a[3]+(b[3]-a[3])*t,ring=[];
        for(var q=0;q<n;q++){var th=q/n*PI2,co=Math.cos(th)*r,si=Math.sin(th)*r;ring.push([c[0]+co*u[0]+si*w[0],c[1]+co*u[1]+si*w[1],c[2]+co*u[2]+si*w[2]])}
        rings.push(ring)}}
    parts.push(rings);
  }
  // tronc : ellipses horizontales
  var prof=[[.465,M.hanches*.9],[.5,M.hanches],[.56,(M.hanches+M.taille)/2],[.615,M.taille],[.67,(M.taille+M.poitrine)/2],[.72,M.poitrine],[.78,M.poitrine*.96],[.815,-1],[.838,M.cou*1.25],[.852,M.cou],[.878,M.cou*.97]];
  var tr=[],n=30;
  for(var y=.465;y<=.878+1e-6;y+=.012){
    var j=0;while(j<prof.length-2&&prof[j+1][0]<y){j++}var p0=prof[j],p1=prof[j+1],t=(y-p0[0])/(p1[0]-p0[0]);
    function rr(p){return p[1]<0?[H*.118,R(M.poitrine)*.58]:[R(p[1])*1.16,R(p[1])*.83]}
    var r0=rr(p0),r1=rr(p1),rx=r0[0]+(r1[0]-r0[0])*t,rz=r0[1]+(r1[1]-r0[1])*t,ring=[];
    for(var q=0;q<n;q++){var th=q/n*Math.PI*2;ring.push([Math.cos(th)*rx,y*H,Math.sin(th)*rz])}tr.push(ring)}
  parts.push(tr);
  // tête
  var hd=[],cy=.932*H,ry=.066*H,rx=.054*H,rz=.062*H;
  for(var k=-ry;k<=ry+1e-6;k+=ry/7){var f=Math.sqrt(Math.max(0,1-(k/ry)*(k/ry))),ring=[];for(var q=0;q<20;q++){var th=q/20*Math.PI*2;ring.push([Math.cos(th)*rx*f,cy+k,Math.sin(th)*rz*f])}hd.push(ring)}
  parts.push(hd);
  [-1,1].forEach(function(s){
    tube([[s*.058*H,.49*H,0,R(M.cuisse)],[s*.06*H,.40*H,0,R(M.cuisse)*.84],[s*.062*H,.285*H,0,R(M.mollet)*.76],[s*.062*H,.2*H,-.004*H,R(M.mollet)],[s*.06*H,.055*H,0,.021*H]],16);
    tube([[s*.06*H,.035*H,-.012*H,.026*H],[s*.064*H,.02*H,.1*H,.018*H]],12);
    tube([[s*.142*H,.808*H,0,R(M.bras)*.9],[s*.155*H,.72*H,0,R(M.bras)],[s*.167*H,.635*H,0,R(M.bras)*.7],[s*.175*H,.575*H,.004*H,R(M.bras)*.8],[s*.184*H,.485*H,.006*H,.02*H],[s*.189*H,.415*H,.01*H,.016*H]],14);
  });
  return parts;
}
function draw3d(){
  var cv=$('#b3c');if(!cv){B3.raf=0;return}
  var dpr=Math.min(2,window.devicePixelRatio||1),W=cv.clientWidth,Hc=cv.clientHeight;
  if(cv.width!==Math.round(W*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(Hc*dpr)}
  var ctx=cv.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,Hc);
  if(!B3.drag){B3.ang+=B3.vel;B3.vel*=.94;if(Math.abs(B3.vel)<.004){B3.ang+=.004}}
  if(Math.abs(B3.goal-B3.goalT)>.001){B3.goal+=(B3.goalT-B3.goal)*.08;B3.key=''}
  var M0=defaultsMes(),M=lerpMes(M0,goalMes(M0),B3.goal),key=JSON.stringify(M).slice(0,200);
  if(B3.key!==key){B3.mesh=buildBody(M);B3.key=key}
  var H=M.h,ca=Math.cos(B3.ang),sa=Math.sin(B3.ang),tl=-.1,ct=Math.cos(tl),st=Math.sin(tl),sc=Hc*.86/H,Dz=H*3.2,cx=W/2,cyy=Hc/2;
  var fg=getComputedStyle(document.body).getPropertyValue('--fgr').trim()||'255,255,255',col=B3.goal>.5?'127,207,163':fg;
  var NB=5,paths=[];for(var i=0;i<NB;i++){paths.push(new Path2D())}
  function P(p){var x=p[0]*ca+p[2]*sa,z=-p[0]*sa+p[2]*ca,y=p[1]-H/2,y2=y*ct-z*st,z2=y*st+z*ct,f=Dz/(Dz-z2);return[cx+x*sc*f,cyy-y2*sc*f,z2]}
  function bk(z){return Math.max(0,Math.min(NB-1,Math.floor((z/(H*.14)+1)/2*NB)))}
  B3.mesh.forEach(function(rings){
    var pr=rings.map(function(r){return r.map(P)});
    pr.forEach(function(r,ri){for(var q=0;q<r.length;q++){var a=r[q],b=r[(q+1)%r.length];var pa=paths[bk((a[2]+b[2])/2)];pa.moveTo(a[0],a[1]);pa.lineTo(b[0],b[1]);
      if(ri<pr.length-1&&q%3===0){var c=pr[ri+1][q];var pb=paths[bk((a[2]+c[2])/2)];pb.moveTo(a[0],a[1]);pb.lineTo(c[0],c[1])}}});
  });
  ctx.lineWidth=1;for(var i=0;i<NB;i++){ctx.strokeStyle='rgba('+col+','+(.08+.62*Math.pow(i/(NB-1),1.6))+')';ctx.stroke(paths[i])}
  // sol
  var g=ctx.createRadialGradient(cx,cyy+H*.5*sc,4,cx,cyy+H*.5*sc,W*.32);g.addColorStop(0,'rgba('+col+',.22)');g.addColorStop(1,'rgba('+col+',0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(cx,cyy+H*.5*sc,W*.32,14,0,0,Math.PI*2);ctx.fill();
  B3.raf=(TAB==='moi'&&!document.hidden&&!document.body.classList.contains('open'))?requestAnimationFrame(draw3d):0;
}
function start3d(){if(!B3.raf){B3.raf=requestAnimationFrame(draw3d)}
  var cv=$('#b3c');if(!cv||cv.dataset.b){return}cv.dataset.b=1;var x0=0,last=0;
  cv.addEventListener('pointerdown',function(e){B3.drag=true;x0=e.clientX;last=e.clientX;cv.setPointerCapture(e.pointerId)});
  cv.addEventListener('pointermove',function(e){if(!B3.drag){return}var dx=e.clientX-last;last=e.clientX;B3.ang+=dx*.012;B3.vel=dx*.012});
  cv.addEventListener('pointerup',function(){B3.drag=false});cv.addEventListener('pointercancel',function(){B3.drag=false});
}
/* carrousel de l'onglet Moi : silhouette, mensurations, chrono, musique */
var MOIS=0;
function moiCar(){var el=$('#mcar');if(!el){return}car(el);
  var mr=0;el.addEventListener('scroll',function(){if(mr){return}mr=requestAnimationFrame(function(){mr=0;var w=el.clientWidth,c=el.scrollLeft+w/2,idx=0,best=1e9;[].forEach.call(el.children,function(x,i){var d=Math.abs(x.offsetLeft+x.offsetWidth/2-c);if(d<best){best=d;idx=i}});
    if(idx!==MOIS){MOIS=idx;[].forEach.call($('#mtabs').children,function(b,i){b.classList.toggle('on',i===idx)});var t=$('#mtabs').children[idx];if(t&&t.scrollIntoView){$('#mtabs').scrollTo({left:t.offsetLeft-16,behavior:'smooth'})}}})},{passive:true});
  if(MOIS){var s=el.children[MOIS];el.scrollLeft=s.offsetLeft-(el.clientWidth-s.offsetWidth)/2;[].forEach.call($('#mtabs').children,function(b,i){b.classList.toggle('on',i===MOIS)})}}
function moiGo(i){var el=$('#mcar');if(!el){return}var s=el.children[i];el.scrollTo({left:s.offsetLeft-(el.clientWidth-s.offsetWidth)/2,behavior:'smooth'})}
function setGoalView(v){B3.goalT=v;G3.gT=v;setTimeout(function(){if(window.g3Wake){g3Wake()}},0);if(v&&G3.gl){g3Ensure('goal')}$('#b3s').className='g seg'+(v?' y':'');[].forEach.call($('#b3s').querySelectorAll('button'),function(b,i){b.classList.toggle('on',i===v)});
  $('#b3n').innerHTML=v?'Estimation à <b>'+f(D?D.targets.weight:74,1)+' kg</b>, ton objectif : surtout la taille et les hanches qui s’affinent.':'Générée d’après tes mensurations. Glisse pour la faire tourner.'}

/* ---------- Chrono et minuteur de repos ---------- */
var TM={mode:'chrono',run:false,t0:0,acc:0,laps:[],rest:90,end:0,raf:0,to:0,wl:null};
try{Object.assign(TM,JSON.parse(localStorage.getItem('forme_tm')||'{}'),{raf:0,to:0,wl:null})}catch(e){}
function tmSave(){try{localStorage.setItem('forme_tm',JSON.stringify({mode:TM.mode,run:TM.run,t0:TM.t0,acc:TM.acc,laps:TM.laps,rest:TM.rest,end:TM.end}))}catch(e){}}
function fmtT(ms,cs){ms=Math.max(0,ms);var s=Math.floor(ms/1000),m=Math.floor(s/60);return('0'+m).slice(-2)+':'+('0'+s%60).slice(-2)+(cs?'<small>,'+('0'+Math.floor(ms%1000/10)).slice(-2)+'</small>':'')}
function tmElapsed(){return TM.acc+(TM.run&&TM.mode==='chrono'?Date.now()-TM.t0:0)}
function beep(){try{var a=new(window.AudioContext||window.webkitAudioContext)();[0,.28,.56].forEach(function(t){var o=a.createOscillator(),g=a.createGain();o.frequency.value=880;o.connect(g);g.connect(a.destination);g.gain.setValueAtTime(.0001,a.currentTime+t);g.gain.exponentialRampToValueAtTime(.4,a.currentTime+t+.02);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+t+.22);o.start(a.currentTime+t);o.stop(a.currentTime+t+.25)})}catch(e){}if(navigator.vibrate){navigator.vibrate([200,100,200,100,300])}}
function wake(on){try{if(on&&navigator.wakeLock&&!TM.wl){navigator.wakeLock.request('screen').then(function(w){TM.wl=w}).catch(function(){})}if(!on&&TM.wl){TM.wl.release();TM.wl=null}}catch(e){}}
function tmMode(m){TM.mode=m;tmSave();renderTimer()}
function tmToggle(){
  if(TM.mode==='chrono'){if(TM.run){TM.acc+=Date.now()-TM.t0;TM.run=false}else{TM.t0=Date.now();TM.run=true}}
  else{if(TM.run){TM.acc=Math.max(0,TM.end-Date.now());TM.run=false}else{TM.end=Date.now()+(TM.acc>0?TM.acc:TM.rest*1000);TM.acc=0;TM.run=true}}
  tmSave();wake(TM.run);tmSched();renderTimer();
}
function tmReset(){TM.run=false;TM.acc=0;TM.laps=[];TM.end=0;tmSave();wake(false);clearTimeout(TM.to);renderTimer()}
function tmLap(){if(TM.mode==='chrono'&&TM.run){TM.laps.unshift(tmElapsed());TM.laps=TM.laps.slice(0,8);tmSave();renderTimer()}}
function tmRest(s){TM.rest=Math.max(15,Math.min(600,s));if(!TM.run){TM.acc=0}tmSave();renderTimer()}
function tmSched(){clearTimeout(TM.to);if(TM.mode==='rest'&&TM.run){TM.to=setTimeout(function(){if(TM.run&&TM.mode==='rest'&&Date.now()>=TM.end-50){TM.run=false;TM.acc=0;tmSave();wake(false);beep();toast('⏱️ Repos terminé, c’est reparti !');renderTimer()}},Math.max(0,TM.end-Date.now()))}}
function renderTimer(){
  var el=$('#tmc');if(!el){return}var rest=TM.mode==='rest';
  var h='<div class="g seg'+(rest?' y':'')+'" style="padding:3px;margin:10px 0 6px"><u></u><button class="'+(rest?'':'on')+'" onclick="tmMode(\'chrono\')">Chrono</button><button class="'+(rest?'on':'')+'" onclick="tmMode(\'rest\')">Repos</button></div>';
  if(!rest){
    h+='<div class="tmb" id="tmv">'+fmtT(tmElapsed(),1)+'</div><div class="tmr"><button class="g pill" onclick="'+(TM.run?'tmLap()':'tmReset()')+'">'+(TM.run?'Tour':'Remettre à zéro')+'</button><button class="g pill on tmgo'+(TM.run?' ko':'')+'" onclick="tmToggle()">'+(TM.run?'Pause':'Démarrer')+'</button></div>'+
      (TM.laps.length?'<div style="margin-top:8px">'+TM.laps.map(function(l,i){return '<div class="row"><span>Tour '+(TM.laps.length-i)+'</span><span>'+fmtT(l,1)+'</span></div>'}).join('')+'</div>':'');
  }else{
    var left=TM.run?TM.end-Date.now():(TM.acc>0?TM.acc:TM.rest*1000),tot=TM.rest*1000,R=58,C=2*Math.PI*R,p=Math.max(0,Math.min(1,left/tot));
    h+='<div class="tmring"><svg viewBox="0 0 140 140"><circle cx="70" cy="70" r="58" fill="none" class="rt" stroke-width="7"/><circle id="tmrg" cx="70" cy="70" r="58" fill="none" stroke="'+(left<10000&&TM.run?KO:OK)+'" stroke-width="7" stroke-linecap="round" stroke-dasharray="'+C+'" stroke-dashoffset="'+C*(1-p)+'" transform="rotate(-90 70 70)"/></svg><b id="tmv">'+fmtT(left)+'</b></div>'+
      '<div class="pills" style="justify-content:center;margin:4px 0 10px">'+[60,90,120,180].map(function(s){return '<button class="pill'+(TM.rest===s?' on':'')+'" onclick="tmRest('+s+')">'+(s<120?s+' s':s/60+' min')+'</button>'}).join('')+'</div>'+
      '<div class="tmr"><button class="g pill" onclick="tmRest(TM.rest-15)">− 15 s</button><button class="g pill on tmgo'+(TM.run?' ko':'')+'" onclick="tmToggle()">'+(TM.run?'Pause':'Lancer')+'</button><button class="g pill" onclick="tmRest(TM.rest+15)">+ 15 s</button></div>'+
      (TM.run||TM.acc?'<button class="note" style="display:block;margin:10px auto 0" onclick="tmReset()">Annuler</button>':'');
  }
  el.innerHTML=h;tmTick();
}
function tmTick(){
  cancelAnimationFrame(TM.raf);var v=$('#tmv');if(!v||!TM.run||TAB!=='moi'){return}
  if(TM.mode==='chrono'){v.innerHTML=fmtT(tmElapsed(),1)}
  else{var left=TM.end-Date.now();v.innerHTML=fmtT(left+999);var rg=$('#tmrg');if(rg){var C=2*Math.PI*58;rg.setAttribute('stroke-dashoffset',C*(1-Math.max(0,left/(TM.rest*1000))));rg.setAttribute('stroke',left<10000?KO:OK)}if(left<=0){tmSched();return}}
  TM.raf=requestAnimationFrame(tmTick);
}

/* ---------- Musique (Spotify) : grande pochette, plusieurs playlists, lecture dans l'appli Spotify ---------- */
var SPS=[],SPA=0,SPV=false;
try{SPS=JSON.parse(localStorage.getItem('forme_sps')||'[]');SPA=+localStorage.getItem('forme_spa')||0;var _o=localStorage.getItem('forme_sp');if(_o&&!SPS.length){SPS=[{u:_o}]}}catch(e){SPS=[]}
function spSaveAll(){try{localStorage.setItem('forme_sps',JSON.stringify(SPS));localStorage.setItem('forme_spa',String(SPA));localStorage.removeItem('forme_sp')}catch(e){}}
function spLink(){var p=SPS[SPA]||SPS[0];return p?p.u:''}
function spKey(u){var m=String(u).match(/(playlist|album|track|artist|show|episode)[\/:]([A-Za-z0-9]{10,})/);return m?m[1]+'/'+m[2]:''}
function spEmbed(u){var k=spKey(u);return k?'https://open.spotify.com/embed/'+k+'?utm_source=generator&theme=0':''}
function spOpen(u){var k=spKey(u);return k?'https://open.spotify.com/'+k:u}
var SPKIND={playlist:'Playlist',album:'Album',track:'Titre',artist:'Artiste',show:'Podcast',episode:'Épisode'};
function spInfo(p){
  if(p.t&&p.img||p.tried){return}p.tried=1;
  fetch('https://open.spotify.com/oembed?url='+encodeURIComponent(spOpen(p.u))).then(function(r){if(!r.ok){throw 0}return r.json()})
   .then(function(j){p.t=j.title||p.t;p.img=j.thumbnail_url||p.img;delete p.tried;spSaveAll();renderMusic()}).catch(function(){});
}
function spSave(){
  var v=$('#spi').value.trim();if(!spKey(v)){toast('Colle un lien Spotify (playlist, album…)');return}
  if(SPS.some(function(p){return spKey(p.u)===spKey(v)})){toast('Déjà dans ta liste');return}
  SPS.push({u:spOpen(v)});SPA=SPS.length-1;SPV=false;spSaveAll();renderMusic();
}
function spPick(i){SPA=i;SPV=false;spSaveAll();renderMusic()}
function spDel(i){SPS.splice(i,1);SPA=0;spSaveAll();renderMusic()}
function spAdd(){var a=$('#spadd');if(a){a.style.display='block';$('#spi').focus()}}
function spName(p,i){return p.t||(SPKIND[spKey(p.u).split('/')[0]]||'Playlist')+' '+(i+1)}
function spCover(p,cls){return p.img?'<img class="'+cls+'" src="'+esc(p.img)+'" alt="" loading="lazy">':'<div class="'+cls+' spph"><svg viewBox="0 0 24 24"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg></div>'}
function renderMusic(){
  var el=$('#muc');if(!el){return}
  var form='<div id="spadd" style="display:'+(SPS.length?'none':'block')+'"><div class="note" style="margin:8px 0 10px;line-height:1.5">Colle le lien d’une playlist : dans Spotify, bouton Partager, puis Copier le lien.</div><input id="spi" class="g srch" inputmode="url" placeholder="https://open.spotify.com/playlist/…"><div class="tmr" style="margin-top:10px"><button class="g pill on" onclick="spSave()">Ajouter</button>'+(SPS.length?'<button class="g pill" onclick="$(\'#spadd\').style.display=\'none\'">Annuler</button>':'<a class="g pill" href="https://open.spotify.com" target="_blank" rel="noopener">Ouvrir Spotify</a>')+'</div></div>';
  if(!SPS.length){el.innerHTML=form;return}
  if(SPA>=SPS.length){SPA=0}var p=SPS[SPA],k=spKey(p.u);SPS.forEach(spInfo);
  el.innerHTML='<div class="spc">'+(p.img?'<div class="spbg" style="background-image:url(\''+esc(p.img)+'\')"></div>':'')+
     '<a class="spart" href="'+esc(spOpen(p.u))+'" target="_blank" rel="noopener">'+spCover(p,'spimg')+'</a>'+
     '<div class="spt"><b>'+esc(spName(p,SPA))+'</b><span>'+(SPKIND[k.split('/')[0]]||'Playlist')+' · Spotify</span></div>'+
     '<a class="sppl" href="'+esc(spOpen(p.u))+'" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg>Écouter dans Spotify</a></div>'+
   (SPV?'<iframe class="spf" src="'+spEmbed(p.u)+'" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>':'')+
   '<div class="spl">'+SPS.map(function(q,i){return '<div class="spr'+(i===SPA?' on':'')+'" onclick="spPick('+i+')">'+spCover(q,'spth')+'<b>'+esc(spName(q,i))+'</b>'+(i===SPA?'<span class="spon"><i></i><i></i><i></i></span>':'')+'<button aria-label="Retirer" onclick="event.stopPropagation();spDel('+i+')">✕</button></div>'}).join('')+
   '<div class="spr spnew" onclick="spAdd()"><div class="spth spph">＋</div><b>Ajouter une playlist</b></div></div>'+form+
   '<button class="spprev" onclick="SPV=!SPV;renderMusic()">'+(SPV?'Masquer l’aperçu':'Aperçu ici (extraits de 30 s)')+'</button>';
}

/* ---------- Appareils ---------- */
var HR={dev:null,bpm:null};
function connectHR(){
  if(!navigator.bluetooth){toast('Bluetooth indisponible : ouvre l’appli depuis Chrome');return}
  navigator.bluetooth.requestDevice({filters:[{services:['heart_rate']}]}).then(function(dev){HR.dev=dev;dev.addEventListener('gattserverdisconnected',function(){HR.dev=null;HR.bpm=null;renderDevices()});return dev.gatt.connect()})
  .then(function(s){return s.getPrimaryService('heart_rate')}).then(function(s){return s.getCharacteristic('heart_rate_measurement')})
  .then(function(c){c.addEventListener('characteristicvaluechanged',function(e){var v=e.target.value,fl=v.getUint8(0);HR.bpm=fl&1?v.getUint16(1,true):v.getUint8(1);var b=$('#hrv');if(b){b.textContent=HR.bpm}});return c.startNotifications()})
  .then(function(){toast('❤️ Fréquence cardiaque connectée');renderDevices()})
  .catch(function(e){if(e&&e.name!=='NotFoundError'){toast('Connexion impossible : active la diffusion de la FC sur la montre')}});
}
function disconnectHR(){try{HR.dev.gatt.disconnect()}catch(e){}HR.dev=null;HR.bpm=null;renderDevices()}
function lastDataDay(){if(!D){return null}var w=D.week,k=null;w.keys.forEach(function(d,i){if(w.sleep[i]!=null||w.rhr[i]!=null){k=d}});return k||(D.weights.length?D.weights[0].d:null)}
function renderDevices(){
  var el=$('#dvc');if(!el){return}var ld=lastDataDay(),src=renderDevices.src||{};
  function dv(ic,name,st,cls,extra){return '<div class="dv"><div class="ic dvi">'+ic+'</div><div style="flex:1;min-width:0"><b>'+name+'</b><div class="note"><span class="bd '+cls+'" style="padding:2px 8px;margin-right:6px"><i></i>'+st+'</span></div>'+(extra||'')+'</div></div>'}
  var watch='<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="4"/><path d="M9 6V3h6v3M9 18v3h6v-3"/></svg>',band='<svg viewBox="0 0 24 24"><rect x="8" y="3" width="8" height="18" rx="4"/><path d="M12 9v3"/></svg>',heart='<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg>';
  var h=dv(watch,'Montre Honor',live()?'Synchronisée':'Démo',live()?'ok':'nt','<div class="note" style="margin-top:4px">Via Honor Santé, Health Connect et ta feuille'+(ld?' · dernières données le '+dl(ld):'')+'</div>')+
    dv(band,'Google Fitbit Air',src.fitbit?'Appli Fitbit détectée':'En attente','nt','<div class="note" style="margin-top:4px">'+(src.fitbit?'Des données Fitbit arrivent déjà dans ta feuille. Le bracelet passera par le même chemin.':'Ses données apparaîtront ici dès qu’elles arriveront dans ta feuille.')+'</div>')+
    '<div class="dv"><div class="ic dvi" style="color:'+KO+'">'+heart+'</div><div style="flex:1;min-width:0"><b>FC en direct</b>'+(HR.dev?'<div class="hrl"><span class="hb">♥</span><b id="hrv">'+(HR.bpm||'…')+'</b><small>bpm · '+esc(HR.dev.name||'montre')+'</small></div><button class="note" onclick="disconnectHR()">Déconnecter</button>':
      '<div class="note" style="margin-top:4px;line-height:1.45">Active « Diffuser la fréquence cardiaque » sur ta montre, puis :</div><button class="g pill" style="margin-top:8px;padding:9px 14px" onclick="connectHR()">Connecter en Bluetooth</button>')+'</div></div>';
  el.innerHTML=h;
}
function scanSources(){
  if(!live()){return}var n=sheetName(/activ/i,'Activity');
  getRaw(n,function(v){if(!v){return}var s=JSON.stringify(v.slice(1,200)).toLowerCase();renderDevices.src={fitbit:/fitbit/.test(s),honor:/hihonor|honor/.test(s)};renderDevices()});
}

/* =====================================================================
   Appareils connectés : batterie en cercle (téléphone en direct, Bluetooth
   standard en direct, sinon estimation depuis la dernière recharge)
   ===================================================================== */
var DVT={
 phone:{n:'Téléphone',days:1.5,ic:'<rect x="7" y="2.5" width="10" height="19" rx="2.6"/><path d="M10.5 18.5h3"/>'},
 watch:{n:'Montre',days:10,ic:'<rect x="6" y="6" width="12" height="12" rx="4"/><path d="M9 6V3h6v3M9 18v3h6v-3M12 10v2.5l1.6 1"/>'},
 band:{n:'Bracelet',days:7,ic:'<rect x="8.5" y="2.5" width="7" height="19" rx="3.5"/><path d="M12 9.5v3"/>'},
 buds:{n:'Écouteurs',days:4,ic:'<rect x="3.5" y="8" width="17" height="11" rx="5.5"/><path d="M3.8 12.2h16.4M11 15.6h2"/>'},
 head:{n:'Casque',days:4,ic:'<path d="M4.5 15v-3a7.5 7.5 0 0 1 15 0v3"/><rect x="3" y="13.5" width="4.5" height="7" rx="1.8"/><rect x="16.5" y="13.5" width="4.5" height="7" rx="1.8"/>'},
 scale:{n:'Balance',days:180,ic:'<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><path d="M8.8 9.5a3.4 3.4 0 0 1 6.4 0M12 9.6l1.2-1.6"/>'},
 hr:{n:'Ceinture cardio',days:365,ic:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>'},
 other:{n:'Autre',days:7,ic:'<path d="M7 7l10 10-5 4.5V2.5L17 7 7 17"/>'}
};
var DEVS=null,DVL={},DVE=null;
function dvLoad(){try{DEVS=JSON.parse(localStorage.getItem('forme_devs')||'null')}catch(e){DEVS=null}
  if(!DEVS){DEVS=[{id:'d1',type:'phone',name:'Magic 8 Pro',auto:'phone'},{id:'d2',type:'watch',name:'Montre Honor',days:10},{id:'d3',type:'head',name:'WH-1000XM5',days:4}];dvSave()}}
function dvSave(){try{localStorage.setItem('forme_devs',JSON.stringify(DEVS))}catch(e){}}
function dvById(id){for(var i=0;i<DEVS.length;i++){if(DEVS[i].id===id){return DEVS[i]}}return null}
/* niveau : {p:%, live:bool, chg:bool, t:quand} ou null */
function dvLevel(d){
  var L=DVL[d.id];if(L&&L.p!=null){return L}
  if(d.base!=null&&d.bt){var days=+d.days||DVT[d.type].days,p=d.base-(Date.now()-d.bt)/(days*864e5)*100;return{p:Math.max(0,Math.round(p)),live:false,t:d.bt}}
  return null;
}
function dvCol(p){return p==null?'rgba(var(--fgr),.18)':p>=50?'var(--ok)':p>=20?'#E9BC4C':'var(--ko)'}
function dvRing(d,S){
  var L=dvLevel(d),p=L?L.p:null,R=S/2-5,C=2*Math.PI*R,sw=S>80?6:4.5;
  return '<div class="dwr" style="width:'+S+'px;height:'+S+'px"><svg viewBox="0 0 '+S+' '+S+'" style="width:'+S+'px;height:'+S+'px">'+
   '<circle cx="'+S/2+'" cy="'+S/2+'" r="'+R+'" fill="none" stroke="rgba(var(--fgr),.1)" stroke-width="'+sw+'"'+(p==null?' stroke-dasharray="2 5"':'')+'/>'+
   (p!=null?'<circle class="dwa" cx="'+S/2+'" cy="'+S/2+'" r="'+R+'" fill="none" stroke="'+dvCol(p)+'" stroke-width="'+sw+'" stroke-linecap="round" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+(C*(1-p/100)).toFixed(1)+'" transform="rotate(-90 '+S/2+' '+S/2+')" style="--c:'+C.toFixed(1)+'"/>':'')+
   '</svg><svg class="dwi" viewBox="0 0 24 24" style="width:'+Math.round(S*.4)+'px;height:'+Math.round(S*.4)+'px">'+DVT[d.type].ic+'</svg>'+
   (L&&L.chg?'<em class="dwz">⚡</em>':'')+(L&&L.live?'<i class="dwl"></i>':'')+'</div>';
}
function dvPct(d){var L=dvLevel(d);return L?(L.live?'':'≈ ')+L.p+' %':'—'}
function dvWidget(){
  if(!DEVS){dvLoad()}if(!DEVS.length){return ''}
  return '<button class="g dw tap" onclick="openDevices()" aria-label="Mes appareils">'+DEVS.slice(0,6).map(function(d){
    return '<div class="dwc">'+dvRing(d,58)+'<b>'+dvPct(d)+'</b><span>'+esc(d.name)+'</span></div>'}).join('')+'</button>';
}
function dvPaint(){[].forEach.call(document.querySelectorAll('.dwslot'),function(s){s.innerHTML=dvWidget()});if(document.body.classList.contains('open')&&$('#dvp')&&!DVE){dvPage()}}
function dvAgo(t){var h=(Date.now()-t)/36e5;return h<1?'à l’instant':h<24?'il y a '+Math.round(h)+' h':'il y a '+Math.round(h/24)+' j'}
function dvStatus(d){
  var L=dvLevel(d);
  if(d.auto==='phone'){return L?(L.chg?'En charge · en direct':'En direct'):'Niveau non disponible sur ce navigateur'}
  if(DVL[d.id]&&DVL[d.id].p!=null){return 'En direct en Bluetooth'}
  if(L){return 'Estimé · chargé '+dvAgo(d.bt)+(d.base<100?' (à '+d.base+' %)':'')}
  return 'Touche « Rechargé » à la prochaine charge'
}
/* page Appareils */
function openDevices(){if(!DEVS){dvLoad()}DVE=null;openSh('<div id="dvp"></div>');document.body.classList.add('full');dvPage()}
function dvPage(){
  var el=$('#dvp');if(!el){return}
  var h='<div class="sh-h"><div class="big" style="font-size:28px;margin:0">Appareils</div><button class="gb" onclick="closeSh()" aria-label="Fermer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'+
   '<div class="note" style="margin:-4px 4px 14px;line-height:1.5">Le cercle montre la batterie. Vert : ça va. Ambre : pense à recharger. Rouge : vite !</div><div class="dvg">';
  DEVS.forEach(function(d){
    if(DVE===d.id){h+=dvEditor(d);return}
    h+='<div class="g dvk"><div class="dvkh">'+dvRing(d,84)+'<div style="min-width:0;flex:1"><div class="note">'+DVT[d.type].n+'</div><b>'+esc(d.name)+'</b><div class="dvp">'+dvPct(d)+'</div><div class="note">'+dvStatus(d)+'</div></div></div>'+
     '<div class="dvbt">'+(d.auto==='phone'?'':'<button class="g pill" onclick="dvCharged(\''+d.id+'\')">🔌 Rechargé</button>'+(navigator.bluetooth?'<button class="g pill" onclick="dvBle(\''+d.id+'\')">'+(d.ble?'Reconnecter':'Bluetooth')+'</button>':''))+'<button class="g pill" onclick="DVE=\''+d.id+'\';dvPage()">Modifier</button></div></div>';
  });
  if(DVE==='new'){h+=dvEditor({id:'new',type:'buds',name:'',days:4})}
  h+='</div>'+(DVE!=='new'?'<button class="g pill" style="width:100%;padding:14px;margin-top:12px" onclick="DVE=\'new\';dvPage()">＋ Ajouter un appareil</button>':'')+
   '<h2>Données et capteurs</h2><div class="g" id="dvc" style="padding:6px 18px"></div>'+
   '<div class="note" style="margin:14px 6px 6px;line-height:1.5">« Bluetooth » lit la batterie en direct si l’appareil la partage en Bluetooth standard (ceintures cardio, certaines balances et montres). La plupart des casques, Honor et Fitbit ne la partagent pas : Forme l’estime alors depuis ta dernière recharge.</div>';
  el.innerHTML=h;renderDevices();
}
function dvEditor(d){
  var nw=d.id==='new',L=dvLevel(d),cur=L?L.p:100;
  return '<div class="g dvk dved"><div class="lab" style="margin:0 2px 8px">'+(nw?'Nouvel appareil':'Modifier')+'</div>'+
   '<div class="dvty">'+Object.keys(DVT).filter(function(k){return k!=='phone'||d.type==='phone'}).map(function(k){return '<button class="g'+(k===d.type?' on':'')+'" onclick="dvType(this,\''+k+'\')" data-k="'+k+'"><svg viewBox="0 0 24 24">'+DVT[k].ic+'</svg><span>'+DVT[k].n+'</span></button>'}).join('')+'</div>'+
   '<div class="lab" style="margin:14px 4px 6px">Nom</div><input id="dve_n" class="g srch" maxlength="24" placeholder="Ex. AirPods, Montre Honor…" value="'+esc(d.name||'')+'">'+
   (d.auto==='phone'?'':'<div class="lab" style="margin:14px 4px 6px">Autonomie d’une charge (jours)</div><input id="dve_d" class="g srch" type="number" inputmode="decimal" min="0.2" step="0.5" value="'+(d.days||DVT[d.type].days)+'">'+
   '<div class="lab" style="margin:14px 4px 6px">Niveau actuel : <b id="dve_pv">'+cur+' %</b></div><input id="dve_p" class="dvrange" type="range" min="0" max="100" step="5" value="'+cur+'" oninput="$(\'#dve_pv\').textContent=this.value+\' %\'">')+
   '<div class="dvbt" style="margin-top:16px"><button class="g pill on" onclick="dvSaveEd(\''+d.id+'\')">Enregistrer</button><button class="g pill" onclick="DVE=null;dvPage()">Annuler</button>'+(nw||d.auto==='phone'?'':'<button class="g pill tko" onclick="dvDel(\''+d.id+'\')">Retirer</button>')+'</div>'+
   '<input type="hidden" id="dve_t" value="'+d.type+'"></div>';
}
function dvType(b,k){[].forEach.call(b.parentNode.children,function(x){x.classList.toggle('on',x===b)});$('#dve_t').value=k;var dd=$('#dve_d');if(dd&&$('#dve_n').value===''){dd.value=DVT[k].days}}
function dvSaveEd(id){
  var t=$('#dve_t').value,n=$('#dve_n').value.trim()||DVT[t].n,dd=$('#dve_d'),pp=$('#dve_p');
  var d=id==='new'?{id:'d'+Date.now().toString(36)}:dvById(id);if(!d){return}
  d.type=t;d.name=n;if(dd){d.days=Math.max(.2,pn(dd.value)||DVT[t].days)}
  if(pp){var L=dvLevel(d),v=+pp.value;if(!L||Math.abs(L.p-v)>=1||id==='new'){d.base=v;d.bt=Date.now()}}
  if(id==='new'){DEVS.push(d)}dvSave();DVE=null;dvPage();dvPaint();toast('Appareil enregistré');
}
function dvDel(id){DEVS=DEVS.filter(function(d){return d.id!==id});delete DVL[id];dvSave();DVE=null;dvPage();dvPaint()}
function dvCharged(id){var d=dvById(id);if(!d){return}d.base=100;d.bt=Date.now();dvSave();dvPage();dvPaint();toast('🔋 '+d.name+' rechargé');if(navigator.vibrate){navigator.vibrate(10)}}
/* batterie du téléphone, en direct */
function dvPhone(){
  if(!navigator.getBattery){return}navigator.getBattery().then(function(b){
    function up(){DEVS.forEach(function(d){if(d.auto==='phone'){DVL[d.id]={p:Math.round(b.level*100),live:true,chg:b.charging,t:Date.now()}}});dvPaint()}
    up();b.addEventListener('levelchange',up);b.addEventListener('chargingchange',up);
  }).catch(function(){});
}
/* Bluetooth standard (service batterie) */
function dvBleRead(d,dev){
  return dev.gatt.connect().then(function(s){return s.getPrimaryService('battery_service')}).then(function(s){return s.getCharacteristic('battery_level')})
   .then(function(c){function set(v){DVL[d.id]={p:v.getUint8(0),live:true,t:Date.now()};d.base=DVL[d.id].p;d.bt=Date.now();dvSave();dvPaint()}
     c.addEventListener('characteristicvaluechanged',function(e){set(e.target.value)});return c.readValue().then(set).then(function(){return c.startNotifications().catch(function(){})})});
}
function dvBle(id){
  var d=dvById(id);if(!d||!navigator.bluetooth){toast('Bluetooth indisponible : ouvre Forme depuis Chrome');return}
  navigator.bluetooth.requestDevice({acceptAllDevices:true,optionalServices:['battery_service']}).then(function(dev){
    d.ble=dev.id;dvSave();dev.addEventListener('gattserverdisconnected',function(){delete DVL[d.id];dvPaint()});
    return dvBleRead(d,dev).then(function(){toast('🔋 '+d.name+' : batterie en direct')});
  }).catch(function(e){if(e&&e.name==='NotFoundError'&&/cancel/i.test(e.message||'')){return}
    if(e&&e.name==='NotFoundError'){toast('Pas de batterie partagée : on garde l’estimation')}else if(e){toast('Connexion impossible')}});
}
function dvBleAuto(){
  if(!navigator.bluetooth||!navigator.bluetooth.getDevices){return}
  navigator.bluetooth.getDevices().then(function(list){list.forEach(function(dev){var d=DEVS.filter(function(x){return x.ble===dev.id})[0];if(d){dvBleRead(d,dev).catch(function(){})}})}).catch(function(){});
}
dvLoad();dvPhone();setTimeout(dvBleAuto,1500);setInterval(dvPaint,10*60e3);

/* ---------- Mensurations ---------- */
function renderMes(){
  var el=$('#msc');if(!el){return}var L=mesLatest(),lw=D&&D.weights.length?D.weights[0]:null;
  if(lw&&(!L.w_d||lw.d>=L.w_d)){L.w=lw.v;L.w_d=lw.d}
  el.innerHTML='<div class="msg">'+MF.map(function(F){var v=L[F[0]],p=F[0]==='w'?null:mesPrev(F[0]),d=v!=null&&p!=null?v-p:null,good=F[0]==='bras'||F[0]==='poitrine'||F[0]==='mollet'?1:-1;
    return '<div><span>'+F[1]+'</span><b>'+(v!=null?f(v,F[3])+'<small> '+F[2]+'</small>':'—')+'</b>'+(d&&Math.abs(d)>=.05?'<em class="'+((d>0)===(good>0)?'tok':'tko')+'">'+(d>0?'↑ ':'↓ ')+f(Math.abs(d),1)+'</em>':'')+'</div>'}).join('')+'</div>'+
    '<button class="g pill on" style="width:100%;margin-top:14px;padding:13px" onclick="openMesForm()">Mettre à jour mes mesures</button>';
}
function openMesForm(){
  var L=mesLatest(),lw=D&&D.weights.length?D.weights[0].v:null;
  openSh('<div class="sh-h"><div class="big" style="font-size:28px;margin:0">Mes mesures 📏</div><button class="gb" onclick="closeSh()" aria-label="Fermer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'+
   '<div class="note" style="margin:2px 4px 14px;line-height:1.5">Remplis seulement ce que tu as mesuré. Mètre ruban, le matin, à jeun, au même endroit à chaque fois.</div>'+
   '<div class="lab" style="margin:0 4px 6px">Date</div><input id="mf_date" class="g srch" type="date" value="'+todayKey()+'">'+
   '<div class="mfg">'+MF.map(function(F){var v=F[0]==='w'?(L.w||lw):L[F[0]];return '<label><span>'+F[1]+' ('+F[2]+')</span><input class="g srch" id="mf_'+F[0]+'" type="number" inputmode="decimal" step="0.1" placeholder="'+(v!=null?f(v,F[3]):'—')+'"></label>'}).join('')+'</div>'+
   '<div id="mf_msg" class="note" style="margin:12px 4px;min-height:18px"></div><button class="g pill on" style="width:100%;padding:14px" onclick="saveMesForm()">Enregistrer</button>');
  document.body.classList.add('full');
}
function saveMesForm(){
  var o={date:$('#mf_date').value||todayKey()},n=0;
  MF.forEach(function(f){var v=pn($('#mf_'+f[0]).value);if(v!=null&&v>0){o[f[0]]=v;n++}});
  if(!n){$('#mf_msg').innerHTML='<span class="tko">Saisis au moins une valeur.</span>';return}
  var ex=MES.filter(function(m){return m.date===o.date})[0];if(ex){Object.assign(ex,o)}else{MES.push(o)}saveMesLocal();
  function after(msg){closeSh();toast(msg);if(D){mergeWeights();renderWeek()}renderMoi();computeTrophies()}
  if(live()&&!gs()){$('#mf_msg').textContent='Envoi vers ta feuille…';var q={};MF.forEach(function(f){if(o[f[0]]!=null){q[f[0]]=o[f[0]]}});q.date=o.date;
    call('save',null,q).then(function(){after('Mesures enregistrées dans ta feuille ✓')}).catch(function(){after('Enregistré sur ce téléphone · mets à jour Code.gs pour l’envoyer dans ta feuille')})}
  else{after('Mesures enregistrées ✓')}
}

/* ---------- Pesée rapide (balance classique) ---------- */
function openWeigh(){
  var lw=D&&D.weights.length?D.weights[0]:null;
  openSh('<div class="sh-h"><div class="big" style="font-size:28px;margin:0">Me peser ⚖️</div><button class="gb" onclick="closeSh()" aria-label="Fermer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'+
   '<div class="note" style="margin:-4px 4px 16px;line-height:1.5">Le matin, à jeun, après être passé aux toilettes : c’est là que le poids est le plus fiable d’un jour à l’autre.</div>'+
   '<div class="wqw"><input id="wq_v" type="number" inputmode="decimal" step="0.1" min="30" max="250" placeholder="'+(lw?f(lw.v,1):'78,0')+'" onkeydown="if(event.key===\'Enter\'){saveWeigh()}"><span>kg</span></div>'+
   (lw?'<div class="note" style="text-align:center;margin-top:6px">Dernière pesée : '+f(lw.v,1)+' kg · '+dl(lw.d)+'</div>':'')+
   '<div class="lab" style="margin:18px 4px 6px">Date</div><input id="wq_d" class="g srch" type="date" value="'+todayKey()+'" max="'+todayKey()+'">'+
   '<div id="wq_m" class="note" style="margin:12px 4px;min-height:16px"></div><button class="obgo" onclick="saveWeigh()">Enregistrer</button>');
  setTimeout(function(){var i=$('#wq_v');if(i){i.focus()}},350);
}
function saveWeigh(){
  var v=pn($('#wq_v').value),d=$('#wq_d').value||todayKey();
  if(!v||v<30||v>250){$('#wq_m').innerHTML='<span class="tko">Entre ton poids en kg (par exemple 77,8).</span>';return}
  var prev=D&&D.weights.length?D.weights.filter(function(x){return x.d<d})[0]:null;
  var ex=MES.filter(function(m){return m.date===d})[0];if(ex){ex.w=v}else{MES.push({date:d,w:v})}saveMesLocal();
  if(D){D.weights=D.weights.filter(function(x){return x.d!==d});D.weights.push({d:d,v:v});D.weights.sort(function(a,b){return a.d<b.d?1:-1})}
  var diff=prev?v-prev.v:null,msg=f(v,1)+' kg'+(diff!=null&&Math.abs(diff)>=.05?' ('+(diff>0?'+':'−')+f(Math.abs(diff),1)+')':'');
  function after(t){closeSh();toast(t);if(D){renderWeek()}if(TAB==='moi'){renderMoi()}computeTrophies();if(typeof petCheer==='function'&&diff!=null&&diff<0){petCheer('−'+f(Math.abs(diff),1)+' kg, bien joué ! 💪')}}
  if(live()&&!gs()){$('#wq_m').textContent='Envoi vers ta feuille…';call('save',null,{date:d,w:v}).then(function(){after('⚖️ '+msg+' enregistré')}).catch(function(){after('⚖️ '+msg+' gardé sur ce téléphone (feuille injoignable)')})}
  else{after('⚖️ '+msg+' enregistré')}
}

/* ---------- Écran Moi ---------- */
function renderMoi(){
  var el=$('#v-moi');if(!el){return}var a=avatarPh(),n=uname().trim(),s=suivi(),lw=D&&D.weights.length?D.weights[0].v:null;
  el.innerHTML=
   '<div class="moih"><button class="avl" onclick="pickPhoto(\'profil\')">'+(a?'<img src="'+a.img+'" alt="">':'<span>'+esc((n||'?').charAt(0).toUpperCase())+'</span>')+'<em>✎</em></button>'+
   '<div style="min-width:0" class="tap" onclick="openWeigh()"><div class="note">Objectif '+(D?f(D.targets.weight,1):'74,0')+' kg · touche pour te peser</div><div class="big" style="font-size:30px;margin:2px 0">'+(lw!=null?f(lw,1)+'<small>kg</small>':'—')+'</div>'+(lw!=null&&D?badge(lw<=D.targets.weight?'ok':'nt',lw<=D.targets.weight?'Objectif atteint 🎉':'Encore '+f(lw-D.targets.weight,1)+' kg'):'')+'</div></div>'+
   '<h2>Trophées 🏆</h2><div class="g" id="trc"></div>'+
   '<div class="mtabs" id="mtabs">'+[['🧍','Silhouette'],['📏','Mensurations'],['⏱️','Chrono'],['🎧','Musique']].map(function(t,i){return '<button class="pill'+(i?'':' on')+'" onclick="moiGo('+i+')">'+t[0]+' '+t[1]+'</button>'}).join('')+'</div>'+
   '<div class="car mcar" id="mcar">'+
    '<div class="g slide b3w"><div class="mch">Ta silhouette 3D 🧍</div><div class="b3in"><canvas id="b3c" class="b3c"></canvas><div class="b3w8" id="b3w8">Modelage de ta silhouette…</div><div class="b3fl"></div></div>'+
     '<div class="g seg" id="b3s" style="padding:3px;margin:4px 0 8px"><u></u><button class="on" onclick="setGoalView(0)">Aujourd’hui</button><button onclick="setGoalView(1)">À '+f(D?D.targets.weight:74,0)+' kg</button></div><div class="note" id="b3n" style="line-height:1.45"></div></div>'+
    '<div class="g slide"><div class="mch">Mensurations 📏</div><div id="msc"></div></div>'+
    '<div class="g slide"><div class="mch">Chrono ⏱️</div><div id="tmc"></div></div>'+
    '<div class="g slide"><div class="mch">Musique 🎧</div><div id="muc"></div></div>'+
   '</div><div class="dots"><i></i><i></i><i></i><i></i></div>'+petMoiCard()+
   '<h2>Appareils ⌚</h2><div class="dwslot">'+dvWidget()+'</div>'+
   '<h2>Photos de suivi 📸</h2><div class="g"><div class="sh-h" style="margin:0 0 10px"><span class="note">'+(s.length?s.length+' photo'+(s.length>1?'s':''):'Aucune photo pour l’instant')+'</span><button class="g pill" style="padding:9px 14px" onclick="pickPhoto(\'suivi\')">＋ Ajouter</button></div>'+
     (s.length>=2?cmpHtml(s[0],s[s.length-1]):'')+(s.length?'<div class="pgr">'+s.slice().reverse().map(function(p){return '<div onclick="viewPhoto('+p.id+')"><img src="'+p.img+'" alt=""><span>'+dl(p.date)+(p.w?' · '+f(p.w,1)+' kg':'')+'</span></div>'}).join('')+'</div>':'<div class="note" style="line-height:1.5">Une photo toutes les 2 à 4 semaines, même lumière et même pose, pour comparer avant / maintenant.</div>')+
     '<div class="note" style="margin-top:12px;line-height:1.5">🔒 Tes photos restent uniquement sur ce téléphone.</div></div>'+
   '<button class="g setrow tap" style="width:100%;text-align:left;margin-top:18px" onclick="openSet()"><div><b style="font-weight:600">Réglages et connexion ⚙️</b><div class="note">Prénom, mode clair, lien de ta feuille</div></div><svg viewBox="0 0 24 24" style="width:18px;height:18px;color:var(--m)"><path d="M9 6l6 6-6 6"/></svg></button>';
  setGoalView(B3.goalT?1:0);renderMes();renderTimer();renderMusic();renderDevices();renderTrCard();moiCar();B3.key='';if(!g3Start()){start3d()}
}


/* Forme · accueil.js · Accueil : tuiles illustrées (résumé + sommaire), sections regroupées, visite de départ */

/* ---------- dessins des tuiles ---------- */
var QTI={
 forme:'<circle cx="16" cy="17" r="11"/><path class="a" d="M16 6a11 11 0 0 1 10.4 14.5"/><path class="f" d="M17 9l-5 9h4l-1 6 5-9h-4z"/>',
 sleep:'<path class="f" d="M21 19.5A9.5 9.5 0 0 1 12.5 6a9.5 9.5 0 1 0 8.5 13.5z"/><path d="M21 19.5A9.5 9.5 0 0 1 12.5 6a9.5 9.5 0 1 0 8.5 13.5z"/><path class="a" d="M22 5v4M20 7h4M26 12v2.5M24.8 13.2h2.5"/>',
 heart:'<path class="f" d="M16 26s-9-5.6-9-12.4A5 5 0 0 1 16 10.4a5 5 0 0 1 9 3.2C25 20.4 16 26 16 26z"/><path d="M16 26s-9-5.6-9-12.4A5 5 0 0 1 16 10.4a5 5 0 0 1 9 3.2C25 20.4 16 26 16 26z"/><path class="a" d="M5 17h5l2-3 3 6 2-4h10"/>',
 weight:'<rect class="f" x="6" y="7" width="20" height="19" rx="5"/><rect x="6" y="7" width="20" height="19" rx="5"/><path d="M11.5 14a4.5 4.5 0 0 1 9 0"/><path class="a" d="M16 14l2-2.6"/>',
 train:'<path d="M9 11v10M23 11v10"/><rect class="f" x="5" y="13" width="4" height="6" rx="1.5"/><rect class="f" x="23" y="13" width="4" height="6" rx="1.5"/><rect x="5" y="13" width="4" height="6" rx="1.5"/><rect x="23" y="13" width="4" height="6" rx="1.5"/><path class="a" d="M9 16h14"/>',
 food:'<circle class="f" cx="17" cy="16" r="7.5"/><circle cx="17" cy="16" r="7.5"/><circle cx="17" cy="16" r="10.5"/><path class="a" d="M4 7v6a1.5 1.5 0 0 0 3 0V7M5.5 13v12M28.5 7c-1.8 1-2.5 3-2.5 6h2.5v12"/>',
 steps:'<path class="f" d="M10 6c2.5 0 3.5 3 3.5 6s-1 5-3.5 5-3.5-2-3.5-5 1-6 3.5-6z"/><path d="M10 6c2.5 0 3.5 3 3.5 6s-1 5-3.5 5-3.5-2-3.5-5 1-6 3.5-6z"/><path d="M7.3 19.5h5.4l-.6 3a2.1 2.1 0 0 1-4.2 0z"/><path class="a" d="M22 11c2.5 0 3.5 3 3.5 6s-1 5-3.5 5-3.5-2-3.5-5 1-6 3.5-6zM19.3 24.5h5.4l-.4 2a2.2 2.2 0 0 1-4.4 0z"/>',
 prog:'<path d="M6 25h21"/><rect class="f" x="8" y="17" width="4" height="8" rx="1"/><rect class="f" x="14.5" y="13" width="4" height="12" rx="1"/><rect class="f" x="21" y="8" width="4" height="17" rx="1"/><path class="a" d="M7 13l6-4 5 2 7-6M21 5h4v4"/>',
 cycle:'<circle class="f" cx="16" cy="16" r="3.5"/><path d="M16 12.5c-2-4-1-7 0-8 1 1 2 4 0 8zM19.5 16c4-2 7-1 8 0-1 1-4 2-8 0zM16 19.5c2 4 1 7 0 8-1-1-2-4 0-8zM12.5 16c-4 2-7 1-8 0 1-1 4-2 8 0z"/><path class="a" d="M18.5 13.5c3-3 6-3 7.4-2.9-.1 1.4-1 4.4-4.9 4.4M13.5 18.5c-3 3-6 3-7.4 2.9.1-1.4 1-4.4 4.9-4.4"/>'
};
function qtSvg(k){return '<svg viewBox="0 0 32 32" aria-hidden="true">'+QTI[k]+'</svg>'}
function qtGo(id){var e=document.getElementById(id);if(!e){return}var h=e.previousElementSibling&&e.previousElementSibling.classList.contains('sth')?e.previousElementSibling:e;
  scrollTo({top:h.getBoundingClientRect().top+scrollY-78,behavior:'smooth'});if(navigator.vibrate){navigator.vibrate(6)}}
function qtTiles(){
  var w=D.week,t=D.targets,S=formScore(),lw=D.weights.length?D.weights[0].v:null,ses=(w.stim||[]).filter(function(x){return x>0}).length;
  var ls=last(w.sleep),lr=last(w.rhr),kc=last(w.kcal||[]),stp=(WX&&WX.steps)||w.steps||[],st=last(stp),pr=avg(w.prot||[]);
  var T=[
   ['forme','Forme du jour',S.v==null?'—':S.v+'<small>/100</small>',S.t||'',S.c==='ok'?'ok':S.c==='ko'?'ko':'','c0'],
   ['sleep','Sommeil',hm(ls),ls==null?'':lastNight().replace('Nuit de ','').replace(' à ','→'),ls!=null&&ls>=t.sleep?'ok':'','c1'],
   ['heart','FC repos',lr==null?'—':f(lr)+'<small>bpm</small>',S.base?'réf. '+f(S.base):'','','c1'],
   ['train','Séances',ses+'<small>cette sem.</small>',f(sum(w.stim||[]))+' séries utiles','','c2'],
   ['steps','Pas',st==null?'—':f(st),st==null?'':'dernier jour','','c2'],
   ['food','Nutrition',kc==null?'—':f(kc)+'<small>kcal</small>',pr!=null?f(pr)+' g protéines':'','','c3'],
   ['weight','Poids',lw==null?'—':f(lw,1)+'<small>kg</small>',lw==null?'':(lw-t.weight>0?'encore '+f(lw-t.weight,1)+' kg':'objectif atteint 🎉'),'','c5'],
   ['prog','Progrès','Bilans','tes tendances','','c4']
  ];
  if(typeof cyOn==='function'&&cyOn()){var o=cyStats(),P=cyPhase(o);T.splice(1,0,['cycle','Cycle',o.day?'Jour '+o.day:'—',P?P.n:'','','cyslot'])}
  return '<div class="qtw" id="qtw">'+T.map(function(x){return '<button class="g qt tap" onclick="qtGo(\''+x[5]+'\')" aria-label="'+x[1]+'"><div class="qi">'+qtSvg(x[0])+'</div><span>'+x[1]+'</span><b>'+x[2]+'</b><em class="'+x[4]+'">'+x[3]+'</em></button>'}).join('')+'</div>';
}

/* ---------- sections regroupées : la carte principale en grand à gauche, deux petites à droite ---------- */
function bnCompact(s){
  var lab=s.querySelector('.lab'),big=s.querySelector('.big'),duo=s.querySelector('.duo'),v='',n='';
  if(big){v=big.innerHTML;var no=s.querySelector('.big~.note');n=no?no.textContent:''}
  else if(duo){var c=[].slice.call(duo.children);if(!c.length){return false}var b0=c[0].querySelector('b');if(!b0||/empty/.test(b0.className)){return false}
    v=b0.innerHTML;n=c.slice(1).map(function(x){var sp=x.querySelector('span'),bb=x.querySelector('b');return (sp?sp.textContent:'')+' '+(bb?bb.textContent:'')}).join(' · ');
    var nn=s.querySelector('.duo~.note');if(nn&&/Respiration/.test(nn.textContent)){n+=' · '+nn.textContent.replace(' en moyenne la nuit','').replace('Respiration','resp.')}}
  else{return false}
  s.innerHTML='<div class="lab">'+(lab?lab.innerHTML:'')+'</div><div class="big">'+v+'</div><div class="note">'+n+'</div>';
  return true;
}
function bnCan(s){return !!(s.querySelector('.big')||(s.querySelector('.duo b')&&!/empty/.test(s.querySelector('.duo b').className)))}
function bento(id){
  var car=document.getElementById(id);if(!car||!car.classList.contains('car')){return}
  var sl=[].slice.call(car.children);if(sl.length<2){return}
  var dots=car.nextElementSibling&&car.nextElementSibling.classList.contains('dots')?car.nextElementSibling:null;
  var bigC=sl[0],small=[],rest=[];
  sl.slice(1).forEach(function(s){if(small.length<2&&bnCan(s)){small.push(s)}else{rest.push(s)}});
  if(!small.length){return}
  var wide=!!bigC.querySelector('.rings,.duo,.dn');
  var b=document.createElement('div');b.className='bento'+(wide?' wide':small.length===1?' two':'');
  bigC.classList.remove('slide');bigC.classList.add('bb');b.appendChild(bigC);
  small.forEach(function(s){s.classList.remove('slide');s.classList.add('bs');bnCompact(s);b.appendChild(s)});
  car.parentNode.insertBefore(b,car);
  if(rest.length){
    var mx=document.createElement('div');mx.className='bmx';mx.hidden=true;
    rest.forEach(function(s){s.classList.remove('slide');mx.appendChild(s)});
    var more=document.createElement('button');more.className='g bmore tap';
    more.innerHTML='<span>＋ '+rest.map(function(s){var l=s.querySelector('.lab');return l?esc(l.textContent.trim()):'Plus'}).join(' · ')+'</span><span class="bmv">Voir ›</span>';
    more.onclick=function(){mx.hidden=!mx.hidden;more.querySelector('.bmv').textContent=mx.hidden?'Voir ›':'Masquer';if(!mx.hidden&&typeof lqQueue==='function'){lqQueue()}};
    car.parentNode.insertBefore(more,car);car.parentNode.insertBefore(mx,car);
  }
  if(dots){dots.remove()}
  car.remove();b.id=id;
}

/* ---------- branchement sur l'onglet Semaine ---------- */
var _acWeek=renderWeek;renderWeek=function(){
  _acWeek.apply(this,arguments);
  var v=document.getElementById('v-week');if(!v||!D){return}
  var dw=v.querySelector('.dwslot');if(dw){dw.remove()} /* les appareils restent dans le bouton en haut et dans Moi */
  try{v.insertAdjacentHTML('afterbegin',qtTiles())}catch(e){}
  var c0=document.getElementById('c0');
  if(c0&&c0.children.length>1&&c0.previousElementSibling){c0.previousElementSibling.insertAdjacentHTML('beforeend','<button class="swh" onclick="var c=document.getElementById(\'c0\');c.scrollBy({left:c.clientWidth*.8,behavior:\'smooth\'})">Coach et conseil<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></button>')}
  ['c1','c2','c3'].forEach(function(id){try{bento(id)}catch(e){}});
  setTimeout(tourMaybe,900);
};

/* ---------- petite visite en 3 bulles, une seule fois, pour les nouveaux ---------- */
function tourSeen(){try{return !!localStorage.getItem('forme_tour')}catch(e){return true}}
function tourClear(){[].forEach.call(document.querySelectorAll('#tour'),function(o){o.remove()})}
function tourDone(){try{localStorage.setItem('forme_tour','1')}catch(e){}tourClear()}
(function(){try{if(!localStorage.getItem('forme_tour')&&(localStorage.getItem('forme_cache')||localStorage.getItem('forme_mes'))){localStorage.setItem('forme_tour','1')}}catch(e){}})(); /* déjà utilisateur : pas de visite */
var TOUR=[
 ['#qtw','Ton résumé du jour','Chaque tuile montre un chiffre clé. Touche-la pour aller directement à la bonne partie.'],
 ['#c0','Glisse sur le côté','À droite de « Forme du jour », tu trouves le mot du coach et le conseil du jour.'],
 ['#dvb','Tes appareils','Ici : la batterie de ton téléphone et de tes appareils, et d’où viennent tes données.']
];
var TOURON=false;
function tourMaybe(){if(TOURON||tourSeen()||TAB!=='week'||document.body.classList.contains('open')||$('#ob')&&!$('#ob').hidden&&$('#ob').offsetParent){return}if(!PROF||!PROF.done){return}TOURON=true;tourStep(0)}
function tourStep(i){
  tourClear();if(i>=TOUR.length){tourDone();return}
  var s=TOUR[i],el=document.querySelector(s[0]);if(!el){tourStep(i+1);return}
  if(i<2){el.scrollIntoView({block:'center'})}else{scrollTo(0,0)}
  setTimeout(function(){
    var r=el.getBoundingClientRect(),pad=8,below=r.top<innerHeight/2;
    tourClear();var d=document.createElement('div');d.id='tour';
    d.innerHTML='<div class="tr-hole" style="left:'+(r.left-pad)+'px;top:'+(r.top-pad)+'px;width:'+(r.width+pad*2)+'px;height:'+(r.height+pad*2)+'px"></div>'+
      '<div class="tr-bub" style="'+(below?'top:'+Math.min(innerHeight-190,r.bottom+16):'bottom:'+(innerHeight-r.top+16))+'px"><b>'+s[1]+'</b><p>'+s[2]+'</p><div><span>'+(i+1)+' / '+TOUR.length+'</span><button class="g pill" onclick="tourDone()">Passer</button><button class="g pill on" onclick="tourStep('+(i+1)+')">'+(i===TOUR.length-1?'C’est parti':'Suivant')+'</button></div></div>';
    document.body.appendChild(d);
  },350);
}

/* ---------- Eau : ajout rapide depuis l'accueil (enregistré dans l'onglet Saisies) ---------- */
var EAU={},EAUL=null;
try{EAU=JSON.parse(localStorage.getItem('forme_eau')||'{}')||{}}catch(e){EAU={}}
function eauSave(){try{localStorage.setItem('forme_eau',JSON.stringify(EAU))}catch(e){}}
function eauSheet(k){var w=D&&D.week;if(!w||!w.keys||!w.water){return null}var i=w.keys.indexOf(k);return i<0?null:w.water[i]}
function eauCur(){var k=todayKey();if(EAU[k]==null){var s=eauSheet(k);return s||0}return EAU[k]}
function eauGoal(){return (D&&D.targets&&D.targets.water)||2.5}
function eauPend(){try{return JSON.parse(localStorage.getItem('forme_eau_pend')||'[]')}catch(e){return []}}
function eauSetPend(a){try{localStorage.setItem('forme_eau_pend',JSON.stringify(a))}catch(e){}}
function eauPush(k){
  if(!live()){return}
  var p=eauPend().filter(function(x){return x!==k});
  call('save',null,{date:k,eau:EAU[k]}).then(function(r){if(r&&r.error){throw new Error(r.error)}eauSetPend(p)}).catch(function(){if(p.indexOf(k)<0){p.push(k)}eauSetPend(p)});
}
function eauFlush(){eauPend().forEach(function(k){if(EAU[k]!=null){eauPush(k)}})}
function eauAdd(ml){
  var k=todayKey(),v=Math.max(0,Math.round((eauCur()+ml/1000)*100)/100);
  EAU[k]=v;eauSave();EAUL=ml>0?{ml:ml,t:Date.now()}:null;eauPush(k);eauPaint();
  if(navigator.vibrate){navigator.vibrate(8)}
  if(ml>0&&v>=eauGoal()&&v-ml/1000<eauGoal()){toast('💧 Objectif d’eau atteint, bravo !')}
}
function eauUndo(){if(!EAUL){return}var ml=EAUL.ml;EAUL=null;eauAdd(-ml);toast('Annulé')}
function eauOther(){var b=$('#eauo');if(!b){return}b.hidden=!b.hidden;if(!b.hidden){var i=$('#eauin');i.value='';i.focus()}}
function eauOtherOk(){var v=pn($('#eauin').value);if(!v||v<=0){return}eauAdd(v<=10?v*1000:v)} /* « 1,5 » = 1,5 L, « 330 » = 330 ml */
function eauDrop(p){var h=Math.round(26*Math.min(1,p));
  return '<svg class="eaud" viewBox="0 0 32 40" aria-hidden="true"><defs><clipPath id="eaucp"><path d="M16 3C16 3 5 16 5 25a11 11 0 0 0 22 0C27 16 16 3 16 3z"/></clipPath></defs><g clip-path="url(#eaucp)"><rect x="0" y="'+(37-h)+'" width="32" height="'+(h+3)+'" style="fill:var(--ac)" opacity=".75"/></g><path d="M16 3C16 3 5 16 5 25a11 11 0 0 0 22 0C27 16 16 3 16 3z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'}
function eauCard(){
  var v=eauCur(),g=eauGoal(),p=v/g,recent=EAUL&&Date.now()-EAUL.t<15000;
  return '<div class="g eauc" id="eauc"><div class="eauh"><div><div class="lab">Eau bue aujourd’hui 💧</div><div class="big">'+f(v,v<10?1:0)+'<small> / '+f(g,1)+' L</small></div><div class="note">'+(p>=1?'Objectif atteint 🎉':'Encore '+f(Math.max(0,g-v),1)+' L')+'</div></div>'+eauDrop(p)+'</div>'+
   '<div class="eaub"><i style="width:'+Math.min(100,Math.round(p*100))+'%"></i></div>'+
   '<div class="eaubt"><button class="g pill" onclick="eauAdd(250)">＋ 250 ml</button><button class="g pill" onclick="eauAdd(500)">＋ 500 ml</button><button class="g pill" onclick="eauOther()" aria-label="Autre quantité">Autre…</button></div>'+
   '<div class="eauo" id="eauo" hidden><input id="eauin" class="g srch" type="text" inputmode="decimal" placeholder="ml (ou litres : 1,5)" onkeydown="if(event.key===\'Enter\'){eauOtherOk()}"><button class="g pill on" onclick="eauOtherOk()">Ajouter</button></div>'+
   (recent?'<button class="eauu" onclick="eauUndo()">↩︎ Annuler le dernier ajout ('+EAUL.ml+' ml)</button>':'')+'</div>';
}
function eauPaint(){var c=$('#eauc');if(c){var o=$('#eauo'),open=o&&!o.hidden;c.outerHTML=eauCard();if(open){eauOther()}}var t=$('#qt-eau b');if(t){t.innerHTML=f(eauCur(),1)+'<small>L</small>'}
  clearTimeout(eauPaint.t);if(EAUL){eauPaint.t=setTimeout(function(){EAUL=null;var c2=$('#eauc');if(c2&&!($('#eauo')&&!$('#eauo').hidden)){c2.outerHTML=eauCard()}},15500)}}
QTI.drop='<path class="f" d="M16 9c0 0-7 8.5-7 14a7 7 0 0 0 14 0c0-5.5-7-14-7-14z"/><path d="M16 4c0 0-10 12-10 19.5a10 10 0 0 0 20 0C26 16 16 4 16 4z"/><path class="a" d="M11.5 22.5a4.5 4.5 0 0 0 3 4.2"/>';
var _eauWeek=renderWeek;renderWeek=function(){
  _eauWeek.apply(this,arguments);if(!D){return}
  var c3=document.getElementById('c3');if(c3&&!$('#eauc')){c3.insertAdjacentHTML('afterend',eauCard())}
  var q=$('#qtw');if(q&&!$('#qt-eau')){var nut=[].slice.call(q.children).filter(function(b){return /Nutrition/.test(b.getAttribute('aria-label')||'')})[0];
    var h='<button class="g qt tap" id="qt-eau" onclick="qtGo(\'eauc\')" aria-label="Eau"><div class="qi">'+qtSvg('drop')+'</div><span>Eau</span><b>'+f(eauCur(),1)+'<small>L</small></b><em>objectif '+f(eauGoal(),1)+' L</em></button>';
    if(nut){nut.insertAdjacentHTML('afterend',h)}else{q.insertAdjacentHTML('beforeend',h)}}
};
setTimeout(eauFlush,4000);

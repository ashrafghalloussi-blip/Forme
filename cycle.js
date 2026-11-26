/* Forme · cycle.js · Suivi du cycle menstruel (proposé aux femmes qui le souhaitent) */
/* ---------------------------------------------------------------------------------
   Données : uniquement sur ce téléphone (localStorage 'forme_cycle').
   CY.days['AAAA-MM-JJ'] = { f: flux 0-3 (0 = pas de règles), s: [symptômes], e: énergie 1-3 }
   Les règles sont déduites des jours notés : des jours consécutifs (un jour d'écart toléré) = une période.
   Repères généraux, pas un avis médical, pas un moyen de contraception.
   --------------------------------------------------------------------------------- */
var CY={days:{},hc:false,len:null,plen:null};
try{var _cy=JSON.parse(localStorage.getItem('forme_cycle')||'null');if(_cy&&_cy.days){CY=Object.assign(CY,_cy)}}catch(e){}
var CYSEL=null,CYM=null; // jour sélectionné et mois affiché dans le calendrier
var CYFLOW=['Aucun','Léger','Moyen','Abondant'];
var CYSYM=['Crampes','Fatigue','Ballonnements','Maux de tête','Humeur changeante','Fringales','Seins sensibles','Boutons','Mal de dos','Sommeil agité'];
var CYEN=['','Basse','Normale','Haute'];
var CYROSE='#FF6F91';

function cySave(){try{localStorage.setItem('forme_cycle',JSON.stringify(CY))}catch(e){}}
function cyOn(){return !!(PROF&&PROF.sexe==='f'&&PROF.cycle==='oui')}
function cyKey(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function cyDate(k){var p=k.split('-');return new Date(+p[0],+p[1]-1,+p[2],12)}
function cyAdd(k,n){var d=cyDate(k);d.setDate(d.getDate()+n);return cyKey(d)}
function cyDiff(a,b){return Math.round((cyDate(b)-cyDate(a))/864e5)} // b - a, en jours
function cyToday(){return cyKey(new Date())}
function cyDay(k){return['dim.','lun.','mar.','mer.','jeu.','ven.','sam.'][cyDate(k).getDay()]}
function cyNice(k){return cyDate(k).toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}
function cyShort(k){return cyDate(k).toLocaleDateString('fr-FR',{day:'numeric',month:'short'})}

/* périodes de règles déduites des jours notés */
function cyPeriods(){
  var ks=Object.keys(CY.days).filter(function(k){return CY.days[k]&&CY.days[k].f>0}).sort(),P=[];
  ks.forEach(function(k){var l=P[P.length-1];if(l&&cyDiff(l.e,k)<=2){l.e=k;l.n=cyDiff(l.s,k)+1}else{P.push({s:k,e:k,n:1})}});
  return P;
}
/* calculs : jour du cycle, durée moyenne, phase, prochaines règles */
function cyStats(){
  var P=cyPeriods(),t=cyToday(),L=[];
  for(var i=1;i<P.length;i++){var g=cyDiff(P[i-1].s,P[i].s);if(g>=18&&g<=60){L.push(g)}}
  L=L.slice(-6);
  var len=CY.len||(L.length?Math.round(L.reduce(function(a,b){return a+b},0)/L.length):28);
  var pl=P.slice(-6).map(function(p){return p.n}),plen=CY.plen||(pl.length?Math.round(pl.reduce(function(a,b){return a+b},0)/pl.length):5);
  len=Math.max(18,Math.min(60,len));plen=Math.max(2,Math.min(10,plen));
  var irr=L.length>=3&&(Math.max.apply(null,L)-Math.min.apply(null,L))>7;
  var past=P.filter(function(p){return p.s<=t}),last=past[past.length-1]||null;
  var o={P:P,len:len,plen:plen,irr:irr,lens:L,last:last,today:t};
  if(!last){return o}
  o.day=cyDiff(last.s,t)+1;
  o.next=cyAdd(last.s,len);o.toNext=cyDiff(t,o.next);
  o.ov=cyAdd(last.s,len-14);o.ovDay=len-13;
  var ongoing=last.e>=cyAdd(t,-1)&&o.day<=10,inP=CY.days[t]&&CY.days[t].f>0;
  o.late=o.toNext<0&&!inP?-o.toNext:0;
  if(inP||ongoing&&o.day<=Math.max(plen,last.n)){o.ph='regles'}
  else if(o.late>0){o.ph='retard'}
  else if(CY.hc){o.ph='hc'}
  else if(o.day<o.ovDay-1){o.ph='foll'}
  else if(o.day<=o.ovDay+1){o.ph='ovu'}
  else if(o.toNext<=5){o.ph='pms'}
  else{o.ph='lut'}
  return o;
}
var CYP={
  regles:{n:'Règles',e:'🩸',c:CYROSE,d:'L’énergie est souvent plus basse les premiers jours.',
    t:['Tu peux t’entraîner si tu te sens bien : baisse un peu les charges si besoin, sans culpabiliser.','Chaleur sur le ventre, marche douce et étirements aident souvent contre les crampes.','Pense aux aliments riches en fer (lentilles, viande rouge, épinards), avec un peu de vitamine C.'],
    w:'Ton poids peut rester un peu plus haut quelques jours (de l’eau, pas du gras).'},
  foll:{n:'Après les règles',sub:'Phase folliculaire',e:'🌱',d:'L’énergie remonte chez beaucoup de femmes.',
    t:['Bon moment pour viser une progression : une répétition ou un peu de charge en plus.','La récupération est souvent plus facile : garde ton volume habituel.']},
  ovu:{n:'Milieu du cycle',sub:'Ovulation estimée',e:'✨',d:'Beaucoup se sentent en pleine forme.',
    t:['Profite de l’énergie, mais échauffe-toi bien avant les charges lourdes.','Garde une technique propre : c’est elle qui te fait progresser.']},
  lut:{n:'Seconde moitié du cycle',sub:'Phase lutéale',e:'🌙',d:'La faim peut augmenter un peu et le corps chauffe légèrement.',
    t:['Une collation riche en protéines aide à gérer les fringales.','Bois un peu plus : ta température est légèrement plus haute.']},
  pms:{n:'Avant les règles',sub:'Fin de cycle',e:'🫧',d:'Fatigue, ballonnements ou humeur changeante sont fréquents.',
    t:['Séance plus légère si besoin : l’important, c’est la régularité.','Un peu moins de sel et un peu plus d’eau aident contre les ballonnements.'],
    w:'Ton poids peut monter de 0,5 à 2 kg à cause de l’eau : ce n’est pas du gras, il redescend après les règles.'},
  retard:{n:'Règles en retard',e:'⏳',d:'Les cycles varient : stress, sport intense, sommeil ou perte de poids peuvent les décaler.',
    t:['Note tes règles dès qu’elles arrivent pour que les prévisions s’ajustent.','Si le retard dure ou t’inquiète, parles-en à un professionnel de santé.']},
  hc:{n:'Contraception hormonale',e:'💊',d:'Forme suit tes saignements et ton ressenti, sans phases ni ovulation.',
    t:['Note ton énergie et tes symptômes : tu verras ce qui revient d’un mois à l’autre.']}
};
function cyPhase(o){return CYP[o.ph]||null}

/* anneau du cycle : règles en rose, le reste à la couleur du fond, un point pour aujourd'hui */
function cyRing(o,S){
  S=S||150;var R=S/2-12,C=2*Math.PI*R,len=o.len,seg=function(a,b,col,op,w){var s=Math.max(0,(a-1)/len),e=Math.min(1,b/len);if(e<=s){return ''}
    return '<circle cx="'+S/2+'" cy="'+S/2+'" r="'+R+'" fill="none" stroke-width="'+(w||10)+'" stroke-linecap="butt" style="stroke:'+col+';opacity:'+op+'" stroke-dasharray="'+(C*(e-s)-2).toFixed(1)+' '+C.toFixed(1)+'" stroke-dashoffset="'+(-C*s).toFixed(1)+'" transform="rotate(-90 '+S/2+' '+S/2+')"/>'};
  var h='<svg viewBox="0 0 '+S+' '+S+'" style="width:'+S+'px;height:'+S+'px"><circle cx="'+S/2+'" cy="'+S/2+'" r="'+R+'" fill="none" stroke="rgba(var(--fgr),.08)" stroke-width="10"/>';
  h+=seg(1,o.plen,CYROSE,1);
  if(!CY.hc){h+=seg(o.plen+1,o.ovDay-2,'var(--ac)',.35)+seg(o.ovDay-1,o.ovDay+1,'var(--ac)',1,12)+seg(o.ovDay+2,len-5,'var(--ac)',.6)+seg(len-4,len,'var(--ac)',.8)}
  if(o.day){var dd=Math.min(o.day,len),a=((dd-.5)/len)*Math.PI*2-Math.PI/2,x=S/2+R*Math.cos(a),y=S/2+R*Math.sin(a);
    h+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="9" style="fill:rgb(var(--bgr));stroke:var(--t)" stroke-width="3"/>'}
  return h+'</svg>';
}
function cyCenter(o){
  if(!o.last){return '<small>Cycle</small><b>—</b>'}
  return '<small>Jour</small><b>'+o.day+'</b><em>'+(o.late?o.late+' j de retard':o.ph==='regles'?'Règles':o.toNext>0?'Règles dans '+o.toNext+' j':'Règles attendues')+'</em>';
}

/* ---------- carte de l'onglet Semaine ---------- */
function cyCard(){
  var o=cyStats(),P=cyPhase(o),t=o.today,td=CY.days[t];
  if(!o.last){return '<div class="sth"><h2>Ton cycle 🌸</h2></div><div class="g cyc tap" onclick="openCycle()"><div class="lab">Commence ton suivi</div><div class="note" style="margin:6px 0 14px;line-height:1.5">Note le premier jour de tes dernières règles : Forme estime ensuite ta phase et adapte ses conseils.</div><button class="g pill on" style="width:100%;padding:13px" onclick="event.stopPropagation();openCycle(1)">Noter mes dernières règles</button></div>'}
  return '<div class="sth"><h2>Ton cycle 🌸</h2><span class="note">'+(CY.hc?'Saignements':'Estimation')+'</span></div>'+
   '<div class="g cyc tap" onclick="openCycle()"><div class="cyw"><div class="cyr">'+cyRing(o,128)+'<div class="cyrc">'+cyCenter(o)+'</div></div>'+
   '<div style="min-width:0"><div class="cyph"'+(o.ph==='regles'?' style="color:'+CYROSE+'"':'')+'>'+P.e+' '+P.n+'</div>'+(P.sub?'<div class="note">'+P.sub+'</div>':'')+
   '<div class="note" style="margin-top:8px;line-height:1.45">'+P.d+'</div></div></div>'+
   '<div class="cytip">'+P.t[new Date().getDate()%P.t.length]+'</div>'+(P.w?'<div class="note cyw8">⚖️ '+P.w+'</div>':'')+
   '<div class="glbt" style="margin-top:12px">'+(td&&td.f>0?'<button class="g pill" onclick="event.stopPropagation();openCycle(0,\''+t+'\')">🩸 Règles : '+CYFLOW[td.f].toLowerCase()+'</button>':'<button class="g pill on" onclick="event.stopPropagation();cyQuick()">🩸 J’ai mes règles aujourd’hui</button>')+
   '<button class="g pill" onclick="event.stopPropagation();openCycle(0,\''+t+'\')">Mon ressenti</button></div></div>';
}
function cyQuick(){var t=cyToday(),d=CY.days[t]||{};d.f=d.f||2;CY.days[t]=d;cySave();toast('🩸 Règles notées pour aujourd’hui');cyRefresh()}
function cyRefresh(){if(TAB==='week'&&D){renderWeek()}if(TAB==='moi'){renderMoi()}var s=$('#cypg');if(s){cyRender()}}

/* ---------- page complète ---------- */
function openCycle(first,day){
  CYSEL=day||null;var o=cyStats();CYM=(day||o.today).slice(0,7);
  if(first&&!o.last){CYSEL=o.today}
  openSh('<div id="cypg"></div>');document.body.classList.add('full');cyRender(first&&!o.last);
}
function cyRender(first){
  var el=$('#cypg');if(!el){return}var o=cyStats(),P=cyPhase(o);
  var h='<div class="sh-h"><div class="big" style="font-size:28px;margin:0">Ton cycle 🌸</div><button class="gb" onclick="closeSh()" aria-label="Fermer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>';
  if(first){h+='<div class="g" style="margin-bottom:14px"><div class="lab">Pour commencer</div><div class="note" style="margin-top:6px;line-height:1.5">Touche dans le calendrier le premier jour de tes dernières règles, puis indique le flux. Tu peux ajouter les jours suivants de la même façon.</div></div>'}
  if(o.last&&P){
    h+='<div class="g"><div class="cyw"><div class="cyr">'+cyRing(o,150)+'<div class="cyrc">'+cyCenter(o)+'</div></div><div style="min-width:0"><div class="cyph"'+(o.ph==='regles'?' style="color:'+CYROSE+'"':'')+'>'+P.e+' '+P.n+'</div>'+(P.sub?'<div class="note">'+P.sub+'</div>':'')+'<div class="note" style="margin-top:8px;line-height:1.45">'+P.d+'</div></div></div>'+
      '<ul class="cyul">'+P.t.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>'+(P.w?'<div class="note cyw8">⚖️ '+P.w+'</div>':'')+'</div>';
    h+='<div class="cyst">'+[
      [CY.hc?'Prochains saignements':'Prochaines règles',o.late?o.late+' j de retard':cyShort(o.next)],
      ['Cycle moyen',o.len+' jours'+(CY.len?' (fixé)':o.lens.length?'':' (par défaut)')],
      ['Règles',o.plen+' jours']].concat(CY.hc||o.late?[]:[['Ovulation estimée',o.ov<o.today?'passée ('+cyShort(o.ov)+')':cyShort(o.ov)]]).map(function(x){return '<div class="g"><span class="note">'+x[0]+'</span><b>'+x[1]+'</b></div>'}).join('')+'</div>';
  }
  h+=cyAlerts(o);
  h+='<h2 style="margin-top:22px">Calendrier</h2><div class="g cycal">'+cyCal(o)+'</div>';
  h+='<div id="cyday">'+(CYSEL?cyDayHtml(CYSEL):'<div class="note" style="text-align:center;margin:12px 0">Touche un jour pour noter tes règles ou ton ressenti.</div>')+'</div>';
  if(o.P.length){h+='<h2 style="margin-top:22px">Tes derniers cycles</h2><div class="g">'+o.P.slice(-6).reverse().map(function(p,i,a){var nx=o.P[o.P.indexOf(p)+1];return '<div class="cyhist"><span>'+cyShort(p.s)+'</span><span class="note">Règles '+p.n+' j</span><b>'+(nx?cyDiff(p.s,nx.s)+' j':'en cours')+'</b></div>'}).join('')+'</div>'}
  h+='<h2 style="margin-top:22px">Réglages du suivi</h2>'+
    '<div class="g setrow"><div><b style="font-weight:600">Contraception hormonale</b><div class="note">Pilule, implant, stérilet hormonal… : Forme ne calcule plus de phases</div></div><button class="sw'+(CY.hc?' on':'')+'" onclick="CY.hc=!CY.hc;cySave();this.classList.toggle(\'on\',CY.hc);cyRefresh()" aria-label="Contraception hormonale"><i></i></button></div>'+
    '<div class="g setrow"><div><b style="font-weight:600">Durée de ton cycle</b><div class="note">'+(CY.len?'Fixée à la main':'Calculée d’après tes règles notées')+'</div></div><div class="g obst cyst2"><button onclick="cyLen(-1)" aria-label="Moins">−</button><b>'+o.len+'</b><button onclick="cyLen(1)" aria-label="Plus">+</button></div></div>'+
    (CY.len?'<button class="g pill" style="width:100%;padding:12px;margin-bottom:12px" onclick="CY.len=null;cySave();cyRender()">Revenir au calcul automatique</button>':'')+
    '<div class="note" style="line-height:1.55;margin:16px 4px">🔒 Ton suivi reste uniquement sur ce téléphone.<br>Ces estimations sont des repères pour adapter ton entraînement : ce n’est <b>ni un moyen de contraception, ni un avis médical</b>. Chaque corps réagit différemment, fie-toi d’abord à ton ressenti.</div>'+
    '<button class="g pill" style="width:100%;padding:12px" onclick="cyOff()">Désactiver le suivi du cycle</button>';
  el.innerHTML=h;
}
function cyAlerts(o){
  var a=[],tooLong=o.P.slice(-3).some(function(p){return p.n>7}),fast=PROF&&PROF.objectif==='seche';
  if(o.late>=7){a.push('Tes règles ont '+o.late+' jours de retard. Ça arrive (stress, sport, sommeil, perte de poids…). Si ça dure ou t’inquiète, parles-en à un médecin ou une sage-femme.'+(fast?' Une sèche trop rapide ou des calories trop basses peuvent aussi dérégler le cycle : ralentis si besoin.':''))}
  if(tooLong){a.push('Des règles de plus de 7 jours, très abondantes ou très douloureuses méritent d’en parler à un médecin ou une sage-femme.')}
  if(o.irr){a.push('Ton cycle varie beaucoup d’un mois à l’autre : les prévisions sont moins précises.')}
  return a.length?'<div class="g cyal">'+a.map(function(x){return '<div class="note">'+x+'</div>'}).join('')+'</div>':'';
}
function cyLen(d){var o=cyStats();CY.len=Math.max(18,Math.min(60,o.len+d));cySave();cyRender()}
function cyOff(){if(!PROF){return}PROF.cycle='non';profSave();profPush();closeSh();toast('Suivi du cycle désactivé · tu peux le réactiver dans Réglages');cyRefresh()}
function cyToggle(btn){if(!PROF){return}PROF.cycle=PROF.cycle==='oui'?'non':'oui';profSave();profPush();if(btn){btn.classList.toggle('on',PROF.cycle==='oui')}cyRefresh()}
function cySetRow(){if(!PROF||PROF.sexe!=='f'){return ''}return '<div class="g setrow"><div><b style="font-weight:600">Suivi du cycle 🌸</b><div class="note">Phase du cycle et conseils adaptés, dans Semaine et Moi</div></div><button class="sw'+(PROF.cycle==='oui'?' on':'')+'" onclick="cyToggle(this)" aria-label="Suivi du cycle"><i></i></button></div>'}

/* calendrier du mois : règles notées, règles prévues (pointillés), ovulation estimée */
function cyCal(o){
  var p=CYM.split('-'),y=+p[0],m=+p[1]-1,first=new Date(y,m,1,12),nd=new Date(y,m+1,0).getDate(),off=(first.getDay()+6)%7,t=o.today;
  var pred={},ovs={};
  if(o.last){for(var c=0;c<4;c++){var st=cyAdd(o.last.s,o.len*(c+1));if(o.late&&c===0){st=cyAdd(t,1)}for(var j=0;j<o.plen;j++){pred[cyAdd(st,j)]=1}if(!CY.hc){ovs[cyAdd(o.last.s,o.len*c+o.len-14)]=1}}}
  var h='<div class="cyhd"><button class="gb" onclick="cyMonth(-1)" aria-label="Mois précédent"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button><b>'+first.toLocaleDateString('fr-FR',{month:'long',year:'numeric'})+'</b><button class="gb" onclick="cyMonth(1)" aria-label="Mois suivant"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button></div>';
  h+='<div class="cygrid">'+['L','M','M','J','V','S','D'].map(function(x){return '<span class="cyw0">'+x+'</span>'}).join('');
  for(var i=0;i<off;i++){h+='<span></span>'}
  for(var d=1;d<=nd;d++){var k=y+'-'+('0'+(m+1)).slice(-2)+'-'+('0'+d).slice(-2),x=CY.days[k],cl='cyd';
    if(x&&x.f>0){cl+=' per f'+x.f}else if(pred[k]&&k>t){cl+=' pred'}
    if(ovs[k]&&!(x&&x.f>0)){cl+=' ov'}if(k===t){cl+=' td'}if(k===CYSEL){cl+=' sel'}if(k>t){cl+=' fut'}
    if(x&&((x.s&&x.s.length)||x.e)){cl+=' lg'}
    h+='<button class="'+cl+'" onclick="cyPick(\''+k+'\')">'+d+'</button>'}
  h+='</div><div class="cyleg"><span><i class="per"></i>Règles</span><span><i class="pred"></i>Prévues</span>'+(CY.hc?'':'<span><i class="ov"></i>Ovulation estimée</span>')+'<span><i class="lg"></i>Ressenti noté</span></div>';
  return h;
}
function cyMonth(d){var p=CYM.split('-'),x=new Date(+p[0],+p[1]-1+d,1,12);CYM=cyKey(x).slice(0,7);var c=$('#cypg .cycal');if(c){c.innerHTML=cyCal(cyStats())}}
function cyPick(k){if(k>cyToday()){toast('Tu pourras noter ce jour quand il arrivera');return}CYSEL=k;cyRender();var d=$('#cyday');if(d){d.scrollIntoView({behavior:'smooth',block:'center'})}}
function cyDayHtml(k){
  var x=CY.days[k]||{f:0,s:[],e:0};
  return '<div class="g cydy"><div class="lab" style="text-transform:none">'+cyNice(k).replace(/^./,function(c){return c.toUpperCase()})+'</div>'+
   '<div class="note" style="margin:12px 2px 8px">Règles</div><div class="cych">'+CYFLOW.map(function(l,i){return '<button class="g pill'+((x.f||0)===i?' on':'')+'" onclick="cySet(\''+k+'\',\'f\','+i+')">'+(i?'🩸'.repeat(i)+' ':'')+l+'</button>'}).join('')+'</div>'+
   '<div class="note" style="margin:14px 2px 8px">Énergie</div><div class="cych">'+[1,2,3].map(function(i){return '<button class="g pill'+(x.e===i?' on':'')+'" onclick="cySet(\''+k+'\',\'e\','+i+')">'+CYEN[i]+'</button>'}).join('')+'</div>'+
   '<div class="note" style="margin:14px 2px 8px">Ressenti</div><div class="cych">'+CYSYM.map(function(s){return '<button class="g pill'+((x.s||[]).indexOf(s)>=0?' on':'')+'" onclick="cySym(\''+k+'\',\''+s.replace(/'/g,'\\\'')+'\')">'+s+'</button>'}).join('')+'</div></div>';
}
function cySet(k,f,v){var x=CY.days[k]||{f:0,s:[],e:0};x[f]=(f==='e'&&x.e===v)?0:v;CY.days[k]=x;cyClean(k);cySave();if(navigator.vibrate){navigator.vibrate(6)}var y=$('#sh').scrollTop;cyRender();$('#sh').scrollTop=y;if(TAB==='week'&&D){renderWeek()}}
function cySym(k,s){var x=CY.days[k]||{f:0,s:[],e:0};x.s=x.s||[];var i=x.s.indexOf(s);if(i>=0){x.s.splice(i,1)}else{x.s.push(s)}CY.days[k]=x;cyClean(k);cySave();var y=$('#sh').scrollTop;cyRender();$('#sh').scrollTop=y}
function cyClean(k){var x=CY.days[k];if(x&&!x.f&&!x.e&&!(x.s&&x.s.length)){delete CY.days[k]}}

/* ---------- branchements dans l'appli ---------- */
/* Semaine : la carte se place juste après « Aujourd'hui » */
var _cyWeek=renderWeek;renderWeek=function(){_cyWeek.apply(this,arguments);if(!cyOn()){return}var c0=$('#c0');if(!c0){return}var d=c0.nextElementSibling;var w=document.createElement('div');w.id='cyslot';w.innerHTML=cyCard();(d||c0).after(w)};
/* Moi : une diapositive « Cycle » dans le carrousel */
function cyMoiSlide(){var o=cyStats(),P=cyPhase(o);
  return '<div class="g slide"><div class="mch">Cycle 🌸</div>'+(o.last&&P?'<div class="cyw"><div class="cyr">'+cyRing(o,120)+'<div class="cyrc">'+cyCenter(o)+'</div></div><div style="min-width:0"><div class="cyph">'+P.e+' '+P.n+'</div><div class="note" style="margin-top:6px;line-height:1.45">'+P.d+'</div></div></div>':'<div class="note" style="line-height:1.5;margin-bottom:14px">Note tes règles pour connaître ta phase et recevoir des conseils adaptés.</div>')+
   '<button class="g pill on" style="width:100%;padding:13px;margin-top:14px" onclick="openCycle('+(o.last?0:1)+')">Ouvrir mon suivi</button></div>'}
/* Accueil : la question n'apparaît que si « Femme » est choisi */
OPT.cycle={oui:'Oui',non:'Non, merci'};
PF.splice(PF.length-1,0,['cycle','Suivi du cycle']);
var _cyOB5=OBS[5];OBS[5]=function(){var h=_cyOB5();if(OB.p.sexe!=='f'){return h}
  return h+'<div class="lab" style="margin:16px 4px 8px">Suivre ton cycle 🌸</div><div class="obg2">'+chip('cycle','oui','Oui','Phases et conseils adaptés')+chip('cycle','non','Non, merci')+'</div><p class="obp" style="font-size:12px;margin-top:10px">Ça reste privé, sur ton téléphone. Tu pourras changer d’avis dans les réglages.</p>'};

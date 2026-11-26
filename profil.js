/* Forme · profil.js · Accueil et profil, conseil du jour, trophées, silhouette 3D, niveaux */
/* =====================================================================
   Accueil (premier lancement), profil, cibles proposées, conseil du jour
   ===================================================================== */
var PROF=null;try{PROF=JSON.parse(localStorage.getItem('forme_profile')||'null')}catch(e){PROF=null}
var PF=[['prenom','Prénom'],['sexe','Sexe'],['age','Âge'],['taille','Taille (cm)'],['poids','Poids de départ (kg)'],['objectif','Objectif'],['experience','Expérience en musculation'],['seances','Séances par semaine'],['sommeil','Sommeil habituel'],['activite','Activité au quotidien'],['alimentation','Alimentation'],['eau','Eau bue par jour'],['c_poids','Cible poids (kg)'],['c_prot','Cible protéines (g/jour)'],['c_eau','Cible eau (L/jour)'],['c_sommeil','Cible sommeil (h/nuit)'],['c_kcal','Cible calories (kcal/jour)'],['parcours','Parcours (étapes de poids)'],['vo2','VO2 max (tests et montre)'],['peau','Peau (bilan Glow up)'],['maj','Mis à jour le']];
var OPT={sexe:{h:'Homme',f:'Femme'},objectif:{seche:'Perdre du gras',masse:'Prendre du muscle',recompo:'Les deux',forme:'Être en forme'},
  experience:{'0':'Jamais','1':'Moins d’un an','2':'1 à 3 ans','3':'Plus de 3 ans'},sommeil:{'<6':'Moins de 6 h','6-7':'6 à 7 h','7-8':'7 à 8 h','8+':'8 h et plus'},
  activite:{assis:'Plutôt assis',debout:'Plutôt debout',physique:'Physique'},alimentation:{feeling:'Au feeling',equilibre:'Plutôt équilibrée',compte:'Je compte tout'},eau:{'<1':'Moins d’1 L','1-2':'1 à 2 L','2-3':'2 à 3 L','3+':'3 L et plus'}};
var OB={step:0,p:{}};
function profSave(){try{localStorage.setItem('forme_profile',JSON.stringify(PROF))}catch(e){}}
function profRows(){return PF.map(function(k){var v=PROF[k[0]];v=v==null?'':OPT[k[0]]&&OPT[k[0]][v]?OPT[k[0]][v]:String(v);return[k[0],k[1],v]})}
function profPush(){if(!PROF||!live()||gs()){return Promise.resolve(false)}return call('profil',null,{data:JSON.stringify(profRows())}).then(function(){return true}).catch(function(){return false})}
function profFromRows(v){
  var p={done:1},rev={};Object.keys(OPT).forEach(function(k){rev[k]={};Object.keys(OPT[k]).forEach(function(c){rev[k][OPT[k][c]]=c})});
  (v||[]).slice(1).forEach(function(r){var k=String(r[0]||'').trim(),val=String(r[2]==null?'':r[2]).trim();if(!k){return}p[k]=rev[k]&&rev[k][val]!=null?rev[k][val]:val});
  return p.prenom||p.poids?p:null;
}
function loadProfileSheet(){
  if(!live()||gs()){return Promise.resolve()}
  return call('sheet','Profil').then(function(d){var p=profFromRows(d.values);if(p&&(!PROF||!PROF.maj||(p.maj||'')>=(PROF.maj||''))){PROF=p;profSave();if(p.prenom){try{localStorage.setItem('forme_name',p.prenom)}catch(e){}}}}).catch(function(){});
}
function applyProfile(){
  if(!D||!PROF){return}var t=D.targets,n=function(x){var v=pn(x);return v!=null&&v>0?v:null};
  t.weight=n(PROF.c_poids)||t.weight;t.prot=n(PROF.c_prot)||t.prot;t.water=n(PROF.c_eau)||t.water;t.sleep=n(PROF.c_sommeil)||t.sleep;t.kcal=n(PROF.c_kcal)||t.kcal;
}
function r5(x,s){return Math.round(x/s)*s}
function propose(p){
  var w=pn(p.poids)||75,h=pn(p.taille)||175,a=pn(p.age)||25,se=pn(p.seances)||3;
  var bmr=10*w+6.25*h-5*a+(p.sexe==='f'?-161:5),act=({assis:1.3,debout:1.45,physique:1.6}[p.activite]||1.4)+Math.min(7,se)*.035;
  var kcal=r5(bmr*act*({seche:.82,masse:1.08,recompo:.95,forme:1}[p.objectif]||1),50);
  var prot=r5(w*({seche:2,masse:1.8,recompo:2,forme:1.6}[p.objectif]||1.8),5);
  var eau=Math.max(2,r5(w*.035+se*.1,.25)),som=a<26?8:7.5;
  var cp=D&&D.targets&&D.targets.weight?D.targets.weight:w;
  if(p.objectif==='seche'&&cp>=w){cp=r5(w*.95,.5)}if(p.objectif==='masse'&&cp<=w){cp=r5(w*1.05,.5)}if(p.objectif==='forme'||p.objectif==='recompo'){cp=cp||w}
  return{c_poids:cp,c_prot:prot,c_eau:eau,c_sommeil:som,c_kcal:kcal};
}
function openOB(step){
  var lw=D&&D.weights&&D.weights.length?D.weights[0].v:null;
  OB.p=Object.assign({prenom:uname().trim(),poids:lw?String(lw).replace('.',','):''},PROF||{});OB.step=step||0;
  var el=$('#ob');if(!el){el=document.createElement('div');el.id='ob';document.body.appendChild(el)}
  el.className='';void el.offsetWidth;el.className='on';document.body.classList.add('obo');obRender();
}
function closeOB(){var el=$('#ob');if(!el){return}el.className='out';document.body.classList.remove('obo');setTimeout(function(){el.className=''},700)}
function obSet(k,v){OB.p[k]=v;obRender()}
function obIn(k,el){OB.p[k]=el.value}
function chip(k,v,lab,sub){return '<button class="g obc'+(String(OB.p[k])===String(v)?' on':'')+'" onclick="obSet(\''+k+'\',\''+v+'\')">'+lab+(sub?'<small>'+sub+'</small>':'')+'</button>'}
function obField(k,lab,unit,ph){return '<label class="obf"><span>'+lab+'</span><div class="g obi"><input inputmode="decimal" value="'+esc(OB.p[k]||'')+'" placeholder="'+(ph||'')+'" oninput="obIn(\''+k+'\',this)"><em>'+unit+'</em></div></label>'}
var OBS=[
 function(){return '<div class="obhero"><div class="oblogo"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="44" fill="none" stroke="rgba(var(--fgr),.12)" stroke-width="10"/><circle cx="60" cy="60" r="44" fill="none" stroke="var(--t)" stroke-width="10" stroke-linecap="round" stroke-dasharray="276" stroke-dashoffset="60" transform="rotate(-90 60 60)" class="oblr"/><circle cx="60" cy="60" r="7" fill="var(--t)"/></svg></div><h2 class="obt">Bienvenue sur Forme</h2><p class="obp">Ton entraînement, ta récupération et ta nutrition au même endroit. Quelques questions pour adapter l’appli à toi : ça prend une minute.</p></div>'},
 function(){return '<h2 class="obt">Comment tu t’appelles ? 👋</h2><p class="obp">C’est comme ça que Forme te dira bonjour.</p><div class="g obi big"><input id="obn" autocomplete="given-name" value="'+esc(OB.p.prenom||'')+'" placeholder="Ton prénom" oninput="obIn(\'prenom\',this)"></div>'},
 function(){return '<h2 class="obt">Parle-moi de toi</h2><p class="obp">Ça sert à calculer tes niveaux de force et tes besoins.</p><div class="obg2">'+chip('sexe','h','Homme')+chip('sexe','f','Femme')+'</div><div class="obg3">'+obField('age','Âge','ans','20')+obField('taille','Taille','cm','175')+obField('poids','Poids','kg','75')+'</div>'},
 function(){return '<h2 class="obt">Ton objectif principal 🎯</h2><p class="obp">Tu pourras le changer quand tu veux.</p><div class="obg1">'+chip('objectif','seche','🔥 Perdre du gras','Affiner la silhouette en gardant le muscle')+chip('objectif','masse','💪 Prendre du muscle','Gagner en volume et en force')+chip('objectif','recompo','⚖️ Les deux','Perdre du gras et prendre du muscle en même temps')+chip('objectif','forme','🌿 Être en forme','Bouger, mieux dormir, se sentir bien')+'</div>'},
 function(){var s=pn(OB.p.seances)||3;return '<h2 class="obt">Ton expérience 🏋️</h2><p class="obp">Depuis combien de temps tu fais de la musculation ?</p><div class="obg2">'+chip('experience','0','Jamais')+chip('experience','1','Moins d’un an')+chip('experience','2','1 à 3 ans')+chip('experience','3','Plus de 3 ans')+'</div><div class="lab" style="margin:22px 4px 10px">Séances par semaine</div><div class="g obst"><button onclick="obSet(\'seances\','+Math.max(1,s-1)+')">−</button><b>'+s+'</b><button onclick="obSet(\'seances\','+Math.min(7,s+1)+')">+</button></div>'},
 function(){function row(k,lab){return '<div class="lab" style="margin:16px 4px 8px">'+lab+'</div><div class="obg2">'+Object.keys(OPT[k]).map(function(v){return chip(k,v,OPT[k][v])}).join('')+'</div>'}
   return '<h2 class="obt">Tes habitudes 🌙</h2><p class="obp">Pour te donner des conseils qui te ressemblent.</p>'+row('sommeil','Tu dors en général')+row('activite','Au quotidien, tu es')+row('alimentation','Ton alimentation')+row('eau','Tu bois par jour')},
 function(){var pr=propose(OB.p);['c_poids','c_prot','c_eau','c_sommeil','c_kcal'].forEach(function(k){if(OB.p[k]==null||OB.p[k]===''){OB.p[k]=String(pr[k]).replace('.',',')}});
   return '<h2 class="obt">Tes cibles ✨</h2><p class="obp">Calculées d’après tes réponses. Ajuste-les si tu veux : ce sont des repères, pas des règles.</p><div class="obg2 obtg">'+obField('c_poids','Poids visé','kg')+obField('c_prot','Protéines','g / jour')+obField('c_kcal','Calories','kcal / jour')+obField('c_eau','Eau','L / jour')+obField('c_sommeil','Sommeil','h / nuit')+'</div><p class="obp" style="font-size:12px;margin-top:14px">Les calories sont estimées avec une formule standard (Mifflin-St Jeor) et ton activité : affine-les selon l’évolution de ton poids.</p>'}
];
function obValid(){
  var p=OB.p;if(OB.step===1&&!String(p.prenom||'').trim()){return 'Écris ton prénom'}
  if(OB.step===2){if(!p.sexe){return 'Choisis homme ou femme'}if(!pn(p.age)||!pn(p.taille)||!pn(p.poids)){return 'Remplis ton âge, ta taille et ton poids'}}
  if(OB.step===3&&!p.objectif){return 'Choisis un objectif'}if(OB.step===4&&p.experience==null){return 'Choisis ton expérience'}return ''}
function obRender(){
  var el=$('#ob'),n=OBS.length,last=OB.step===n-1;if(OB.p.seances==null){OB.p.seances=3}
  el.innerHTML='<div class="obtop">'+(OB.step?'<button class="gb" onclick="obGo(-1)" aria-label="Retour"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>':'<span></span>')+'<div class="obpr"><i style="width:'+(OB.step/(n-1)*100)+'%"></i></div>'+(PROF&&PROF.done?'<button class="gb" onclick="closeOB()" aria-label="Fermer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>':'<span></span>')+'</div>'+
    '<div class="obs" key="'+OB.step+'">'+OBS[OB.step]()+'</div><div class="obbot"><div class="note tko" id="obe"></div><button class="obgo" onclick="obGo(1)">'+(OB.step===0?'Commencer':last?'C’est parti 🚀':'Continuer')+'</button></div>';
  var i=$('#obn');if(i&&!OB.p.prenom){setTimeout(function(){i.focus()},400)}
}
function obGo(d){
  if(d>0){var e=obValid();if(e){$('#obe').textContent=e;return}}
  if(d>0&&OB.step===OBS.length-1){finishOB();return}
  OB.step=Math.max(0,Math.min(OBS.length-1,OB.step+d));OB.dir=d;obRender();
}
function finishOB(){
  var p=OB.p;['age','taille','poids','seances','c_poids','c_prot','c_eau','c_sommeil','c_kcal'].forEach(function(k){var v=pn(p[k]);if(v!=null){p[k]=v}});
  PROF=Object.assign({},p,{done:1,maj:todayKey()});profSave();
  try{localStorage.setItem('forme_name',String(PROF.prenom).trim())}catch(e){}
  if(PROF.taille&&!mesLatest().h){MES.push({date:todayKey(),h:PROF.taille});saveMesLocal()}
  applyProfile();if(D){renderWeek();renderForce();if(!live()){demoBanner()}}setHead();paintAvatar();
  closeOB();
  profPush().then(function(ok){toast(ok?'Profil enregistré dans ta feuille ✓':'Profil enregistré ✓')});
  setTimeout(function(){if(window.computeTrophies){computeTrophies()}},900);
}

/* ---------- Conseil du jour ---------- */
function tipOfDay(){
  if(!D){return null}var w=D.week,t=D.targets,p=PROF||{},L=[];
  var sl=avg(w.sleep.filter(function(x){return x==null||x<=12})),pr=avg(w.prot),wa=avg(w.water),so=avg(w.sodium),st=sum(w.stim);
  var z=w.muscles.filter(function(m){return m.s===0}).map(function(m){return m.n}),ses=w.stim.filter(function(x){return x>0}).length,dow=(new Date().getDay()+6)%7;
  if(sl!=null&&sl<t.sleep){L.push([9,'😴','Tu dors '+hm(sl)+' en moyenne cette semaine. Viser '+f(t.sleep)+' h, c’est souvent le levier le plus simple pour mieux récupérer et progresser : essaie de te coucher 20 minutes plus tôt ce soir.'])}
  if(pr!=null&&pr<t.prot*.9){L.push([8,'🥩','Tu es à '+f(pr)+' g de protéines par jour pour une cible de '+f(t.prot)+' g. Ajouter une source à chaque repas (œufs, skyr, poulet, thon, légumineuses) suffit souvent à combler l’écart.'])}
  if(so!=null&&so>t.sodium){L.push([7,'🧂','Ton sodium dépasse le plafond ('+f(so)+' mg/jour). Les plats préparés, charcuteries et sauces en apportent beaucoup : en remplacer un par jour fait déjà la différence.'])}
  if(wa!=null&&wa<t.water*.8){L.push([6,'💧','Tu bois '+f(wa,1)+' L par jour pour une cible de '+f(t.water,1)+' L. Une gourde toujours à portée de main aide énormément.'])}
  if(z.length&&dow>=3){L.push([5,'💪',z.slice(0,3).join(', ')+(z.length>1?' n’ont':' n’a')+' pas encore été travaillé'+(z.length>1?'s':'')+' cette semaine. Une ou deux séries suffisent pour garder le muscle stimulé.'])}
  if(p.seances&&ses<p.seances&&dow>=4){L.push([4,'📅',ses+' séance'+(ses>1?'s':'')+' sur les '+p.seances+' prévues cette semaine. Il reste '+(7-dow)+' jour'+(7-dow>1?'s':'')+' : une séance courte vaut mieux que pas de séance.'])}
  var gen=[['🔁','Note tes charges et ton RIR à chaque série : c’est ce qui permet à Forme de suivre ta progression et de débloquer tes trophées.'],['🧘','La récupération fait partie de l’entraînement : un jour de repos après une grosse séance, c’est là que le muscle se reconstruit.'],['📈','Pour progresser, ajoute un peu de charge ou une répétition chaque semaine sur tes exercices principaux, sans sacrifier la technique.'],['🍽️','Répartir tes protéines sur 3 ou 4 repas aide à mieux les utiliser qu’un seul gros repas.'],['🚶','Les pas comptent aussi : une marche de 20 minutes après le repas aide la digestion et la dépense quotidienne.']];
  if(p.objectif==='seche'){gen.push(['🔥','En sèche, garde des charges lourdes à la salle : c’est ce qui dit à ton corps de garder le muscle pendant que le gras part.'])}
  if(p.objectif==='masse'){gen.push(['🍚','En prise de muscle, vise une prise de poids lente (environ 0,25 à 0,5 kg par mois) pour limiter le gras.'])}
  if(p.experience==='0'||p.experience==='1'){gen.push(['🎯','Au début, la technique avant la charge : filme-toi de profil sur une série pour vérifier ton mouvement.'])}
  if(!L.length){var g=gen[Math.floor(Date.now()/864e5)%gen.length];return{e:g[0],t:g[1],ok:1}}
  L.sort(function(a,b){return b[0]-a[0]});var top=L.slice(0,2),pk=top[Math.floor(Date.now()/864e5)%top.length];return{e:pk[1],t:pk[2]};
}
function renderTip(){var el=$('#tip'),T=tipOfDay();if(!el||!T){return}el.innerHTML='<div class="g tipc"><div class="tipe">'+T.e+'</div><div><div class="lab">Conseil du jour 💡</div><div class="tipt">'+esc(T.t)+'</div></div></div>'}

/* =====================================================================
   Niveaux par exercice et trophées
   ===================================================================== */
var LVN=['Débutant','Novice','Intermédiaire','Avancé','Élite'],LVCOL=['rgba(var(--fgr),.35)','color-mix(in srgb,var(--act) 40%,#8E939C)','color-mix(in srgb,var(--act) 70%,#8E939C)','var(--act)','var(--acs)'];
var LVR={bench:[.6,1,1.4,1.8],squat:[.9,1.3,1.8,2.3],hinge:[1.1,1.6,2.1,2.6],ohp:[.4,.65,.85,1.05],row:[.55,.85,1.15,1.45],pull:[.55,.85,1.1,1.35],curl:[.3,.5,.7,.9]};
function isMach(n){return /machine|smith|guid|poulie|c[âa]ble|presse|chest press/i.test(n||'')}
function bodyW(){return D&&D.weights&&D.weights.length?D.weights[0].v:PROF&&pn(PROF.poids)||75}
function liftLevel(x){
  if(!x||x.rm==null){return null}var k=exKind(x.n,x.g),th=null,fem=PROF&&PROF.sexe==='f',bw=bodyW();
  if(!isMach(x.n)&&LVR[k]){var m=fem?(k==='squat'||k==='hinge'?.7:.6):1;th=LVR[k].map(function(r){return r*bw*m})}
  else if(x.std){th=[.6,.85,1.15,1.45].map(function(r){return r*x.std})}
  if(!th){return null}var i=0;while(i<4&&x.rm>=th[i]){i++}
  var lo=i?th[i-1]:0,hi=i<4?th[i]:th[3];
  return{i:i,name:LVN[i],next:i<4?LVN[i+1]:null,need:i<4?th[i]-x.rm:0,frac:i<4?Math.max(0,Math.min(1,(x.rm-lo)/(hi-lo))):1,th:th,rel:!isMach(x.n)&&!!LVR[k]};
}
function lvlChip(L){return '<span class="lvc" style="--lc:'+LVCOL[L.i]+'">'+'<i>'+[0,1,2,3,4].map(function(j){return '<b class="'+(j<=L.i?'on':'')+'"></b>'}).join('')+'</i>'+L.name+'</span>'}

/* ---------- Trophées ---------- */
var TIER={b:{n:'Bronze',p:15},a:{n:'Argent',p:30},o:{n:'Or',p:90},p:{n:'Platine',p:300}};
var FAM=[['banc','Développé couché','🏋️','Maître du banc'],['squat','Squat','🦵','Roi du squat'],['sdt','Soulevé de terre','🧱','Colosse'],['dos','Dos','🪽','Dos en V'],['reg','Régularité','📅','Inarrêtable'],['vol','Volume','🚛','Bulldozer'],['recup','Récupération','😴','Récupération pro'],['nutri','Nutrition','🥗','Nutrition parfaite'],['corps','Corps','📐','Transformation']];
var TRR={r:null,m:null},TRL=[],TRQ=[],TRBusy=false;
function weekOf(k){var d=new Date(k+'T12:00:00');return addDays(k,-((d.getDay()+6)%7))}
function trStats(r,m){
  var t=D?D.targets:{sleep:7,prot:160,sodium:4000,weight:74},S={ses:{},ton:0,stim:0,K:{},dosSes:{},weeks:{}},bw=bodyW();
  function K(k){return S.K[k]=S.K[k]||{ses:{},maxL:0,maxE:0,maxEa:0}}
  if(m&&m.length>1){var h=m[0],c={d:colIdx(h,/^date/),e:colIdx(h,/exercice/),g:colIdx(h,/groupe/),L:colIdx(h,/charge/),R:colIdx(h,/r[ée]p/),se:colIdx(h,/s[ée]ries eff/),st:colIdx(h,/stimul/),to:colIdx(h,/tonnage/)};
    m.slice(1).forEach(function(x){var d=toKey(x[c.d]);if(!d){return}var n=String(x[c.e]||''),g=c.g>=0?String(x[c.g]||''):'',L=pn(x[c.L]),R=pn(x[c.R]),se=pn(x[c.se])||0,st=pn(x[c.st])||0,to=pn(x[c.to])||0;
      if(se>0||to>0){S.ses[d]=1;var wk=weekOf(d);S.weeks[wk]=S.weeks[wk]||{};S.weeks[wk][d]=1}S.ton+=to;S.stim+=st;
      if(!n||!(se>0||to>0)){return}var k=exKind(n,g),q=K(k);q.ses[d]=1;if(k==='pull'||k==='row'||/dos/i.test(g)){S.dosSes[d]=1;K('dos').ses[d]=1}
      if(L&&R){var e=L*(1+R/30);q.maxEa=Math.max(q.maxEa,e);if(k==='pull'||k==='row'){var qd=K('dos');qd.maxEa=Math.max(qd.maxEa,e)}if(!isMach(n)){q.maxL=Math.max(q.maxL,L);q.maxE=Math.max(q.maxE,e)}}});}
  var nS=Object.keys(S.ses).length,wks=Object.keys(S.weeks).sort(),maxW=0,run=0,best=0,prev=null;
  wks.forEach(function(w){var n=Object.keys(S.weeks[w]).length;maxW=Math.max(maxW,n);if(n>=2){run=prev&&addDays(prev,7)===w&&run?run+1:1;best=Math.max(best,run);prev=w}else{run=0;prev=w}});
  var day={};
  if(r&&r.length>1){var g=r[0],c2={d:colIdx(g,/^date/),sl:colIdx(g,/sommeil total/),p:colIdx(g,/prot/),so:colIdx(g,/sodium/),w:colIdx(g,/poids/)};
    r.slice(1).forEach(function(x){var d=toKey(x[c2.d]);if(!d){return}var o=day[d]={};['sl','p','so','w'].forEach(function(f){if(c2[f]>=0){var v=pn(x[c2[f]]);if(v!=null&&v>0){o[f]=v}}})});}
  var ds=Object.keys(day).sort();function streak(fn){var b=0,cur=0,pv=null;ds.forEach(function(d){if(fn(day[d])){cur=pv&&addDays(pv,1)===d?cur+1:1;b=Math.max(b,cur)}else{cur=0}pv=d});return b}
  function count(fn){return ds.filter(function(d){return fn(day[d])}).length}
  var slOk=function(o){return o.sl!=null&&o.sl>=t.sleep&&o.sl<=12},pOk=function(o){return o.p!=null&&o.p>=t.prot},soOk=function(o){return o.so!=null&&o.so<=t.sodium};
  var ws=[];ds.forEach(function(d){if(day[d].w){ws.push(day[d].w)}});
  var start=ws.length?ws[0]:(D&&D.weights.length?D.weights[D.weights.length-1].v:pn(PROF&&PROF.poids));if(PROF&&pn(PROF.poids)&&ws.length===0){start=pn(PROF.poids)}
  var cur=bodyW(),dir=PROF&&PROF.objectif==='masse'?1:-1,goalW=t.weight;
  var sv=suivi(),span=sv.length>1?(Date.parse(sv[sv.length-1].date)-Date.parse(sv[0].date))/864e5:0;
  return{S:S,nS:nS,maxW:maxW,bestRun:best,bw:bw,slStreak:streak(slOk),slN:count(slOk),pStreak:streak(pOk),pN:count(pOk),soN:count(soOk),
    chg:start!=null&&cur!=null?(cur-start)*dir:0,cur:cur,goalW:goalW,dir:dir,goalOk:cur!=null&&goalW!=null&&(dir<0?cur<=goalW:cur>=goalW),
    prof:!!(PROF&&PROF.done),mes:MES.some(function(x){return MF.some(function(fd){return fd[0]!=='w'&&fd[0]!=='h'&&x[fd[0]]})}),ph:sv.length,phSpan:span,K:function(k){return S.K[k]||{ses:{},maxL:0,maxE:0,maxEa:0}}};
}
function trDefs(X){
  var bw=X.bw,L=[];function T(id,fam,tier,name,desc,cur,goal,unit,secret){L.push({id:id,fam:fam,tier:tier,name:name,desc:desc,cur:Math.max(0,cur||0),goal:goal,unit:unit||'',secret:!!secret})}
  var B=X.K('bench'),Q=X.K('squat'),H=X.K('hinge'),O=X.K('dos'),n=function(o){return Object.keys(o.ses).length};
  T('b1','banc','b','Premier banc','Faire ta première séance de développé couché',n(B),1);
  T('b2','banc','b','Le cap des 60','Soulever 60 kg au développé couché (barre ou haltères)',B.maxL,60,'kg');
  T('b3','banc','a','Le cap des 75','Soulever 75 kg au développé couché',B.maxL,75,'kg');
  T('b4','banc','o','Triple chiffre','Soulever 100 kg au développé couché',B.maxL,100,'kg');
  T('b5','banc','a','Poids pour poids','Développé couché estimé à ton poids de corps',B.maxE,Math.round(bw),'kg');
  T('b6','banc','o','Une fois et demie','Développé couché estimé à 1,5 fois ton poids de corps',B.maxE,Math.round(bw*1.5),'kg',1);
  T('s1','squat','b','Première descente','Faire ta première séance de squat',n(Q),1);
  T('s2','squat','b','Le cap des 80','Soulever 80 kg au squat',Q.maxL,80,'kg');
  T('s3','squat','a','Le cap des 100','Soulever 100 kg au squat',Q.maxL,100,'kg');
  T('s4','squat','o','Les 140','Soulever 140 kg au squat',Q.maxL,140,'kg');
  T('s5','squat','a','Jambes de fer','Squat estimé à 1,25 fois ton poids de corps',Q.maxE,Math.round(bw*1.25),'kg');
  T('d1','sdt','b','Premier soulevé','Faire ta première séance de soulevé de terre',n(H),1);
  T('d2','sdt','b','Le cap des 100','Soulever 100 kg au soulevé de terre',H.maxL,100,'kg');
  T('d3','sdt','a','Le cap des 140','Soulever 140 kg au soulevé de terre',H.maxL,140,'kg');
  T('d4','sdt','o','Les 180','Soulever 180 kg au soulevé de terre',H.maxL,180,'kg');
  T('d5','sdt','o','Double poids de corps','Soulevé de terre estimé à 2 fois ton poids de corps',H.maxE,Math.round(bw*2),'kg',1);
  T('o1','dos','b','Premier tirage','Faire ta première séance de dos',n(O),1);
  T('o2','dos','b','Dos régulier','10 séances avec du travail de dos',n(O),10,'séances');
  T('o3','dos','a','Tirage poids de corps','Un tirage estimé à ton poids de corps',O.maxEa,Math.round(bw),'kg');
  T('o4','dos','o','Large comme une porte','25 séances avec du travail de dos',n(O),25,'séances');
  T('r1','reg','b','Première séance','Enregistrer ta première séance',X.nS,1);
  T('r2','reg','b','Bonne semaine','3 séances dans la même semaine',X.maxW,3,'séances');
  T('r3','reg','b','Ça devient une habitude','10 séances au total',X.nS,10,'séances');
  T('r4','reg','a','Assidu','25 séances au total',X.nS,25,'séances');
  T('r5','reg','a','Machine','50 séances au total',X.nS,50,'séances');
  T('r6','reg','o','Régulier','4 semaines d’affilée avec au moins 2 séances',X.bestRun,4,'semaines');
  T('r7','reg','o','Centurion','100 séances au total',X.nS,100,'séances',1);
  T('v1','vol','b','10 tonnes','Soulever 10 tonnes au total',X.S.ton/1000,10,'t');
  T('v2','vol','a','100 tonnes','Soulever 100 tonnes au total',X.S.ton/1000,100,'t');
  T('v3','vol','o','500 tonnes','Soulever 500 tonnes au total',X.S.ton/1000,500,'t');
  T('v4','vol','a','Séries qui comptent','500 séries stimulantes au total',X.S.stim,500,'séries');
  T('c1','recup','b','Bien dormi','7 nuits d’affilée à ta cible de sommeil',X.slStreak,7,'nuits');
  T('c2','recup','a','Dormeur assidu','30 nuits à ta cible de sommeil',X.slN,30,'nuits');
  T('c3','recup','o','Sommeil de champion','21 nuits d’affilée à ta cible de sommeil',X.slStreak,21,'nuits');
  T('n1','nutri','b','Protéiné','7 jours d’affilée à ta cible de protéines',X.pStreak,7,'jours');
  T('n2','nutri','b','Sel maîtrisé','14 jours sous ton plafond de sodium',X.soN,14,'jours');
  T('n3','nutri','a','Constance','30 jours à ta cible de protéines',X.pN,30,'jours');
  T('n4','nutri','o','Discipline','30 jours d’affilée à ta cible de protéines',X.pStreak,30,'jours');
  T('p1','corps','b','Bienvenue','Compléter ton profil',X.prof?1:0,1);
  T('p2','corps','b','Premières mesures','Saisir tes mensurations',X.mes?1:0,1);
  T('p3','corps','b','Photo de départ','Ajouter ta première photo de suivi',X.ph,1);
  T('p4','corps','b','Premier kilo',X.dir<0?'Perdre ton premier kilo':'Prendre ton premier kilo',X.chg,1,'kg');
  T('p5','corps','a','Trois kilos',X.dir<0?'Perdre 3 kilos':'Prendre 3 kilos',X.chg,3,'kg');
  T('p6','corps','a','Avant / après','Deux photos de suivi à 4 semaines d’écart',X.phSpan,28,'jours');
  T('p7','corps','o','Objectif atteint','Atteindre ton poids visé',X.goalOk?1:0,1);
  FAM.forEach(function(F){var fl=L.filter(function(x){return x.fam===F[0]}),dn=fl.filter(function(x){return x.cur>=x.goal}).length;L.push({id:F[0]+'P',fam:F[0],tier:'p',name:F[3],desc:'Obtenir tous les trophées '+F[1],cur:dn,goal:fl.length,unit:'trophées'})});
  return L;
}
function trKey(){return 'forme_tr_'+(live()?'live':'demo')}
function trGet(){try{return JSON.parse(localStorage.getItem(trKey())||'{}')}catch(e){return{}}}
function computeTrophies(r,m){
  if(r!==undefined){TRR.r=r}if(m!==undefined){TRR.m=m}if(!D){return}
  TRL=trDefs(trStats(TRR.r,TRR.m));var U=trGet(),first=!U._init,nw=[];
  TRL.forEach(function(t){t.done=t.cur>=t.goal;if(t.done&&!U[t.id]){U[t.id]=todayKey();if(!first){nw.push(t)}}t.date=U[t.id]||null});
  U._init=1;try{localStorage.setItem(trKey(),JSON.stringify(U))}catch(e){}
  if(first){var n=TRL.filter(function(t){return t.done}).length;if(n){setTimeout(function(){toast('🏆 '+n+' trophée'+(n>1?'s':'')+' déjà débloqué'+(n>1?'s':'')+' !')},1200)}}
  nw.sort(function(a,b){return 'bao'.indexOf(a.tier)-'bao'.indexOf(b.tier)});nw.forEach(function(t){TRQ.push(t)});trNext();
  renderTrCard();
}
function trXP(){var xp=0;TRL.forEach(function(t){if(t.done){xp+=TIER[t.tier].p}});return{xp:xp,lvl:1+Math.floor(xp/100),pr:xp%100}}
var MGRAD={b:['#F6CDA8','#C27B47','#6B3818'],a:['#FFFFFF','#C3CAD6','#6B7484'],o:['#FFF3C4','#E9BC4C','#8A5A12'],p:['#F4FAFF','#BCD0F7','#D0BCF2']};
var MID=0;
function medal(tier,size,locked,secret){
  var g=MGRAD[tier],id='md'+(MID++),cup=secret&&locked?'<text x="24" y="31" text-anchor="middle" font-size="17" font-weight="700" fill="rgba(255,255,255,.75)">?</text>':'<path d="M17 13h14v6a7 7 0 0 1-14 0zM17 15h-3.5a3.5 3.5 0 0 0 3.5 5M31 15h3.5a3.5 3.5 0 0 1-3.5 5M24 26v5M19.5 34h9" fill="none" stroke="rgba(255,255,255,.92)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'+(tier==='p'?'<path d="M35 8l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z" fill="#fff"/>':'');
  return '<svg class="mdl'+(locked?' lk':'')+'" viewBox="0 0 48 48" style="width:'+size+'px;height:'+size+'px"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+g[0]+'"/><stop offset=".5" stop-color="'+g[1]+'"/><stop offset="1" stop-color="'+g[2]+'"/></linearGradient>'+(tier==='p'?'<linearGradient id="'+id+'b" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#9EE2D6" stop-opacity=".7"/><stop offset=".5" stop-color="#C9B5EE" stop-opacity=".0"/><stop offset="1" stop-color="#F7C6E0" stop-opacity=".7"/></linearGradient>':'')+'</defs>'+
    '<circle cx="24" cy="24" r="22" fill="url(#'+id+')"/>'+(tier==='p'?'<circle cx="24" cy="24" r="22" fill="url(#'+id+'b)"/>':'')+'<circle cx="24" cy="24" r="17.5" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1"/><path d="M8 18a17 17 0 0 1 26-10" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.6" stroke-linecap="round"/>'+cup+'</svg>';
}
function trChime(tier){try{var a=new(window.AudioContext||window.webkitAudioContext)(),notes=tier==='p'?[659,784,988,1319]:[784,1175];notes.forEach(function(fq,i){var o=a.createOscillator(),g=a.createGain(),t0=a.currentTime+i*.11;o.type='sine';o.frequency.value=fq;o.connect(g);g.connect(a.destination);g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(.18,t0+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+.6);o.start(t0);o.stop(t0+.65)})}catch(e){}if(navigator.vibrate){navigator.vibrate(tier==='p'?[60,60,60,60,160]:[40,50,80])}}
function trNext(){
  if(TRBusy||!TRQ.length){return}TRBusy=true;var t=TRQ.shift(),el=$('#trb');
  if(!el){el=document.createElement('div');el.id='trb';el.className='g';document.body.appendChild(el)}
  el.innerHTML=medal(t.tier,46)+'<div style="min-width:0"><div class="trbk">Trophée débloqué · '+TIER[t.tier].n+'</div><b>'+esc(t.name)+'</b><div class="note" style="margin:0">'+esc(t.desc)+'</div></div><em>+'+TIER[t.tier].p+' XP</em>';
  el.onclick=function(){openTrophies()};el.classList.remove('on');void el.offsetWidth;el.classList.add('on');trChime(t.tier);
  setTimeout(function(){el.classList.remove('on');setTimeout(function(){TRBusy=false;trNext()},700)},3600);
}
function renderTrCard(){
  var el=$('#trc');if(!el){return}if(!TRL.length){el.innerHTML='<div class="note">Calcul de tes trophées…</div>';return}
  var X=trXP(),cnt={b:0,a:0,o:0,p:0},tot=TRL.length,dn=0;TRL.forEach(function(t){if(t.done){cnt[t.tier]++;dn++}});
  var rec=TRL.filter(function(t){return t.done}).sort(function(a,b){return(b.date||'')<(a.date||'')?-1:1}).slice(0,3);
  var nxt=TRL.filter(function(t){return !t.done&&!t.secret&&t.tier!=='p'}).sort(function(a,b){return b.cur/b.goal-a.cur/a.goal})[0];
  el.innerHTML='<div class="trh"><div class="trlv"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="27" fill="none" class="rt" stroke-width="5"/><circle cx="32" cy="32" r="27" fill="none" style="stroke:var(--ac)" stroke-width="5" stroke-linecap="round" stroke-dasharray="169.6" stroke-dashoffset="'+(169.6*(1-X.pr/100))+'" transform="rotate(-90 32 32)"/></svg><b>'+X.lvl+'</b></div>'+
   '<div style="flex:1;min-width:0"><div class="lab">Niveau '+X.lvl+' · '+f(X.xp)+' pts</div><div class="trct">'+['p','o','a','b'].map(function(k){return '<span>'+medal(k,20)+cnt[k]+'</span>'}).join('')+'</div><div class="tr" style="margin-top:8px"><i class="g" style="width:'+(dn/tot*100)+'%"></i></div><div class="note">'+dn+' / '+tot+' trophées · '+Math.round(dn/tot*100)+' %</div></div></div>'+
   (rec.length?'<div class="trrec">'+rec.map(function(t){return '<div>'+medal(t.tier,38)+'<span>'+esc(t.name)+'</span></div>'}).join('')+'</div>':'')+
   (nxt?'<div class="g trnx"><div class="lab">Prochain trophée</div><div style="display:flex;gap:12px;align-items:center;margin-top:6px">'+medal(nxt.tier,34,true)+'<div style="flex:1;min-width:0"><b>'+esc(nxt.name)+'</b><div class="note" style="margin:0">'+esc(nxt.desc)+'</div><div class="tr"><i style="width:'+Math.min(100,nxt.cur/nxt.goal*100)+'%"></i></div><div class="note">'+trProg(nxt)+'</div></div></div></div>':'')+
   '<button class="g pill on" style="width:100%;margin-top:12px;padding:13px" onclick="openTrophies()">Voir tous les trophées</button>';
}
function trProg(t){var c=t.unit==='t'?f(t.cur,1):f(Math.min(t.cur,t.goal),t.unit==='kg'&&t.cur%1?1:0);return t.goal===1&&!t.unit?(t.done?'Obtenu':'À faire'):c+' / '+f(t.goal)+(t.unit?' '+t.unit:'')}
function openTrophies(){
  if(!TRL.length){toast('Trophées en cours de calcul…');return}
  var X=trXP(),h='<div class="sh-h"><div class="big" style="font-size:28px;margin:0">Trophées 🏆</div><button class="gb" onclick="closeSh()" aria-label="Fermer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div class="g lvh" style="margin-bottom:6px">'+lvHero(X)+'<div class="xpl"><span><b>'+f(X.cur)+'</b> / '+f(X.need)+' XP</span><span>Niveau '+(X.lvl+1)+'</span></div>'+xpBar(X.cur,X.need)+'</div>';
  FAM.forEach(function(F){
    var fl=TRL.filter(function(t){return t.fam===F[0]}),dn=fl.filter(function(t){return t.done}).length;
    h+='<div class="trfh"><b>'+F[2]+' '+F[1]+'</b><span class="note">'+dn+' / '+fl.length+'</span></div><div class="g" style="padding:4px 16px">'+fl.sort(function(a,b){return 'baop'.indexOf(a.tier)-'baop'.indexOf(b.tier)}).map(function(t){
      var hid=t.secret&&!t.done;return '<div class="trr'+(t.done?' got':'')+'">'+medal(t.tier,42,!t.done,t.secret)+'<div style="flex:1;min-width:0"><div class="trn"><b>'+(hid?'Trophée secret':esc(t.name))+'</b><small class="tt'+t.tier+'">'+TIER[t.tier].n+'</small></div><div class="note" style="margin:2px 0 0">'+(hid?'Continue, tu le découvriras.':esc(t.desc))+'</div>'+
        (t.done?'<div class="note tok" style="margin:4px 0 0">Obtenu'+(t.date?' le '+dl(t.date):'')+'</div>':hid?'':'<div class="tr"><i style="width:'+Math.min(100,t.cur/t.goal*100)+'%"></i></div><div class="note" style="margin:3px 0 0">'+trProg(t)+'</div>')+'</div></div>'}).join('')+'</div>'});
  openSh(h);document.body.classList.add('full');
}

/* =====================================================================
   Personnage 3D stylisé : surface humaine lisse (champ de distance + surface nets), rendu WebGL verre
   ===================================================================== */
var G3={cv:null,gl:null,pr:null,bufs:{},meshes:{},cur:null,goal:null,raf:0,ang:.35,vel:0,drag:false,g:0,gT:0,busy:false};
function bodyPrims(M){
  var s=M.h/175,fem=M.sexe==='f',cx=M.poitrine/100,wx=M.taille/82,hx=M.hanches/96,ax=M.bras/32,tx=M.cuisse/56,kx=M.mollet/37,nx=M.cou/38,P=[],sh=fem?.93:1;
  function E(c,r,k){P.push({t:0,c:[c[0]*s,c[1]*s,c[2]*s],r:[r[0],r[1],r[2]],k:k})}
  function C(a,b,r1,r2,k){P.push({t:1,a:[a[0]*s,a[1]*s,a[2]*s],b:[b[0]*s,b[1]*s,b[2]*s],r1:r1,r2:r2,k:k})}
  E([0,1.635,.005],[.072,.1,.086],.03);
  C([0,1.46,0],[0,1.57,.005],.058*nx,.05*nx,.045);
  E([0,1.47,-.012],[.13*sh,.05,.075],.06);
  E([0,1.31,0],[.165*cx*sh,.16,.108*cx],.08);
  if(fem){[-1,1].forEach(function(q){E([q*.072,1.285,.07],[.068*cx,.07,.065*cx],.05)})}else{[-1,1].forEach(function(q){E([q*.074,1.335,.058],[.082*cx,.058,.046*cx],.05)})}
  E([0,1.12,.005],[.146*wx,.16,.102*wx],.09);
  E([0,.955,0],[.158*hx*(fem?1.08:1),.105,.112*hx],.08);
  [-1,1].forEach(function(q){
    E([q*.072,.915,-.062],[.085*hx,.095,.07*hx],.05);
    E([q*.19*sh,1.418,0],[.066*ax,.07,.066*ax],.045);
    C([q*.205*sh,1.4,0],[q*.25*sh,1.16,-.005],.049*ax,.041*ax,.035);
    E([q*.228*sh,1.27,.016],[.043*ax,.08,.044*ax],.03);
    C([q*.255*sh,1.14,0],[q*.3*sh,.9,.02],.042*ax,.027,.03);
    E([q*.312*sh,.81,.025],[.025,.065,.042],.022);
    C([q*.088,.93,0],[q*.098,.53,.005],.095*tx,.058*tx,.05);
    E([q*.095,.74,.03],[.074*tx,.17,.07*tx],.04);
    C([q*.098,.51,0],[q*.094,.1,-.005],.052*kx,.034,.03);
    E([q*.098,.36,-.03],[.052*kx,.1,.052*kx],.03);
    C([q*.094,.05,-.035],[q*.105,.032,.16],.044,.031,.03);
  });
  return P;
}
function sdfAt(P,x,y,z){
  var d=1e9;
  for(var i=0;i<P.length;i++){var p=P[i],di;
    if(p.t===0){var qx=(x-p.c[0])/p.r[0],qy=(y-p.c[1])/p.r[1],qz=(z-p.c[2])/p.r[2],k0=Math.sqrt(qx*qx+qy*qy+qz*qz),k1=Math.sqrt(qx*qx/(p.r[0]*p.r[0])+qy*qy/(p.r[1]*p.r[1])+qz*qz/(p.r[2]*p.r[2]));di=k1>0?k0*(k0-1)/k1:-Math.min(p.r[0],p.r[1],p.r[2])}
    else{var ax=x-p.a[0],ay=y-p.a[1],az=z-p.a[2],bx=p.b[0]-p.a[0],by=p.b[1]-p.a[1],bz=p.b[2]-p.a[2],h=Math.max(0,Math.min(1,(ax*bx+ay*by+az*bz)/(bx*bx+by*by+bz*bz))),dx=ax-bx*h,dy=ay-by*h,dz=az-bz*h;di=Math.sqrt(dx*dx+dy*dy+dz*dz)-(p.r1+(p.r2-p.r1)*h)}
    if(d>=1e8){d=di;continue}
    var k=p.k,hh=Math.max(k-Math.abs(d-di),0)/k;d=Math.min(d,di)-hh*hh*k*.25;
  }
  return d;
}
function buildMesh(M){
  var P=bodyPrims(M),s=M.h/175,st=.0125*s,x0=-.4*s,y0=-.02*s,z0=-.2*s,nx=Math.ceil(.8*s/st)+1,ny=Math.ceil(1.79*s/st)+1,nz=Math.ceil(.46*s/st)+1,F=new Float32Array(nx*ny*nz);
  function I(i,j,k){return i+nx*(j+ny*k)}
  for(var k=0;k<nz;k++){for(var j=0;j<ny;j++){var y=y0+j*st;for(var i=0;i<nx;i++){F[I(i,j,k)]=sdfAt(P,x0+i*st,y,z0+k*st)}}}
  var cx=nx-1,cy=ny-1,cz=nz-1,CI=new Int32Array(cx*cy*cz).fill(-1),pos=[],EDG=[[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]],cv=new Float32Array(8);
  function C(i,j,k){return i+cx*(j+cy*k)}
  for(k=0;k<cz;k++){for(j=0;j<cy;j++){for(i=0;i<cx;i++){
    var m=0;for(var c=0;c<8;c++){var v=F[I(i+(c&1),j+((c>>1)&1),k+((c>>2)&1))];cv[c]=v;if(v<0){m|=1<<c}}
    if(m===0||m===255){continue}var sx=0,sy=0,sz=0,n=0;
    for(var e=0;e<12;e++){var a=EDG[e][0],b=EDG[e][1];if((cv[a]<0)!==(cv[b]<0)){var t=cv[a]/(cv[a]-cv[b]);sx+=(a&1)+((b&1)-(a&1))*t;sy+=((a>>1)&1)+(((b>>1)&1)-((a>>1)&1))*t;sz+=((a>>2)&1)+(((b>>2)&1)-((a>>2)&1))*t;n++}}
    CI[C(i,j,k)]=pos.length/3;pos.push(x0+(i+sx/n)*st,y0+(j+sy/n)*st,z0+(k+sz/n)*st);
  }}}
  var idx=[];
  for(k=1;k<nz;k++){for(j=1;j<ny;j++){for(i=1;i<nx;i++){
    var v0=F[I(i,j,k)];
    if(i<cx){var v1=F[I(i+1,j,k)];if((v0<0)!==(v1<0)){var q=[CI[C(i,j-1,k-1)],CI[C(i,j,k-1)],CI[C(i,j,k)],CI[C(i,j-1,k)]];quad(q,v0<0)}}
    if(j<cy){var v2=F[I(i,j+1,k)];if((v0<0)!==(v2<0)){var q2=[CI[C(i-1,j,k-1)],CI[C(i-1,j,k)],CI[C(i,j,k)],CI[C(i,j,k-1)]];quad(q2,v0<0)}}
    if(k<cz){var v3=F[I(i,j,k+1)];if((v0<0)!==(v3<0)){var q3=[CI[C(i-1,j-1,k)],CI[C(i,j-1,k)],CI[C(i,j,k)],CI[C(i-1,j,k)]];quad(q3,v0<0)}}
  }}}
  function quad(q,f){if(q[0]<0||q[1]<0||q[2]<0||q[3]<0){return}if(f){idx.push(q[0],q[1],q[2],q[0],q[2],q[3])}else{idx.push(q[0],q[2],q[1],q[0],q[3],q[2])}}
  var N=new Float32Array(pos.length),e2=st*.5;
  for(var p=0;p<pos.length;p+=3){var X=pos[p],Y=pos[p+1],Z=pos[p+2],gx=sdfAt(P,X+e2,Y,Z)-sdfAt(P,X-e2,Y,Z),gy=sdfAt(P,X,Y+e2,Z)-sdfAt(P,X,Y-e2,Z),gz=sdfAt(P,X,Y,Z+e2)-sdfAt(P,X,Y,Z-e2),l=Math.hypot(gx,gy,gz)||1;N[p]=gx/l;N[p+1]=gy/l;N[p+2]=gz/l}
  return{pos:new Float32Array(pos),nrm:N,idx:new Uint32Array(idx),h:1.75*s};
}
var VS='attribute vec3 aP;attribute vec3 aN;uniform mat4 uM;uniform mat4 uVP;varying vec3 vN;varying vec3 vW;varying float vY;void main(){vec4 w=uM*vec4(aP,1.);vW=w.xyz;vN=mat3(uM)*aN;vY=aP.y;gl_Position=uVP*w;}';
var FS='precision mediump float;varying vec3 vN;varying vec3 vW;varying float vY;uniform vec3 uC;uniform float uA;uniform vec3 uE;uniform float uD;uniform float uT;'+
 'void main(){vec3 n=normalize(vN);vec3 v=normalize(uE-vW);float nv=clamp(dot(n,v),0.,1.);float fr=pow(1.-nv,2.3);float l=max(dot(n,normalize(vec3(-.45,.75,.55))),0.);'+
 'float sc=fract(vY*38.-uT*.15);float ln=smoothstep(0.,.05,sc)*(1.-smoothstep(.05,.13,sc));float sw=smoothstep(.0,.02,fract(vY*.9-uT*.12)-.97);'+
 'vec3 c;float a;if(uD>.5){c=uC*(.2+.5*l+1.2*fr+.25*ln+.35*sw);a=uA*(.5+.5*fr+.12*ln+.15*sw);}else{c=mix(vec3(.96),uC,.3+.6*fr+.2*ln-.15*l+.2*sw);a=uA*(.78+.22*fr);}gl_FragColor=vec4(c,a);}';
function g3Init(cv){
  var gl=cv.getContext('webgl',{antialias:true,alpha:true,premultipliedAlpha:false});if(!gl||!gl.getExtension('OES_element_index_uint')){return null}
  function sh(t,src){var o=gl.createShader(t);gl.shaderSource(o,src);gl.compileShader(o);return gl.getShaderParameter(o,gl.COMPILE_STATUS)?o:null}
  var v=sh(gl.VERTEX_SHADER,VS),fr=sh(gl.FRAGMENT_SHADER,FS);if(!v||!fr){return null}
  var p=gl.createProgram();gl.attachShader(p,v);gl.attachShader(p,fr);gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS)){return null}
  G3.loc={aP:gl.getAttribLocation(p,'aP'),aN:gl.getAttribLocation(p,'aN'),uM:gl.getUniformLocation(p,'uM'),uVP:gl.getUniformLocation(p,'uVP'),uC:gl.getUniformLocation(p,'uC'),uA:gl.getUniformLocation(p,'uA'),uE:gl.getUniformLocation(p,'uE'),uD:gl.getUniformLocation(p,'uD'),uT:gl.getUniformLocation(p,'uT')};
  G3.pr=p;G3.bufs={};return gl;
}
function g3Buf(key){
  if(G3.bufs[key]){return G3.bufs[key]}var gl=G3.gl,m=G3.meshes[key];if(!gl||!m){return null}
  function B(t,d){var b=gl.createBuffer();gl.bindBuffer(t,b);gl.bufferData(t,d,gl.STATIC_DRAW);return b}
  return G3.bufs[key]={p:B(gl.ARRAY_BUFFER,m.pos),n:B(gl.ARRAY_BUFFER,m.nrm),i:B(gl.ELEMENT_ARRAY_BUFFER,m.idx),c:m.idx.length,h:m.h};
}
function m4mul(a,b){var o=new Float32Array(16);for(var i=0;i<4;i++){for(var j=0;j<4;j++){var s=0;for(var k=0;k<4;k++){s+=a[k*4+j]*b[i*4+k]}o[i*4+j]=s}}return o}
function m4persp(fy,as,n,f){var t=1/Math.tan(fy/2),o=new Float32Array(16);o[0]=t/as;o[5]=t;o[10]=(f+n)/(n-f);o[11]=-1;o[14]=2*f*n/(n-f);return o}
function m4look(e,c){var zx=e[0]-c[0],zy=e[1]-c[1],zz=e[2]-c[2],zl=Math.hypot(zx,zy,zz);zx/=zl;zy/=zl;zz/=zl;var xx=zz,xy=0,xz=-zx,xl=Math.hypot(xx,xz);xx/=xl;xz/=xl;var yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;
  return new Float32Array([xx,yx,zx,0,xy,yy,zy,0,xz,yz,zz,0,-(xx*e[0]+xy*e[1]+xz*e[2]),-(yx*e[0]+yy*e[1]+yz*e[2]),-(zx*e[0]+zy*e[1]+zz*e[2]),1])}
function m4rotY(a){var c=Math.cos(a),s=Math.sin(a);return new Float32Array([c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1])}
function g3Keys(){var M0=defaultsMes();M0.sexe=PROF&&PROF.sexe||'h';var MG=goalMes(M0);MG.sexe=M0.sexe;function k(M){return['h','poitrine','taille','hanches','bras','cuisse','mollet','cou'].map(function(x){return Math.round(M[x]*2)/2}).join('|')+M.sexe}return{cur:k(M0),goal:k(MG),M0:M0,MG:MG}}
function g3Ensure(which){
  var K=g3Keys(),key=K[which],M=which==='cur'?K.M0:K.MG;G3[which]=key;
  if(G3.meshes[key]){return}if(G3.busy){setTimeout(function(){g3Ensure(which)},120);return}G3.busy=true;
  var n=$('#b3w8');if(n){n.classList.add('on')}
  setTimeout(function(){try{G3.meshes[key]=buildMesh(M)}catch(e){}G3.busy=false;setTimeout(function(){if(window.g3Wake){g3Wake()}},0);var n2=$('#b3w8');if(n2){n2.classList.remove('on')}},40);
}
function g3Draw(t){
  var cv=G3.cv,gl=G3.gl;if(!cv||!cv.isConnected||!gl){G3.raf=0;return}
  if(!g3Vis()){G3.raf=0;return}if(!G3.drag&&t&&G3.lt&&t-G3.lt<30){G3.raf=requestAnimationFrame(g3Draw);return}G3.lt=t;
  var dpr=Math.min(1.5,window.devicePixelRatio||1),W=cv.clientWidth,H=cv.clientHeight;if(cv.width!==Math.round(W*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr)}
  gl.viewport(0,0,cv.width,cv.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  if(!G3.drag){G3.ang+=G3.vel;G3.vel*=.89;if(Math.abs(G3.vel)<.005&&FX!=='sobre'){G3.ang+=.009}}
  G3.g+=(G3.gT-G3.g)*.07;
  var dark=!document.body.classList.contains('light'),bc=G3.bufs[G3.cur]||g3Buf(G3.cur),bg=G3.goal?(G3.bufs[G3.goal]||g3Buf(G3.goal)):null,h=(bc||bg||{h:1.75}).h;
  var fov=.5,dist=h*.62/Math.tan(fov/2)+.35,eye=[0,h*.56,dist],VP=m4mul(m4persp(fov,W/H,.1,20),m4look(eye,[0,h*.5,0])),Mr=m4rotY(G3.ang);
  gl.useProgram(G3.pr);var L=G3.loc;gl.uniformMatrix4fv(L.uVP,false,VP);gl.uniformMatrix4fv(L.uM,false,Mr);gl.uniform3fv(L.uE,eye);gl.uniform1f(L.uD,dark?1:0);gl.uniform1f(L.uT,t/1000||0);
  gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,dark?gl.ONE:gl.ONE_MINUS_SRC_ALPHA);
  function draw(b,alpha,col){if(!b||alpha<.01){return}gl.bindBuffer(gl.ARRAY_BUFFER,b.p);gl.enableVertexAttribArray(L.aP);gl.vertexAttribPointer(L.aP,3,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ARRAY_BUFFER,b.n);gl.enableVertexAttribArray(L.aN);gl.vertexAttribPointer(L.aN,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,b.i);
    gl.clear(gl.DEPTH_BUFFER_BIT);gl.colorMask(false,false,false,false);gl.depthMask(true);gl.depthFunc(gl.LESS);gl.drawElements(gl.TRIANGLES,b.c,gl.UNSIGNED_INT,0);
    gl.colorMask(true,true,true,true);gl.depthMask(false);gl.depthFunc(gl.LEQUAL);gl.uniform3fv(L.uC,col);gl.uniform1f(L.uA,alpha);gl.drawElements(gl.TRIANGLES,b.c,gl.UNSIGNED_INT,0);gl.depthMask(true)}
  var fg=dark?[.93,.95,1]:[.09,.1,.12],gr=dark?[.5,.95,.72]:[.18,.55,.4];
  if(bc&&(!bg||G3.g<.98)){draw(bc,bg?1-G3.g:1,fg)}if(bg){draw(bg,G3.g,gr)}
  if(FX==='sobre'&&!G3.drag&&Math.abs(G3.vel)<.005&&Math.abs(G3.gT-G3.g)<.005&&!G3.busy){G3.raf=0;return}
  G3.raf=(TAB==='moi'&&!document.hidden)?requestAnimationFrame(g3Draw):0;
}
function g3Vis(){var cv=G3.cv;if(!cv||document.hidden||TAB!=='moi'||document.body.classList.contains('open')){return false}var r=cv.getBoundingClientRect();return r.bottom>40&&r.top<innerHeight-40&&r.right>20&&r.left<innerWidth-20}
function g3Wake(){if(G3.cv&&!G3.raf&&g3Vis()){G3.raf=requestAnimationFrame(g3Draw)}}
window.addEventListener('scroll',g3Wake,{passive:true});document.addEventListener('scroll',function(e){if(e.target&&e.target.id==='mcar'){g3Wake()}},{passive:true,capture:true});
function g3Start(){
  var cv=$('#b3c');if(!cv){return false}
  if(G3.cv!==cv){var gl=g3Init(cv);if(!gl){return false}G3.cv=cv;G3.gl=gl;
    var x0=0,last=0;cv.addEventListener('pointerdown',function(e){G3.drag=true;if(!G3.raf){G3.raf=requestAnimationFrame(g3Draw)}last=e.clientX;try{cv.setPointerCapture(e.pointerId)}catch(_){}});
    cv.addEventListener('pointermove',function(e){if(!G3.drag){return}var dx=e.clientX-last;last=e.clientX;G3.ang+=dx*.012;G3.vel=dx*.012});
    cv.addEventListener('pointerup',function(){G3.drag=false});cv.addEventListener('pointercancel',function(){G3.drag=false});}
  g3Ensure('cur');if(G3.gT>0){g3Ensure('goal')}
  if(!G3.raf){G3.raf=requestAnimationFrame(g3Draw)}return true;
}

/* ---------- Accueil : réponses animées, 👍, transitions entre écrans ---------- */
function obThumb(el){
  if(!el){return}var r=el.getBoundingClientRect(),t=document.createElement('div');t.className='thumb';t.textContent='👍';
  t.style.left=Math.min(innerWidth-52,r.right-46)+'px';t.style.top=(r.top+r.height/2-20)+'px';document.body.appendChild(t);
  setTimeout(function(){t.remove()},1000);el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');
  if(navigator.vibrate){navigator.vibrate(8)}
}
function obSet(k,v,el){
  OB.p[k]=v;var e=$('#obe');if(e){e.textContent=''}
  [].forEach.call(document.querySelectorAll('#ob .obc[data-k="'+k+'"]'),function(b){b.classList.toggle('on',b.dataset.v===String(v))});
  obThumb(el);
}
function obStep(d,el){var s=Math.max(1,Math.min(7,(pn(OB.p.seances)||3)+d));OB.p.seances=s;var b=$('#obsv');if(b){b.textContent=s;b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop')}}
function obDone(k,el){if(String(el.value).trim()){obThumb(el.closest('.obi')||el)}}
function chip(k,v,lab,sub){return '<button class="g obc'+(String(OB.p[k])===String(v)?' on':'')+'" data-k="'+k+'" data-v="'+v+'" onclick="obSet(\''+k+'\',\''+v+'\',this)">'+lab+(sub?'<small>'+sub+'</small>':'')+'</button>'}
function obField(k,lab,unit,ph){return '<label class="obf"><span>'+lab+'</span><div class="g obi"><input inputmode="decimal" value="'+esc(OB.p[k]||'')+'" placeholder="'+(ph||'')+'" oninput="obIn(\''+k+'\',this)" onchange="obDone(\''+k+'\',this)"><em>'+unit+'</em></div></label>'}
OBS[1]=function(){return '<h2 class="obt">Comment tu t’appelles ? 👋</h2><p class="obp">C’est comme ça que Forme te dira bonjour.</p><div class="g obi big"><input id="obn" autocomplete="given-name" value="'+esc(OB.p.prenom||'')+'" placeholder="Ton prénom" oninput="obIn(\'prenom\',this)" onchange="obDone(\'prenom\',this)"></div>'};
OBS[4]=function(){var s=pn(OB.p.seances)||3;return '<h2 class="obt">Ton expérience 🏋️</h2><p class="obp">Depuis combien de temps tu fais de la musculation ?</p><div class="obg2">'+chip('experience','0','Jamais')+chip('experience','1','Moins d’un an')+chip('experience','2','1 à 3 ans')+chip('experience','3','Plus de 3 ans')+'</div><div class="lab" style="margin:22px 4px 10px">Séances par semaine</div><div class="g obst"><button onclick="obStep(-1,this)" aria-label="Moins">−</button><b id="obsv">'+s+'</b><button onclick="obStep(1,this)" aria-label="Plus">+</button></div>'};
function obRender(dir){
  var el=$('#ob'),n=OBS.length,last=OB.step===n-1;if(OB.p.seances==null){OB.p.seances=3}
  if(!$('#ob .obtop')){el.innerHTML='<div class="obtop"><span id="obbk"></span><div class="obpr"><i id="obpi"></i></div><span id="obx"></span></div><div class="obs" id="obsc"></div><div class="obbot"><div class="note tko" id="obe"></div><button class="obgo" id="obgo" onclick="obGo(1)"></button></div>'}
  $('#obbk').innerHTML=OB.step?'<button class="gb" onclick="obGo(-1)" aria-label="Retour"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>':'';
  $('#obx').innerHTML=PROF&&PROF.done?'<button class="gb" onclick="closeOB()" aria-label="Fermer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>':'';
  $('#obpi').style.width=(OB.step/(n-1)*100)+'%';$('#obe').textContent='';
  var b=$('#obgo');b.textContent=OB.step===0?'Commencer':last?'C’est parti 🚀':'Continuer';
  var c=$('#obsc');c.className='obs '+(dir<0?'inL':'inR');c.innerHTML=OBS[OB.step]();c.scrollTop=0;
  var i=$('#obn');if(i&&!OB.p.prenom){setTimeout(function(){i.focus()},450)}
}
function obGo(d){
  if(OB.anim){return}
  if(d>0){var e=obValid();if(e){var er=$('#obe');er.textContent=e;er.classList.remove('shk');void er.offsetWidth;er.classList.add('shk');return}}
  if(d>0&&OB.step===OBS.length-1){finishOB();return}
  var nx=Math.max(0,Math.min(OBS.length-1,OB.step+d));if(nx===OB.step){return}
  OB.anim=true;var c=$('#obsc');if(c){c.className='obs '+(d>0?'lvL':'lvR')}
  setTimeout(function(){OB.step=nx;OB.anim=false;obRender(d)},230);
}
var _openOB=openOB;openOB=function(step){var el=$('#ob');if(el){el.innerHTML=''}_openOB(step)};

/* ---------- Niveau du joueur façon jeu vidéo ---------- */
var TRX=null,RANKS=[[1,'Recrue','color-mix(in srgb,var(--act) 25%,#8E939C)'],[3,'Apprenti','color-mix(in srgb,var(--act) 40%,#8E939C)'],[5,'Athlète','color-mix(in srgb,var(--act) 55%,#8E939C)'],[8,'Confirmé','color-mix(in srgb,var(--act) 70%,#8E939C)'],[11,'Expert','color-mix(in srgb,var(--act) 85%,#8E939C)'],[15,'Élite','var(--act)'],[20,'Légende','var(--acs)']];
function rankOf(n){var r=RANKS[0];RANKS.forEach(function(x){if(n>=x[0]){r=x}});return{name:r[1],col:r[2]}}
function trXP(){
  var tp=0;TRL.forEach(function(t){if(t.done){tp+=TIER[t.tier].p}});var sp=(TRX?TRX.nS:0)*10,xp=tp+sp,n=1,need=100,cur=xp;
  while(cur>=need){cur-=need;n++;need=100+50*(n-1)}
  return{xp:xp,tp:tp,sp:sp,lvl:n,cur:cur,need:need,pr:cur/need*100,rank:rankOf(n)};
}
function lvHero(X,big){
  var S=big?200:170,R=S/2-14,C=2*Math.PI*R,id='lg'+(GID++);
  return '<div class="lvring" style="width:'+S+'px;height:'+S+'px"><svg viewBox="0 0 '+S+' '+S+'" style="width:'+S+'px;height:'+S+'px"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--ac2)"/><stop offset=".55" style="stop-color:var(--ac)"/><stop offset="1" style="stop-color:var(--acd)"/></linearGradient></defs>'+
    '<circle cx="'+S/2+'" cy="'+S/2+'" r="'+R+'" fill="none" stroke="rgba(var(--fgr),.08)" stroke-width="11"/>'+
    '<circle cx="'+S/2+'" cy="'+S/2+'" r="'+R+'" fill="none" stroke="rgba(var(--fgr),.12)" stroke-width="11" stroke-dasharray="1.5 '+(C/40-1.5).toFixed(2)+'"/>'+
    '<circle class="lvarc" cx="'+S/2+'" cy="'+S/2+'" r="'+R+'" fill="none" stroke="url(#'+id+')" stroke-width="11" stroke-linecap="round" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+(C*(1-X.pr/100)).toFixed(1)+'" style="--c:'+C.toFixed(1)+'"/></svg>'+
    '<div class="lvdisc"><small>Niveau</small><b>'+X.lvl+'</b><em style="color:'+X.rank.col+'">'+X.rank.name+'</em></div></div>';
}
function xpBar(cur,need,col){return '<div class="xpb"><i style="width:'+Math.max(2,cur/need*100)+'%;'+(col?'--xc:'+col:'')+'"></i>'+[25,50,75].map(function(p){return '<s style="left:'+p+'%"></s>'}).join('')+'</div>'}
function renderTrCard(){
  var el=$('#trc');if(!el){return}if(!TRL.length){el.innerHTML='<div class="note">Calcul de ton niveau…</div>';return}
  var X=trXP(),cnt={b:0,a:0,o:0,p:0},tot=TRL.length,dn=0;TRL.forEach(function(t){if(t.done){cnt[t.tier]++;dn++}});
  var rec=TRL.filter(function(t){return t.done}).sort(function(a,b){return(b.date||'')<(a.date||'')?-1:1}).slice(0,3);
  var nxt=TRL.filter(function(t){return !t.done&&!t.secret&&t.tier!=='p'}).sort(function(a,b){return b.cur/b.goal-a.cur/a.goal})[0];
  el.className='g lvh';
  el.innerHTML=lvHero(X,true)+
   '<div class="xpl"><span><b>'+f(X.cur)+'</b> / '+f(X.need)+' XP</span><span>Niveau '+(X.lvl+1)+'</span></div>'+xpBar(X.cur,X.need)+
   '<div class="note" style="text-align:center">Encore <b style="color:var(--t)">'+f(X.need-X.cur)+' XP</b> avant le niveau '+(X.lvl+1)+' · '+f(X.xp)+' XP au total</div>'+
   '<div class="xps"><span>🏆 Trophées <b>+'+f(X.tp)+'</b></span><span>🏋️ Séances <b>+'+f(X.sp)+'</b></span><span>✨ 10 XP par séance</span></div>'+
   '<div class="trct" style="justify-content:center;margin-top:16px">'+['p','o','a','b'].map(function(k){return '<span>'+medal(k,22)+cnt[k]+'</span>'}).join('')+'</div>'+
   '<div class="note" style="text-align:center">'+dn+' / '+tot+' trophées · '+Math.round(dn/tot*100)+' %</div>'+
   (rec.length?'<div class="trrec">'+rec.map(function(t){return '<div>'+medal(t.tier,38)+'<span>'+esc(t.name)+'</span></div>'}).join('')+'</div>':'')+
   (nxt?'<div class="g trnx" style="text-align:left"><div class="lab">Prochain trophée · +'+TIER[nxt.tier].p+' XP</div><div style="display:flex;gap:12px;align-items:center;margin-top:6px">'+medal(nxt.tier,34,true)+'<div style="flex:1;min-width:0"><b>'+esc(nxt.name)+'</b><div class="note" style="margin:0">'+esc(nxt.desc)+'</div>'+xpBar(Math.min(nxt.cur,nxt.goal),nxt.goal)+'<div class="note" style="margin:0">'+trProg(nxt)+'</div></div></div></div>':'')+
   '<button class="g pill on" style="width:100%;margin-top:12px;padding:13px" onclick="openTrophies()">Voir tous les trophées</button>';
}
function lvKey(){return 'forme_plv_'+(live()?'live':'demo')}
function checkLevelUp(){
  if(!TRL.length){return}var X=trXP(),old=null;try{old=+localStorage.getItem(lvKey())||null}catch(e){}
  try{localStorage.setItem(lvKey(),String(X.lvl))}catch(e){}
  if(old&&X.lvl>old){setTimeout(function(){showLevelUp(X)},TRQ.length*4300+600)}
}
function showLevelUp(X){
  var el=$('#lvup');if(!el){el=document.createElement('div');el.id='lvup';document.body.appendChild(el)}
  var sp='';for(var i=0;i<18;i++){var a=i/18*Math.PI*2;sp+='<i style="--x:'+Math.cos(a)*150+'px;--y:'+Math.sin(a)*150+'px;animation-delay:'+(.35+i%3*.06)+'s"></i>'}
  el.innerHTML='<div class="lvupb"><div class="lvsp">'+sp+'</div>'+lvHero(X,true)+'<div class="obt" style="text-align:center;margin-top:18px">Niveau supérieur !</div><p class="obp" style="text-align:center">Tu passes niveau '+X.lvl+' · <b style="color:'+X.rank.col+'">'+X.rank.name+'</b></p><button class="obgo" onclick="this.closest(\'#lvup\').className=\'\'">Continuer</button></div>';
  el.className='';void el.offsetWidth;el.className='on';trChime('p');
}
var _computeTrophies=computeTrophies;computeTrophies=function(r,m){if(r!==undefined||m!==undefined||!TRX){TRX=trStats(r!==undefined?r:TRR.r,m!==undefined?m:TRR.m)}_computeTrophies(r,m);TRX=trStats(TRR.r,TRR.m);renderTrCard();checkLevelUp()};

/* ---------- Niveau d'un exercice : échelle des paliers ---------- */
function lvLadder(x){
  var Q=x.L;if(!Q){return ''}var S=150,R=60,C=2*Math.PI*R,col=LVCOL[Q.i];
  var steps=LVN.map(function(n,j){var kg=j?Q.th[j-1]:0,st=j<Q.i?'ok':j===Q.i?'cur':'lk';
    return '<div class="lad '+st+'" style="--lc:'+LVCOL[j]+'"><i>'+(st==='ok'?'✓':st==='cur'?'●':'🔒')+'</i><b>'+n+'</b><span>'+(j?f(kg,kg<100?1:0)+' kg':'départ')+'</span></div>'}).reverse().join('');
  return '<div class="g lvex"><div class="lvexh"><div class="lvring" style="width:'+S+'px;height:'+S+'px"><svg viewBox="0 0 '+S+' '+S+'" style="width:'+S+'px;height:'+S+'px"><circle cx="75" cy="75" r="'+R+'" fill="none" stroke="rgba(var(--fgr),.08)" stroke-width="9"/><circle class="lvarc" cx="75" cy="75" r="'+R+'" fill="none" stroke-width="9" stroke-linecap="round" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+(C*(1-Q.frac)).toFixed(1)+'" style="stroke:'+col+';--c:'+C.toFixed(1)+';filter:drop-shadow(0 0 8px rgba(var(--acr),'+(Q.i?.45:.15)+'))"/></svg>'+
    '<div class="lvdisc" style="inset:18px"><small>Niveau '+(Q.i+1)+' / 5</small><b style="font-size:20px;letter-spacing:-.01em">'+Q.name+'</b><em>'+f(x.rm,1)+' kg</em></div></div>'+
    '<div style="flex:1;min-width:0">'+(Q.next?'<div class="lab">Prochain palier</div><div class="big" style="font-size:26px;margin:2px 0">'+Q.next+'</div><div class="note" style="margin:0">encore <b style="color:var(--t)">'+f(Q.need,1)+' kg</b> sur ton 1RM estimé</div>':'<div class="big" style="font-size:24px">Niveau maximum 👑</div>')+'</div></div>'+
    '<div class="ladw">'+steps+'</div><div class="note" style="margin-top:10px">'+(Q.rel?'Paliers calculés selon ton poids de corps ('+f(bodyW(),1)+' kg)':'Paliers calculés d’après le standard de ta feuille ('+f(x.std)+' kg)')+'. Repères approximatifs.</div></div>';
}

/* ---------- Données de la semaine lues dans Récupération : pas, glucides, lipides ---------- */
var WX=null;
function weekExtra(r){
  if(!r||r.length<2||!D){return null}var h=r[0],keys=D.week.keys;
  var c={d:colIdx(h,/^date/),steps:colIdx(h,/^pas\b|^pas$|steps|nombre de pas/),carbs:colIdx(h,/glucid|carb/),fat:colIdx(h,/lipid|^fat|graisse/)};
  if(c.steps<0&&h.length>17){c.steps=17}if(c.carbs<0&&h.length>20){c.carbs=20}if(c.fat<0&&h.length>21){c.fat=21}
  var by={};r.slice(1).forEach(function(x){var k=toKey(x[c.d]);if(k){by[k]=x}});
  var o={};['steps','carbs','fat'].forEach(function(f){o[f]=keys.map(function(k){var x=by[k];if(!x||c[f]<0){return null}var v=pn(x[c[f]]);return v!=null&&v>0?v:null})});
  return o;
}
var _done0=null;
function renderTip(){var el=$('#tip'),T=tipOfDay();if(!el||!T){return}el.innerHTML='<div class="lab">Conseil du jour 💡</div><div class="tipc" style="margin-top:10px"><div class="tipe">'+T.e+'</div><div class="tipt" style="margin-top:0">'+esc(T.t)+'</div></div>'}
function renderPhotosCard(){
  var el=$('#phc');if(!el){return}var s=suivi();
  el.innerHTML='<div class="lab">Photos de suivi 📸</div>'+(s.length?
    '<div class="thr">'+s.slice(-3).reverse().map(function(p){return '<div><img src="'+p.img+'" alt=""><span>'+dl(p.date)+'</span></div>'}).join('')+'</div><div class="note" style="margin-top:10px">'+s.length+' photo'+(s.length>1?'s':'')+'</div>':
    '<div class="note" style="margin-top:8px;line-height:1.5">Ajoute une photo de temps en temps pour voir ton évolution. Elles restent uniquement sur ce téléphone.</div><button class="g pill" style="margin-top:12px;padding:11px 16px" onclick="event.stopPropagation();pickPhoto(\'suivi\')">＋ Ajouter une photo</button>');
}
var _renderIns=renderIns;
renderIns=function(){
  if(!$('#insA')){return _renderIns()}if(!INS){return}
  var tmp=document.createElement('div');tmp.id='ins';tmp.style.display='none';document.body.appendChild(tmp);_renderIns();
  var cards=tmp.querySelectorAll(':scope > .g'),grid=tmp.querySelector('.grid');
  if(cards[0]){$('#insA').innerHTML=cards[0].innerHTML}
  if(grid){$('#insB').innerHTML=[].map.call(grid.children,function(c){return '<div class="insb">'+c.innerHTML+'</div>'}).join('')}
  if(cards[1]){$('#insC').innerHTML=cards[1].innerHTML}
  tmp.remove();
};


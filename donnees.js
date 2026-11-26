/* Forme · donnees.js · Onglet Données (ta feuille), analyses de la semaine, records, photos */
/* ---------- Onglet Données : tous les onglets de la feuille ---------- */
var SL=null,SLerr='',SD={},CUR=null,HID=/^(source|timezone|fuseau)/i,PAL=['var(--ac)','var(--ac2)',shade(.7),shade(.4)];
function gs(){return window.google&&google.script&&google.script.run}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var ICO={grid:'<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
 moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',dumb:'<path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12"/>',
 sliders:'<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',chart:'<path d="M4 19V5M4 19h16M8 15l4-4 3 3 5-6"/>',
 trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0zM12 13v4M8 20h8M16 6h3a3 3 0 0 1-3 3M8 6H5a3 3 0 0 0 3 3"/>',pulse:'<path d="M3 12h4l3-7 4 14 3-7h4"/>',
 scale:'<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 10a3 3 0 0 1 6 0M12 10l1.5-2"/>',leaf:'<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14zM5 19l7-7"/>',
 heart:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',table:'<rect x="4" y="5" width="16" height="14" rx="3"/><path d="M4 10h16M10 10v9"/>'};
function ico(n){n=n.toLowerCase();return ICO[/synth/.test(n)?'grid':/r[ée]cup|sleep|sommeil/.test(n)?'moon':/muscu/.test(n)?'dumb':/param/.test(n)?'sliders':/bilan/.test(n)?'chart':/r[ée]f[ée]r|force/.test(n)?'trophy':/activ/.test(n)?'pulse':/body|poids/.test(n)?'scale':/nutri/.test(n)?'leaf':/vital/.test(n)?'heart':'table']}
function loadSheets(){
  SL=null;SLerr='';renderData();
  if(!live()){SL=demoList();renderData();return}
  call('list').then(function(l){SL=l;renderData()}).catch(function(e){SLerr=e.message||String(e);renderData()});
}
function renderData(){
  var el=$('#v-data'),sn=$('#sn');
  if(SL===null){sn.innerHTML='';el.innerHTML=SLerr?'<div class="g" style="margin-top:6px"><b>Impossible de lister tes onglets</b><div class="note">Vérifie ta connexion, puis tes réglages.</div><div class="note" style="margin-top:8px;opacity:.7">'+esc(SLerr)+'</div></div>':'<div class="note" style="margin:6px 4px">Chargement des onglets…</div>';return}
  sn.innerHTML=SL.map(function(s,i){return '<button data-i="'+i+'" onclick="selSheet('+i+')"><svg viewBox="0 0 24 24">'+ico(s.name)+'</svg>'+esc(s.name)+'</button>'}).join('');
  if(TAB!=='data'){return}
  var i=SELIDX;if(i==null||i>=SL.length){i=0}
  if(CUR&&SL[i]&&CUR.name===SL[i].name&&CUR.p){markSheet(i);show(CUR.p)}else{selSheet(i)}
}
function markSheet(i){
  [].forEach.call($('#sn').children,function(b){b.classList.toggle('on',+b.dataset.i===i)});
  var on=$('#sn').children[i];if(on){var c=$('#sn');c.scrollTo({left:on.offsetLeft-c.clientWidth/2+on.offsetWidth/2,behavior:'smooth'})}
}
function parseSheet(v){
  var rows=(v||[]).map(function(r){return r.map(function(c){return String(c).trim()})}).filter(function(r){return r.some(function(c){return c!==''})});
  if(!rows.length){return{mode:'empty'}}
  var nc=Math.max.apply(null,rows.map(function(r){return r.length})),h0=rows[0],fl=h0.filter(function(c){return c!==''}).length;
  var list=rows.length>1&&fl>=2&&fl>=nc*0.6,data=list?rows.slice(1):rows,used=[];
  for(var c=0;c<nc;c++){if(data.some(function(r){return r[c]}))used.push(c)}
  function pick(r){return used.map(function(c){return r[c]||''})}
  data=data.map(pick);
  if(list){
    var dated=data.filter(function(r){return /^\d{4}-\d{2}-\d{2}/.test(r[0])}).length>=data.length/2;
    if(dated){data=data.map(function(r,i){return[r,i]}).sort(function(a,b){return a[0][0]<b[0][0]?1:a[0][0]>b[0][0]?-1:a[1]-b[1]}).map(function(x){return x[0]})}
    return{mode:'list',head:pick(h0).map(function(h,i){return h||'Colonne '+(i+1)}),rows:data};
  }
  return{mode:'grid',rows:data};
}
function selSheet(i){
  var s=SL[i];SELIDX=i;try{localStorage.setItem('forme_tab',String(i))}catch(e){}
  CUR={name:s.name,view:'cards',q:'',lim:40,p:null};markSheet(i);setHead();
  $('#v-data').innerHTML='<div class="note" id="shn" style="margin:0 4px 2px"></div><div id="shb"><div class="note" style="margin:12px 4px">Chargement…</div></div>';
  if(TAB==='data'){window.scrollTo({top:0,behavior:'smooth'})}
  if(SD[s.name]){show(SD[s.name]);return}
  function ok(d){SD[s.name]=parseSheet(d.values);if(CUR&&CUR.name===s.name){show(SD[s.name])}}
  if(live()){call('sheet',s.name).then(ok).catch(function(e){$('#shb').innerHTML='<div class="g" style="margin-top:12px">Impossible de lire cet onglet.<div class="note">'+esc(e.message||e)+'</div></div>'})}
  else{ok({values:demoSheet(s.name)})}
}
function show(p){
  CUR.p=p;var b=$('#shb');
  if(p.mode==='empty'){$('#shn').textContent='';b.innerHTML='<div class="g" style="margin-top:12px">Cet onglet est vide.</div>';return}
  if(p.mode==='grid'){$('#shn').textContent='Tableau de bord de la feuille';b.innerHTML=gridCards(p.rows);return}
  $('#shn').textContent=f(p.rows.length)+' ligne'+(p.rows.length>1?'s':'')+' · les plus récentes d’abord';
  b.innerHTML='<input class="g srch" style="margin-top:12px" placeholder="Rechercher (date, exercice…)" oninput="CUR.q=this.value;CUR.lim=40;drawRows()" value="'+esc(CUR.q)+'"><div id="shr"></div>';
  drawRows();
}
/* Tableaux de bord (Synthèse, Bilans, Références) : titres de section + cartes empilées, sans défilement horizontal */
function hasVal(r){return r.some(function(c){return c&&(isNum(c)||/^\d{4}-\d{2}-\d{2}/.test(c)||c==='—'||c==='-')})}
function gridCards(rows){
  var h='',hdr=null,k=0;
  rows.forEach(function(r,i){
    var ne=r.filter(function(c){return c!==''});
    if(ne.length===1&&!isNum(ne[0])){h+='<div class="st">'+esc(ne[0])+'</div>';hdr=null;return}
    var nx=rows[i+1];
    if(!hasVal(r)){
      if(nx&&nx.filter(function(c){return c!==''}).length>1&&hasVal(nx)){hdr=r;return}
      h+='<div class="nl">'+ne.map(esc).join(' · ')+'</div>';return}
    var lab=hdr||r.map(function(){return ''});
    h+=rowCard(lab,r,k++);
  });
  return h||'<div class="g" style="margin-top:12px">Cet onglet est vide.</div>';
}
function setView(v){CUR.view=v;show(CUR.p)}
function drawRows(){
  var p=CUR.p,q=CUR.q.trim().toLowerCase(),r=p.rows,h;
  if(q){r=r.filter(function(x){return x.join(' ').toLowerCase().indexOf(q)>=0})}
  var v=r.slice(0,CUR.lim);
  if(!r.length){h='<div class="note" style="margin:14px 4px">Aucun résultat.</div>'}
  else{h=v.map(function(x,i){return rowCard(p.head,x,i)}).join('')}
  if(r.length>CUR.lim){h+='<button class="g pill" style="width:100%;margin-top:10px;padding:13px" onclick="CUR.lim+=40;drawRows()">Afficher plus ('+f(r.length-CUR.lim)+')</button>'}
  $('#shr').innerHTML=h;
}
function isNum(s){return /^[-+]?[\d\s  .,]+\s*(%|[a-zA-Zµ]{1,4})?$/.test(s)}
function fmtTitle(s){var m=String(s).match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{1,2}:\d{2}))?/);return m?dl(m[1])+' '+m[1].slice(0,4)+(m[2]?' · '+m[2]:''):s}
function rowCard(hd,r,i){
  var sub='',si=-1,kv='',j;
  hd=hd.map(function(x){return x||''});
  var tt=r[0]&&r[0]!=='—'&&!isNum(r[0]),st=tt?1:0;
  if(tt){for(j=1;j<r.length;j++){if(r[j]&&!HID.test(hd[j]||'')&&!isNum(r[j])&&r[j].length<48&&!/^\d{4}-\d{2}-\d{2}/.test(r[j])){sub=r[j];si=j;break}}}
  for(j=st;j<r.length;j++){if(j===si||!r[j]||r[j]==='—'||HID.test(hd[j]||'')){continue}kv+='<div><span>'+esc(hd[j]||'')+'</span><b>'+esc(r[j])+'</b></div>'}
  var ei=-1;for(j=0;j<hd.length;j++){if(/^exercice/i.test(hd[j])){ei=j}}var gi=-1;for(j=0;j<hd.length;j++){if(/groupe/i.test(hd[j])){gi=j}}
  var fig=ei>=0&&r[ei]?'<div class="exi rcx">'+exSvg(r[ei],gi>=0?r[gi]:'',46)+'</div>':'';
  return '<div class="g li rc" style="animation-delay:'+(Math.min(i,12)*30)+'ms">'+fig+(tt?'<div class="rt">'+esc(fmtTitle(r[0]))+'</div>':'')+(sub?'<div class="note">'+esc(sub)+'</div>':'')+(kv?'<div class="kv"'+(tt?'':' style="margin-top:0"')+'>'+kv+'</div>':'')+'</div>';
}
function tableHtml(hd,rows){
  var n=rows.reduce(function(m,r){return Math.max(m,r.length)},0),h='<div class="g tw"><table>';
  if(hd){h+='<thead><tr>'+hd.map(function(c){return '<th>'+esc(c)+'</th>'}).join('')+'</tr></thead>'}
  h+='<tbody>'+rows.map(function(r){
    var ne=r.filter(function(c){return c!==''});
    if(!hd&&ne.length===1&&n>2){return '<tr class="sec"><td colspan="'+n+'">'+esc(ne[0])+'</td></tr>'}
    return '<tr>'+r.map(function(c){return '<td'+(c.length>40?' class="lg"':'')+'>'+esc(c)+'</td>'}).join('')+'</tr>'}).join('');
  return h+'</tbody></table></div>';
}
function demoList(){return[{name:'Synthèse',rows:51},{name:'Bilans Mensuel & Annuel',rows:24},{name:'Références & Force',rows:37},{name:'Récupération',rows:8},{name:'Musculation',rows:37},{name:'Paramètres',rows:14},{name:'Activity',rows:25},{name:'Body Measurements',rows:4},{name:'Nutrition',rows:2},{name:'Sleep',rows:8},{name:'Vitals',rows:8}]}
/* Données d'aperçu uniquement (hors Google) : dans ton lien Apps Script, ce sont tes vrais onglets qui s'affichent */
var DEMO={
 muscu:[['Date','Type de séance','Groupe musculaire','Exercice','Séries effectives','Répétitions (moy.)','Charge (kg)','RIR','Tonnage (kg)','Séries stimulantes','Cardio / Annexe (min)','Notes'],
  ['2026-11-04','Séance dos','Dos','Tirage Poitrine (Poulie)','2','10','55','1','1100','2','0',''],['2026-11-11','Séance dos','Dos','Tirage Poitrine (Poulie)','2','10','57,5','0,5','1150','2','0',''],['2026-11-18','Séance dos','Dos','Tirage Poitrine (Poulie)','2','10','65','0,5','1300','2','0',''],
  ['2026-11-22','Dos dimanche','Dos','Tirage Poitrine (Poulie)','2','10','60','0,3','1200','2','0',''],
  ['2026-11-22','Dos dimanche','Triceps','Extension Triceps (Poulie)','2','10','9,5','0,5','190','2','0',''],
  ['2026-11-23','Séances pec','Pectoraux','Développé Couché Décliné (Machine)','2','10,5','145','0','3060','2','0',''],
  ['2026-11-23','Séances pec','Biceps','Curl Pupitre (Machine)','2','11','47,5','0','1045','2','0',''],
  ['2026-11-23','Séances pec','Cardio','Tapis de Course','0','0','0','','0','0','15','']],
 synth:[['SUIVI MUSCULATION & RÉCUPÉRATION','','','',''],['Semaine en cours : du 23/11/2026 au 29/11/2026','','','',''],['INDICATEURS CLÉS DE FORME & RÉCUPÉRATION','','','',''],['FC Repos Moyenne','Sommeil Moyen','Tonnage Total','Séries Stimulantes','Statut Forme'],['50,7','9,9','10060','20','Normal'],['bpm (repos)','heures / nuit','kg cumulés','séries RIR ≤ 2','état physiologique'],['Recommandation d’entraînement :','Progression / Maintien : charge d’entraînement et capacités de récupération optimales.','','',''],['VOLUME HEBDOMADAIRE PAR GROUPE MUSCULAIRE','','','',''],['Groupe musculaire','Séries effectives','Séries stimulantes','Tonnage (kg)',''],['Pectoraux','6','6','5 140',''],['Biceps','6','6','2 290',''],['Dos','0','0','0','']],
 bilan:[['BILANS MENSUEL & ANNUEL','','','','',''],['SECTION 1 • BILAN ANNUEL CONSOLIDÉ','','','','',''],['Sommeil Moyen','FC Repos Moy.','Poids Moyen','Calories Moy.','Tonnage Annuel','Séries Stimulantes'],['9,1 h','51 bpm','78,9 kg','2 088 kcal','30 481 kg','72'],['SECTION 2 • SUIVI MENSUEL','','','','',''],['Mois','Sommeil moy. (h)','FC Repos moy.','Poids moy. (kg)','Tonnage total (kg)','Séries stimulantes'],['Novembre','9,1','51','78,9','30 481','72']],
 ref:[['RÉFÉRENCES PHYSIOLOGIQUES & STANDARDS DE FORCE','','','',''],['STANDARDS DE FORCE & INDICE D’AVANCÉE','','','',''],['Mouvement','Standard (kg)','1RM estimé (kg)','% vs 2 ans','Niveau'],['Tirage Poitrine (Poulie)','85 kg','86,7 kg','102,0 %','Intermédiaire'],['Développé Couché Décliné (Machine)','180 kg','213,3 kg','118,5 %','Avancé'],['Extension Triceps (Poulie)','16 kg','12,7 kg','79,4 %','Novice'],['Squat barre','130 kg','—','—','À tester']],
 recup:[['Date','Sommeil total (h)','Sommeil profond (h)','Sommeil REM (h)','FC au repos (bpm)','Poids matin (kg)','Statut Récupération','Pas','Calories (kcal)','Protéines (g)','Sodium (mg)','Glucides (g)','Lipides (g)'],
  ['2026-11-21','6,8 h','2,2 h','0,7 h','55,9','78,6','Normale','2 789','','',''],['2026-11-22','8,2 h','2,0 h','2,1 h','50,8','78,5','Optimale','12 889','','',''],['2026-11-23','9,9 h','4,0 h','1,2 h','50,7','','Optimale','4 625','2 094','169,9','1 833','207,5','69,8'],['2026-11-24','7,4 h','1,6 h','1,8 h','51,2','74,8','Normale','9 812','2 010','158','2 140','196','64']],
 param:[['Paramètre','Valeur','Unité','Description'],['Objectif poids','74,0','kg','Cible de poids corporel'],['Cible calories','1 900','kcal','Apport calorique journalier cible'],['Cible protéines','160','g','Apport protéique journalier cible'],['Plafond sodium','4 000','mg','Limite maximale de sodium journalier'],['Objectif hydratation','4,0','L','Volume hydrique quotidien cible']],
 activ:[['Date','Source(s)','Timezone','Steps','Distance (m)','Total Calories (kcal)'],['2026-11-20','com.hihonor.health','Europe/Paris','24 157','16 988','2 925'],['2026-11-22','com.hihonor.health','Europe/Paris','12 889','9 232','2 451']],
 body:[['Date/Time','Source(s)','Timezone','Weight (kg)'],['2026-11-16 13:00','com.hihonor.health','Europe/Paris','80.00'],['2026-11-18 14:40','com.hihonor.health','Europe/Paris','78.50']],
 nutri:[['Date','Source(s)','Timezone','Carbs (g)','Fat (g)','Fiber (g)','Protein (g)','Sodium (g)'],['2026-11-16','com.cronometer','Europe/Paris','203,3','69,8','34,2','170,5','1,84'],['2026-11-23','com.cronometer','Europe/Paris','207,5','69,8','37,4','169,9','1,83']],
 sleep:[['Date','Source(s)','Timezone','Light Sleep (min)','Deep Sleep (min)','REM Sleep (min)','Awake (min)'],['2026-11-21','com.hihonor.health','Europe/Paris','242','129','39','16'],['2026-11-23','com.hihonor.health','Europe/Paris','284','241','69','9']],
 vital:[['Date','Source(s)','Timezone','Resting heart rate min','Resting heart rate max','Resting heart rate avg'],['2026-11-22','com.hihonor.health','Europe/Paris','40.00','76.00','50.80'],['2026-11-23','com.hihonor.health','Europe/Paris','47.00','54.00','50.72']]
};
function demoSheet(n){n=n.toLowerCase();
  return DEMO[/muscu/.test(n)?'muscu':/synth/.test(n)?'synth':/bilan/.test(n)?'bilan':/r[ée]f/.test(n)?'ref':/r[ée]cup/.test(n)?'recup':/param/.test(n)?'param':/activ/.test(n)?'activ':/body/.test(n)?'body':/nutri/.test(n)?'nutri':/sleep/.test(n)?'sleep':'vital'];
}

var TT={week:'Semaine',force:'Entraînement',glow:'Glow up',bilan:'Bilans',data:'Données',moi:'Moi'},TAB='week',WEEKSUB='',SELIDX=null;
try{var _t=localStorage.getItem('forme_tab');if(_t!=null){SELIDX=+_t}}catch(e){}
function uname(){try{var n=localStorage.getItem('forme_name');return n==null?'Gino':n}catch(e){return 'Gino'}}
function greet(){var h=new Date().getHours(),n=uname().trim(),w=h<5?'Bonne nuit':h<18?'Bonjour':'Bonsoir',e=h<5?'🌙':h<12?'☀️':h<18?'👋':'🌙';return esc(w+(n?', '+n:''))+'<span class="emo">'+e+'</span>'}
function mood(){if(!D||demoMode&&!live()){return ''}var S=formScore();return S.v==null?'':S.v>=80?' · en pleine forme 💪':S.v>=60?' · journée régulière 👌':' · récupère bien 🧘'}
function today(){var t=new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});return t.charAt(0).toUpperCase()+t.slice(1)}
function setHead(){
  var nt=TAB==='week'?greet():esc(TAB==='data'?(CUR?CUR.name:'Données'):TAB==='moi'?(uname().trim()||'Moi'):TT[TAB]);if(setHead.l!==nt){var tl=$('#ttl');tl.innerHTML=nt;setHead.l=nt;var ln=tl.textContent.length;tl.style.setProperty('--fs',(ln<=13?34:Math.max(24,34-(ln-13)*1.7))+'px')}
  $('#sub').textContent=TAB==='week'?today()+(demoMode?' · démo':mood()):TAB==='data'?'Ta feuille Google, en direct':TAB==='moi'?'Ton profil, ton corps, ton matériel':WEEKSUB;
}
var THEME='dark';try{THEME=localStorage.getItem('forme_theme')||'dark'}catch(e){}
var ICS={sun:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',moon:'<svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>'};
function applyTheme(){
  var l=THEME==='light';document.body.classList.toggle('light',l);document.documentElement.classList.toggle('light',l);
  var m=document.querySelector('meta[name=theme-color]');if(m){m.content=l?'#EEF0F3':'#050506'}
  $('#thb').innerHTML=l?ICS.moon:ICS.sun;var sw=$('#tsw');if(sw){sw.classList.toggle('on',l)}
}
function toggleTheme(el){
  THEME=THEME==='light'?'dark':'light';try{localStorage.setItem('forme_theme',THEME)}catch(e){}
  function go(){applyTheme();if(D){renderWeek();renderForce();renderBilan();if(!live()){demoBanner()}}}
  var r=(el||$('#thb')).getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,R=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
  var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(document.startViewTransition&&!calm){
    var t=document.startViewTransition(go);
    t.ready.then(function(){
      document.documentElement.animate({clipPath:['circle(0px at '+x+'px '+y+'px)','circle('+R+'px at '+x+'px '+y+'px)']},{duration:1150,easing:'cubic-bezier(.65,0,.35,1)',pseudoElement:'::view-transition-new(root)'});
      document.documentElement.animate({opacity:[1,.6],filter:['blur(0px)','blur(2px)']},{duration:1150,easing:'ease-in',pseudoElement:'::view-transition-old(root)'});
    }).catch(function(){});
  }else{var h=document.documentElement;h.classList.add('tt');go();setTimeout(function(){h.classList.remove('tt')},950)}
}
applyTheme();
var MQV=window.matchMedia?matchMedia('(min-width:1100px)'):{matches:false};
function mv(b){var i=$('#ind');if(!b||!i){return}if(MQV.matches){i.style.width='';i.style.height=b.offsetHeight+'px';i.style.transform='translateY('+b.offsetTop+'px)'}else{i.style.height='';i.style.width=b.offsetWidth+'px';i.style.transform='translateX('+b.offsetLeft+'px)'}}
function chase(){var t0=performance.now(),b=$('nav button.on'),n=0;(function s(){if(n++%2===0){mv(b)}if(performance.now()-t0<700){requestAnimationFrame(s)}else{mv(b)}})()}
document.querySelectorAll('nav button').forEach(function(b){b.onclick=function(){calm();setTimeout(lqBuild,700);g3Wake&&setTimeout(g3Wake,400);
  document.querySelectorAll('nav button,.view').forEach(function(e){e.classList.remove('on')});
  b.classList.add('on');$('#v-'+b.dataset.t).classList.add('on');TAB=b.dataset.t;document.body.classList.toggle('tab-data',TAB==='data');if(TAB==='moi'){renderMoi();scanSources()};if(TAB==='glow'){renderGlow()}document.body.classList.toggle('navoff',b.classList.contains('navx'));
  if(TAB==='data'&&SL){renderData()}
  setHead();chase();window.scrollTo({top:0,behavior:'smooth'})}});
window.addEventListener('scroll',function(){$('#hd').classList.toggle('sc',window.scrollY>24)},{passive:true});
window.addEventListener('resize',function(){mv($('nav button.on'))});

function init(d){
  D=d;applyProfile();var R=d.reports;selM=R.cur;
  if(R.months[selM-1].n===0){for(var i=11;i>=0;i--){if(R.months[i].n>0){selM=i+1;break}}}
  renderWeek();renderForce();renderBilan();mv($('nav button.on'));setHead();
}
function demo(){
  demoMode=true;var n=new Date(),u=(n.getDay()+6)%7,c=Math.max(u,3),keys=[];
  for(var i=0;i<7;i++){keys.push(new Date(n.getTime()+(i-u)*864e5).toISOString().slice(0,10))}
  function m(a){return a.map(function(x,i){return i<=c?x:null})}
  var base={n:20,sessions:14,sets:212,stim:190,tonnage:131400,sleep:7.3,rhr:54,weight:74.9,kcal:2860,prot:162,sodium:3350,water:3.7,steps:9800,fibres:31,potassium:3350,magnesium:385,iron:11,zinc:10,weightLast:74.8};
  var MO=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],months=[];
  for(var k=1;k<=12;k++){months.push(k===11?Object.assign({m:k,label:MO[k-1]},base):{m:k,label:MO[k-1],n:0})}
  return{updated:'—',targets:{weight:74,kcal:1900,prot:160,sodium:4000,water:4,sleep:7,fibres:35,potassium:3500,magnesium:400,iron:11,zinc:11},
   week:{keys:keys,today:u,sleep:m([7.4,6.8,7.9,7.1,7.6,8.2,7.5]),deep:m([1.4,1.1,1.6,1.3,1.5,1.7,1.4]),rem:m([1.8,1.5,2,1.7,1.9,2.1,1.8]),rhr:m([54,55,53,54,52,52,53]),vfc:m([null,null,null,null,null,null,null]),spo2:m([null,null,null,null,null,null,null]),weight:m([75.1,75,74.8,74.9,74.7,74.6,74.8]),kcal:m([2890,2760,3010,2840,2920,3100,2800]),prot:m([158,149,166,155,160,171,152]),sodium:m([3300,2900,3700,3100,3450,4150,3000]),water:m([3.8,3.4,4.1,3.6,3.9,4.2,3.5]),stim:m([16,0,14,12,0,10,0]),tonnage:m([9850,0,11200,8600,0,7400,0]),
    muscles:[{n:'Pectoraux',s:12},{n:'Dos',s:14},{n:'Épaules',s:8},{n:'Biceps',s:6},{n:'Triceps',s:7},{n:'Quadriceps',s:10},{n:'Ischios',s:0},{n:'Mollets',s:0},{n:'Abdominaux',s:4}]},
   weights:[{d:keys[Math.min(c,6)],v:74.8},{d:keys[Math.max(c-1,0)],v:75.0},{d:keys[0],v:75.3},{d:new Date(n.getTime()-(u+3)*864e5).toISOString().slice(0,10),v:75.6},{d:new Date(n.getTime()-(u+6)*864e5).toISOString().slice(0,10),v:75.9}],
   force:{global:101.4,list:[{g:'Dos',n:'Tirage Poitrine (Poulie)',std:85,rm:86.7,pct:102,lvl:'Intermédiaire',last:{load:65,reps:10,rir:.5}},{g:'Pectoraux',n:'Développé Couché Décliné (Machine)',std:180,rm:213.3,pct:118.5,lvl:'Avancé',last:{load:145,reps:10.5,rir:0}},{g:'Pectoraux',n:'Chest Press (Machine)',std:100,rm:96,pct:96,lvl:'Intermédiaire',last:{load:80,reps:6,rir:0}},{g:'Triceps',n:'Extension Triceps (Poulie)',std:16,rm:12.7,pct:79.4,lvl:'Novice',last:{load:9.5,reps:10,rir:.5}},{g:'Pectoraux (Réf.)',n:'Développé couché barre',std:95,rm:null,pct:null,lvl:'À tester',last:null}]},
   sessions:[{d:keys[0],n:'Séances pec',sets:20,stim:20,t:10060,c:15},{d:keys[0].slice(0,8)+'18',n:'Séance dos',sets:22,stim:22,t:9400,c:0}],
   reports:{year:'2026',cur:11,months:months,yearAgg:base},status:{form:'Normal'}};
}
/* ---------- Analyses : semaine vs précédente, séries 🔥, records 🏆, calendrier ---------- */
var INS=null;
function sheetName(re,def){var s=SL&&SL.filter(function(x){return re.test(x.name)})[0];return s?s.name:def}
function colIdx(h,re){for(var i=0;i<h.length;i++){if(re.test(String(h[i]).toLowerCase())){return i}}return -1}
function addDays(k,n){var d=new Date(k+'T12:00:00');d.setDate(d.getDate()+n);return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function todayKey(){return addDays(new Date().getFullYear()+'-'+('0'+(new Date().getMonth()+1)).slice(-2)+'-'+('0'+new Date().getDate()).slice(-2),0)}
function vo2Activity(){if(!live()||!SL||!SL.some(function(x){return x.name==='Activity'})){return}getRaw('Activity',function(v){var b=VO2S;vo2FromSheet(v,1);if(VO2S!==b&&TAB==='week'&&D){renderWeek()}})}
function loadInsights(){
  INS=null;var got={};
  function done(){if('r' in got&&'m' in got&&D){INS=buildIns(got.r,got.m);WX=weekExtra(got.r);vo2FromSheet(got.r);renderWeek();computeTrophies(got.r,got.m);coachFromSheet();vo2Activity()}}
  getRaw(sheetName(/r[ée]cup/i,'Récupération'),function(v){got.r=v||null;done()});
  getRaw(sheetName(/muscu/i,'Musculation'),function(v){got.m=v||null;done()});
}
function buildIns(r,m){
  var t=D.targets,day={},tr={},ex={};
  if(r&&r.length>1){
    var h=r[0],c={d:colIdx(h,/^date/),sl:colIdx(h,/sommeil total/),hr:colIdx(h,/fc au repos|fc repos/),w:colIdx(h,/poids/),k:colIdx(h,/calories/),p:colIdx(h,/prot/)};
    r.slice(1).forEach(function(x){var k=toKey(x[c.d]);if(!k){return}var o=day[k]=day[k]||{};
      ['sl','hr','w','k','p'].forEach(function(f){if(c[f]>=0){var v=pn(x[c[f]]);if(v!=null&&v>0){o[f]=v}}})});
  }
  if(m&&m.length>1){
    var g=m[0],c2={d:colIdx(g,/^date/),e:colIdx(g,/exercice/),ch:colIdx(g,/charge/),re:colIdx(g,/r[ée]p/),to:colIdx(g,/tonnage/),st:colIdx(g,/stimul/),se:colIdx(g,/s[ée]ries eff/)};
    m.slice(1).forEach(function(x){var k=toKey(x[c2.d]);if(!k){return}
      var o=tr[k]=tr[k]||{t:0,s:0,n:0};o.t+=pn(x[c2.to])||0;o.s+=pn(x[c2.st])||0;o.n+=pn(x[c2.se])||0;
      var nm=String(x[c2.e]||'').trim(),L=pn(x[c2.ch]),R=pn(x[c2.re]);
      if(nm&&L&&R){var e=L*(1+R/30),q=ex[nm]=ex[nm]||{best:0,bd:'',days:{}};q.days[k]=1;if(e>q.best+0.01){q.best=e;q.bd=k}}});
  }
  var keys=D.week.keys,prev=keys.map(function(k){return addDays(k,-7)});
  function agg(ks){var a={sl:[],hr:[],p:[]},w=null,to=0,s=0,n=0;
    ks.forEach(function(k){var o=day[k]||{};['sl','hr','p'].forEach(function(f){if(o[f]!=null&&!(f==='sl'&&o[f]>12)){a[f].push(o[f])}});if(o.w!=null){w=o.w}
      var q=tr[k];if(q){to+=q.t;s+=q.s;if(q.n>0||q.t>0){n++}}});
    return{sl:avg(a.sl),hr:avg(a.hr),p:avg(a.p),w:w,t:to,s:s,n:n}}
  var tk=todayKey();
  function streak(test){var k=tk,n=0;if(!test(day[k])){k=addDays(k,-1)}for(var i=0;i<400&&test(day[k]);i++){n++;k=addDays(k,-1)}return n}
  var recs=Object.keys(ex).map(function(n){var q=ex[n];return{n:n,v:q.best,d:q.bd,s:Object.keys(q.days).length}}).filter(function(x){return x.d});
  var fresh=recs.filter(function(x){return x.s>=2&&x.d>=addDays(tk,-7)}).sort(function(a,b){return b.d<a.d?-1:1});
  var lastRec=recs.filter(function(x){return x.s>=2}).sort(function(a,b){return b.d<a.d?-1:1})[0]||null;
  return{cur:agg(keys),pre:agg(prev),sp:streak(function(o){return o&&o.p>=t.prot}),ss:streak(function(o){return o&&o.sl>=t.sleep&&o.sl<=12}),
    fresh:fresh,lastRec:lastRec,train:Object.keys(tr).filter(function(k){return tr[k].n>0||tr[k].t>0}),tk:tk};
}
function delta(c,p,dec,unit,good){
  if(c==null){return '<span class="dt">—</span>'}
  if(p==null||p===0&&c===0){return '<span class="dt">nouveau</span>'}
  var d=c-p,cl=Math.abs(d)<Math.pow(10,-dec)/2?'':(d>0)===(good>0)?'tok':'tko';
  return '<span class="dt '+cl+'">'+(d>0?'↑ ':d<0?'↓ ':'= ')+f(Math.abs(d),dec)+(unit?' '+unit:'')+'</span>';
}
function renderIns(){
  var el=$('#ins');if(!el||!INS){return}
  var I=INS,c=I.cur,p=I.pre,t=D.targets,wgood=(c.w!=null&&c.w>t.weight)?-1:1;
  var cmp=[['Sommeil 😴',c.sl==null?'—':hm(c.sl),delta(c.sl,p.sl,1,'h',1)],['FC repos ❤️',u(c.hr,0,'bpm'),delta(c.hr,p.hr,0,'bpm',-1)],['Poids ⚖️',u(c.w,1,'kg'),delta(c.w,p.w,1,'kg',wgood)],
    ['Tonnage 🏋️',f(c.t)+' kg',delta(c.t,p.t,0,'kg',1)],['Séries stimulantes',f(c.s),delta(c.s,p.s,0,'',1)],['Protéines 🥩',u(c.p,0,'g'),delta(c.p,p.p,0,'g',1)]];
  var h='<div class="g" style="margin-top:12px"><div class="lab" style="margin-bottom:4px">Cette semaine vs la précédente ↕️</div>'+cmp.map(function(r){return '<div class="row cmp"><span>'+r[0]+'</span><span>'+r[1]+r[2]+'</span></div>'}).join('')+'</div>';
  h+='<div class="grid">'+
    '<div class="g"><div class="lab">Séries en cours 🔥</div>'+
      '<div class="stk"><b>'+I.sp+'</b><span>jour'+(I.sp>1?'s':'')+' protéines ≥ '+f(t.prot)+' g</span></div>'+
      '<div class="stk"><b>'+I.ss+'</b><span>nuit'+(I.ss>1?'s':'')+' ≥ '+f(t.sleep)+' h</span></div>'+
      '<div class="stk"><b>'+c.n+'</b><span>séance'+(c.n>1?'s':'')+' cette semaine</span></div></div>'+
    '<div class="g"><div class="lab">Records 🏆</div>'+(I.fresh.length?I.fresh.slice(0,3).map(function(x){return '<div class="rec"><b>'+esc(x.n)+'</b><span class="tok">'+f(x.v,1)+' kg · '+dl(x.d)+'</span></div>'}).join(''):
      I.lastRec?'<div class="rec"><span>Aucun nouveau record cette semaine. Le dernier :</span><b>'+esc(I.lastRec.n)+'</b><span>'+f(I.lastRec.v,1)+' kg · '+dl(I.lastRec.d)+'</span></div>':'<div class="rec"><span>Tes records apparaîtront dès ta 2ᵉ séance sur un exercice.</span></div>')+'</div>'+
  '</div>';
  /* calendrier du mois */
  var tk=I.tk,y=+tk.slice(0,4),mo=+tk.slice(5,7),first=new Date(y,mo-1,1),off=(first.getDay()+6)%7,nd=new Date(y,mo,0).getDate(),set={},cnt=0;
  I.train.forEach(function(k){if(k.slice(0,7)===tk.slice(0,7)){set[+k.slice(8)]=1;cnt++}});
  var cal='';for(var i=0;i<off;i++){cal+='<i></i>'}
  for(var d=1;d<=nd;d++){var k=tk.slice(0,8)+('0'+d).slice(-2);cal+='<i class="'+(set[d]?'on':'')+(k===tk?' td':'')+(k>tk?' fu':'')+'">'+d+'</i>'}
  var mn=first.toLocaleDateString('fr-FR',{month:'long',year:'numeric'});
  h+='<div class="g" style="margin-top:12px"><div class="lab">Calendrier 🗓️ · '+mn+'</div><div class="cal hd"><i>L</i><i>M</i><i>M</i><i>J</i><i>V</i><i>S</i><i>D</i></div><div class="cal">'+cal+'</div><div class="note" style="margin-top:10px">'+cnt+' jour'+(cnt>1?'s':'')+' d’entraînement ce mois-ci</div></div>';
  el.innerHTML=h;
}

/* ---------- Photos : profil et suivi, gardées uniquement sur ce téléphone ---------- */
var DBP=null,PH=[];
function pdb(){if(!DBP){DBP=new Promise(function(res,rej){var r=indexedDB.open('forme',1);r.onupgradeneeded=function(){r.result.createObjectStore('photos',{keyPath:'id',autoIncrement:true})};r.onsuccess=function(){res(r.result)};r.onerror=function(){rej(r.error)}})}return DBP}
function ptx(mode,fn){return pdb().then(function(db){return new Promise(function(res,rej){var q=fn(db.transaction('photos',mode).objectStore('photos'));q.onsuccess=function(){res(q.result)};q.onerror=function(){rej(q.error)}})})}
function pLoad(){return ptx('readonly',function(s){return s.getAll()}).then(function(a){PH=(a||[]).sort(function(x,y){return x.date<y.date?-1:x.date>y.date?1:x.id-y.id});paintAvatar();renderPhotosCard()}).catch(function(){})}
function avatarPh(){var a=PH.filter(function(p){return p.type==='profil'});return a.length?a[a.length-1]:null}
function suivi(){return PH.filter(function(p){return p.type==='suivi'})}
function paintAvatar(){var a=avatarPh(),b=$('#avb'),nv=$('#navav'),n=uname().trim();if(b){b.innerHTML=a?'<img src="'+a.img+'" alt="">':'<span>'+esc((n||'?').charAt(0).toUpperCase())+'</span>'}if(nv){nv.innerHTML=a?'<img src="'+a.img+'" alt="">':'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>';nv.classList.toggle('ph',!!a)}}
function shrink(file,max,square){return new Promise(function(res,rej){var img=new Image(),u=URL.createObjectURL(file);
  img.onload=function(){var w=img.naturalWidth,h=img.naturalHeight,sx=0,sy=0,sw=w,sh=h;if(square){var m=Math.min(w,h);sx=(w-m)/2;sy=(h-m)/2;sw=sh=m}
    var sc=Math.min(1,max/Math.max(sw,sh)),cv=document.createElement('canvas');cv.width=Math.round(sw*sc);cv.height=Math.round(sh*sc);
    cv.getContext('2d').drawImage(img,sx,sy,sw,sh,0,0,cv.width,cv.height);URL.revokeObjectURL(u);res(cv.toDataURL('image/jpeg',.82))};
  img.onerror=function(){rej(new Error('Image illisible'))};img.src=u})}
function pickPhoto(kind){
  var i=document.createElement('input');i.type='file';i.accept='image/*';
  i.onchange=function(){var fl=i.files&&i.files[0];if(!fl){return}toast('Ajout de la photo…');
    shrink(fl,kind==='profil'?480:1280,kind==='profil').then(function(img){
      var w=D&&D.weights&&D.weights.length?D.weights[0].v:null,old=kind==='profil'?PH.filter(function(p){return p.type==='profil'}):[];
      return Promise.all(old.map(function(o){return ptx('readwrite',function(s){return s.delete(o.id)})})).then(function(){return ptx('readwrite',function(s){return s.add({type:kind,date:todayKey(),w:w,img:img})})});
    }).then(pLoad).then(function(){toast(kind==='profil'?'Photo de profil mise à jour':'Photo ajoutée 📸');if(TAB==='moi'){renderMoi()}computeTrophies()})
    .catch(function(e){toast('Impossible d’ajouter la photo')})};
  i.click();
}
function delPhoto(id){ptx('readwrite',function(s){return s.delete(id)}).then(pLoad).then(function(){toast('Photo supprimée');closeSh();if(TAB==='moi'){renderMoi()}})}
function renderPhotosCard(){
  var el=$('#phc');if(!el){return}var s=suivi();
  el.innerHTML='<div class="g tap full" onclick="goTab(\'moi\')"><div class="lab">Photos de suivi 📸</div>'+(s.length?
    '<div class="thr">'+s.slice(-3).reverse().map(function(p){return '<div><img src="'+p.img+'" alt=""><span>'+dl(p.date)+'</span></div>'}).join('')+'</div><div class="note" style="margin-top:10px">'+s.length+' photo'+(s.length>1?'s':'')+(s.length>1?' · touche pour comparer avant / maintenant':'')+'</div>':
    '<div class="note" style="margin-top:8px;line-height:1.5">Ajoute une photo de temps en temps pour voir ton évolution. Elles restent uniquement sur ce téléphone.</div><button class="g pill" style="margin-top:12px;padding:11px 16px" onclick="event.stopPropagation();pickPhoto(\'suivi\')">＋ Ajouter une photo</button>')+'</div>';
}
function cmpHtml(a,b){
  return '<div class="cmpx" id="cx"><img src="'+b.img+'" alt=""><img class="bf" id="cxb" src="'+a.img+'" alt=""><i id="cxl"></i>'+
    '<span class="l">Avant · '+dl(a.date)+(a.w?' · '+f(a.w,1)+' kg':'')+'</span><span class="r">Maintenant · '+dl(b.date)+(b.w?' · '+f(b.w,1)+' kg':'')+'</span></div>'+
    '<input type="range" min="0" max="100" value="50" class="rng" oninput="var v=this.value;$(\'#cxb\').style.clipPath=\'inset(0 \'+(100-v)+\'% 0 0)\';$(\'#cxl\').style.left=v+\'%\'">';
}
function openProfile(keep){
  var a=avatarPh(),s=suivi(),n=uname().trim(),sc=$('#sh').scrollTop;
  openSh('<div id="prof"><div class="sh-h"><div class="lab" style="font-size:15px">Profil</div><button class="gb" onclick="closeSh()" aria-label="Fermer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'+
    '<div style="text-align:center;margin:4px 0 18px"><button class="avl" onclick="pickPhoto(\'profil\')">'+(a?'<img src="'+a.img+'" alt="">':'<span>'+esc((n||'?').charAt(0).toUpperCase())+'</span>')+'<em>✎</em></button>'+
    '<div class="big" style="font-size:28px;margin:12px 0 2px">'+esc(n||'Toi')+'</div><div class="note">Objectif '+(D?f(D.targets.weight,1):'74,0')+' kg'+(D&&D.weights.length?' · actuellement '+f(D.weights[0].v,1)+' kg':'')+'</div></div>'+
    '<div class="sh-h" style="margin:8px 0 10px"><b style="font-size:17px">Photos de suivi 📸</b><button class="g pill" style="padding:9px 14px" onclick="pickPhoto(\'suivi\')">＋ Ajouter</button></div>'+
    (s.length>=2?cmpHtml(s[0],s[s.length-1]):'')+
    (s.length?'<div class="pgr">'+s.slice().reverse().map(function(p){return '<div onclick="viewPhoto('+p.id+')"><img src="'+p.img+'" alt=""><span>'+dl(p.date)+(p.w?' · '+f(p.w,1)+' kg':'')+'</span></div>'}).join('')+'</div>':
      '<div class="g" style="text-align:center;line-height:1.5"><div style="font-size:30px">📸</div>Prends une photo aujourd’hui, puis une toutes les 2 à 4 semaines, même lumière et même pose. Tu pourras comparer avant / maintenant.</div>')+
    '<div class="note" style="margin:14px 4px 18px;line-height:1.5">🔒 Tes photos restent uniquement sur ce téléphone : elles ne sont envoyées ni sur GitHub ni dans ta feuille Google. Si tu effaces les données de Chrome, elles sont supprimées.</div>'+
    '<button class="g setrow tap" style="width:100%;text-align:left" onclick="openSet()"><div><b style="font-weight:600">Réglages et connexion ⚙️</b><div class="note">Prénom, mode clair, lien de ta feuille</div></div><svg viewBox="0 0 24 24" style="width:18px;height:18px;color:var(--m)"><path d="M9 6l6 6-6 6"/></svg></button></div>');
  document.body.classList.add('full');if(keep){$('#sh').scrollTop=sc}
}
function viewPhoto(id){
  var p=PH.filter(function(x){return x.id===id})[0];if(!p){return}
  openSh('<div class="sh-h"><button class="gb" onclick="closeSh()" aria-label="Retour"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button><div class="lab" style="font-size:15px">'+dl(p.date)+' '+p.date.slice(0,4)+(p.w?' · '+f(p.w,1)+' kg':'')+'</div><button class="gb" onclick="closeSh()" aria-label="Fermer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'+
    '<img src="'+p.img+'" alt="" style="width:100%;border-radius:24px;display:block;margin-top:6px">'+
    '<button class="g pill" style="width:100%;margin-top:14px;padding:13px;color:var(--ko)" onclick="if(confirmDel('+p.id+',this)){}">Supprimer cette photo</button>');
  document.body.classList.add('full');
}
function confirmDel(id,b){if(b.dataset.ok){delPhoto(id);return true}b.dataset.ok=1;b.textContent='Touche encore pour confirmer';setTimeout(function(){if(b){b.textContent='Supprimer cette photo';delete b.dataset.ok}},3000);return false}


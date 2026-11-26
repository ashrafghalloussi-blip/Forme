/* Forme · seance.js · Catalogue d’exercices, historique et saisie des séances */
/* =====================================================================
   Nouveaux mouvements animés
   ===================================================================== */
Object.assign(EXP,{
 pushup:{A:{H:[21,47],S:[30,52],P:[60,60],K:[74,70],F:[88,84],E:[30,68],W:[30,84]},B:{H:[21,68],S:[30,72],P:[60,75],K:[74,80],E:[42,72]},st:'',eq:[]},
 dips:{A:{H:[50,14],S:[50,24],P:[50,52],K:[57,66],F:[49,74],E:[42,34],W:[38,44]},B:{H:[50,27],S:[50,37],P:[50,65],K:[57,79],F:[49,86],E:[34,32]},
   st:'<rect x="30" y="44" width="40" height="3" rx="1.5"/><path d="M34 47v39M66 47v39"/>',eq:[]},
 lunge:{A:{H:[50,12],S:[50,22],P:[50,50],K:[56,67],F:[58,84],K2:[46,67],F2:[42,84],E:[48,36],W:[48,51]},B:{H:[50,25],S:[50,35],P:[50,62],K:[66,66],F:[68,84],K2:[42,80],F2:[28,84],E:[48,49],W:[48,64]},st:'',eq:[['db','W']]},
 hipthrust:{A:{H:[18,52],S:[27,56],P:[50,78],K:[66,62],F:[70,84],E:[38,64],W:[48,74]},B:{P:[50,58],K:[67,58],E:[38,56],W:[50,55]},
   st:'<rect x="10" y="58" width="24" height="5" rx="2"/><path d="M14 63v21M30 63v21"/>',eq:[['plate','W',7]]},
 lateral:{A:{H:[50,12],S:[50,22],P:[50,52],K:[46,68],F:[46,84],K2:[54,68],F2:[54,84],E:[45,38],W:[45,52],E2:[55,38],W2:[55,52]},B:{E:[34,25],W:[19,23],E2:[66,25],W2:[81,23]},st:'',eq:[['db','W'],['db','W2']]},
 reardelt:{A:{H:[70,32],S:[62,37],P:[40,50],K:[44,67],F:[46,84],E:[61,52],W:[60,64]},B:{E:[56,34],W:[52,26]},st:'',eq:[['db','W']]},
 facepull:{A:{H:[44,12],S:[44,22],P:[44,52],K:[45,68],F:[44,84],E:[57,24],W:[71,20]},B:{E:[36,20],W:[52,13]},st:'',eq:[['cable','W',[97,18]],['grip','W']]},
 shrug:{A:{H:[50,13],S:[50,23],P:[50,52],K:[50,68],F:[50,84],E:[49,39],W:[49,55]},B:{H:[50,9],S:[50,18],E:[49,34],W:[49,50]},st:'',eq:[['db','W']]},
 pullover:{A:{H:[22,52],S:[30,54],P:[60,54],K:[74,46],F:[80,84],E:[16,50],W:[4,58]},B:{E:[28,38],W:[30,22]},
   st:'<rect x="18" y="58" width="52" height="5" rx="2"/><path d="M24 63v21M64 63v21"/>',eq:[['db','W']]},
 plank:{A:{H:[21,56],S:[30,60],P:[58,66],K:[74,76],F:[88,84],E:[30,84],W:[42,84]},B:{H:[21,54],S:[30,58],P:[58,62]},smooth:1,dur:3,st:'',eq:[]},
 dbrow:{A:{H:[26,36],S:[34,40],P:[62,44],K:[64,60],F:[80,60],K2:[56,67],F2:[54,84],E:[38,56],W:[38,72]},B:{E:[50,42],W:[42,56]},
   st:'<rect x="58" y="60" width="30" height="4" rx="2"/><path d="M62 64v20M84 64v20"/>',eq:[['db','W']]},
 adductor:{A:{H:[50,18],S:[50,28],P:[50,58],K:[34,62],F:[30,82],K2:[66,62],F2:[70,82],E:[42,44],W:[40,58],E2:[58,44],W2:[60,58]},B:{K:[44,62],F:[44,82],K2:[56,62],F2:[56,82]},smooth:1,
   st:'<rect x="38" y="60" width="24" height="4" rx="2"/><rect x="44" y="18" width="12" height="42" rx="3"/>',eq:[]}
});

/* =====================================================================
   Catalogue d'exercices  [nom, groupe, matériel, animation]
   ===================================================================== */
var CAT=[
 ['Développé Couché (Barre)','Pectoraux','Barre','bench'],['Développé Couché (Haltères)','Pectoraux','Haltères','bench'],['Développé Incliné (Barre)','Pectoraux','Barre','bench'],
 ['Développé Incliné (Haltères)','Pectoraux','Haltères','bench'],['Développé Décliné (Barre)','Pectoraux','Barre','bench'],['Développé Couché Décliné (Machine)','Pectoraux','Machine','chest'],
 ['Chest Press (Machine)','Pectoraux','Machine','chest'],['Développé Incliné (Machine)','Pectoraux','Machine','chest'],['Développé Couché (Smith)','Pectoraux','Machine','bench'],
 ['Écarté (Haltères)','Pectoraux','Haltères','bench'],['Écarté (Poulie)','Pectoraux','Poulie','chest'],['Pec Deck (Machine)','Pectoraux','Machine','chest'],
 ['Pompes','Pectoraux','Poids du corps','pushup'],['Dips (Pectoraux)','Pectoraux','Poids du corps','dips'],
 ['Tractions','Dos','Poids du corps','pull'],['Tractions Assistées (Machine)','Dos','Machine','pull'],['Tirage Poitrine (Poulie)','Dos','Poulie','pull'],
 ['Tirage Prise Serrée (Poulie)','Dos','Poulie','pull'],['Tirage Vertical (Machine)','Dos','Machine','pull'],['Rowing (Barre)','Dos','Barre','row'],
 ['Rowing Unilatéral (Haltère)','Dos','Haltères','dbrow'],['Tirage Horizontal (Poulie)','Dos','Poulie','row'],['Rowing Assis (Machine)','Dos','Machine','row'],
 ['Rowing T-Bar','Dos','Barre','row'],['Pull-over (Poulie)','Dos','Poulie','pullover'],['Pull-over (Haltère)','Dos','Haltères','pullover'],
 ['Soulevé de Terre (Barre)','Dos','Barre','hinge'],['Extension Lombaire','Dos','Poids du corps','hinge'],
 ['Développé Militaire (Barre)','Épaules','Barre','ohp'],['Développé Épaules (Haltères)','Épaules','Haltères','ohp'],['Développé Épaules (Machine)','Épaules','Machine','ohp'],
 ['Développé Arnold (Haltères)','Épaules','Haltères','ohp'],['Élévations Latérales (Haltères)','Épaules','Haltères','lateral'],['Élévations Latérales (Poulie)','Épaules','Poulie','lateral'],
 ['Élévations Latérales (Machine)','Épaules','Machine','lateral'],['Élévations Frontales (Haltères)','Épaules','Haltères','lateral'],['Oiseau (Haltères)','Épaules','Haltères','reardelt'],
 ['Reverse Pec Deck (Machine)','Épaules','Machine','reardelt'],['Face Pull (Poulie)','Épaules','Poulie','facepull'],['Shrugs (Haltères)','Épaules','Haltères','shrug'],
 ['Shrugs (Barre)','Épaules','Barre','shrug'],['Rowing Menton (Barre)','Épaules','Barre','shrug'],
 ['Curl (Barre)','Biceps','Barre','curl'],['Curl (Haltères)','Biceps','Haltères','curl'],['Curl Marteau (Haltères)','Biceps','Haltères','curl'],
 ['Curl Pupitre (Machine)','Biceps','Machine','curl'],['Curl Pupitre (Barre EZ)','Biceps','Barre','curl'],['Curl Incliné (Haltères)','Biceps','Haltères','curl'],
 ['Curl (Poulie)','Biceps','Poulie','curl'],['Curl Concentré (Haltère)','Biceps','Haltères','curl'],
 ['Extension Triceps (Poulie)','Triceps','Poulie','tri'],['Extension Triceps Corde (Poulie)','Triceps','Poulie','tri'],['Extension Nuque (Haltère)','Triceps','Haltères','tri'],
 ['Barre au Front (Barre EZ)','Triceps','Barre','tri'],['Kickback (Haltère)','Triceps','Haltères','tri'],['Dips (Triceps)','Triceps','Poids du corps','dips'],
 ['Dips sur Banc','Triceps','Poids du corps','dips'],['Développé Couché Prise Serrée (Barre)','Triceps','Barre','bench'],['Extension Triceps (Machine)','Triceps','Machine','tri'],
 ['Squat (Barre)','Quadriceps','Barre','squat'],['Front Squat (Barre)','Quadriceps','Barre','squat'],['Squat Goblet (Haltère)','Quadriceps','Haltères','squat'],
 ['Squat (Smith)','Quadriceps','Machine','squat'],['Presse à Cuisses (Machine)','Quadriceps','Machine','squat'],['Hack Squat (Machine)','Quadriceps','Machine','squat'],
 ['Leg Extension (Machine)','Quadriceps','Machine','legext'],['Fentes (Haltères)','Quadriceps','Haltères','lunge'],['Fentes Bulgares (Haltères)','Quadriceps','Haltères','lunge'],
 ['Fentes Marchées (Haltères)','Quadriceps','Haltères','lunge'],['Step-up (Haltères)','Quadriceps','Haltères','lunge'],['Adducteurs (Machine)','Quadriceps','Machine','adductor'],
 ['Soulevé de Terre Roumain (Barre)','Ischios','Barre','hinge'],['Soulevé de Terre Roumain (Haltères)','Ischios','Haltères','hinge'],['Leg Curl Allongé (Machine)','Ischios','Machine','legcurl'],
 ['Leg Curl Assis (Machine)','Ischios','Machine','legcurl'],['Good Morning (Barre)','Ischios','Barre','hinge'],['Nordic Curl','Ischios','Poids du corps','legcurl'],
 ['Hip Thrust (Barre)','Ischios','Barre','hipthrust'],['Hip Thrust (Machine)','Ischios','Machine','hipthrust'],['Pont Fessier','Ischios','Poids du corps','hipthrust'],
 ['Abducteurs (Machine)','Ischios','Machine','adductor'],['Kickback Fessier (Poulie)','Ischios','Poulie','hipthrust'],
 ['Mollets Debout (Machine)','Mollets','Machine','calf'],['Mollets Assis (Machine)','Mollets','Machine','calf'],['Mollets à la Presse','Mollets','Machine','calf'],['Mollets (Haltères)','Mollets','Haltères','calf'],
 ['Crunch','Abdominaux','Poids du corps','crunch'],['Crunch (Poulie)','Abdominaux','Poulie','crunch'],['Crunch (Machine)','Abdominaux','Machine','crunch'],
 ['Relevés de Jambes','Abdominaux','Poids du corps','crunch'],['Russian Twist','Abdominaux','Poids du corps','crunch'],['Gainage','Abdominaux','Poids du corps','plank'],
 ['Gainage Latéral','Abdominaux','Poids du corps','plank'],['Roue Abdominale','Abdominaux','Poids du corps','plank'],
 ['Tapis de Course','Cardio','Machine','run'],['Marche Inclinée (Tapis)','Cardio','Machine','run'],['Vélo','Cardio','Machine','run'],['Elliptique','Cardio','Machine','run'],
 ['Rameur','Cardio','Machine','run'],['Stepper','Cardio','Machine','run'],['Corde à Sauter','Cardio','Poids du corps','run']
];
var GRPS=['Pectoraux','Dos','Épaules','Biceps','Triceps','Quadriceps','Ischios','Mollets','Abdominaux','Cardio'];
var GRPLAB={Ischios:'Ischios & fessiers'};
var CATK={};CAT.forEach(function(c){CATK[c[0].toLowerCase()]=c[3]});
function myEx(){try{return JSON.parse(localStorage.getItem('forme_myex')||'[]')}catch(e){return[]}}
myEx().forEach(function(c){CATK[c[0].toLowerCase()]=c[3]});
var _exKind=exKind;
exKind=function(n,g){
  var l=(n||'').toLowerCase().trim();if(CATK[l]){return CATK[l]}
  if(/pompe|push.?up/.test(l)){return 'pushup'}if(/\bdips\b/.test(l)){return 'dips'}if(/fente|bulgare|step.?up/.test(l)){return 'lunge'}
  if(/hip thrust|pont fessier|kickback fessier/.test(l)){return 'hipthrust'}if(/[ée]l[ée]vations? (lat[ée]rale|frontale)/.test(l)){return 'lateral'}
  if(/oiseau|reverse pec|rear delt/.test(l)){return 'reardelt'}if(/face.?pull/.test(l)){return 'facepull'}if(/shrug|haussement|rowing menton/.test(l)){return 'shrug'}
  if(/pull.?over/.test(l)){return 'pullover'}if(/gainage|planche|roue abdo/.test(l)){return 'plank'}if(/rowing (unilat|halt)/.test(l)){return 'dbrow'}
  if(/adducteur|abducteur/.test(l)){return 'adductor'}
  return _exKind(n,g);
};
function isCardio(n,g){return /cardio/i.test(g||'')||exKind(n,g)==='run'}

/* =====================================================================
   Historique (onglets Musculation et Séries)
   ===================================================================== */
var SEH=null;
function seriesName(){var s=SL&&SL.filter(function(x){return /^s[ée]ries$/i.test(x.name.trim())})[0];return s?s.name:null}
function loadHist(cb){
  var got={},mn=sheetName(/muscu/i,'Musculation'),sn=seriesName();
  function done(){if('m' in got&&'s' in got){SEH=buildHist(got.m,got.s);cb&&cb(SEH)}}
  getRaw(mn,function(v){got.m=v||null;done()});
  if(sn){getRaw(sn,function(v){got.s=v||null;done()})}else{got.s=LOCALSER.length?[['Date','Séance','Exercice','Groupe','Série','Charge (kg)','Répétitions','RIR','Repos (s)']].concat(LOCALSER):null;done()}
}
var LOCALSER=[];
function buildHist(m,s){
  var E={},names={};
  function ex(n,g){var k=n.toLowerCase().trim();if(!E[k]){E[k]={n:n,g:g||'',sessions:{},maxC:0,bestE:0,repsAt:[]}}if(g&&!E[k].g){E[k].g=g}names[k]=1;return E[k]}
  if(m&&m.length>1){var h=m[0],c={d:colIdx(h,/^date/),e:colIdx(h,/exercice/),g:colIdx(h,/groupe/),n:colIdx(h,/s[ée]ries eff/),r:colIdx(h,/r[ée]p/),L:colIdx(h,/charge/),i:colIdx(h,/^rir/),ca:colIdx(h,/cardio/),t:colIdx(h,/type de s|s[ée]ance/)};
    m.slice(1).forEach(function(x){var d=toKey(x[c.d]),n=String(x[c.e]||'').trim();if(!d||!n){return}var q=ex(n,c.g>=0?String(x[c.g]||''):''),ns=pn(x[c.n])||0,R=pn(x[c.r]),L=pn(x[c.L]),I=c.i>=0?pn(x[c.i]):null,ca=c.ca>=0?pn(x[c.ca]):null;
      var S=q.sessions[d]=q.sessions[d]||{sets:[],agg:true,min:0,name:c.t>=0?String(x[c.t]||''):''};
      if(ca){S.min+=ca}
      if(ns>0&&R){for(var j=0;j<ns;j++){S.sets.push({c:L||0,r:R,i:I})}}
      if(L&&R){q.maxC=Math.max(q.maxC,L);q.bestE=Math.max(q.bestE,L*(1+R/30));q.repsAt.push([L,R])}});}
  if(s&&s.length>1){var h2=s[0],c2={d:colIdx(h2,/^date/),e:colIdx(h2,/exercice/),g:colIdx(h2,/groupe/),L:colIdx(h2,/charge/),r:colIdx(h2,/r[ée]p/),i:colIdx(h2,/^rir/),p:colIdx(h2,/repos/),t:colIdx(h2,/^s[ée]ance/)},seen={};
    s.slice(1).forEach(function(x){var d=toKey(x[c2.d]),n=String(x[c2.e]||'').trim();if(!d||!n){return}var q=ex(n,c2.g>=0?String(x[c2.g]||''):''),key=d;
      if(!seen[n+d]){seen[n+d]=1;var pv=q.sessions[key]||{};q.sessions[key]={sets:[],agg:false,min:pv.min||0,name:(c2.t>=0&&String(x[c2.t]||'').trim())||pv.name||''}}
      var L=pn(x[c2.L])||0,R=pn(x[c2.r]),I=c2.i>=0?pn(x[c2.i]):null,P=c2.p>=0?pn(x[c2.p]):null;if(!R){return}
      q.sessions[key].sets.push({c:L,r:R,i:I,p:P});if(L){q.maxC=Math.max(q.maxC,L);q.bestE=Math.max(q.bestE,L*(1+R/30))}q.repsAt.push([L,R])});}
  var sesNames={};if(m&&m.length>1){var ht=colIdx(m[0],/type de s|s[ée]ance/);if(ht>=0){m.slice(1).forEach(function(x){var v=String(x[ht]||'').trim();if(v){sesNames[v]=(sesNames[v]||0)+1}})}}
  return{E:E,ses:Object.keys(sesNames).sort(function(a,b){return sesNames[b]-sesNames[a]}).slice(0,8)};
}
function histOf(n){return SEH&&SEH.E[n.toLowerCase().trim()]||null}
function lastSession(n,before){var q=histOf(n);if(!q){return null}var ks=Object.keys(q.sessions).sort().filter(function(k){return !before||k<before});if(!ks.length){return null}var d=ks[ks.length-1];return{d:d,s:q.sessions[d]}}
function summSets(sets){
  if(!sets||!sets.length){return ''}var same=sets.every(function(x){return x.c===sets[0].c&&x.r===sets[0].r});
  if(same){return sets.length+' × '+f(sets[0].r,sets[0].r%1?1:0)+(sets[0].c?' à '+f(sets[0].c,sets[0].c%1?1:0)+' kg':'')}
  return sets.map(function(x){return (x.c?f(x.c,x.c%1?1:0)+'×':'')+f(x.r,x.r%1?1:0)}).join(' · ');
}

/* =====================================================================
   Éditeur de séance
   ===================================================================== */
var SE=null,SEV='edit',SEQ='',SEG='Tous';
function seSave(){try{localStorage.setItem(SE&&SE.edit?'forme_draft_edit':'forme_draft',JSON.stringify(SE))}catch(e){}}
function favs(){try{return JSON.parse(localStorage.getItem('forme_fav')||'[]')}catch(e){return[]}}
function openSeance(){
  try{SE=JSON.parse(localStorage.getItem('forme_draft')||'null')}catch(e){SE=null}
  if(!SE){SE={date:todayKey(),name:'',ex:[],fat:0,notes:'',id:Date.now().toString(36)+Math.random().toString(36).slice(2,6)}}
  SEV='edit';openSh('<div id="se"></div>');document.body.classList.add('full');seRender();
  if(!SEH){loadHist(function(){if($('#se')){seRender()}})}
}
function seRender(){
  var el=$('#se');if(!el){return}
  if(SEV==='pick'){return pickRender()}
  var nS=0,ton=0;SE.ex.forEach(function(e){e.sets.forEach(function(s){var c=pn(s.c)||0,r=pn(s.r)||0;if(r>0){nS++;ton+=c*r}})});
  var sug=SEH&&SEH.ses.length?'<div class="pills" style="margin:8px -16px 0">'+SEH.ses.map(function(n,i){return '<button class="pill'+(SE.name===n?' on':'')+'" onclick="SE.name=SEH.ses['+i+'];seSave();seRender()">'+esc(n)+'</button>'}).join('')+'</div>':'';
  el.innerHTML='<div class="sh-h"><div class="big" style="font-size:28px;margin:0">'+(SE.edit?'Modifier la séance':'Nouvelle séance 🏋️')+'</div><button class="gb" onclick="closeSh()" aria-label="Fermer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'+
   '<div class="note" style="margin:0 4px 14px">'+(SE.edit?'Corrige ce que tu veux, change la date si besoin, puis enregistre : ta feuille sera mise à jour.':'Note ce que tu as fait : Forme calcule le reste. Ton brouillon est gardé si tu fermes.')+'</div>'+
   '<div class="sef"><label><span>Date</span><input class="g srch" type="date" value="'+SE.date+'" onchange="SE.date=this.value;seSave()"></label><label><span>Nom de la séance</span><input class="g srch" value="'+esc(SE.name)+'" placeholder="Ex. Pecs-épaules" oninput="SE.name=this.value;seSave()"></label></div>'+sug+
   (SE.ex.length?SE.ex.map(exBlock).join(''):'<div class="g seempty"><div style="font-size:34px">🏋️</div><b>Ajoute ton premier exercice</b><div class="note">Cherche dans le catalogue ou dans tes exercices habituels.</div></div>')+
   '<button class="g pill seadd" onclick="SEV=\'pick\';SEQ=\'\';seRender()">＋ Ajouter un exercice</button>'+
   (SE.ex.length?'<div class="lab" style="margin:22px 4px 8px">Comment tu te sentais ?</div><div class="sefat">'+[['😵','Épuisé'],['😩','Fatigué'],['😐','Normal'],['🙂','Bien'],['💪','En forme']].map(function(x,i){return '<button class="g'+(SE.fat===i+1?' on':'')+'" onclick="SE.fat='+(i+1)+';seSave();seRender()"><span>'+x[0]+'</span><small>'+x[1]+'</small></button>'}).join('')+'</div>'+
   '<div class="lab" style="margin:16px 4px 6px">Notes (facultatif)</div><textarea class="g srch" rows="2" placeholder="Sensations, douleur, matériel…" oninput="SE.notes=this.value;seSave()">'+esc(SE.notes||'')+'</textarea>'+
   '<div class="sesum"><span><b>'+SE.ex.length+'</b> exercice'+(SE.ex.length>1?'s':'')+'</span><span><b>'+nS+'</b> séries</span><span><b>'+f(ton)+'</b> kg</span></div>'+
   '<div id="sem" class="note tko" style="text-align:center;min-height:18px;margin:6px 0"></div><button class="obgo" onclick="seFinish(this)">'+(SE.edit?'Enregistrer les modifications':'Enregistrer la séance')+'</button>'+
   (SE.edit?'<button class="note" style="display:block;margin:14px auto 0" onclick="localStorage.removeItem(\'forme_draft_edit\');openSession(SE.edit)">Annuler les modifications</button>':'<button class="note" style="display:block;margin:14px auto 0" onclick="if(this.dataset.ok){localStorage.removeItem(\'forme_draft\');closeSh()}else{this.dataset.ok=1;this.textContent=\'Touche encore pour effacer le brouillon\'}">Effacer le brouillon</button>'):'');
}
function exBlock(e,i){
  var L=lastSession(e.n,SE&&SE.edit),q=histOf(e.n),card=e.cardio;
  var last=L?'<div class="selast"><span>Dernière fois · '+dl(L.d)+'</span><b>'+(card?(L.s.min?f(L.s.min)+' min':'—'):summSets(L.s.sets)||'—')+'</b>'+(!card&&L.s.sets.length?'<button onclick="seCopy('+i+')">Reprendre</button>':'')+'</div>':(SEH?'<div class="selast"><span>Première fois sur cet exercice ✨</span></div>':'');
  var body=card?'<div class="serow sec"><span>Durée</span><input inputmode="decimal" value="'+esc(e.min||'')+'" placeholder="min" oninput="SE.ex['+i+'].min=this.value;seSave()"><em>minutes</em></div>':
    '<div class="sehd"><span>Série</span><span>Charge</span><span>Reps</span><span>RIR</span><span>Repos</span><span></span></div>'+
    e.sets.map(function(s,j){var pr=q&&pn(s.c)>q.maxC&&pn(s.r)>0;return '<div class="serow"><b>'+(j+1)+'</b>'+
      '<input inputmode="decimal" value="'+esc(s.c)+'" placeholder="kg" oninput="seSet('+i+','+j+',\'c\',this)">'+
      '<input inputmode="numeric" value="'+esc(s.r)+'" placeholder="0" oninput="seSet('+i+','+j+',\'r\',this)">'+
      '<input inputmode="decimal" value="'+esc(s.i)+'" placeholder="–" oninput="seSet('+i+','+j+',\'i\',this)">'+
      '<input inputmode="numeric" value="'+esc(s.p)+'" placeholder="s" oninput="seSet('+i+','+j+',\'p\',this)">'+
      '<button onclick="seDelSet('+i+','+j+')" aria-label="Supprimer la série">✕</button></div>'+(pr?'<div class="sepr">🔥 Au-dessus de ton record ('+f(q.maxC,q.maxC%1?1:0)+' kg)</div>':'')}).join('')+
    '<button class="g pill" style="margin-top:8px;padding:9px 14px" onclick="seAddSet('+i+')">＋ Série</button>';
  return '<div class="g sex"><div class="sexh"><div class="exi">'+exSvg(e.n,e.g,48)+'</div><div style="flex:1;min-width:0"><b>'+esc(e.n)+'</b><div class="note" style="margin:0">'+esc(GRPLAB[e.g]||e.g)+'</div></div><button class="sexx" onclick="seDelEx('+i+')" aria-label="Retirer l’exercice">✕</button></div>'+last+body+'</div>';
}
function seSet(i,j,k,el){SE.ex[i].sets[j][k]=el.value;seSave();
  if(k==='c'||k==='r'){var q=histOf(SE.ex[i].n),row=el.parentNode,nx=row.nextElementSibling,s=SE.ex[i].sets[j],pr=q&&pn(s.c)>q.maxC&&pn(s.r)>0;
    if(pr&&!(nx&&nx.classList.contains('sepr'))){row.insertAdjacentHTML('afterend','<div class="sepr">🔥 Au-dessus de ton record ('+f(q.maxC,q.maxC%1?1:0)+' kg)</div>')}
    if(!pr&&nx&&nx.classList.contains('sepr')){nx.remove()}}}
function seAddSet(i){var s=SE.ex[i].sets,l=s[s.length-1]||{c:'',r:'',i:'',p:''};s.push({c:l.c,r:l.r,i:l.i,p:l.p});seSave();seRender()}
function seDelSet(i,j){SE.ex[i].sets.splice(j,1);if(!SE.ex[i].sets.length){SE.ex[i].sets.push({c:'',r:'',i:'',p:''})}seSave();seRender()}
function seDelEx(i){SE.ex.splice(i,1);seSave();seRender()}
function seCopy(i){var L=lastSession(SE.ex[i].n,SE.edit);if(!L){return}SE.ex[i].sets=L.s.sets.map(function(x){return{c:x.c?String(x.c).replace('.',','):'',r:String(x.r),i:x.i!=null?String(x.i).replace('.',','):'',p:x.p?String(x.p):''}});seSave();seRender();toast('Séries reprises, ajuste ce qui a changé')}
function seAdd(n,g){
  var card=isCardio(n,g);SE.ex.push({n:n,g:g,cardio:card,min:'',sets:card?[]:[{c:'',r:'',i:'',p:''}]});SEV='edit';seSave();seRender();
  setTimeout(function(){var b=$('#sh').querySelectorAll('.sex');if(b.length){b[b.length-1].scrollIntoView({behavior:'smooth',block:'center'})}},80);
}

/* ---------- Choix d'un exercice ---------- */
function allEx(){
  var o={},L=[];function add(n,g,m,mine){var k=n.toLowerCase().trim();if(o[k]){return}o[k]=1;L.push({n:n,g:g,m:m||'',mine:mine})}
  if(SEH){Object.keys(SEH.E).forEach(function(k){var q=SEH.E[k];add(q.n,q.g||guessGroup(q.n),'',1)})}
  myEx().forEach(function(c){add(c[0],c[1],c[2],0)});CAT.forEach(function(c){add(c[0],c[1],c[2],0)});return L;
}
function guessGroup(n){var c=CAT.filter(function(x){return x[0].toLowerCase()===n.toLowerCase()})[0];if(c){return c[1]}var k=exKind(n,'');return{bench:'Pectoraux',chest:'Pectoraux',pushup:'Pectoraux',pull:'Dos',row:'Dos',dbrow:'Dos',pullover:'Dos',hinge:'Ischios',squat:'Quadriceps',lunge:'Quadriceps',legext:'Quadriceps',legcurl:'Ischios',hipthrust:'Ischios',ohp:'Épaules',lateral:'Épaules',reardelt:'Épaules',facepull:'Épaules',shrug:'Épaules',curl:'Biceps',tri:'Triceps',dips:'Triceps',calf:'Mollets',crunch:'Abdominaux',plank:'Abdominaux',run:'Cardio',adductor:'Quadriceps'}[k]||'Pectoraux'}
function pickRender(){
  var el=$('#se'),q=SEQ.trim().toLowerCase(),F=favs(),L=allEx();
  var nq=q.normalize?q.normalize('NFD').replace(/[̀-ͯ]/g,''):q;
  function norm(s){s=s.toLowerCase();return s.normalize?s.normalize('NFD').replace(/[̀-ͯ]/g,''):s}
  var R=L.filter(function(x){return(SEG==='Tous'||x.g===SEG||(SEG==='★'&&F.indexOf(x.n)>=0))&&(!nq||norm(x.n+' '+x.g+' '+x.m).indexOf(nq)>=0)});
  var mine=R.filter(function(x){return x.mine}),fav=R.filter(function(x){return !x.mine&&F.indexOf(x.n)>=0}),rest=R.filter(function(x){return !x.mine&&F.indexOf(x.n)<0});
  function row(x){var i=L.indexOf(x),fv=F.indexOf(x.n)>=0;return '<div class="pkr" onclick="seAddIdx('+i+')"><div class="exi">'+exSvg(x.n,x.g,40)+'</div><div style="flex:1;min-width:0"><b>'+esc(x.n)+'</b><div class="note" style="margin:0">'+esc(GRPLAB[x.g]||x.g)+(x.m?' · '+esc(x.m):'')+'</div></div><button class="pkf'+(fv?' on':'')+'" onclick="event.stopPropagation();togFav('+i+')" aria-label="Favori">'+(fv?'★':'☆')+'</button></div>'}
  function sec(t,a){return a.length?'<div class="lab" style="margin:16px 4px 6px">'+t+'</div><div class="g" style="padding:4px 12px">'+a.map(row).join('')+'</div>':''}
  window._PKL=L;
  el.innerHTML='<div class="sh-h"><button class="gb" onclick="SEV=\'edit\';seRender()" aria-label="Retour"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button><div class="lab" style="font-size:15px">Choisir un exercice</div><span style="width:40px"></span></div>'+
   '<input id="pkq" class="g srch" placeholder="Rechercher (développé, curl, squat…)" value="'+esc(SEQ)+'" oninput="SEQ=this.value;pickRender();var i=$(\'#pkq\');i.focus();i.setSelectionRange(i.value.length,i.value.length)">'+
   '<div class="pills" style="margin:10px -16px 0">'+['Tous','★'].concat(GRPS).map(function(g){return '<button class="pill'+(SEG===g?' on':'')+'" onclick="SEG=\''+g+'\';pickRender()">'+(g==='★'?'★ Favoris':GRPLAB[g]||g)+'</button>'}).join('')+'</div>'+
   sec('Tes exercices',mine)+sec('Favoris',fav)+sec(mine.length||fav.length?'Catalogue':'Exercices',rest)+
   (!R.length?'<div class="g" style="margin-top:14px;text-align:center">Aucun exercice trouvé.</div>':'')+
   '<button class="g pill seadd" onclick="openNewEx()">＋ Créer un exercice'+(SEQ?' « '+esc(SEQ)+' »':'')+'</button>';
}
function seAddIdx(i){var x=_PKL[i];seAdd(x.n,x.g)}
function togFav(i){var x=_PKL[i],F=favs(),k=F.indexOf(x.n);if(k>=0){F.splice(k,1)}else{F.push(x.n)}try{localStorage.setItem('forme_fav',JSON.stringify(F))}catch(e){}pickRender()}
function openNewEx(){
  var el=$('#se'),nm=SEQ.trim();
  el.innerHTML='<div class="sh-h"><button class="gb" onclick="pickRender()" aria-label="Retour"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button><div class="lab" style="font-size:15px">Nouvel exercice</div><span style="width:40px"></span></div>'+
   '<div class="lab" style="margin:6px 4px">Nom</div><input id="nxn" class="g srch" value="'+esc(nm)+'" placeholder="Ex. Développé Couché (Haltères)">'+
   '<div class="lab" style="margin:14px 4px 6px">Muscle principal</div><div class="obg2" id="nxg">'+GRPS.map(function(g,i){return '<button class="g obc'+(i===0?' on':'')+'" data-v="'+g+'" onclick="[].forEach.call(this.parentNode.children,function(b){b.classList.remove(\'on\')});this.classList.add(\'on\')">'+(GRPLAB[g]||g)+'</button>'}).join('')+'</div>'+
   '<div class="lab" style="margin:14px 4px 6px">Matériel</div><div class="obg2" id="nxm">'+['Barre','Haltères','Machine','Poulie','Poids du corps'].map(function(g,i){return '<button class="g obc'+(i===0?' on':'')+'" data-v="'+g+'" onclick="[].forEach.call(this.parentNode.children,function(b){b.classList.remove(\'on\')});this.classList.add(\'on\')">'+g+'</button>'}).join('')+'</div>'+
   '<button class="obgo" style="margin-top:18px" onclick="saveNewEx()">Créer et ajouter</button>';
}
function saveNewEx(){
  var n=$('#nxn').value.trim();if(!n){toast('Donne un nom à l’exercice');return}
  var g=$('#nxg .on').dataset.v,m=$('#nxm .on').dataset.v,k=exKind(n,g),M=myEx();M.push([n,g,m,k]);CATK[n.toLowerCase()]=k;
  try{localStorage.setItem('forme_myex',JSON.stringify(M))}catch(e){}seAdd(n,g);
}

/* ---------- Enregistrement ---------- */
function rnd(x,d){var p=Math.pow(10,d||1);return Math.round(x*p)/p}
function seBuild(){
  var rows=[],sets=[],recs=[],ups=[];
  SE.ex.forEach(function(e){
    if(e.cardio){var mn=pn(e.min);if(mn>0){rows.push({seance:SE.name,groupe:e.g,exo:e.n,series:0,reps:0,charge:0,rir:'',tonnage:0,stim:0,cardio:mn,notes:''})}return}
    var S=e.sets.map(function(s){return{c:pn(s.c)||0,r:pn(s.r)||0,i:pn(s.i),p:parseRest(s.p)}}).filter(function(s){return s.r>0});if(!S.length){return}
    var ton=0,stim=0,ri=[],topC=0,bE=0;
    S.forEach(function(s,j){ton+=s.c*s.r;if(s.i!=null&&s.i<=2){stim++}if(s.i!=null){ri.push(s.i)}topC=Math.max(topC,s.c);var e1=s.c*(1+s.r/30);bE=Math.max(bE,e1);
      sets.push({seance:SE.name,exo:e.n,groupe:e.g,n:j+1,c:s.c,r:s.r,i:s.i==null?'':s.i,p:s.p==null?'':s.p,e1:s.c?rnd(e1,1):''})});
    var avgR=rnd(S.reduce(function(a,s){return a+s.r},0)/S.length,1),ri0=ri.length?rnd(avg(ri),1):'';
    rows.push({seance:SE.name,groupe:e.g,exo:e.n,series:S.length,reps:avgR,charge:topC,rir:ri0,tonnage:Math.round(ton),stim:stim,cardio:0,notes:''});
    var q=histOf(e.n),L=lastSession(e.n);
    if(!q||(!q.maxC&&!Object.keys(q.sessions).length)){recs.push({t:'b',e:e.n,txt:'Première fois au '+e.n.split(' (')[0].toLowerCase()+' 🎉'});return}
    if(topC>0&&topC>q.maxC+.01){recs.push({t:'o',e:e.n,txt:'Record de charge : '+f(topC,topC%1?1:0)+' kg',sub:q.maxC?'+'+f(topC-q.maxC,(topC-q.maxC)%1?1:0)+' kg sur ton ancien record':''});return}
    if(bE>q.bestE+.1&&topC>0){recs.push({t:'a',e:e.n,txt:'Nouveau 1RM estimé : '+f(bE,1)+' kg',sub:'+'+f(bE-q.bestE,1)+' kg'});return}
    var rp=null;S.forEach(function(s){if(!s.c){return}var prev=0;q.repsAt.forEach(function(a){if(a[0]>=s.c-.01){prev=Math.max(prev,a[1])}});if(s.r>prev&&prev>0&&(!rp||s.r-prev>rp.d)){rp={c:s.c,r:s.r,d:s.r-prev}}});
    if(rp){recs.push({t:'b',e:e.n,txt:'Record de répétitions : '+f(rp.r)+' × '+f(rp.c,rp.c%1?1:0)+' kg',sub:'+'+f(rp.d)+' rép.'});return}
    if(L&&L.s.sets.length){var lt=Math.max.apply(null,L.s.sets.map(function(x){return x.c||0}));if(topC>lt+.01){ups.push(e.n.split(' (')[0]+' : '+f(lt,lt%1?1:0)+' → '+f(topC,topC%1?1:0)+' kg')}}
  });
  return{rows:rows,sets:sets,recs:recs,ups:ups};
}
function parseRest(v){v=String(v||'').trim();if(!v){return null}var m=v.match(/^(\d+)[:'m h](\d{1,2})?/);if(m&&/[:'m]/.test(v)){return +m[1]*60+(+m[2]||0)}var n=pn(v);return n!=null?Math.round(n):null}
function sePending(){try{return JSON.parse(localStorage.getItem('forme_pending')||'[]')}catch(e){return[]}}
function postSeance(p){
  if(gs()){return new Promise(function(res,rej){google.script.run.withSuccessHandler(res).withFailureHandler(rej).appSaveSeance(p)})}
  return fetch(CFG.url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(Object.assign({key:CFG.key},p)),redirect:'follow'})
   .then(function(r){return r.text()}).then(function(t){var d;try{d=JSON.parse(t)}catch(e){throw new Error('Réponse inattendue : as-tu ajouté doPost dans Code.gs et publié une nouvelle version ?')}if(d.error){throw new Error(d.error)}return d});
}
function flushPending(){
  var P=sePending();if(!P.length||!live()){return}
  var p=P[0];postSeance(p).then(function(){var Q=sePending().filter(function(x){return x.id!==p.id});try{localStorage.setItem('forme_pending',JSON.stringify(Q))}catch(e){}toast('Séance du '+dl(p.date)+' envoyée dans ta feuille ✓');if(Q.length){flushPending()}else{setTimeout(function(){load()},800)}}).catch(function(){});
}
window.addEventListener('online',flushPending);
function seFinish(btn){
  var B=seBuild(),msg=$('#sem');
  if(!B.rows.length){msg.textContent='Ajoute au moins une série (charge et répétitions) ou une durée de cardio.';return}
  var p={action:'seance',id:SE.id,date:SE.date,seance:SE.name||'Séance',fatigue:SE.fat||'',notes:SE.notes||'',rows:B.rows,sets:B.sets};
  p.rows.forEach(function(r){r.seance=p.seance});p.sets.forEach(function(s){s.seance=p.seance;s.fat=p.fatigue});
  if(SE.edit){p.action='modifier';p.orig=SE.edit;
    if(!live()){msg.textContent='En mode démo, rien n’est modifié : relie ta feuille dans les réglages.';return}
    btn.disabled=true;btn.textContent='Mise à jour de ta feuille…';
    postSeance(p).then(function(){try{localStorage.removeItem('forme_draft_edit')}catch(e){}closeSh();toast('Séance modifiée ✓');sesRefresh()})
     .catch(function(e){btn.disabled=false;btn.textContent='Enregistrer les modifications';msg.textContent=/inconnue/i.test(String(e.message))?'Ta feuille ne sait pas encore modifier une séance : colle le nouveau code dans Apps Script.':(e instanceof TypeError?'Pas de réseau : réessaie quand tu seras connecté.':e.message||String(e))});
    return}
  btn.disabled=true;btn.textContent='Enregistrement…';
  function local(){addLocal(p)}
  function celebrate(note){
    try{localStorage.removeItem('forme_draft')}catch(e){}closeSh();local();showSeanceDone(p,B,note);
  }
  if(!live()){celebrate('Mode démo : séance enregistrée sur ce téléphone seulement.');return}
  postSeance(p).then(function(){celebrate('');setTimeout(function(){load()},4500)}).catch(function(e){
    if(e instanceof TypeError||/fetch|network|réseau/i.test(String(e.message))){var P=sePending();P.push(p);try{localStorage.setItem('forme_pending',JSON.stringify(P))}catch(x){}celebrate('Pas de réseau : la séance est gardée sur ton téléphone et partira dans ta feuille dès que tu seras connecté.')}
    else{btn.disabled=false;btn.textContent='Enregistrer la séance';msg.textContent=e.message||String(e)}
  });
}
function addLocal(p){
  var mn=sheetName(/muscu/i,'Musculation'),m=SDraw[mn];
  if(m&&m.length){var h=m[0].map(function(x){return String(x).toLowerCase()}),dd=p.date.split('-').reverse().join('/');
    p.rows.forEach(function(r){m.push(h.map(function(c){return /^date/.test(c)?dd:/type de s|s[ée]ance/.test(c)?r.seance:/groupe/.test(c)?r.groupe:/exercice/.test(c)?r.exo:/s[ée]ries eff/.test(c)?String(r.series):/r[ée]p/.test(c)?String(r.reps).replace('.',','):/charge/.test(c)?String(r.charge).replace('.',','):/^rir/.test(c)?String(r.rir).replace('.',','):/tonnage/.test(c)?String(r.tonnage):/stimul/.test(c)?String(r.stim):/cardio/.test(c)?String(r.cardio):''}))})}
  p.sets.forEach(function(s){LOCALSER.push([p.date,s.seance,s.exo,s.groupe,String(s.n),String(s.c),String(s.r),String(s.i),String(s.p)])});
  var sn=seriesName();if(sn&&SDraw[sn]){p.sets.forEach(function(s){SDraw[sn].push([p.date,s.seance,s.exo,s.groupe,String(s.n),String(s.c),String(s.r),String(s.i),String(s.p)])})}
  SEH=null;loadHist(function(){});
  if(m){INS=buildIns(TRR.r,m);WX=WX||weekExtra(TRR.r);computeTrophies(TRR.r,m);if(TAB==='week'){renderWeek()}}
}
function showSeanceDone(p,B,note){
  var ns=p.rows.reduce(function(a,r){return a+(r.series||0)},0),ton=p.rows.reduce(function(a,r){return a+(r.tonnage||0)},0),xp=10;
  var el=$('#rec');if(!el){el=document.createElement('div');el.id='rec';document.body.appendChild(el)}
  var sp='';for(var i=0;i<22;i++){var a=i/22*Math.PI*2,r=120+(i%3)*30;sp+='<i style="--x:'+Math.cos(a)*r+'px;--y:'+Math.sin(a)*r+'px;animation-delay:'+(.2+i%4*.05)+'s"></i>'}
  var big=B.recs.length?B.recs.filter(function(x){return x.t==='o'}).length?'o':'a':'b';
  el.innerHTML='<div class="lvupb"><div class="lvsp" style="top:70px">'+(B.recs.length?sp:'')+'</div><div class="recm">'+medal(B.recs.length?big:'b',110)+'</div>'+
   '<div class="obt" style="text-align:center;margin-top:16px">'+(B.recs.length?(B.recs.length>1?B.recs.length+' records battus !':'Record battu !'):'Séance enregistrée 💪')+'</div>'+
   '<p class="obp" style="text-align:center;margin-bottom:14px">'+ns+' séries · '+f(ton)+' kg soulevés · +'+xp+' XP</p>'+
   (B.recs.length?'<div class="g" style="padding:4px 16px;text-align:left">'+B.recs.map(function(x){return '<div class="trr got">'+medal(x.t,36)+'<div style="flex:1;min-width:0"><b>'+esc(x.txt)+'</b><div class="note" style="margin:2px 0 0">'+esc(x.e)+(x.sub?' · '+esc(x.sub):'')+'</div></div></div>'}).join('')+'</div>':'')+
   (B.ups.length?'<div class="g" style="padding:12px 16px;text-align:left;margin-top:10px"><div class="lab">Tu as monté en charge 📈</div>'+B.ups.map(function(u){return '<div class="note" style="color:var(--t);margin-top:6px">'+esc(u)+'</div>'}).join('')+'</div>':'')+
   (!B.recs.length&&!B.ups.length?'<p class="obp" style="text-align:center">'+['Chaque séance compte. Continue comme ça !','La régularité fait le reste. Bien joué !','Une de plus au compteur. Bravo !'][Math.floor(Math.random()*3)]+'</p>':'')+
   (note?'<p class="note" style="text-align:center;margin:12px 0 0">'+esc(note)+'</p>':'')+
   '<button class="obgo" style="margin-top:18px" onclick="this.closest(\'#rec\').className=\'\'">Continuer</button></div>';
  el.className='';void el.offsetWidth;el.className='on';trChime(B.recs.length?'p':'b');
}


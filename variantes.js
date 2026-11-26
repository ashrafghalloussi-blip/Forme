/* Forme · variantes.js · Variantes d’exercices (haltères, barre, machine, poulie…) */
/* =====================================================================
   Mouvements de base + variantes
   d : [libellé, place ('n' = dans le nom, 'p' = entre parenthèses, 'm' = matériel), options, animation par option]
   La 1re option d'une dimension 'n' ou 'p' est la variante par défaut (non écrite dans le nom).
   ===================================================================== */
var HS='convergente, type Hammer Strength';
var MOV=[
 {n:'Développé Couché',g:'Pectoraux',k:'bench',d:[['Matériel','m',['Barre','Haltères','Machine','Smith'],{Machine:'chest'}],['Inclinaison','n',['Plat','Incliné','Décliné']]]},
 {n:'Chest Press',g:'Pectoraux',k:'chest',d:[['Matériel','m',['Machine','Poulie']],['Inclinaison','n',['Plat','Incliné']],['Bras','p',['Bilatéral','Unilatéral']]]},
 {n:'Écarté',g:'Pectoraux',k:'chest',d:[['Matériel','m',['Poulie','Haltères','Machine'],{'Haltères':'bench'}],['Inclinaison','n',['Plat','Incliné','Bas vers haut']]]},
 {n:'Pompes',g:'Pectoraux',k:'pushup',d:[['Prise','p',['Classique','Large','Serrée','Déclinées','Lestées']]]},
 {n:'Dips',g:'Pectoraux',k:'dips',d:[['Cible','n',['Pectoraux','Triceps']],['Charge','p',['Poids du corps','Lestés','Assistés']]]},
 {n:'Tractions',g:'Dos',k:'pull',d:[['Prise','n',['Pronation','Supination','Neutre']],['Charge','p',['Poids du corps','Lestées','Assistées']]]},
 {n:'Tirage Poitrine',g:'Dos',k:'pull',d:[['Matériel','m',['Poulie','Machine']],['Prise','n',['Large','Serrée','Neutre','Supination']],['Bras','p',['Bilatéral','Unilatéral']]]},
 {n:'Rowing',g:'Dos',k:'row',d:[['Matériel','m',['Barre','Haltère','Poulie','Machine','T-Bar'],{'Haltère':'dbrow'}],['Prise','n',['Pronation','Supination','Neutre']],['Bras','p',['Bilatéral','Unilatéral']]]},
 {n:'Tirage Horizontal',g:'Dos',k:'row',d:[['Matériel','m',['Poulie','Machine']],['Prise','n',['Serrée','Large']],['Bras','p',['Bilatéral','Unilatéral']]]},
 {n:'Pull-over',g:'Dos',k:'pullover',d:[['Matériel','m',['Poulie','Haltère','Machine']]]},
 {n:'Soulevé de Terre',g:'Dos',k:'hinge',d:[['Style','n',['Classique','Sumo','Trap Bar']],['Matériel','m',['Barre']]]},
 {n:'Extension Lombaire',g:'Dos',k:'hinge',d:[['Matériel','m',['Banc','Machine']]]},
 {n:'Développé Militaire',g:'Épaules',k:'ohp',d:[['Matériel','m',['Barre','Haltères','Machine','Smith']],['Position','p',['Debout','Assis']]]},
 {n:'Développé Arnold',g:'Épaules',k:'ohp',d:[['Matériel','m',['Haltères']]]},
 {n:'Élévations Latérales',g:'Épaules',k:'lateral',d:[['Matériel','m',['Haltères','Poulie','Machine']],['Bras','p',['Bilatéral','Unilatéral']],['Position','p',['Debout','Assis','Penché']]]},
 {n:'Élévations Frontales',g:'Épaules',k:'lateral',d:[['Matériel','m',['Haltères','Poulie','Barre','Disque']],['Bras','p',['Bilatéral','Unilatéral']]]},
 {n:'Oiseau',g:'Épaules',k:'reardelt',d:[['Matériel','m',['Haltères','Poulie','Machine']],['Bras','p',['Bilatéral','Unilatéral']]]},
 {n:'Face Pull',g:'Épaules',k:'facepull',d:[['Matériel','m',['Poulie']],['Accessoire','p',['Corde','Barre']]]},
 {n:'Shrugs',g:'Épaules',k:'shrug',d:[['Matériel','m',['Haltères','Barre','Machine','Smith']]]},
 {n:'Rowing Menton',g:'Épaules',k:'shrug',d:[['Matériel','m',['Barre','Poulie','Haltères']]]},
 {n:'Curl',g:'Biceps',k:'curl',d:[['Matériel','m',['Haltères','Barre','Barre EZ','Poulie','Machine']],['Prise','n',['Supination','Marteau','Pronation']],['Position','n',['Debout','Pupitre','Incliné','Concentré','Bayesian']],['Bras','p',['Bilatéral','Unilatéral']]]},
 {n:'Extension Triceps',g:'Triceps',k:'tri',d:[['Matériel','m',['Poulie','Machine','Haltère','Barre EZ']],['Accessoire','n',['Barre','Corde']],['Position','n',['Poulie haute','Nuque']],['Bras','p',['Bilatéral','Unilatéral']]]},
 {n:'Barre au Front',g:'Triceps',k:'tri',d:[['Matériel','m',['Barre EZ','Barre','Haltères']]]},
 {n:'Kickback',g:'Triceps',k:'tri',d:[['Matériel','m',['Haltère','Poulie']]]},
 {n:'Développé Couché Prise Serrée',g:'Triceps',k:'bench',d:[['Matériel','m',['Barre','Smith']]]},
 {n:'Squat',g:'Quadriceps',k:'squat',d:[['Matériel','m',['Barre','Smith','Haltère','Machine']],['Style','n',['Classique','Front','Goblet','Sumo']]]},
 {n:'Presse à Cuisses',g:'Quadriceps',k:'squat',d:[['Matériel','m',['Machine']],['Type','n',['45°','Horizontale']],['Jambes','p',['Bilatéral','Unilatéral']]]},
 {n:'Hack Squat',g:'Quadriceps',k:'squat',d:[['Matériel','m',['Machine']],['Sens','n',['Classique','Inversé']]]},
 {n:'Leg Extension',g:'Quadriceps',k:'legext',d:[['Matériel','m',['Machine']],['Jambes','p',['Bilatéral','Unilatéral']]]},
 {n:'Fentes',g:'Quadriceps',k:'lunge',d:[['Matériel','m',['Haltères','Barre','Smith','Poids du corps']],['Style','n',['Avant','Arrière','Marchées','Bulgares']]]},
 {n:'Step-up',g:'Quadriceps',k:'lunge',d:[['Matériel','m',['Haltères','Poids du corps']]]},
 {n:'Adducteurs',g:'Quadriceps',k:'adductor',d:[['Matériel','m',['Machine','Poulie']]]},
 {n:'Soulevé de Terre Roumain',g:'Ischios',k:'hinge',d:[['Matériel','m',['Barre','Haltères','Smith']],['Jambes','p',['Bilatéral','Unilatéral']]]},
 {n:'Leg Curl',g:'Ischios',k:'legcurl',d:[['Position','n',['Allongé','Assis','Debout']],['Matériel','m',['Machine']],['Jambes','p',['Bilatéral','Unilatéral']]]},
 {n:'Good Morning',g:'Ischios',k:'hinge',d:[['Matériel','m',['Barre','Smith']]]},
 {n:'Nordic Curl',g:'Ischios',k:'legcurl',d:[]},
 {n:'Hip Thrust',g:'Ischios',k:'hipthrust',d:[['Matériel','m',['Barre','Machine','Smith','Poids du corps']],['Jambes','p',['Bilatéral','Unilatéral']]]},
 {n:'Abducteurs',g:'Ischios',k:'adductor',d:[['Matériel','m',['Machine','Poulie','Élastique']]]},
 {n:'Kickback Fessier',g:'Ischios',k:'hipthrust',d:[['Matériel','m',['Poulie','Machine']]]},
 {n:'Mollets',g:'Mollets',k:'calf',d:[['Position','n',['Debout','Assis','à la Presse']],['Matériel','m',['Machine','Haltères','Smith','Poids du corps']],['Jambes','p',['Bilatéral','Unilatéral']]]},
 {n:'Crunch',g:'Abdominaux',k:'crunch',d:[['Matériel','m',['Poids du corps','Poulie','Machine']]]},
 {n:'Relevés de Jambes',g:'Abdominaux',k:'crunch',d:[['Position','p',['Suspendu','Au sol','Chaise romaine']]]},
 {n:'Gainage',g:'Abdominaux',k:'plank',d:[['Type','n',['Face','Latéral']]]},
 {n:'Russian Twist',g:'Abdominaux',k:'crunch',d:[['Charge','p',['Poids du corps','Lesté']]]},
 {n:'Roue Abdominale',g:'Abdominaux',k:'plank',d:[]},
 {n:'Tapis de Course',g:'Cardio',k:'run',d:[['Type','p',['Course','Marche inclinée','Fractionné']]]},
 {n:'Vélo',g:'Cardio',k:'run',d:[['Type','p',['Droit','Allongé','Spinning']]]},
 {n:'Elliptique',g:'Cardio',k:'run',d:[]},{n:'Rameur',g:'Cardio',k:'run',d:[]},{n:'Stepper',g:'Cardio',k:'run',d:[]},{n:'Corde à Sauter',g:'Cardio',k:'run',d:[]}
];
var VSEL=null;
function movName(M,sel){
  var nm=[M.n],par=[];
  M.d.forEach(function(D,i){var v=D[2][sel[i]||0];if(D[1]==='m'){par.unshift(v)}else if((sel[i]||0)>0){if(D[1]==='n'){nm.push(v)}else{par.push(v)}}});
  return nm.join(' ')+(par.length?' ('+par.join(', ')+')':'');
}
function movKind(M,sel){var k=M.k;M.d.forEach(function(D,i){var v=D[2][sel[i]||0];if(D[3]&&D[3][v]){k=D[3][v]}});return k}
function guessGroup(n){
  var l=n.toLowerCase(),best=null;MOV.forEach(function(M){if(l.indexOf(M.n.toLowerCase())===0&&(!best||M.n.length>best.n.length)){best=M}});
  if(best){return best.g}var k=exKind(n,'');
  return{bench:'Pectoraux',chest:'Pectoraux',pushup:'Pectoraux',pull:'Dos',row:'Dos',dbrow:'Dos',pullover:'Dos',hinge:'Ischios',squat:'Quadriceps',lunge:'Quadriceps',legext:'Quadriceps',legcurl:'Ischios',hipthrust:'Ischios',ohp:'Épaules',lateral:'Épaules',reardelt:'Épaules',facepull:'Épaules',shrug:'Épaules',curl:'Biceps',tri:'Triceps',dips:'Triceps',calf:'Mollets',crunch:'Abdominaux',plank:'Abdominaux',run:'Cardio',adductor:'Quadriceps'}[k]||'Pectoraux';
}
function allEx(){
  var o={},L=[];function add(n,g,m,mine){var k=n.toLowerCase().trim();if(o[k]){return}o[k]=1;L.push({n:n,g:g,m:m||'',mine:mine})}
  if(SEH){Object.keys(SEH.E).forEach(function(k){var q=SEH.E[k];add(q.n,q.g||guessGroup(q.n),'',1)})}
  myEx().forEach(function(c){add(c[0],c[1],c[2],1)});return L;
}
function norm(s){s=String(s).toLowerCase();return s.normalize?s.normalize('NFD').replace(/[̀-ͯ]/g,''):s}
function pickRender(){
  var el=$('#se'),nq=norm(SEQ.trim()),F=favs(),L=allEx();window._PKL=L;
  if(VSEL){return varRender()}
  var mine=L.filter(function(x){return(SEG==='Tous'||x.g===SEG||(SEG==='★'&&F.indexOf(x.n)>=0))&&(!nq||norm(x.n+' '+x.g).indexOf(nq)>=0)});
  var movs=MOV.map(function(M,i){return{M:M,i:i}}).filter(function(o){var M=o.M;if(SEG==='★'){return false}if(SEG!=='Tous'&&M.g!==SEG){return false}if(!nq){return true}
    return norm(M.n+' '+M.g+' '+M.d.map(function(D){return D[2].join(' ')}).join(' ')).indexOf(nq)>=0});
  function row(x){var i=L.indexOf(x),fv=F.indexOf(x.n)>=0;return '<div class="pkr" onclick="seAddIdx('+i+')"><div class="exi">'+exSvg(x.n,x.g,40)+'</div><div style="flex:1;min-width:0"><b>'+esc(x.n)+'</b><div class="note" style="margin:0">'+esc(GRPLAB[x.g]||x.g)+'</div></div><button class="pkf'+(fv?' on':'')+'" onclick="event.stopPropagation();togFav('+i+')" aria-label="Favori">'+(fv?'★':'☆')+'</button></div>'}
  var favL=mine.filter(function(x){return F.indexOf(x.n)>=0}),rest=mine.filter(function(x){return F.indexOf(x.n)<0});
  el.innerHTML='<div class="sh-h"><button class="gb" onclick="SEV=\'edit\';VSEL=null;seRender()" aria-label="Retour"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button><div class="lab" style="font-size:15px">Choisir un exercice</div><span style="width:40px"></span></div>'+
   '<input id="pkq" class="g srch" placeholder="Rechercher (développé, curl, poulie…)" value="'+esc(SEQ)+'" oninput="SEQ=this.value;pickRender();var i=$(\'#pkq\');i.focus();i.setSelectionRange(i.value.length,i.value.length)">'+
   '<div class="pills" style="margin:10px -16px 0">'+['Tous','★'].concat(GRPS).map(function(g){return '<button class="pill'+(SEG===g?' on':'')+'" onclick="SEG=\''+g+'\';pickRender()">'+(g==='★'?'★ Favoris':GRPLAB[g]||g)+'</button>'}).join('')+'</div>'+
   (favL.length?'<div class="lab" style="margin:16px 4px 6px">Favoris</div><div class="g" style="padding:4px 12px">'+favL.map(row).join('')+'</div>':'')+
   (rest.length&&SEG!=='★'?'<div class="lab" style="margin:16px 4px 6px">Tes exercices</div><div class="g" style="padding:4px 12px">'+rest.slice(0,nq?30:6).map(row).join('')+'</div>':'')+
   (movs.length?'<div class="lab" style="margin:18px 4px 8px">Mouvements · choisis ensuite la variante</div><div class="mvg">'+movs.map(function(o){var M=o.M,nv=M.d.reduce(function(a,D){return a*D[2].length},1);
     return '<button class="g mvt" onclick="VSEL={m:'+o.i+',s:{}};pickRender()"><div class="exi">'+exSvg(M.n,M.g,46)+'</div><b>'+esc(M.n)+'</b><span>'+(nv>1?nv+' variantes':esc(GRPLAB[M.g]||M.g))+'</span></button>'}).join('')+'</div>':'')+
   (!mine.length&&!movs.length?'<div class="g" style="margin-top:14px;text-align:center">'+(SEG==='★'?'Pas encore de favoris : touche ☆ à côté d’un exercice.':'Aucun mouvement trouvé.')+'</div>':'')+
   '<button class="g pill seadd" onclick="openNewEx()">＋ Créer un exercice'+(SEQ?' « '+esc(SEQ)+' »':'')+'</button>';
}
function varRender(){
  var el=$('#se'),M=MOV[VSEL.m],s=VSEL.s,nm=movName(M,s),k=movKind(M,s),q=histOf(nm);CATK[nm.toLowerCase()]=k;
  el.innerHTML='<div class="sh-h"><button class="gb" onclick="VSEL=null;pickRender()" aria-label="Retour"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button><div class="lab" style="font-size:15px">'+esc(GRPLAB[M.g]||M.g)+'</div><span style="width:40px"></span></div>'+
   '<div class="exh vrh">'+exSvg(nm,M.g,150)+'</div>'+
   '<div class="vrn">'+esc(nm)+'</div>'+
   '<div class="vrq">'+(q&&q.maxC?badge('ok','Déjà fait · record '+f(q.maxC,q.maxC%1?1:0)+' kg'):q?badge('ok','Déjà dans tes exercices'):badge('nt','Nouvelle variante pour toi ✨'))+'</div>'+
   M.d.map(function(D,i){if(D[2].length<2){return ''}return '<div class="lab" style="margin:18px 4px 8px">'+D[0]+'</div><div class="vrc">'+D[2].map(function(o,j){var on=(s[i]||0)===j;
     var sub=o==='Machine'&&/bench|chest|ohp|row|pull/.test(M.k)?HS:'';return '<button class="g obc'+(on?' on':'')+'" onclick="VSEL.s['+i+']='+j+';varRender();obThumb(document.querySelectorAll(\'.vrc\')['+M.d.slice(0,i).filter(function(x){return x[2].length>1}).length+'].children['+j+'])">'+esc(o)+(sub?'<small>'+sub+'</small>':'')+'</button>'}).join('')+'</div>'}).join('')+
   '<button class="obgo" style="margin-top:22px" onclick="var M=MOV[VSEL.m],n=movName(M,VSEL.s);VSEL=null;seAdd(n,M.g)">Ajouter à la séance</button>';
}
function seAddIdx(i){var x=_PKL[i];VSEL=null;seAdd(x.n,x.g)}


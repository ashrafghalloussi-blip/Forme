/* Forme · glow.js · Onglet Glow up : bilan de peau, routine, Glow score */
/* =====================================================================
   Glow up : bilan de peau (visage, corps), routine matin / soir à cocher,
   Glow score (régularité + sommeil + hydratation), conseils beauté (pas médicaux)
   ===================================================================== */
var GL={zones:{},zone:'visage',moment:null};try{Object.assign(GL,JSON.parse(localStorage.getItem('forme_glow')||'{}'))}catch(e){}
var GLOG={};try{GLOG=JSON.parse(localStorage.getItem('forme_glow_log')||'{}')}catch(e){GLOG={}}
function glSave(){try{localStorage.setItem('forme_glow',JSON.stringify({zones:GL.zones,zone:GL.zone}))}catch(e){}}
function glLogSave(){try{localStorage.setItem('forme_glow_log',JSON.stringify(GLOG))}catch(e){}}
/* petits dessins de peau */
function skinSvg(k){
  var base='<defs><radialGradient id="sk'+k+'" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#F1D3B5"/><stop offset="1" stop-color="#D7A983"/></radialGradient><clipPath id="sc'+k+'"><circle cx="32" cy="32" r="26"/></clipPath></defs><circle cx="32" cy="32" r="26" fill="url(#sk'+k+')"/>',x='';
  if(k==='normale'){x='<g fill="#B9875F" opacity=".35"><circle cx="22" cy="26" r=".9"/><circle cx="34" cy="20" r=".9"/><circle cx="42" cy="34" r=".9"/><circle cx="28" cy="40" r=".9"/><circle cx="38" cy="45" r=".9"/></g><path d="M18 20q6-6 14-6" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".35"/>'}
  if(k==='seche'){x='<g clip-path="url(#sc'+k+')" stroke="#A9764E" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".75"><path d="M8 24l10 4 6-5 9 6 7-3 14 5"/><path d="M18 28l-2 9 7 6M33 29l1 10-6 6M40 26l6 10 10 2"/><path d="M10 46l12-3 9 4 10-4 14 3"/></g><g fill="#F7E6D3"><path d="M24 36l4-1 1 3-4 1z"/><path d="M41 43l4-2 1 3-4 1z"/><path d="M35 17l3-1 1 2-3 1z"/></g>'}
  if(k==='grasse'){x='<g fill="#fff"><ellipse cx="25" cy="22" rx="7" ry="3.5" opacity=".75" transform="rotate(-20 25 22)"/><ellipse cx="40" cy="31" rx="4" ry="2" opacity=".6"/><ellipse cx="29" cy="40" rx="5" ry="2.4" opacity=".55" transform="rotate(10 29 40)"/><circle cx="44" cy="20" r="1.6" opacity=".8"/></g><g fill="#B9875F" opacity=".5"><circle cx="20" cy="34" r="1.2"/><circle cx="36" cy="44" r="1.2"/><circle cx="46" cy="38" r="1.2"/></g>'}
  if(k==='mixte'){x='<path d="M32 6v52" stroke="#fff" stroke-width="1" stroke-dasharray="2 3" opacity=".5"/><g fill="#fff" opacity=".7"><ellipse cx="38" cy="22" rx="4.5" ry="2.2"/><ellipse cx="40" cy="38" rx="3.5" ry="1.8"/></g><g stroke="#A9764E" stroke-width="1" fill="none" opacity=".6" stroke-linecap="round"><path d="M12 26l6 3 5-3M14 40l6-2 6 3"/></g>'}
  if(k==='sensible'){x='<g fill="#E07A6E" opacity=".45"><ellipse cx="22" cy="34" rx="8" ry="5.5"/><ellipse cx="43" cy="33" rx="7" ry="5"/></g><g fill="#E07A6E" opacity=".35"><circle cx="31" cy="22" r="3"/></g>'}
  if(k==='irritee'){x='<g fill="#D0574B" opacity=".55"><circle cx="22" cy="26" r="2.6"/><circle cx="38" cy="22" r="2.2"/><circle cx="42" cy="38" r="2.8"/><circle cx="27" cy="42" r="2"/></g><g fill="#fff" opacity=".7"><circle cx="21.4" cy="25.2" r=".8"/><circle cx="41.2" cy="37.2" r=".9"/></g><g stroke="#C0473D" stroke-width="1.2" stroke-linecap="round" opacity=".6"><path d="M30 31l6-2M31 34l5-1"/></g>'}
  return '<svg viewBox="0 0 64 64" class="sksvg">'+base+x+'<circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1"/></svg>';
}
var SKT=[['normale','Normale','Confortable, peu de soucis'],['seche','Sèche','Tiraille, rugueuse, pèle'],['grasse','Grasse','Brille, pores visibles'],['mixte','Mixte','Brille au centre, sèche sur les côtés'],['sensible','Sensible','Rougit, picote facilement'],['irritee','Abîmée / irritée','Boutons, rougeurs, sensibilité']];
var SKC={visage:['Boutons','Points noirs','Brillance','Pores visibles','Rougeurs','Tiraillements','Peau terne','Taches','Cernes','Poils incarnés','Marques de boutons'],
  corps:['Peau sèche','Boutons dans le dos','Petits boutons sur les bras','Poils incarnés','Vergetures','Transpiration','Rougeurs']};
var SKH={routine:['Rien pour l’instant','Nettoyant','Hydratant','Crème solaire','Gommage'],rasage:['Je me rase','Je garde la barbe','Pas concerné'],soleil:['Peu dehors','Souvent dehors'],budget:['Petit','Moyen','Large'],parfum:['Peu importe','Sans parfum']};
var GQ=null;
function openGlowQuiz(zone){
  var z=GL.zones[zone]||{};GQ={zone:zone,type:z.type||'',conc:(z.conc||[]).slice(),routine:(z.routine0||[]).slice(),rasage:z.rasage||'',soleil:z.soleil||'',budget:z.budget||'',parfum:z.parfum||'',desc:z.desc||''};
  openSh('<div id="gq"></div>');document.body.classList.add('full');gqRender();
}
function gqChip(key,v,multi){var on=multi?GQ[key].indexOf(v)>=0:GQ[key]===v;return '<button class="g obc'+(on?' on':'')+'" onclick="gqSet(\''+key+'\',\''+v.replace(/'/g,'\\\'')+'\','+(multi?1:0)+')">'+v+'</button>'}
function gqSet(k,v,multi){if(multi){var i=GQ[k].indexOf(v);if(i>=0){GQ[k].splice(i,1)}else{GQ[k].push(v)}}else{GQ[k]=GQ[k]===v?'':v}var y=$('#sh').scrollTop;gqRender();$('#sh').scrollTop=y;if(navigator.vibrate){navigator.vibrate(6)}}
function gqRender(){
  var el=$('#gq');if(!el){return}var vz=GQ.zone==='visage',types=vz?SKT:SKT.filter(function(t){return t[0]!=='mixte'});
  el.innerHTML='<div class="sh-h"><div class="big" style="font-size:28px;margin:0">Bilan '+(vz?'du visage':'du corps')+'</div><button class="gb" onclick="closeSh()" aria-label="Fermer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'+
   '<div class="note" style="margin:-4px 4px 16px;line-height:1.5">Quelques questions pour te proposer une routine simple. Ce sont des conseils beauté, pas un avis médical.</div>'+
   '<div class="lab gql">1. Ta peau ressemble plutôt à…</div><div class="gqt">'+types.map(function(t){return '<button class="g gqk'+(GQ.type===t[0]?' on':'')+'" onclick="gqSet(\'type\',\''+t[0]+'\',0)">'+skinSvg(t[0])+'<b>'+t[1]+'</b><small>'+t[2]+'</small></button>'}).join('')+'</div>'+
   '<div class="lab gql">2. Ce que tu remarques <span class="note">(plusieurs choix)</span></div><div class="obcs">'+SKC[GQ.zone].map(function(c){return gqChip('conc',c,1)}).join('')+'</div>'+
   '<div class="lab gql">3. Ce que tu utilises déjà</div><div class="obcs">'+SKH.routine.map(function(c){return gqChip('routine',c,1)}).join('')+'</div>'+
   (vz?'<div class="lab gql">Rasage</div><div class="obcs">'+SKH.rasage.map(function(c){return gqChip('rasage',c,0)}).join('')+'</div>':'')+
   '<div class="lab gql">Soleil</div><div class="obcs">'+SKH.soleil.map(function(c){return gqChip('soleil',c,0)}).join('')+'</div>'+
   '<div class="lab gql">Budget soins</div><div class="obcs">'+SKH.budget.map(function(c){return gqChip('budget',c,0)}).join('')+'</div>'+
   '<div class="lab gql">Parfum dans les produits</div><div class="obcs">'+SKH.parfum.map(function(c){return gqChip('parfum',c,0)}).join('')+'</div>'+
   '<div class="lab gql">4. En quelques mots <span class="note">(facultatif)</span></div><textarea class="g srch" id="gq_d" rows="3" maxlength="400" placeholder="Ex. : boutons sur le menton après le sport, peau qui tire en hiver…" oninput="GQ.desc=this.value">'+esc(GQ.desc)+'</textarea>'+
   '<div id="gq_m" class="note" style="margin:12px 4px;min-height:16px"></div><button class="obgo" onclick="gqDone(this)">Créer ma routine ✨</button>';
}
/* routine de base, sans IA (soins cosmétiques courants) */
function glRules(q){
  var t=q.type,c=q.conc,has=function(x){return c.indexOf(x)>=0},oily=t==='grasse'||t==='mixte',dry=t==='seche',sens=t==='sensible'||t==='irritee',noP=q.parfum==='Sans parfum'||sens,
    P=function(s){return s+(noP?' (sans parfum)':'')},M=[],S=[],H=[],T=[];
  if(q.zone==='visage'){
    var cl=oily||has('Boutons')||has('Points noirs')?P('Gel nettoyant doux, sans savon'):P('Lait ou gel nettoyant très doux, ou juste de l’eau tiède le matin');
    M.push({t:'Nettoyer',d:cl+'. Eau tiède, jamais chaude, et on sèche en tamponnant.'});
    if(has('Taches')||has('Peau terne')||has('Marques de boutons')){M.push({t:'Sérum éclat',d:'Un sérum à la vitamine C, quelques gouttes sur peau sèche.'})}
    else if(has('Brillance')||has('Pores visibles')||has('Boutons')){M.push({t:'Sérum matifiant',d:'Un sérum à la niacinamide (5 à 10 %) : il régule le sébum et resserre l’aspect des pores.'})}
    if(has('Cernes')){M.push({t:'Contour des yeux',d:'Un soin contour des yeux à la caféine, en tapotant. Le sommeil reste le meilleur anti-cernes.'})}
    M.push({t:'Hydrater',d:oily?P('Un gel-crème léger, « non comédogène »'):dry?P('Une crème riche aux céramides ou au beurre de karité'):sens?'Une crème apaisante pour peaux sensibles, sans parfum':P('Une crème hydratante légère')});
    M.push({t:'Protéger',d:'Crème solaire SPF 30 à 50, même en hiver : c’est le meilleur soin anti-taches et anti-âge.'+(q.soleil==='Souvent dehors'?' Remets-en à midi si tu restes dehors.':'')});
    if(q.rasage==='Je me rase'){M.push({t:'Rasage',d:'Rasoir propre et bien affûté, gel ou mousse, dans le sens du poil. Après-rasage sans alcool.'+(has('Poils incarnés')?' Pas de passage répété au même endroit.':'')})}
    if(q.rasage==='Je garde la barbe'){M.push({t:'Barbe',d:'Lave-la avec ton nettoyant, puis quelques gouttes d’huile à barbe pour éviter les démangeaisons.'})}
    S.push({t:'Nettoyer',d:cl.replace(', ou juste de l’eau tiède le matin','')+'. Le soir, c’est le nettoyage le plus important : il enlève sueur, pollution et crème solaire.'});
    if(sens){S.push({t:'Réparer',d:'Pas d’actif pendant 2 à 3 semaines : une crème apaisante seulement, le temps que la peau se calme.'})}
    else if(has('Boutons')||has('Points noirs')){S.push({t:'Désincruster',d:'Un soin à l’acide salicylique (BHA), 2 à 3 soirs par semaine pour commencer, puis plus si ta peau le supporte.'})}
    else if(has('Taches')||has('Marques de boutons')){S.push({t:'Unifier',d:'Un soin à la niacinamide ou à l’acide azélaïque doux, tous les soirs.'})}
    else if(has('Peau terne')){S.push({t:'Exfolier',d:'Un exfoliant doux (AHA, acide lactique) 1 à 2 soirs par semaine.'})}
    S.push({t:'Hydrater',d:dry?'Ta crème riche, un peu plus généreuse le soir.':oily?'Ton gel-crème léger.':'Ta crème hydratante.'});
    if(!sens){H.push({t:'Gommage doux',d:'1 fois par semaine, sans frotter fort (pas les soirs d’exfoliant).'})}
    if(oily){H.push({t:'Masque à l’argile',d:'1 fois par semaine sur les zones qui brillent, 10 minutes maximum.'})}
    if(has('Boutons')){H.push({t:'Taie d’oreiller',d:'Change-la 1 à 2 fois par semaine.'})}
    if(dry||has('Tiraillements')){H.push({t:'Masque hydratant',d:'1 fois par semaine, en couche épaisse.'})}
    T.push('Ne perce pas tes boutons : ça laisse des marques qui durent des mois.','Teste un seul nouveau produit à la fois, pendant 2 à 3 semaines, avant de juger.','Bois régulièrement et dors suffisamment : la peau le montre vite.','Nettoie l’écran de ton téléphone et évite de toucher ton visage.');
  }else{
    M.push({t:'Douche',d:P('Gel douche surgras ou huile lavante')+', eau tiède et douche courte.'+(has('Boutons dans le dos')?' Sur le dos : un gel lavant à l’acide salicylique, laissé 1 minute avant de rincer.':'')});
    M.push({t:'Hydrater',d:has('Petits boutons sur les bras')||dry||has('Peau sèche')?'Un lait corps à l’urée (5 à 10 %) juste après la douche, sur peau encore un peu humide.':P('Un lait corps léger après la douche')});
    if(has('Transpiration')){S.push({t:'Anti-transpirant',d:'Applique-le le soir, sur peau bien sèche : il est plus efficace qu’au matin.'})}
    if(has('Vergetures')){S.push({t:'Vergetures',d:'Hydrate et masse les zones concernées tous les soirs. Elles s’estompent et blanchissent avec le temps, surtout après une grosse perte de poids.'})}
    if(!S.length){S.push({t:'Hydrater',d:'Un peu de lait corps sur les zones sèches (coudes, jambes).'})}
    if(!sens){H.push({t:'Gommage doux',d:(has('Poils incarnés')?'2':'1')+' fois par semaine, surtout là où tu te rases.'})}
    if(has('Boutons dans le dos')){H.push({t:'Après le sport',d:'Change de t-shirt et douche-toi vite après l’entraînement.'})}
    if(q.soleil==='Souvent dehors'){M.push({t:'Protéger',d:'Crème solaire sur les zones découvertes (nuque, bras) quand il fait beau.'})}
    T.push('Eau tiède plutôt que chaude : l’eau très chaude dessèche la peau.','Sèche-toi en tamponnant, sans frotter.','Des vêtements de sport respirants limitent les boutons sur le dos.');
  }
  T.push('Si un bouton reste douloureux, si des plaques s’étendent, si un grain de beauté change d’aspect, ou si rien ne s’améliore après 2 à 3 mois : prends l’avis d’un dermatologue.');
  return{matin:M.slice(0,6),soir:S.slice(0,5),hebdo:H,conseils:T,resume:''};
}
function gqDone(btn){
  if(!GQ.type){$('#gq_m').innerHTML='<span class="tko">Choisis d’abord à quoi ressemble ta peau.</span>';return}
  var z={type:GQ.type,conc:GQ.conc,routine0:GQ.routine,rasage:GQ.rasage,soleil:GQ.soleil,budget:GQ.budget,parfum:GQ.parfum,desc:GQ.desc,date:todayKey()};
  z.plan=glRules(Object.assign({zone:GQ.zone},z));z.ai=false;GL.zones[GQ.zone]=z;GL.zone=GQ.zone;glSave();
  PROF=PROF||{done:1};PROF.peau=Object.keys(GL.zones).map(function(k){var q=GL.zones[k];return k+' : '+q.type+(q.conc.length?' ('+q.conc.join(', ')+')':'')}).join(' ; ');PROF.maj=todayKey();profSave();profPush();
  closeSh();goTab('glow');renderGlow();toast('Ta routine est prête ✨');
  if(live()){setTimeout(function(){glAI(GQ.zone,true)},400)}
}
/* l'IA affine la routine (Gemini, via ta feuille) */
function glowCall(p){
  if(gs()){return new Promise(function(res,rej){google.script.run.withSuccessHandler(res).withFailureHandler(rej).appGlow(p)})}
  return fetch(CFG.url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(Object.assign({key:CFG.key,action:'glow'},p)),redirect:'follow'})
   .then(function(r){return r.text()}).then(function(t){var d;try{d=JSON.parse(t)}catch(e){throw new Error('Réponse inattendue de ta feuille')}if(d.error){throw new Error(d.error)}return d});
}
function glAI(zone,auto){
  var z=GL.zones[zone];if(!z){return}if(!live()){toast('L’IA a besoin de ta feuille reliée');return}
  var b=$('#glai');if(b){b.disabled=true;b.innerHTML='<span class="cchd" style="display:inline-flex"><i></i><i></i><i></i></span> L’IA prépare ta routine…'}
  glowCall({zone:zone,bilan:{type:(SKT.filter(function(t){return t[0]===z.type})[0]||[0,z.type])[1],remarques:z.conc,utilise_deja:z.routine0,rasage:z.rasage,soleil:z.soleil,budget:z.budget,parfum:z.parfum,description:z.desc},prenom:uname().trim()})
   .then(function(d){var r=d.routine||{};if(!r.matin||!r.soir){throw new Error('Réponse incomplète')}
     z.plan={matin:r.matin.slice(0,6),soir:r.soir.slice(0,5),hebdo:r.hebdo||[],conseils:(r.conseils||[]).concat([glRules(Object.assign({zone:zone},z)).conseils.slice(-1)[0]]),resume:r.resume||''};z.ai=true;glSave();renderGlow();toast('Routine personnalisée par l’IA ✨')})
   .catch(function(e){var m=String(e&&e.message||e);if(!auto||!/inconnue/i.test(m)){toast(/inconnue/i.test(m)?'L’IA Glow up n’est pas encore installée dans ta feuille':'IA : '+m.slice(0,60))}renderGlow()});
}
/* journal de la routine et Glow score */
function glDay(k){return GLOG[k]||{m:[],s:[]}}
function glToggle(mo,i){var k=todayKey(),d=glDay(k),a=d[mo],j=a.indexOf(i);if(j>=0){a.splice(j,1)}else{a.push(i)}GLOG[k]=d;glLogSave();
  var z=GL.zones[GL.zone],n=z?z.plan[mo==='m'?'matin':'soir'].length:0;if(navigator.vibrate){navigator.vibrate(8)}
  if(j<0&&a.length===n){toast(mo==='m'?'Routine du matin faite ✨':'Routine du soir faite ✨');if(typeof petCheer==='function'){petCheer('Peau au top ce '+(mo==='m'?'matin':'soir')+' ✨')}}
  renderGlow();}
function glDone(k){var d=glDay(k),z=GL.zones.visage||GL.zones.corps;if(!z){return 0}var n=z.plan.matin.length+z.plan.soir.length;return n?Math.min(1,(d.m.length+d.s.length)/n):0}
function glStreak(){var n=0,k=todayKey();if(glDone(k)<.7){k=addDays(k,-1)}while(glDone(k)>=.7&&n<999){n++;k=addDays(k,-1)}return n}
function glScore(){
  var z=GL.zones.visage||GL.zones.corps;if(!z){return null}var start=Object.keys(GL.zones).map(function(k){return GL.zones[k].date}).sort()[0],days=[],k=todayKey();
  for(var i=0;i<14;i++){var dk=addDays(k,-i);if(dk<start){break}if(i===0&&new Date().getHours()<20&&glDone(dk)<.7){continue}days.push(glDone(dk))}
  var rt=days.length?avg(days)*100:null,sl=null,wa=null;
  if(D){var t=D.targets,w=D.week,s=avg(w.sleep.filter(function(x){return x!=null&&x<=12})),wt=avg((w.water||[]).filter(function(x){return x!=null}));if(s!=null&&t.sleep){sl=Math.min(100,s/t.sleep*100)}if(wt!=null&&t.water){wa=Math.min(100,wt/t.water*100)}}
  var parts=[[rt,.6],[sl,.2],[wa,.2]].filter(function(x){return x[0]!=null}),tw=parts.reduce(function(a,x){return a+x[1]},0);
  return{v:tw?Math.round(parts.reduce(function(a,x){return a+x[0]*x[1]},0)/tw):null,rt:rt,sl:sl,wa:wa,streak:glStreak()};
}
function renderGlow(){
  var el=$('#v-glow');if(!el){return}var Z=GL.zones,has=Object.keys(Z).length;
  if(!has){
    el.innerHTML='<div class="g glh"><div class="glhi">'+skinSvg('normale')+'</div><div class="big" style="font-size:26px;margin:14px 0 6px">Prends soin de ta peau</div><div class="note" style="line-height:1.55">Un petit bilan, et Forme te propose une routine simple pour le matin et le soir. Tu la coches chaque jour et ton Glow score monte.</div>'+
     '<button class="obgo" style="margin-top:18px" onclick="openGlowQuiz(\'visage\')">Faire mon bilan visage</button><button class="g pill" style="width:100%;padding:13px;margin-top:10px" onclick="openGlowQuiz(\'corps\')">Bilan du corps</button></div>'+glSoon();
    return;
  }
  if(!Z[GL.zone]){GL.zone=Z.visage?'visage':'corps'}
  var z=Z[GL.zone],S=glScore(),h=new Date().getHours(),mo=GL.moment||(h<15?'m':'s'),d=glDay(todayKey()),L=z.plan[mo==='m'?'matin':'soir'],ty=SKT.filter(function(t){return t[0]===z.type})[0];
  var ring=function(v){var R=44,C=2*Math.PI*R,p=v==null?0:v/100;return '<svg viewBox="0 0 100 100" class="glr"><circle cx="50" cy="50" r="'+R+'" fill="none" stroke="rgba(var(--fgr),.1)" stroke-width="8"/><circle cx="50" cy="50" r="'+R+'" fill="none" stroke="url(#glg)" stroke-width="8" stroke-linecap="round" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+(C*(1-p)).toFixed(1)+'" transform="rotate(-90 50 50)" class="dwa" style="--c:'+C.toFixed(1)+'"/><defs><linearGradient id="glg" x1="0" x2="1"><stop offset="0" style="stop-color:var(--ac2)"/><stop offset="1" style="stop-color:var(--ac)"/></linearGradient></defs></svg>'};
  var bar=function(l,v){return '<div class="glb"><span>'+l+'</span><div class="tr"><i style="width:'+(v==null?0:Math.round(v))+'%;background:linear-gradient(90deg,var(--acd),var(--ac2))"></i></div><b>'+(v==null?'—':Math.round(v)+' %')+'</b></div>'};
  el.innerHTML=
   '<div class="g glsc"><div class="glrw">'+ring(S&&S.v)+'<div class="glrn"><b>'+(S&&S.v!=null?S.v:'—')+'</b><span>Glow score</span></div></div><div style="flex:1;min-width:0">'+bar('Routine',S&&S.rt)+bar('Sommeil',S&&S.sl)+bar('Hydratation',S&&S.wa)+
    '<div class="note" style="margin-top:8px">'+(S&&S.streak?'🔥 '+S.streak+' jour'+(S.streak>1?'s':'')+' d’affilée':'Coche ta routine pour lancer ta série')+'</div></div></div>'+
   (Z.visage&&Z.corps?'<div class="g seg fseg" style="margin-top:14px"><u style="width:calc(50% - 3px);transform:translateX('+(GL.zone==='corps'?100:0)+'%)"></u><button class="'+(GL.zone==='visage'?'on':'')+'" onclick="GL.zone=\'visage\';glSave();renderGlow()">Visage</button><button class="'+(GL.zone==='corps'?'on':'')+'" onclick="GL.zone=\'corps\';glSave();renderGlow()">Corps</button></div>':'')+
   '<div class="sth"><h2>Routine du jour</h2><div class="glmo"><button class="'+(mo==='m'?'on':'')+'" onclick="GL.moment=\'m\';renderGlow()">☀️ Matin</button><button class="'+(mo==='s'?'on':'')+'" onclick="GL.moment=\'s\';renderGlow()">🌙 Soir</button></div></div>'+
   '<div class="g" style="padding:4px 16px">'+L.map(function(s,i){var on=d[mo].indexOf(i)>=0;return '<button class="glst'+(on?' on':'')+'" onclick="glToggle(\''+mo+'\','+i+')"><i>'+(on?'<svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9"/></svg>':'')+'</i><div><b>'+esc(s.t)+'</b><div class="note">'+esc(s.d)+'</div></div></button>'}).join('')+'</div>'+
   (z.plan.hebdo&&z.plan.hebdo.length?'<h2>Chaque semaine</h2><div class="g" style="padding:6px 16px">'+z.plan.hebdo.map(function(s){return '<div class="glw"><b>'+esc(s.t)+'</b><div class="note">'+esc(s.d)+'</div></div>'}).join('')+'</div>':'')+
   '<h2>Tes conseils</h2><div class="g" style="padding:14px 16px">'+(z.plan.resume?'<p class="glres">'+esc(z.plan.resume)+'</p>':'')+'<ul class="glul">'+z.plan.conseils.map(function(c){return '<li>'+esc(c)+'</li>'}).join('')+'</ul>'+
    (live()?'<button class="g pill" id="glai" style="width:100%;padding:12px;margin-top:12px" onclick="glAI(GL.zone)">'+(z.ai?'Redemander à l’IA':'Personnaliser avec l’IA ✨')+'</button>':'<div class="note" style="margin-top:10px">Relie ta feuille pour que l’IA personnalise ta routine.</div>')+
    '<div class="note" style="margin-top:8px;font-size:11px">'+(z.ai?'Routine personnalisée par Gemini. ':'Routine de base Forme. ')+'Conseils beauté, pas un avis médical.</div></div>'+
   '<h2>Ta peau</h2><div class="g glme"><div class="glmi">'+skinSvg(z.type)+'</div><div style="flex:1;min-width:0"><b>'+(GL.zone==='visage'?'Visage':'Corps')+' · '+(ty?ty[1]:z.type)+'</b><div class="note">'+(z.conc.length?esc(z.conc.join(' · ')):'Rien de particulier')+'</div><div class="note">Bilan du '+dl(z.date)+'</div></div></div>'+
   '<div class="glbt"><button class="g pill" onclick="openGlowQuiz(GL.zone)">Refaire le bilan</button>'+(!Z.visage||!Z.corps?'<button class="g pill" onclick="openGlowQuiz(\''+(Z.visage?'corps':'visage')+'\')">＋ Bilan '+(Z.visage?'du corps':'du visage')+'</button>':'')+'</div>'+glSoon();
}
function glSoon(){return '<h2>Bientôt</h2><div class="glsoon"><div class="g"><b>✂️ Cheveux</b><div class="note">Coupes adaptées à ton visage et à tes goûts</div></div><div class="g"><b>👕 Style</b><div class="note">Couleurs et coupes de vêtements qui te vont</div></div></div>'}


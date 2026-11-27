/* Forme · demarrage.js · Connexion à ta feuille, réglages et démarrage de l’appli */
/* ---------- Connexion à ta feuille Google (lien /exec + code secret, gardés sur ce téléphone) ---------- */
var CFG=null,LAST=0;
try{CFG=JSON.parse(localStorage.getItem('forme_cfg')||'null')}catch(e){}
function live(){return !!(gs()||(CFG&&CFG.url&&CFG.key))}
function cache(){try{return JSON.parse(localStorage.getItem('forme_cache')||'null')}catch(e){return null}}
function call(api,name,qs){
  return new Promise(function(res,rej){
    if(gs()){
      var r=google.script.run.withSuccessHandler(res).withFailureHandler(rej);
      if(api==='save'||api==='profil'){rej(new Error('Indisponible ici'));return}
      if(api==='dashboard'){r.getDashboardData()}else if(api==='list'){r.appListSheets()}else{r.appSheetData(name)}
      return;
    }
    if(!CFG){rej(new Error('Feuille non reliée'));return}
    var u=CFG.url+'?api='+api+'&key='+encodeURIComponent(CFG.key)+(name?'&name='+encodeURIComponent(name):'')+(qs?'&'+Object.keys(qs).map(function(k){return k+'='+encodeURIComponent(qs[k])}).join('&'):'')+'&t='+Date.now();
    fetch(u,{redirect:'follow'}).then(function(r){return r.text()}).then(function(t){
      var d;try{d=JSON.parse(t)}catch(e){throw new Error('Réponse inattendue : vérifie que le lien est bien celui de ton déploiement et que la nouvelle version est publiée.')}
      if(d&&d.error){throw new Error(d.error)}
      res(d);
    }).catch(function(e){
      rej(e instanceof TypeError?new Error('Lien injoignable : vérifie ta connexion, le lien, et que le déploiement est accessible à « Tout le monde ».'):e);
    });
  });
}
function toast(t){var el=$('#toast');el.textContent=t;el.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(function(){el.classList.remove('on')},2800)}
function demoBanner(){
  if(live()){return}
  if($('#dmb')){return}$('#v-week').insertAdjacentHTML('afterbegin','<div id="dmb" class="g tap" onclick="openSet()" style="margin:6px 0 12px;display:flex;align-items:center;gap:14px"><div class="ic" style="background:rgba(var(--fgr),.1)"><svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg></div><div><b>Mode démo</b><div class="note">Touche ici pour relier ta feuille Google</div></div></div>');
}
function obCheck(){if(!(PROF&&PROF.done)&&!document.body.classList.contains('obo')){setTimeout(function(){openOB(0)},500)}}
function load(manual){
  SD={};SDraw={};CUR=null;
  if(!live()){init(demo());mergeWeights();renderWeek();demoBanner();loadSheets();loadInsights();if(TAB==='moi'){renderMoi()}obCheck();return}
  if(!D){var c=cache();if(c){demoMode=false;init(c.d)}else{$('#v-week').innerHTML='<div class="skl" aria-label="Chargement de tes données"><i></i><i></i><i></i><i></i></div>'}}
  loadSheets();
  call('dashboard').then(function(d){
    demoMode=false;LAST=Date.now();
    try{localStorage.setItem('forme_cache',JSON.stringify({t:LAST,d:d}))}catch(e){}
    init(d);loadInsights();flushPending();ghCheck();loadMesSheet().then(function(){mergeWeights();renderWeek();if(TAB==='moi'){renderMoi()}});
    loadProfileSheet().then(function(){applyProfile();renderWeek();renderForce();setHead();paintAvatar();obCheck()});if(manual){toast('Données à jour')}
  }).catch(function(e){
    var c=cache();
    if(c){demoMode=false;if(!D){init(c.d)}toast('Hors ligne · données du '+new Date(c.t).toLocaleString('fr-FR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}))}
    else{$('#v-week').innerHTML='<div class="g errc"><div class="eri"><svg viewBox="0 0 24 24"><path d="M12 8v5M12 16.5v.5"/><circle cx="12" cy="12" r="9"/></svg></div><b>Impossible de charger tes données</b><div class="note">Vérifie ta connexion internet, puis réessaie. Si ça continue, regarde le lien et le code dans les réglages.<br><small>'+esc(e.message||e)+'</small></div><div class="tmr"><button class="g pill on" onclick="load(true)">Réessayer</button><button class="g pill" onclick="openSet()">Réglages</button></div></div>'}
  });
}
function openSet(){
  var c=CFG||{};
  openSh('<div class="sh-h"><div class="big" style="font-size:28px;margin:0">Réglages</div><button class="gb" onclick="closeSh()" aria-label="Fermer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'+
   '<div class="lab" style="margin:6px 4px 6px">Ton prénom</div><input id="cn" class="g srch" autocomplete="off" placeholder="Prénom" value="'+esc(uname())+'" oninput="try{localStorage.setItem(\'forme_name\',this.value)}catch(e){}setHead();paintAvatar()">'+
   '<div class="g setrow" style="margin-top:12px"><div><b style="font-weight:600">Mode clair</b><div class="note">Bascule aussi avec le bouton en haut</div></div><button class="sw'+(THEME==='light'?' on':'')+'" id="tsw" onclick="toggleTheme(this)" aria-label="Mode clair"><i></i></button></div>'+
   fxHtml()+'<div style="height:14px"></div>'+
   '<div class="g setrow"><div><b style="font-weight:600">'+esc(petName())+', ta mascotte '+ANIM[PS.an].e+'</b><div class="note">Te salue, t’encourage et dort quand tu dors</div></div><button class="sw'+(PET.on?' on':'')+'" onclick="petToggle(this)" aria-label="Mascotte"><i></i></button></div>'+
   '<button class="g setrow tap" style="width:100%;text-align:left" onclick="openPetRoom()"><div><b style="font-weight:600">Personnaliser ta mascotte 🐾</b><div class="note">Chat, chien ou requin, tenues, notifications</div></div><svg viewBox="0 0 24 24" style="width:18px;height:18px;color:var(--m)"><path d="M9 6l6 6-6 6"/></svg></button>'+
   (typeof cySetRow==='function'?cySetRow():'')+ghSetRow()+
   (live()?'<button class="g pill" style="width:100%;padding:14px;margin-bottom:22px" onclick="closeSh();load(true)">Actualiser mes données</button>':'')+
   '<div class="lab" style="margin:6px 4px 8px;font-size:15px;color:var(--t);font-weight:600">Données détaillées</div><div class="glbt" style="margin:0 0 14px"><button class="g pill" onclick="closeSh();goTab(\'bilan\')">📈 Bilans</button><button class="g pill" onclick="closeSh();goTab(\'data\')">🗂️ Ta feuille</button></div>'+
   '<button class="g setrow tap" style="width:100%;text-align:left" onclick="closeSh();openOB(1)"><div><b style="font-weight:600">Modifier mon profil 👤</b><div class="note">Objectif, habitudes, cibles</div></div><svg viewBox="0 0 24 24" style="width:18px;height:18px;color:var(--m)"><path d="M9 6l6 6-6 6"/></svg></button>'+
   '<div class="lab" style="margin:8px 4px 4px;font-size:15px;color:var(--t);font-weight:600">Connexion à ta feuille</div>'+
   '<div class="note" style="margin:0 4px 14px;line-height:1.5">Ces informations restent uniquement sur ce téléphone.</div>'+
   '<div class="lab" style="margin:0 4px 6px">Lien de ta feuille (se termine par /exec)</div><input id="cu" class="g srch" inputmode="url" autocomplete="off" placeholder="https://script.google.com/macros/s/…/exec" value="'+esc(c.url||'')+'">'+
   '<div class="lab" style="margin:16px 4px 6px">Code secret</div><input id="ck" class="g srch" type="password" autocomplete="off" placeholder="Le code choisi dans Code.gs" value="'+esc(c.key||'')+'">'+
   '<div id="cm" class="note" style="margin:14px 4px;min-height:18px"></div>'+
   '<button class="g pill on" style="width:100%;padding:14px" onclick="saveSet()">Enregistrer et charger</button>'+
   (c.url?'<button class="g pill" style="width:100%;padding:14px;margin-top:10px" onclick="resetSet()">Déconnecter et revenir à la démo</button>':'')+
   '<div class="note" style="margin-top:18px;text-align:center">Version de l’appli : '+FORME_V+'</div>'+(LAST?'<div class="note" style="margin-top:18px;text-align:center">Dernière mise à jour à '+new Date(LAST).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})+'</div>':''));
  document.body.classList.add('full');
}
function saveSet(){
  var u=$('#cu').value.trim().split('?')[0],k=$('#ck').value.trim();
  if(!/^https:\/\/script\.google\.com\/.+\/exec$/.test(u)){$('#cm').innerHTML='<span class="tko">Colle le lien complet, celui qui se termine par /exec.</span>';return}
  if(!k){$('#cm').innerHTML='<span class="tko">Saisis ton code secret.</span>';return}
  $('#cm').textContent='Connexion…';var old=CFG;CFG={url:u,key:k};
  call('list').then(function(){
    try{localStorage.setItem('forme_cfg',JSON.stringify(CFG))}catch(e){}
    $('#cm').innerHTML='<span class="tok">Connecté ✓</span>';D=null;
    setTimeout(function(){closeSh();load(true)},700);
  }).catch(function(e){CFG=old;$('#cm').innerHTML='<span class="tko">'+esc(e.message||e)+'</span>'});
}
function resetSet(){CFG=null;D=null;try{localStorage.removeItem('forme_cfg');localStorage.removeItem('forme_cache')}catch(e){}closeSh();load()}
document.addEventListener('visibilitychange',function(){if(!document.hidden&&TAB==='moi'){start3d();tmTick();tmSched()}if(!document.hidden&&live()&&!gs()&&Date.now()-LAST>5*60e3){load()}});
if('serviceWorker' in navigator&&location.protocol==='https:'&&!gs()){navigator.serviceWorker.register('sw.js').catch(function(){})}
calm();setTimeout(lqBuild,300);lqSensor();
var FORME_V='26 nov. 2026 · accueil et eau';
/* ---------- Google Health (bracelet Fitbit lu directement) ---------- */
var GHS=null;
function ghUrl(){return CFG&&CFG.url?CFG.url+'?page=google&key='+encodeURIComponent(CFG.key):''}
function ghOpen(){var u=ghUrl();if(!u){toast('Relie d’abord ta feuille Google');return}window.open(u,'_blank')}
function ghCheck(){if(!CFG||!CFG.url){return}call('gh').then(function(s){GHS=s;if(ghNeeds()){renderWeek()}}).catch(function(){})}
function ghNeeds(){return !!(GHS&&GHS.configure&&!GHS.connecte)}
function ghSetRow(){if(!GHS||!GHS.configure){return ''}
  return '<div class="g setrow"><div><b style="font-weight:600">Google Health ⌚</b><div class="note">'+(GHS.connecte?'Connecté'+(GHS.derniere?' · lu le '+esc(GHS.derniere):'')+(GHS.joursRestants!=null?' · à renouveler dans '+GHS.joursRestants+' j':''):esc(GHS.message||'À connecter'))+'</div></div><button class="g pill'+(GHS.connecte?'':' on')+'" onclick="ghOpen()">'+(GHS.connecte?'Renouveler':'Connecter')+'</button></div>'}
var _ghWeek=renderWeek;renderWeek=function(){_ghWeek.apply(this,arguments);if(!ghNeeds()){return}var v=$('#v-week');if(!v||$('#ghwarn')){return}
  v.insertAdjacentHTML('afterbegin','<div class="g" id="ghwarn" style="margin:4px 0 14px;padding:14px 16px;display:flex;align-items:center;gap:12px"><div style="flex:1;min-width:0"><b style="font-weight:600">⌚ Google Health à reconnecter</b><div class="note" style="margin-top:3px;line-height:1.4">L’autorisation expire tous les 7 jours. Un clic et c’est reparti.</div></div><button class="g pill on" style="flex:none" onclick="ghOpen()">Reconnecter</button></div>')};

/* ---------- Chaque onglet démarre de façon indépendante : une erreur n'en bloque qu'un ---------- */
[['renderWeek','v-week','Semaine'],['renderForce','v-force','Entraînement'],['renderBilan','v-bilan','Bilans'],['renderMoi','v-moi','Moi'],['renderGlow','v-glow','Glow up']].forEach(function(g){
  var fn=window[g[0]];
  window[g[0]]=function(){
    if(typeof fn!=='function'){var el=document.getElementById(g[1]);if(el){el.innerHTML=errCard(g[2],'Le fichier de cet onglet ne s’est pas chargé.')}ferrLog(g[2],'fichier non chargé');return}
    try{return fn.apply(this,arguments)}catch(e){var v=document.getElementById(g[1]);if(v){v.innerHTML=errCard(g[2],e&&e.message||String(e))}ferrLog(g[2],(e&&e.stack||String(e)).split('\n').slice(0,3).join(' | '))}
  };
});
pLoad();
petInit();
load();
petGreet();

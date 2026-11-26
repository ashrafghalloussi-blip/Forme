/* Forme · objectifs.js · Parcours, sèche, coach Gemini, historique des séances, VO2 max */
/* =====================================================================
   Ton parcours (poids de départ → aujourd'hui → objectif), suivi « sèche », coach Gemini
   ===================================================================== */
var MOISC=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
function mlab(k){var p=k.split('-');return MOISC[+p[1]-1]+' '+p[0].slice(2)}
/* jalons stockés dans le profil (donc aussi dans l'onglet Profil de ta feuille) : "2024-11:120; 2025-02:100" */
function jalGet(){var s=PROF&&PROF.parcours||'',L=[];String(s).split(/[;\n]/).forEach(function(x){var m=x.trim().match(/^(\d{4}-\d{2})(?:-\d{2})?\s*:\s*([\d.,]+)/);if(m){L.push({d:m[1]+'-15',v:pn(m[2])})}});return L.filter(function(x){return x.v}).sort(function(a,b){return a.d<b.d?-1:1})}
function jalSet(L){PROF=PROF||{done:1};PROF.parcours=L.sort(function(a,b){return a.d<b.d?-1:1}).map(function(x){return x.d.slice(0,7)+':'+String(x.v).replace('.',',')}).join('; ');PROF.maj=todayKey();profSave();profPush()}
function parcoursPts(){
  var J=jalGet(),W=D?D.weights.slice().reverse():[],byM={};
  J.forEach(function(x){byM[x.d.slice(0,7)]={d:x.d,v:x.v}});
  W.forEach(function(x){var m=x.d.slice(0,7);if(!byM[m]||byM[m].w){var o=byM[m]&&byM[m].w?byM[m]:{d:x.d,s:0,n:0,w:1};o.s+=x.v;o.n++;o.v=o.s/o.n;o.d=x.d;byM[m]=o}});
  return Object.keys(byM).sort().map(function(m){return{d:byM[m].d,v:byM[m].v,l:mlab(m)}});
}
function parcoursSlide(){
  var J=jalGet(),lw=D&&D.weights.length?D.weights[0].v:null,t=D?D.targets.weight:null;
  if(!J.length||lw==null){return '<div class="g slide tap" onclick="openParcours()"><div class="lab">Ton parcours 🛤️</div><div class="big" style="font-size:26px;margin-top:10px">D’où tu pars</div><div class="note" style="margin-top:6px;line-height:1.5">Ajoute ton poids de départ et quelques étapes : Forme affichera tout le chemin parcouru, pas seulement les dernières semaines.</div><button class="g pill on" style="margin-top:14px;padding:11px 16px">＋ Ajouter mon départ</button></div>'}
  var s=J[0],lost=s.v-lw,tot=t!=null?s.v-t:null,pr=tot>0?Math.max(0,Math.min(100,lost/tot*100)):null,P=parcoursPts();
  return '<div class="g slide tap" onclick="openParcours()"><div class="lab">Ton parcours 🛤️</div><div class="big">'+(lost>=0?'−':'+')+f(Math.abs(lost),1)+'<small>kg</small></div>'+
   '<div class="note">depuis '+mlab(s.d)+' · '+f(s.v,1)+' → '+f(lw,1)+' kg</div>'+
   (pr!=null?'<div class="tr" style="margin-top:12px"><i style="width:'+pr.toFixed(1)+'%;background:linear-gradient(90deg,var(--acd),var(--ac2));box-shadow:0 0 14px rgba(var(--acr),.35)"></i></div><div class="note" style="margin-top:6px">'+(lw<=t?'Objectif atteint 🎉':Math.round(pr)+' % du chemin · plus que '+f(lw-t,1)+' kg')+'</div>':'')+
   (P.length>1?lineChart(P.slice(-14),t,'kg',FG()):'')+'</div>';
}
function openParcours(){
  var J=jalGet(),lw=D&&D.weights.length?D.weights[0]:null;
  openSh('<div class="sh-h"><div class="big" style="font-size:28px;margin:0">Ton parcours</div><button class="gb" onclick="closeSh()" aria-label="Fermer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'+
   '<div class="note" style="margin:-4px 4px 14px;line-height:1.5">Ton point de départ et les grandes étapes. Les pesées de ta feuille s’ajoutent toutes seules à la courbe.</div>'+
   '<div class="g" style="padding:6px 16px">'+(J.length?J.map(function(x,i){return '<div class="jlr"><div><b>'+f(x.v,1)+' kg</b><div class="note">'+(i?'':'Départ · ')+mlab(x.d)+'</div></div><button class="note" onclick="jalDel(\''+x.d+'\')">Retirer</button></div>'}).join(''):'<div class="note" style="padding:12px 0">Aucune étape pour l’instant.</div>')+
   (lw?'<div class="jlr"><div><b>'+f(lw.v,1)+' kg</b><div class="note">Aujourd’hui · '+dl(lw.d)+'</div></div></div>':'')+'</div>'+
   '<div class="lab" style="margin:18px 4px 8px;font-size:15px;color:var(--t);font-weight:600">Ajouter une étape</div>'+
   '<div class="mfg"><label><span>Mois</span><input class="g srch" id="jl_m" type="month" value="'+todayKey().slice(0,7)+'"></label><label><span>Poids (kg)</span><input class="g srch" id="jl_v" type="number" inputmode="decimal" step="0.1" placeholder="Ex. 120"></label></div>'+
   '<div id="jl_msg" class="note" style="margin:10px 4px;min-height:16px"></div><button class="g pill on" style="width:100%;padding:14px" onclick="jalAdd()">Ajouter</button>');
  document.body.classList.add('full');
}
function jalAdd(){var m=$('#jl_m').value,v=pn($('#jl_v').value);if(!m||!v||v<30||v>300){$('#jl_msg').innerHTML='<span class="tko">Choisis un mois et un poids.</span>';return}
  var L=jalGet().filter(function(x){return x.d.slice(0,7)!==m});L.push({d:m+'-15',v:v});jalSet(L);openParcours();if(D){renderWeek()}toast('Étape ajoutée')}
function jalDel(d){jalSet(jalGet().filter(function(x){return x.d!==d}));openParcours();if(D){renderWeek()}}

/* ---------- Suivi « sèche » : activé d'office si ton objectif est de perdre du gras (ou les deux) ---------- */
function secheOn(){return PROF&&(PROF.objectif==='seche'||PROF.objectif==='recompo')}
function waistDelta(){var a=MES.filter(function(m){return m.taille!=null&&m.taille!==''}).sort(function(x,y){return x.date<y.date?-1:1});if(a.length<2){return null}
  var l=a[a.length-1],ref=null;for(var i=a.length-2;i>=0;i--){ref=a[i];if(a[i].date<=addDays(l.date,-21)){break}}return{d:+l.taille-+ref.taille,from:ref.date,to:l.date,v:+l.taille}}
function strengthDelta(){
  if(!SEH){if(!strengthDelta.asked){strengthDelta.asked=1;loadHist(function(){var o=$('#sxs');if(o){o.outerHTML=secheSlide()}})}return null}
  var now=todayKey(),a=addDays(now,-28),b=addDays(now,-56),ch=[];
  Object.keys(SEH.E).forEach(function(k){var q=SEH.E[k],r=0,o=0;Object.keys(q.sessions).forEach(function(d){var best=0;q.sessions[d].sets.forEach(function(s){if(s.c&&s.r&&s.r<=15){best=Math.max(best,s.c*(1+s.r/30))}});if(d>a){r=Math.max(r,best)}else if(d>b){o=Math.max(o,best)}});if(r&&o){ch.push((r-o)/o*100)}});
  if(ch.length<2){return null}ch.sort(function(x,y){return x-y});return{p:ch[Math.floor(ch.length/2)],n:ch.length}
}
function secheSlide(){
  if(!secheOn()||!D){return ''}
  var lw=D.weights.length?D.weights[0].v:null,tr=trend(D.weights),rate=tr?tr.slope*7:null,pct=rate!=null&&lw?rate/lw*100:null,W=waistDelta(),S=strengthDelta(),v,cls;
  var fast=pct!=null&&pct<-1,flat=pct!=null&&pct>-.15,wd=W&&W.d<=-.5,wu=W&&W.d>=.5,sd=S&&S.p<=-5,su=S&&S.p>=-1;
  if(sd&&(fast||pct!=null&&pct<-.3)){v='Ta force baisse pendant que le poids descend : ralentis un peu, garde tes protéines et ton sommeil au top.';cls='ko'}
  else if(fast){v='Tu perds vite. Au-delà de 1 % de ton poids par semaine, le muscle risque de partir avec le gras.';cls='ko'}
  else if(flat&&wd){v='La balance bouge peu mais ta taille baisse : c’est de la recomposition, tu es sur la bonne voie.';cls='ok'}
  else if(flat&&!wd&&W){v='Poids et taille stables depuis quelques semaines : c’est peut-être un plateau. Regarde tes calories et ton activité.';cls='nt'}
  else if(pct!=null&&!sd){v=wd?'Le poids descend, la taille aussi et ta force tient : tu sèches bien.':'Bon rythme de perte. Mesure ton tour de taille toutes les 2 semaines pour confirmer.';cls='ok'}
  else{v='Pèse-toi 2 à 3 fois par semaine et mesure ton tour de taille toutes les 2 semaines : le bilan s’affinera.';cls='nt'}
  function m(l,val,c){return '<div><span>'+l+'</span><b class="'+(c||'')+'">'+val+'</b></div>'}
  return '<div class="g slide" id="sxs"><div class="lab">'+(PROF.objectif==='recompo'?'Recomposition':'Ta sèche')+' 🔥</div>'+
   '<div class="sxg">'+m('Poids / semaine',rate==null?'—':(rate>0?'+':'−')+f(Math.abs(rate),2)+' kg',fast?'tko':rate!=null&&rate<0?'tok':'')+
     m('Tour de taille',W?(W.d>0?'+':W.d<0?'−':'')+f(Math.abs(W.d),1)+' cm':'—',wd?'tok':wu?'tko':'')+
     m('Force (4 sem.)',S?(S.p>0?'+':S.p<0?'−':'')+f(Math.abs(S.p),1)+' %':'—',sd?'tko':su?'tok':'')+'</div>'+
   '<div class="note" style="margin-top:4px;font-size:11px">'+(pct!=null?'Soit '+f(Math.abs(pct),2)+' % de ton poids par semaine · repère : 0,3 à 1 %':'Il faut quelques pesées pour calculer ton rythme')+'</div>'+
   '<div class="sxv sx-'+cls+'"><i></i><span>'+v+'</span></div>'+
   (W?'':'<button class="g pill" style="margin-top:12px;padding:10px 14px" onclick="goTab(\'moi\');setTimeout(function(){moiGo(1)},500)">Mesurer mon tour de taille</button>')+'</div>';
}

/* ---------- Coach Gemini (via ta feuille : la clé reste dans Apps Script) ---------- */
var COACH=null;try{COACH=JSON.parse(localStorage.getItem('forme_coach')||'null')}catch(e){}
function coachSave(c){COACH=c;try{localStorage.setItem('forme_coach',JSON.stringify(c))}catch(e){}}
function coachCall(p){
  if(gs()){return new Promise(function(res,rej){google.script.run.withSuccessHandler(res).withFailureHandler(rej).appCoach(p)})}
  return fetch(CFG.url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(Object.assign({key:CFG.key,action:'coach'},p)),redirect:'follow'})
   .then(function(r){return r.text()}).then(function(t){var d;try{d=JSON.parse(t)}catch(e){throw new Error('Réponse inattendue de ta feuille')}if(d.error){throw new Error(d.error)}return d});
}
function coachHtml(t){return esc(t).replace(/\*\*?([^*]+)\*\*?/g,'$1').split(/\n{2,}|\n/).filter(function(x){return x.trim()}).map(function(x){return '<p>'+x+'</p>'}).join('')}
function coachAsk(kind,seance,where){
  if(!live()){toast('Le coach a besoin de ta feuille reliée');return Promise.resolve(null)}
  var slot=where||null;if(slot){slot.innerHTML='<div class="cchd"><i></i><i></i><i></i></div>'}
  var b=$('#ccbtn');if(b){b.disabled=true;b.textContent='Le coach réfléchit…'}
  return coachCall({kind:kind,seance:seance||null,prenom:uname().trim()}).then(function(d){
    var c={d:new Date().toISOString(),k:kind,t:String(d.text||'').trim()};coachSave(c);
    if(slot){slot.innerHTML=coachHtml(c.t)}renderCoach();return c;
  }).catch(function(e){var m=String(e&&e.message||e);
    if(slot){slot.innerHTML='<p class="note">'+esc(/inconnue/i.test(m)?'Le coach n’est pas encore installé dans ta feuille.':m)+'</p>'}
    var b2=$('#ccbtn');if(b2){b2.disabled=false;b2.textContent='Demander un bilan'}toast(/inconnue/i.test(m)?'Coach pas encore installé dans ta feuille':'Coach : '+m.slice(0,60));return null});
}
function coachSlide(){return '<div class="g slide" id="ccs"></div>'}
function renderCoach(){
  var el=$('#ccs');if(!el){return}var c=COACH;
  el.innerHTML='<div class="lab">Le mot du coach 🧠</div>'+
   (c?'<div class="ccx" onclick="openCoach()">'+coachHtml(c.t)+'</div><div class="note" style="margin-top:6px">'+(c.k==='seance'?'Après ta séance':'Bilan')+' · '+new Date(c.d).toLocaleDateString('fr-FR',{day:'numeric',month:'short'})+'</div>':
     '<div class="note" style="margin-top:10px;line-height:1.5">'+(live()?'Après chaque séance, Gemini lit ta semaine (sommeil, nutrition, charges, fatigue) et te donne un retour personnalisé.':'Disponible quand ta feuille Google est reliée.')+'</div>')+
   (live()?'<button class="g pill" id="ccbtn" style="margin-top:12px;padding:10px 14px" onclick="coachAsk(\'semaine\')">Demander un bilan</button>':'');
}
function openCoach(){if(!COACH){return}openSh('<div class="sh-h"><div class="big" style="font-size:28px;margin:0">Le mot du coach</div><button class="gb" onclick="closeSh()" aria-label="Fermer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div class="g ccf">'+coachHtml(COACH.t)+'</div><div class="note" style="margin:12px 6px;line-height:1.5">Conseils générés par Gemini à partir de tes données. Ce ne sont pas des conseils médicaux.</div>')}
/* dernier message enregistré dans l'onglet Coach de ta feuille (si plus récent que celui du téléphone) */
function coachFromSheet(){
  if(!live()||!SL||!SL.some(function(x){return x.name==='Coach'})){return}
  getRaw('Coach',function(v){if(!v||v.length<2){return}var r=v[v.length-1],t=String(r[2]||'').trim();if(!t){return}if(!COACH||COACH.t!==t){var dk=toKey(r[0]);coachSave({d:dk?new Date(dk+'T12:00:00').toISOString():new Date().toISOString(),k:/s[ée]ance/i.test(r[1])?'seance':'semaine',t:t});renderCoach()}});
}

/* =====================================================================
   Historique des séances : liste par mois, détail complet d'une séance
   ===================================================================== */
var HSV=null;
function sesAll(){
  if(!SEH){return null}if(HSV&&HSV.src===SEH){return HSV.L}
  var by={},best={};
  Object.keys(SEH.E).forEach(function(k){var q=SEH.E[k];Object.keys(q.sessions).sort().forEach(function(d){var S=q.sessions[d],e=0,ton=0,ns=0,stim=0;
    S.sets.forEach(function(s){if(s.c&&s.r){e=Math.max(e,s.c*(1+Math.min(s.r,15)/30));ton+=s.c*s.r}ns++;if(s.i!=null&&s.i<=2){stim++}});
    var rec=e>0&&best[k]!=null&&e>best[k]*1.005;if(e>0){best[k]=Math.max(best[k]||0,e)}
    var o=by[d]=by[d]||{d:d,ex:[],sets:0,ton:0,stim:0,min:0,recs:0,names:{}};
    o.ex.push({n:q.n,g:q.g,sets:S.sets,e1:e,rec:rec,min:S.min||0});o.sets+=ns;o.ton+=ton;o.stim+=stim;o.min+=S.min||0;if(rec){o.recs++}
    if(S.name){o.names[S.name]=(o.names[S.name]||0)+1}})});
  var L=Object.keys(by).sort().reverse().map(function(d){var o=by[d],nm=Object.keys(o.names).sort(function(a,b){return o.names[b]-o.names[a]})[0];
    if(!nm){var g={};o.ex.forEach(function(x){var gg=(x.g||'').replace(' (Réf.)','');if(gg){g[gg]=(g[gg]||0)+x.sets.length}});var tg=Object.keys(g).sort(function(a,b){return g[b]-g[a]}).slice(0,2);nm=tg.length?tg.join(' · '):'Séance'}
    o.n=nm;return o});
  HSV={src:SEH,L:L};return L;
}
function sesNeed(cb){if(SEH){cb();return}loadHist(function(){cb()})}
function sesRow(o,i,inTab){return '<button class="hsr" onclick="openSession(\''+o.d+'\','+(inTab?0:1)+')"><div class="hsd"><b>'+o.d.slice(8)+'</b><span>'+MOISC[+o.d.slice(5,7)-1]+'</span></div><div style="flex:1;min-width:0;text-align:left"><b>'+esc(o.n)+'</b><div class="note">'+o.ex.length+' exercice'+(o.ex.length>1?'s':'')+' · '+o.sets+' séries'+(o.min?' · '+f(o.min)+' min cardio':'')+'</div></div><div style="text-align:right;flex:none"><b>'+(o.ton?f(o.ton/1000,1)+' t':'—')+'</b>'+(o.recs?'<div class="note" style="color:var(--act)">🔥 '+o.recs+' record'+(o.recs>1?'s':'')+'</div>':'')+'</div><svg viewBox="0 0 24 24" class="hsc"><path d="M9 6l6 6-6 6"/></svg></button>'}
function histHtml(L,inTab){
  if(!L.length){return '<div class="g" style="text-align:center;padding:26px 18px"><b>Aucune séance pour l’instant</b><div class="note" style="margin:6px 0 14px">Tes séances apparaîtront ici dès la première.</div>'+(inTab?'':'<button class="g pill on" onclick="closeSh();openSeance()">＋ Nouvelle séance</button>')+'</div>'}
  var m30=L.filter(function(o){return o.d>=addDays(todayKey(),-30)}),t30=m30.reduce(function(a,o){return a+o.ton},0);
  var h='<div class="hsk"><div><b>'+L.length+'</b><span>séances en tout</span></div><div><b>'+m30.length+'</b><span>sur 30 jours</span></div><div><b>'+f(t30/1000,1)+'<small> t</small></b><span>tonnage 30 j</span></div></div>',cur='';
  L.forEach(function(o,i){var mo=o.d.slice(0,7);if(mo!==cur){if(cur){h+='</div>'}cur=mo;var p=mo.split('-');h+='<div class="lab hsm">'+['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'][+p[1]-1]+' '+p[0]+'</div><div class="g" style="padding:2px 14px">'}h+=sesRow(o,i,inTab)});
  return h+'</div>';
}
function openHistory(){
  openSh('<div class="sh-h"><div class="big" style="font-size:28px;margin:0">Historique</div><button class="gb" onclick="closeSh()" aria-label="Fermer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div id="hsl"><div class="skl"><i></i><i></i></div></div>');
  document.body.classList.add('full');
  sesNeed(function(){var el=$('#hsl');if(el){el.innerHTML=histHtml(sesAll()||[])}});
}
function openSession(d,back){
  openSh('<div id="hss"><div class="skl"><i></i><i></i></div></div>');document.body.classList.add('full');
  sesNeed(function(){var el=$('#hss');if(!el){return}var o=(sesAll()||[]).filter(function(x){return x.d===d})[0];
    var top='<div class="sh-h">'+(back?'<button class="gb" onclick="openHistory()" aria-label="Retour"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>':'')+'<div style="flex:1;min-width:0;margin:0 10px"><div class="note">'+fdate(d+'T12:00:00')+'</div><div class="big" style="font-size:24px;margin:0;white-space:normal">'+(o?esc(o.n):'Séance')+'</div></div><button class="gb" onclick="closeSh()" aria-label="Fermer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>';
    if(!o){el.innerHTML=top+'<div class="g note" style="padding:18px">Détail indisponible pour cette séance.</div>';return}
    var h=top+'<div class="hsk"><div><b>'+(o.ton?(o.ton>=1000?f(o.ton/1000,2)+'<small> t</small>':f(o.ton)+'<small> kg</small>'):'—')+'</b><span>tonnage</span></div><div><b>'+o.sets+'</b><span>séries</span></div><div><b>'+o.ex.length+'</b><span>exercices</span></div>'+(o.min?'<div><b>'+f(o.min)+'<small> min</small></b><span>cardio</span></div>':'')+'</div>'+
      (o.recs?'<div class="sxv sx-ok" style="margin:2px 0 12px"><i></i><span>🔥 '+o.recs+' record'+(o.recs>1?'s battus':' battu')+' pendant cette séance</span></div>':'');
    o.ex.forEach(function(x){
      h+='<div class="g hse"><div class="sexh"><div class="exi">'+exSvg(x.n,x.g,52)+'</div><div style="flex:1;min-width:0"><b>'+esc(x.n)+'</b><div class="note">'+esc((x.g||'').replace(' (Réf.)',''))+(x.e1?' · 1RM estimé '+f(x.e1,1)+' kg':'')+'</div></div>'+(x.rec?'<span class="hsb">🔥 Record</span>':'')+'</div>'+
        (x.sets.length?'<div class="hst">'+x.sets.map(function(s,i){return '<div><span>'+(i+1)+'</span><b>'+(s.c?f(s.c,s.c%1?1:0)+' kg':'Poids du corps')+' × '+f(s.r,s.r%1?1:0)+'</b><em>'+(s.i!=null?'RIR '+f(s.i,s.i%1?1:0):'')+(s.p?' · '+(s.p>=60?Math.floor(s.p/60)+' min'+(s.p%60?' '+s.p%60:''):s.p+' s'):'')+'</em></div>'}).join('')+'</div>':'')+
        (x.min?'<div class="note" style="margin-top:8px">Cardio : '+f(x.min)+' min</div>':'')+'</div>';
    });
    h+='<div class="hsa"><button class="g pill on" onclick="sesEdit(\''+d+'\')">Modifier la séance</button><button class="g pill hsdel" onclick="sesDel(\''+d+'\',this)">Supprimer</button></div><div id="hsm" class="note" style="text-align:center;margin-top:10px;min-height:16px"></div>';
    el.innerHTML=h;
  });
}


/* ---------- modifier / supprimer une séance ---------- */
function sesEdit(d){
  var o=(sesAll()||[]).filter(function(x){return x.d===d})[0];if(!o){return}
  function s2(v){return v==null||v===''?'':String(v).replace('.',',')}
  SE={edit:d,date:d,name:Object.keys(o.names).length?o.n:'',fat:0,notes:'',id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),
    ex:o.ex.map(function(x){var card=isCardio(x.n,x.g)||(!x.sets.length&&x.min>0);return{n:x.n,g:x.g,cardio:card,min:x.min?String(x.min):'',sets:card?[]:x.sets.map(function(s){return{c:s2(s.c),r:s2(s.r),i:s2(s.i),p:s.p==null?'':String(s.p)}})}})};
  seSave();SEV='edit';openSh('<div id="se"></div>');document.body.classList.add('full');seRender();
}
function sesDel(d,btn){
  var m=$('#hsm');
  if(!btn.dataset.ok){btn.dataset.ok=1;btn.textContent='Touche encore pour confirmer';m.textContent='La séance sera effacée de ta feuille (Musculation, Séries, Journal).';return}
  if(!live()){m.textContent='En mode démo, rien n’est supprimé : relie ta feuille dans les réglages.';return}
  btn.disabled=true;btn.textContent='Suppression…';
  postSeance({action:'supprimer',date:d}).then(function(){closeSh();toast('Séance supprimée');sesRefresh()})
   .catch(function(e){btn.disabled=false;btn.textContent='Supprimer';delete btn.dataset.ok;m.textContent=/inconnue/i.test(String(e.message))?'Ta feuille ne sait pas encore supprimer une séance : colle le nouveau code dans Apps Script.':(e instanceof TypeError?'Pas de réseau : réessaie quand tu seras connecté.':e.message||String(e))});
}
function sesRefresh(){Object.keys(SDraw).forEach(function(k){delete SDraw[k]});LOCALSER=[];SEH=null;HSV=null;
  if(TAB==='force'&&D){renderForce()}setTimeout(function(){load()},300)}
/* =====================================================================
   Cœur & VO2 max : estimation par calcul, valeur de la montre / du bracelet, test de marche,
   et « âge cardio » (comparaison aux moyennes de l'étude norvégienne HUNT3)
   ===================================================================== */
var VO2N={m:[[25,54],[35,49],[45,47],[55,42],[65,39],[75,34]],f:[[25,43],[35,40],[45,38],[55,34],[65,31],[75,27]]};
var VO2L=[],VO2S=null;try{VO2L=JSON.parse(localStorage.getItem('forme_vo2')||'[]')}catch(e){VO2L=[]}
function vo2Save(){try{localStorage.setItem('forme_vo2',JSON.stringify(VO2L))}catch(e){}
  var t=vo2Last('test'),m=vo2Last('montre');PROF=PROF||{done:1};
  PROF.vo2=[t?'test '+f(t.v,1)+' ('+t.d+')':'',m?'montre '+f(m.v,1)+' ('+m.d+')':''].filter(Boolean).join('; ');PROF.maj=todayKey();profSave();profPush()}
function vo2Sex(){return /^f|femme/i.test(String(PROF&&PROF.sexe||''))?'f':'m'}
function vo2Age(){var a=pn(PROF&&PROF.age);return a&&a>=10&&a<100?a:null}
function vo2Ref(age){var T=VO2N[vo2Sex()];if(age<=T[0][0]){return T[0][1]+(T[0][1]-T[1][1])/10*(T[0][0]-Math.max(18,age))}for(var i=0;i<T.length-1;i++){if(age<=T[i+1][0]){var a=T[i],b=T[i+1];return a[1]+(b[1]-a[1])*(age-a[0])/(b[0]-a[0])}}return T[T.length-1][1]}
function fitAge(v){
  var T=VO2N[vo2Sex()];if(v>=T[0][1]){var s=(T[0][1]-T[1][1])/10;return T[0][0]-(v-T[0][1])/s}
  for(var i=0;i<T.length-1;i++){var a=T[i],b=T[i+1];if(v>=b[1]){return a[0]+(a[1]-v)/(a[1]-b[1])*(b[0]-a[0])}}
  var l=T[T.length-1],p=T[T.length-2],s2=(p[1]-l[1])/10;return Math.min(90,l[0]+(l[1]-v)/s2);
}
function vo2Level(v,age){var d=v-vo2Ref(age);return d>=8?['Excellente','ok']:d>=3?['Très bonne','ok']:d>=-3?['Dans la moyenne','nt']:d>=-8?['À améliorer','ko']:['Faible','ko']}
function vo2Calc(){
  var age=vo2Age();if(!age||!D){return null}var R=D.week.rhr.filter(function(x){return x!=null&&x>30&&x<120});if(!R.length){return null}
  var s=R.slice().sort(function(a,b){return a-b}),rhr=s[Math.floor(s.length/2)],hm=208-.7*age;return{v:15.3*hm/rhr,rhr:rhr,hm:hm}
}
function vo2FromSheet(r,keep){
  if(!keep){VO2S=null}if(!r||r.length<2){return}var h=r[0],c=colIdx(h,/vo2 ?max avg/);cd=colIdx(h,/^date/);if(c<0){c=colIdx(h,/vo2|v\.o\.2|forme cardio|cardio fitness/)}if(c<0||cd<0){return}
  for(var i=r.length-1;i>0;i--){var v=pn(r[i][c]),k=toKey(r[i][cd]);if(v&&v>15&&v<95&&k){if(!VO2S||k>VO2S.d){VO2S={v:v,d:k}}return}}
}
function vo2Last(s){var L=VO2L.filter(function(x){return x.s===s}).sort(function(a,b){return a.d<b.d?-1:1});return L.length?L[L.length-1]:null}
/* valeur retenue : test récent > montre/bracelet qui écrit dans ta feuille (Fitbit Air) > calcul > valeur notée de la montre */
function vo2Pick(){
  var t=vo2Last('test'),c=vo2Calc(),m=vo2Last('montre');
  if(t&&t.d>=addDays(todayKey(),-90)){return{v:t.v,src:'ton test de marche du '+dl(t.d)}}
  if(VO2S&&VO2S.d>=addDays(todayKey(),-30)){return{v:VO2S.v,src:'ton bracelet (Fitbit)'}}
  if(c){return{v:c.v,src:'le calcul depuis ta FC au repos'}}
  if(m){return{v:m.v,src:'la valeur notée de ta montre'}}
  return null;
}
function vo2Slide(){
  if(!D){return ''}var P=vo2Pick(),age=vo2Age(),c=vo2Calc(),m=vo2Last('montre'),t=vo2Last('test');
  if(!P){return '<div class="g slide tap" onclick="openVo2()"><div class="lab">Cœur & VO2 max ❤️</div><div class="big" style="font-size:26px;margin-top:10px">Ton âge cardio</div><div class="note" style="margin-top:6px;line-height:1.5">'+(age?'Il manque ta fréquence cardiaque au repos pour l’estimer.':'Ajoute ton âge dans ton profil pour calculer ta VO2 max et ton âge cardio.')+'</div><button class="g pill on" style="margin-top:14px;padding:11px 16px">Faire le test de marche</button></div>'}
  var L=age?vo2Level(P.v,age):null,fa=age?fitAge(P.v):null,dif=fa!=null?Math.round(fa)-age:null;
  function r(l,v,on){return '<div class="vxr'+(on?' on':'')+'"><span>'+l+'</span><b>'+v+'</b></div>'}
  return '<div class="g slide tap" onclick="openVo2()"><div class="lab">Cœur & VO2 max ❤️</div>'+
   '<div class="big">'+f(P.v,0)+'<small>ml/kg/min</small></div>'+(L?badge(L[1],L[0]+' pour ton âge'):'')+
   (fa!=null?'<div class="vxa"><span>Âge cardio</span><b class="'+(dif<=0?'tok':dif>=5?'tko':'')+'">'+(fa<20?'moins de 20 ans':Math.round(fa)+' ans')+'</b><em>'+(dif==null?'':dif<0?Math.abs(dif)+' an'+(Math.abs(dif)>1?'s':'')+' de moins que ton âge':dif>0?dif+' an'+(dif>1?'s':'')+' de plus que ton âge':'comme ton âge')+'</em></div>':'')+
   '<div class="vxg">'+r('Calcul',c?f(c.v,0):'—',c&&/calcul/.test(P.src))+r(VO2S?'Bracelet':'Montre',VO2S?f(VO2S.v,0):m?f(m.v,0):'—',/montre|bracelet/.test(P.src))+r('Test',t?f(t.v,0):'—',/test/.test(P.src))+'</div>'+
   '<div class="note" style="margin-top:8px;font-size:11px">Valeur retenue : '+P.src+'</div></div>';
}
function openVo2(){
  var c=vo2Calc(),age=vo2Age(),w=D&&D.weights.length?D.weights[0].v:pn(PROF&&PROF.poids);
  var hist=VO2L.slice().sort(function(a,b){return a.d<b.d?1:-1});
  openSh('<div class="sh-h"><div class="big" style="font-size:28px;margin:0">VO2 max</div><button class="gb" onclick="closeSh()" aria-label="Fermer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'+
   '<div class="note" style="margin:-4px 4px 14px;line-height:1.55">La VO2 max mesure la quantité d’oxygène que ton corps utilise à l’effort. Plus elle est haute, plus ton cœur est en forme. Ton âge cardio, c’est l’âge auquel ta VO2 max correspond en moyenne (référence : étude norvégienne HUNT3).</div>'+
   '<div class="g" style="padding:6px 16px">'+
    '<div class="jlr"><div><b>Calcul</b><div class="note">'+(c?'FC repos '+f(c.rhr)+' bpm · FC max théorique '+f(c.hm)+' bpm':age?'FC au repos manquante':'Âge manquant dans ton profil')+'</div></div><b>'+(c?f(c.v,1):'—')+'</b></div>'+
    '<div class="jlr"><div><b>Montre / bracelet</b><div class="note">'+(VO2S?'Lue dans ta feuille · '+dl(VO2S.d):'Dès que ton Fitbit Air l’écrit dans ta feuille, elle apparaîtra ici')+'</div></div><b>'+(VO2S?f(VO2S.v,1):'—')+'</b></div>'+
   '</div><div class="note" style="margin:8px 6px 0;line-height:1.5">Le calcul et les montres sont des estimations (± 10 à 15 %). Le test ci-dessous est plus fiable : refais-le toutes les 4 à 6 semaines.</div>'+
   '<div class="lab" style="margin:20px 4px 8px;font-size:15px;color:var(--t);font-weight:600">Test de marche (1,6 km)</div>'+
   '<div class="g" style="padding:14px 16px"><div class="note" style="line-height:1.55;margin-bottom:12px">Sur le tapis, inclinaison 1 %, après 5 minutes d’échauffement : marche <b style="color:var(--t)">1,6 km le plus vite possible, sans courir</b>. Note ton temps et ta fréquence cardiaque (montre) juste à l’arrivée.</div>'+
    '<div class="mfg"><label><span>Temps (min)</span><input class="g srch" id="vt_m" type="number" inputmode="numeric" placeholder="14"></label><label><span>Secondes</span><input class="g srch" id="vt_s" type="number" inputmode="numeric" placeholder="30"></label><label><span>FC à l’arrivée</span><input class="g srch" id="vt_h" type="number" inputmode="numeric" placeholder="150"></label></div>'+
    '<div id="vt_r" class="note" style="margin:10px 2px;min-height:16px"></div><button class="g pill on" style="width:100%;padding:13px" onclick="vo2Test()">Calculer et enregistrer</button></div>'+
   '<div class="lab" style="margin:20px 4px 8px;font-size:15px;color:var(--t);font-weight:600">Noter la valeur de ta montre</div>'+
   '<div class="g" style="padding:14px 16px"><div class="mfg"><label><span>VO2 max affichée</span><input class="g srch" id="vm_v" type="number" inputmode="decimal" step="0.1" placeholder="42"></label></div><button class="g pill" style="width:100%;padding:12px;margin-top:10px" onclick="vo2Watch()">Enregistrer</button></div>'+
   (hist.length?'<div class="lab" style="margin:20px 4px 8px">Historique</div><div class="g" style="padding:2px 16px">'+hist.map(function(x){return '<div class="jlr"><div><b>'+f(x.v,1)+'</b><div class="note">'+(x.s==='test'?'Test de marche':'Montre')+' · '+dl(x.d)+(x.t?' · '+x.t:'')+'</div></div><button class="note" onclick="vo2Del(\''+x.id+'\')">Retirer</button></div>'}).join('')+'</div>':''));
  document.body.classList.add('full');
  if(!w){$('#vt_r').innerHTML='<span class="tko">Ajoute ton poids pour le test.</span>'}
}
function vo2Test(){
  var mi=pn($('#vt_m').value)||0,se=pn($('#vt_s').value)||0,hr=pn($('#vt_h').value),age=vo2Age(),w=D&&D.weights.length?D.weights[0].v:pn(PROF&&PROF.poids),T=mi+se/60;
  if(!age||!w){$('#vt_r').innerHTML='<span class="tko">Il faut ton âge et ton poids dans ton profil.</span>';return}
  if(T<8||T>30||!hr||hr<80||hr>220){$('#vt_r').innerHTML='<span class="tko">Vérifie le temps (entre 8 et 30 min) et la fréquence cardiaque.</span>';return}
  /* test de marche de Rockport (Kline et al., 1987) */
  var v=132.853-.0769*w*2.20462-.3877*age+6.315*(vo2Sex()==='m'?1:0)-3.2649*T-.1565*hr;v=Math.round(v*10)/10;
  if(v<10||v>90){$('#vt_r').innerHTML='<span class="tko">Résultat incohérent, vérifie tes valeurs.</span>';return}
  VO2L.push({id:Date.now().toString(36),d:todayKey(),v:v,s:'test',t:mi+' min '+(se<10?'0':'')+Math.round(se)+' · '+hr+' bpm'});vo2Save();
  toast('VO2 max : '+f(v,1)+' ml/kg/min');openVo2();if(D&&TAB==='week'){renderWeek()}
}
function vo2Watch(){var v=pn($('#vm_v').value);if(!v||v<15||v>95){toast('Entre une valeur entre 15 et 95');return}
  VO2L.push({id:Date.now().toString(36),d:todayKey(),v:v,s:'montre'});vo2Save();toast('Valeur de ta montre enregistrée');openVo2();if(D&&TAB==='week'){renderWeek()}}
function vo2Del(id){VO2L=VO2L.filter(function(x){return x.id!==id});vo2Save();openVo2();if(D&&TAB==='week'){renderWeek()}}


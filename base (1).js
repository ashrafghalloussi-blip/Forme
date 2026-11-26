/* Forme · base.js · Bases : outils communs, graphiques, onglets Semaine, Entraînement et Bilans, fenêtres */
var D=null,rep='month',selM=1,fil='Tous',DT={},demoMode=false;
var DJ=['L','M','M','J','V','S','D'];
function $(s){return document.querySelector(s)}
function avg(a){var s=0,n=0;a.forEach(function(x){if(x!=null){s+=x;n++}});return n?s/n:null}
function sum(a){var s=0;a.forEach(function(x){if(x!=null){s+=x}});return s}
function last(a){for(var i=a.length-1;i>=0;i--){if(a[i]!=null){return a[i]}}return null}
var NF={};function f(n,d){if(n==null){return '—'}d=d||0;return (NF[d]||(NF[d]=new Intl.NumberFormat('fr-FR',{minimumFractionDigits:d,maximumFractionDigits:d}))).format(Number(n))}
function u(x,d,s){return x==null?'—':f(x,d)+' '+s}
function nz(x,d,s){return x==null?'—':f(x,d)+'<small>'+s+'</small>'}
function hm(h){if(h==null){return '—'}var m=Math.round(h*60);return Math.floor(m/60)+' h '+('0'+(m%60)).slice(-2)}
function pc(v,t){return v==null?0:Math.max(0,Math.min(100,v/t*100))}
function dl(k){var p=k.split('-'),d=new Date(+p[0],+p[1]-1,+p[2]);return ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'][d.getDay()]+' '+p[2]+'/'+p[1]}
function bars(a,hi,lo,fm,cf){return '<div class="bars">'+a.map(function(v,i){var n=v==null;return '<div class="b'+(n?' n':'')+'"><em>'+(n?'':fm(v))+'</em><div class="col"><i class="'+(!n&&cf?cf(v):'')+'" style="height:'+(n?3:Math.max(3,(v-lo)/(hi-lo)*100))+'%;animation-delay:'+(i*45)+'ms"></i></div><span>'+DJ[i]+'</span></div>'}).join('')+'</div>'}
function spark(a,hi){return '<div class="sp">'+a.map(function(v,i){return '<i style="height:'+(v==null?5:Math.max(10,v/hi*100))+'%;'+(v==null?'opacity:.25;':'')+'animation-delay:'+(i*50)+'ms"></i>'}).join('')+'</div>'}
function rows(a){return a.map(function(r){return '<div class="row"><span>'+r[0]+'</span><span>'+r[1]+'</span></div>'}).join('')}
function mrow(l,v,t,un,d,c){return '<div class="mrow"><div><span>'+l+'</span><span>'+f(v,d)+' / '+f(t,d)+' '+un+'</span></div><div class="tr"><i class="'+(c||'')+'" style="width:'+pc(v,t)+'%"></i></div></div>'}
function ring(v,t,col,lab,txt){var r=34,c=2*Math.PI*r,p=v==null?0:Math.min(1,v/t);return '<div class="rg"><svg viewBox="0 0 84 84"><circle cx="42" cy="42" r="34" fill="none" class="rt"/><circle cx="42" cy="42" r="34" fill="none" class="rf" stroke="'+col+'" stroke-dasharray="'+c+'" stroke-dashoffset="'+c*(1-p)+'" style="--c:'+c+'"/></svg><b>'+txt+'</b><span>'+lab+'</span></div>'}


/* ---------- Graphiques : camemberts, barres empilées, évolution mensuelle ---------- */
function shade(a){return 'rgba(var(--fgr),'+a+')'}
/* couleurs des graphiques : blanc/gris + la couleur d'accent du fond */
var CPAL=[null,shade(.92),shade(.62),'var(--ac)','var(--ac2)',shade(.42),'color-mix(in srgb,var(--ac) 55%,transparent)',shade(.28),'color-mix(in srgb,var(--ac2) 45%,transparent)'];
function donut(seg,big,small){
  var tot=seg.reduce(function(a,s){return a+(s.v||0)},0),R=52,C=2*Math.PI*R,off=0,h='<svg viewBox="0 0 140 140" class="dn"><g transform="rotate(-90 70 70)"><circle cx="70" cy="70" r="52" fill="none" class="rt" stroke-width="15"/>';
  if(tot>0){seg.forEach(function(s,i){var len=(s.v||0)/tot*C;if(len<=0.5){return}var g=seg.filter(function(x){return x.v>0}).length>1?2.4:0;
    h+='<circle cx="70" cy="70" r="52" fill="none" style="stroke:'+s.c+';animation-delay:'+(i*70)+'ms" stroke-width="15" stroke-linecap="butt" stroke-dasharray="'+Math.max(0.1,len-g).toFixed(2)+' '+(C-len+g).toFixed(2)+'" stroke-dashoffset="'+(-off).toFixed(2)+'" class="ds"/>';off+=len})}
  return h+'</g><text x="70" y="70" text-anchor="middle" class="dv">'+big+'</text><text x="70" y="90" text-anchor="middle" class="dl">'+(small||'')+'</text></svg>';
}
function legend(seg,unit,max){
  var tot=seg.reduce(function(a,s){return a+(s.v||0)},0)||1;
  return '<div class="lg">'+seg.slice(0,max||seg.length).map(function(s){return '<div><i style="background:'+s.c+'"></i><span>'+s.l+'</span><b>'+(unit==='%'?f(s.v/tot*100)+' %':f(s.v)+(unit?' '+unit:''))+'</b></div>'}).join('')+'</div>';
}
function stackBars(days,parts){
  var mx=Math.max.apply(null,days.map(function(d){return d?d.t:0}).concat(1))*1.08;
  return '<div class="bars">'+days.map(function(d,i){
    var n=d==null;
    var inner=n?'<i style="height:3%"></i>':parts.map(function(p){var v=Math.max(0,p.get(d));return '<i style="height:'+(v/mx*100)+'%;background:'+p.c+'"></i>'}).join('');
    return '<div class="b'+(n?' n':'')+'"><em>'+(n?'':f(d.t,1))+'</em><div class="col st">'+inner+'</div><span>'+DJ[i]+'</span></div>'}).join('')+'</div>'+
    '<div class="lg row">'+parts.map(function(p){return '<div><i style="background:'+p.c+'"></i><span>'+p.l+'</span></div>'}).join('')+'</div>';
}
function monthChart(ms,key,fmt,cls){
  var d=ms.filter(function(m){return m.n>0&&m[key]!=null});
  if(d.length<2){return '<div class="note" style="margin:10px 0 4px">Le graphique se remplira mois après mois.</div>'+(d.length?'<div class="note">'+d[0].label+' : <b style="color:var(--t)">'+fmt(d[0][key])+'</b></div>':'')}
  var mx=Math.max.apply(null,d.map(function(m){return m[key]})),mn=cls==='line'?Math.min.apply(null,d.map(function(m){return m[key]})):0;
  if(cls==='line'){return lineChart(d.map(function(m){return{l:m.label.slice(0,3),v:m[key]}}),null,'',FG())}
  return '<div class="bars">'+d.map(function(m,i){return '<div class="b"><em>'+fmt(m[key])+'</em><div class="col"><i style="height:'+Math.max(4,m[key]/mx*100)+'%;animation-delay:'+(i*50)+'ms"></i></div><span>'+m.label.slice(0,3)+'</span></div>'}).join('')+'</div>';
}

/* ---------- Petits personnages animés par exercice ---------- */
var EXP={
 bench:{A:{H:[22,50],S:[30,54],P:[62,54],K:[76,46],F:[80,84],E:[31,38],W:[32,22]},B:{E:[23,62],W:[32,44]},
   st:'<rect x="18" y="58" width="52" height="5" rx="2"/><path d="M24 63v21M64 63v21"/>',eq:[['plate','W',8]]},
 chest:{A:{H:[40,20],S:[40,30],P:[40,60],K:[60,60],F:[60,84],E:[30,38],W:[48,34]},B:{E:[56,32],W:[72,32]},
   st:'<rect x="30" y="62" width="28" height="4" rx="2"/><rect x="32" y="20" width="4" height="42" rx="2"/><path d="M44 66v18"/>',eq:[['grip','W']]},
 pull:{A:{H:[42,26],S:[44,36],P:[48,64],K:[68,62],F:[68,84],E:[46,20],W:[48,6]},B:{H:[40,26],S:[42,36],E:[34,46],W:[46,34]},
   st:'<rect x="38" y="66" width="24" height="4" rx="2"/><path d="M50 70v14"/><circle cx="70" cy="56" r="3"/>',eq:[['cable','W',[48,0]],['bar','W']]},
 row:{A:{H:[34,30],S:[36,40],P:[30,68],K:[52,60],F:[72,68],E:[54,46],W:[70,50]},B:{H:[30,30],S:[32,40],E:[20,52],W:[40,52]},
   st:'<rect x="20" y="70" width="28" height="4" rx="2"/><rect x="74" y="56" width="3" height="18" rx="1.5"/>',eq:[['cable','W',[97,58]],['grip','W']]},
 squat:{A:{H:[50,12],S:[50,22],P:[50,50],K:[51,66],F:[50,84],E:[40,28],W:[46,20]},B:{H:[57,34],S:[54,44],P:[36,62],K:[58,64],F:[50,84],E:[44,50],W:[50,42]},
   st:'',eq:[['plate','S',9]]},
 hinge:{A:{H:[50,12],S:[50,22],P:[50,50],K:[51,66],F:[50,84],E:[50,36],W:[50,50]},B:{H:[74,34],S:[66,38],P:[44,52],K:[48,67],F:[50,84],E:[64,56],W:[62,72]},
   st:'',eq:[['plate','W',9]]},
 curl:{A:{H:[46,12],S:[46,22],P:[46,52],K:[47,67],F:[46,84],E:[48,38],W:[50,54]},B:{W:[60,26]},st:'',eq:[['db','W']]},
 tri:{A:{H:[44,14],S:[45,24],P:[47,52],K:[48,67],F:[47,84],E:[49,40],W:[58,28]},B:{W:[56,58]},st:'',eq:[['cable','W',[66,0]],['grip','W']]},
 ohp:{A:{H:[50,22],S:[50,32],P:[50,60],K:[51,72],F:[50,84],E:[40,38],W:[46,28]},B:{E:[46,16],W:[50,4]},st:'',eq:[['plate','W',7]]},
 legext:{A:{H:[38,22],S:[40,32],P:[42,60],K:[62,60],F:[62,84],E:[44,46],W:[50,60]},B:{F:[84,56]},
   st:'<rect x="30" y="62" width="34" height="4" rx="2"/><path d="M36 66v18"/><rect x="28" y="24" width="4" height="38" rx="2"/>',eq:[['pad','F']]},
 legcurl:{A:{H:[38,22],S:[40,32],P:[42,60],K:[62,60],F:[84,58],E:[44,46],W:[50,60]},B:{F:[58,82]},
   st:'<rect x="30" y="62" width="34" height="4" rx="2"/><path d="M36 66v18"/><rect x="28" y="24" width="4" height="38" rx="2"/>',eq:[['pad','F']]},
 calf:{A:{H:[50,14],S:[50,24],P:[50,52],K:[50,68],F:[50,82],E:[48,40],W:[48,54]},B:{H:[50,8],S:[50,18],P:[50,46],K:[50,62],F:[51,79],E:[48,34],W:[48,48]},
   st:'<rect x="38" y="82" width="26" height="4" rx="2"/>',eq:[]},
 run:{A:{H:[52,12],S:[50,22],P:[48,48],K:[62,58],F:[56,78],K2:[40,64],F2:[30,74],E:[60,34],W:[66,26],E2:[40,32],W2:[36,42]},
   B:{K:[40,64],F:[30,74],K2:[62,58],F2:[56,78],E:[40,32],W:[36,42],E2:[60,34],W2:[66,26]},smooth:1,dur:1,
   st:'<path d="M14 86h72"/>',eq:[]},
 crunch:{A:{H:[22,74],S:[30,76],P:[58,78],K:[70,62],F:[82,80],E:[26,66],W:[22,72]},B:{H:[36,56],S:[40,62],E:[40,52],W:[34,56]},
   st:'<rect x="12" y="82" width="78" height="3" rx="1.5"/>',eq:[]}
};
function exKind(n,g){
  n=(n||'').toLowerCase();g=(g||'').toLowerCase();
  if(/crunch|abdo|gainage|planche|relev[ée] de jambes|russian/.test(n)){return 'crunch'}
  if(/(^|[\s(\/-])(tapis|course|running|run|v[ée]lo|elliptique|rameur|cardio|marche|stepper)([\s)\/-]|$)/.test(n)||/cardio/.test(g)){return 'run'}
  if(/mollet|calf/.test(n)){return 'calf'}
  if(/leg curl|ischio|curl allong|curl assis|curl jambe/.test(n)){return 'legcurl'}
  if(/leg extension|extension (des )?jambes|extension quadri|leg ext/.test(n)){return 'legext'}
  if(/soulev|deadlift|rdl|good morning|hip thrust|roumain/.test(n)){return 'hinge'}
  if(/squat|fente|presse|hack|goblet|leg press/.test(n)){return 'squat'}
  if(/militaire|[ée]paule|shoulder|overhead|arnold|[ée]l[ée]vation/.test(n)){return 'ohp'}
  if(/tirage (poitrine|vertical|nuque)|pulldown|lat pull|traction|pull.?up|chin.?up/.test(n)){return 'pull'}
  if(/rowing|row\b|tirage (horizontal|assis|bas)|tirage/.test(n)){return 'row'}
  if(/triceps|pushdown|barre au front|dips|kickback|skull/.test(n)){return 'tri'}
  if(/curl|biceps|marteau|hammer/.test(n)){return 'curl'}
  if(/chest press|press.*machine|pec deck|butterfly|[ée]cart/.test(n)){return 'chest'}
  if(/couch[ée]|bench|d[ée]velopp[ée]|pompe|push.?up/.test(n)){return 'bench'}
  if(/pec/.test(g)){return 'bench'}if(/dos/.test(g)){return 'row'}if(/[ée]paul/.test(g)){return 'ohp'}if(/biceps/.test(g)){return 'curl'}
  if(/triceps/.test(g)){return 'tri'}if(/quadri|cuisse|jambe|fessier/.test(g)){return 'squat'}if(/ischio/.test(g)){return 'hinge'}
  if(/mollet/.test(g)){return 'calf'}if(/abdo/.test(g)){return 'crunch'}
  return 'curl';
}
function exSvg(name,group,size,cls){
  var d=EXP[exKind(name,group)],A=d.A,B={},k,dur=(d.dur||2.6)+'s';
  for(k in A){B[k]=d.B[k]||A[k]}
  var kt=d.smooth?'0;.5;1':'0;.42;.58;1',sp=d.smooth?'.45 0 .55 1;.45 0 .55 1':'.45 0 .55 1;0 0 1 1;.45 0 .55 1';
  function av(at,a,b){if(a===b){return ''}return '<animate attributeName="'+at+'" values="'+(d.smooth?a+';'+b+';'+a:a+';'+b+';'+b+';'+a)+'" keyTimes="'+kt+'" calcMode="spline" keySplines="'+sp+'" dur="'+dur+'" repeatCount="indefinite"/>'}
  function ln(a,b,c){if(!A[a]||!A[b]){return ''}return '<line class="'+(c||'')+'" x1="'+A[a][0]+'" y1="'+A[a][1]+'" x2="'+A[b][0]+'" y2="'+A[b][1]+'">'+av('x1',A[a][0],B[a][0])+av('y1',A[a][1],B[a][1])+av('x2',A[b][0],B[b][0])+av('y2',A[b][1],B[b][1])+'</line>'}
  function at(j,tag,extra){return '<'+tag+' cx="'+A[j][0]+'" cy="'+A[j][1]+'" '+extra+'>'+av('cx',A[j][0],B[j][0])+av('cy',A[j][1],B[j][1])+'</'+tag+'>'}
  var eq='',back='';
  (d.eq||[]).forEach(function(e){
    if(e[0]==='plate'){eq+=at(e[1],'circle','r="'+e[2]+'" class="pl"')}
    else if(e[0]==='db'){eq+=at(e[1],'circle','r="4.5" class="pl"')}
    else if(e[0]==='grip'||e[0]==='bar'){eq+=at(e[1],'circle','r="2.6" class="gp"')}
    else if(e[0]==='pad'){eq+=at(e[1],'circle','r="4" class="pl"')}
    else if(e[0]==='cable'){var j=e[1];back+='<line class="cb" x1="'+A[j][0]+'" y1="'+A[j][1]+'" x2="'+e[2][0]+'" y2="'+e[2][1]+'">'+av('x1',A[j][0],B[j][0])+av('y1',A[j][1],B[j][1])+'</line>'}
  });
  var body=ln('P','K2','b2')+ln('K2','F2','b2')+ln('S','E2','b2')+ln('E2','W2','b2')+ln('S','P')+ln('P','K')+ln('K','F')+ln('S','E')+ln('E','W')+at('H','circle','r="6" class="hd"');
  return '<svg class="exa '+(cls||'')+'" viewBox="0 0 100 90" style="width:'+size+'px;height:'+size+'px" aria-hidden="true"><path class="gr" d="M8 86h84"/><g class="eqs">'+(d.st||'')+'</g>'+back+'<g class="bd">'+body+'</g>'+eq+'</svg>';
}

/* ---------- Outils couleurs : vert = atteint / en progrès, ambre = à surveiller ---------- */
var OK='#7FCFA3',KO='#E8906F',GID=0,SDraw={};
function badge(c,t){return '<span class="bd '+(c||'nt')+'"><i></i>'+t+'</span>'}
function goal(v,t){return v==null?'':v>=t?'ok':v<t*.8?'ko':''}
function FG(){return document.body.classList.contains('light')?'#16171B':'#FFFFFF'}
function ringCol(c){return c==='ok'?OK:c==='ko'?KO:FG()}
function pn(x){if(typeof x==='number'){return x}var v=parseFloat(String(x).replace(/[\s  ]/g,'').replace(',','.'));return isFinite(v)?v:null}
function toKey(x){x=String(x);var m=x.match(/^(\d{4}-\d{2}-\d{2})/);if(m){return m[1]}m=x.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);return m?m[3]+'-'+('0'+m[2]).slice(-2)+'-'+('0'+m[1]).slice(-2):''}
function fdate(t){return new Date(t).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}

/* Tendance linéaire sur les pesées (kg par jour) */
function trend(ws){
  var pts=ws.slice().reverse().map(function(x){return[Date.parse(x.d)/864e5,x.v]});
  if(pts.length<3){return null}
  var n=pts.length,mx=0,my=0,a=0,b=0;
  pts.forEach(function(p){mx+=p[0];my+=p[1]});mx/=n;my/=n;
  pts.forEach(function(p){a+=(p[0]-mx)*(p[1]-my);b+=(p[0]-mx)*(p[0]-mx)});
  if(!b){return null}
  var sl=a/b;return{slope:sl,lastDay:pts[n-1][0],fit:my+sl*(pts[n-1][0]-mx)};
}

/* Courbe premium en SVG */
function lineChart(pts,target,unit,col){
  if(pts.length<2){return '<div class="note" style="margin:8px 0">La courbe apparaîtra dès le 2ᵉ point.</div>'}
  var W=320,H=160,P=16,id='lg'+(GID++),vs=pts.map(function(p){return p.v});if(target!=null){vs.push(target)}
  var mn=Math.min.apply(null,vs),mxv=Math.max.apply(null,vs),pad=(mxv-mn)*.18||1;mn-=pad;mxv+=pad;col=col||FG();
  function X(i){return P+i*(W-2*P)/(pts.length-1)}function Y(v){return H-P-(v-mn)/(mxv-mn)*(H-2*P)}
  var d=pts.map(function(p,i){return(i?'L':'M')+X(i).toFixed(1)+' '+Y(p.v).toFixed(1)}).join(' ');
  var h='<svg class="ln" viewBox="0 0 '+W+' '+(H+22)+'"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+col+'" stop-opacity=".28"/><stop offset="1" stop-color="'+col+'" stop-opacity="0"/></linearGradient></defs>';
  h+='<path d="'+d+' L'+X(pts.length-1).toFixed(1)+' '+(H-P)+' L'+X(0).toFixed(1)+' '+(H-P)+' Z" fill="url(#'+id+')" stroke="none"/>';
  if(target!=null){var ty=Y(target).toFixed(1);h+='<line x1="'+P+'" x2="'+(W-P)+'" y1="'+ty+'" y2="'+ty+'" stroke="'+OK+'" stroke-width="1.2" stroke-dasharray="4 5" opacity=".8"/><text x="'+(W-P)+'" y="'+(ty-6)+'" fill="'+OK+'" font-size="10.5" text-anchor="end">objectif '+f(target,1)+' '+unit+'</text>'}
  h+='<path class="dr" d="'+d+'" fill="none" stroke="'+col+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>';
  pts.forEach(function(p,i){var lst=i===pts.length-1;h+='<circle cx="'+X(i).toFixed(1)+'" cy="'+Y(p.v).toFixed(1)+'" r="'+(lst?4.5:2.6)+'" style="fill:'+(lst?col:'var(--bg)')+'" stroke="'+col+'" stroke-width="1.6"/>'});
  h+='<text x="'+P+'" y="'+(H+16)+'" class="ax" font-size="10.5">'+pts[0].l+'</text><text x="'+(W-P)+'" y="'+(H+16)+'" class="ax" font-size="10.5" text-anchor="end">'+pts[pts.length-1].l+'</text>';
  return h+'</svg>';
}

/* Score de forme du jour : sommeil de la dernière nuit + FC repos vs ta base */
/* la nuit affichée pour un jour = celle qui se termine ce matin-là */
function nightName(k){var p=k.split('-'),d=new Date(+p[0],+p[1]-1,+p[2]),j=['dim.','lun.','mar.','mer.','jeu.','ven.','sam.'];return 'Nuit de '+j[(d.getDay()+6)%7]+' à '+j[d.getDay()]}
function lastNight(){var w=D&&D.week;if(!w||!w.keys){return 'Dernière nuit'}for(var i=w.sleep.length-1;i>=0;i--){if(w.sleep[i]!=null){return nightName(w.keys[i])}}return 'Dernière nuit'}
function formScore(){
  var w=D.week,ls=last(w.sleep),lr=last(w.rhr),base=(D.reports.yearAgg&&D.reports.yearAgg.rhr)||avg(w.rhr),sc=[],ss=null,rs=null;
  if(ls!=null&&ls<=12){ss=ls>=8?100:ls>=7?85+(ls-7)*15:Math.max(0,85-(7-ls)*25);sc.push(ss)}
  if(lr!=null&&base){var dd=lr-base;rs=dd<=-2?100:dd<=0?90+(-dd)*5:Math.max(0,90-dd*12);sc.push(rs)}
  var v=sc.length?Math.round(avg(sc)):null;
  return{v:v,ls:ls,lr:lr,base:base,ss:ss,rs:rs,c:v==null?'nt':v>=80?'ok':v>=60?'nt':'ko',t:v==null?'Pas assez de données':v>=80?'Prêt à pousser':v>=60?'Séance normale':'Lève le pied'};
}

/* Alertes intelligentes */
function alerts(){
  var w=D.week,t=D.targets,a=[],sl=avg(w.sleep),so=avg(w.sodium),pr=avg(w.prot),wa=avg(w.water),tr=trend(D.weights);
  if(w.sleep.some(function(x){return x!=null&&x>12})){a.push(['ko','Une nuit dépasse 12 h : import en double probable, vérifie l’onglet Sleep.'])}
  if(sl!=null&&sl<t.sleep){a.push(['ko','Sommeil moyen '+hm(sl)+', sous ton minimum de '+f(t.sleep)+' h.'])}
  if(so!=null&&so>t.sodium){a.push(['ko','Sodium '+f(so)+' mg/jour, au-dessus du plafond de '+f(t.sodium)+' mg.'])}
  if(pr!=null&&pr<t.prot*.9){a.push(['ko','Protéines '+f(pr)+' g/jour, sous ta cible de '+f(t.prot)+' g.'])}
  if(wa!=null&&wa<t.water*.75){a.push(['ko','Hydratation '+f(wa,1)+' L/jour, loin des '+f(t.water,1)+' L.'])}
  var z=w.muscles.filter(function(m){return m.s===0}).map(function(m){return m.n});
  if(z.length){a.push(['ko',z.join(', ')+' : aucune série cette semaine.'])}
  if(tr&&tr.slope<-0.01){a.push(['ok','Poids en baisse : '+f(tr.slope*7,1)+' kg par semaine.'])}
  if(pr!=null&&pr>=t.prot){a.push(['ok','Protéines au-dessus de ta cible ('+f(pr)+' g/jour).'])}
  if(so!=null&&so<=t.sodium){a.push(['ok','Sodium sous le plafond ('+f(so)+' mg/jour).'])}
  if(sl!=null&&sl>=t.sleep&&sl<=12){a.push(['ok','Sommeil moyen au-dessus de '+f(t.sleep)+' h.'])}
  return a;
}

function renderWeek(){
  var w=D.week,t=D.targets,zero=w.muscles.filter(function(m){return m.s===0}),mx=Math.max.apply(null,w.muscles.map(function(m){return m.s}).concat(1));
  var sl=avg(w.sleep),dp=avg(w.deep),rm=avg(w.rem),rh=avg(w.rhr),st=sum(w.stim),tn=sum(w.tonnage);
  var lw=D.weights.length?D.weights[0].v:null,gap=lw==null?null:lw-t.weight,tr=trend(D.weights);
  var kc=avg(w.kcal),pr=avg(w.prot),so=avg(w.sodium),wa=avg(w.water),hv=avg(w.vfc),sp=avg(w.spo2);
  var soc=(so!=null&&so>t.sodium)?'w':so!=null?'g':'',prc=goal(pr,t.prot),wac=goal(wa,t.water);
  var SLP=[{l:'Profond',c:FG(),v:dp||0},{l:'REM',c:'var(--ac)',v:rm||0},{l:'Léger',c:shade(.28),v:sl==null?0:Math.max(0,sl-(dp||0)-(rm||0))}];
  var cb=avg(w.carbs||(WX&&WX.carbs)||[]),ft=avg(w.fat||(WX&&WX.fat)||[]),MAC=pr==null?[]:cb!=null&&ft!=null?[{l:'Protéines',c:OK,v:pr*4},{l:'Glucides',c:FG(),v:cb*4},{l:'Lipides',c:'var(--ac)',v:ft*9}]:kc?[{l:'Protéines',c:OK,v:pr*4},{l:'Glucides + lipides',c:shade(.35),v:Math.max(0,kc-pr*4)}]:[];
  var MUS=w.muscles.filter(function(m){return m.s>0}).sort(function(a,b){return b.s-a.s}).map(function(m,i){return{l:m.n,v:m.s,c:i===0?OK:CPAL[(i%8)+1]}});
  var S=formScore(),AL=alerts(),ko=AL.filter(function(x){return x[0]==='ko'}),okk=AL.filter(function(x){return x[0]==='ok'});
  var slc=function(v){return v<t.sleep?'ko':''};

  /* poids : courbe + rythme + date estimée */
  var wasc=D.weights.slice().reverse(),eta='—',rate='—',wcls='';
  if(tr){rate=(tr.slope>0?'+':'')+f(tr.slope*7,2)+' kg / semaine';wcls=tr.slope<0?'ok':tr.slope>0.02?'ko':''}
  if(tr&&gap!=null&&gap>0&&tr.slope<-0.005){eta=fdate((tr.lastDay+(tr.fit-t.weight)/(-tr.slope))*864e5)}
  else if(gap!=null&&gap<=0){eta='Objectif atteint'}

  DT={
    form:['Forme du jour',S.v==null?'—':S.v+'<small>/ 100</small>',S.t,
      '<div style="margin-bottom:10px">'+badge(S.c,S.t)+'</div>'+rows([[lastNight(),hm(S.ls)+(S.ss!=null?' · '+Math.round(S.ss)+' pts':'')],['FC repos du jour',u(S.lr,0,'bpm')+(S.rs!=null?' · '+Math.round(S.rs)+' pts':'')],['Ta FC repos de référence',u(S.base,0,'bpm')]])+
      '<div class="note" style="margin-top:14px;line-height:1.5">Le score combine ta dernière nuit (8 h et plus = 100) et ta FC repos du jour comparée à ta moyenne : plus elle est basse, mieux tu as récupéré. C’est un repère pour doser ta séance, pas un avis médical.</div>'],
    sleep:['Sommeil 😴',hm(sl),'moyenne par nuit · minimum conseillé '+f(t.sleep)+' h',
      stackBars(w.sleep.map(function(v,i){return v==null?null:{t:v,d:w.deep[i]||0,r:w.rem[i]||0}}),[{l:'Profond',c:FG(),get:function(d){return d.d}},{l:'REM',c:'var(--ac)',get:function(d){return d.r}},{l:'Léger',c:shade(.28),get:function(d){return d.t-d.d-d.r}}])+
      '<div class="dw" style="margin:18px 0 8px">'+donut(SLP,sl==null?'—':f(sl,1)+' h','par nuit')+legend(SLP,'%')+'</div>'+rows([['Sommeil profond (moy.)',hm(dp)],['Sommeil REM (moy.)',hm(rm)],['Sommeil léger (moy.)',hm(sl==null?null:sl-dp-rm)]])+'<div class="note" style="margin-top:14px;line-height:1.5">Chaque jour montre la nuit qui s’est terminée ce matin-là : jeudi = nuit de mercredi à jeudi.</div>'],
    rhr:['FC repos',f(rh),'bpm · moyenne de la semaine',bars(w.rhr,70,40,function(v){return f(v)},function(v){return S.base&&v>S.base+3?'ko':''})+rows([['Dernière mesure',u(last(w.rhr),0,'bpm')],['Référence',u(S.base,0,'bpm')]])],
    sets:['Séries stimulantes',f(st),'séries à RIR ≤ 2',bars(w.stim,24,0,function(v){return f(v)})+'<div class="lab" style="margin:14px 0 4px">Tonnage (kg)</div>'+bars(w.tonnage,14000,0,function(v){return f(v/1000,1)+'k'})+rows([['Tonnage total',f(tn)+' kg']])],
    weight:['Poids',f(lw,1)+'<small>kg</small>','dernière pesée · objectif '+f(t.weight,1)+' kg',
      lineChart(wasc.map(function(x){return{l:dl(x.d),v:x.v}}),t.weight,'kg',FG())+
      rows([['Écart à l’objectif',gap==null?'—':'<span class="'+(gap>0?'tko':'tok')+'">'+(gap>0?'+':'')+f(gap,1)+' kg</span>'],['Rythme actuel','<span class="'+(wcls?'t'+wcls:'')+'">'+rate+'</span>'],['Objectif estimé',eta]])+
      '<div class="note" style="margin-top:12px">Estimation en ligne droite sur tes dernières pesées : elle s’affine à chaque nouvelle pesée.</div>'],
    nutri:['Nutrition 🍽️',f(kc),'kcal · moyenne par jour renseigné',(MAC.length?'<div class="dw" style="margin:4px 0 16px">'+donut(MAC,f(kc),'kcal / jour')+legend(MAC,'%')+'</div>':'')+bars(w.kcal,3500,0,function(v){return f(v/1000,1)+'k'})+mrow('Protéines',pr,t.prot,'g',0,prc==='ok'?'g':prc==='ko'?'w':'')+mrow('Sodium',so,t.sodium,'mg',0,soc)+mrow('Hydratation',wa,t.water,'L',1,wac==='ok'?'g':wac==='ko'?'w':'')],
    muscles:['Groupes musculaires 💪',String(zero.length),zero.length?'groupe(s) sans série cette semaine':'tous les groupes travaillés',(MUS.length?'<div class="dw" style="margin:0 0 14px">'+donut(MUS,f(st),'séries')+legend(MUS,'',6)+'</div>':'')+w.muscles.map(function(m){return mrow(m.n,m.s,mx,'séries',0,m.s===0?'w':'')}).join('')]
  };
  var k=w.keys;
  WEEKSUB='Semaine du '+k[0].slice(8)+'/'+k[0].slice(5,7)+' au '+k[6].slice(8)+'/'+k[6].slice(5,7)+(demoMode?' · démo':'');

  /* anneau du score */
  var R=50,C=2*Math.PI*R,pv=S.v==null?0:S.v/100,hc=ringCol(S.c),hid='hg'+(GID++);
  var hero='<div class="g tap hero-c" onclick="openW(\'form\')" style="margin-top:6px"><div class="lab">Forme du jour ⚡</div><div class="hero"><div class="hr"><svg viewBox="0 0 120 120"><defs><linearGradient id="'+hid+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+hc+'"/><stop offset="1" stop-color="'+hc+'" stop-opacity=".45"/></linearGradient></defs><circle cx="60" cy="60" r="'+R+'" fill="none" class="rt"/><circle cx="60" cy="60" r="'+R+'" fill="none" class="rf" stroke="url(#'+hid+')" stroke-linecap="round" stroke-dasharray="'+C+'" stroke-dashoffset="'+C*(1-pv)+'" style="--c:'+C+'"/></svg><b>'+(S.v==null?'—':S.v)+'</b></div>'+
    '<div style="min-width:0">'+badge(S.c,S.t)+'<div class="note" style="margin-top:10px;line-height:1.5">'+lastNight()+' · '+hm(S.ls)+'<br>FC repos '+u(S.lr,0,'bpm')+(S.base?' · réf. '+f(S.base)+' bpm':'')+'</div></div></div></div>';

  var alh=ko.slice(0,3).concat(okk.slice(0,ko.length?1:2));
  var al=alh.length?'<div class="g" style="margin-top:12px;padding:12px 18px"><div class="lab" style="margin-bottom:2px">'+(ko.length?'👀 '+ko.length+' point'+(ko.length>1?'s':'')+' à surveiller':'✨ Tout est dans les clous')+'</div>'+alh.map(function(x){return '<div class="al '+(x[0]==='ok'?'tok':'tko')+'"><i></i><span style="color:var(--t)">'+x[1]+'</span></div>'}).join('')+'</div>':'';

  /* ---------- piles thématiques ---------- */
  var X7=WX||{},stp=X7.steps||w.steps||[null,null,null,null,null,null,null],sa=avg(stp),stt=sum(stp),stg=t.steps||10000;
  DT.steps=['Pas 👟',f(sa),'pas par jour en moyenne · repère '+f(stg),bars(stp,Math.max(stg*1.2,Math.max.apply(null,stp.map(function(v){return v||0}))),0,function(v){return f(v/1000,1)+'k'},function(v){return v<stg*.6?'ko':v>=stg?'ok':''})+rows([['Total de la semaine',f(stt)+' pas'],['Jours au-dessus de '+f(stg),stp.filter(function(v){return v!=null&&v>=stg}).length+' / '+stp.filter(function(v){return v!=null}).length]])];
  function stack(id,title,sub,slides){return '<div class="sth"><h2>'+title+'</h2>'+(sub?'<span class="note">'+sub+'</span>':'')+'</div><div class="car" id="'+id+'">'+slides.join('')+'</div><div class="dots">'+slides.map(function(){return '<i></i>'}).join('')+'</div>'}
  var heroS=hero.replace('class="g tap hero-c"','class="g tap slide"').replace(' style="margin-top:6px"','');
  var alS=al?al.replace('<div class="g" style="margin-top:12px;padding:12px 18px">','<div class="g slide" style="padding:16px 18px">'):'<div class="g slide"><div class="lab">✨ Tout est dans les clous</div><div class="note" style="margin-top:8px">Rien à signaler cette semaine.</div></div>';
  var hvS='<div class="g slide"><div class="lab">Variabilité & oxygène</div><div class="duo"><div><span>VFC</span><b class="'+(hv==null?'empty':'')+'">'+nz(hv,0,'ms')+'</b><em>'+(hv==null?'Non mesurée':'moyenne hebdo')+'</em></div><div><span>SpO₂</span><b class="'+(sp==null?'empty':'')+'">'+nz(sp,1,'%')+'</b><em>'+(sp==null?'Non mesurée':'moyenne hebdo')+'</em></div></div><div class="note" style="margin-top:12px;line-height:1.45">'+(hv==null?'La VFC arrivera avec un capteur qui l’exporte (Fitbit Air par exemple) : c’est le meilleur indicateur de récupération.':'Plus ta VFC est haute par rapport à ta moyenne, mieux tu as récupéré.')+'</div></div>';
  var rhS='<div class="g slide tap" onclick="openW(\'rhr\')"><div class="lab">FC repos ❤️</div><div class="big">'+nz(rh,0,'bpm')+'</div><div class="note">moyenne de la semaine'+(S.base?' · réf. '+f(S.base)+' bpm':'')+'</div>'+spark((w.rhr||[]).map(function(v){return v==null?null:v-35}),40)+'</div>';
  var stS='<div class="g slide tap" onclick="openW(\'steps\')"><div class="lab">Pas 👟</div><div class="big">'+nz(sa,0,'/ jour')+'</div><div class="note">'+f(stt)+' pas cette semaine</div>'+spark(stp,Math.max(stg,1))+'<div style="margin-top:14px">'+badge(sa==null?'nt':sa>=stg?'ok':sa<stg*.6?'ko':'nt',sa==null?'Pas de données':sa>=stg?'Objectif '+f(stg)+' atteint':'Repère : '+f(stg)+' pas')+'</div></div>';
  var muS='<div class="g slide tap" onclick="openW(\'muscles\')"><div class="lab">Répartition des séries 🍩</div>'+(MUS.length?'<div class="dw">'+donut(MUS,f(st),'séries')+legend(MUS,'%',5)+'</div>':'<div class="val">0<small>série cette semaine</small></div>')+'<div class="note" style="margin-top:10px">'+(w.muscles.length-zero.length)+' / '+w.muscles.length+' groupes travaillés</div>'+(zero.length?'<div class="chips">'+zero.slice(0,4).map(function(z){return '<span class="chip">'+z.n+' · 0</span>'}).join('')+'</div>':'')+'</div>';
  var maS='<div class="g slide tap" onclick="openW(\'nutri\')"><div class="lab">Ton assiette moyenne 🍽️</div>'+(MAC.length?'<div class="dw">'+donut(MAC,f(kc),'kcal / jour')+legend(MAC,'%')+'</div><div class="macg">'+[['Protéines',pr,OK],['Glucides',cb,FG()],['Lipides',ft,'var(--ac)']].map(function(m){return '<div><i style="background:'+m[2]+'"></i><span>'+m[0]+'</span><b>'+(m[1]==null?'—':f(m[1])+' g')+'</b></div>'}).join('')+'</div>'+(MAC.length===2?'<div class="note" style="margin-top:8px">Glucides et lipides introuvables dans ta feuille.</div>':''):'<div class="note" style="margin-top:8px">Pas encore de données nutrition cette semaine.</div>')+'</div>';
  var kcS='<div class="g slide tap" onclick="openW(\'nutri\')"><div class="lab">Calories par jour 🔥</div><div class="big">'+nz(kc,0,'kcal')+'</div><div class="note">cible '+f(t.kcal)+' kcal</div>'+bars(w.kcal,Math.max(3500,t.kcal*1.3),0,function(v){return f(v/1000,1)+'k'},function(v){return v>t.kcal*1.1?'ko':''})+'</div>';
  var wS='<div class="g slide tap" onclick="openW(\'weight\')"><div class="sth" style="margin:0"><div class="lab">Poids ⚖️</div><button class="g pill wqb" onclick="event.stopPropagation();openWeigh()">＋ Me peser</button></div><div class="big">'+nz(lw,1,'kg')+'</div><div class="note '+(gap==null?'':gap>0?'tko':'tok')+'">'+(gap==null?'—':(gap>0?'+':'')+f(gap,1)+' kg vs objectif '+f(t.weight,1))+(tr?' · '+(tr.slope<0?'↘ ':'↗ ')+f(Math.abs(tr.slope*7),1)+' kg/sem':'')+'</div>'+(wasc.length>1?lineChart(wasc.slice(-8).map(function(x){return{l:dl(x.d),v:x.v}}),t.weight,'kg',FG()):'')+'</div>';

  $('#v-week').innerHTML='<div class="dwslot">'+dvWidget()+'</div>'+
   stack('c0','Aujourd’hui','',[heroS,alS,'<div class="g slide" id="tip"></div>',coachSlide()])+
   stack('c1','Récupération 😴','',[
     '<div class="g slide tap" onclick="openW(\'sleep\')"><div class="lab">Sommeil</div><div class="big">'+hm(sl)+'</div><div class="note">Profond '+hm(dp)+' · REM '+hm(rm)+'</div>'+spark(w.sleep,12)+'<div style="margin-top:14px">'+badge(sl==null?'nt':sl>=t.sleep&&sl<=12?'ok':'ko',sl==null?'Pas de données':sl>12?'Valeur à vérifier':sl>=t.sleep?'Au-dessus de '+f(t.sleep)+' h':'Sous '+f(t.sleep)+' h')+'</div></div>',rhS,hvS,vo2Slide()].filter(Boolean))+
   stack('c2','Activité 🏃','',[stS,
     '<div class="g slide tap" onclick="openW(\'sets\')"><div class="lab">Entraînement 🏋️</div><div class="big">'+f(st)+'<small>séries RIR ≤ 2</small></div><div class="note">Tonnage '+f(tn)+' kg</div>'+spark(w.stim,24)+'</div>',muS])+
   stack('c3','Nutrition 🍽️','moyenne par jour',[
     '<div class="g slide tap" onclick="openW(\'nutri\')"><div class="lab">Tes cibles</div><div class="big">'+nz(kc,0,'kcal')+'</div><div class="rings">'+ring(pr,t.prot,ringCol(prc),'Protéines',f(pr))+ring(so,t.sodium,so==null?FG():so>t.sodium?KO:OK,'Sodium',f(so))+ring(wa,t.water,ringCol(wac),'Eau (L)',f(wa,1))+'</div></div>',maS,kcS])+
   stack('c4','Progrès 📈','',['<div class="g slide" id="insA"><div class="note">Calcul…</div></div>','<div class="g slide" id="insB"><div class="note">Calcul…</div></div>','<div class="g slide" id="insC"><div class="note">Calcul…</div></div>'])+
   stack('c5','Corps ⚖️','',[parcoursSlide(),secheSlide(),wS,'<div class="g slide tap" id="phc" onclick="goTab(\'moi\')"></div>'].filter(Boolean));
  ['c0','c1','c2','c3','c4','c5'].forEach(function(id){car($('#'+id))});
  renderIns();renderPhotosCard();renderTip();renderCoach();if(!live()){demoBanner()}
}


var FTAB='ses';try{FTAB=localStorage.getItem('forme_ftab')||'ses'}catch(e){}
function setFTab(t){FTAB=t;try{localStorage.setItem('forme_ftab',t)}catch(e){}renderForce();if(navigator.vibrate){navigator.vibrate(6)}}
function renderForce(){
  var F=D.force,gs=['Tous'];
  F.list.forEach(function(x){var g=x.g.replace(' (Réf.)','');if(gs.indexOf(g)<0){gs.push(g)}});
  var gc=F.global==null?'nt':F.global>=100?'ok':F.global<85?'ko':'nt';
  var LV={},LVC={'Débutant':LVCOL[0],'Novice':LVCOL[1],'Intermédiaire':LVCOL[2],'Avancé':LVCOL[3],'Élite':LVCOL[4],'À tester':shade(.15)},LI=[];F.list.forEach(function(x){var q=liftLevel(x);x.L=q;var k=q?q.name:'À tester';if(q){LI.push(q.i)}LV[k]=(LV[k]||0)+1});
  var GL=LI.length?LVN[Math.floor(avg(LI)+.0001)]:null;
  var LVS=['Élite','Avancé','Intermédiaire','Novice','Débutant','À tester'].filter(function(k){return LV[k]}).map(function(k){return{l:k,v:LV[k],c:LVC[k]}});
  var pend=sePending().length;
  var h='<button class="g tap newses" onclick="openSeance()"><span class="ic">＋</span><span style="flex:1;min-width:0"><b>Nouvelle séance</b><span class="note" style="margin:0">'+(pend?pend+' séance'+(pend>1?'s':'')+' en attente d’envoi':'Note tes exercices, Forme calcule le reste')+'</span></span><svg viewBox="0 0 24 24" style="width:18px;height:18px;color:var(--m)"><path d="M9 6l6 6-6 6"/></svg></button>'+
   '<div class="g seg fseg"><u style="transform:translateX('+['ses','ex','niv'].indexOf(FTAB)*100+'%)"></u>'+[['ses','Séances'],['ex','Exercices'],['niv','Niveaux']].map(function(t){return '<button class="'+(FTAB===t[0]?'on':'')+'" onclick="setFTab(\''+t[0]+'\')">'+t[1]+'</button>'}).join('')+'</div>';
  var hN='<div class="g"><div class="lab">Indice global de force 🏋️</div><div class="big">'+nz(F.global,1,'%')+'</div><div class="note" style="margin-bottom:12px">du standard pratiquant naturel (~2 ans)'+(GL?' · niveau global <b style="color:var(--t)">'+GL+'</b>':'')+'</div>'+badge(gc,F.global==null?'À mesurer':F.global>=100?'Au-dessus du standard':F.global<85?'En dessous du standard':'Proche du standard')+'</div>'+
   (LVS.length?'<div class="g" style="margin-top:12px"><div class="lab">Tes niveaux par exercice 🎯</div><div class="note" style="margin:2px 0 4px">De Débutant à Élite, selon ta charge et ton poids de corps</div><div class="dw">'+donut(LVS,String(F.list.length),'exercices')+legend(LVS,'')+'</div></div>':'');
  if(FTAB==='niv'){$('#v-force').innerHTML=h+hN;return}
  if(FTAB==='ses'){$('#v-force').innerHTML=h+'<div id="fhs"><div class="skl"><i></i><i></i></div></div>';sesNeed(function(){var el=$('#fhs');if(el){el.innerHTML=histHtml(sesAll()||[],1)}});return}
  h+='<div class="note" style="margin:-2px 4px 10px">Touche un exercice pour voir ta progression.</div><div class="pills">'+gs.map(function(g){return '<button class="pill'+(g===fil?' on':'')+'" onclick="setFil(this.textContent)">'+g+'</button>'}).join('')+'</div>';
  var n=0;h+='<div class="exl">';
  F.list.forEach(function(x,idx){
    if(fil!=='Tous'&&x.g.replace(' (Réf.)','')!==fil){return}
    var l=x.last,d='style="animation-delay:'+(n++*40)+'ms" onclick="openLift('+idx+')"';
    if(x.rm==null){h+='<div class="g li tap" '+d+'><div class="lift"><div class="exi">'+exSvg(x.n,x.g,52)+'</div><div style="flex:1;min-width:0"><b>'+x.n+'</b><div class="note">'+x.g+'</div></div><div class="note" style="text-align:right">À tester<br>standard '+f(x.std)+' kg</div></div></div>';return}
    var Q=x.L,c=Q?(Q.i>=3?'g':Q.i<=1?'w':''):'';
    h+='<div class="g li tap" '+d+'><div class="lift"><div class="exi">'+exSvg(x.n,x.g,52)+'</div><div style="flex:1;min-width:0"><b>'+x.n+'</b><div class="note">'+((l&&l.load!=null)?f(l.load,1)+' kg × '+f(l.reps)+' · RIR '+f(l.rir,1):x.g)+'</div></div><div><div class="rm">'+f(x.rm,1)+'<small> kg</small></div><div class="note" style="text-align:right">1RM estimé</div></div></div>'+(Q?'<div class="lvr">'+lvlChip(Q)+'<span class="note" style="margin:0">'+(Q.next?'encore <b style="color:var(--t)">'+f(Q.need,Q.need<10?1:0)+' kg</b> pour '+Q.next:'Niveau maximum 👑')+'</span></div>'+xpBar(Q.frac,1,LVCOL[Q.i])+'<div class="xpl" style="margin:0"><span>'+f(x.rm,1)+' kg</span><span>'+(Q.next?f(Q.th[Q.i],1)+' kg · '+Q.next:'max')+'</span></div>':'<div class="tr"><i style="width:'+Math.min(100,x.pct)+'%"></i></div><div class="note">'+f(x.pct)+' % du standard</div>')+'</div>';
  });
  h+='</div>';
  $('#v-force').innerHTML=h;
}

/* Progression d'un exercice : lue dans l'onglet Musculation */
function getRaw(name,cb){
  if(SDraw[name]){cb(SDraw[name]);return}
  function ok(d){SDraw[name]=d.values;cb(d.values)}
  if(live()){call('sheet',name).then(ok).catch(function(e){cb(null,e)})}else{ok({values:demoSheet(name)})}
}
function liftHist(v,name){
  var hd=(v[0]||[]).map(function(c){return String(c).toLowerCase()});
  function ci(re){for(var i=0;i<hd.length;i++){if(re.test(hd[i])){return i}}return -1}
  var cD=ci(/^date/),cE=ci(/exercice/),cC=ci(/charge/),cR=ci(/r[ée]p[ée]tition|reps/),cI=ci(/^rir/),by={},nm=name.toLowerCase().trim();
  if(cD<0||cE<0||cC<0||cR<0){return[]}
  v.slice(1).forEach(function(r){
    if(String(r[cE]).toLowerCase().trim()!==nm){return}
    var L=pn(r[cC]),R=pn(r[cR]),d=toKey(r[cD]);if(!L||!R||!d){return}
    var e=L*(1+R/30);if(!by[d]||e>by[d].e){by[d]={e:e,L:L,R:R,rir:cI>=0?pn(r[cI]):null}}
  });
  return Object.keys(by).sort().map(function(d){return{d:d,v:by[d].e,L:by[d].L,R:by[d].R,rir:by[d].rir}});
}
function openLift(i){
  var x=D.force.list[i],nm=(SL&&SL.filter(function(s){return /muscu/i.test(s.name)})[0]||{name:'Musculation'}).name;
  openSh('<div class="sh-h" style="align-items:flex-start"><div style="min-width:0"><div class="lab" style="font-size:15px">'+esc(x.g)+'</div><div class="big" style="font-size:26px;margin:2px 0 0;white-space:normal">'+esc(x.n)+'</div></div><button class="gb" style="flex:0 0 auto" onclick="closeSh()" aria-label="Fermer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div class="exh">'+exSvg(x.n,x.g,170)+'</div>'+lvLadder(x)+'<div id="lfb"><div class="note" style="margin-top:12px">Chargement de l’historique…</div></div>');
  getRaw(nm,function(v,err){
    var b=$('#lfb');if(!b){return}
    if(!v){b.innerHTML='<div class="g" style="margin-top:12px">Impossible de lire l’onglet Musculation.<div class="note">'+esc(err&&err.message||'')+'</div></div>';return}
    var hs=liftHist(v,x.n);
    if(!hs.length){b.innerHTML='<div class="g" style="margin-top:12px">Aucune série trouvée pour cet exercice dans l’onglet Musculation.<div class="note">Le nom doit être écrit pareil dans les deux onglets.</div></div>';return}
    var best=hs.reduce(function(m,h){return h.v>m.v?h:m},hs[0]),lh=hs[hs.length-1],fh=hs[0],dv=lh.v-fh.v,dc=dv>0.05?'tok':dv<-0.05?'tko':'';
    b.innerHTML='<div class="big" style="margin:14px 0 0">'+f(lh.v,1)+'<small>kg · 1RM estimé</small></div>'+
      '<div style="margin:10px 0 6px">'+badge(dv>0.05?'ok':dv<-0.05?'ko':'nt',hs.length<2?'1ʳᵉ séance enregistrée':(dv>=0?'+':'')+f(dv,1)+' kg depuis le '+dl(fh.d))+'</div>'+
      lineChart(hs.map(function(h){return{l:dl(h.d),v:h.v}}),x.std,'kg',dv<-0.05?KO:dv>0.05?OK:FG())+
      rows([['Record','<span class="tok">'+f(best.v,1)+' kg</span> · '+dl(best.d)],['Dernière séance',f(lh.L,lh.L%1?1:0)+' kg × '+f(lh.R,lh.R%1?1:0)+(lh.rir!=null?' · RIR '+f(lh.rir,1):'')],['Progression','<span class="'+dc+'">'+(dv>=0?'+':'')+f(dv,1)+' kg ('+(dv>=0?'+':'')+f(dv/fh.v*100,1)+' %)</span>'],['Standard ~2 ans',u(x.std,0,'kg')]])+
      '<div class="note" style="margin-top:12px">1RM estimé avec la formule d’Epley (charge × (1 + reps / 30)), meilleure série de chaque séance.</div>';
  });
}

function setFil(g){fil=g;renderForce()}

function renderBilan(){
  var R=D.reports,t=D.targets,a=rep==='month'?R.months[selM-1]:R.yearAgg;
  var h='<div class="g seg'+(rep==='year'?' y':'')+'" style="padding:3px"><u></u><button class="'+(rep==='month'?'on':'')+'" onclick="setRep(\'month\')">Mois</button><button class="'+(rep==='year'?'on':'')+'" onclick="setRep(\'year\')">Année '+R.year+'</button></div>';
  if(rep==='month'){h+='<div class="pills">'+R.months.filter(function(m){return m.n>0}).map(function(m){return '<button class="pill'+(m.m===selM?' on':'')+'" onclick="setM('+m.m+')">'+m.label+'</button>'}).join('')+'</div>'}
  if(a.n===0){$('#v-bilan').innerHTML=h+'<div class="g">Aucune donnée pour cette période.</div>';return}
  var nm=R.months.filter(function(m){return m.n>0}).length;
  h+='<h2 style="margin-top:12px">Évolution 📈</h2><div class="g">'+(nm<2?'<div class="note" style="line-height:1.5">Tes courbes mois par mois apparaîtront dès le 2ᵉ mois de données : tonnage, poids moyen et nombre de séances.</div>':
     '<div class="lab">Tonnage par mois</div>'+monthChart(R.months,'tonnage',function(v){return f(v/1000,0)+' t'})+
     '<div class="lab" style="margin-top:16px">Poids moyen par mois</div>'+monthChart(R.months,'weight',function(v){return f(v,1)},'line')+
     '<div class="lab" style="margin-top:16px">Séances par mois</div>'+monthChart(R.months,'sessions',function(v){return f(v)}))+'</div>';
  var mi=[['Fibres','fibres','g',0],['Potassium','potassium','mg',0],['Magnésium','magnesium','mg',0],['Fer','iron','mg',1],['Zinc','zinc','mg',1]];
  h+='<h2>Moyennes</h2><div class="g" style="padding:4px 18px">'+rows([['Sommeil',hm(a.sleep)],['FC repos',u(a.rhr,0,'bpm')],['Poids moyen',u(a.weight,1,'kg')],['Dernier poids',u(a.weightLast,1,'kg')],['Calories',u(a.kcal,0,'kcal')],['Protéines',u(a.prot,0,'g')],['Sodium',u(a.sodium,0,'mg')],['Hydratation',u(a.water,1,'L')],['Pas par jour',f(a.steps)]])+'</div>'+
   '<h2>Cumuls</h2><div class="grid" style="margin-top:0"><div class="g"><div class="lab">Séances</div><div class="val">'+f(a.sessions)+'</div></div><div class="g"><div class="lab">Séries stimulantes</div><div class="val">'+f(a.stim)+'</div></div><div class="g full"><div class="lab">Tonnage</div><div class="val">'+f(a.tonnage)+'<small>kg</small></div></div></div>'+
   '<h2>Micronutriments · moyenne par jour</h2><div class="g" style="padding-top:4px">'+mi.map(function(x){var v=a[x[1]];return mrow(x[0],v,t[x[1]],x[2],x[3],v==null?'':v>=t[x[1]]?'g':v<t[x[1]]*.7?'w':'')}).join('')+'</div>';
  $('#v-bilan').innerHTML=h;
}
function setRep(r){rep=r;renderBilan()}
function setM(m){selM=m;renderBilan()}

function car(el){
  var dots=el.nextElementSibling?el.nextElementSibling.children:[],geo=null,raf=0,li=-1;
  function measure(){geo={w:el.clientWidth,c:[].map.call(el.children,function(x){return x.offsetLeft+x.offsetWidth/2})}}
  function s(){raf=0;if(!el.isConnected){return}if(!geo||geo.w!==el.clientWidth){measure()}var w=geo.w||1,c=el.scrollLeft+w/2,idx=0,best=1e9;
    var ds=geo.c.map(function(x,i){var d=Math.abs(x-c)/w;if(d<best){best=d;idx=i}return d});
    [].forEach.call(el.children,function(x,i){var d=ds[i]||0;x.style.transform='scale('+(1-Math.min(.08,d*.14)).toFixed(3)+')';x.style.opacity=(1-Math.min(.5,d*.7)).toFixed(3)});
    if(idx!==li){li=idx;[].forEach.call(dots,function(d,i){d.classList.toggle('on',i===idx)})}}
  el.addEventListener('scroll',function(){if(!raf){raf=requestAnimationFrame(s)}},{passive:true});
  raf=requestAnimationFrame(s);
}

function openSh(h){var s=$('#sh');s.innerHTML='<div class="grab" onclick="document.body.classList.toggle(\'full\')"></div>'+h;s.scrollTop=0;document.body.classList.remove('full');document.body.classList.add('open')}
function closeSh(){document.body.classList.remove('open','full');setTimeout(function(){if(window.g3Wake){g3Wake()}},450)}
$('#sh').addEventListener('scroll',function(){if(this.scrollTop>4){document.body.classList.add('full')}},{passive:true});
$('#sh').addEventListener('wheel',function(e){if(e.deltaY>0){document.body.classList.add('full')}},{passive:true});
function openW(id){var d=DT[id];openSh('<div class="sh-h"><div class="lab" style="font-size:15px">'+d[0]+'</div><button class="gb" onclick="closeSh()" aria-label="Fermer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div class="big" style="margin-bottom:2px">'+d[1]+'</div><div class="note" style="margin:0 0 18px">'+d[2]+'</div>'+d[3])}
(function(){var sh=$('#sh'),sy=0,dy=0,dr=false;
  sh.addEventListener('touchstart',function(e){if(sh.scrollTop<=0){sy=e.touches[0].clientY;dr=true;dy=0}},{passive:true});
  function full(){return document.body.classList.contains('full')}
  sh.addEventListener('touchmove',function(e){if(!dr){return}dy=e.touches[0].clientY-sy;
    if(dy<-12&&!full()){document.body.classList.add('full');dr=false;sh.style.transition='';sh.style.transform='';return}
    if(dy>0){var base=full()?0:sh.offsetHeight*.46;sh.style.transition='none';sh.style.transform='translate(-50%,'+(base+dy)+'px)'}},{passive:true});
  sh.addEventListener('touchend',function(){if(!dr){return}dr=false;sh.style.transition='';sh.style.transform='';
    if(dy>110){if(full()&&dy<sh.offsetHeight*.45){document.body.classList.remove('full')}else{closeSh()}}dy=0});
})();


/* Forme · mascotte.js · Mascotte : animaux, tenues, page dédiée, notifications */
/* =====================================================================
   Mascotte v2 : chat, chien ou petit requin, tenues et chapeaux à débloquer,
   petites animations, page dédiée (caresses, jeu, friandise), notifications
   ===================================================================== */
var PET={on:true,mood:'idle',busy:false,msgI:0,t:0};
try{var _po=localStorage.getItem('forme_pet');PET.on=_po===null?true:_po==='1'}catch(e){}
var PS={an:'cat',name:{},suit:'',hat:'',joy:70,joyT:Date.now(),notif:false,trD:'',trN:0};
try{Object.assign(PS,JSON.parse(localStorage.getItem('forme_pet2')||'{}'))}catch(e){}
function psSave(){try{localStorage.setItem('forme_pet2',JSON.stringify(PS))}catch(e){}}
var PETN=0;

/* ---------- les trois animaux ---------- */
var ANIM={
 cat:{n:'Chat',e:'🐱',def:'Mochi',me:'un chat',toy:'pelote',treat:'🐟',
  pet:['Rrrrrr… 😻','Rrrr… encore un peu…','Là, juste derrière l’oreille… 😽'],belly:['Hihi, ça chatouille ! 😹','Pas le ventre ! … bon, d’accord 😼'],
  play:['Ma pelote ! 🧶','Je l’ai ! Je l’ai ! 🐾'],eat:['Miam, du poisson ! 😋','Merci ! Tu es le meilleur 🐟'],
  back:'<g class="pears"><path class="pfur" d="M26 41l4-22 15 12z"/><path class="pfur" d="M75 31l15-12 3 22z"/><path class="pear" d="M31 26l2 9 7-4zM85 26l-2 9-7-4z"/></g>',
  tail:'<path class="ptl" d="M88 86c16 0 22-10 18-22" fill="none" stroke-width="7" stroke-linecap="round"/>',
  paws:'<ellipse class="pfur" cx="46" cy="94" rx="7.5" ry="4.5"/><ellipse class="pfur" cx="68" cy="95" rx="7.5" ry="4.5"/>',
  nose:'<path class="pnose" d="M55 55h6l-3 3z"/>',
  mouth:'<path d="M52 60q6 5 6 0q0 5 6 0" fill="none" stroke-width="2" stroke-linecap="round"/>',
  extra:'<g class="pwh"><path d="M30 55l-14-2M30 59l-13 3M86 55l14-2M86 59l13 3" stroke-width="1.4" stroke-linecap="round"/></g>',
  toysvg:'<g class="tb"><circle cx="14" cy="90" r="8" fill="#D9576B"/><path d="M8 85q6 3 12-1M7 91q7 3 14-2M10 96q5-6 9-12" fill="none" stroke="#A73A4D" stroke-width="1.2"/></g><path class="tstr" d="M21 93q12 7 22 3" fill="none" stroke="#D9576B" stroke-width="1.4" stroke-linecap="round"/>'},
 dog:{n:'Chien',e:'🐶',def:'Biscuit',me:'un chien',toy:'balle',treat:'🦴',
  pet:['Encore ! Encore ! 🐶','Tu es mon humain préféré 🥰','*remue la queue très fort*'],belly:['Le ventre ! Mon point faible 🤭','Hihi ! Ça chatouille ! 🐾'],
  play:['La balle ! Lance-la encore ! 🎾','Je la rapporte ! 🐕'],eat:['Un os ! Merci ! 🦴','Miam miam ! 😋'],
  back:'',
  tail:'<path class="ptl" d="M88 84q14-3 16-17" fill="none" stroke-width="7" stroke-linecap="round"/>',
  paws:'<ellipse class="pfur" cx="46" cy="94" rx="7.5" ry="4.5"/><ellipse class="pfur" cx="68" cy="95" rx="7.5" ry="4.5"/>',
  belly:'<ellipse class="pp3" cx="62" cy="88" rx="16" ry="7"/>',
  detail:'<ellipse class="pp2" cx="73" cy="41" rx="9" ry="8" opacity=".5"/><ellipse class="pp3" cx="58" cy="58" rx="13" ry="9"/>',
  nose:'<ellipse class="pnose" cx="58" cy="53.5" rx="4.6" ry="3.4"/>',
  mouth:'<path d="M52 59q6 5 6 0q0 5 6 0" fill="none" stroke-width="2" stroke-linecap="round"/>',
  extra:'<path class="ptongue" d="M55 61h6v4a3 3 0 0 1-6 0z"/>',
  front:'<g class="pears"><path class="pp2 pearl" d="M30 28C18 28 12 44 16 60C18 68 26 68 29 60C32 50 34 38 34 30Z"/><path class="pp2 pearr" d="M86 28C98 28 104 44 100 60C98 68 90 68 87 60C84 50 82 38 82 30Z"/></g>',
  toysvg:'<g class="tb"><circle cx="14" cy="91" r="7" fill="#C6DE4E"/><path d="M8 88q6 4 12 0M8 95q6-4 12 0" fill="none" stroke="#F4F7E6" stroke-width="1.3"/></g>'},
 shark:{n:'Requin',e:'🦈',def:'Bubulle',me:'un requin',toy:'bulles',treat:'🦐',
  pet:['Blub… j’adore 🫧','Personne ne caresse les requins… merci 🥹','Blub blub ! 💙'],belly:['Hé ! Ça chatouille les nageoires 😆','Hihi ! Blub ! 🫧'],
  play:['Des bulles ! 🫧','Regarde, je fais des ronds ! 🌊'],eat:['Une crevette ! Merci ! 🦐','Miam, croustillant 😋'],
  back:'<g class="pears pfin"><path class="pfur" d="M48 27Q58 2 74-2Q66 12 68 27Z"/></g>',
  tail:'<path class="pfur" d="M86 84L108 69Q103 84 108 99Z"/>',
  paws:'<path class="pfur" d="M42 88L30 99L52 96Z"/><path class="pfur" d="M70 91L64 101L82 98Z"/>',
  belly:'<ellipse class="pp2" cx="62" cy="88" rx="22" ry="8.5"/>',
  detail:'<ellipse class="pp2" cx="58" cy="61" rx="25" ry="11.5"/><g class="pgill"><path d="M84 42q3 4 0 8M88 41q3 5 0 10" fill="none" stroke-width="1.6" stroke-linecap="round"/></g>',
  nose:'<circle class="pnose" cx="54" cy="53" r="1.1"/><circle class="pnose" cx="62" cy="53" r="1.1"/>',
  mouth:'<path d="M47 58q11 9 22 0" fill="none" stroke-width="2" stroke-linecap="round"/><path class="pteeth" d="M50.5 59.8l1.4 2.8 1.6-2zM56.5 61.4l1.5 2.8 1.5-2.8zM62.5 61l1.6 2 1.4-2.8z"/>',
  extra:'',
  toysvg:'<g class="tbu"><circle cx="14" cy="84" r="4.2"/><circle cx="22" cy="74" r="3"/><circle cx="10" cy="66" r="2.4"/><circle cx="19" cy="58" r="1.8"/></g>'}
};

/* ---------- garde-robe ---------- */
function star(x,y,r){var p='';for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;p+=(i?'L':'M')+(x+rr*Math.cos(a)).toFixed(1)+' '+(y+rr*Math.sin(a)).toFixed(1)}return '<path d="'+p+'Z"/>'}
var HOOD='M24 50C22 16 94 16 92 50C84 36 32 36 24 50Z';
var SUITS=[
 {id:'pyj',n:'Pyjama étoilé',e:'🌙',u:{free:1},
  body:'<rect x="28" y="58" width="70" height="42" fill="#2E3A6B"/><g fill="#F2D27A">'+star(42,84,3)+star(56,93,2.4)+star(76,82,3)+star(84,92,2.2)+star(48,76,2)+'</g><path d="M64 78a5 5 0 1 0 5 6a4 4 0 0 1-5-6z" fill="#F2D27A"/>'},
 {id:'sport',n:'Sportif',e:'🏃',u:{tr:'r1'},
  body:'<rect x="28" y="58" width="70" height="42" fill="#D94A3D"/><path d="M34 70v30M90 70v30" stroke="#fff" stroke-width="3"/><text x="62" y="93" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" font-family="system-ui,sans-serif">10</text>'},
 {id:'croco',n:'Crocodile',e:'🐊',hood:1,u:{lvl:3},
  back:'<path d="M84 66l9-5-2 9zM89 74l10-2-5 8z" fill="#4C7840"/>',
  body:'<rect x="28" y="58" width="70" height="42" fill="#5E8C4E"/><ellipse cx="62" cy="91" rx="18" ry="9" fill="#B9CF83"/><path d="M46 88h32M46 93h32" stroke="#93AD62" stroke-width="1.2"/>',
  head:'<path d="'+HOOD+'" fill="#5E8C4E"/><circle cx="42" cy="22" r="7" fill="#5E8C4E"/><circle cx="74" cy="22" r="7" fill="#5E8C4E"/><circle cx="42" cy="21" r="4" fill="#F4F1C9"/><circle cx="74" cy="21" r="4" fill="#F4F1C9"/><rect x="41" y="18" width="2" height="6" rx="1" fill="#1a1a1a"/><rect x="73" y="18" width="2" height="6" rx="1" fill="#1a1a1a"/><path d="M31 43l2.4 4 2.4-5zM39 40l2.4 4 2.4-4.4zM47 38.6l2.4 4 2.4-4zM56 38.2l2.4 4 2.4-4zM65 38.6l2.4 4 2.4-4zM73 40l2.4 4 2.4-4.4zM80.5 42.5l2.4 4 2.4-5z" fill="#fff"/>'},
 {id:'bee',n:'Abeille',e:'🐝',u:{tr:'c1'},
  back:'<g class="pwing"><ellipse cx="80" cy="60" rx="9" ry="14" transform="rotate(35 80 60)" fill="rgba(225,240,255,.6)" stroke="rgba(255,255,255,.85)" stroke-width="1"/><ellipse cx="70" cy="57" rx="7" ry="12" transform="rotate(15 70 57)" fill="rgba(225,240,255,.5)" stroke="rgba(255,255,255,.8)" stroke-width="1"/></g>',
  body:'<rect x="28" y="58" width="70" height="42" fill="#F2C230"/><rect x="28" y="78" width="70" height="5" fill="#1F1F1F"/><rect x="28" y="88" width="70" height="5" fill="#1F1F1F"/>',
  head:'<path d="M46 26Q40 12 34 7M70 26Q76 12 82 7" fill="none" stroke="#1F1F1F" stroke-width="2.4" stroke-linecap="round"/><circle cx="34" cy="7" r="3.4" fill="#1F1F1F"/><circle cx="82" cy="7" r="3.4" fill="#1F1F1F"/>'},
 {id:'tech',n:'Techno',e:'🤖',u:{tr:'v1'},
  body:'<rect x="28" y="58" width="70" height="42" fill="#1E2229"/><path d="M38 82h12l4-4h8M70 90h14l3-3M42 93h10l3 3" fill="none" stroke="#5EE6F0" stroke-width="1.3"/><circle class="pglow" cx="62" cy="86" r="4" fill="#5EE6F0"/>',
  head:'<path d="M26 44C24 10 92 10 90 44" fill="none" stroke="#2A2F38" stroke-width="5"/><rect x="18" y="37" width="11" height="19" rx="4.5" fill="#2A2F38"/><rect x="87" y="37" width="11" height="19" rx="4.5" fill="#2A2F38"/><rect class="pglow" x="20.5" y="42" width="2.2" height="9" rx="1.1" fill="#5EE6F0"/><rect class="pglow" x="93.3" y="42" width="2.2" height="9" rx="1.1" fill="#5EE6F0"/>'},
 {id:'ninja',n:'Ninja',e:'🥷',u:{tr:'r2'},
  body:'<rect x="28" y="58" width="70" height="42" fill="#1B1C20"/><rect x="28" y="84" width="70" height="5" fill="#B8322F"/>',
  head:'<path d="M25 37Q58 27 91 37L91 43Q58 33 25 43Z" fill="#1B1C20"/><rect x="51" y="29.5" width="14" height="7" rx="1.6" fill="#AEB5BE"/><path d="M90 39q12-4 20 2M90 41q10 4 14 12" fill="none" stroke="#1B1C20" stroke-width="3.4" stroke-linecap="round"/>'},
 {id:'pirate',n:'Pirate',e:'🏴‍☠️',u:{n:8},
  body:'<rect x="28" y="58" width="70" height="42" fill="#F4F4F4"/><rect x="28" y="76" width="70" height="4" fill="#22305A"/><rect x="28" y="84" width="70" height="4" fill="#22305A"/><rect x="28" y="92" width="70" height="4" fill="#22305A"/>',
  face:'<path d="M26 36Q48 40 64 44M78 49L91 54" fill="none" stroke="#111" stroke-width="1.8"/><ellipse cx="71" cy="47" rx="7.5" ry="6.6" fill="#111"/>'},
 {id:'astro',n:'Astronaute',e:'🚀',nohat:1,u:{lvl:6},
  body:'<rect x="28" y="58" width="70" height="42" fill="#EDEFF3"/><rect x="52" y="80" width="20" height="10" rx="2" fill="#C9CED6"/><circle cx="57" cy="85" r="1.8" fill="#E05A4B"/><circle cx="62" cy="85" r="1.8" fill="#4B8BE0"/><circle cx="67" cy="85" r="1.8" fill="#F2C230"/>',
  face:'<ellipse cx="58" cy="80" rx="27" ry="5" fill="#D5DAE2"/><circle cx="58" cy="45" r="40" fill="rgba(180,220,255,.1)" stroke="rgba(220,236,255,.6)" stroke-width="2.5"/><path d="M29 31Q37 13 56 9" fill="none" stroke="rgba(255,255,255,.65)" stroke-width="3" stroke-linecap="round"/>'},
 {id:'hero',n:'Super-héros',e:'🦸',u:{tr:'r6'},
  back:'<path class="pcape" d="M38 66Q18 92 26 101L96 101Q104 92 86 66Z" fill="#C23B3B"/>',
  body:'<rect x="28" y="58" width="70" height="42" fill="#2D4FB8"/><circle cx="62" cy="86" r="6" fill="#F2C230"/><path d="M63.5 81l-4.5 6h3l-2 5 5.5-7h-3z" fill="#2D4FB8"/><rect x="28" y="93" width="70" height="3" fill="#F2C230"/>',
  head:'<path d="M30 43Q44 35 58 42Q72 35 86 43Q87 52 76 53Q66 54 58 48Q50 54 40 53Q29 52 30 43Z" fill="#1F2E66"/><ellipse cx="45" cy="47" rx="6" ry="6.5" fill="#fff"/><ellipse cx="71" cy="47" rx="6" ry="6.5" fill="#fff"/>'},
 {id:'uni',n:'Licorne',e:'🦄',hood:1,u:{n:20},
  body:'<rect x="28" y="58" width="70" height="42" fill="#CDB8EE"/><path d="M50 92a12 12 0 0 1 24 0" fill="none" stroke="#F4A6C8" stroke-width="2.4"/><path d="M53.5 92a8.5 8.5 0 0 1 17 0" fill="none" stroke="#F2D27A" stroke-width="2.4"/><path d="M57 92a5 5 0 0 1 10 0" fill="none" stroke="#9EC9F2" stroke-width="2.4"/>',
  head:'<path d="M34 28l-3-13 11 7zM82 28l3-13-11 7z" fill="#CDB8EE"/><path d="'+HOOD+'" fill="#CDB8EE"/><path d="M64 18q20-4 26 18q-6-5-12-4q6 6 4 16q-8-10-18-14z" fill="#F4A6C8"/><path d="M62 17q10-8 20-4q-8 2-10 8z" fill="#9EC9F2"/><path d="M53 22L58-4L63 22Z" fill="#F2D27A"/><path d="M54.6 15l7-3M55.6 8.5l5-2M56.4 2.5l3-1.2" stroke="#D9AE45" stroke-width="1.2"/>'}
];
var HATS=[
 {id:'beanie',n:'Bonnet à pompon',e:'🧶',u:{free:1},svg:'<path d="M32 32C33 4 83 4 84 32Z" fill="#C8574B"/><path d="M30 26Q58 20 86 26L86 34Q58 28 30 34Z" fill="#A8443A"/><path d="M38 25v7M46 23.5v7M54 23v7M62 23v7M70 23.5v7M78 25v7" stroke="#8E3830" stroke-width="1"/><circle cx="58" cy="4" r="7" fill="#F2E9E1"/>'},
 {id:'cap',n:'Casquette',e:'🧢',u:{free:1},svg:'<path d="M33 30C35 10 81 10 83 30Z" fill="#2E5FD8"/><path d="M70 26Q92 22 100 32Q86 34 72 31Z" fill="#244BB0"/><path d="M58 13V30" stroke="#244BB0" stroke-width="1.2"/><circle cx="58" cy="13" r="2.5" fill="#244BB0"/>'},
 {id:'party',n:'Chapeau de fête',e:'🥳',u:{free:1},svg:'<g transform="rotate(-14 58 26)"><path d="M45 28L58-10L71 28Q58 32 45 28Z" fill="#7C5CE0"/><circle cx="54" cy="18" r="2" fill="#F2D27A"/><circle cx="62" cy="9" r="2" fill="#F2D27A"/><circle cx="62" cy="22" r="2" fill="#F27AA8"/><circle cx="56" cy="4" r="1.6" fill="#F27AA8"/><circle cx="58" cy="-10" r="4.5" fill="#F27AA8"/></g>'},
 {id:'bob',n:'Bob',e:'👒',u:{tr:'p1'},svg:'<path d="M36 28C37 10 79 10 80 28Z" fill="#D8C690"/><path d="M24 30Q58 20 92 30Q96 36 88 36Q58 28 28 36Q20 36 24 30Z" fill="#C8B479"/><path d="M38 24Q58 19 78 24" fill="none" stroke="#B49E62" stroke-width="1" stroke-dasharray="2 2"/>'},
 {id:'band',n:'Bandeau éponge',e:'🎾',u:{tr:'n1'},svg:'<path d="M26 36Q58 26 90 36L90 44Q58 34 26 44Z" fill="#F4F4F4"/><path d="M26 39Q58 29 90 39L90 41Q58 31 26 41Z" fill="#D9453B"/>'},
 {id:'cowboy',n:'Cowboy',e:'🤠',u:{lvl:4},svg:'<path d="M38 25C37 2 50 8 58 10C66 8 79 2 78 25Z" fill="#A06B40"/><path d="M38 20Q58 24 78 20L78 25Q58 29 38 25Z" fill="#5B3A21"/><path d="M14 26Q20 34 58 32Q96 34 102 26Q96 22 86 26Q58 30 30 26Q20 22 14 26Z" fill="#8A5A35"/>'},
 {id:'viking',n:'Viking',e:'⚔️',u:{tr:'s3'},svg:'<path d="M34 24Q16 22 14 2Q24 14 38 16Z" fill="#EFE4CC"/><path d="M82 24Q100 22 102 2Q92 14 78 16Z" fill="#EFE4CC"/><path d="M32 32C33 6 83 6 84 32Z" fill="#9AA3AD"/><path d="M31 27Q58 22 85 27L85 33Q58 28 31 33Z" fill="#6F7782"/><path d="M58 7V27" stroke="#6F7782" stroke-width="3"/><circle cx="40" cy="29" r="1.3" fill="#C9CED6"/><circle cx="50" cy="27.6" r="1.3" fill="#C9CED6"/><circle cx="66" cy="27.6" r="1.3" fill="#C9CED6"/><circle cx="76" cy="29" r="1.3" fill="#C9CED6"/>'},
 {id:'halo',n:'Auréole',e:'😇',u:{tr:'c2'},svg:'<g class="phalo"><ellipse cx="58" cy="6" rx="19" ry="5" fill="none" stroke="#F5D77A" stroke-width="7" opacity=".25"/><ellipse cx="58" cy="6" rx="19" ry="5" fill="none" stroke="#F5D77A" stroke-width="3.2"/></g>'},
 {id:'top',n:'Haut-de-forme',e:'🎩',u:{lvl:8},svg:'<path d="M44 26L45-6L71-6L72 26Z" fill="#26262C"/><rect x="44.6" y="16" width="26.8" height="6" fill="#8E2C3A"/><ellipse cx="58" cy="-6" rx="13" ry="2.5" fill="#34343B"/><ellipse cx="58" cy="27" rx="24" ry="4.5" fill="#1D1D22"/>'},
 {id:'crown',n:'Couronne',e:'👑',u:{plat:1},svg:'<path d="M37 27L39 7L48 17L58 3L68 17L77 7L79 27Z" fill="#E9BC4C" stroke="#C8962A" stroke-width="1"/><circle cx="39" cy="7" r="2" fill="#F5D77A"/><circle cx="58" cy="3" r="2.2" fill="#F5D77A"/><circle cx="77" cy="7" r="2" fill="#F5D77A"/><circle cx="58" cy="20" r="2.7" fill="#D2435B"/><circle cx="47" cy="22" r="2" fill="#4B8BE0"/><circle cx="69" cy="22" r="2" fill="#4BB07E"/>'}
];
function byId(L,id){for(var i=0;i<L.length;i++){if(L[i].id===id){return L[i]}}return null}

/* ---------- déblocages (niveau, trophée précis, nombre de trophées, platine) ---------- */
function petLvl(){try{return TRL.length?trXP().lvl:1}catch(e){return 1}}
function trDone(id){return TRL.some(function(t){return t.id===id&&t.done})}
function trCount(){return TRL.filter(function(t){return t.done}).length}
function unlocked(it){var u=it.u;if(u.free){return true}if(u.lvl){return petLvl()>=u.lvl}if(u.tr){return trDone(u.tr)}if(u.n){return trCount()>=u.n}if(u.plat){return TRL.some(function(t){return t.tier==='p'&&t.done})}return false}
function unlockTxt(it){var u=it.u;if(u.free){return 'Offert'}if(u.lvl){return 'Niveau '+u.lvl}
  if(u.tr){var t=byId(TRL,u.tr);return 'Trophée « '+(t?t.name:u.tr)+' »'}if(u.n){return u.n+' trophées'}if(u.plat){return 'Un trophée platine'}return ''}
function unlockHow(it){var u=it.u;if(u.lvl){return 'Atteins le niveau '+u.lvl+' (tu es niveau '+petLvl()+')'}
  if(u.tr){var t=byId(TRL,u.tr);return t?'Décroche « '+t.name+' » : '+t.desc.charAt(0).toLowerCase()+t.desc.slice(1):'Décroche le trophée'}
  if(u.n){return 'Décroche '+u.n+' trophées (tu en as '+trCount()+')'}if(u.plat){return 'Décroche n’importe quel trophée platine'}return ''}
function petUnKey(){return 'forme_petun_'+(typeof live==='function'&&live()?'live':'demo')}
function petCheckUnlocks(){
  if(!TRL.length){return}var k=petUnKey(),seen=null;try{seen=JSON.parse(localStorage.getItem(k)||'null')}catch(e){}
  var all=SUITS.concat(HATS).filter(unlocked).map(function(x){return x.id});
  if(seen){var nw=all.filter(function(id){return seen.indexOf(id)<0});
    if(nw.length&&PET.on){var it=byId(SUITS,nw[0])||byId(HATS,nw[0]);setTimeout(function(){toast('Nouveau pour '+petName()+' : '+it.n+' '+it.e);petCheer('Une nouvelle tenue ? Viens me la mettre ! '+it.e)},TRQ&&TRQ.length?6000:1200)}}
  try{localStorage.setItem(k,JSON.stringify(all))}catch(e){}
  if(PS.suit&&!unlocked(byId(SUITS,PS.suit)||{u:{}})){PS.suit='';psSave()}
  if(PS.hat&&!unlocked(byId(HATS,PS.hat)||{u:{}})){PS.hat='';psSave()}
}

/* ---------- dessin ---------- */
function petName(){var n=PS.name&&PS.name[PS.an];return n&&n.trim()?n.trim():ANIM[PS.an].def}
function petSvg(o){
  o=o||{};var an=o.an||PS.an,A=ANIM[an],su=byId(SUITS,o.suit!=null?o.suit:PS.suit),ha=byId(HATS,o.hat!=null?o.hat:PS.hat),id='pc'+(PETN++);
  if(su&&su.nohat){ha=null}
  var cls='petsvg an-'+an+(su?' sx-'+su.id+(su.hood?' hood':''):'')+(ha?' hashat':'')+(o.cls?' '+o.cls:'');
  return '<svg viewBox="0 -14 120 116" class="'+cls+'" aria-hidden="true"><defs><clipPath id="'+id+'"><ellipse cx="62" cy="80" rx="30" ry="17"/></clipPath></defs>'+
   '<ellipse class="psh" cx="60" cy="99" rx="34" ry="4.5"/>'+(su&&su.back?su.back:'')+
   '<g class="ptail">'+A.tail+'</g>'+
   '<g class="pbody"><ellipse class="pfur" cx="62" cy="80" rx="30" ry="17"/>'+(A.belly||'')+(su?'<g clip-path="url(#'+id+')">'+su.body+'</g>':'')+'<g class="ppaws">'+A.paws+'</g></g>'+
   '<g class="phead">'+A.back+'<ellipse class="pfur" cx="58" cy="48" rx="33" ry="25"/>'+(A.detail||'')+(su&&su.head?su.head:'')+
     '<g class="peyes"><g class="plook"><ellipse class="peye" cx="45" cy="47" rx="4" ry="5"/><ellipse class="peye" cx="71" cy="47" rx="4" ry="5"/><circle class="pglint" cx="46.4" cy="45" r="1.3"/><circle class="pglint" cx="72.4" cy="45" r="1.3"/></g></g>'+
     '<g class="pclosed"><path d="M40 48q5 4 10 0M66 48q5 4 10 0" fill="none" stroke-width="2.6" stroke-linecap="round"/></g>'+
     '<g class="phappy"><path d="M40 49q5-5 10 0M66 49q5-5 10 0" fill="none" stroke-width="2.6" stroke-linecap="round"/></g>'+
     '<g class="psadeyes"><path d="M40 46l9 3M76 46l-9 3" fill="none" stroke-width="2.6" stroke-linecap="round"/></g>'+
     A.nose+'<g class="pmouth">'+A.mouth+'</g>'+
     '<path class="pfrown" d="M53 63q5-4 10 0" fill="none" stroke-width="2" stroke-linecap="round"/>'+
     '<ellipse class="pyawn" cx="58" cy="62" rx="5" ry="6"/>'+
     '<g class="pblush"><ellipse cx="37" cy="57" rx="5" ry="3"/><ellipse cx="79" cy="57" rx="5" ry="3"/></g>'+A.extra+
     (su&&su.face?su.face:'')+(A.front||'')+(ha?'<g class="phat">'+ha.svg+'</g>':'')+'</g>'+
   '<g class="ptoy">'+A.toysvg+'</g>'+
   '<g class="pzz"><text x="94" y="20">z</text><text x="102" y="8">z</text><text x="110" y="-3">z</text></g>'+
   '<g class="psweat"><path d="M93 30q4 6 0 9q-4-3 0-9z"/></g></svg>';
}

/* ---------- petite mascotte flottante ---------- */
function petInit(){
  var el=$('#pet');
  if(!el){el=document.createElement('div');el.id='pet';document.body.appendChild(el)}
  el.innerHTML='<div class="petb" id="petb"></div><button class="petc" onclick="petTap()" aria-label="'+esc(petName())+', ta mascotte"><div class="pbob">'+petSvg()+'</div></button>';
  el.className='pm-'+PET.mood;el.style.display=PET.on?'':'none';petUpdate();
}
function petBase(){
  var h=new Date().getHours();if(h>=23||h<7){return 'sleep'}
  if(!D){return 'idle'}
  var S=formScore(),last=lastSeanceDays(),fat=lastFatigue(),ko=alerts().filter(function(a){return a[0]==='ko'}).length;
  if((S.v!=null&&S.v<60)||(fat&&fat<=2)){return 'tired'}
  if(ko>=3||(last!=null&&last>=5)||petJoy()<20){return 'sad'}
  if(Date.now()-PET.t>90000&&Math.random()<.35){return 'sleep'}
  return 'idle';
}
function lastSeanceDays(){var t=INS&&INS.train;if(!t||!t.length){return null}var l=t.slice().sort().pop();return Math.round((Date.parse(todayKey())-Date.parse(l))/864e5)}
function lastFatigue(){try{var d=JSON.parse(localStorage.getItem('forme_lastfat')||'null');return d&&d.d>=addDays(todayKey(),-1)?d.v:null}catch(e){return null}}
function petSetCls(el,m){if(!el){return}var keep=['play','boop','look-l','look-r','pt-head','pt-belly','eat'].filter(function(c){return el.classList.contains(c)});el.className='pm-'+m+(keep.length?' '+keep.join(' '):'')}
function petSet(m){PET.mood=m;petSetCls($('#pet'),m)}
function petUpdate(){if(!PET.on||PET.busy){return}petSet(petBase())}
function petJoy(){var h=(Date.now()-(PS.joyT||Date.now()))/36e5;return Math.max(5,Math.min(100,Math.round((PS.joy==null?70:PS.joy)-h*1.2)))}
function petJoyAdd(n){PS.joy=Math.min(100,petJoy()+n);PS.joyT=Date.now();psSave();var b=$('#prjoy');if(b){prJoyPaint()}}
function petCheer(msg){
  if(!PET.on){return}petJoyAdd(8);var el=$('#pet');if(!el){return}PET.busy=true;PET.t=Date.now();petSet('happy');
  if(msg){petSay(msg,3600)}var st=$('#prs');if(st){prMood('happy');if(msg){prSay(msg)}}
  setTimeout(function(){PET.busy=false;petUpdate();if($('#prs')){prMood(petBase()==='sleep'?'idle':petBase())}},3400);
}
function petSay(t,ms){var b=$('#petb');if(!b||!PET.on){return}b.innerHTML=t;b.classList.remove('on');void b.offsetWidth;b.classList.add('on');clearTimeout(petSay.k);petSay.k=setTimeout(function(){b.classList.remove('on')},ms||4200)}
function petLines(){
  var n=uname().trim()||'toi',m=PET.mood,L=[],d=lastSeanceDays(),S=D?formScore():{},w=D?D.week:null,A=ANIM[PS.an];
  if(m==='sleep'){return['Zzz… 😴','Chut, je recharge mes batteries… comme toi cette nuit ?','Mmh… encore 5 minutes…']}
  if(d!=null&&d>=3){L.push('Ça fait '+d+' jours sans séance… on y retourne ensemble ? 🏋️')}
  if(m==='tired'){L.push('Toi aussi tu as l’air fatigué… séance légère aujourd’hui ? 🥱');if(S.ls){L.push('Seulement '+hm(S.ls)+' de sommeil… ce soir on se couche tôt, promis ?')}}
  if(m==='sad'){L.push(petJoy()<20?'Tu m’as un peu oublié… tu me fais un câlin ? 🥺':'Quelques points à surveiller cette semaine… on va arranger ça, '+n+' 💪')}
  if(w){var st=sum(w.stim);if(st>0){L.push(st+' séries stimulantes cette semaine, j’adore '+A.e)}}
  if(TRL&&TRL.length){var nx=TRL.filter(function(t){return !t.done&&!t.secret&&t.tier!=='p'}).sort(function(a,b){return b.cur/b.goal-a.cur/a.goal})[0];if(nx){L.push('Prochain trophée : « '+nx.name+' ». On le décroche ? 🏆')}
    var lk=SUITS.concat(HATS).filter(function(x){return !unlocked(x)})[0];if(lk){L.push('J’aimerais bien la tenue '+lk.n+' '+lk.e+'… '+unlockTxt(lk).toLowerCase()+' et elle est à moi !')}}
  L.push('Coucou '+n+' ! 👋','Bois un verre d’eau, ça fait toujours du bien 💧','Je crois en toi. Bon, je suis '+A.me+', mais quand même 🐾');
  return L;
}
function petTap(){
  var el=$('#pet');el.classList.remove('boop');void el.offsetWidth;el.classList.add('boop');if(navigator.vibrate){navigator.vibrate(10)}
  setTimeout(openPetRoom,260);
}
function petToggle(btn){PET.on=!PET.on;try{localStorage.setItem('forme_pet',PET.on?'1':'0')}catch(e){}if(btn){btn.classList.toggle('on',PET.on)}petInit();petMeta();if(PET.on){petCheer('Me revoilà ! '+ANIM[PS.an].e)}}
function petGreet(){
  if(!PET.on){return}var last=0;try{last=+localStorage.getItem('forme_petseen')||0;localStorage.setItem('forme_petseen',String(Date.now()))}catch(e){}
  petMeta();if(Date.now()-last<6*3600e3){return}
  setTimeout(function(){var d=lastSeanceDays(),n=uname().trim(),away=last?Math.floor((Date.now()-last)/864e5):0;
    if(away>=2){petSet('sad');petSay('Tu m’as manqué'+(n?' '+n:'')+'… '+away+' jours sans te voir 🥺 Touche-moi !')}
    else if(d!=null&&d>=3){petSet('sad');petSay('Tu m’as manqué'+(n?' '+n:'')+'… '+d+' jours sans séance 🥺')}
    else if(PET.mood==='sleep'){petSay('Zzz… (touche-moi pour me réveiller)')}
    else{petSay((new Date().getHours()<12?'Bonjour':'Re')+(n?' '+n:'')+' ! '+ANIM[PS.an].e+' Touche-moi pour jouer.')}},2500);
}
/* petites animations de temps en temps : jouet, regard */
function petPlay(el,long){if(!el){return}el.classList.remove('play');void el.offsetWidth;el.classList.add('play');clearTimeout(el._pt);el._pt=setTimeout(function(){el.classList.remove('play')},long?4600:4200)}
function petIdleTick(){
  var el=$('#pet');
  if(PET.on&&el&&!document.hidden&&!PET.busy&&PET.mood==='idle'&&!document.body.classList.contains('open')){
    if(Math.random()<.6){petPlay(el)}else{var c=Math.random()<.5?'look-l':'look-r';el.classList.add(c);setTimeout(function(){el.classList.remove(c)},1600)}
  }
  setTimeout(petIdleTick,40000+Math.random()*30000);
}
setTimeout(petIdleTick,20000);
setInterval(function(){if(!PET.busy){petUpdate()}},60000);

/* ---------- page dédiée ---------- */
var PR={tab:'suit',down:false,zone:'',d:0,k:0,last:0,mood:'idle'};
function prSvg(){return '<div class="pbob" id="prsvgw">'+petSvg({cls:'prsvg'})+'</div>'}
function prJoyPaint(){var j=petJoy(),b=$('#prjoy');if(!b){return}b.innerHTML='<div class="prjh"><span>Bonheur</span><b class="'+(j>=60?'tok':j<30?'tko':'')+'">'+j+' %</b></div><div class="tr"><i style="width:'+j+'%;background:'+(j>=60?'var(--ok)':j<30?'var(--ko)':'rgba(var(--fgr),.6)')+'"></i></div>'}
function prMood(m){var st=$('#prs');if(!st){return}PR.mood=m;petSetCls(st,m);st.classList.add('prstage')}
function prSay(t,ms){var b=$('#prb');if(!b){return}b.innerHTML=t;b.classList.remove('on');void b.offsetWidth;b.classList.add('on');clearTimeout(prSay.k);prSay.k=setTimeout(function(){b.classList.remove('on')},ms||3600)}
function pick(L){return L[Math.floor(Math.random()*L.length)]}
function openPetRoom(){
  var A=ANIM[PS.an];
  openSh('<div class="sh-h"><input class="prname" id="prn" maxlength="14" value="'+esc(petName())+'" aria-label="Nom de ta mascotte" oninput="prRename(this)"><button class="gb" onclick="closeSh()" aria-label="Fermer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'+
   '<div class="note" style="margin:-6px 4px 0">'+A.e+' '+A.n+' · touche son nom pour le changer</div>'+
   '<div class="prstage" id="prs" onpointerdown="prDown(event)" onpointermove="prMove(event)" onpointerup="prUp()" onpointercancel="prUp()" onpointerleave="prUp()"><div class="prglow"></div><div class="prb" id="prb"></div>'+prSvg()+'<div id="prfx"></div></div>'+
   '<div class="note prhint">Caresse sa tête ou son ventre ✋</div>'+
   '<div class="g" id="prjoy" style="padding:14px 18px;margin-top:10px"></div>'+
   '<div class="prbtns"><button class="g" onclick="prPlay()"><span>'+({cat:'🧶',dog:'🎾',shark:'🫧'}[PS.an])+'</span>Jouer</button><button class="g" id="prtreat" onclick="prTreat()"><span>'+A.treat+'</span>Friandise<small id="prtn"></small></button><button class="g" onclick="prTalk()"><span>💬</span>Un conseil</button></div>'+
   '<h2>Ton compagnon</h2><div class="pran">'+Object.keys(ANIM).map(function(k){return '<button class="g'+(k===PS.an?' on':'')+'" onclick="prAnimal(\''+k+'\')"><div class="prmini">'+petSvg({an:k,cls:'pvw'})+'</div><b>'+ANIM[k].n+'</b><small>'+esc((PS.name&&PS.name[k])||ANIM[k].def)+'</small></button>'}).join('')+'</div>'+
   '<h2>Garde-robe ✨</h2><div class="g seg" id="prseg" style="padding:3px;margin-bottom:12px"><u></u><button onclick="prTab(\'suit\')">Combinaisons</button><button onclick="prTab(\'hat\')">Chapeaux</button></div><div class="prwr" id="prwr"></div>'+
   '<h2>Réglages</h2>'+
   '<div class="g setrow"><div><b style="font-weight:600">Afficher '+esc(petName())+'</b><div class="note">En bas de l’écran, dans toute l’appli</div></div><button class="sw'+(PET.on?' on':'')+'" onclick="petToggle(this)" aria-label="Afficher la mascotte"><i></i></button></div>'+
   '<div class="g setrow"><div><b style="font-weight:600">Notifications « tu me manques »</b><div class="note">Un petit mot si tu n’ouvres pas Forme pendant plus d’un jour</div></div><button class="sw'+(PS.notif?' on':'')+'" id="prnsw" onclick="petNotif(this)" aria-label="Notifications"><i></i></button></div>'+
   '<div class="note" id="prnm" style="margin:0 6px 12px;line-height:1.5"></div>'+
   '<button class="g pill" style="width:100%;padding:13px;margin-bottom:8px" onclick="petNotifTest()">Tester une notification</button>');
  document.body.classList.add('full');
  var m=PET.mood;prMood(m==='sleep'||m==='sad'||m==='tired'?m:'idle');prJoyPaint();prTab(PR.tab,1);prTreatPaint();
  setTimeout(function(){if(!$('#prs')){return}if(PR.mood==='sleep'){prSay('Zzz… (caresse-moi pour me réveiller)')}else if(PR.mood==='sad'){prSay(petJoy()<20?'Tu m’as manqué… un câlin ? 🥺':pick(petLines()))}else{prSay('Coucou '+(uname().trim()||'toi')+' ! '+A.e)}},500);
}
function prRename(el){PS.name=PS.name||{};PS.name[PS.an]=el.value;psSave();var b=$('#pet .petc');if(b){b.setAttribute('aria-label',petName()+', ta mascotte')}petMeta()}
function prRefresh(){var w=$('#prsvgw');if(w){w.outerHTML=prSvg()}petInit();prTab(PR.tab,1)}
function prAnimal(k){if(k===PS.an){return}PS.an=k;psSave();PET.mood='idle';openPetRoom();petInit();petMeta();setTimeout(function(){prMood('happy');prSay('Coucou ! Moi c’est '+esc(petName())+' '+ANIM[k].e);setTimeout(function(){prMood('idle')},2000)},150)}
function prTab(t,quiet){
  PR.tab=t;var s=$('#prseg');if(!s){return}var b=s.querySelectorAll('button');b[0].classList.toggle('on',t==='suit');b[1].classList.toggle('on',t==='hat');s.querySelector('u').style.transform=t==='hat'?'translateX(100%)':'';
  var L=t==='suit'?SUITS:HATS,cur=t==='suit'?PS.suit:PS.hat,n=L.filter(unlocked).length,su=byId(SUITS,PS.suit);
  $('#prwr').innerHTML='<div class="note" style="margin:0 4px 10px">'+n+' sur '+L.length+' débloqué'+(n>1?'s':'')+(t==='hat'&&su&&su.nohat?' · pas de chapeau avec le casque d’astronaute':'')+'</div><div class="prgrid">'+
   '<button class="g prit'+(!cur?' on':'')+'" onclick="prWear(\''+t+'\',\'\')"><div class="prmini">'+petSvg(t==='suit'?{suit:'',cls:'pvw'}:{hat:'',cls:'pvw'})+'</div><b>Aucun'+(t==='suit'?'e':'')+'</b></button>'+
   L.map(function(it){var ok=unlocked(it),o={cls:'pvw'};o[t]=it.id;
    return '<button class="g prit'+(it.id===cur?' on':'')+(ok?'':' lock')+'" onclick="prWear(\''+t+'\',\''+it.id+'\')"><div class="prmini">'+petSvg(o)+(ok?'':'<i>🔒</i>')+'</div><b>'+it.e+' '+it.n+'</b><small>'+(ok?(it.u.free?'Offert':'Débloqué ✓'):esc(unlockTxt(it)))+'</small></button>'}).join('')+'</div>';
}
function prWear(t,id){
  var it=id?byId(t==='suit'?SUITS:HATS,id):null;
  if(it&&!unlocked(it)){prSay('🔒 '+esc(unlockHow(it)),4200);var s=$('#prs');if(s){s.scrollIntoView({behavior:'smooth',block:'center'})}return}
  if(t==='suit'){PS.suit=id}else{PS.hat=id}psSave();prRefresh();
  if(it){prMood('happy');prSay(pick(['Trop classe ! ✨','Je suis beau, non ? 😎','Je la garde ! '+it.e]));if(navigator.vibrate){navigator.vibrate(12)}setTimeout(function(){prMood('idle')},1800)}
}
/* caresses */
function prZone(e){var w=$('#prsvgw');if(!w){return 'head'}var r=w.getBoundingClientRect();return (e.clientY-r.top)/r.height<.72?'head':'belly'}
function prDown(e){
  PR.down=true;PR.x=e.clientX;PR.y=e.clientY;PR.d=0;PR.zone=prZone(e);
  if(PR.mood==='sleep'){prMood('wake');prSay('Hein ? Ah, c’est toi '+(uname().trim()||'')+' '+ANIM[PS.an].e,2400);setTimeout(function(){if(PR.mood==='wake'){prMood('idle')}},1400);PR.down=false;return}
  prPetStart(PR.zone);prHeart(e);
}
function prMove(e){
  if(!PR.down){return}var dx=e.clientX-PR.x,dy=e.clientY-PR.y;PR.d+=Math.sqrt(dx*dx+dy*dy);PR.x=e.clientX;PR.y=e.clientY;
  var z=prZone(e);if(z!==PR.zone){PR.zone=z;prPetStart(z)}
  if(PR.d>34){PR.d=0;prHeart(e);if(navigator.vibrate){navigator.vibrate(6)}}
}
function prUp(){if(!PR.down){return}PR.down=false;var st=$('#prs');clearTimeout(PR.k);PR.k=setTimeout(function(){if(st){st.classList.remove('pt-head','pt-belly')}},700)}
function prPetStart(z){
  var st=$('#prs');if(!st){return}clearTimeout(PR.k);st.classList.remove('pt-head','pt-belly');st.classList.add('pt-'+z);
  if(PR.mood==='sad'||PR.mood==='tired'){prMood('idle')}
  if(Date.now()-PR.last>2600){PR.last=Date.now();var A=ANIM[PS.an];prSay(pick(z==='head'?A.pet:A.belly),2400)}
}
function prHeart(e){
  var fx=$('#prfx'),st=$('#prs');if(!fx||!st){return}var r=st.getBoundingClientRect(),h=document.createElement('i');
  h.className='prh';h.style.left=(e.clientX-r.left)+'px';h.style.top=(e.clientY-r.top)+'px';h.style.setProperty('--dx',(Math.random()*40-20)+'px');h.style.setProperty('--s',(.7+Math.random()*.6).toFixed(2));
  h.innerHTML='<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2.2 0 3.8 1.3 5.4 3.2 1.6-1.9 3.2-3.2 5.4-3.2 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21z"/></svg>';
  fx.appendChild(h);setTimeout(function(){h.remove()},1500);var t=todayKey();if(PS.cD!==t){PS.cD=t;PS.cN=0}if(PS.cN<30){PS.cN++;petJoyAdd(1)}
}
function prPlay(){
  var st=$('#prs');if(!st||st.classList.contains('play')){return}if(PR.mood==='sleep'){prMood('wake')}
  petPlay(st,1);prMood('happy');prSay(pick(ANIM[PS.an].play));petJoyAdd(6);setTimeout(function(){prMood('idle')},4600);
}
function prTreatLeft(){var t=todayKey();if(PS.trD!==t){PS.trD=t;PS.trN=0}return 3-PS.trN}
function prTreatPaint(){var n=$('#prtn'),b=$('#prtreat');if(!n){return}var l=prTreatLeft();n.textContent=l>0?l+' aujourd’hui':'Demain !';b.classList.toggle('dim',l<=0)}
function prTreat(){
  var st=$('#prs');if(!st){return}if(prTreatLeft()<=0){prSay('J’ai assez mangé pour aujourd’hui… merci ! 😊');return}
  PS.trN++;psSave();prTreatPaint();if(PR.mood==='sleep'){prMood('wake')}
  var f=document.createElement('i');f.className='prtr';f.textContent=ANIM[PS.an].treat;$('#prfx').appendChild(f);
  setTimeout(function(){st.classList.add('eat');prMood('happy')},700);
  setTimeout(function(){f.remove();prSay(pick(ANIM[PS.an].eat));petJoyAdd(10)},1000);
  setTimeout(function(){st.classList.remove('eat');prMood('idle')},2600);
}
function prTalk(){var L=petLines();if(PR.mood==='sleep'){prMood('wake');setTimeout(function(){prMood('idle')},1200)}prSay(L[PET.msgI++%L.length],5200)}
/* carte dans l'onglet Moi */
function petMoiCard(){
  if(!PET.on){return ''}var j=petJoy(),n=SUITS.concat(HATS).filter(unlocked).length;
  return '<h2>Ton compagnon '+ANIM[PS.an].e+'</h2><button class="g prcard tap" onclick="openPetRoom()"><div class="prmini">'+petSvg({cls:'pvw'})+'</div><div style="flex:1;min-width:0;text-align:left"><b>'+esc(petName())+'</b><div class="note">Bonheur '+j+' % · '+n+' accessoire'+(n>1?'s':'')+' sur '+(SUITS.length+HATS.length)+'</div><div class="tr"><i style="width:'+j+'%;background:'+(j>=60?'var(--ok)':j<30?'var(--ko)':'rgba(var(--fgr),.6)')+'"></i></div></div><svg viewBox="0 0 24 24" style="width:18px;height:18px;color:var(--m);flex:none"><path d="M9 6l6 6-6 6"/></svg></button>';
}

/* ---------- notifications « tu me manques » ---------- */
function petMeta(){
  if(!('caches' in window)||(typeof gs==='function'&&gs())){return}
  var m={last:Date.now(),name:petName(),emoji:ANIM[PS.an].e,an:PS.an,notif:!!(PS.notif&&PET.on),user:uname().trim()};
  caches.open('forme-meta').then(function(c){return c.match('./__pet').then(function(r){return r?r.json():{}}).then(function(o){m.lastNotif=o.lastNotif||0;return c.put('./__pet',new Response(JSON.stringify(m),{headers:{'Content-Type':'application/json'}}))})}).catch(function(){});
}
function prNote(t){var n=$('#prnm');if(n){n.innerHTML=t}else{toast(t.replace(/<[^>]+>/g,''))}}
function petNotif(btn){
  if(PS.notif){PS.notif=false;psSave();if(btn){btn.classList.remove('on')}petMeta();prNote('Notifications coupées.');
    if('serviceWorker' in navigator){navigator.serviceWorker.ready.then(function(r){if(r.periodicSync){r.periodicSync.unregister('forme-pet')}}).catch(function(){})}return}
  if(!('Notification' in window)||!('serviceWorker' in navigator)||(typeof gs==='function'&&gs())){prNote('<span class="tko">Les notifications ne marchent que dans l’appli Forme installée sur ton écran d’accueil.</span>');return}
  Notification.requestPermission().then(function(p){
    if(p!=='granted'){prNote('<span class="tko">Notifications refusées.</span> Pour les autoriser : Paramètres du téléphone › Applications › Forme › Notifications.');return}
    PS.notif=true;psSave();if(btn){btn.classList.add('on')}petMeta();
    return navigator.serviceWorker.ready.then(function(reg){
      if(!reg.periodicSync){prNote('Activées ✓ Ton navigateur ne réveille pas Forme en arrière-plan, alors '+esc(petName())+' te le dira surtout à l’ouverture.');return}
      var q=navigator.permissions&&navigator.permissions.query?navigator.permissions.query({name:'periodic-background-sync'}).catch(function(){return{state:'prompt'}}):Promise.resolve({state:'prompt'});
      return q.then(function(st){
        return reg.periodicSync.register('forme-pet',{minInterval:12*3600e3}).then(function(){prNote('Activées ✓ '+esc(petName())+' t’écrira s’il ne te voit pas pendant plus d’un jour (entre 9 h et 22 h).')})
          .catch(function(){prNote('Activées, mais ton téléphone bloque le réveil en arrière-plan'+(st.state!=='granted'?' : installe Forme sur l’écran d’accueil depuis Chrome':'')+'. '+esc(petName())+' te le dira à l’ouverture.')});
      });
    });
  }).catch(function(){prNote('<span class="tko">Impossible d’activer les notifications ici.</span>')});
}
function petNotifTest(){
  if(!('Notification' in window)||!('serviceWorker' in navigator)||(typeof gs==='function'&&gs())){prNote('<span class="tko">Les notifications ne marchent que dans l’appli Forme installée.</span>');return}
  Notification.requestPermission().then(function(p){
    if(p!=='granted'){prNote('<span class="tko">Autorise d’abord les notifications pour Forme.</span>');return}
    return navigator.serviceWorker.ready.then(function(reg){
      return reg.showNotification(petName()+' '+ANIM[PS.an].e,{body:'Tu me manques… 🥺 On se fait une séance ?',icon:'icon-192.png',badge:'icon-192.png',tag:'forme-pet',data:{url:'./'}});
    }).then(function(){prNote('Envoyée ✓ Regarde en haut de ton écran.')});
  }).catch(function(e){prNote('<span class="tko">'+esc(e.message||e)+'</span>')});
}
document.addEventListener('visibilitychange',function(){if(!document.hidden&&PET.on){petMeta()}});

/* ---------- branchements mascotte ---------- */
var _trNext=trNext;trNext=function(){var go=TRQ.length&&!TRBusy;_trNext();if(go){petCheer('Un trophée ! Je suis trop fier de toi 🏆')}};
var _showLevelUp=showLevelUp;showLevelUp=function(X){_showLevelUp(X);petCheer('Niveau '+X.lvl+' ! 🎉')};
var _showSeanceDone=showSeanceDone;showSeanceDone=function(p,B,note){_showSeanceDone(p,B,note);setTimeout(function(){petCheer(B.recs.length?'Record battu ! Tu m’impressionnes 🔥':'Séance enregistrée, bravo 💪')},900)};
var _showSeanceDone2=showSeanceDone;showSeanceDone=function(p,B,note){_showSeanceDone2(p,B,note);if(note||!live()){return}var bx=document.querySelector('#rec .lvupb .obgo');if(!bx){return}
  var w=document.createElement('div');w.className='g ccr';w.innerHTML='<div class="lab">Le mot du coach 🧠</div><div id="ccr"></div>';bx.parentNode.insertBefore(w,bx);
  var sum={date:p.date,seance:p.seance,fatigue:p.fatigue,notes:p.notes,exercices:p.rows.map(function(r){return{exercice:r.exo,groupe:r.groupe,series:r.series,reps:r.reps,charge:r.charge,rir:r.rir,cardio:r.cardio}}),records:B.recs.map(function(x){return x.txt+' · '+x.e}),progres:B.ups};
  setTimeout(function(){coachAsk('seance',sum,$('#ccr'))},1200)};
var _seFinish=seFinish;seFinish=function(btn){try{if(SE&&SE.fat){localStorage.setItem('forme_lastfat',JSON.stringify({d:SE.date,v:SE.fat}))}}catch(e){}_seFinish(btn)};
var _renderWeek=renderWeek;renderWeek=function(){_renderWeek();petUpdate()};
var _computeTr=computeTrophies;computeTrophies=function(){var r=_computeTr.apply(this,arguments);try{petCheckUnlocks()}catch(e){}return r};


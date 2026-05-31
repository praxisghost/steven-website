/* guarani-srs-es.js — Avañe'ẽ for Spanish speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 105 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'gn-es';
  const WORDS = [
    ["mba'éichapa", "hola / ¿cómo estás?"],
    ["iporã", "bien / está bien"],
    ["ha nde?", "¿y tú?"],
    ["mba'éichapa neko'ẽ", "buenos días (¿cómo amaneciste?)"],
    ["ka'aru porã", "buenas tardes"],
    ["pyhare porã", "buenas noches"],
    ["aguyje", "gracias"],
    ["aguyjevete", "muchas gracias"],
    ["heẽ", "sí"],
    ["nahániri", "no"],
    ["ikatu", "se puede / está bien"],
    ["ñperdoná / ani rehecha", "perdón"],
    ["jajotopata", "hasta luego / nos vemos"],
    ["eguahẽ porãite", "bienvenido"],
    ["mba'e nde réra?", "¿cómo te llamas?"],
    ["che réra ...", "me llamo ..."],
    ["che", "yo"],
    ["nde", "tú"],
    ["ha'e", "él / ella"],
    ["ñande", "nosotros (inclusivo)"],
    ["ore", "nosotros (exclusivo)"],
    ["peẽ", "ustedes / vosotros"],
    ["ha'ekuéra", "ellos / ellas"],
    ["kuimba'e", "hombre"],
    ["kuña", "mujer"],
    ["mitã", "niño"],
    ["sy", "madre"],
    ["túva", "padre"],
    ["ta'ýra", "hijo (de varón)"],
    ["tajýra", "hija (de varón)"],
    ["tyke'ýra", "hermano mayor"],
    ["irũ", "amigo / compañero"],
    ["pehẽngue", "pariente / hermano"],
    ["y", "agua"],
    ["karu", "comer"],
    ["mbujape", "pan"],
    ["so'o", "carne"],
    ["pira", "pez / pescado"],
    ["kamby", "leche"],
    ["kafe", "café"],
    ["juky", "sal"],
    ["asuka", "azúcar"],
    ["ka'a", "yerba mate"],
    ["tereré", "tereré (mate frío)"],
    ["peteĩ", "uno"],
    ["mokõi", "dos"],
    ["mbohapy", "tres"],
    ["irundy", "cuatro"],
    ["po", "cinco"],
    ["poteĩ", "seis"],
    ["pokõi", "siete"],
    ["poapy", "ocho"],
    ["porundy", "nueve"],
    ["pa", "diez"],
    ["guata", "caminar"],
    ["ho", "ir (oho = va)"],
    ["ju", "venir (ou = viene)"],
    ["ke", "dormir"],
    ["hecha", "ver"],
    ["hendu", "oír / escuchar"],
    ["ñe'ẽ", "hablar / lengua"],
    ["kuaa", "saber"],
    ["ai / aipota", "querer (aipota = quiero)"],
    ["japo", "hacer"],
    ["me'ẽ", "dar"],
    ["purahéi", "cantar"],
    ["mboʼe", "enseñar / aprender"],
    ["porã", "bonito / bueno"],
    ["vai", "feo / malo"],
    ["guasu", "grande"],
    ["michĩ", "pequeño"],
    ["haku", "caliente"],
    ["ro'y", "frío"],
    ["pya'e", "rápido"],
    ["mbegue", "lento / despacio"],
    ["pyahu", "nuevo"],
    ["tuja", "viejo"],
    ["mba'e?", "¿qué?"],
    ["máva?", "¿quién?"],
    ["moõ?", "¿dónde?"],
    ["araka'e?", "¿cuándo?"],
    ["mboy?", "¿cuánto?"],
    ["mba'ére?", "¿por qué?"],
    ["ha", "y"],
    ["ndive", "con"],
    ["ha katu", "pero"],
    ["ko'ẽro", "mañana"],
    ["ko ára", "hoy"],
    ["kuehe", "ayer"],
    ["ko'ãga", "ahora"],
    ["ápe", "aquí"],
    ["upépe", "allí"],
    ["óga", "casa"],
    ["táva", "pueblo / ciudad"],
    ["tetã", "país / nación"],
    ["kuarahy", "sol"],
    ["jasy", "luna"],
    ["mbyja", "estrella"],
    ["yvytu", "viento"],
    ["ama", "lluvia"],
    ["yvy", "tierra / suelo"],
    ["yvoty", "flor"],
    ["jagua", "perro"],
    ["mbarakaja", "gato"],
    ["guyra", "pájaro"]
  ];

  /* ---- escape + render the frequency table from WORDS (single source) ---- */
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  (function renderFreqTable(){
    const tbody = document.querySelector('.vocab-freq-table tbody');
    if (!tbody) return;
    tbody.innerHTML = WORDS.map(function(w,i){
      return '<tr><td>'+(i+1)+'</td><td>'+esc(w[0])+'</td><td>'+esc(w[1])+'</td></tr>';
    }).join('');
  })();

  /* ---- SM-2 spaced repetition engine ---- */
  function loadState(){try{return JSON.parse(localStorage.getItem('srs_'+PAIR)||'{}');}catch(e){return {};}}
  function saveState(s){try{localStorage.setItem('srs_'+PAIR,JSON.stringify(s));}catch(e){}}
  function today(){return Math.floor(Date.now()/86400000);}
  function getDue(state){const t=today();return WORDS.filter(function(_,i){const c=state[i];return !c||c.nextDay<=t;});}
  function updateCard(state,idx,quality){
    const c=state[idx]||{ef:2.5,interval:1,reps:0};
    if(quality<3){c.reps=0;c.interval=1;}
    else{
      if(c.reps===0)c.interval=1;
      else if(c.reps===1)c.interval=6;
      else c.interval=Math.round(c.interval*c.ef);
      c.reps+=1;
      c.ef=Math.max(1.3,c.ef+0.1-(5-quality)*(0.08+(5-quality)*0.02));
    }
    c.nextDay=today()+c.interval;state[idx]=c;return state;
  }
  const elInfo=document.getElementById('srs-info'),elCard=document.getElementById('srs-card'),
        elFront=document.getElementById('srs-front'),elBack=document.getElementById('srs-back'),
        elControls=document.getElementById('srs-controls'),elFlip=document.getElementById('srs-flip'),
        elAgain=document.getElementById('srs-again'),elGood=document.getElementById('srs-good'),
        elDone=document.getElementById('srs-done'),elRestart=document.getElementById('srs-restart'),
        elBar=document.getElementById('srs-bar');
  if(!elInfo)return;
  let state=loadState(),queue=[],current=null;
  function buildQueue(){queue=getDue(state).map(function(w){return WORDS.indexOf(w);}).sort(function(){return Math.random()-0.5;});}
  function updateBar(){if(elBar)elBar.style.width=(WORDS.length?((WORDS.length-getDue(state).length)/WORDS.length)*100:100)+'%';}
  function showCard(){
    if(!queue.length){elCard.style.display=elFlip.style.display=elControls.style.display='none';elDone.style.display='block';elInfo.textContent='Session complete!';updateBar();return;}
    current=queue.shift();
    const pair=WORDS[current];
    elFront.textContent=pair[0];elBack.textContent=pair[1];
    elBack.style.display='none';elFront.style.display='block';
    elControls.style.display='none';elFlip.style.display='inline-block';
    elCard.style.display='block';elDone.style.display='none';
    elInfo.textContent=(queue.length+1)+' / '+getDue(loadState()).length+' cards due';
    updateBar();
  }
  function flip(){elBack.style.display=elFront.style.display='block';elFlip.style.display='none';elControls.style.display='flex';}
  elFlip.addEventListener('click',flip);
  elAgain.addEventListener('click',function(){state=updateCard(state,current,1);saveState(state);queue.push(current);current=null;showCard();});
  elGood.addEventListener('click',function(){state=updateCard(state,current,5);saveState(state);current=null;showCard();});
  if(elRestart)elRestart.addEventListener('click',function(){buildQueue();elDone.style.display='none';showCard();});
  document.addEventListener('keydown',function(e){
    if((e.key===' '||e.key==='Enter')&&elFlip.style.display!=='none'){e.preventDefault();flip();}
    if(e.key==='1'&&elControls.style.display!=='none'){state=updateCard(state,current,1);saveState(state);queue.push(current);current=null;showCard();}
    if(e.key==='3'&&elControls.style.display!=='none'){state=updateCard(state,current,5);saveState(state);current=null;showCard();}
  });
  buildQueue();showCard();
})();

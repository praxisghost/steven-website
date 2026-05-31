/* romansh-srs-de.js — Rumantsch for German speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 107 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'rm-de';
  const WORDS = [
    ["allegra", "hallo (Gruss)"],
    ["bun di", "guten Tag / Morgen"],
    ["buna saira", "guten Abend"],
    ["buna notg", "gute Nacht"],
    ["co vai?", "wie geht's?"],
    ["bain", "gut"],
    ["grazia", "danke"],
    ["grazia fitg", "vielen Dank"],
    ["gea", "ja"],
    ["na", "nein"],
    ["per plaschair", "bitte"],
    ["perstgisai", "Entschuldigung"],
    ["anzi / per plaschair", "gern geschehen"],
    ["a revair", "auf Wiedersehen"],
    ["bainvegni", "willkommen"],
    ["co has ti num?", "wie heisst du?"],
    ["jau hai num ...", "ich heisse ..."],
    ["jau", "ich"],
    ["ti", "du"],
    ["el / ella", "er / sie"],
    ["nus", "wir"],
    ["vus", "ihr"],
    ["els / ellas", "sie (Plural)"],
    ["um", "Mann"],
    ["dunna", "Frau"],
    ["uffant", "Kind"],
    ["mamma", "Mutter"],
    ["bab", "Vater"],
    ["figl", "Sohn"],
    ["figlia", "Tochter"],
    ["frar", "Bruder"],
    ["sora", "Schwester"],
    ["tat / tata", "Grossvater / Grossmutter"],
    ["ami / amitg", "Freund"],
    ["famiglia", "Familie"],
    ["aua", "Wasser"],
    ["mangiar", "essen"],
    ["baiver", "trinken"],
    ["paun", "Brot"],
    ["pesch", "Fisch"],
    ["charn", "Fleisch"],
    ["latg", "Milch"],
    ["chaschiel", "Käse"],
    ["café", "Kaffee"],
    ["vin", "Wein"],
    ["zucher", "Zucker"],
    ["sal", "Salz"],
    ["in", "eins"],
    ["dus", "zwei"],
    ["trais", "drei"],
    ["quatter", "vier"],
    ["tschintg", "fünf"],
    ["sis", "sechs"],
    ["set", "sieben"],
    ["otg", "acht"],
    ["nov", "neun"],
    ["diesch", "zehn"],
    ["ventg", "zwanzig"],
    ["tschient", "hundert"],
    ["milli", "tausend"],
    ["ir", "gehen"],
    ["vegnir", "kommen"],
    ["esser", "sein"],
    ["avair", "haben"],
    ["far", "machen / tun"],
    ["dir", "sagen"],
    ["vesair", "sehen"],
    ["udir", "hören"],
    ["discurrer", "sprechen"],
    ["savair", "wissen / können"],
    ["vulair", "wollen"],
    ["pudair", "können"],
    ["durmir", "schlafen"],
    ["leger", "lesen"],
    ["scriver", "schreiben"],
    ["lavurar", "arbeiten"],
    ["viver", "leben"],
    ["bun", "gut"],
    ["nausch", "schlecht"],
    ["grond", "gross"],
    ["pitschen", "klein"],
    ["chaud", "heiss / warm"],
    ["fraid", "kalt"],
    ["bel", "schön"],
    ["spert", "schnell"],
    ["plaun", "langsam"],
    ["nov (adj.)", "neu"],
    ["vegl", "alt"],
    ["tge?", "was?"],
    ["tgi?", "wer?"],
    ["nua?", "wo?"],
    ["cura?", "wann?"],
    ["co?", "wie?"],
    ["pertge?", "warum?"],
    ["e", "und"],
    ["cun", "mit"],
    ["ma", "aber"],
    ["oz", "heute"],
    ["damaun", "morgen"],
    ["ier", "gestern"],
    ["ussa", "jetzt"],
    ["chasa", "Haus"],
    ["muntogna", "Berg"],
    ["sulegl", "Sonne"],
    ["god", "Wald"],
    ["chaun", "Hund"],
    ["giat", "Katze"]
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

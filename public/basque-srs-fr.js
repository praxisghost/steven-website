/* basque-srs-fr.js — Euskara for French speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 102 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'eu-fr';
  const WORDS = [
    ["kaixo", "bonjour / salut"],
    ["egun on", "bonjour (le matin)"],
    ["arratsalde on", "bon après-midi"],
    ["gabon", "bonne nuit"],
    ["zer moduz?", "comment ça va ?"],
    ["ondo", "bien"],
    ["eskerrik asko", "merci"],
    ["mila esker", "merci beaucoup"],
    ["ez horregatik", "de rien"],
    ["bai", "oui"],
    ["ez", "non"],
    ["mesedez", "s'il vous plaît"],
    ["barkatu", "pardon / excusez-moi"],
    ["agur", "au revoir"],
    ["ikusi arte", "à bientôt"],
    ["nola duzu izena?", "comment vous appelez-vous ?"],
    ["nire izena ... da", "je m'appelle ..."],
    ["ni", "je / moi"],
    ["zu", "tu / vous"],
    ["hura", "il / elle"],
    ["gu", "nous"],
    ["zuek", "vous (pluriel)"],
    ["haiek", "ils / elles"],
    ["gizon", "homme"],
    ["emakume", "femme"],
    ["haur", "enfant"],
    ["ama", "mère"],
    ["aita", "père"],
    ["seme", "fils"],
    ["alaba", "fille"],
    ["anaia / neba", "frère"],
    ["arreba / ahizpa", "sœur"],
    ["lagun", "ami"],
    ["familia", "famille"],
    ["ur", "eau"],
    ["jan", "manger"],
    ["edan", "boire"],
    ["ogi", "pain"],
    ["ardo", "vin"],
    ["gazta", "fromage"],
    ["arrain", "poisson"],
    ["haragi", "viande"],
    ["esne", "lait"],
    ["kafe", "café"],
    ["azukre", "sucre"],
    ["gatz", "sel"],
    ["sagar", "pomme"],
    ["bat", "un"],
    ["bi", "deux"],
    ["hiru", "trois"],
    ["lau", "quatre"],
    ["bost", "cinq"],
    ["sei", "six"],
    ["zazpi", "sept"],
    ["zortzi", "huit"],
    ["bederatzi", "neuf"],
    ["hamar", "dix"],
    ["hogei", "vingt"],
    ["ehun", "cent"],
    ["mila", "mille"],
    ["joan", "aller"],
    ["etorri", "venir"],
    ["izan", "être"],
    ["egon", "être (situé)"],
    ["eduki", "avoir / tenir"],
    ["egin", "faire"],
    ["esan", "dire"],
    ["ikusi", "voir"],
    ["entzun", "entendre"],
    ["hitz egin", "parler"],
    ["jakin", "savoir"],
    ["nahi (izan)", "vouloir"],
    ["lo egin", "dormir"],
    ["irakurri", "lire"],
    ["idatzi", "écrire"],
    ["lan egin", "travailler"],
    ["bizi (izan)", "vivre"],
    ["on", "bon"],
    ["txar", "mauvais"],
    ["handi", "grand"],
    ["txiki", "petit"],
    ["bero", "chaud"],
    ["hotz", "froid"],
    ["polit", "joli"],
    ["eder", "beau"],
    ["azkar", "rapide"],
    ["motel", "lent"],
    ["berri", "nouveau"],
    ["zahar", "vieux"],
    ["zer?", "quoi ?"],
    ["nor?", "qui ?"],
    ["non?", "où ?"],
    ["noiz?", "quand ?"],
    ["nola?", "comment ?"],
    ["zenbat?", "combien ?"],
    ["zergatik?", "pourquoi ?"],
    ["eta", "et"],
    ["baina", "mais"],
    ["edo", "ou"],
    ["gaur", "aujourd'hui"],
    ["bihar", "demain"],
    ["orain", "maintenant"]
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

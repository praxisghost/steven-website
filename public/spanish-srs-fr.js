/* spanish-srs-fr.js — Español for French speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 104 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'es-fr';
  const WORDS = [
    ["hola", "salut / bonjour"],
    ["buenos días", "bonjour (le matin)"],
    ["buenas tardes", "bonjour (l'après-midi)"],
    ["buenas noches", "bonsoir / bonne nuit"],
    ["¿cómo estás?", "comment vas-tu ?"],
    ["bien", "bien"],
    ["gracias", "merci"],
    ["muchas gracias", "merci beaucoup"],
    ["de nada", "de rien"],
    ["sí", "oui"],
    ["no", "non"],
    ["por favor", "s'il te plaît"],
    ["perdón / lo siento", "pardon / je suis désolé"],
    ["adiós", "au revoir"],
    ["hasta luego", "à plus tard"],
    ["¿cómo te llamas?", "comment t'appelles-tu ?"],
    ["me llamo ...", "je m'appelle ..."],
    ["yo", "je / moi"],
    ["tú", "tu"],
    ["él / ella", "il / elle"],
    ["nosotros", "nous"],
    ["vosotros", "vous (familier, Espagne)"],
    ["ellos / ellas", "ils / elles"],
    ["usted", "vous (formel)"],
    ["hombre", "homme"],
    ["mujer", "femme"],
    ["niño / niña", "garçon / fille"],
    ["madre", "mère"],
    ["padre", "père"],
    ["hijo / hija", "fils / fille"],
    ["hermano / hermana", "frère / sœur"],
    ["amigo / amiga", "ami / amie"],
    ["familia", "famille"],
    ["agua", "eau"],
    ["comer", "manger"],
    ["beber", "boire"],
    ["pan", "pain"],
    ["vino", "vin"],
    ["queso", "fromage"],
    ["pescado", "poisson (à manger)"],
    ["carne", "viande"],
    ["leche", "lait"],
    ["café", "café"],
    ["azúcar", "sucre"],
    ["sal", "sel"],
    ["uno", "un"],
    ["dos", "deux"],
    ["tres", "trois"],
    ["cuatro", "quatre"],
    ["cinco", "cinq"],
    ["seis", "six"],
    ["siete", "sept"],
    ["ocho", "huit"],
    ["nueve", "neuf"],
    ["diez", "dix"],
    ["veinte", "vingt"],
    ["cien", "cent"],
    ["mil", "mille"],
    ["ir", "aller"],
    ["venir", "venir"],
    ["ser", "être (identité)"],
    ["estar", "être (état, lieu)"],
    ["tener", "avoir"],
    ["hacer", "faire"],
    ["decir", "dire"],
    ["ver", "voir"],
    ["oír", "entendre"],
    ["hablar", "parler"],
    ["saber", "savoir"],
    ["querer", "vouloir / aimer"],
    ["poder", "pouvoir"],
    ["dormir", "dormir"],
    ["leer", "lire"],
    ["escribir", "écrire"],
    ["trabajar", "travailler"],
    ["vivir", "vivre"],
    ["bueno", "bon"],
    ["malo", "mauvais"],
    ["grande", "grand"],
    ["pequeño", "petit"],
    ["caliente", "chaud"],
    ["frío", "froid"],
    ["bonito", "joli / beau"],
    ["rápido", "rapide"],
    ["despacio", "lentement"],
    ["nuevo", "nouveau / neuf"],
    ["viejo", "vieux"],
    ["¿qué?", "quoi ? / quel ?"],
    ["¿quién?", "qui ?"],
    ["¿dónde?", "où ?"],
    ["¿cuándo?", "quand ?"],
    ["¿cómo?", "comment ?"],
    ["¿cuánto?", "combien ?"],
    ["¿por qué?", "pourquoi ?"],
    ["y", "et"],
    ["con", "avec"],
    ["pero", "mais"],
    ["porque", "parce que"],
    ["hoy", "aujourd'hui"],
    ["mañana", "demain / matin"],
    ["ayer", "hier"],
    ["ahora", "maintenant"],
    ["salir (faux ami)", "sortir (≠ salir)"],
    ["largo (faux ami)", "long (≠ large = ancho)"]
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

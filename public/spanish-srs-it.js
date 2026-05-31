/* spanish-srs-it.js — Español for Italian speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 104 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'es-it';
  const WORDS = [
    ["hola", "ciao"],
    ["buenos días", "buongiorno"],
    ["buenas tardes", "buon pomeriggio"],
    ["buenas noches", "buonanotte"],
    ["¿cómo estás?", "come stai?"],
    ["bien", "bene"],
    ["gracias", "grazie"],
    ["muchas gracias", "grazie mille"],
    ["de nada", "prego"],
    ["sí", "sì"],
    ["no", "no"],
    ["por favor", "per favore"],
    ["perdón / lo siento", "scusa / mi dispiace"],
    ["adiós", "arrivederci / addio"],
    ["hasta luego", "a dopo"],
    ["¿cómo te llamas?", "come ti chiami?"],
    ["me llamo ...", "mi chiamo ..."],
    ["yo", "io"],
    ["tú", "tu"],
    ["él / ella", "lui / lei"],
    ["nosotros", "noi"],
    ["vosotros", "voi (Spagna)"],
    ["ellos / ellas", "loro"],
    ["usted", "Lei (formale)"],
    ["hombre", "uomo"],
    ["mujer", "donna"],
    ["niño / niña", "bambino / bambina"],
    ["madre", "madre"],
    ["padre", "padre"],
    ["hijo / hija", "figlio / figlia"],
    ["hermano / hermana", "fratello / sorella"],
    ["amigo / amiga", "amico / amica"],
    ["familia", "famiglia"],
    ["agua", "acqua"],
    ["comer", "mangiare"],
    ["beber", "bere"],
    ["pan", "pane"],
    ["vino", "vino"],
    ["queso", "formaggio"],
    ["pescado", "pesce (da mangiare)"],
    ["carne", "carne"],
    ["leche", "latte"],
    ["café", "caffè"],
    ["azúcar", "zucchero"],
    ["sal", "sale"],
    ["uno", "uno"],
    ["dos", "due"],
    ["tres", "tre"],
    ["cuatro", "quattro"],
    ["cinco", "cinque"],
    ["seis", "sei"],
    ["siete", "sette"],
    ["ocho", "otto"],
    ["nueve", "nove"],
    ["diez", "dieci"],
    ["veinte", "venti"],
    ["cien", "cento"],
    ["mil", "mille"],
    ["ir", "andare"],
    ["venir", "venire"],
    ["ser", "essere (identità)"],
    ["estar", "essere / stare (stato, luogo)"],
    ["tener", "avere"],
    ["hacer", "fare"],
    ["decir", "dire"],
    ["ver", "vedere"],
    ["oír", "sentire / udire"],
    ["hablar", "parlare"],
    ["saber", "sapere"],
    ["querer", "volere / amare"],
    ["poder", "potere"],
    ["dormir", "dormire"],
    ["leer", "leggere"],
    ["escribir", "scrivere"],
    ["trabajar", "lavorare"],
    ["vivir", "vivere"],
    ["bueno", "buono"],
    ["malo", "cattivo"],
    ["grande", "grande"],
    ["pequeño", "piccolo"],
    ["caliente", "caldo"],
    ["frío", "freddo"],
    ["bonito", "carino / bello"],
    ["rápido", "veloce"],
    ["despacio", "piano / lentamente"],
    ["nuevo", "nuovo"],
    ["viejo", "vecchio"],
    ["¿qué?", "che cosa?"],
    ["¿quién?", "chi?"],
    ["¿dónde?", "dove?"],
    ["¿cuándo?", "quando?"],
    ["¿cómo?", "come?"],
    ["¿cuánto?", "quanto?"],
    ["¿por qué?", "perché?"],
    ["y", "e"],
    ["con", "con"],
    ["pero", "ma"],
    ["porque", "perché (causa)"],
    ["hoy", "oggi"],
    ["mañana", "domani / mattina"],
    ["ayer", "ieri"],
    ["ahora", "adesso / ora"],
    ["burro (falso amico)", "asino (NON burro!)"],
    ["salir (falso amico)", "uscire (NON salire)"]
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

/* catalan-srs-es.js — Català for Spanish speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 101 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'ca-es';
  const WORDS = [
    ["hola", "hola"],
    ["bon dia", "buenos días"],
    ["bona tarda", "buenas tardes"],
    ["bona nit", "buenas noches"],
    ["com estàs?", "¿cómo estás?"],
    ["(molt) bé", "(muy) bien"],
    ["gràcies", "gracias"],
    ["moltes gràcies", "muchas gracias"],
    ["de res", "de nada"],
    ["sí", "sí"],
    ["no", "no"],
    ["si us plau", "por favor"],
    ["perdó / ho sento", "perdón / lo siento"],
    ["adéu", "adiós"],
    ["fins aviat", "hasta pronto"],
    ["com et dius?", "¿cómo te llamas?"],
    ["em dic ...", "me llamo ..."],
    ["jo", "yo"],
    ["tu", "tú"],
    ["ell / ella", "él / ella"],
    ["nosaltres", "nosotros"],
    ["vosaltres", "vosotros"],
    ["ells / elles", "ellos / ellas"],
    ["home", "hombre"],
    ["dona", "mujer"],
    ["nen / nena", "niño / niña"],
    ["mare", "madre"],
    ["pare", "padre"],
    ["fill / filla", "hijo / hija"],
    ["germà / germana", "hermano / hermana"],
    ["amic / amiga", "amigo / amiga"],
    ["família", "familia"],
    ["aigua", "agua"],
    ["menjar", "comer / comida"],
    ["beure", "beber"],
    ["pa", "pan"],
    ["vi", "vino"],
    ["formatge", "queso"],
    ["peix", "pez / pescado"],
    ["carn", "carne"],
    ["fruita", "fruta"],
    ["llet", "leche"],
    ["cafè", "café"],
    ["sucre", "azúcar"],
    ["sal", "sal"],
    ["un / una", "uno / una"],
    ["dos / dues", "dos"],
    ["tres", "tres"],
    ["quatre", "cuatro"],
    ["cinc", "cinco"],
    ["sis", "seis"],
    ["set", "siete"],
    ["vuit", "ocho"],
    ["nou", "nueve"],
    ["deu", "diez"],
    ["vint", "veinte"],
    ["cent", "cien"],
    ["mil", "mil"],
    ["anar", "ir"],
    ["venir", "venir"],
    ["ser", "ser"],
    ["estar", "estar"],
    ["tenir", "tener"],
    ["fer", "hacer"],
    ["dir", "decir"],
    ["veure", "ver"],
    ["sentir", "oír / sentir"],
    ["parlar", "hablar"],
    ["saber", "saber"],
    ["voler", "querer"],
    ["poder", "poder"],
    ["dormir", "dormir"],
    ["llegir", "leer"],
    ["escriure", "escribir"],
    ["treballar", "trabajar"],
    ["viure", "vivir"],
    ["bo / bona", "bueno / buena"],
    ["dolent", "malo"],
    ["gran", "grande"],
    ["petit", "pequeño"],
    ["calent", "caliente"],
    ["fred", "frío"],
    ["bonic", "bonito"],
    ["ràpid", "rápido"],
    ["a poc a poc", "despacio"],
    ["nou / nova", "nuevo / nueva"],
    ["vell", "viejo"],
    ["què?", "¿qué?"],
    ["qui?", "¿quién?"],
    ["on?", "¿dónde?"],
    ["quan?", "¿cuándo?"],
    ["com?", "¿cómo?"],
    ["quant?", "¿cuánto?"],
    ["per què?", "¿por qué?"],
    ["i", "y"],
    ["amb", "con"],
    ["però", "pero"],
    ["perquè", "porque"],
    ["avui", "hoy"],
    ["demà", "mañana"],
    ["ara", "ahora"]
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

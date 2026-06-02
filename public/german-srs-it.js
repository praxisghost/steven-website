/* german-srs-it.js — Deutsch for Italian speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 105 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'de-it';
  const WORDS = [
    ["Hallo", "Ciao"],
    ["Guten Morgen", "Buongiorno"],
    ["Guten Tag", "Salve / Buon pomeriggio"],
    ["Guten Abend", "Buonasera"],
    ["Auf Wiedersehen", "Arrivederci"],
    ["Tschüss", "Ciao / A presto"],
    ["Wie geht es Ihnen?", "Come sta? (formale)"],
    ["Wie geht's?", "Come stai?"],
    ["Danke schön", "Grazie mille"],
    ["Bitte", "Prego / Per favore"],
    ["Entschuldigung", "Scusa / Mi scusi"],
    ["ja", "sì"],
    ["nein", "no"],
    ["Wie heißen Sie?", "Come si chiama?"],
    ["Ich heiße …", "Mi chiamo …"],
    ["ich", "io"],
    ["du", "tu"],
    ["er / sie", "lui / lei"],
    ["wir", "noi"],
    ["ihr", "voi"],
    ["Sie", "Lei (formale)"],
    ["sie (Pl.)", "loro"],
    ["die Mutter", "la madre"],
    ["der Vater", "il padre"],
    ["der Sohn / die Tochter", "il figlio / la figlia"],
    ["der Bruder / die Schwester", "il fratello / la sorella"],
    ["der Freund / die Freundin", "l'amico / l'amica"],
    ["die Familie", "la famiglia"],
    ["das Wasser", "l'acqua"],
    ["essen", "mangiare"],
    ["trinken", "bere"],
    ["das Brot", "il pane"],
    ["der Wein", "il vino"],
    ["der Käse", "il formaggio"],
    ["das Fleisch", "la carne"],
    ["der Fisch", "il pesce"],
    ["die Milch", "il latte"],
    ["der Kaffee", "il caffè"],
    ["der Reis", "il riso"],
    ["das Obst", "la frutta"],
    ["eins", "uno"],
    ["zwei", "due"],
    ["drei", "tre"],
    ["vier", "quattro"],
    ["fünf", "cinque"],
    ["sechs", "sei"],
    ["sieben", "sette"],
    ["acht", "otto"],
    ["neun", "nove"],
    ["zehn", "dieci"],
    ["zwanzig", "venti"],
    ["hundert", "cento"],
    ["tausend", "mille"],
    ["gehen", "andare"],
    ["kommen", "venire"],
    ["sein", "essere"],
    ["haben", "avere"],
    ["werden", "diventare"],
    ["machen", "fare"],
    ["sagen", "dire"],
    ["sehen", "vedere"],
    ["hören", "sentire / ascoltare"],
    ["sprechen", "parlare"],
    ["wissen", "sapere"],
    ["kennen", "conoscere"],
    ["wollen", "volere"],
    ["können", "potere"],
    ["müssen", "dovere"],
    ["schlafen", "dormire"],
    ["lesen", "leggere"],
    ["schreiben", "scrivere"],
    ["arbeiten", "lavorare"],
    ["wohnen", "abitare / vivere"],
    ["kaufen", "comprare"],
    ["verstehen", "capire"],
    ["gut", "buono / buona"],
    ["schlecht", "cattivo / brutto"],
    ["groß", "grande"],
    ["klein", "piccolo / piccola"],
    ["heiß", "caldo / calda"],
    ["kalt", "freddo / fredda"],
    ["schön", "bello / bella"],
    ["schnell", "veloce / rapido"],
    ["neu", "nuovo / nuova"],
    ["alt", "vecchio / anziano"],
    ["Was?", "Cosa? / Che cosa?"],
    ["Wer?", "Chi?"],
    ["Wo?", "Dove?"],
    ["Wann?", "Quando?"],
    ["Wie?", "Come?"],
    ["Wie viel?", "Quanto?"],
    ["Warum?", "Perché?"],
    ["und", "e"],
    ["mit", "con"],
    ["aber", "ma / però"],
    ["weil", "perché (causale)"],
    ["oder", "o / oppure"],
    ["heute", "oggi"],
    ["morgen", "domani"],
    ["gestern", "ieri"],
    ["jetzt", "adesso / ora"],
    ["das Buch", "il libro"],
    ["das Haus", "la casa"],
    ["das Wetter", "il tempo (atmosferico)"],
    ["Wie viel kostet das?", "Quanto costa?"]
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

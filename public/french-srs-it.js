/* french-srs-it.js — Français for Italian speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 105 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'fr-it';
  const WORDS = [
    ["bonjour", "buongiorno / buona giornata"],
    ["bonsoir", "buona sera"],
    ["bonne nuit", "buona notte"],
    ["salut", "ciao (informale)"],
    ["comment allez-vous ?", "come sta? / come stai?"],
    ["ça va ?", "come va?"],
    ["ça va bien", "va bene / sto bene"],
    ["merci", "grazie"],
    ["merci beaucoup", "grazie mille / grazie tante"],
    ["de rien", "prego"],
    ["s'il vous plaît", "per favore"],
    ["pardon / excusez-moi", "scusi / mi scusi"],
    ["oui", "sì"],
    ["non", "no"],
    ["au revoir", "arrivederci"],
    ["à bientôt", "a presto"],
    ["je m'appelle…", "mi chiamo…"],
    ["comment vous appelez-vous ?", "come si chiama?"],
    ["je", "io"],
    ["tu", "tu (informale)"],
    ["il / elle", "lui / lei"],
    ["nous", "noi"],
    ["vous", "voi / Lei (formale)"],
    ["ils / elles", "loro"],
    ["on", "si (pronome impersonale; = noi informale)"],
    ["l'homme", "l'uomo"],
    ["la femme", "la donna"],
    ["l'enfant", "il bambino / la bambina"],
    ["l'ami / l'amie", "l'amico / l'amica"],
    ["la mère", "la madre"],
    ["le père", "il padre"],
    ["le fils", "il figlio"],
    ["la fille", "la figlia / la ragazza"],
    ["le frère", "il fratello"],
    ["la sœur", "la sorella"],
    ["la famille", "la famiglia"],
    ["la maison", "la casa"],
    ["la ville", "la città"],
    ["la rue", "la via / la strada"],
    ["le pays", "il paese / il Paese"],
    ["le monde", "il mondo"],
    ["l'eau (f)", "l'acqua"],
    ["le pain", "il pane"],
    ["le vin", "il vino"],
    ["le fromage", "il formaggio"],
    ["la viande", "la carne"],
    ["le poisson", "il pesce"],
    ["le café", "il caffè"],
    ["le lait", "il latte"],
    ["le sucre", "lo zucchero"],
    ["le sel", "il sale"],
    ["un / une", "uno / una"],
    ["deux", "due"],
    ["trois", "tre"],
    ["quatre", "quattro"],
    ["cinq", "cinque"],
    ["six", "sei"],
    ["sept", "sette"],
    ["huit", "otto"],
    ["neuf", "nove"],
    ["dix", "dieci"],
    ["vingt", "venti"],
    ["cent", "cento"],
    ["être", "essere / stare"],
    ["avoir", "avere"],
    ["aller", "andare"],
    ["venir", "venire"],
    ["faire", "fare"],
    ["dire", "dire"],
    ["voir", "vedere"],
    ["savoir", "sapere"],
    ["pouvoir", "potere"],
    ["vouloir", "volere"],
    ["devoir", "dovere"],
    ["parler", "parlare"],
    ["manger", "mangiare"],
    ["boire", "bere"],
    ["dormir", "dormire"],
    ["lire", "leggere"],
    ["écrire", "scrivere"],
    ["travailler", "lavorare"],
    ["vivre", "vivere"],
    ["comprendre", "capire / comprendere"],
    ["prendre", "prendere"],
    ["bon / bonne", "buono / buona"],
    ["mauvais/e", "cattivo / cattiva; brutto / brutta"],
    ["grand/e", "grande"],
    ["petit/e", "piccolo / piccola"],
    ["nouveau / nouvelle", "nuovo / nuova"],
    ["vieux / vieille", "vecchio / vecchia"],
    ["beau / belle", "bello / bella"],
    ["chaud/e", "caldo / calda"],
    ["froid/e", "freddo / fredda"],
    ["rapide", "rapido / rapida; veloce"],
    ["quoi ?", "cosa? / che?"],
    ["qui ?", "chi?"],
    ["où ?", "dove?"],
    ["quand ?", "quando?"],
    ["comment ?", "come?"],
    ["combien ?", "quanto?"],
    ["pourquoi ?", "perché?"],
    ["et", "e"],
    ["mais", "ma"],
    ["parce que", "perché"],
    ["avec", "con"]
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

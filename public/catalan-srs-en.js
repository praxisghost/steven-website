/* catalan-srs-en.js — Catalan for English speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 101 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'ca-en';
  const WORDS = [
    ["hola", "hello"],
    ["bon dia", "good morning / good day"],
    ["bona tarda", "good afternoon"],
    ["bona nit", "good night"],
    ["com estàs?", "how are you?"],
    ["(molt) bé", "(very) well"],
    ["gràcies", "thank you"],
    ["moltes gràcies", "thank you very much"],
    ["de res", "you're welcome"],
    ["sí", "yes"],
    ["no", "no"],
    ["si us plau", "please"],
    ["perdó / ho sento", "sorry"],
    ["adéu", "goodbye"],
    ["fins aviat", "see you soon"],
    ["com et dius?", "what's your name?"],
    ["em dic ...", "my name is ..."],
    ["jo", "I"],
    ["tu", "you (sing.)"],
    ["ell / ella", "he / she"],
    ["nosaltres", "we"],
    ["vosaltres", "you (plural)"],
    ["ells / elles", "they"],
    ["home", "man"],
    ["dona", "woman"],
    ["nen / nena", "boy / girl"],
    ["mare", "mother"],
    ["pare", "father"],
    ["fill / filla", "son / daughter"],
    ["germà / germana", "brother / sister"],
    ["amic / amiga", "friend"],
    ["família", "family"],
    ["aigua", "water"],
    ["menjar", "to eat / food"],
    ["beure", "to drink"],
    ["pa", "bread"],
    ["vi", "wine"],
    ["formatge", "cheese"],
    ["peix", "fish"],
    ["carn", "meat"],
    ["fruita", "fruit"],
    ["llet", "milk"],
    ["cafè", "coffee"],
    ["sucre", "sugar"],
    ["sal", "salt"],
    ["un / una", "one / a"],
    ["dos / dues", "two"],
    ["tres", "three"],
    ["quatre", "four"],
    ["cinc", "five"],
    ["sis", "six"],
    ["set", "seven"],
    ["vuit", "eight"],
    ["nou", "nine"],
    ["deu", "ten"],
    ["vint", "twenty"],
    ["cent", "hundred"],
    ["mil", "thousand"],
    ["anar", "to go"],
    ["venir", "to come"],
    ["ser", "to be (identity)"],
    ["estar", "to be (state / location)"],
    ["tenir", "to have"],
    ["fer", "to do / make"],
    ["dir", "to say"],
    ["veure", "to see"],
    ["sentir", "to hear / feel"],
    ["parlar", "to speak"],
    ["saber", "to know (facts)"],
    ["voler", "to want"],
    ["poder", "to be able / can"],
    ["dormir", "to sleep"],
    ["llegir", "to read"],
    ["escriure", "to write"],
    ["treballar", "to work"],
    ["viure", "to live"],
    ["bo / bona", "good"],
    ["dolent", "bad"],
    ["gran", "big"],
    ["petit", "small"],
    ["calent", "hot"],
    ["fred", "cold"],
    ["bonic", "beautiful"],
    ["ràpid", "fast"],
    ["a poc a poc", "slowly"],
    ["nou / nova", "new"],
    ["vell", "old"],
    ["què?", "what?"],
    ["qui?", "who?"],
    ["on?", "where?"],
    ["quan?", "when?"],
    ["com?", "how?"],
    ["quant?", "how much?"],
    ["per què?", "why?"],
    ["i", "and"],
    ["amb", "with"],
    ["però", "but"],
    ["perquè", "because"],
    ["avui", "today"],
    ["demà", "tomorrow"],
    ["ara", "now"]
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

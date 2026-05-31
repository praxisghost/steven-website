/* wolof-srs-en.js — Wolof for English speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 101 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'wo-en';
  const WORDS = [
    ["salaamaalekum", "hello (peace be upon you)"],
    ["maalekum salaam", "and peace upon you (reply)"],
    ["na nga def?", "how are you? (sing.)"],
    ["maa ngi fi (rekk)", "I'm fine (here only)"],
    ["jamm rekk", "peace only (I'm well)"],
    ["naka nga tudd?", "what's your name?"],
    ["...maa ngi tudd", "my name is..."],
    ["jërejëf", "thank you"],
    ["ñoo ko bokk", "you're welcome (we share it)"],
    ["waaw", "yes"],
    ["déedéet", "no"],
    ["baal ma", "excuse me / sorry"],
    ["su la neexee", "please (if it pleases you)"],
    ["ba beneen (yoon)", "goodbye (until next time)"],
    ["ba ëllëg", "see you tomorrow"],
    ["man", "I / me"],
    ["yow", "you (sing.)"],
    ["moom", "he / she / it"],
    ["nun", "we / us"],
    ["yeen", "you (plural)"],
    ["ñoom", "they / them"],
    ["nit", "person"],
    ["nit ñi", "people"],
    ["góor", "man"],
    ["jigéen", "woman"],
    ["xale", "child"],
    ["yaay / ndey", "mother"],
    ["baay", "father"],
    ["mag", "elder / older sibling"],
    ["rakk", "younger sibling"],
    ["jabar", "wife"],
    ["jëkkër", "husband"],
    ["xarit", "friend"],
    ["waa kër ga", "the household / family"],
    ["ndox", "water"],
    ["lekk", "to eat / food"],
    ["ceeb", "rice"],
    ["ceebu jën", "rice and fish (national dish)"],
    ["jën", "fish"],
    ["yapp", "meat"],
    ["mburu", "bread"],
    ["meew", "milk"],
    ["ataaya", "Senegalese mint tea"],
    ["kafe", "coffee"],
    ["suukar", "sugar"],
    ["xorom", "salt"],
    ["benn", "one"],
    ["ñaar", "two"],
    ["ñett", "three"],
    ["ñeent", "four"],
    ["juróom", "five"],
    ["juróom benn", "six"],
    ["juróom ñaar", "seven"],
    ["juróom ñett", "eight"],
    ["juróom ñeent", "nine"],
    ["fukk", "ten"],
    ["téeméer", "hundred"],
    ["junni", "thousand"],
    ["dem", "to go"],
    ["ñów", "to come"],
    ["dox", "to walk"],
    ["togg", "to cook"],
    ["jënd", "to buy"],
    ["jaay", "to sell"],
    ["gis", "to see"],
    ["déglu", "to listen"],
    ["wax", "to speak / say"],
    ["xam", "to know"],
    ["bëgg", "to want / to love"],
    ["am", "to have"],
    ["nekk", "to be (located)"],
    ["jàng", "to study / read"],
    ["bind", "to write"],
    ["liggéey", "to work"],
    ["nelaw", "to sleep"],
    ["fey", "to pay"],
    ["jox", "to give"],
    ["def", "to do / make"],
    ["rafet", "beautiful / nice"],
    ["baax", "good"],
    ["bon", "bad"],
    ["tuuti", "small / a little"],
    ["bare", "many / a lot"],
    ["gaaw", "fast"],
    ["ndànk", "slowly / gently"],
    ["tàng", "hot"],
    ["sedd", "cold"],
    ["léegi", "now"],
    ["tey", "today"],
    ["suba", "tomorrow / morning"],
    ["démb", "yesterday"],
    ["guddi", "night"],
    ["dëkk", "town / village / country"],
    ["kër", "house / home"],
    ["marse", "market"],
    ["ekool", "school"],
    ["loppitaan", "hospital"],
    ["xaalis", "money"],
    ["jamm", "peace"],
    ["teranga", "hospitality"],
    ["lu tax?", "why?"]
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

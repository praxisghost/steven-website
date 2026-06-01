/* guarani-srs-en.js — Avañe'ẽ for English speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 70 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'gn-en';
  const WORDS = [
    ["mba'éichapa", "hello / how are you?"],
    ["iporã", "good / fine"],
    ["ha nde?", "and you?"],
    ["mba'éichapa neko'ẽ", "good morning"],
    ["ka'aru porã", "good afternoon"],
    ["pyhare porã", "good night"],
    ["aguyje", "thank you"],
    ["aguyjevete", "thank you very much"],
    ["heẽ", "yes"],
    ["nahániri", "no"],
    ["ikatu", "it's possible / ok"],
    ["jajotopata", "see you later"],
    ["eguahẽ porãite", "welcome"],
    ["mba'e nde réra?", "what's your name?"],
    ["che réra ...", "my name is ..."],
    ["che", "I"],
    ["nde", "you"],
    ["ha'e", "he / she"],
    ["ñande", "we (including you)"],
    ["ore", "we (excluding you)"],
    ["peẽ", "you (plural)"],
    ["ha'ekuéra", "they"],
    ["kuimba'e", "man"],
    ["kuña", "woman"],
    ["mitã", "child"],
    ["sy", "mother"],
    ["túva", "father"],
    ["ta'ýra", "son (of a man)"],
    ["tajýra", "daughter (of a man)"],
    ["tyke'ýra", "older brother"],
    ["irũ", "friend / companion"],
    ["y", "water"],
    ["karu", "to eat"],
    ["mbujape", "bread"],
    ["so'o", "meat"],
    ["pira", "fish"],
    ["kamby", "milk"],
    ["kafe", "coffee"],
    ["juky", "salt"],
    ["asuka", "sugar"],
    ["ka'a", "yerba mate"],
    ["tereré", "cold mate drink"],
    ["peteĩ", "one"],
    ["mokõi", "two"],
    ["mbohapy", "three"],
    ["irundy", "four"],
    ["po", "five"],
    ["pa", "ten"],
    ["guata", "to walk"],
    ["ho", "to go"],
    ["ju", "to come"],
    ["ke", "to sleep"],
    ["hecha", "to see"],
    ["hendu", "to hear / listen"],
    ["ñe'ẽ", "to speak / language"],
    ["kuaa", "to know"],
    ["porã", "beautiful / good"],
    ["vai", "ugly / bad"],
    ["guasu", "big"],
    ["michĩ", "small"],
    ["haku", "hot"],
    ["ro'y", "cold"],
    ["mba'e?", "what?"],
    ["máva?", "who?"],
    ["moõ?", "where?"],
    ["ára", "day"],
    ["óga", "house"],
    ["kuarahy", "sun"],
    ["jasy", "moon"],
    ["jagua", "dog"]
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

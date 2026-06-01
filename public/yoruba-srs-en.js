/* yoruba-srs-en.js — Yorùbá for English speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 62 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'yo-en';
  const WORDS = [
    ["báwo ni", "hello / how are you?"],
    ["ẹ n lẹ́", "hello (respectful)"],
    ["ẹ kú àárọ̀", "good morning"],
    ["ẹ kú ọ̀sán", "good afternoon"],
    ["ẹ kú alẹ́", "good evening"],
    ["ṣé dáadáa ni?", "are you well?"],
    ["mo wà dáadáa", "I'm fine"],
    ["ẹ ṣé", "thank you"],
    ["ẹ ṣé gan-an", "thank you very much"],
    ["jọ̀wọ́", "please"],
    ["bẹ́ẹ̀ ni", "yes"],
    ["bẹ́ẹ̀ kọ́", "no"],
    ["mo dúpẹ́", "I'm grateful"],
    ["pẹ̀lẹ́", "sorry / take it easy"],
    ["ó dàbọ̀", "goodbye"],
    ["kí ni orúkọ rẹ?", "what is your name?"],
    ["orúkọ mi ni …", "my name is …"],
    ["ènìyàn", "person"],
    ["obìnrin", "woman"],
    ["ọkùnrin", "man"],
    ["ọmọ", "child"],
    ["bàbá", "father"],
    ["ìyá / màmá", "mother"],
    ["ọ̀rẹ́", "friend"],
    ["ilé", "house / home"],
    ["omi", "water"],
    ["oúnjẹ", "food"],
    ["ẹran", "meat"],
    ["búrẹ́dì", "bread"],
    ["wàrà", "milk"],
    ["owó", "money"],
    ["iṣẹ́", "work / job"],
    ["ilé-ìwé", "school"],
    ["ìwé", "book"],
    ["ọkọ̀ / mọ́tò", "car / vehicle"],
    ["ọjọ́", "day"],
    ["alẹ́ / òru", "night"],
    ["òní", "today"],
    ["ọ̀la", "tomorrow"],
    ["àná", "yesterday"],
    ["jẹun", "to eat"],
    ["mu", "to drink"],
    ["lọ", "to go"],
    ["wá", "to come"],
    ["fẹ́", "to want / love"],
    ["mọ̀", "to know"],
    ["sọ̀rọ̀", "to speak"],
    ["rí", "to see"],
    ["gbọ́", "to hear / understand"],
    ["kí ni?", "what?"],
    ["ta ni?", "who?"],
    ["níbo?", "where?"],
    ["ìgbà wo?", "when?"],
    ["kí ló dé?", "why?"],
    ["mélòó?", "how many?"],
    ["dáadáa", "good"],
    ["burúkú", "bad"],
    ["ńlá", "big"],
    ["kékeré", "small"],
    ["mo nífẹ̀ẹ́ rẹ", "I love you"],
    ["mi ò gbọ́", "I don't understand"],
    ["ṣé o ń sọ Gẹ̀ẹ́sì?", "do you speak English?"]
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

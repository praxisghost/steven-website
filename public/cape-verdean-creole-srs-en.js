/* cape-verdean-creole-srs-en.js — Kriolu for English speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 115 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'kea-en';
  const WORDS = [
    ["olá / oi", "hello"],
    ["bon dia", "good morning"],
    ["boa tardi", "good afternoon"],
    ["boa noti", "good night"],
    ["modi ki bu sta?", "how are you?"],
    ["tudu dretu?", "is everything okay?"],
    ["N sta dretu", "I'm fine"],
    ["tudu bon", "all good"],
    ["obrigadu / obrigada", "thank you (m/f)"],
    ["sin", "yes"],
    ["nau", "no"],
    ["pur favor", "please"],
    ["diskulpa", "sorry / excuse me"],
    ["di nada", "you're welcome"],
    ["te logu", "see you later"],
    ["te dipôs", "see you afterwards"],
    ["bon-vindu", "welcome"],
    ["modi ki bu nomi?", "what's your name?"],
    ["nha nomi e ...", "my name is ..."],
    ["N / mi", "I / me"],
    ["bu / bo", "you (sing.)"],
    ["el", "he / she"],
    ["nu / nos", "we"],
    ["nhos", "you (plural)"],
    ["es", "they"],
    ["ómi", "man"],
    ["mudjer", "woman"],
    ["mininu", "child"],
    ["mai", "mother"],
    ["pai", "father"],
    ["fidju", "son"],
    ["fidja", "daughter"],
    ["irmon", "brother"],
    ["irma", "sister"],
    ["avó", "grandparent"],
    ["amigu", "friend"],
    ["família", "family"],
    ["agu", "water"],
    ["kume", "to eat"],
    ["kumida", "food"],
    ["pon", "bread"],
    ["pexi", "fish"],
    ["karni", "meat"],
    ["arrós", "rice"],
    ["leti", "milk"],
    ["kafé", "coffee"],
    ["asúkar", "sugar"],
    ["sal", "salt"],
    ["katchupa", "cachupa (national dish)"],
    ["vinhu", "wine"],
    ["un", "one"],
    ["dôs", "two"],
    ["três", "three"],
    ["kuatu", "four"],
    ["sinku", "five"],
    ["sais", "six"],
    ["séti", "seven"],
    ["oitu", "eight"],
    ["nóvi", "nine"],
    ["dés", "ten"],
    ["vinti", "twenty"],
    ["sen", "hundred"],
    ["mil", "thousand"],
    ["sta", "to be (state)"],
    ["ten", "to have"],
    ["ba", "to go"],
    ["ben", "to come"],
    ["fla", "to say"],
    ["papia", "to speak"],
    ["odja", "to see"],
    ["obi", "to hear"],
    ["sabe", "to know"],
    ["kré", "to want"],
    ["pode", "to be able"],
    ["bebe", "to drink"],
    ["durmi", "to sleep"],
    ["lê", "to read"],
    ["skrebe", "to write"],
    ["trabadja", "to work"],
    ["mora", "to live"],
    ["gosta", "to like"],
    ["konxe", "to know (a person)"],
    ["da", "to give"],
    ["bon", "good"],
    ["mau", "bad"],
    ["grandi", "big"],
    ["pikinoti", "small"],
    ["kenti", "hot"],
    ["friu", "cold"],
    ["bunitu", "beautiful"],
    ["nobu", "new"],
    ["bedju", "old"],
    ["dretu", "right / fine"],
    ["kuzê?", "what?"],
    ["ken?", "who?"],
    ["undi?", "where?"],
    ["kandu?", "when?"],
    ["modi?", "how?"],
    ["kantu?", "how much?"],
    ["pamodi?", "why?"],
    ["i", "and"],
    ["ku", "with"],
    ["ma", "but"],
    ["oji", "today"],
    ["manhan", "tomorrow"],
    ["onti", "yesterday"],
    ["gósi", "now"],
    ["li", "here"],
    ["la", "there"],
    ["kasa", "house"],
    ["mar", "sea"],
    ["sol", "sun"],
    ["txuba", "rain"],
    ["sodadi", "longing / saudade"],
    ["morabeza", "Cape Verdean hospitality"]
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

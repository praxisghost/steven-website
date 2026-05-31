/* hawaiian-srs-en.js — Hawaiian for English speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 100 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'haw-en';
  const WORDS = [
    ["aloha", "hello / goodbye / love"],
    ["aloha kakahiaka", "good morning"],
    ["aloha ʻauinalā", "good afternoon"],
    ["aloha ahiahi", "good evening"],
    ["pehea ʻoe?", "how are you?"],
    ["maikaʻi (au)", "(I'm) good / fine"],
    ["mahalo", "thank you"],
    ["mahalo nui loa", "thank you very much"],
    ["ʻae", "yes"],
    ["ʻaʻole", "no"],
    ["e kala mai", "excuse me / sorry"],
    ["ʻoluʻolu", "please / pleasant"],
    ["a hui hou", "until we meet again (goodbye)"],
    ["ʻo wai kou inoa?", "what is your name?"],
    ["ʻo ... koʻu inoa", "my name is ..."],
    ["au / wau", "I / me"],
    ["ʻoe", "you (singular)"],
    ["ʻo ia", "he / she"],
    ["kāua", "we two (you and I)"],
    ["mākou", "we (excluding you)"],
    ["ʻoukou", "you (plural)"],
    ["lākou", "they"],
    ["kanaka", "person"],
    ["kānaka", "people"],
    ["kāne", "man / husband"],
    ["wahine", "woman / wife"],
    ["keiki", "child"],
    ["makuahine", "mother"],
    ["makua kāne", "father"],
    ["kupuna", "grandparent / elder"],
    ["ʻohana", "family"],
    ["hoaaloha", "friend"],
    ["wai", "fresh water"],
    ["kai", "sea / saltwater"],
    ["moana", "ocean"],
    ["ʻāina", "land"],
    ["lani", "sky / heaven"],
    ["lā", "sun / day"],
    ["mahina", "moon"],
    ["hōkū", "star"],
    ["makani", "wind"],
    ["ua", "rain"],
    ["pō", "night"],
    ["pua", "flower"],
    ["pōhaku", "rock / stone"],
    ["kumu", "teacher / source / tree"],
    ["ʻai", "to eat / food"],
    ["iʻa", "fish"],
    ["puaʻa", "pig"],
    ["kalo", "taro"],
    ["poi", "poi (pounded taro)"],
    ["niu", "coconut"],
    ["meaʻai", "food"],
    ["inu", "to drink"],
    ["ʻekahi", "one"],
    ["ʻelua", "two"],
    ["ʻekolu", "three"],
    ["ʻehā", "four"],
    ["ʻelima", "five"],
    ["ʻeono", "six"],
    ["ʻehiku", "seven"],
    ["ʻewalu", "eight"],
    ["ʻeiwa", "nine"],
    ["ʻumi", "ten"],
    ["hele", "to go"],
    ["hele mai", "to come"],
    ["moe", "to sleep"],
    ["ʻike", "to see / know"],
    ["lohe", "to hear"],
    ["ʻōlelo", "to speak / language"],
    ["heluhelu", "to read"],
    ["kākau", "to write"],
    ["hana", "to do / make / work"],
    ["makemake", "to want / like"],
    ["noho", "to sit / stay / live"],
    ["kū", "to stand"],
    ["aʻo", "to learn / teach"],
    ["maikaʻi", "good"],
    ["ʻino", "bad"],
    ["nui", "big"],
    ["liʻiliʻi", "small"],
    ["wela", "hot"],
    ["anuanu", "cold"],
    ["nani", "beautiful"],
    ["wikiwiki", "fast / quick"],
    ["lōʻihi", "long / tall"],
    ["aha?", "what?"],
    ["ʻo wai?", "who?"],
    ["hea?", "where? / which?"],
    ["ʻehia?", "how many?"],
    ["pehea?", "how?"],
    ["no ke aha?", "why?"],
    ["a", "and"],
    ["me", "with"],
    ["akā", "but"],
    ["mauka", "toward the mountains"],
    ["makai", "toward the sea"],
    ["pono", "right / balance / proper"],
    ["mana", "spiritual power"],
    ["kapu", "sacred / forbidden"]
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

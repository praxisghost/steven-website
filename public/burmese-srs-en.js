/* burmese-srs-en.js — မြန်မာ (Burmese) for English speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 62 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'my-en';
  const WORDS = [
    ["မင်္ဂလာပါ (mingalaba)", "hello / greetings"],
    ["နေကောင်းလား (nei kaún lá)", "how are you?"],
    ["နေကောင်းပါတယ် (nei kaún ba deh)", "I'm fine"],
    ["ကျေးဇူးတင်ပါတယ် (kyeizú tin ba deh)", "thank you"],
    ["ရပါတယ် (ya ba deh)", "you're welcome / it's okay"],
    ["ဟုတ်ကဲ့ (houk kéh)", "yes"],
    ["မဟုတ်ဘူး (ma houk bú)", "no"],
    ["ကျေးဇူးပြု၍ (kyeizú pyú ywei)", "please"],
    ["တောင်းပန်ပါတယ် (taún ban ba deh)", "sorry"],
    ["ခွင့်ပြုပါ (khwin pyú ba)", "excuse me"],
    ["သွားတော့မယ် (thwá daw meh)", "goodbye (I'm off)"],
    ["နာမည် ဘယ်လို ခေါ်လဲ (nami beh lo khaw léh)", "what's your name?"],
    ["ကျွန်တော် (kyundaw)", "I (male speaker)"],
    ["ကျွန်မ (kyamá)", "I (female speaker)"],
    ["သင် / ခင်ဗျား (thin / khamyá)", "you"],
    ["သူ (thu)", "he / she"],
    ["လူ (lu)", "person"],
    ["အမျိုးသမီး (amyó-thamí)", "woman"],
    ["အမျိုးသား (amyó-thá)", "man"],
    ["ကလေး (khalé)", "child"],
    ["အဖေ (aphei)", "father"],
    ["အမေ (amei)", "mother"],
    ["သူငယ်ချင်း (thangé-jín)", "friend"],
    ["အိမ် (ein)", "house / home"],
    ["ရေ (yei)", "water"],
    ["အစားအစာ (asá-asa)", "food"],
    ["ထမင်း (htamín)", "cooked rice / meal"],
    ["အသား (athá)", "meat"],
    ["နို့ (nó)", "milk"],
    ["လက်ဖက်ရည် (lahpet yei)", "tea"],
    ["ပိုက်ဆံ (paiksan)", "money"],
    ["အလုပ် (alouk)", "work / job"],
    ["ကျောင်း (kyaún)", "school"],
    ["စာအုပ် (saouk)", "book"],
    ["ကား (ká)", "car"],
    ["နေ့ (né)", "day"],
    ["ည (nya)", "night"],
    ["ဒီနေ့ (di né)", "today"],
    ["မနက်ဖြန် (manek hpyan)", "tomorrow"],
    ["မနေ့က (manei ga)", "yesterday"],
    ["စားသည် (sá)", "to eat"],
    ["သောက်သည် (thauk)", "to drink"],
    ["သွားသည် (thwá)", "to go"],
    ["လာသည် (la)", "to come"],
    ["လိုချင်သည် (lo jin)", "to want"],
    ["သိသည် (thi)", "to know"],
    ["ပြောသည် (pyaw)", "to speak"],
    ["မြင်သည် (myin)", "to see"],
    ["ကြားသည် (kyá)", "to hear"],
    ["ဘာ (ba)", "what"],
    ["ဘယ်သူ (beh thu)", "who"],
    ["ဘယ်မှာ (beh hma)", "where"],
    ["ဘယ်တော့ (beh daw)", "when"],
    ["ဘာကြောင့် (ba kyaún)", "why"],
    ["ဘယ်လောက် (beh lauk)", "how much / how many"],
    ["ကောင်းသည် (kaún)", "good"],
    ["ဆိုးသည် (só)", "bad"],
    ["ကြီးသည် (kyí)", "big"],
    ["သေးသည် (thé)", "small"],
    ["ချစ်တယ် (chit teh)", "(I) love (you)"],
    ["နားမလည်ဘူး (ná ma leh bú)", "I don't understand"],
    ["အင်္ဂလိပ်စကား ပြောတတ်လား (ingaleik zaga pyaw tat lá)", "do you speak English?"]
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

/* bengali-srs-en.js — বাংলা for English speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 82 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'bn-en';
  const WORDS = [
    ["নমস্কার (nômoshkar)", "hello"],
    ["আসসালামু আলাইকুম (assalamu alaikum)", "hello (Muslim greeting)"],
    ["আপনি কেমন আছেন? (apni kemon achhen?)", "how are you? (formal)"],
    ["আমি ভালো আছি (ami bhalo achhi)", "I'm fine"],
    ["ধন্যবাদ (dhonnobad)", "thank you"],
    ["দয়া করে (doya kore)", "please"],
    ["হ্যাঁ (hyaen)", "yes"],
    ["না (na)", "no"],
    ["মাফ করবেন (maf korben)", "excuse me / sorry"],
    ["বিদায় (biday)", "goodbye"],
    ["আপনার নাম কী? (apnar nam ki?)", "what's your name?"],
    ["আমার নাম ... (amar nam ...)", "my name is ..."],
    ["আমি (ami)", "I"],
    ["তুমি (tumi)", "you (familiar)"],
    ["আপনি (apni)", "you (formal)"],
    ["সে (she)", "he / she"],
    ["আমরা (amra)", "we"],
    ["তারা (tara)", "they"],
    ["মানুষ (manush)", "person / human"],
    ["পুরুষ (purush)", "man"],
    ["মহিলা (mohila)", "woman"],
    ["ছেলে (chhele)", "boy / son"],
    ["মেয়ে (meye)", "girl / daughter"],
    ["মা (ma)", "mother"],
    ["বাবা (baba)", "father"],
    ["ভাই (bhai)", "brother"],
    ["বোন (bon)", "sister"],
    ["বন্ধু (bondhu)", "friend"],
    ["পরিবার (poribar)", "family"],
    ["জল / পানি (jol / pani)", "water"],
    ["খাবার (khabar)", "food"],
    ["ভাত (bhat)", "cooked rice"],
    ["রুটি (ruti)", "bread"],
    ["দুধ (dudh)", "milk"],
    ["চা (cha)", "tea"],
    ["লবণ (lobon)", "salt"],
    ["চিনি (chini)", "sugar"],
    ["এক (êk)", "one"],
    ["দুই (dui)", "two"],
    ["তিন (tin)", "three"],
    ["চার (char)", "four"],
    ["পাঁচ (pãch)", "five"],
    ["ছয় (chhoy)", "six"],
    ["সাত (sat)", "seven"],
    ["আট (aṭ)", "eight"],
    ["নয় (noy)", "nine"],
    ["দশ (dôsh)", "ten"],
    ["একশো (êksho)", "hundred"],
    ["হাজার (hajar)", "thousand"],
    ["যাওয়া (jaoya)", "to go"],
    ["আসা (asha)", "to come"],
    ["হওয়া (hôwa)", "to be"],
    ["করা (kôra)", "to do / make"],
    ["দেখা (dekha)", "to see"],
    ["শোনা (shona)", "to hear"],
    ["বলা (bôla)", "to speak / say"],
    ["খাওয়া (khaoya)", "to eat"],
    ["ঘুমানো (ghumano)", "to sleep"],
    ["পড়া (pôra)", "to read / study"],
    ["লেখা (lekha)", "to write"],
    ["বোঝা (bojha)", "to understand"],
    ["চাওয়া (chaoya)", "to want"],
    ["ভালো (bhalo)", "good"],
    ["খারাপ (kharap)", "bad"],
    ["বড় (bôro)", "big"],
    ["ছোট (chhoṭo)", "small"],
    ["গরম (gôrom)", "hot"],
    ["ঠান্ডা (ṭhanḍa)", "cold"],
    ["নতুন (notun)", "new"],
    ["পুরনো (purono)", "old"],
    ["কী? (ki?)", "what?"],
    ["কে? (ke?)", "who?"],
    ["কোথায়? (kothay?)", "where?"],
    ["কখন? (kôkhon?)", "when?"],
    ["কেন? (keno?)", "why?"],
    ["কীভাবে? (kibhabe?)", "how?"],
    ["এবং (êbong)", "and"],
    ["কিন্তু (kintu)", "but"],
    ["আজ (aj)", "today"],
    ["কাল (kal)", "tomorrow / yesterday"],
    ["এখন (êkhon)", "now"],
    ["বাড়ি (bari)", "house / home"]
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

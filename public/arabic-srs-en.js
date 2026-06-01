/* arabic-srs-en.js — العربية for English speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 89 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'ar-en';
  const WORDS = [
    ["السلام عليكم (as-salāmu ʿalaykum)", "hello (peace be upon you)"],
    ["وعليكم السلام (wa ʿalaykum as-salām)", "and upon you peace (reply)"],
    ["مرحبا (marḥaban)", "hello / welcome"],
    ["كيف حالك؟ (kayfa ḥāluka?)", "how are you?"],
    ["أنا بخير (anā bi-khayr)", "I'm fine"],
    ["شكرا (shukran)", "thank you"],
    ["عفوا (ʿafwan)", "you're welcome / excuse me"],
    ["من فضلك (min faḍlik)", "please"],
    ["نعم (naʿam)", "yes"],
    ["لا (lā)", "no"],
    ["آسف (āsif)", "sorry"],
    ["مع السلامة (maʿa as-salāma)", "goodbye"],
    ["ما اسمك؟ (mā ismuka?)", "what's your name?"],
    ["اسمي ... (ismī ...)", "my name is ..."],
    ["أنا (anā)", "I"],
    ["أنت (anta / anti)", "you"],
    ["هو (huwa)", "he"],
    ["هي (hiya)", "she"],
    ["نحن (naḥnu)", "we"],
    ["هم (hum)", "they"],
    ["رجل (rajul)", "man"],
    ["امرأة (imraʾa)", "woman"],
    ["ولد (walad)", "boy"],
    ["بنت (bint)", "girl"],
    ["أم (umm)", "mother"],
    ["أب (ab)", "father"],
    ["ابن (ibn)", "son"],
    ["ابنة (ibna)", "daughter"],
    ["أخ (akh)", "brother"],
    ["أخت (ukht)", "sister"],
    ["صديق (ṣadīq)", "friend"],
    ["عائلة (ʿāʾila)", "family"],
    ["ماء (māʾ)", "water"],
    ["طعام (ṭaʿām)", "food"],
    ["خبز (khubz)", "bread"],
    ["أرز (aruzz)", "rice"],
    ["لحم (laḥm)", "meat"],
    ["حليب (ḥalīb)", "milk"],
    ["قهوة (qahwa)", "coffee"],
    ["شاي (shāy)", "tea"],
    ["ملح (milḥ)", "salt"],
    ["سكر (sukkar)", "sugar"],
    ["واحد (wāḥid)", "one"],
    ["اثنان (ithnān)", "two"],
    ["ثلاثة (thalātha)", "three"],
    ["أربعة (arbaʿa)", "four"],
    ["خمسة (khamsa)", "five"],
    ["ستة (sitta)", "six"],
    ["سبعة (sabʿa)", "seven"],
    ["ثمانية (thamāniya)", "eight"],
    ["تسعة (tisʿa)", "nine"],
    ["عشرة (ʿashara)", "ten"],
    ["مئة (miʾa)", "hundred"],
    ["ألف (alf)", "thousand"],
    ["ذهب (dhahaba)", "to go"],
    ["جاء (jāʾa)", "to come"],
    ["كان (kāna)", "to be (was)"],
    ["فعل (faʿala)", "to do"],
    ["عمل (ʿamila)", "to work / do"],
    ["رأى (raʾā)", "to see"],
    ["سمع (samiʿa)", "to hear"],
    ["تكلم (takallama)", "to speak"],
    ["أكل (akala)", "to eat"],
    ["شرب (shariba)", "to drink"],
    ["نام (nāma)", "to sleep"],
    ["قرأ (qaraʾa)", "to read"],
    ["كتب (kataba)", "to write"],
    ["فهم (fahima)", "to understand"],
    ["أراد (arāda)", "to want"],
    ["جيد (jayyid)", "good"],
    ["سيئ (sayyiʾ)", "bad"],
    ["كبير (kabīr)", "big"],
    ["صغير (ṣaghīr)", "small"],
    ["حار (ḥārr)", "hot"],
    ["بارد (bārid)", "cold"],
    ["جديد (jadīd)", "new"],
    ["قديم (qadīm)", "old"],
    ["ماذا؟ (mādhā?)", "what?"],
    ["من؟ (man?)", "who?"],
    ["أين؟ (ayna?)", "where?"],
    ["متى؟ (matā?)", "when?"],
    ["لماذا؟ (limādhā?)", "why?"],
    ["كيف؟ (kayfa?)", "how?"],
    ["و (wa)", "and"],
    ["لكن (lākin)", "but"],
    ["اليوم (al-yawm)", "today"],
    ["غدا (ghadan)", "tomorrow"],
    ["الآن (al-ān)", "now"],
    ["بيت (bayt)", "house / home"]
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

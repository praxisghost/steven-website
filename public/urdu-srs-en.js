/* urdu-srs-en.js — اردو for English speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 83 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'ur-en';
  const WORDS = [
    ["السلام علیکم (assalāmu alaikum)", "hello (peace be upon you)"],
    ["آداب (ādāb)", "greetings"],
    ["آپ کیسے ہیں؟ (āp kaise haĩ?)", "how are you?"],
    ["میں ٹھیک ہوں (maĩ ṭhīk hū̃)", "I'm fine"],
    ["شکریہ (shukriya)", "thank you"],
    ["مہربانی (meharbānī)", "please / kindness"],
    ["جی ہاں (jī hā̃)", "yes"],
    ["نہیں (nahī̃)", "no"],
    ["معاف کیجیے (māf kījie)", "excuse me / sorry"],
    ["خدا حافظ (khudā hāfiz)", "goodbye"],
    ["آپ کا نام کیا ہے؟ (āp kā nām kyā hai?)", "what's your name?"],
    ["میرا نام ... ہے (merā nām ... hai)", "my name is ..."],
    ["میں (maĩ)", "I"],
    ["تم (tum)", "you (familiar)"],
    ["آپ (āp)", "you (formal)"],
    ["وہ (vo)", "he / she"],
    ["ہم (ham)", "we"],
    ["وہ لوگ (vo log)", "they"],
    ["آدمی (ādmī)", "man"],
    ["عورت (aurat)", "woman"],
    ["لڑکا (laṛkā)", "boy"],
    ["لڑکی (laṛkī)", "girl"],
    ["ماں (mā̃)", "mother"],
    ["ابو (abbū)", "father"],
    ["بیٹا (beṭā)", "son"],
    ["بیٹی (beṭī)", "daughter"],
    ["بھائی (bhāī)", "brother"],
    ["بہن (bahan)", "sister"],
    ["دوست (dost)", "friend"],
    ["خاندان (khāndān)", "family"],
    ["پانی (pānī)", "water"],
    ["کھانا (khānā)", "food / to eat"],
    ["روٹی (roṭī)", "bread"],
    ["چاول (chāval)", "rice"],
    ["دودھ (dūdh)", "milk"],
    ["چائے (chāy)", "tea"],
    ["نمک (namak)", "salt"],
    ["چینی (chīnī)", "sugar"],
    ["ایک (ek)", "one"],
    ["دو (do)", "two"],
    ["تین (tīn)", "three"],
    ["چار (chār)", "four"],
    ["پانچ (pā̃ch)", "five"],
    ["چھ (chhe)", "six"],
    ["سات (sāt)", "seven"],
    ["آٹھ (āṭh)", "eight"],
    ["نو (nau)", "nine"],
    ["دس (das)", "ten"],
    ["سو (sau)", "hundred"],
    ["ہزار (hazār)", "thousand"],
    ["جانا (jānā)", "to go"],
    ["آنا (ānā)", "to come"],
    ["ہونا (honā)", "to be"],
    ["کرنا (karnā)", "to do / make"],
    ["دیکھنا (dekhnā)", "to see"],
    ["سننا (sunnā)", "to hear"],
    ["بولنا (bolnā)", "to speak"],
    ["پینا (pīnā)", "to drink"],
    ["سونا (sonā)", "to sleep"],
    ["پڑھنا (paṛhnā)", "to read / study"],
    ["لکھنا (likhnā)", "to write"],
    ["سمجھنا (samajhnā)", "to understand"],
    ["چاہنا (chāhnā)", "to want"],
    ["اچھا (acchā)", "good"],
    ["برا (burā)", "bad"],
    ["بڑا (baṛā)", "big"],
    ["چھوٹا (chhoṭā)", "small"],
    ["گرم (garam)", "hot"],
    ["ٹھنڈا (ṭhanḍā)", "cold"],
    ["نیا (nayā)", "new"],
    ["پرانا (purānā)", "old"],
    ["کیا؟ (kyā?)", "what?"],
    ["کون؟ (kaun?)", "who?"],
    ["کہاں؟ (kahā̃?)", "where?"],
    ["کب؟ (kab?)", "when?"],
    ["کیوں؟ (kyõ?)", "why?"],
    ["کیسے؟ (kaise?)", "how?"],
    ["اور (aur)", "and"],
    ["لیکن (lekin)", "but"],
    ["آج (āj)", "today"],
    ["کل (kal)", "tomorrow / yesterday"],
    ["ابھی (abhī)", "now"],
    ["گھر (ghar)", "house / home"]
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

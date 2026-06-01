/* urdu-srs-hi.js — اردو for Hindi speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 63 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'ur-hi';
  const WORDS = [
    ["السلام علیکم (assalāmu alaikum)", "नमस्ते / सलाम"],
    ["آداب (ādāb)", "आदाब (अभिवादन)"],
    ["آپ کیسے ہیں؟ (āp kaise haĩ?)", "आप कैसे हैं?"],
    ["میں ٹھیک ہوں (maĩ ṭhīk hū̃)", "मैं ठीक हूँ"],
    ["شکریہ (shukriya)", "शुक्रिया / धन्यवाद"],
    ["مہربانی (meharbānī)", "कृपया"],
    ["جی ہاں (jī hā̃)", "जी हाँ"],
    ["نہیں (nahī̃)", "नहीं"],
    ["معاف کیجیے (māf kījie)", "माफ़ कीजिए"],
    ["خدا حافظ (khudā hāfiz)", "अलविदा / ख़ुदा हाफ़िज़"],
    ["آپ کا نام کیا ہے؟ (āp kā nām kyā hai?)", "आपका नाम क्या है?"],
    ["میرا نام ... ہے (merā nām ... hai)", "मेरा नाम ... है"],
    ["میں (maĩ)", "मैं"],
    ["تم (tum)", "तुम"],
    ["آپ (āp)", "आप"],
    ["وہ (vo)", "वह"],
    ["ہم (ham)", "हम"],
    ["آدمی (ādmī)", "आदमी"],
    ["عورت (aurat)", "औरत"],
    ["لڑکا (laṛkā)", "लड़का"],
    ["لڑکی (laṛkī)", "लड़की"],
    ["ماں (mā̃)", "माँ"],
    ["باپ (bāp)", "बाप / पिता"],
    ["بھائی (bhāī)", "भाई"],
    ["بہن (bahan)", "बहन"],
    ["دوست (dost)", "दोस्त"],
    ["خاندان (khāndān)", "ख़ानदान / परिवार"],
    ["پانی (pānī)", "पानी"],
    ["کھانا (khānā)", "खाना"],
    ["روٹی (roṭī)", "रोटी"],
    ["دودھ (dūdh)", "दूध"],
    ["چائے (chāy)", "चाय"],
    ["نمک (namak)", "नमक"],
    ["چینی (chīnī)", "चीनी"],
    ["ایک (ek)", "एक"],
    ["دو (do)", "दो"],
    ["تین (tīn)", "तीन"],
    ["چار (chār)", "चार"],
    ["پانچ (pā̃ch)", "पाँच"],
    ["دس (das)", "दस"],
    ["سو (sau)", "सौ"],
    ["جانا (jānā)", "जाना"],
    ["آنا (ānā)", "आना"],
    ["کرنا (karnā)", "करना"],
    ["دیکھنا (dekhnā)", "देखना"],
    ["بولنا (bolnā)", "बोलना"],
    ["کھانا (khānā, fel)", "खाना (क्रिया)"],
    ["پینا (pīnā)", "पीना"],
    ["سونا (sonā)", "सोना"],
    ["پڑھنا (paṛhnā)", "पढ़ना"],
    ["لکھنا (likhnā)", "लिखना"],
    ["اچھا (acchā)", "अच्छा"],
    ["برا (burā)", "बुरा"],
    ["بڑا (baṛā)", "बड़ा"],
    ["چھوٹا (chhoṭā)", "छोटा"],
    ["گرم (garam)", "गरम"],
    ["ٹھنڈا (ṭhanḍā)", "ठंडा"],
    ["نیا (nayā)", "नया"],
    ["کیا؟ (kyā?)", "क्या?"],
    ["کہاں؟ (kahā̃?)", "कहाँ?"],
    ["آج (āj)", "आज"],
    ["ابھی (abhī)", "अभी"],
    ["گھر (ghar)", "घर"]
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

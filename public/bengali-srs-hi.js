/* bengali-srs-hi.js — বাংলা (Bengali) for Hindi speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 62 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'bn-hi';
  const WORDS = [
    ["নমস্কার (nomoshkar)", "नमस्कार"],
    ["আসসালামু আলাইকুম (assalāmu ālāikum)", "सलाम (मुस्लिम अभिवादन)"],
    ["কেমন আছেন? (kemon āchhen?)", "आप कैसे हैं?"],
    ["ভালো আছি (bhālo āchhi)", "मैं ठीक हूँ"],
    ["ধন্যবাদ (dhonyobād)", "धन्यवाद"],
    ["অনেক ধন্যবাদ (onek dhonyobād)", "बहुत धन्यवाद"],
    ["হ্যাঁ (hyā̃)", "हाँ"],
    ["না (nā)", "नहीं"],
    ["দয়া করে (doyā kore)", "कृपया"],
    ["মাফ করবেন (māf korben)", "माफ़ कीजिए"],
    ["বিদায় (bidāy)", "विदा / अलविदा"],
    ["আপনার নাম কী? (āpnār nām ki?)", "आपका नाम क्या है?"],
    ["আমার নাম … (āmār nām …)", "मेरा नाम … है"],
    ["মানুষ (mānush)", "इंसान / लोग"],
    ["মেয়ে (meye)", "लड़की / औरत"],
    ["ছেলে (chhele)", "लड़का"],
    ["পুরুষ (purush)", "पुरुष"],
    ["নারী (nāri)", "स्त्री"],
    ["শিশু (shishu)", "बच्चा"],
    ["বাবা (bābā)", "पिता"],
    ["মা (mā)", "माँ"],
    ["বন্ধু (bondhu)", "मित्र"],
    ["বাড়ি (bāṛi)", "घर"],
    ["জল / পানি (jol / pāni)", "पानी"],
    ["খাবার (khābār)", "भोजन"],
    ["ভাত (bhāt)", "चावल / भात"],
    ["মাংস (māngsho)", "माँस"],
    ["মাছ (māchh)", "मछली"],
    ["দুধ (dudh)", "दूध"],
    ["চা (chā)", "चाय"],
    ["টাকা (ṭākā)", "पैसा / रुपया"],
    ["কাজ (kāj)", "काम"],
    ["স্কুল (skul)", "स्कूल"],
    ["বই (boi)", "किताब"],
    ["গাড়ি (gāṛi)", "गाड़ी"],
    ["দিন (din)", "दिन"],
    ["রাত (rāt)", "रात"],
    ["আজ (āj)", "आज"],
    ["আগামীকাল (āgāmikāl)", "कल (आने वाला)"],
    ["গতকাল (gotokāl)", "कल (बीता हुआ)"],
    ["খাওয়া (khāoyā)", "खाना"],
    ["পান করা (pān korā)", "पीना"],
    ["যাওয়া (jāoyā)", "जाना"],
    ["আসা (āshā)", "आना"],
    ["চাওয়া (chāoyā)", "चाहना"],
    ["জানা (jānā)", "जानना"],
    ["বলা (bolā)", "बोलना"],
    ["দেখা (dekhā)", "देखना"],
    ["শোনা (shonā)", "सुनना"],
    ["কী? (ki?)", "क्या?"],
    ["কে? (ke?)", "कौन?"],
    ["কোথায়? (kothāy?)", "कहाँ?"],
    ["কখন? (kokhon?)", "कब?"],
    ["কেন? (keno?)", "क्यों?"],
    ["কত? (koto?)", "कितना?"],
    ["ভালো (bhālo)", "अच्छा"],
    ["খারাপ (khārāp)", "बुरा"],
    ["বড় (boṛo)", "बड़ा"],
    ["ছোট (chhoṭo)", "छोटा"],
    ["আমি তোমাকে ভালোবাসি (āmi tomāke bhālobāshi)", "मैं तुमसे प्यार करता/करती हूँ"],
    ["আমি বুঝি না (āmi bujhi nā)", "मैं नहीं समझता/समझती"],
    ["আপনি কি হিন্দি বলেন? (āpni ki hindi bolen?)", "क्या आप हिन्दी बोलते हैं?"]
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

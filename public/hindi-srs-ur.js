/* hindi-srs-ur.js — हिन्दी for Urdu speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 64 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'hi-ur';
  const WORDS = [
    ["नमस्ते (namaste)", "سلام / نمستے"],
    ["नमस्कार (namaskār)", "نمسکار / آداب"],
    ["आप कैसे हैं? (āp kaise haĩ?)", "آپ کیسے ہیں؟"],
    ["मैं ठीक हूँ (maĩ ṭhīk hū̃)", "میں ٹھیک ہوں"],
    ["धन्यवाद (dhanyavād)", "شکریہ / دھنیہ واد"],
    ["कृपया (kṛpayā)", "براہِ کرم"],
    ["हाँ (hā̃)", "ہاں"],
    ["नहीं (nahī̃)", "نہیں"],
    ["माफ़ कीजिए (māf kījie)", "معاف کیجیے"],
    ["अलविदा (alvidā)", "الوداع"],
    ["आपका नाम क्या है? (āpkā nām kyā hai?)", "آپ کا نام کیا ہے؟"],
    ["मेरा नाम ... है (merā nām ... hai)", "میرا نام ... ہے"],
    ["मैं (maĩ)", "میں"],
    ["तुम (tum)", "تم"],
    ["आप (āp)", "آپ"],
    ["वह (vah)", "وہ"],
    ["हम (ham)", "ہم"],
    ["वे (ve)", "وہ لوگ"],
    ["आदमी (ādmī)", "آدمی"],
    ["औरत (aurat)", "عورت"],
    ["लड़का (laṛkā)", "لڑکا"],
    ["लड़की (laṛkī)", "لڑکی"],
    ["माँ (mā̃)", "ماں"],
    ["पिता (pitā)", "باپ"],
    ["भाई (bhāī)", "بھائی"],
    ["बहन (bahan)", "بہن"],
    ["दोस्त (dost)", "دوست"],
    ["परिवार (parivār)", "خاندان"],
    ["पानी (pānī)", "پانی"],
    ["खाना (khānā)", "کھانا"],
    ["रोटी (roṭī)", "روٹی"],
    ["दूध (dūdh)", "دودھ"],
    ["चाय (chāy)", "چائے"],
    ["नमक (namak)", "نمک"],
    ["चीनी (chīnī)", "چینی"],
    ["एक (ek)", "ایک"],
    ["दो (do)", "دو"],
    ["तीन (tīn)", "تین"],
    ["चार (chār)", "چار"],
    ["पाँच (pā̃ch)", "پانچ"],
    ["दस (das)", "دس"],
    ["सौ (sau)", "سو"],
    ["जाना (jānā)", "جانا"],
    ["आना (ānā)", "آنا"],
    ["करना (karnā)", "کرنا"],
    ["देखना (dekhnā)", "دیکھنا"],
    ["बोलना (bolnā)", "بولنا"],
    ["खाना (khānā, kriyā)", "کھانا"],
    ["पीना (pīnā)", "پینا"],
    ["सोना (sonā)", "سونا"],
    ["पढ़ना (paṛhnā)", "پڑھنا"],
    ["लिखना (likhnā)", "لکھنا"],
    ["अच्छा (acchā)", "اچھا"],
    ["बुरा (burā)", "برا"],
    ["बड़ा (baṛā)", "بڑا"],
    ["छोटा (choṭā)", "چھوٹا"],
    ["गरम (garam)", "گرم"],
    ["ठंडा (ṭhanḍā)", "ٹھنڈا"],
    ["नया (nayā)", "نیا"],
    ["क्या? (kyā?)", "کیا؟"],
    ["कहाँ? (kahā̃?)", "کہاں؟"],
    ["आज (āj)", "آج"],
    ["अभी (abhī)", "ابھی"],
    ["घर (ghar)", "گھر"]
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

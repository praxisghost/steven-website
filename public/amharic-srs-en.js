/* amharic-srs-en.js — አማርኛ (Amharic) for English speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 61 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'am-en';
  const WORDS = [
    ["ሰላም (sälam)", "hello / peace"],
    ["ታዲያስ (tadiyas)", "hi (informal)"],
    ["እንደምን አደርክ (əndämən addärk)", "good morning (to m.)"],
    ["ደህና ነህ? (dähna näh?)", "are you well? (to m.)"],
    ["ደህና ነኝ (dähna näñ)", "I'm well"],
    ["አመሰግናለሁ (amäsäggənallähu)", "thank you"],
    ["እሺ (əshi)", "okay"],
    ["አዎ (awo)", "yes"],
    ["አይ (ay)", "no"],
    ["እባክህ (əbakəh)", "please (to m.)"],
    ["ይቅርታ (yəqərta)", "sorry / excuse me"],
    ["ደህና ሁን (dähna hun)", "goodbye (to m.)"],
    ["ስምህ ማን ነው? (səməh man näw?)", "what's your name? (to m.)"],
    ["ስሜ … ነው (səmē … näw)", "my name is …"],
    ["ሰው (säw)", "person"],
    ["ሰዎች (säwoch)", "people"],
    ["ሴት (sēt)", "woman"],
    ["ወንድ (wänd)", "man"],
    ["ልጅ (ləj)", "child"],
    ["አባት (abat)", "father"],
    ["እናት (ənnat)", "mother"],
    ["ጓደኛ (gwadäñña)", "friend"],
    ["ቤት (bēt)", "house"],
    ["ውሃ (wəha)", "water"],
    ["ምግብ (məgəb)", "food"],
    ["ስጋ (səga)", "meat"],
    ["ዳቦ (dabbo)", "bread"],
    ["ወተት (wätät)", "milk"],
    ["ቡና (buna)", "coffee"],
    ["ገንዘብ (gänzäb)", "money"],
    ["ሥራ (səra)", "work"],
    ["ትምህርት ቤት (təmhərt bēt)", "school"],
    ["መጽሐፍ (mäṣhaf)", "book"],
    ["መኪና (mäkina)", "car"],
    ["ቀን (qän)", "day"],
    ["ሌሊት (lēlit)", "night"],
    ["ዛሬ (zarē)", "today"],
    ["ነገ (nägä)", "tomorrow"],
    ["ትናንት (tənant)", "yesterday"],
    ["መብላት (mäblat)", "to eat"],
    ["መጠጣት (mäṭäṭat)", "to drink"],
    ["መሄድ (mähēd)", "to go"],
    ["መምጣት (mämṭat)", "to come"],
    ["መፈለግ (mäfälläg)", "to want"],
    ["ማወቅ (mawäq)", "to know"],
    ["መናገር (mänagär)", "to speak"],
    ["ማየት (mayät)", "to see"],
    ["መስማት (mäsmat)", "to hear"],
    ["ምን? (mən?)", "what?"],
    ["ማን? (man?)", "who?"],
    ["የት? (yät?)", "where?"],
    ["መቼ? (mäche?)", "when?"],
    ["ለምን? (lämən?)", "why?"],
    ["ስንት? (sənt?)", "how many?"],
    ["ጥሩ (ṭəru)", "good"],
    ["መጥፎ (mäṭfo)", "bad"],
    ["ትልቅ (təlləq)", "big"],
    ["ትንሽ (tənnəsh)", "small"],
    ["እወድሃለሁ (əwäddəhallähu)", "I love you (to m.)"],
    ["አልገባኝም (algäbbañəm)", "I don't understand"],
    ["እንግሊዝኛ ትችላለህ? (ənglizəñña təchəlalläh?)", "do you speak English? (to m.)"]
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

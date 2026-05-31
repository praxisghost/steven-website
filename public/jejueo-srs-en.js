/* jejueo-srs-en.js — 제주어 for English speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 53 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'jje-en';
  const WORDS = [
    ["혼저 옵서예 (honjeo opseoye)", "welcome / come on in"],
    ["반갑수다 (bangapsuda)", "nice to meet you"],
    ["펜안ᄒᆞ우꽈? (penan-hawukkwa)", "how are you? (are you at peace?)"],
    ["폭삭 속았수다 (poksak sogassuda)", "thank you for your hard work"],
    ["고맙수다 (gomapsuda)", "thank you"],
    ["미안ᄒᆞ우다 (mian-hawuda)", "sorry"],
    ["예 (ye)", "yes"],
    ["아니우다 (aniuda)", "no / it isn't"],
    ["무사 (musa)", "why"],
    ["무신거 (musin-geo)", "what"],
    ["어떵 (eotteong)", "how"],
    ["어드레 (eodeure)", "where to"],
    ["게메 (geme)", "well / hmm"],
    ["기? (gi)", "really?"],
    ["나 (na)", "I"],
    ["느 (neu)", "you"],
    ["우리 (uri)", "we"],
    ["아방 (abang)", "father"],
    ["어멍 (eomeong)", "mother"],
    ["하르방 (hareubang)", "grandfather"],
    ["할망 (halmang)", "grandmother"],
    ["삼춘 (samchun)", "neighborhood elder (uncle/aunt)"],
    ["비바리 (bibari)", "young woman"],
    ["지집아이 (jijibai)", "girl"],
    ["ᄉᆞ나이 (sanai)", "man"],
    ["어시 (eosi)", "parents (archaic)"],
    ["도새기 (dosaegi)", "pig"],
    ["강생이 (gangsaengi)", "puppy"],
    ["송애기 (songaegi)", "calf"],
    ["ᄆᆞᆯ (mal)", "horse"],
    ["돗괴기 (dotgwegi)", "pork"],
    ["바당 (badang)", "sea"],
    ["ᄇᆞ롬 (barom)", "wind"],
    ["돌 (dol)", "stone"],
    ["오름 (oreum)", "small volcanic cone"],
    ["올레 (olle)", "narrow lane to a house"],
    ["정지 (jeongji)", "kitchen"],
    ["구덕 (gudeok)", "basket"],
    ["지슬 (jiseul)", "potato"],
    ["ᄂᆞᆷ삐 (nambi)", "radish"],
    ["물 (mul)", "water"],
    ["밥 (bap)", "rice / a meal"],
    ["식게 (sikge)", "ancestral rite"],
    ["멩질 (myeongjil)", "holiday / festival"],
    ["ᄒᆞ나 (hana)", "one"],
    ["둘 (dul)", "two"],
    ["싯 (sit)", "three"],
    ["넷 (net)", "four"],
    ["다숫 (dasut)", "five"],
    ["열 (yeol)", "ten"],
    ["오널 (oneol)", "today"],
    ["ᄂᆞ일 (nail)", "tomorrow"],
    ["한라산 (Hallasan)", "Mt. Halla"]
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

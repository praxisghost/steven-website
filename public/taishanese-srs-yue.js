/* taishanese-srs-yue.js — 台山話 for Cantonese speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 42 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'tsh-yue';
  const WORDS = [
    ["你好 (ni-hau)", "你好"],
    ["多謝 (oi)", "多謝／謝謝"],
    ["唔該 (m-goi)", "唔該"],
    ["我 (ngoi)", "我"],
    ["你 (ni)", "你"],
    ["佢 (kui)", "佢／他"],
    ["我哋 (ngoi-deu)", "我哋／我們"],
    ["你哋 (ni-deu)", "你哋／你們"],
    ["佢哋 (kui-deu)", "佢哋／他們"],
    ["一 (yit)", "一"],
    ["二 (ngi)", "二"],
    ["三 (lham)", "三"],
    ["四 (lhi)", "四"],
    ["五 (ńg)", "五"],
    ["六 (luk)", "六"],
    ["七 (tit)", "七"],
    ["八 (bat)", "八"],
    ["九 (giu)", "九"],
    ["十 (sip)", "十"],
    ["百 (bak)", "百"],
    ["千 (tien)", "千"],
    ["水 (lhui)", "水"],
    ["心 (lham)", "心"],
    ["屋 (vuk)", "屋／房子"],
    ["人 (ngin)", "人"],
    ["食 (siak)", "食／吃"],
    ["飯 (fan)", "飯"],
    ["茶 (ha)", "茶"],
    ["大 (ai)", "大"],
    ["細 (lhe)", "細／小"],
    ["爸 (ba)", "爸"],
    ["媽 (ma)", "媽"],
    ["仔 (zai)", "仔／兒子"],
    ["女 (nui)", "女兒"],
    ["乜嘢 (mit-ye)", "乜嘢／什麼"],
    ["邊度 (bien-do)", "邊度／哪裡"],
    ["幾多 (gi-do)", "幾多／多少"],
    ["今日 (gim-nit)", "今日／今天"],
    ["聽日 (ting-nit)", "聽日／明天"],
    ["好 (hau)", "好"],
    ["唔好 (m-hau)", "唔好／不好"],
    ["黃 (vong)", "黃"]
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

/* fuzhounese-srs-cmn.js — 平话 / Bàng-uâ for Mandarin speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 49 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'fzh-cmn';
  const WORDS = [
    ["我 (nguāi)", "我"],
    ["汝 (nṳ̄)", "你"],
    ["伊 (ĭ)", "他／她"],
    ["侬 (nè̤ng)", "人"],
    ["食罢未 (siăh-bà-muôi)", "吃了吗（问候语）"],
    ["起动 (kī-dáe̤ng)", "谢谢"],
    ["好 (hō̤)", "好"],
    ["蜀 (sŏ̤h)", "一（计数）"],
    ["一 (ék)", "一"],
    ["二 (nê)", "二"],
    ["三 (sang)", "三"],
    ["四 (sé)", "四"],
    ["五 (ngô)", "五"],
    ["六 (lĕ̤k)", "六"],
    ["七 (chék)", "七"],
    ["八 (báik)", "八"],
    ["九 (gáu)", "九"],
    ["十 (sĕk)", "十"],
    ["百 (báh)", "百"],
    ["千 (chiĕng)", "千"],
    ["厝 (chuó)", "房子／家"],
    ["囝 (giāng)", "儿子／孩子"],
    ["日头 (nĭk-tàu)", "太阳"],
    ["月光 (nguŏk-guŏng)", "月亮"],
    ["天 (tiĕng)", "天"],
    ["水 (cuōi)", "水"],
    ["火 (huōi)", "火"],
    ["山 (sang)", "山"],
    ["海 (hāi)", "海"],
    ["雨 (ṳ̄)", "雨"],
    ["食 (siăh)", "吃"],
    ["饮 (íng)", "喝"],
    ["饭 (buông)", "饭"],
    ["鱼 (ngṳ̀)", "鱼"],
    ["肉 (nṳ̆k)", "肉"],
    ["茶 (dà)", "茶"],
    ["厝里 (chuó-diē)", "家里"],
    ["街 (giĕ)", "街"],
    ["钱 (cièng)", "钱"],
    ["大 (duâi)", "大"],
    ["细 (sá̤)", "小"],
    ["父 (â-mâ／nòng-mâ)", "父亲"],
    ["母 (â-niòng)", "母亲"],
    ["囝儿 (giāng-ǐ)", "孩子"],
    ["乜 (siŏh-nó̤h)", "什么"],
    ["底 (diē-nē̤ng)", "谁"],
    ["今旦 (gĭng-dáng)", "今天"],
    ["明旦 (mìng-dáng)", "明天"],
    ["福州 (Hók-ciŭ)", "福州"]
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

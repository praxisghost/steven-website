/* shanghainese-srs-cmn.js — 上海闲话 for Mandarin speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 54 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'wuu-cmn';
  const WORDS = [
    ["侬好 (nong hao)", "你好"],
    ["早浪向好 (tsao-laan-shian hao)", "早上好"],
    ["夜里向好 (ya-li-shian hao)", "晚上好"],
    ["再会 (tse we)", "再见"],
    ["谢谢侬 (zia-zia nong)", "谢谢你"],
    ["对勿起 (te-feq-chi)", "对不起"],
    ["是个 (zy-geq)", "是的"],
    ["勿是 (feq-zy)", "不是"],
    ["吾 (ngu)", "我"],
    ["侬 (nong)", "你"],
    ["伊 (yi)", "他／她"],
    ["阿拉 (a-la)", "我们／我的"],
    ["㑚 (na)", "你们"],
    ["伊拉 (yi-la)", "他们"],
    ["一 (iq)", "一"],
    ["两 (lian)", "二／两"],
    ["三 (se)", "三"],
    ["四 (sy)", "四"],
    ["五 (ng)", "五"],
    ["六 (loq)", "六"],
    ["七 (tshiq)", "七"],
    ["八 (paq)", "八"],
    ["九 (jiou)", "九"],
    ["十 (zeq)", "十"],
    ["百 (paq)", "百"],
    ["千 (tshi)", "千"],
    ["人 (nyin)", "人"],
    ["水 (sy)", "水"],
    ["火 (hu)", "火"],
    ["天 (thi)", "天"],
    ["日头 (nyiq-deu)", "太阳"],
    ["月亮 (nyoq-lian)", "月亮"],
    ["屋里 (oq-li)", "家"],
    ["吃 (chiq)", "吃"],
    ["饭 (ve)", "饭"],
    ["茶 (zo)", "茶"],
    ["水果 (sy-gu)", "水果"],
    ["钞票 (tsho-phio)", "钱"],
    ["好 (hao)", "好"],
    ["勿要 (feq-yao)", "不要"],
    ["大 (du)", "大"],
    ["小 (siao)", "小"],
    ["老 (lao)", "老／很"],
    ["啥 (sa)", "什么"],
    ["啥人 (sa-nyin)", "谁"],
    ["阿里 (a-li)", "哪里"],
    ["今朝 (jin-tsao)", "今天"],
    ["明朝 (min-tsao)", "明天"],
    ["昨日 (zoq-nyiq)", "昨天"],
    ["现在 (yi-ze)", "现在"],
    ["姆妈 (m-ma)", "妈妈"],
    ["阿爸 (a-pa)", "爸爸"],
    ["囡 (noe)", "女儿／小孩"],
    ["上海 (Zaan-he)", "上海"]
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

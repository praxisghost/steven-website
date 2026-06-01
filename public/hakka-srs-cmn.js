/* hakka-srs-cmn.js — 客家话 / Hak-kâ-fa for Mandarin speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 62 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'hak-cmn';
  const WORDS = [
    ["你好 (ngì-hó)", "你好"],
    ["食饱吂 (sṳ̍t-páu-màng)", "吃了吗（问候）"],
    ["你好无 (ngì-hó-mò)", "你好吗"],
    ["承蒙你 (sṳ̀n-mùng-ngì)", "谢谢"],
    ["多谢 (tô-chhia)", "多谢"],
    ["着 (chho̍k)", "对／好"],
    ["係 (he)", "是"],
    ["毋係 (m̀-he)", "不是"],
    ["有 (yû)", "有"],
    ["无 (mò)", "没有"],
    ["再见 (chai-kien)", "再见"],
    ["对毋住 (tui-m̀-chhu)", "对不起"],
    ["请 (chhiáng)", "请"],
    ["你安到么个名 (ngì on-to má-ke miàng)", "你叫什么名字"],
    ["𠊎 (ngài)", "我"],
    ["你 (ngì)", "你"],
    ["佢 (kì)", "他／她"],
    ["人 (ngìn)", "人"],
    ["妇人家 (fu-ngìn-kâ)", "女人"],
    ["男仔 (nàm-é)", "男人／男孩"],
    ["细人仔 (se-ngìn-é)", "小孩"],
    ["阿爸 (â-pâ)", "爸爸"],
    ["阿姆 (â-mê)", "妈妈"],
    ["朋友 (phèn-yû)", "朋友"],
    ["屋家 (vuk-kâ)", "家"],
    ["水 (súi)", "水"],
    ["饭 (fan)", "饭"],
    ["肉 (ngiuk)", "肉"],
    ["茶 (chhà)", "茶"],
    ["牛乳 (ngiù-nen)", "牛奶"],
    ["钱 (chhièn)", "钱"],
    ["事头 (sṳ-thèu)", "工作／事情"],
    ["学堂 (ho̍k-thòng)", "学校"],
    ["书 (sû)", "书"],
    ["车仔 (chhâ-é)", "车"],
    ["日头 (ngit-thèu)", "太阳／白天"],
    ["暗晡 (am-pû)", "晚上"],
    ["今晡日 (kîm-pû-ngit)", "今天"],
    ["天光日 (thiên-kông-ngit)", "明天"],
    ["昨晡日 (chho-pû-ngit)", "昨天"],
    ["食 (sṳ̍t)", "吃"],
    ["啉 (lîm)", "喝"],
    ["去 (hi)", "去"],
    ["来 (lòi)", "来"],
    ["爱 (oi)", "要／爱"],
    ["知 (tî)", "知道"],
    ["讲 (kóng)", "说"],
    ["看 (khon)", "看"],
    ["听 (thâng)", "听"],
    ["么个 (má-ke)", "什么"],
    ["脈人 (mak-ngìn)", "谁"],
    ["哪位 (nai-vi)", "哪里"],
    ["几时 (kí-sṳ̀)", "什么时候"],
    ["做么个 (cho-má-ke)", "为什么"],
    ["几多 (kí-tô)", "多少"],
    ["好 (hó)", "好"],
    ["唔好 (m̀-hó)", "不好／坏"],
    ["大 (thai)", "大"],
    ["细 (se)", "小"],
    ["𠊎惜你 (ngài siak ngì)", "我爱你"],
    ["𠊎听毋识 (ngài thâng-m̀-sṳt)", "我听不懂"],
    ["你会讲英文无 (ngì voi kóng yîn-vùn mò)", "你会说英语吗"]
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

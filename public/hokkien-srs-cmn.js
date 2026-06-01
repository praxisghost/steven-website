/* hokkien-srs-cmn.js — 闽南语 / Bân-lâm-gí for Mandarin speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 62 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'hok-cmn';
  const WORDS = [
    ["你好 (lí-hó)", "你好"],
    ["食饱未 (chia̍h-pá--bōe)", "吃了吗（问候）"],
    ["敢好 (kám hó)", "好吗"],
    ["多谢 (to-siā)", "谢谢"],
    ["感谢 (kám-siā)", "感谢"],
    ["著 (tio̍h)", "对"],
    ["是 (sī)", "是"],
    ["毋是 (m̄-sī)", "不是"],
    ["有 (ū)", "有"],
    ["无 (bô)", "没有"],
    ["再会 (chài-hōe)", "再见"],
    ["歹势 (pháiⁿ-sè)", "不好意思／抱歉"],
    ["拜托 (pài-thok)", "拜托／请"],
    ["你叫啥物名 (lí kiò siáⁿ-mi̍h miâ)", "你叫什么名字"],
    ["我 (góa)", "我"],
    ["你 (lí)", "你"],
    ["伊 (i)", "他／她"],
    ["人 (lâng)", "人"],
    ["查某 (cha-bó͘)", "女人"],
    ["查埔 (cha-po͘)", "男人"],
    ["囡仔 (gín-á)", "小孩"],
    ["阿爸 (a-pâ)", "爸爸"],
    ["阿母 (a-bú)", "妈妈"],
    ["朋友 (pêng-iú)", "朋友"],
    ["厝 (chhù)", "家／房子"],
    ["水 (chúi)", "水"],
    ["饭 (pn̄g)", "饭"],
    ["肉 (bah)", "肉"],
    ["茶 (tê)", "茶"],
    ["牛奶 (gû-ni)", "牛奶"],
    ["钱 (chîⁿ)", "钱"],
    ["工课 (khang-khòe)", "工作"],
    ["学校 (ha̍k-hāu)", "学校"],
    ["册 (chheh)", "书"],
    ["车 (chhia)", "车"],
    ["日头 (ji̍t-thâu)", "太阳"],
    ["暗暝 (àm-mê)", "晚上"],
    ["今仔日 (kin-á-ji̍t)", "今天"],
    ["明仔载 (bîn-á-chài)", "明天"],
    ["昨昏 (cha-hng)", "昨天"],
    ["食 (chia̍h)", "吃"],
    ["啉 (lim)", "喝"],
    ["去 (khì)", "去"],
    ["来 (lâi)", "来"],
    ["爱 (ài)", "要／爱"],
    ["知影 (chai-iáⁿ)", "知道"],
    ["讲 (kóng)", "说"],
    ["看 (khòaⁿ)", "看"],
    ["听 (thiaⁿ)", "听"],
    ["啥物 (siáⁿ-mi̍h)", "什么"],
    ["啥人 (siáng)", "谁"],
    ["佗位 (tó-ūi)", "哪里"],
    ["当时 (tang-sî)", "什么时候"],
    ["是按怎 (sī-án-chóaⁿ)", "为什么"],
    ["偌济 (gōa-chē)", "多少"],
    ["好 (hó)", "好"],
    ["䆀 (bái)", "坏／丑"],
    ["大 (tōa)", "大"],
    ["细 (sè)", "小"],
    ["我爱你 (góa ài lí)", "我爱你"],
    ["我听无 (góa thiaⁿ-bô)", "我听不懂"],
    ["你敢会晓讲英语 (lí kám ē-hiáu kóng eng-gí)", "你会说英语吗"]
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

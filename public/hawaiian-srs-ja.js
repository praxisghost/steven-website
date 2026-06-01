/* hawaiian-srs-ja.js — ʻŌlelo Hawaiʻi for Japanese speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 100 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'haw-ja';
  const WORDS = [
    ["aloha", "こんにちは／さようなら／愛"],
    ["aloha kakahiaka", "おはよう"],
    ["aloha ʻauinalā", "こんにちは（昼）"],
    ["aloha ahiahi", "こんばんは"],
    ["pehea ʻoe?", "お元気ですか？"],
    ["maikaʻi (au)", "元気です／良い"],
    ["mahalo", "ありがとう"],
    ["mahalo nui loa", "どうもありがとう"],
    ["ʻae", "はい"],
    ["ʻaʻole", "いいえ"],
    ["e kala mai", "すみません／ごめんなさい"],
    ["ʻoluʻolu", "どうぞ／心地よい"],
    ["a hui hou", "また会いましょう"],
    ["ʻo wai kou inoa?", "お名前は？"],
    ["ʻo ... koʻu inoa", "私の名前は…です"],
    ["au / wau", "私"],
    ["ʻoe", "あなた"],
    ["ʻo ia", "彼／彼女"],
    ["kāua", "私たち二人（あなたと私）"],
    ["mākou", "私たち（相手を含まない）"],
    ["ʻoukou", "あなたたち"],
    ["lākou", "彼ら"],
    ["kanaka", "人"],
    ["kānaka", "人々"],
    ["kāne", "男／夫"],
    ["wahine", "女／妻"],
    ["keiki", "子供"],
    ["makuahine", "母"],
    ["makua kāne", "父"],
    ["kupuna", "祖父母／年長者"],
    ["ʻohana", "家族"],
    ["hoaaloha", "友達"],
    ["wai", "水（真水）"],
    ["kai", "海"],
    ["moana", "大海"],
    ["ʻāina", "土地"],
    ["lani", "空／天"],
    ["lā", "太陽／日"],
    ["mahina", "月"],
    ["hōkū", "星"],
    ["makani", "風"],
    ["ua", "雨"],
    ["pō", "夜"],
    ["pua", "花"],
    ["pōhaku", "石"],
    ["kumu", "先生／源／木"],
    ["ʻai", "食べる／食べ物"],
    ["iʻa", "魚"],
    ["puaʻa", "豚"],
    ["kalo", "タロイモ"],
    ["poi", "ポイ（タロの主食）"],
    ["niu", "ヤシの実"],
    ["meaʻai", "食べ物"],
    ["inu", "飲む"],
    ["ʻekahi", "一"],
    ["ʻelua", "二"],
    ["ʻekolu", "三"],
    ["ʻehā", "四"],
    ["ʻelima", "五"],
    ["ʻeono", "六"],
    ["ʻehiku", "七"],
    ["ʻewalu", "八"],
    ["ʻeiwa", "九"],
    ["ʻumi", "十"],
    ["hele", "行く"],
    ["hele mai", "来る"],
    ["moe", "寝る"],
    ["ʻike", "見る／知る"],
    ["lohe", "聞く"],
    ["ʻōlelo", "話す／言語"],
    ["heluhelu", "読む"],
    ["kākau", "書く"],
    ["hana", "する／作る／仕事"],
    ["makemake", "ほしい／好き"],
    ["noho", "座る／住む"],
    ["kū", "立つ"],
    ["aʻo", "学ぶ／教える"],
    ["maikaʻi", "良い"],
    ["ʻino", "悪い"],
    ["nui", "大きい"],
    ["liʻiliʻi", "小さい"],
    ["wela", "暑い／熱い"],
    ["anuanu", "寒い"],
    ["nani", "美しい"],
    ["wikiwiki", "速い"],
    ["lōʻihi", "長い／高い"],
    ["aha?", "何？"],
    ["ʻo wai?", "誰？"],
    ["hea?", "どこ？／どれ？"],
    ["ʻehia?", "いくつ？"],
    ["pehea?", "どうやって？"],
    ["no ke aha?", "なぜ？"],
    ["a", "～と"],
    ["me", "～と一緒に"],
    ["akā", "しかし"],
    ["mauka", "山の方へ"],
    ["makai", "海の方へ"],
    ["pono", "正しさ／調和"],
    ["mana", "霊力"],
    ["kapu", "神聖な／禁忌"]
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

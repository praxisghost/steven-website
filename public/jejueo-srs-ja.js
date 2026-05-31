/* jejueo-srs-ja.js — 제주어 for Japanese speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 53 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'jje-ja';
  const WORDS = [
    ["혼저 옵서예 (honjeo opseoye)", "いらっしゃい／ようこそ"],
    ["반갑수다 (bangapsuda)", "はじめまして"],
    ["펜안ᄒᆞ우꽈? (penan-hawukkwa)", "お元気ですか"],
    ["폭삭 속았수다 (poksak sogassuda)", "お疲れさまでした"],
    ["고맙수다 (gomapsuda)", "ありがとうございます"],
    ["미안ᄒᆞ우다 (mian-hawuda)", "すみません"],
    ["예 (ye)", "はい"],
    ["아니우다 (aniuda)", "いいえ"],
    ["무사 (musa)", "なぜ"],
    ["무신거 (musin-geo)", "何"],
    ["어떵 (eotteong)", "どう／どうやって"],
    ["어드레 (eodeure)", "どこへ"],
    ["게메 (geme)", "さあ／そうですね"],
    ["기? (gi)", "本当に？"],
    ["나 (na)", "私"],
    ["느 (neu)", "あなた"],
    ["우리 (uri)", "私たち"],
    ["아방 (abang)", "父"],
    ["어멍 (eomeong)", "母"],
    ["하르방 (hareubang)", "おじいさん"],
    ["할망 (halmang)", "おばあさん"],
    ["삼춘 (samchun)", "近所の年配者（おじさん・おばさん）"],
    ["비바리 (bibari)", "若い女性"],
    ["지집아이 (jijibai)", "女の子"],
    ["ᄉᆞ나이 (sanai)", "男性"],
    ["어시 (eosi)", "親（古語）"],
    ["도새기 (dosaegi)", "豚"],
    ["강생이 (gangsaengi)", "子犬"],
    ["송애기 (songaegi)", "子牛"],
    ["ᄆᆞᆯ (mal)", "馬"],
    ["돗괴기 (dotgwegi)", "豚肉"],
    ["바당 (badang)", "海"],
    ["ᄇᆞ롬 (barom)", "風"],
    ["돌 (dol)", "石"],
    ["오름 (oreum)", "小さな火山（側火山）"],
    ["올레 (olle)", "家へ通じる細い道"],
    ["정지 (jeongji)", "台所"],
    ["구덕 (gudeok)", "かご"],
    ["지슬 (jiseul)", "じゃがいも"],
    ["ᄂᆞᆷ삐 (nambi)", "大根"],
    ["물 (mul)", "水"],
    ["밥 (bap)", "ご飯"],
    ["식게 (sikge)", "法事（祖先祭祀）"],
    ["멩질 (myeongjil)", "祝祭日"],
    ["ᄒᆞ나 (hana)", "一つ"],
    ["둘 (dul)", "二つ"],
    ["싯 (sit)", "三つ"],
    ["넷 (net)", "四つ"],
    ["다숫 (dasut)", "五つ"],
    ["열 (yeol)", "十"],
    ["오널 (oneol)", "今日"],
    ["ᄂᆞ일 (nail)", "明日"],
    ["한라산 (Hallasan)", "漢拏山（ハルラ山）"]
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

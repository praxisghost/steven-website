/* jejueo-srs-ko.js — 제주어 for Korean speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 53 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'jje-ko';
  const WORDS = [
    ["혼저 옵서예", "어서 오세요"],
    ["반갑수다", "반갑습니다"],
    ["펜안ᄒᆞ우꽈?", "안녕하십니까?"],
    ["폭삭 속았수다", "수고하셨습니다"],
    ["고맙수다", "고맙습니다"],
    ["미안ᄒᆞ우다", "미안합니다"],
    ["예", "예 / 네"],
    ["아니우다", "아닙니다"],
    ["무사", "왜"],
    ["무신거", "무엇"],
    ["어떵", "어떻게"],
    ["어드레", "어디로"],
    ["게메", "글쎄"],
    ["기?", "그래? / 정말?"],
    ["나", "나"],
    ["느", "너"],
    ["우리", "우리"],
    ["아방", "아버지"],
    ["어멍", "어머니"],
    ["하르방", "할아버지"],
    ["할망", "할머니"],
    ["삼춘", "이웃 어른 (아저씨·아주머니)"],
    ["비바리", "처녀 / 젊은 여자"],
    ["지집아이", "여자아이"],
    ["ᄉᆞ나이", "남자"],
    ["어시", "부모 (옛말)"],
    ["도새기", "돼지"],
    ["강생이", "강아지"],
    ["송애기", "송아지"],
    ["ᄆᆞᆯ", "말 (동물)"],
    ["돗괴기", "돼지고기"],
    ["바당", "바다"],
    ["ᄇᆞ롬", "바람"],
    ["돌", "돌"],
    ["오름", "작은 화산 / 기생화산"],
    ["올레", "집으로 드는 좁은 길"],
    ["정지", "부엌"],
    ["구덕", "바구니"],
    ["지슬", "감자"],
    ["ᄂᆞᆷ삐", "무 (채소)"],
    ["물", "물"],
    ["밥", "밥"],
    ["식게", "제사"],
    ["멩질", "명절"],
    ["ᄒᆞ나", "하나"],
    ["둘", "둘"],
    ["싯", "셋"],
    ["넷", "넷"],
    ["다숫", "다섯"],
    ["열", "열"],
    ["오널", "오늘"],
    ["ᄂᆞ일", "내일"],
    ["한라산", "한라산"]
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

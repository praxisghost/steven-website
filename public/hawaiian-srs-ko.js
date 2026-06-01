/* hawaiian-srs-ko.js — ʻŌlelo Hawaiʻi for Korean speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 100 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'haw-ko';
  const WORDS = [
    ["aloha", "안녕하세요／안녕히／사랑"],
    ["aloha kakahiaka", "좋은 아침"],
    ["aloha ʻauinalā", "안녕하세요 (오후)"],
    ["aloha ahiahi", "좋은 저녁"],
    ["pehea ʻoe?", "어떻게 지내세요?"],
    ["maikaʻi (au)", "잘 지내요／좋아요"],
    ["mahalo", "감사합니다"],
    ["mahalo nui loa", "정말 감사합니다"],
    ["ʻae", "네"],
    ["ʻaʻole", "아니요"],
    ["e kala mai", "실례합니다／미안합니다"],
    ["ʻoluʻolu", "부디／기분 좋은"],
    ["a hui hou", "또 만나요"],
    ["ʻo wai kou inoa?", "이름이 무엇입니까?"],
    ["ʻo ... koʻu inoa", "제 이름은 …입니다"],
    ["au / wau", "나"],
    ["ʻoe", "너"],
    ["ʻo ia", "그／그녀"],
    ["kāua", "우리 둘 (너와 나)"],
    ["mākou", "우리 (상대 제외)"],
    ["ʻoukou", "너희들"],
    ["lākou", "그들"],
    ["kanaka", "사람"],
    ["kānaka", "사람들"],
    ["kāne", "남자／남편"],
    ["wahine", "여자／아내"],
    ["keiki", "아이"],
    ["makuahine", "어머니"],
    ["makua kāne", "아버지"],
    ["kupuna", "조부모／어른"],
    ["ʻohana", "가족"],
    ["hoaaloha", "친구"],
    ["wai", "물 (민물)"],
    ["kai", "바다"],
    ["moana", "대양"],
    ["ʻāina", "땅"],
    ["lani", "하늘／천국"],
    ["lā", "태양／날"],
    ["mahina", "달"],
    ["hōkū", "별"],
    ["makani", "바람"],
    ["ua", "비"],
    ["pō", "밤"],
    ["pua", "꽃"],
    ["pōhaku", "돌"],
    ["kumu", "선생님／근원／나무"],
    ["ʻai", "먹다／음식"],
    ["iʻa", "물고기"],
    ["puaʻa", "돼지"],
    ["kalo", "타로"],
    ["poi", "포이 (타로 음식)"],
    ["niu", "코코넛"],
    ["meaʻai", "음식"],
    ["inu", "마시다"],
    ["ʻekahi", "하나"],
    ["ʻelua", "둘"],
    ["ʻekolu", "셋"],
    ["ʻehā", "넷"],
    ["ʻelima", "다섯"],
    ["ʻeono", "여섯"],
    ["ʻehiku", "일곱"],
    ["ʻewalu", "여덟"],
    ["ʻeiwa", "아홉"],
    ["ʻumi", "열"],
    ["hele", "가다"],
    ["hele mai", "오다"],
    ["moe", "자다"],
    ["ʻike", "보다／알다"],
    ["lohe", "듣다"],
    ["ʻōlelo", "말하다／언어"],
    ["heluhelu", "읽다"],
    ["kākau", "쓰다"],
    ["hana", "하다／만들다／일"],
    ["makemake", "원하다／좋아하다"],
    ["noho", "앉다／살다"],
    ["kū", "서다"],
    ["aʻo", "배우다／가르치다"],
    ["maikaʻi", "좋은"],
    ["ʻino", "나쁜"],
    ["nui", "큰"],
    ["liʻiliʻi", "작은"],
    ["wela", "더운／뜨거운"],
    ["anuanu", "추운"],
    ["nani", "아름다운"],
    ["wikiwiki", "빠른"],
    ["lōʻihi", "긴／높은"],
    ["aha?", "무엇?"],
    ["ʻo wai?", "누구?"],
    ["hea?", "어디?／어느?"],
    ["ʻehia?", "몇 개?"],
    ["pehea?", "어떻게?"],
    ["no ke aha?", "왜?"],
    ["a", "그리고"],
    ["me", "~와 함께"],
    ["akā", "그러나"],
    ["mauka", "산 쪽으로"],
    ["makai", "바다 쪽으로"],
    ["pono", "올바름／균형"],
    ["mana", "영적 힘"],
    ["kapu", "신성한／금기"]
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

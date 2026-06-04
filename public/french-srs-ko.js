/* french-srs-ko.js — Français for Korean speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 113 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'fr-ko';
  const WORDS = [
    /* --- Greetings / 인사 --- */
    ["bonjour", "안녕하세요 / 좋은 아침이에요"],
    ["bonsoir", "안녕하세요 (저녁 인사)"],
    ["bonne nuit", "안녕히 주무세요"],
    ["salut", "안녕 (친근한 인사)"],
    ["comment allez-vous ?", "잘 지내세요? (격식)"],
    ["ça va ?", "잘 지내요? / 어때요?"],
    ["ça va bien", "잘 지내요 / 괜찮아요"],
    ["merci", "감사합니다"],
    ["merci beaucoup", "정말 감사합니다"],
    ["de rien", "천만에요"],
    ["s'il vous plaît", "부탁드립니다"],
    ["pardon / excusez-moi", "실례합니다 / 죄송합니다"],
    ["oui", "네"],
    ["non", "아니요"],
    ["au revoir", "안녕히 가세요 / 안녕히 계세요"],
    ["à bientôt", "곧 다시 봐요"],
    ["je m'appelle…", "제 이름은 …입니다"],
    ["comment vous appelez-vous ?", "이름이 어떻게 되세요?"],
    /* --- Pronouns / 대명사 --- */
    ["je", "나 / 저 (1인칭)"],
    ["tu", "너 (친근한 2인칭)"],
    ["il / elle", "그 / 그녀 (3인칭)"],
    ["nous", "우리"],
    ["vous", "당신 / 여러분 (격식 2인칭)"],
    ["ils / elles", "그들 / 그녀들 (3인칭 복수)"],
    ["on", "사람들 (구어에서는 '우리')"],
    /* --- People & Family / 사람·가족 --- */
    ["l'homme", "남자"],
    ["la femme", "여자"],
    ["l'enfant", "어린이"],
    ["l'ami / l'amie", "친구"],
    ["la mère", "어머니"],
    ["le père", "아버지"],
    ["le fils", "아들"],
    ["la fille", "딸 / 소녀"],
    ["le frère", "형제"],
    ["la sœur", "자매"],
    ["la famille", "가족"],
    /* --- Places / 장소 --- */
    ["la maison", "집"],
    ["la ville", "도시"],
    ["la rue", "거리 / 길"],
    ["le pays", "나라"],
    ["le monde", "세계"],
    ["la gare", "기차역"],
    ["l'école", "학교"],
    ["le restaurant", "식당 / 레스토랑"],
    /* --- Food & Drink / 음식·음료 --- */
    ["l'eau (f)", "물"],
    ["le pain", "빵"],
    ["le vin", "와인"],
    ["le fromage", "치즈"],
    ["la viande", "고기"],
    ["le poisson", "생선"],
    ["le café", "커피"],
    ["le lait", "우유"],
    ["le sucre", "설탕"],
    ["le sel", "소금"],
    ["la pomme", "사과"],
    ["le riz", "밥 / 쌀"],
    ["la soupe", "수프"],
    ["le gâteau", "케이크"],
    /* --- Numbers / 숫자 --- */
    ["un / une", "하나 / 1"],
    ["deux", "둘 / 2"],
    ["trois", "셋 / 3"],
    ["quatre", "넷 / 4"],
    ["cinq", "다섯 / 5"],
    ["six", "여섯 / 6"],
    ["sept", "일곱 / 7"],
    ["huit", "여덟 / 8"],
    ["neuf", "아홉 / 9"],
    ["dix", "열 / 10"],
    ["vingt", "20 (뱅)"],
    ["cent", "100 (상)"],
    /* --- Core Verbs / 핵심 동사 --- */
    ["être", "~이다 / ~있다 (be동사)"],
    ["avoir", "가지다 / 있다"],
    ["aller", "가다"],
    ["venir", "오다"],
    ["faire", "하다 / 만들다"],
    ["dire", "말하다"],
    ["voir", "보다"],
    ["savoir", "알다"],
    ["pouvoir", "~할 수 있다"],
    ["vouloir", "원하다 / ~하고 싶다"],
    ["devoir", "~해야 한다"],
    ["parler", "말하다 / 이야기하다"],
    ["manger", "먹다"],
    ["boire", "마시다"],
    ["dormir", "자다"],
    ["lire", "읽다"],
    ["écrire", "쓰다"],
    ["travailler", "일하다"],
    ["vivre", "살다"],
    ["comprendre", "이해하다"],
    ["prendre", "가져가다 / 타다"],
    ["aimer", "좋아하다 / 사랑하다"],
    /* --- Adjectives / 형용사 --- */
    ["bon / bonne", "좋은"],
    ["mauvais/e", "나쁜"],
    ["grand/e", "큰"],
    ["petit/e", "작은"],
    ["nouveau / nouvelle", "새로운"],
    ["vieux / vieille", "오래된"],
    ["beau / belle", "아름다운"],
    ["chaud/e", "따뜻한 / 더운"],
    ["froid/e", "차가운 / 추운"],
    ["rapide", "빠른"],
    ["facile", "쉬운"],
    ["difficile", "어려운"],
    /* --- Question Words / 의문사 --- */
    ["quoi ?", "뭐? / 무엇?"],
    ["qui ?", "누구?"],
    ["où ?", "어디?"],
    ["quand ?", "언제?"],
    ["comment ?", "어떻게?"],
    ["combien ?", "얼마? / 몇?"],
    ["pourquoi ?", "왜?"],
    /* --- Connectors / 연결어·전치사 --- */
    ["et", "~와 / 그리고"],
    ["mais", "하지만"],
    ["parce que", "왜냐하면"],
    ["avec", "~와 함께"],
    ["sans", "~없이"],
    ["dans", "~ 안에"],
    ["sur", "~ 위에"],
    ["pour", "~을 위해"],
    /* --- Time / 시간 표현 --- */
    ["aujourd'hui", "오늘"],
    ["demain", "내일"],
    ["hier", "어제"],
    ["maintenant", "지금"],
    ["toujours", "항상"],
    ["jamais", "결코 ~않다"],
    /* --- Colors / 색 --- */
    ["rouge", "빨간"],
    ["bleu/e", "파란"],
    ["vert/e", "초록"],
    ["blanc / blanche", "흰"],
    ["noir/e", "검은"],
    ["jaune", "노란"],
    ["rose", "분홍"]
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

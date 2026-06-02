/* german-srs-ko.js — Deutsch for Korean speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 104 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'de-ko';
  const WORDS = [
    ["Hallo", "안녕하세요"],
    ["Guten Morgen", "좋은 아침입니다"],
    ["Guten Tag", "안녕하세요 (낮)"],
    ["Guten Abend", "안녕하세요 (저녁)"],
    ["Auf Wiedersehen", "안녕히 가세요"],
    ["Tschüss", "잘 가요 (친근한 표현)"],
    ["Wie geht es Ihnen?", "잘 지내세요? (격식체)"],
    ["Wie geht's?", "잘 지내요? (비격식)"],
    ["Danke schön", "감사합니다"],
    ["Bitte", "부탁합니다 / 천만에요"],
    ["Entschuldigung", "실례합니다 / 죄송합니다"],
    ["ja", "네"],
    ["nein", "아니요"],
    ["Wie heißen Sie?", "이름이 뭐예요? (격식)"],
    ["Ich heiße …", "제 이름은 …입니다"],
    ["ich", "나 / 저"],
    ["du", "너"],
    ["er / sie", "그 / 그녀"],
    ["wir", "우리"],
    ["ihr", "너희"],
    ["Sie", "당신 (존댓말)"],
    ["sie (Pl.)", "그들 / 그녀들"],
    ["die Mutter", "어머니"],
    ["der Vater", "아버지"],
    ["der Sohn / die Tochter", "아들 / 딸"],
    ["der Bruder / die Schwester", "형제 / 자매"],
    ["der Freund / die Freundin", "친구"],
    ["die Familie", "가족"],
    ["das Wasser", "물"],
    ["essen", "먹다"],
    ["trinken", "마시다"],
    ["das Brot", "빵"],
    ["der Wein", "와인"],
    ["der Käse", "치즈"],
    ["das Fleisch", "고기"],
    ["der Fisch", "생선"],
    ["die Milch", "우유"],
    ["der Kaffee", "커피"],
    ["der Reis", "쌀 / 밥"],
    ["das Obst", "과일"],
    ["eins", "1 (일)"],
    ["zwei", "2 (이)"],
    ["drei", "3 (삼)"],
    ["vier", "4 (사)"],
    ["fünf", "5 (오)"],
    ["sechs", "6 (육)"],
    ["sieben", "7 (칠)"],
    ["acht", "8 (팔)"],
    ["neun", "9 (구)"],
    ["zehn", "10 (십)"],
    ["zwanzig", "20 (이십)"],
    ["hundert", "100 (백)"],
    ["tausend", "1000 (천)"],
    ["gehen", "가다"],
    ["kommen", "오다"],
    ["sein", "이다 / 있다"],
    ["haben", "가지다 / 있다"],
    ["werden", "되다"],
    ["machen", "하다 / 만들다"],
    ["sagen", "말하다"],
    ["sehen", "보다"],
    ["hören", "듣다"],
    ["sprechen", "말하다 / 이야기하다"],
    ["wissen", "알다 (사실)"],
    ["kennen", "알다 (사람·장소)"],
    ["wollen", "원하다 / 하고 싶다"],
    ["können", "할 수 있다"],
    ["müssen", "해야 한다"],
    ["schlafen", "자다"],
    ["lesen", "읽다"],
    ["schreiben", "쓰다"],
    ["arbeiten", "일하다"],
    ["wohnen", "살다 / 거주하다"],
    ["kaufen", "사다 / 구입하다"],
    ["verstehen", "이해하다"],
    ["gut", "좋은"],
    ["schlecht", "나쁜"],
    ["groß", "큰"],
    ["klein", "작은"],
    ["heiß", "뜨거운"],
    ["kalt", "차가운 / 추운"],
    ["schön", "예쁜 / 아름다운"],
    ["schnell", "빠른"],
    ["neu", "새로운"],
    ["alt", "오래된 / 나이 든"],
    ["Was?", "무엇? / 뭐?"],
    ["Wer?", "누구?"],
    ["Wo?", "어디?"],
    ["Wann?", "언제?"],
    ["Wie?", "어떻게?"],
    ["Wie viel?", "얼마나? / 얼마?"],
    ["Warum?", "왜?"],
    ["und", "그리고 / 와·과"],
    ["mit", "와 함께"],
    ["aber", "하지만 / 그러나"],
    ["weil", "왜냐하면"],
    ["oder", "또는 / 아니면"],
    ["heute", "오늘"],
    ["morgen", "내일"],
    ["gestern", "어제"],
    ["jetzt", "지금"],
    ["das Buch", "책"],
    ["das Haus", "집"],
    ["das Wetter", "날씨"],
    ["Wie viel kostet das?", "얼마예요?"]
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

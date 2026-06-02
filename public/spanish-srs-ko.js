/* spanish-srs-ko.js — Español for Korean speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 104 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'es-ko';
  const WORDS = [
    ["hola", "안녕하세요"],
    ["buenos días", "좋은 아침입니다"],
    ["buenas tardes", "안녕하세요 (오후)"],
    ["buenas noches", "안녕히 주무세요 / 좋은 밤"],
    ["¿cómo estás?", "잘 지내세요?"],
    ["bien", "좋아요 / 잘"],
    ["gracias", "감사합니다"],
    ["muchas gracias", "정말 감사합니다"],
    ["de nada", "천만에요"],
    ["sí", "네 / 예"],
    ["no", "아니요"],
    ["por favor", "부탁드립니다"],
    ["perdón / lo siento", "죄송합니다 / 실례합니다"],
    ["adiós", "안녕히 가세요"],
    ["hasta luego", "나중에 봐요"],
    ["¿cómo te llamas?", "이름이 뭐예요?"],
    ["me llamo ...", "제 이름은 …입니다"],
    ["yo", "나 / 저"],
    ["tú", "너 / 당신"],
    ["él / ella", "그 / 그녀"],
    ["nosotros", "우리"],
    ["vosotros", "너희 (스페인)"],
    ["ellos / ellas", "그들 / 그녀들"],
    ["usted", "당신 (공손한 표현)"],
    ["madre", "어머니"],
    ["padre", "아버지"],
    ["hijo / hija", "아들 / 딸"],
    ["hermano / hermana", "형제 / 자매"],
    ["amigo / amiga", "친구"],
    ["familia", "가족"],
    ["agua", "물"],
    ["comer", "먹다"],
    ["beber", "마시다"],
    ["pan", "빵"],
    ["vino", "와인"],
    ["queso", "치즈"],
    ["carne", "고기"],
    ["pescado", "생선 (요리)"],
    ["leche", "우유"],
    ["café", "커피"],
    ["arroz", "쌀 / 밥"],
    ["fruta", "과일"],
    ["uno", "1 (일)"],
    ["dos", "2 (이)"],
    ["tres", "3 (삼)"],
    ["cuatro", "4 (사)"],
    ["cinco", "5 (오)"],
    ["seis", "6 (육)"],
    ["siete", "7 (칠)"],
    ["ocho", "8 (팔)"],
    ["nueve", "9 (구)"],
    ["diez", "10 (십)"],
    ["veinte", "20 (이십)"],
    ["cien", "100 (백)"],
    ["mil", "1000 (천)"],
    ["ir", "가다"],
    ["venir", "오다"],
    ["ser", "이다 (본질·정체성)"],
    ["estar", "있다 / 이다 (상태·위치)"],
    ["tener", "가지다 / 있다"],
    ["hacer", "하다 / 만들다"],
    ["decir", "말하다"],
    ["ver", "보다"],
    ["oír", "듣다 (들리다)"],
    ["hablar", "말하다 / 이야기하다"],
    ["saber", "알다"],
    ["querer", "원하다 / 좋아하다"],
    ["poder", "할 수 있다"],
    ["dormir", "자다"],
    ["leer", "읽다"],
    ["escribir", "쓰다"],
    ["trabajar", "일하다"],
    ["vivir", "살다"],
    ["comprar", "사다 / 구입하다"],
    ["entender", "이해하다"],
    ["bueno / buena", "좋은"],
    ["malo / mala", "나쁜"],
    ["grande", "큰"],
    ["pequeño / pequeña", "작은"],
    ["caliente", "뜨거운 / 더운"],
    ["frío / fría", "차가운 / 추운"],
    ["bonito / bonita", "예쁜 / 아름다운"],
    ["rápido", "빠른"],
    ["nuevo / nueva", "새로운"],
    ["viejo / vieja", "오래된 / 나이 든"],
    ["¿qué?", "무엇? / 뭐?"],
    ["¿quién?", "누구?"],
    ["¿dónde?", "어디?"],
    ["¿cuándo?", "언제?"],
    ["¿cómo?", "어떻게?"],
    ["¿cuánto?", "얼마나? / 얼마?"],
    ["¿por qué?", "왜?"],
    ["y", "그리고 / 와·과"],
    ["con", "와 함께"],
    ["pero", "하지만 / 그러나"],
    ["porque", "왜냐하면"],
    ["hoy", "오늘"],
    ["mañana", "내일 / 아침"],
    ["ayer", "어제"],
    ["ahora", "지금"],
    ["el libro", "책"],
    ["la casa", "집"],
    ["el tiempo", "날씨 / 시간"],
    ["¿cuánto cuesta?", "얼마예요?"]
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

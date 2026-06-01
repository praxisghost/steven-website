/* spanish-srs-ja.js — Español for Japanese speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 104 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'es-ja';
  const WORDS = [
    ["hola", "やあ／こんにちは"],
    ["buenos días", "おはよう（午前）"],
    ["buenas tardes", "こんにちは（午後）"],
    ["buenas noches", "こんばんは／おやすみ"],
    ["¿cómo estás?", "元気ですか？"],
    ["bien", "元気／よい"],
    ["gracias", "ありがとう"],
    ["muchas gracias", "どうもありがとう"],
    ["de nada", "どういたしまして"],
    ["sí", "はい"],
    ["no", "いいえ"],
    ["por favor", "お願いします"],
    ["perdón / lo siento", "すみません／ごめんなさい"],
    ["adiós", "さようなら"],
    ["hasta luego", "また後で"],
    ["¿cómo te llamas?", "お名前は？"],
    ["me llamo ...", "私の名前は…です"],
    ["yo", "私"],
    ["tú", "君（親しい相手）"],
    ["él / ella", "彼／彼女"],
    ["nosotros", "私たち"],
    ["vosotros", "君たち（スペイン）"],
    ["ellos / ellas", "彼ら／彼女ら"],
    ["usted", "あなた（丁寧）"],
    ["hombre", "男／人"],
    ["mujer", "女"],
    ["niño / niña", "男の子／女の子"],
    ["madre", "母"],
    ["padre", "父"],
    ["hijo / hija", "息子／娘"],
    ["hermano / hermana", "兄弟／姉妹"],
    ["amigo / amiga", "友達"],
    ["familia", "家族"],
    ["agua", "水"],
    ["comer", "食べる"],
    ["beber", "飲む"],
    ["pan", "パン"],
    ["vino", "ワイン"],
    ["queso", "チーズ"],
    ["pescado", "魚（料理）"],
    ["carne", "肉"],
    ["leche", "牛乳"],
    ["café", "コーヒー"],
    ["azúcar", "砂糖"],
    ["sal", "塩"],
    ["uno", "1"],
    ["dos", "2"],
    ["tres", "3"],
    ["cuatro", "4"],
    ["cinco", "5"],
    ["seis", "6"],
    ["siete", "7"],
    ["ocho", "8"],
    ["nueve", "9"],
    ["diez", "10"],
    ["veinte", "20"],
    ["cien", "100"],
    ["mil", "1000"],
    ["ir", "行く"],
    ["venir", "来る"],
    ["ser", "〜である（本質）"],
    ["estar", "〜である（状態・場所）"],
    ["tener", "持っている"],
    ["hacer", "する／作る"],
    ["decir", "言う"],
    ["ver", "見る"],
    ["oír", "聞こえる"],
    ["hablar", "話す"],
    ["saber", "知っている"],
    ["querer", "ほしい／好き"],
    ["poder", "〜できる"],
    ["dormir", "眠る"],
    ["leer", "読む"],
    ["escribir", "書く"],
    ["trabajar", "働く"],
    ["vivir", "生きる／住む"],
    ["bueno", "よい"],
    ["malo", "悪い"],
    ["grande", "大きい"],
    ["pequeño", "小さい"],
    ["caliente", "熱い／暑い"],
    ["frío", "冷たい／寒い"],
    ["bonito", "きれいな／かわいい"],
    ["rápido", "速い"],
    ["despacio", "ゆっくり"],
    ["nuevo", "新しい"],
    ["viejo", "古い／年老いた"],
    ["¿qué?", "何？"],
    ["¿quién?", "誰？"],
    ["¿dónde?", "どこ？"],
    ["¿cuándo?", "いつ？"],
    ["¿cómo?", "どうやって？"],
    ["¿cuánto?", "いくつ？／いくら？"],
    ["¿por qué?", "なぜ？"],
    ["y", "そして／と"],
    ["con", "〜と一緒に"],
    ["pero", "しかし"],
    ["porque", "なぜなら"],
    ["hoy", "今日"],
    ["mañana", "明日／朝"],
    ["ayer", "昨日"],
    ["ahora", "今"],
    ["casa", "家"],
    ["el libro", "本"]
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

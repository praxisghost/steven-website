/* armenian-srs-ru.js — Հայերեն for Russian speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 102 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'hy-ru';
  const WORDS = [
    ["բարև (barev)", "привет"],
    ["բարև ձեզ (barev dzez)", "здравствуйте"],
    ["բարի լույս (bari luys)", "доброе утро"],
    ["բարի երեկո (bari yereko)", "добрый вечер"],
    ["բարի գիշեր (bari gisher)", "спокойной ночи"],
    ["ինչպե՞ս ես (inchpes es)", "как дела?"],
    ["լավ (lav)", "хорошо"],
    ["շնորհակալություն (shnorhakalut'yun)", "спасибо"],
    ["մերսի (mersi)", "спасибо (разг.)"],
    ["խնդրեմ (khndrem)", "пожалуйста"],
    ["այո (ayo)", "да"],
    ["ոչ (voch)", "нет"],
    ["կներեք (knerek)", "извините"],
    ["ցտեսություն (tstesut'yun)", "до свидания"],
    ["ի՞նչ կա (inch ka)", "что нового?"],
    ["ինչպե՞ս է ձեր անունը (… anuny)", "как вас зовут?"],
    ["իմ անունը ... է (im anuny ... e)", "меня зовут ..."],
    ["ես (yes)", "я"],
    ["դու (du)", "ты"],
    ["նա (na)", "он / она"],
    ["մենք (menk)", "мы"],
    ["դուք (duk)", "вы"],
    ["նրանք (nrank)", "они"],
    ["տղամարդ (tghamard)", "мужчина"],
    ["կին (kin)", "женщина"],
    ["երեխա (yerekha)", "ребёнок"],
    ["մայր / մամա (mayr / mama)", "мать / мама"],
    ["հայր / պապա (hayr / papa)", "отец / папа"],
    ["որդի (vordi)", "сын"],
    ["դուստր (dustr)", "дочь"],
    ["եղբայր (yeghbayr)", "брат"],
    ["քույր (kuyr)", "сестра"],
    ["ընկեր (ynker)", "друг"],
    ["ընտանիք (yntanik)", "семья"],
    ["ջուր (jur)", "вода"],
    ["ուտել (utel)", "есть (кушать)"],
    ["խմել (khmel)", "пить"],
    ["հաց (hats)", "хлеб"],
    ["գինի (gini)", "вино"],
    ["պանիր (panir)", "сыр"],
    ["ձուկ (dzuk)", "рыба"],
    ["միս (mis)", "мясо"],
    ["կաթ (kat)", "молоко"],
    ["սուրճ (surch)", "кофе"],
    ["թեյ (tey)", "чай"],
    ["շաքար (shakar)", "сахар"],
    ["աղ (agh)", "соль"],
    ["խնձոր (khndzor)", "яблоко"],
    ["մեկ (mek)", "один"],
    ["երկու (yerku)", "два"],
    ["երեք (yerek)", "три"],
    ["չորս (chors)", "четыре"],
    ["հինգ (hing)", "пять"],
    ["վեց (vets)", "шесть"],
    ["յոթ (yot)", "семь"],
    ["ութ (ut)", "восемь"],
    ["ինը (iny)", "девять"],
    ["տասը (tasy)", "десять"],
    ["քսան (ksan)", "двадцать"],
    ["հարյուր (haryur)", "сто"],
    ["հազար (hazar)", "тысяча"],
    ["գնալ (gnal)", "идти / ехать"],
    ["գալ (gal)", "приходить"],
    ["լինել (linel)", "быть"],
    ["ունենալ (unenal)", "иметь"],
    ["անել (anel)", "делать"],
    ["ասել (asel)", "сказать"],
    ["տեսնել (tesnel)", "видеть"],
    ["լսել (lsel)", "слышать"],
    ["խոսել (khosel)", "говорить"],
    ["իմանալ (imanal)", "знать"],
    ["ուզել (uzel)", "хотеть"],
    ["կարողանալ (karoghanal)", "мочь"],
    ["քնել (knel)", "спать"],
    ["կարդալ (kardal)", "читать"],
    ["գրել (grel)", "писать"],
    ["աշխատել (ashkhatel)", "работать"],
    ["ապրել (aprel)", "жить"],
    ["սիրել (sirel)", "любить"],
    ["լավ (lav, прил.)", "хороший"],
    ["վատ (vat)", "плохой"],
    ["մեծ (mets)", "большой"],
    ["փոքր (pokr)", "маленький"],
    ["տաք (tak)", "горячий / тёплый"],
    ["սառը (sarry)", "холодный"],
    ["գեղեցիկ (geghetsik)", "красивый"],
    ["արագ (arag)", "быстрый"],
    ["դանդաղ (dandagh)", "медленный"],
    ["նոր (nor)", "новый"],
    ["հին (hin)", "старый"],
    ["ի՞նչ (inch)", "что?"],
    ["ո՞վ (ov)", "кто?"],
    ["որտե՞ղ (vortegh)", "где?"],
    ["ե՞րբ (yerb)", "когда?"],
    ["ինչու՞ (inchu)", "почему?"],
    ["և / ու (yev / u)", "и"],
    ["բայց (bayts)", "но"],
    ["այսօր (aysor)", "сегодня"],
    ["վաղը (vaghy)", "завтра"],
    ["հիմա (hima)", "сейчас"],
    ["տուն (tun)", "дом"],
    ["լեզու (lezu)", "язык"]
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

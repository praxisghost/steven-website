/* armenian-srs-en.js — Հայերեն for English speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 102 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'hy-en';
  const WORDS = [
    ["բարև (barev)", "hello"],
    ["բարև ձեզ (barev dzez)", "hello (formal)"],
    ["բարի լույս (bari luys)", "good morning"],
    ["բարի երեկո (bari yereko)", "good evening"],
    ["բարի գիշեր (bari gisher)", "good night"],
    ["ինչպե՞ս ես (inchpes es)", "how are you?"],
    ["լավ (lav)", "good / well"],
    ["շնորհակալություն (shnorhakalut'yun)", "thank you"],
    ["մերսի (mersi)", "thanks (casual)"],
    ["խնդրեմ (khndrem)", "please / you're welcome"],
    ["այո (ayo)", "yes"],
    ["ոչ (voch)", "no"],
    ["կներեք (knerek)", "excuse me / sorry"],
    ["ցտեսություն (tstesut'yun)", "goodbye"],
    ["ի՞նչ կա (inch ka)", "what's up?"],
    ["ինչպե՞ս է ձեր անունը (… anuny)", "what is your name?"],
    ["իմ անունը ... է (im anuny ... e)", "my name is ..."],
    ["ես (yes)", "I"],
    ["դու (du)", "you (sing.)"],
    ["նա (na)", "he / she"],
    ["մենք (menk)", "we"],
    ["դուք (duk)", "you (pl./formal)"],
    ["նրանք (nrank)", "they"],
    ["տղամարդ (tghamard)", "man"],
    ["կին (kin)", "woman"],
    ["երեխա (yerekha)", "child"],
    ["մայր / մամա (mayr / mama)", "mother / mom"],
    ["հայր / պապա (hayr / papa)", "father / dad"],
    ["որդի (vordi)", "son"],
    ["դուստր (dustr)", "daughter"],
    ["եղբայր (yeghbayr)", "brother"],
    ["քույր (kuyr)", "sister"],
    ["ընկեր (ynker)", "friend"],
    ["ընտանիք (yntanik)", "family"],
    ["ջուր (jur)", "water"],
    ["ուտել (utel)", "to eat"],
    ["խմել (khmel)", "to drink"],
    ["հաց (hats)", "bread"],
    ["գինի (gini)", "wine"],
    ["պանիր (panir)", "cheese"],
    ["ձուկ (dzuk)", "fish"],
    ["միս (mis)", "meat"],
    ["կաթ (kat)", "milk"],
    ["սուրճ (surch)", "coffee"],
    ["թեյ (tey)", "tea"],
    ["շաքար (shakar)", "sugar"],
    ["աղ (agh)", "salt"],
    ["խնձոր (khndzor)", "apple"],
    ["մեկ (mek)", "one"],
    ["երկու (yerku)", "two"],
    ["երեք (yerek)", "three"],
    ["չորս (chors)", "four"],
    ["հինգ (hing)", "five"],
    ["վեց (vets)", "six"],
    ["յոթ (yot)", "seven"],
    ["ութ (ut)", "eight"],
    ["ինը (iny)", "nine"],
    ["տասը (tasy)", "ten"],
    ["քսան (ksan)", "twenty"],
    ["հարյուր (haryur)", "hundred"],
    ["հազար (hazar)", "thousand"],
    ["գնալ (gnal)", "to go"],
    ["գալ (gal)", "to come"],
    ["լինել (linel)", "to be"],
    ["ունենալ (unenal)", "to have"],
    ["անել (anel)", "to do / make"],
    ["ասել (asel)", "to say"],
    ["տեսնել (tesnel)", "to see"],
    ["լսել (lsel)", "to hear"],
    ["խոսել (khosel)", "to speak"],
    ["իմանալ (imanal)", "to know"],
    ["ուզել (uzel)", "to want"],
    ["կարողանալ (karoghanal)", "to be able / can"],
    ["քնել (knel)", "to sleep"],
    ["կարդալ (kardal)", "to read"],
    ["գրել (grel)", "to write"],
    ["աշխատել (ashkhatel)", "to work"],
    ["ապրել (aprel)", "to live"],
    ["սիրել (sirel)", "to love"],
    ["լավ (lav, adj.)", "good"],
    ["վատ (vat)", "bad"],
    ["մեծ (mets)", "big"],
    ["փոքր (pokr)", "small"],
    ["տաք (tak)", "hot / warm"],
    ["սառը (sarry)", "cold"],
    ["գեղեցիկ (geghetsik)", "beautiful"],
    ["արագ (arag)", "fast"],
    ["դանդաղ (dandagh)", "slow"],
    ["նոր (nor)", "new"],
    ["հին (hin)", "old"],
    ["ի՞նչ (inch)", "what?"],
    ["ո՞վ (ov)", "who?"],
    ["որտե՞ղ (vortegh)", "where?"],
    ["ե՞րբ (yerb)", "when?"],
    ["ինչու՞ (inchu)", "why?"],
    ["և / ու (yev / u)", "and"],
    ["բայց (bayts)", "but"],
    ["այսօր (aysor)", "today"],
    ["վաղը (vaghy)", "tomorrow"],
    ["հիմա (hima)", "now"],
    ["տուն (tun)", "house / home"],
    ["լեզու (lezu)", "language / tongue"]
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

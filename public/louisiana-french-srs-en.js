/* louisiana-french-srs-en.js — Français louisianais for English speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 66 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'lou-en';
  const WORDS = [
    ["bonjour", "hello / good day"],
    ["salut", "hi"],
    ["comment ça va?", "how's it going?"],
    ["comment les affaires?", "how are things?"],
    ["ça va bien", "I'm doing well"],
    ["comme ci comme ça", "so-so"],
    ["merci", "thank you"],
    ["merci beaucoup", "thank you very much"],
    ["s'il te plaît", "please"],
    ["excuse-moi", "excuse me / sorry"],
    ["au revoir", "goodbye"],
    ["à tout à l'heure", "see you later"],
    ["mais oui", "why yes / of course"],
    ["mais non", "of course not"],
    ["quoi c'est ton nom?", "what's your name?"],
    ["mon nom c'est …", "my name is …"],
    ["cher / chère", "dear (common term of address)"],
    ["asteur", "now"],
    ["icitte", "here"],
    ["là-bas", "over there"],
    ["un char", "a car"],
    ["un piastre", "a dollar"],
    ["de l'argent", "money"],
    ["une maison", "a house"],
    ["du monde", "people / folks"],
    ["un homme", "a man"],
    ["une femme", "a woman"],
    ["un enfant / 'tit", "a child / little one"],
    ["mon père", "my father"],
    ["ma mère", "my mother"],
    ["un ami / une amie", "a friend"],
    ["de l'eau", "water"],
    ["à manger", "food / something to eat"],
    ["de la viande", "meat"],
    ["du pain", "bread"],
    ["du lait", "milk"],
    ["du café", "coffee"],
    ["le gombo", "gumbo"],
    ["le boudin", "boudin (sausage)"],
    ["le travail", "work / job"],
    ["l'école", "school"],
    ["un livre", "a book"],
    ["manger", "to eat"],
    ["boire", "to drink"],
    ["aller", "to go"],
    ["venir", "to come"],
    ["vouloir", "to want"],
    ["savoir / connaître", "to know"],
    ["parler", "to speak"],
    ["voir", "to see"],
    ["entendre", "to hear"],
    ["quoi?", "what?"],
    ["qui?", "who?"],
    ["où?", "where?"],
    ["quand?", "when?"],
    ["pourquoi?", "why?"],
    ["bon", "good"],
    ["mauvais", "bad"],
    ["gros / grand", "big"],
    ["petit", "small"],
    ["fais do-do", "dance party / go to sleep"],
    ["laissez les bons temps rouler", "let the good times roll"],
    ["lagniappe", "a little something extra"],
    ["je t'aime", "I love you"],
    ["je comprends pas", "I don't understand"],
    ["tu parles anglais?", "do you speak English?"]
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

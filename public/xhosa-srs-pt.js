/* xhosa-srs-pt.js — isiXhosa for Portuguese speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 62 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'xh-pt';
  const WORDS = [
    ["molo", "olá (a uma pessoa)"],
    ["molweni", "olá (a várias)"],
    ["unjani?", "como estás? (a uma pessoa)"],
    ["ndiphilile", "estou bem"],
    ["enkosi", "obrigado/a"],
    ["enkosi kakhulu", "muito obrigado/a"],
    ["ewe", "sim"],
    ["hayi", "não"],
    ["nceda", "por favor"],
    ["uxolo", "com licença / desculpa"],
    ["ndicela", "peço / posso ter"],
    ["hamba kakuhle", "vai com bem (adeus)"],
    ["sala kakuhle", "fica bem (adeus)"],
    ["kulungile", "está bem / certo"],
    ["ngubani igama lakho?", "como te chamas?"],
    ["igama lam ngu…", "o meu nome é…"],
    ["umntu", "pessoa"],
    ["abantu", "pessoas"],
    ["umfazi", "mulher / esposa"],
    ["indoda", "homem / marido"],
    ["umntwana", "criança"],
    ["utata", "pai"],
    ["umama", "mãe"],
    ["umhlobo", "amigo/a"],
    ["indlu", "casa"],
    ["ikhaya", "lar"],
    ["amanzi", "água"],
    ["ukutya", "comida"],
    ["inyama", "carne"],
    ["isonka", "pão"],
    ["ubisi", "leite"],
    ["imali", "dinheiro"],
    ["umsebenzi", "trabalho / emprego"],
    ["isikolo", "escola"],
    ["incwadi", "livro / carta"],
    ["imoto", "carro"],
    ["usuku", "dia"],
    ["ubusuku", "noite"],
    ["namhlanje", "hoje"],
    ["ngomso", "amanhã"],
    ["izolo", "ontem"],
    ["ukutya", "comer"],
    ["ukusela", "beber"],
    ["ukuhamba", "ir / andar"],
    ["ukuza", "vir"],
    ["ukufuna", "querer"],
    ["ukwazi", "saber"],
    ["ukuthetha", "falar"],
    ["ukubona", "ver"],
    ["ukuva", "ouvir / entender"],
    ["ntoni?", "o quê?"],
    ["bani?", "quem?"],
    ["phi?", "onde?"],
    ["nini?", "quando?"],
    ["kutheni?", "porquê?"],
    ["-hle", "bonito / bom"],
    ["-bi", "mau / feio"],
    ["-khulu", "grande"],
    ["ncinci", "pequeno"],
    ["ndiyakuthanda", "amo-te"],
    ["andiqondi", "não entendo"],
    ["uyasithetha isiPothugesi?", "falas português?"]
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

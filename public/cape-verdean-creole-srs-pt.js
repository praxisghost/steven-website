/* cape-verdean-creole-srs-pt.js — Kriolu for Portuguese speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 115 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'kea-pt';
  const WORDS = [
    ["olá / oi", "olá"],
    ["bon dia", "bom dia"],
    ["boa tardi", "boa tarde"],
    ["boa noti", "boa noite"],
    ["modi ki bu sta?", "como estás?"],
    ["tudu dretu?", "está tudo bem?"],
    ["N sta dretu", "estou bem"],
    ["tudu bon", "tudo bem"],
    ["obrigadu / obrigada", "obrigado / obrigada"],
    ["sin", "sim"],
    ["nau", "não"],
    ["pur favor", "por favor"],
    ["diskulpa", "desculpa"],
    ["di nada", "de nada"],
    ["te logu", "até logo"],
    ["te dipôs", "até depois"],
    ["bon-vindu", "bem-vindo"],
    ["modi ki bu nomi?", "como te chamas?"],
    ["nha nomi e ...", "o meu nome é ..."],
    ["N / mi", "eu"],
    ["bu / bo", "tu"],
    ["el", "ele / ela"],
    ["nu / nos", "nós"],
    ["nhos", "vocês"],
    ["es", "eles / elas"],
    ["ómi", "homem"],
    ["mudjer", "mulher"],
    ["mininu", "criança / menino"],
    ["mai", "mãe"],
    ["pai", "pai"],
    ["fidju", "filho"],
    ["fidja", "filha"],
    ["irmon", "irmão"],
    ["irma", "irmã"],
    ["avó", "avó / avô"],
    ["amigu", "amigo"],
    ["família", "família"],
    ["agu", "água"],
    ["kume", "comer"],
    ["kumida", "comida"],
    ["pon", "pão"],
    ["pexi", "peixe"],
    ["karni", "carne"],
    ["arrós", "arroz"],
    ["leti", "leite"],
    ["kafé", "café"],
    ["asúkar", "açúcar"],
    ["sal", "sal"],
    ["katchupa", "cachupa (prato nacional)"],
    ["vinhu", "vinho"],
    ["un", "um"],
    ["dôs", "dois"],
    ["três", "três"],
    ["kuatu", "quatro"],
    ["sinku", "cinco"],
    ["sais", "seis"],
    ["séti", "sete"],
    ["oitu", "oito"],
    ["nóvi", "nove"],
    ["dés", "dez"],
    ["vinti", "vinte"],
    ["sen", "cem"],
    ["mil", "mil"],
    ["sta", "estar"],
    ["ten", "ter"],
    ["ba", "ir"],
    ["ben", "vir"],
    ["fla", "dizer"],
    ["papia", "falar"],
    ["odja", "ver"],
    ["obi", "ouvir"],
    ["sabe", "saber"],
    ["kré", "querer"],
    ["pode", "poder"],
    ["bebe", "beber"],
    ["durmi", "dormir"],
    ["lê", "ler"],
    ["skrebe", "escrever"],
    ["trabadja", "trabalhar"],
    ["mora", "morar / viver"],
    ["gosta", "gostar"],
    ["konxe", "conhecer"],
    ["da", "dar"],
    ["bon", "bom"],
    ["mau", "mau"],
    ["grandi", "grande"],
    ["pikinoti", "pequeno"],
    ["kenti", "quente"],
    ["friu", "frio"],
    ["bunitu", "bonito"],
    ["nobu", "novo"],
    ["bedju", "velho"],
    ["dretu", "certo / bem"],
    ["kuzê?", "o quê?"],
    ["ken?", "quem?"],
    ["undi?", "onde?"],
    ["kandu?", "quando?"],
    ["modi?", "como?"],
    ["kantu?", "quanto?"],
    ["pamodi?", "porquê?"],
    ["i", "e"],
    ["ku", "com"],
    ["ma", "mas"],
    ["oji", "hoje"],
    ["manhan", "amanhã"],
    ["onti", "ontem"],
    ["gósi", "agora"],
    ["li", "aqui"],
    ["la", "ali"],
    ["kasa", "casa"],
    ["mar", "mar"],
    ["sol", "sol"],
    ["txuba", "chuva"],
    ["sodadi", "saudade"],
    ["morabeza", "hospitalidade cabo-verdiana"]
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

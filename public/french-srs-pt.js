/* french-srs-pt.js — Français for Portuguese speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 107 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'fr-pt';
  const WORDS = [
    ["bonjour", "bom dia / olá"],
    ["bonsoir", "boa tarde / boa noite"],
    ["bonne nuit", "boa noite"],
    ["salut", "oi / tchau (informal)"],
    ["comment allez-vous ?", "como está? / como vai?"],
    ["ça va ?", "como vai? / tudo bem?"],
    ["ça va bien", "vai bem / estou bem"],
    ["merci", "obrigado/a"],
    ["merci beaucoup", "muito obrigado/a"],
    ["de rien", "de nada"],
    ["s'il vous plaît", "por favor"],
    ["pardon / excusez-moi", "desculpe / com licença"],
    ["oui", "sim"],
    ["non", "não"],
    ["au revoir", "até logo / adeus"],
    ["à bientôt", "até logo / até breve"],
    ["je m'appelle…", "chamo-me… / me chamo…"],
    ["comment vous appelez-vous ?", "como se chama?"],
    ["je", "eu"],
    ["tu", "tu (informal)"],
    ["il / elle", "ele / ela"],
    ["nous", "nós"],
    ["vous", "vocês / o senhor / a senhora"],
    ["ils / elles", "eles / elas"],
    ["on", "a gente / se (impessoal)"],
    ["l'homme", "o homem"],
    ["la femme", "a mulher"],
    ["l'enfant", "a criança"],
    ["l'ami / l'amie", "o amigo / a amiga"],
    ["la mère", "a mãe"],
    ["le père", "o pai"],
    ["le fils", "o filho"],
    ["la fille", "a filha / a rapariga / a menina"],
    ["le frère", "o irmão"],
    ["la sœur", "a irmã"],
    ["la famille", "a família"],
    ["la maison", "a casa"],
    ["la ville", "a cidade"],
    ["la rue", "a rua"],
    ["le pays", "o país"],
    ["le monde", "o mundo"],
    ["l'eau (f)", "a água"],
    ["le pain", "o pão"],
    ["le vin", "o vinho"],
    ["le fromage", "o queijo"],
    ["la viande", "a carne"],
    ["le poisson", "o peixe"],
    ["le café", "o café"],
    ["le lait", "o leite"],
    ["le sucre", "o açúcar"],
    ["le sel", "o sal"],
    ["un / une", "um / uma"],
    ["deux", "dois / duas"],
    ["trois", "três"],
    ["quatre", "quatro"],
    ["cinq", "cinco"],
    ["six", "seis"],
    ["sept", "sete"],
    ["huit", "oito"],
    ["neuf", "nove"],
    ["dix", "dez"],
    ["vingt", "vinte"],
    ["cent", "cem / cento"],
    ["être", "ser / estar"],
    ["avoir", "ter"],
    ["aller", "ir"],
    ["venir", "vir"],
    ["faire", "fazer"],
    ["dire", "dizer"],
    ["voir", "ver"],
    ["savoir", "saber"],
    ["pouvoir", "poder"],
    ["vouloir", "querer"],
    ["devoir", "dever / ter de"],
    ["parler", "falar"],
    ["manger", "comer"],
    ["boire", "beber"],
    ["dormir", "dormir"],
    ["lire", "ler"],
    ["écrire", "escrever"],
    ["travailler", "trabalhar"],
    ["vivre", "viver"],
    ["comprendre", "compreender / perceber"],
    ["prendre", "tomar / pegar"],
    ["bon / bonne", "bom / boa"],
    ["mauvais/e", "mau / má; ruim"],
    ["grand/e", "grande; alto/a"],
    ["petit/e", "pequeno / pequena"],
    ["nouveau / nouvelle", "novo / nova"],
    ["vieux / vieille", "velho / velha"],
    ["beau / belle", "bonito / bonita; belo / bela"],
    ["chaud/e", "quente"],
    ["froid/e", "frio / fria"],
    ["rapide", "rápido / rápida"],
    ["quoi ?", "o quê?"],
    ["qui ?", "quem?"],
    ["où ?", "onde?"],
    ["quand ?", "quando?"],
    ["comment ?", "como?"],
    ["combien ?", "quanto?"],
    ["pourquoi ?", "porquê? / por quê?"],
    ["et", "e"],
    ["mais", "mas"],
    ["parce que", "porque"],
    ["avec", "com"],
    ["du / de la / des", "um pouco de / algum(a) (artigo partitivo)"],
    ["ne… pas", "não (negação dupla em francês)"]
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
  if(!elInfo||!elCard)return;
  let state=loadState(),queue=[],qIdx=0,sessionTotal=0;
  function buildQueue(){
    const due=getDue(state);
    queue=due.map(function(_,i){return WORDS.indexOf(due[i]);});
    // shuffle
    for(let i=queue.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[queue[i],queue[j]]=[queue[j],queue[i]];}
    qIdx=0;sessionTotal=queue.length;
  }
  function showCard(){
    if(qIdx>=queue.length){elDone.style.display='';elCard.style.display='none';elFlip.style.display='none';elControls.style.display='none';elInfo.textContent='Session complete!';elBar.style.width='100%';return;}
    const w=WORDS[queue[qIdx]];
    elFront.textContent=w[0];elBack.textContent=w[1];
    elBack.style.display='none';elFront.style.display='';
    elFlip.style.display='';elControls.style.display='none';
    elDone.style.display='none';elCard.style.display='';
    const done=sessionTotal-queue.length+qIdx;
    elInfo.textContent=(done)+'/'+sessionTotal+' cards';
    elBar.style.width=(sessionTotal?Math.round(done/sessionTotal*100):0)+'%';
  }
  elFlip.addEventListener('click',function(){elBack.style.display='';elFront.style.display='none';elFlip.style.display='none';elControls.style.display='';});
  elAgain.addEventListener('click',function(){state=updateCard(state,queue[qIdx],1);saveState(state);queue.push(queue[qIdx]);qIdx++;showCard();});
  elGood.addEventListener('click',function(){state=updateCard(state,queue[qIdx],4);saveState(state);qIdx++;showCard();});
  elRestart.addEventListener('click',function(){state={};saveState(state);buildQueue();elDone.style.display='none';elCard.style.display='';elFlip.style.display='';showCard();});
  document.addEventListener('keydown',function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
    if((e.code==='Space'||e.code==='Enter')&&elFlip.style.display!=='none'){e.preventDefault();elFlip.click();}
    else if(e.key==='1'&&elControls.style.display!=='none')elAgain.click();
    else if(e.key==='3'&&elControls.style.display!=='none')elGood.click();
  });
  buildQueue();showCard();
})();

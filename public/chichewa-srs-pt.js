/* Chichewa-srs-pt.js — Chichewa for Portuguese speakers.
   Single source of truth: WORDS array is BOTH the SRS deck AND the frequency table.
   SM-2 spaced repetition; progress in localStorage. 162 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = "ny-pt";
  const WORDS = [
  [
    "moni",
    "olá / oi"
  ],
  [
    "moni bambo",
    "olá senhor"
  ],
  [
    "moni mayi",
    "olá senhora"
  ],
  [
    "zikomo",
    "obrigado/a"
  ],
  [
    "zikomo kwambiri",
    "muito obrigado/a"
  ],
  [
    "chonde",
    "por favor"
  ],
  [
    "ndikukhululukani",
    "desculpe / com licença"
  ],
  [
    "inde",
    "sim"
  ],
  [
    "ayi",
    "não"
  ],
  [
    "bwino",
    "bom / bem"
  ],
  [
    "bwino bwino",
    "muito bem / excelente"
  ],
  [
    "muli bwanji?",
    "como vai? / como está?"
  ],
  [
    "nili bwino",
    "estou bem"
  ],
  [
    "mukhale bwino",
    "adeus (lit. fique bem)"
  ],
  [
    "tionana",
    "até logo"
  ],
  [
    "pepani",
    "desculpe / com licença"
  ],
  [
    "sindikumva",
    "não entendo / não compreendo"
  ],
  [
    "chiyani?",
    "o quê?"
  ],
  [
    "ndani?",
    "quem?"
  ],
  [
    "kuti?",
    "onde?"
  ],
  [
    "ndi liti?",
    "quando?"
  ],
  [
    "chifukwa chiyani?",
    "por quê?"
  ],
  [
    "bwanji?",
    "como?"
  ],
  [
    "zingati?",
    "quantos?"
  ],
  [
    "ine",
    "eu / mim"
  ],
  [
    "iwe",
    "tu / você"
  ],
  [
    "iye",
    "ele / ela"
  ],
  [
    "ife",
    "nós"
  ],
  [
    "inu",
    "vós / vocês"
  ],
  [
    "iwo",
    "eles / elas"
  ],
  [
    "nyumba",
    "casa / edifício"
  ],
  [
    "msewu",
    "estrada / caminho / rua"
  ],
  [
    "mudzi",
    "aldeia / cidade natal"
  ],
  [
    "tauni",
    "cidade / localidade"
  ],
  [
    "banja",
    "família"
  ],
  [
    "bambo",
    "pai / Senhor (termo respeitoso)"
  ],
  [
    "mayi",
    "mãe / Senhora (termo respeitoso)"
  ],
  [
    "mwana",
    "criança / filho / filha"
  ],
  [
    "ana",
    "crianças"
  ],
  [
    "mkulu",
    "mais velho / ancião / irmão/irmã mais velho/a"
  ],
  [
    "mng'ono",
    "mais novo/a / menor"
  ],
  [
    "munthu",
    "pessoa"
  ],
  [
    "anthu",
    "pessoas / povo"
  ],
  [
    "wochiritsa",
    "médico / curandeiro"
  ],
  [
    "mphunzitsi",
    "professor(a)"
  ],
  [
    "wogulitsa",
    "vendedor / comerciante"
  ],
  [
    "wogula",
    "comprador"
  ],
  [
    "nthawi",
    "tempo / período / estação"
  ],
  [
    "lero",
    "hoje"
  ],
  [
    "mawa",
    "amanhã"
  ],
  [
    "dzulo",
    "ontem"
  ],
  [
    "usiku",
    "noite"
  ],
  [
    "m'mawa",
    "manhã"
  ],
  [
    "masana",
    "tarde / meio-dia"
  ],
  [
    "madzulo",
    "tarde / noite"
  ],
  [
    "sabata",
    "semana"
  ],
  [
    "mwezi",
    "mês"
  ],
  [
    "chaka",
    "ano"
  ],
  [
    "madzi",
    "água"
  ],
  [
    "chakula",
    "comida / alimentos"
  ],
  [
    "nyama",
    "carne / animal"
  ],
  [
    "nsomba",
    "peixe"
  ],
  [
    "nkhuku",
    "frango / galinha"
  ],
  [
    "mbuzi",
    "cabra"
  ],
  [
    "ng'ombe",
    "vaca / boi"
  ],
  [
    "chimanga",
    "milho"
  ],
  [
    "mbatata",
    "batata / batata-doce"
  ],
  [
    "nsima",
    "ugali / papa espessa de milho (prato principal)"
  ],
  [
    "ndiwo",
    "acompanhamento / molho (com nsima)"
  ],
  [
    "mtedza",
    "amendoim"
  ],
  [
    "moto",
    "fogo / calor / temperatura"
  ],
  [
    "mvula",
    "chuva"
  ],
  [
    "dzuwa",
    "sol / dia"
  ],
  [
    "mphepo",
    "vento"
  ],
  [
    "mtengo",
    "árvore / madeira / preço"
  ],
  [
    "nkhalamba",
    "pessoa idosa / ancião"
  ],
  [
    "mtsikana",
    "rapariga / jovem mulher"
  ],
  [
    "mnyamata",
    "rapaz / jovem homem"
  ],
  [
    "mkazi",
    "mulher / esposa"
  ],
  [
    "mwamuna",
    "homem / marido"
  ],
  [
    "kuganiza",
    "pensar / considerar / planear"
  ],
  [
    "kukumana",
    "encontrar / encontrar-se"
  ],
  [
    "kuyenda",
    "ir / viajar / caminhar"
  ],
  [
    "kubwera",
    "vir"
  ],
  [
    "kukhala",
    "ser / estar / ficar / sentar"
  ],
  [
    "kudya",
    "comer"
  ],
  [
    "kumwa",
    "beber"
  ],
  [
    "kugona",
    "dormir"
  ],
  [
    "kudzuka",
    "acordar / despertar"
  ],
  [
    "kuimba",
    "cantar"
  ],
  [
    "kusewera",
    "jogar / brincar"
  ],
  [
    "kuphunzira",
    "aprender / estudar"
  ],
  [
    "kuphunzitsa",
    "ensinar"
  ],
  [
    "kugwira ntchito",
    "trabalhar"
  ],
  [
    "kukwera",
    "subir / montar"
  ],
  [
    "kupita",
    "ir / passar"
  ],
  [
    "kufika",
    "chegar / alcançar"
  ],
  [
    "kubwerera",
    "voltar / regressar"
  ],
  [
    "kuona",
    "ver / olhar"
  ],
  [
    "kumva",
    "ouvir / sentir / compreender"
  ],
  [
    "kuyankhula",
    "falar / responder"
  ],
  [
    "kufunsa",
    "perguntar"
  ],
  [
    "kuuza",
    "dizer / informar / vender"
  ],
  [
    "kugula",
    "comprar"
  ],
  [
    "kulipira",
    "pagar"
  ],
  [
    "kupereka",
    "dar / oferecer"
  ],
  [
    "kutenga",
    "pegar / carregar / trazer"
  ],
  [
    "kupanga",
    "fazer / criar / fabricar"
  ],
  [
    "kuvala",
    "vestir / usar roupa"
  ],
  [
    "kusamba",
    "banhar-se / lavar-se"
  ],
  [
    "kumanga",
    "construir / amarrar / fechar"
  ],
  [
    "kothyola",
    "quebrar / partir"
  ],
  [
    "kutseka",
    "fechar / trancar"
  ],
  [
    "kutsegula",
    "abrir"
  ],
  [
    "kutumiza",
    "enviar"
  ],
  [
    "kulandila",
    "receber / dar boas-vindas"
  ],
  [
    "kuvomereza",
    "aceitar / concordar"
  ],
  [
    "kukana",
    "recusar / negar"
  ],
  [
    "wabwino",
    "bom / boa (adjetivo)"
  ],
  [
    "woyipa",
    "mau / mau"
  ],
  [
    "wokongola",
    "bonito / bonita"
  ],
  [
    "wafupi",
    "curto / perto"
  ],
  [
    "wotali",
    "alto / longo / longe"
  ],
  [
    "wamkulu",
    "grande / importante"
  ],
  [
    "wamng'ono",
    "pequeno / novo / jovem"
  ],
  [
    "woyera",
    "branco / limpo / puro / sagrado"
  ],
  [
    "wakuda",
    "preto / escuro"
  ],
  [
    "wofiira",
    "vermelho / avermelhado"
  ],
  [
    "mawu",
    "palavras / língua / voz"
  ],
  [
    "chiyankhulo",
    "língua / dialeto"
  ],
  [
    "chichewa",
    "língua chichewa"
  ],
  [
    "chingerezi",
    "língua inglesa"
  ],
  [
    "chifalansa",
    "língua francesa"
  ],
  [
    "chimwemwe",
    "alegria / felicidade"
  ],
  [
    "chisoni",
    "tristeza / pena"
  ],
  [
    "chikondi",
    "amor"
  ],
  [
    "chiyambi",
    "início / começo / origem"
  ],
  [
    "chuma",
    "riqueza / ferro / dinheiro"
  ],
  [
    "ndalama",
    "dinheiro / moeda"
  ],
  [
    "ntchito",
    "trabalho / emprego / tarefa"
  ],
  [
    "malipiro",
    "pagamento / salário"
  ],
  [
    "mphatso",
    "presente / prenda"
  ],
  [
    "chipatala",
    "hospital / clínica"
  ],
  [
    "mankhwala",
    "medicamento / remédio"
  ],
  [
    "odwala",
    "paciente / doente"
  ],
  [
    "choonadi",
    "verdade"
  ],
  [
    "mtendere",
    "paz"
  ],
  [
    "chitukuko",
    "desenvolvimento / progresso"
  ],
  [
    "nzeru",
    "sabedoria / inteligência"
  ],
  [
    "maphunziro",
    "educação / formação"
  ],
  [
    "sukulu",
    "escola"
  ],
  [
    "galimoto",
    "carro / veículo"
  ],
  [
    "ndege",
    "avião / pássaro"
  ],
  [
    "basi",
    "autocarro / ônibus"
  ],
  [
    "njinga",
    "bicicleta"
  ],
  [
    "malamulo",
    "regras / leis"
  ],
  [
    "boma",
    "governo / distrito"
  ],
  [
    "chikhalidwe",
    "cultura / tradição / costume"
  ],
  [
    "nthano",
    "história / conto / mito"
  ],
  [
    "nyimbo",
    "canção / hino"
  ],
  [
    "ng'oma",
    "tambor"
  ],
  [
    "masewero",
    "jogo / desporto / espetáculo"
  ]
];

  /* — render frequency table — */
  (function renderFreqTable() {
    var tbl = document.querySelector('.vocab-freq-table tbody');
    if (!tbl) return;
    WORDS.forEach(function(w, i) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + (i+1) + '</td><td>' + w[0].replace(/&/g,'&amp;').replace(/</g,'&lt;') + '</td><td>' + w[1].replace(/&/g,'&amp;').replace(/</g,'&lt;') + '</td>';
      tbl.appendChild(tr);
    });
  })();

  /* — SRS engine — */
  var elInfo=document.getElementById('srs-info');
  var elBar=document.getElementById('srs-bar');
  var elFront=document.getElementById('srs-front');
  var elBack=document.getElementById('srs-back');
  var elFlip=document.getElementById('srs-flip');
  var elControls=document.getElementById('srs-controls');
  var elAgain=document.getElementById('srs-again');
  var elGood=document.getElementById('srs-good');
  var elDone=document.getElementById('srs-done');
  var elRestart=document.getElementById('srs-restart');
  if(!elInfo)return;

  var STORE='srs_'+PAIR;
  var queue=[];var current=null;

  function loadState(){var s=localStorage.getItem(STORE);return s?JSON.parse(s):{};}
  function saveState(s){localStorage.setItem(STORE,JSON.stringify(s));}
  function isDue(card){if(!card)return true;return Date.now()>=card.due;}

  function buildQueue(){
    var state=loadState();queue=[];
    WORDS.forEach(function(w,i){var card=state[i];if(!card||isDue(card))queue.push(i);});
    if(queue.length===0)queue=WORDS.map(function(_,i){return i;});
    for(var j=queue.length-1;j>0;j--){var k=Math.floor(Math.random()*(j+1));var t=queue[j];queue[j]=queue[k];queue[k]=t;}
  }

  function updateCard(state,idx,rating){
    var c=state[idx]||{i:1,ef:2.5,due:0};
    if(rating>=3){if(c.i===1)c.i=1;else if(c.i===2)c.i=6;else c.i=Math.round(c.i*c.ef);c.ef=Math.max(1.3,c.ef+0.1-(5-rating)*(0.08+(5-rating)*0.02));}else{c.i=1;}
    c.due=Date.now()+c.i*86400000;state[idx]=c;return state;
  }

  function showCard(){
    var state=loadState();
    if(queue.length===0){elDone.style.display='';elFlip.style.display='none';elControls.style.display='none';elInfo.textContent='Done for now!';return;}
    elDone.style.display='none';current=queue.shift();
    var total=WORDS.length;var done=total-queue.length;
    elInfo.textContent='Card '+(done+1)+' / '+total;
    if(elBar)elBar.style.width=Math.round(done/total*100)+'%';
    elFront.textContent=WORDS[current][0];elBack.textContent=WORDS[current][1];
    elBack.style.display='none';elFlip.style.display='';elControls.style.display='none';
  }

  function flip(){elBack.style.display='';elFlip.style.display='none';elControls.style.display='';}

  elFlip.addEventListener('click',flip);
  elAgain.addEventListener('click',function(){var state=loadState();state=updateCard(state,current,1);saveState(state);queue.push(current);current=null;showCard();});
  elGood.addEventListener('click',function(){var state=loadState();state=updateCard(state,current,5);saveState(state);current=null;showCard();});
  if(elRestart)elRestart.addEventListener('click',function(){buildQueue();elDone.style.display='none';showCard();});
  document.addEventListener('keydown',function(e){
    if((e.key===' '||e.key==='Enter')&&elFlip.style.display!=='none'){e.preventDefault();flip();}
    if(e.key==='1'&&elControls.style.display!=='none'){var state=loadState();state=updateCard(state,current,1);saveState(state);queue.push(current);current=null;showCard();}
    if(e.key==='3'&&elControls.style.display!=='none'){var state=loadState();state=updateCard(state,current,5);saveState(state);current=null;showCard();}
  });
  buildQueue();showCard();
})();

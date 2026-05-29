/* Lingala-srs-pt.js — Lingala for Portuguese speakers.
   Single source of truth: WORDS array is BOTH the SRS deck AND the frequency table.
   SM-2 spaced repetition; progress in localStorage. 214 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = "ln-pt";
  const WORDS = [
  [
    "mbote",
    "olá / saudações"
  ],
  [
    "mbote mingi",
    "olá / muitas saudações"
  ],
  [
    "boyei bolamu",
    "bem-vindo/a (lit. vem bem)"
  ],
  [
    "matondo",
    "obrigado/a / gratidão"
  ],
  [
    "matondo mingi",
    "muito obrigado/a"
  ],
  [
    "soki",
    "por favor / se"
  ],
  [
    "nabongi te",
    "não entendo / não compreendo"
  ],
  [
    "koloba",
    "falar / dizer"
  ],
  [
    "komeka",
    "tentar / experimentar"
  ],
  [
    "kotika",
    "parar / deixar / largar"
  ],
  [
    "kokeya",
    "ir"
  ],
  [
    "koya",
    "vir"
  ],
  [
    "kozala",
    "ser / estar / existir / ter"
  ],
  [
    "kolya",
    "comer"
  ],
  [
    "komela",
    "beber"
  ],
  [
    "kolala",
    "dormir"
  ],
  [
    "kofanda",
    "sentar / ficar / morar"
  ],
  [
    "kotomboka",
    "levantar-se"
  ],
  [
    "kokomba",
    "varrer / procurar"
  ],
  [
    "kozwa",
    "pegar / obter / receber"
  ],
  [
    "kopesa",
    "dar"
  ],
  [
    "komona",
    "ver"
  ],
  [
    "koyeba",
    "saber / conhecer"
  ],
  [
    "kobanda",
    "começar / iniciar"
  ],
  [
    "kosilisa",
    "acabar / terminar"
  ],
  [
    "kotambola",
    "caminhar / viajar"
  ],
  [
    "kokende",
    "vamos / ir"
  ],
  [
    "kolanda",
    "seguir / continuar"
  ],
  [
    "kobanga",
    "temer / ter medo"
  ],
  [
    "kolinga",
    "amar / querer / gostar"
  ],
  [
    "kokanisa",
    "pensar / considerar"
  ],
  [
    "kokanga",
    "pegar / fechar / trancar"
  ],
  [
    "kobuka",
    "quebrar / atravessar"
  ],
  [
    "kokela",
    "colocar / pôr / construir"
  ],
  [
    "koteka",
    "vender"
  ],
  [
    "kosomba",
    "comprar"
  ],
  [
    "kobeta",
    "bater / jogar (música)"
  ],
  [
    "kokota",
    "entrar / ir para dentro"
  ],
  [
    "kobima",
    "sair"
  ],
  [
    "kotanga",
    "ler / contar"
  ],
  [
    "kokomba",
    "procurar / varrer"
  ],
  [
    "lelo",
    "hoje"
  ],
  [
    "lobi",
    "amanhã"
  ],
  [
    "loba ya kala",
    "ontem"
  ],
  [
    "suka",
    "fim / parar"
  ],
  [
    "nzoto",
    "corpo"
  ],
  [
    "motó",
    "cabeça"
  ],
  [
    "miso",
    "olhos"
  ],
  [
    "matoyi",
    "orelhas"
  ],
  [
    "monoko",
    "boca"
  ],
  [
    "zolo",
    "nariz"
  ],
  [
    "loboko",
    "braço / mão"
  ],
  [
    "lokolo",
    "perna / pé"
  ],
  [
    "motema",
    "coração"
  ],
  [
    "epai",
    "lugar / localização"
  ],
  [
    "na",
    "em / a / com / e / para"
  ],
  [
    "te",
    "não / negação"
  ],
  [
    "awa",
    "aqui"
  ],
  [
    "kuna",
    "lá / ali"
  ],
  [
    "wapi",
    "onde?"
  ],
  [
    "nani",
    "quem?"
  ],
  [
    "nini",
    "o quê?"
  ],
  [
    "ndenge nini",
    "como?"
  ],
  [
    "tango nini",
    "quando?"
  ],
  [
    "mpo nini",
    "porquê?"
  ],
  [
    "boni",
    "quanto(s)?"
  ],
  [
    "ee",
    "sim"
  ],
  [
    "kasi",
    "mas"
  ],
  [
    "to",
    "ou"
  ],
  [
    "mpe",
    "também / e"
  ],
  [
    "solo",
    "verdade / realmente"
  ],
  [
    "ata",
    "mesmo / apesar de"
  ],
  [
    "sikoyo",
    "agora"
  ],
  [
    "mbala",
    "vez / ocasião"
  ],
  [
    "mbala moko",
    "uma vez"
  ],
  [
    "mbala mingi",
    "muitas vezes / frequentemente"
  ],
  [
    "kala",
    "antigo / antigamente"
  ],
  [
    "malamu",
    "bom / bem / agradável"
  ],
  [
    "mabe",
    "mau / errado / feio"
  ],
  [
    "monene",
    "grande / importante"
  ],
  [
    "moke",
    "pequeno / pouco"
  ],
  [
    "mosusu",
    "outro"
  ],
  [
    "nyonso",
    "tudo / cada"
  ],
  [
    "moto",
    "pessoa / alguém / fogo"
  ],
  [
    "bato",
    "pessoas / gente"
  ],
  [
    "mwasi",
    "mulher / esposa"
  ],
  [
    "mobali",
    "homem / marido"
  ],
  [
    "mwana",
    "criança / filho / filha"
  ],
  [
    "bana",
    "crianças"
  ],
  [
    "tata",
    "pai / Sr."
  ],
  [
    "mama",
    "mãe / Sra."
  ],
  [
    "ndeko",
    "irmão / amigo / parente"
  ],
  [
    "monganga",
    "médico / curandeiro"
  ],
  [
    "mosali",
    "trabalhador / empregado"
  ],
  [
    "mokonzi",
    "chefe / líder / patrão"
  ],
  [
    "mokambi",
    "guia / director"
  ],
  [
    "lopango",
    "pátio / cerca / recinto"
  ],
  [
    "ndako",
    "casa / edifício"
  ],
  [
    "liboso",
    "frente / antes / primeiro"
  ],
  [
    "nsima",
    "depois / atrás"
  ],
  [
    "likoló",
    "cima / céu / acima"
  ],
  [
    "nse",
    "baixo / abaixo / chão"
  ],
  [
    "kati",
    "interior / meio / entre"
  ],
  [
    "libanda",
    "exterior / estrangeiro"
  ],
  [
    "penepene",
    "perto / próximo"
  ],
  [
    "mosika",
    "longe / distante"
  ],
  [
    "makasi",
    "forte / duro / poderoso"
  ],
  [
    "nkembo",
    "glória / honra"
  ],
  [
    "bolingo",
    "amor / afeto"
  ],
  [
    "ntalo",
    "preço / valor"
  ],
  [
    "mbongo",
    "dinheiro / riqueza"
  ],
  [
    "biloko",
    "coisas / mercadorias"
  ],
  [
    "eloko",
    "coisa / objeto"
  ],
  [
    "esika",
    "lugar / posição"
  ],
  [
    "loposo",
    "país / estrangeiro"
  ],
  [
    "mboka",
    "aldeia / cidade natal / país"
  ],
  [
    "etuka",
    "bairro / zona"
  ],
  [
    "engumba",
    "cidade / localidade"
  ],
  [
    "ngai",
    "eu / mim / meu"
  ],
  [
    "yo",
    "tu / você / teu"
  ],
  [
    "ye",
    "ele / ela / seu/sua"
  ],
  [
    "biso",
    "nós / nosso"
  ],
  [
    "bino",
    "vós / vocês / vosso"
  ],
  [
    "bango",
    "eles / elas / seu/sua (deles)"
  ],
  [
    "oyo",
    "este / esta / estes"
  ],
  [
    "wana",
    "aquele / aquela / ali"
  ],
  [
    "elanga",
    "fazenda / jardim / campo"
  ],
  [
    "mbisi",
    "peixe"
  ],
  [
    "nyama",
    "carne / animal"
  ],
  [
    "mbuma",
    "fruta / semente"
  ],
  [
    "makemba",
    "plátanos / bananas"
  ],
  [
    "mai",
    "água"
  ],
  [
    "lotoko",
    "álcool tradicional / bebida"
  ],
  [
    "sango",
    "notícias / informação"
  ],
  [
    "lisapo",
    "história / conto / fábula"
  ],
  [
    "nzela",
    "caminho / estrada / via"
  ],
  [
    "sukali",
    "açúcar"
  ],
  [
    "mungwa",
    "sal"
  ],
  [
    "mafuta",
    "óleo / gordura / combustível"
  ],
  [
    "nsango",
    "notícias / mensagem / evangelho"
  ],
  [
    "kelasi",
    "aula / escola"
  ],
  [
    "mpembe",
    "branco"
  ],
  [
    "ndombe",
    "preto"
  ],
  [
    "pupa",
    "vermelho / amarelo"
  ],
  [
    "langi",
    "cor / tinta"
  ],
  [
    "kokangama",
    "ficar preso / pendurado"
  ],
  [
    "kolakisa",
    "mostrar / ensinar"
  ],
  [
    "kosalisa",
    "ajudar / assistir"
  ],
  [
    "kotombola",
    "carregar / levantar"
  ],
  [
    "kozela",
    "esperar"
  ],
  [
    "kozongela",
    "responder / voltar"
  ],
  [
    "koyoka",
    "ouvir / sentir / obedecer"
  ],
  [
    "kopona",
    "cair / escolher"
  ],
  [
    "kobakisa",
    "acrescentar / aumentar"
  ],
  [
    "kokata",
    "cortar"
  ],
  [
    "kofuta",
    "pagar"
  ],
  [
    "kobongisa",
    "preparar / consertar"
  ],
  [
    "kosangana",
    "reunir / encontrar-se"
  ],
  [
    "koleka",
    "passar / ultrapassar / atravessar"
  ],
  [
    "kobalisa",
    "informar / notificar"
  ],
  [
    "kobunga",
    "misturar / confundir / se perder"
  ],
  [
    "kotombela",
    "carregar para"
  ],
  [
    "kopesela",
    "dar a"
  ],
  [
    "koyebisa",
    "informar / fazer saber"
  ],
  [
    "kosalela",
    "trabalhar para / servir"
  ],
  [
    "esika oyo",
    "aqui / este lugar"
  ],
  [
    "tango oyo",
    "agora / este momento"
  ],
  [
    "mbula",
    "chuva / ano"
  ],
  [
    "moyi",
    "sol / dia / luz do dia"
  ],
  [
    "butu",
    "noite"
  ],
  [
    "tongo",
    "madrugada / manhã"
  ],
  [
    "midi",
    "meio-dia"
  ],
  [
    "mpokwa",
    "tarde / entardecer"
  ],
  [
    "eleko",
    "estação / período / era"
  ],
  [
    "ntango",
    "tempo / período"
  ],
  [
    "sanza",
    "mês / lua"
  ],
  [
    "poso",
    "semana"
  ],
  [
    "ye akei",
    "ele/ela foi"
  ],
  [
    "ye azali",
    "ele/ela está"
  ],
  [
    "biso tozali",
    "nós estamos"
  ],
  [
    "nakei",
    "eu fui"
  ],
  [
    "nakoya",
    "eu virei"
  ],
  [
    "nazali",
    "eu estou"
  ],
  [
    "ozali",
    "tu estás"
  ],
  [
    "azali",
    "ele/ela/está"
  ],
  [
    "tozali",
    "nós estamos"
  ],
  [
    "bango bazali",
    "eles/elas estão"
  ],
  [
    "moto moko",
    "uma pessoa"
  ],
  [
    "bato mibale",
    "duas pessoas"
  ],
  [
    "ndako moko",
    "uma casa"
  ],
  [
    "biloko mingi",
    "muitas coisas"
  ],
  [
    "mbongo mingi",
    "muito dinheiro"
  ],
  [
    "liboso ya",
    "antes / à frente de"
  ],
  [
    "nsima ya",
    "depois / atrás de"
  ],
  [
    "kati ya",
    "dentro de / entre / no meio de"
  ],
  [
    "banda",
    "desde / a partir de"
  ],
  [
    "tii",
    "até / até onde"
  ],
  [
    "ntina",
    "razão / causa / raiz"
  ],
  [
    "ndenge",
    "maneira / modo / como"
  ],
  [
    "ndenge moko",
    "do mesmo modo / igual"
  ],
  [
    "tosali nini",
    "o que vamos fazer?"
  ],
  [
    "tokeya wapi",
    "para onde vamos?"
  ],
  [
    "nakosalisa yo",
    "vou ajudar-te / vou ajudá-lo"
  ],
  [
    "ozali malamu?",
    "estás bem?"
  ],
  [
    "nazali malamu",
    "estou bem"
  ],
  [
    "osali nini?",
    "o que fizeste?"
  ],
  [
    "nakei kelasi",
    "fui à escola"
  ],
  [
    "akoya lobi",
    "ele/ela virá amanhã"
  ],
  [
    "tokei lisanga",
    "fomos juntos"
  ],
  [
    "epai ya nani?",
    "onde? / casa de quem?"
  ],
  [
    "epai ya monganga",
    "no médico"
  ],
  [
    "esika ya malamu",
    "um bom lugar"
  ],
  [
    "ntalo ya biloko",
    "preço das coisas"
  ],
  [
    "mbongo ya kofuta",
    "dinheiro para pagar"
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

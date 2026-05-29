/* Swahili-srs-pt.js — Swahili for Portuguese speakers.
   Single source of truth: WORDS array is BOTH the SRS deck AND the frequency table.
   SM-2 spaced repetition; progress in localStorage. 255 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = "sw-pt";
  const WORDS = [
  [
    "habari",
    "notícias / como vai? (lit. que notícias?)"
  ],
  [
    "habari gani?",
    "como vai? / como está?"
  ],
  [
    "nzuri",
    "bem / bom"
  ],
  [
    "asante",
    "obrigado/a"
  ],
  [
    "asante sana",
    "muito obrigado/a"
  ],
  [
    "tafadhali",
    "por favor"
  ],
  [
    "samahani",
    "desculpe / com licença"
  ],
  [
    "ndio",
    "sim"
  ],
  [
    "hapana / la",
    "não"
  ],
  [
    "karibu",
    "bem-vindo/a / de nada"
  ],
  [
    "karibu sana",
    "muito bem-vindo/a"
  ],
  [
    "sawa",
    "está bem / de acordo"
  ],
  [
    "sawa sawa",
    "muito bem / tudo certo"
  ],
  [
    "pole",
    "sinto muito / pésames"
  ],
  [
    "pole pole",
    "devagar / aos poucos"
  ],
  [
    "haraka",
    "depressa / rápido"
  ],
  [
    "pamoja",
    "juntos"
  ],
  [
    "safi",
    "limpo / puro / fixe"
  ],
  [
    "bado",
    "ainda não / ainda / mais"
  ],
  [
    "tayari",
    "já / pronto"
  ],
  [
    "kwisha",
    "acabado / terminado / já"
  ],
  [
    "kabla",
    "antes"
  ],
  [
    "baada",
    "depois"
  ],
  [
    "sasa",
    "agora"
  ],
  [
    "kesho",
    "amanhã"
  ],
  [
    "jana",
    "ontem"
  ],
  [
    "leo",
    "hoje"
  ],
  [
    "usiku",
    "noite"
  ],
  [
    "asubuhi",
    "manhã"
  ],
  [
    "mchana",
    "tarde / meio-dia"
  ],
  [
    "jioni",
    "tarde / fim de tarde"
  ],
  [
    "wiki",
    "semana"
  ],
  [
    "mwezi",
    "mês"
  ],
  [
    "mwaka",
    "ano"
  ],
  [
    "wakati",
    "tempo / quando / momento"
  ],
  [
    "mara",
    "vez"
  ],
  [
    "mara nyingi",
    "muitas vezes / frequentemente"
  ],
  [
    "mara moja",
    "imediatamente / uma vez"
  ],
  [
    "kidogo",
    "um pouco / pouco"
  ],
  [
    "mengi",
    "muito / muitos (coisas)"
  ],
  [
    "wengi",
    "muitos / a maioria (pessoas)"
  ],
  [
    "sana",
    "muito"
  ],
  [
    "kabisa",
    "completamente / totalmente"
  ],
  [
    "tu",
    "só / apenas"
  ],
  [
    "pia",
    "também / igualmente"
  ],
  [
    "au",
    "ou"
  ],
  [
    "na",
    "e / com / por"
  ],
  [
    "lakini",
    "mas"
  ],
  [
    "kwa sababu",
    "porque"
  ],
  [
    "ili",
    "para que / a fim de"
  ],
  [
    "kama",
    "se / como / aproximadamente"
  ],
  [
    "kwamba",
    "que (conjunção)"
  ],
  [
    "yeye",
    "ele / ela"
  ],
  [
    "mimi",
    "eu / mim"
  ],
  [
    "wewe",
    "tu / você"
  ],
  [
    "sisi",
    "nós"
  ],
  [
    "ninyi",
    "vós / vocês"
  ],
  [
    "wao",
    "eles / elas / seu"
  ],
  [
    "mtu",
    "pessoa / alguém"
  ],
  [
    "watu",
    "povo / pessoas"
  ],
  [
    "mtoto",
    "criança"
  ],
  [
    "watoto",
    "crianças"
  ],
  [
    "mzee",
    "ancião / idoso / sábio"
  ],
  [
    "mama",
    "mãe / Sra."
  ],
  [
    "baba",
    "pai / Sr."
  ],
  [
    "kaka",
    "irmão"
  ],
  [
    "dada",
    "irmã"
  ],
  [
    "ndugu",
    "irmão / irmã / família / camarada"
  ],
  [
    "rafiki",
    "amigo/a"
  ],
  [
    "mwalimu",
    "professor(a) / mestre"
  ],
  [
    "daktari",
    "médico / doutor"
  ],
  [
    "polisi",
    "polícia"
  ],
  [
    "mwanafunzi",
    "estudante / aluno"
  ],
  [
    "mfanyabiashara",
    "comerciante / empresário"
  ],
  [
    "bwana",
    "senhor / Senhor"
  ],
  [
    "bibi",
    "avó / Senhora"
  ],
  [
    "nyumba",
    "casa / edifício"
  ],
  [
    "chumba",
    "quarto / divisão"
  ],
  [
    "mlango",
    "porta"
  ],
  [
    "dirisha",
    "janela"
  ],
  [
    "meza",
    "mesa"
  ],
  [
    "kiti",
    "cadeira"
  ],
  [
    "kitanda",
    "cama"
  ],
  [
    "jiko",
    "fogão / fogareiro"
  ],
  [
    "bafu",
    "casa de banho / banho"
  ],
  [
    "choo",
    "casa de banho / banheiro / WC"
  ],
  [
    "shule",
    "escola"
  ],
  [
    "hospitali",
    "hospital"
  ],
  [
    "kanisa",
    "igreja"
  ],
  [
    "msikiti",
    "mesquita"
  ],
  [
    "soko",
    "mercado"
  ],
  [
    "duka",
    "loja / mercearia"
  ],
  [
    "benki",
    "banco"
  ],
  [
    "ofisi",
    "escritório"
  ],
  [
    "barabara",
    "rua / estrada / autoestrada"
  ],
  [
    "njia",
    "caminho / via / meio"
  ],
  [
    "mto",
    "rio / curso de água"
  ],
  [
    "ziwa",
    "lago"
  ],
  [
    "bahari",
    "mar / oceano"
  ],
  [
    "milima",
    "montanhas"
  ],
  [
    "msitu",
    "floresta"
  ],
  [
    "jangwa",
    "deserto"
  ],
  [
    "shamba",
    "fazenda / campo / jardim"
  ],
  [
    "mji",
    "cidade / localidade"
  ],
  [
    "nchi",
    "país"
  ],
  [
    "dunia",
    "mundo / terra"
  ],
  [
    "maji",
    "água"
  ],
  [
    "chakula",
    "comida / alimentos"
  ],
  [
    "mkate",
    "pão"
  ],
  [
    "mchele",
    "arroz (cru)"
  ],
  [
    "wali",
    "arroz (cozido)"
  ],
  [
    "mahindi",
    "milho"
  ],
  [
    "ndizi",
    "bananas"
  ],
  [
    "nyanya",
    "tomates"
  ],
  [
    "vitunguu",
    "cebolas"
  ],
  [
    "nyama",
    "carne"
  ],
  [
    "samaki",
    "peixe"
  ],
  [
    "kuku",
    "frango / galinha"
  ],
  [
    "mayai",
    "ovos"
  ],
  [
    "maziwa",
    "leite"
  ],
  [
    "sukari",
    "açúcar"
  ],
  [
    "chumvi",
    "sal"
  ],
  [
    "mafuta",
    "óleo / gordura"
  ],
  [
    "chai",
    "chá"
  ],
  [
    "kahawa",
    "café"
  ],
  [
    "pombe",
    "álcool / cerveja"
  ],
  [
    "kula",
    "comer"
  ],
  [
    "kunywa",
    "beber"
  ],
  [
    "kupika",
    "cozinhar"
  ],
  [
    "kulala",
    "dormir"
  ],
  [
    "kuamka",
    "acordar"
  ],
  [
    "kusimama",
    "levantar / parar / ficar de pé"
  ],
  [
    "kukaa",
    "sentar / ficar / morar"
  ],
  [
    "kutembea",
    "caminhar / passear / viajar"
  ],
  [
    "kwenda",
    "ir"
  ],
  [
    "kuja",
    "vir"
  ],
  [
    "kurudi",
    "voltar / regressar"
  ],
  [
    "kuingia",
    "entrar"
  ],
  [
    "kutoka",
    "sair / vir de / partir"
  ],
  [
    "kusema",
    "dizer / falar"
  ],
  [
    "kusikia",
    "ouvir / sentir"
  ],
  [
    "kuona",
    "ver"
  ],
  [
    "kujua",
    "saber / conhecer"
  ],
  [
    "kufanya",
    "fazer"
  ],
  [
    "kusaidia",
    "ajudar"
  ],
  [
    "kutaka",
    "querer"
  ],
  [
    "kupenda",
    "amar / gostar"
  ],
  [
    "kucheza",
    "jogar / brincar"
  ],
  [
    "kufanya kazi",
    "trabalhar"
  ],
  [
    "kusoma",
    "ler / estudar"
  ],
  [
    "kuandika",
    "escrever"
  ],
  [
    "kuhesabu",
    "contar / calcular"
  ],
  [
    "kupata",
    "obter / encontrar / receber"
  ],
  [
    "kulipa",
    "pagar"
  ],
  [
    "kununua",
    "comprar"
  ],
  [
    "kuuza",
    "vender"
  ],
  [
    "kutoa",
    "dar / retirar"
  ],
  [
    "kuchukua",
    "pegar / tomar"
  ],
  [
    "kupeleka",
    "enviar / levar"
  ],
  [
    "kuleta",
    "trazer"
  ],
  [
    "kufungua",
    "abrir"
  ],
  [
    "kufunga",
    "fechar"
  ],
  [
    "kusafisha",
    "limpar"
  ],
  [
    "kujenga",
    "construir"
  ],
  [
    "kukata",
    "cortar"
  ],
  [
    "kupiga",
    "bater / golpear"
  ],
  [
    "kuvunja",
    "quebrar"
  ],
  [
    "kuomba",
    "pedir / rezar"
  ],
  [
    "kujibu",
    "responder"
  ],
  [
    "kuuliza",
    "perguntar"
  ],
  [
    "kufundisha",
    "ensinar"
  ],
  [
    "kujifunza",
    "aprender"
  ],
  [
    "kubwa",
    "grande / importante"
  ],
  [
    "ndogo",
    "pequeno / pouco"
  ],
  [
    "nzuri",
    "bom / bonito / bem"
  ],
  [
    "mbaya",
    "mau / feio"
  ],
  [
    "kali",
    "forte / duro / picante / zangado"
  ],
  [
    "laini",
    "suave / tenro / mole"
  ],
  [
    "nyeupe",
    "branco"
  ],
  [
    "nyeusi",
    "preto"
  ],
  [
    "nyekundu",
    "vermelho"
  ],
  [
    "njano",
    "amarelo"
  ],
  [
    "kijani",
    "verde"
  ],
  [
    "buluu",
    "azul"
  ],
  [
    "moja",
    "um"
  ],
  [
    "mbili",
    "dois"
  ],
  [
    "tatu",
    "três"
  ],
  [
    "nne",
    "quatro"
  ],
  [
    "tano",
    "cinco"
  ],
  [
    "sita",
    "seis"
  ],
  [
    "saba",
    "sete"
  ],
  [
    "nane",
    "oito"
  ],
  [
    "tisa",
    "nove"
  ],
  [
    "kumi",
    "dez"
  ],
  [
    "ishirini",
    "vinte"
  ],
  [
    "thelathini",
    "trinta"
  ],
  [
    "mia",
    "cem"
  ],
  [
    "elfu",
    "mil"
  ],
  [
    "nusu",
    "metade"
  ],
  [
    "asilimia",
    "percentagem / juro"
  ],
  [
    "lugha",
    "língua / idioma"
  ],
  [
    "neno",
    "palavra"
  ],
  [
    "sentensi",
    "frase"
  ],
  [
    "sarufi",
    "gramática"
  ],
  [
    "msamiati",
    "vocabulário"
  ],
  [
    "matamshi",
    "pronúncia"
  ],
  [
    "darasa",
    "turma / aula / lição"
  ],
  [
    "kitabu",
    "livro"
  ],
  [
    "kalamu",
    "caneta / lápis"
  ],
  [
    "karatasi",
    "papel"
  ],
  [
    "kompyuta",
    "computador"
  ],
  [
    "simu",
    "telefone"
  ],
  [
    "mtandao",
    "internet / rede"
  ],
  [
    "televisheni",
    "televisão"
  ],
  [
    "redio",
    "rádio"
  ],
  [
    "picha",
    "foto / imagem"
  ],
  [
    "wimbo",
    "canção / música"
  ],
  [
    "ngoma",
    "tambor / música / festa"
  ],
  [
    "mchezo",
    "jogo / desporto / espetáculo"
  ],
  [
    "saa",
    "hora / relógio"
  ],
  [
    "dakika",
    "minuto"
  ],
  [
    "sekunde",
    "segundo"
  ],
  [
    "nambari",
    "número"
  ],
  [
    "tarehe",
    "data"
  ],
  [
    "jina",
    "nome"
  ],
  [
    "habari",
    "informação / notícia"
  ],
  [
    "historia",
    "história"
  ],
  [
    "sayansi",
    "ciência"
  ],
  [
    "hisabati",
    "matemática"
  ],
  [
    "sheria",
    "direito / lei"
  ],
  [
    "dini",
    "religião"
  ],
  [
    "siasa",
    "política"
  ],
  [
    "uchumi",
    "economia / riqueza"
  ],
  [
    "pesa",
    "dinheiro"
  ],
  [
    "kazi",
    "trabalho / emprego"
  ],
  [
    "mishahara",
    "salário"
  ],
  [
    "afya",
    "saúde"
  ],
  [
    "mgonjwa",
    "doente / paciente"
  ],
  [
    "dawa",
    "medicamento"
  ],
  [
    "kwaheri",
    "adeus / até logo"
  ],
  [
    "tutaonana",
    "até breve / até a próxima"
  ],
  [
    "lala salama",
    "boa noite (lit. dorme em paz)"
  ],
  [
    "safari njema",
    "boa viagem"
  ],
  [
    "asante kwa kila kitu",
    "obrigado/a por tudo"
  ],
  [
    "samahani sana",
    "muito desculpe"
  ],
  [
    "sikusikia",
    "não ouvi"
  ],
  [
    "sijui",
    "não sei"
  ],
  [
    "sielewi",
    "não compreendo"
  ],
  [
    "ninahitaji",
    "preciso de"
  ],
  [
    "ninaweza",
    "posso / sou capaz"
  ],
  [
    "labda",
    "talvez"
  ],
  [
    "bila shaka",
    "sem dúvida / certamente"
  ],
  [
    "kweli",
    "verdade / verdadeiro"
  ],
  [
    "sivyo?",
    "não é? / não?"
  ],
  [
    "ndiyo hivyo",
    "é isso mesmo / exatamente"
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

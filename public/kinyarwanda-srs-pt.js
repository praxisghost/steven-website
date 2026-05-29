/* Kinyarwanda-srs-pt.js — Kinyarwanda for Portuguese speakers.
   Single source of truth: WORDS array is BOTH the SRS deck AND the
   data rendered into the page frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 353 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = "ki-pt";
  const WORDS = [
  [
    "muraho",
    "olá (formal)"
  ],
  [
    "bite",
    "olá / como vai? (informal)"
  ],
  [
    "murakoze",
    "obrigado/a"
  ],
  [
    "murakoze cyane",
    "muito obrigado/a"
  ],
  [
    "yego",
    "sim"
  ],
  [
    "oya",
    "não"
  ],
  [
    "mfashe",
    "por favor / ajude-me"
  ],
  [
    "murakaza neza",
    "bem-vindo/a"
  ],
  [
    "amahoro",
    "paz / olá"
  ],
  [
    "nibyo",
    "isso mesmo / com certeza"
  ],
  [
    "nta",
    "não / nenhum"
  ],
  [
    "bwana",
    "senhor"
  ],
  [
    "nyakubahwa",
    "honorável / respeitado"
  ],
  [
    "inshuti",
    "amigo/a"
  ],
  [
    "umuryango",
    "família / porta"
  ],
  [
    "ababyeyi",
    "pais"
  ],
  [
    "se",
    "pai"
  ],
  [
    "nyina",
    "mãe"
  ],
  [
    "mukuru",
    "mais velho / irmão ou irmã mais velho/a"
  ],
  [
    "murumuna",
    "irmão ou irmã mais novo/a"
  ],
  [
    "umugabo",
    "homem / marido"
  ],
  [
    "umugore",
    "mulher / esposa"
  ],
  [
    "umwana",
    "criança"
  ],
  [
    "abana",
    "crianças"
  ],
  [
    "umuntu",
    "pessoa"
  ],
  [
    "abantu",
    "pessoas / povo"
  ],
  [
    "undi",
    "outro/a"
  ],
  [
    "buri",
    "cada / todo"
  ],
  [
    "wa",
    "de (possessivo)"
  ],
  [
    "ni",
    "é / sou / são"
  ],
  [
    "na",
    "e / com / também"
  ],
  [
    "ariko",
    "mas / contudo"
  ],
  [
    "kuko",
    "porque"
  ],
  [
    "kugira ngo",
    "para / a fim de"
  ],
  [
    "niba",
    "se"
  ],
  [
    "igihe",
    "tempo / quando"
  ],
  [
    "none",
    "agora / então"
  ],
  [
    "rero",
    "portanto / então"
  ],
  [
    "mbere",
    "antes / à frente"
  ],
  [
    "nyuma",
    "depois / atrás"
  ],
  [
    "hafi",
    "perto / quase"
  ],
  [
    "kure",
    "longe"
  ],
  [
    "hino",
    "aqui"
  ],
  [
    "hariya",
    "ali / lá"
  ],
  [
    "aho",
    "lá / onde"
  ],
  [
    "iki",
    "isto / o quê?"
  ],
  [
    "icyo",
    "aquilo"
  ],
  [
    "uyu",
    "este/a (pessoa)"
  ],
  [
    "uwo",
    "aquele/a (pessoa)"
  ],
  [
    "aba",
    "estes/as (pessoas)"
  ],
  [
    "izo",
    "aqueles/as"
  ],
  [
    "gute",
    "como?"
  ],
  [
    "nde",
    "quem?"
  ],
  [
    "he",
    "onde?"
  ],
  [
    "ryari",
    "quando?"
  ],
  [
    "kuki",
    "por quê?"
  ],
  [
    "angahe",
    "quantos?"
  ],
  [
    "kumva",
    "ouvir / compreender / sentir"
  ],
  [
    "kuvuga",
    "falar / dizer"
  ],
  [
    "gusobanura",
    "explicar"
  ],
  [
    "kwandika",
    "escrever"
  ],
  [
    "gusoma",
    "ler"
  ],
  [
    "kwiga",
    "estudar / aprender"
  ],
  [
    "gukora",
    "trabalhar / fazer"
  ],
  [
    "kuva",
    "vir de / partir"
  ],
  [
    "kuja",
    "vir"
  ],
  [
    "kugenda",
    "ir / andar"
  ],
  [
    "gutura",
    "morar / residir"
  ],
  [
    "kuririmba",
    "cantar"
  ],
  [
    "kurarika",
    "dormir"
  ],
  [
    "kuzinduka",
    "acordar"
  ],
  [
    "gufata",
    "pegar / segurar / agarrar"
  ],
  [
    "guha",
    "dar"
  ],
  [
    "kubona",
    "ver / encontrar / obter"
  ],
  [
    "kureba",
    "olhar / observar"
  ],
  [
    "gusobanukirwa",
    "compreender bem"
  ],
  [
    "kwibuka",
    "lembrar / recordar"
  ],
  [
    "kurima",
    "cultivar / lavrar"
  ],
  [
    "kugura",
    "comprar"
  ],
  [
    "kugurisha",
    "vender"
  ],
  [
    "kurya",
    "comer"
  ],
  [
    "kunywa",
    "beber"
  ],
  [
    "gufungura",
    "abrir / fazer uma refeição"
  ],
  [
    "gufunga",
    "fechar / trancar"
  ],
  [
    "kuvoma",
    "ir buscar água"
  ],
  [
    "guteka",
    "cozinhar"
  ],
  [
    "kwambara",
    "vestir / usar roupa"
  ],
  [
    "kubara",
    "contar"
  ],
  [
    "gutanga",
    "dar / oferecer / começar"
  ],
  [
    "gusaba",
    "pedir / solicitar"
  ],
  [
    "gusubiza",
    "responder"
  ],
  [
    "kuganira",
    "conversar / discutir"
  ],
  [
    "guseka",
    "rir"
  ],
  [
    "kurira",
    "chorar / fluir"
  ],
  [
    "gutinya",
    "temer / ter medo"
  ],
  [
    "gukunda",
    "amar / gostar"
  ],
  [
    "gutekereza",
    "pensar / refletir"
  ],
  [
    "kwizera",
    "confiar / acreditar"
  ],
  [
    "guhangayika",
    "preocupar-se"
  ],
  [
    "gutunga",
    "possuir / ter"
  ],
  [
    "gusabana",
    "emprestar / partilhar"
  ],
  [
    "ubwenge",
    "inteligência / sabedoria"
  ],
  [
    "imbaraga",
    "força / energia"
  ],
  [
    "ubuzima",
    "saúde / vida"
  ],
  [
    "indwara",
    "doença"
  ],
  [
    "umubiri",
    "corpo"
  ],
  [
    "umutwe",
    "cabeça"
  ],
  [
    "amaso",
    "olhos"
  ],
  [
    "amatwi",
    "orelhas"
  ],
  [
    "inyonga",
    "mão"
  ],
  [
    "amaguru",
    "pernas / pés"
  ],
  [
    "umunwa",
    "boca"
  ],
  [
    "inzara",
    "fome"
  ],
  [
    "inyota",
    "sede"
  ],
  [
    "imana",
    "Deus"
  ],
  [
    "isengesho",
    "oração / prece"
  ],
  [
    "itorero",
    "igreja"
  ],
  [
    "icyumweru",
    "semana"
  ],
  [
    "ukwezi",
    "mês"
  ],
  [
    "umwaka",
    "ano"
  ],
  [
    "uyu munsi",
    "hoje"
  ],
  [
    "ejo",
    "ontem / amanhã"
  ],
  [
    "ejo hashize",
    "ontem"
  ],
  [
    "ejo hazaza",
    "amanhã"
  ],
  [
    "ubu",
    "agora / atualmente"
  ],
  [
    "noneho",
    "agora mesmo"
  ],
  [
    "amasaha",
    "horas"
  ],
  [
    "mu gitondo",
    "pela manhã"
  ],
  [
    "nijoro",
    "à noite"
  ],
  [
    "nimugoroba",
    "à tarde / noite"
  ],
  [
    "umuriro",
    "fogo / febre"
  ],
  [
    "amazi",
    "água"
  ],
  [
    "ibyokurya",
    "comida / alimentos"
  ],
  [
    "inzoga",
    "cerveja / bebida alcoólica"
  ],
  [
    "amata",
    "leite"
  ],
  [
    "isukari",
    "açúcar"
  ],
  [
    "umunyu",
    "sal"
  ],
  [
    "ibiryaro",
    "vegetais / legumes"
  ],
  [
    "imbuto",
    "semente / fruto"
  ],
  [
    "uburo",
    "sorgo / milho-miúdo"
  ],
  [
    "ibiharage",
    "feijão"
  ],
  [
    "ibirayi",
    "batatas"
  ],
  [
    "inshyushyu",
    "pimenta malagueta"
  ],
  [
    "inyama",
    "carne"
  ],
  [
    "ifi",
    "peixe (plural)"
  ],
  [
    "ikijumba",
    "batata-doce"
  ],
  [
    "ubugari",
    "ugali / papa espessa"
  ],
  [
    "ameza",
    "mesa"
  ],
  [
    "inzira",
    "caminho / estrada"
  ],
  [
    "umuhanda",
    "estrada / rua"
  ],
  [
    "imodoka",
    "carro / automóvel"
  ],
  [
    "bisi",
    "autocarro / ônibus"
  ],
  [
    "indege",
    "avião / pássaro"
  ],
  [
    "umudugudu",
    "aldeia / vila"
  ],
  [
    "umujyi",
    "cidade"
  ],
  [
    "iwacu",
    "nossa casa / lar"
  ],
  [
    "inzu",
    "casa / edifício"
  ],
  [
    "ikiraro",
    "ponte"
  ],
  [
    "isoko",
    "mercado"
  ],
  [
    "ibitaro",
    "hospital"
  ],
  [
    "ishuri",
    "escola"
  ],
  [
    "kaminuza",
    "universidade"
  ],
  [
    "leta",
    "governo / Estado"
  ],
  [
    "perezida",
    "presidente"
  ],
  [
    "minisitiri",
    "ministro/a"
  ],
  [
    "polisi",
    "polícia"
  ],
  [
    "itegeko",
    "lei / regra"
  ],
  [
    "iterambere",
    "desenvolvimento / progresso"
  ],
  [
    "ubukungu",
    "economia"
  ],
  [
    "amafaranga",
    "dinheiro"
  ],
  [
    "banki",
    "banco"
  ],
  [
    "akazi",
    "trabalho / emprego"
  ],
  [
    "umushahara",
    "salário"
  ],
  [
    "umurimo",
    "trabalho / profissão"
  ],
  [
    "uburere",
    "educação / criação"
  ],
  [
    "ubumenyi",
    "conhecimento / ciência"
  ],
  [
    "ubushakashatsi",
    "pesquisa / investigação"
  ],
  [
    "intego",
    "objetivo / meta"
  ],
  [
    "icyizere",
    "esperança / confiança"
  ],
  [
    "amahirwe",
    "oportunidade / sorte"
  ],
  [
    "ibibazo",
    "problemas / perguntas"
  ],
  [
    "ibisubizo",
    "respostas / soluções"
  ],
  [
    "icyemezo",
    "decisão / certificado"
  ],
  [
    "amategeko",
    "leis / regras"
  ],
  [
    "ingufu",
    "força / poder / energia"
  ],
  [
    "umurenge",
    "setor administrativo"
  ],
  [
    "akarere",
    "distrito"
  ],
  [
    "igihugu",
    "país / nação"
  ],
  [
    "Afrika",
    "África"
  ],
  [
    "Rwanda",
    "Ruanda"
  ],
  [
    "Kigali",
    "Kigali (capital)"
  ],
  [
    "umuganda",
    "trabalho comunitário"
  ],
  [
    "gahunda",
    "programa / plano"
  ],
  [
    "imbere",
    "futuro / frente"
  ],
  [
    "ikibazo",
    "problema / pergunta"
  ],
  [
    "igisubizo",
    "resposta / solução"
  ],
  [
    "amahoro",
    "paz"
  ],
  [
    "ubwiyunge",
    "reconciliação"
  ],
  [
    "umuvuduko",
    "velocidade / ritmo"
  ],
  [
    "inkuru",
    "história / notícias"
  ],
  [
    "radio",
    "rádio"
  ],
  [
    "televiziyo",
    "televisão"
  ],
  [
    "telefoni",
    "telefone"
  ],
  [
    "interineti",
    "internet"
  ],
  [
    "mudasobwa",
    "computador"
  ],
  [
    "ibaruwa",
    "carta / email"
  ],
  [
    "ubutumwa",
    "mensagem"
  ],
  [
    "igitabo",
    "livro"
  ],
  [
    "ikinyamakuru",
    "jornal / imprensa"
  ],
  [
    "ubuyobozi",
    "liderança / gestão"
  ],
  [
    "kuvumbura",
    "descobrir"
  ],
  [
    "guhuza",
    "conectar / unir"
  ],
  [
    "gusubira",
    "voltar / regressar"
  ],
  [
    "gutangira",
    "começar / iniciar"
  ],
  [
    "kurangira",
    "acabar / terminar"
  ],
  [
    "gukomeza",
    "continuar"
  ],
  [
    "guhagarara",
    "parar / cessar"
  ],
  [
    "kugira",
    "ter / ser"
  ],
  [
    "kubaho",
    "existir / viver"
  ],
  [
    "kuzuka",
    "levantar / ressuscitar"
  ],
  [
    "gupfa",
    "morrer"
  ],
  [
    "kuvuka",
    "nascer / brotar"
  ],
  [
    "gutera",
    "plantar / atacar"
  ],
  [
    "gufasha",
    "ajudar / assistir"
  ],
  [
    "kubaka",
    "construir / edificar"
  ],
  [
    "gutwara",
    "transportar / conduzir"
  ],
  [
    "kohereza",
    "enviar"
  ],
  [
    "kwakira",
    "receber / aceitar"
  ],
  [
    "gufatanya",
    "cooperar / colaborar"
  ],
  [
    "kwiyemeza",
    "decidir / determinar"
  ],
  [
    "guhitamo",
    "escolher / selecionar"
  ],
  [
    "gusuzuma",
    "examinar / verificar"
  ],
  [
    "gukura",
    "crescer / desenvolver"
  ],
  [
    "kwibagirwa",
    "esquecer"
  ],
  [
    "gutandukana",
    "separar-se / diferir"
  ],
  [
    "kuvugana",
    "concordar / consultar-se"
  ],
  [
    "gukemura",
    "resolver / solucionar"
  ],
  [
    "gucunga",
    "gerir / administrar"
  ],
  [
    "kwita ku",
    "cuidar de"
  ],
  [
    "kwishimira",
    "alegrar-se / apreciar"
  ],
  [
    "gushimira",
    "agradecer / apreciar"
  ],
  [
    "ukuri",
    "verdade"
  ],
  [
    "ibinyoma",
    "mentiras"
  ],
  [
    "amashanyarazi",
    "eletricidade"
  ],
  [
    "amazi meza",
    "água potável / água limpa"
  ],
  [
    "imvura",
    "chuva"
  ],
  [
    "ikiyaga",
    "lago"
  ],
  [
    "uruzi",
    "rio / riacho"
  ],
  [
    "umusozi",
    "montanha / colina"
  ],
  [
    "ubutaka",
    "terra / solo"
  ],
  [
    "igiti",
    "árvore"
  ],
  [
    "umurima",
    "fazenda / campo cultivado"
  ],
  [
    "gukoresha",
    "usar / empregar / utilizar"
  ],
  [
    "gutunganya",
    "organizar / arranjar"
  ],
  [
    "kuronka",
    "obter / encontrar / receber"
  ],
  [
    "kwiyongera",
    "aumentar / crescer"
  ],
  [
    "kugabanuka",
    "diminuir / declinar"
  ],
  [
    "gutakaza",
    "perder / desperdiçar"
  ],
  [
    "kwinjira",
    "entrar"
  ],
  [
    "gusohoka",
    "sair / saír"
  ],
  [
    "kuruha",
    "cansar-se / estar exausto"
  ],
  [
    "kupumuka",
    "descansar / repousar"
  ],
  [
    "gukiza",
    "curar / salvar / resgatar"
  ],
  [
    "kubaza",
    "perguntar / interrogar"
  ],
  [
    "kwemera",
    "aceitar / concordar / admitir"
  ],
  [
    "kwanga",
    "recusar / não gostar / odiar"
  ],
  [
    "gushiraho",
    "estabelecer / criar / fundar"
  ],
  [
    "izina",
    "nome"
  ],
  [
    "ubushobozi",
    "capacidade / habilidade / competência"
  ],
  [
    "ubutwari",
    "coragem / bravura"
  ],
  [
    "ubumwe",
    "unidade / coesão"
  ],
  [
    "ubutabera",
    "justiça"
  ],
  [
    "ukwemera",
    "fé / crença / religião"
  ],
  [
    "urukundo",
    "amor"
  ],
  [
    "amizero",
    "esperança / otimismo"
  ],
  [
    "agaciro",
    "valor / dignidade"
  ],
  [
    "uburinganire",
    "igualdade"
  ],
  [
    "ubumuntu",
    "humanidade / humanismo"
  ],
  [
    "inka",
    "vaca"
  ],
  [
    "ihene",
    "cabra"
  ],
  [
    "ingurube",
    "porco / suíno"
  ],
  [
    "inkoko",
    "galinha / frango"
  ],
  [
    "imbwa",
    "cão / cachorro"
  ],
  [
    "ifu",
    "farinha"
  ],
  [
    "umusatsi",
    "cabelo / pelos"
  ],
  [
    "imyenda",
    "roupa / vestuário"
  ],
  [
    "inkweto",
    "sapatos / calçado"
  ],
  [
    "ingofero",
    "chapéu / boné"
  ],
  [
    "umurimyi",
    "agricultor / camponês"
  ],
  [
    "intwali",
    "herói / pessoa corajosa"
  ],
  [
    "urugamba",
    "luta / combate / jornada"
  ],
  [
    "amakuru",
    "notícias / informações"
  ],
  [
    "umushyikirano",
    "diálogo / consulta / concertação"
  ],
  [
    "ubwoko",
    "tipo / género / etnia"
  ],
  [
    "isoko",
    "mercado / fonte"
  ],
  [
    "imyaka",
    "colheitas / idade / anos"
  ],
  [
    "ubworozi",
    "criação de animais / pecuária"
  ],
  [
    "imbuga nkoranyambaga",
    "redes sociais"
  ],
  [
    "inyandiko",
    "documento / texto / escrita"
  ],
  [
    "serivisi",
    "serviço"
  ],
  [
    "sosiyete",
    "empresa / sociedade"
  ],
  [
    "igikorwa",
    "atividade / ação"
  ],
  [
    "umubano",
    "relação / vizinhança"
  ],
  [
    "amajyambere",
    "avanço / desenvolvimento"
  ],
  [
    "ishoramari",
    "investimento"
  ],
  [
    "imari",
    "finanças"
  ],
  [
    "ubucuruzi",
    "comércio / negócio"
  ],
  [
    "iminsi",
    "dias (plural)"
  ],
  [
    "impapuro",
    "papel / documentos"
  ],
  [
    "inzego",
    "níveis / estruturas / escalões"
  ],
  [
    "intara",
    "província / região"
  ],
  [
    "umugabane",
    "entidade de distrito"
  ],
  [
    "umugi",
    "aglomeração / centro urbano"
  ],
  [
    "isi",
    "terra / mundo"
  ],
  [
    "uko bimeze",
    "tal como está / a situação atual"
  ],
  [
    "ubuzima bwiza",
    "boa saúde"
  ],
  [
    "amatangazo",
    "anúncios / publicidade"
  ],
  [
    "imbugabugwa",
    "software / aplicativo"
  ],
  [
    "umukuru",
    "chefe / líder / ancião"
  ],
  [
    "ubuhamya",
    "testemunho / prova"
  ],
  [
    "gutsinda",
    "vencer / superar"
  ],
  [
    "guhangana",
    "enfrentar / confrontar"
  ],
  [
    "guhinduka",
    "mudar / transformar-se"
  ],
  [
    "guhindura",
    "modificar / traduzir"
  ],
  [
    "kwishyura",
    "pagar"
  ],
  [
    "gukanguka",
    "acordar / estar alerta"
  ],
  [
    "kwiringira",
    "confiar em / depender de"
  ],
  [
    "gusengera",
    "rezar por / orar por"
  ],
  [
    "kudindira",
    "esperar / aguardar"
  ],
  [
    "gutegereza",
    "aguardar pacientemente"
  ],
  [
    "gushaka",
    "querer / procurar / casar-se"
  ],
  [
    "kwamamaza",
    "publicitar / divulgar"
  ],
  [
    "ibihugu",
    "países (plural)"
  ],
  [
    "isi yose",
    "o mundo inteiro"
  ],
  [
    "amoko",
    "etnias / tipos"
  ],
  [
    "indangagaciro",
    "valores / princípios"
  ],
  [
    "ubugiraneza",
    "generosidade"
  ],
  [
    "inyangamugayo",
    "integridade / honestidade"
  ],
  [
    "kubyara",
    "dar à luz / parir"
  ],
  [
    "umurwayi",
    "paciente / pessoa doente"
  ],
  [
    "umuganga",
    "médico / doutor"
  ],
  [
    "umuforomo",
    "enfermeiro/a"
  ],
  [
    "amafuti",
    "combustível / óleo / gordura"
  ],
  [
    "umurambi",
    "colina / crista"
  ],
  [
    "icupa",
    "garrafa"
  ],
  [
    "agaseke",
    "pequeno cesto"
  ],
  [
    "umutego",
    "armadilha / objetivo / preço"
  ],
  [
    "gucuruza",
    "comercializar / vender"
  ],
  [
    "gutera imbere",
    "progredir / avançar"
  ],
  [
    "kwita",
    "chamar / nomear"
  ],
  [
    "kwitwa",
    "chamar-se"
  ],
  [
    "indangamuntu",
    "bilhete de identidade / BI"
  ],
  [
    "ivugurura",
    "reforma / renovação"
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

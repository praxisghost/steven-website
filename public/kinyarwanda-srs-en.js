/* Kinyarwanda-srs-en.js — Kinyarwanda for English speakers.
   Single source of truth: WORDS array is BOTH the SRS deck AND the
   data rendered into the page frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 395 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = "ki-en";
  const WORDS = [
  [
    "muraho",
    "hello (formal)"
  ],
  [
    "bite",
    "hi / how are you?"
  ],
  [
    "murakoze",
    "thank you"
  ],
  [
    "murakoze cyane",
    "thank you very much"
  ],
  [
    "yego",
    "yes"
  ],
  [
    "oya",
    "no"
  ],
  [
    "mfashe",
    "please / help me"
  ],
  [
    "murakaza neza",
    "welcome"
  ],
  [
    "amahoro",
    "peace / hello"
  ],
  [
    "nibyo",
    "that's right"
  ],
  [
    "nta",
    "no / not / none"
  ],
  [
    "bwana",
    "sir / Mr."
  ],
  [
    "nyakubahwa",
    "honourable"
  ],
  [
    "inshuti",
    "friend"
  ],
  [
    "umuryango",
    "family / door"
  ],
  [
    "ababyeyi",
    "parents"
  ],
  [
    "se",
    "father"
  ],
  [
    "nyina",
    "mother"
  ],
  [
    "mukuru",
    "elder / older sibling"
  ],
  [
    "murumuna",
    "younger sibling"
  ],
  [
    "umugabo",
    "man / husband"
  ],
  [
    "umugore",
    "woman / wife"
  ],
  [
    "umwana",
    "child"
  ],
  [
    "abana",
    "children"
  ],
  [
    "umuntu",
    "person"
  ],
  [
    "abantu",
    "people"
  ],
  [
    "undi",
    "other / another"
  ],
  [
    "buri",
    "every / each"
  ],
  [
    "wa",
    "of (possessive)"
  ],
  [
    "ni",
    "is / am / are"
  ],
  [
    "na",
    "and / with"
  ],
  [
    "ariko",
    "but / however"
  ],
  [
    "kuko",
    "because"
  ],
  [
    "kugira ngo",
    "in order to"
  ],
  [
    "niba",
    "if"
  ],
  [
    "igihe",
    "time / when"
  ],
  [
    "none",
    "now / so"
  ],
  [
    "rero",
    "therefore"
  ],
  [
    "mbere",
    "before / first"
  ],
  [
    "nyuma",
    "after / behind"
  ],
  [
    "hafi",
    "near / almost"
  ],
  [
    "kure",
    "far"
  ],
  [
    "hino",
    "here"
  ],
  [
    "hariya",
    "there"
  ],
  [
    "aho",
    "there / where"
  ],
  [
    "iki",
    "this / what?"
  ],
  [
    "icyo",
    "that"
  ],
  [
    "uyu",
    "this (person)"
  ],
  [
    "uwo",
    "that (person)"
  ],
  [
    "aba",
    "these (people)"
  ],
  [
    "izo",
    "those"
  ],
  [
    "gute",
    "how?"
  ],
  [
    "nde",
    "who?"
  ],
  [
    "he",
    "where?"
  ],
  [
    "ryari",
    "when?"
  ],
  [
    "kuki",
    "why?"
  ],
  [
    "angahe",
    "how many?"
  ],
  [
    "kumva",
    "to hear / understand / feel"
  ],
  [
    "kuvuga",
    "to speak / say"
  ],
  [
    "gusobanura",
    "to explain"
  ],
  [
    "kwandika",
    "to write"
  ],
  [
    "gusoma",
    "to read"
  ],
  [
    "kwiga",
    "to study / learn"
  ],
  [
    "gukora",
    "to work / do"
  ],
  [
    "kuva",
    "to come from / leave"
  ],
  [
    "kuja",
    "to come"
  ],
  [
    "kugenda",
    "to go / walk"
  ],
  [
    "gutura",
    "to live / reside"
  ],
  [
    "kuririmba",
    "to sing"
  ],
  [
    "kurarika",
    "to sleep"
  ],
  [
    "kuzinduka",
    "to wake up"
  ],
  [
    "gufata",
    "to take / hold / catch"
  ],
  [
    "guha",
    "to give"
  ],
  [
    "kubona",
    "to see / find / get"
  ],
  [
    "kureba",
    "to look / watch"
  ],
  [
    "gusobanukirwa",
    "to understand well"
  ],
  [
    "kwibuka",
    "to remember"
  ],
  [
    "kurima",
    "to farm / cultivate"
  ],
  [
    "kugura",
    "to buy"
  ],
  [
    "kugurisha",
    "to sell"
  ],
  [
    "kurya",
    "to eat"
  ],
  [
    "kunywa",
    "to drink"
  ],
  [
    "gufungura",
    "to open / have a meal"
  ],
  [
    "gufunga",
    "to close / lock"
  ],
  [
    "kuvoma",
    "to fetch water"
  ],
  [
    "guteka",
    "to cook"
  ],
  [
    "kwambara",
    "to wear / dress"
  ],
  [
    "kubara",
    "to count"
  ],
  [
    "gutanga",
    "to give / offer / start"
  ],
  [
    "gusaba",
    "to ask / request"
  ],
  [
    "gusubiza",
    "to answer / reply"
  ],
  [
    "kuganira",
    "to discuss / chat"
  ],
  [
    "guseka",
    "to laugh"
  ],
  [
    "kurira",
    "to cry / flow"
  ],
  [
    "gutinya",
    "to fear"
  ],
  [
    "gukunda",
    "to love / like"
  ],
  [
    "gutekereza",
    "to think"
  ],
  [
    "kwizera",
    "to trust / believe"
  ],
  [
    "guhangayika",
    "to worry"
  ],
  [
    "gutunga",
    "to own / possess"
  ],
  [
    "gusabana",
    "to borrow / share"
  ],
  [
    "ubwenge",
    "intelligence / wisdom"
  ],
  [
    "imbaraga",
    "strength / energy"
  ],
  [
    "ubuzima",
    "health / life"
  ],
  [
    "indwara",
    "disease / illness"
  ],
  [
    "umubiri",
    "body"
  ],
  [
    "umutwe",
    "head"
  ],
  [
    "amaso",
    "eyes"
  ],
  [
    "amatwi",
    "ears"
  ],
  [
    "inyonga",
    "hand"
  ],
  [
    "amaguru",
    "legs / feet"
  ],
  [
    "umunwa",
    "mouth"
  ],
  [
    "inzara",
    "hunger"
  ],
  [
    "inyota",
    "thirst"
  ],
  [
    "imana",
    "God"
  ],
  [
    "isengesho",
    "prayer"
  ],
  [
    "itorero",
    "church"
  ],
  [
    "icyumweru",
    "week"
  ],
  [
    "ukwezi",
    "month"
  ],
  [
    "umwaka",
    "year"
  ],
  [
    "uyu munsi",
    "today"
  ],
  [
    "ejo",
    "yesterday / tomorrow"
  ],
  [
    "ejo hashize",
    "yesterday"
  ],
  [
    "ejo hazaza",
    "tomorrow"
  ],
  [
    "ubu",
    "now / currently"
  ],
  [
    "noneho",
    "right now"
  ],
  [
    "amasaha",
    "hours / time"
  ],
  [
    "mu gitondo",
    "in the morning"
  ],
  [
    "nijoro",
    "at night"
  ],
  [
    "nimugoroba",
    "in the evening"
  ],
  [
    "umuriro",
    "fire / fever"
  ],
  [
    "amazi",
    "water"
  ],
  [
    "ibyokurya",
    "food"
  ],
  [
    "inzoga",
    "beer / alcohol"
  ],
  [
    "amata",
    "milk"
  ],
  [
    "isukari",
    "sugar"
  ],
  [
    "umunyu",
    "salt"
  ],
  [
    "ibiryaro",
    "vegetables"
  ],
  [
    "imbuto",
    "seed / fruit"
  ],
  [
    "uburo",
    "sorghum / millet"
  ],
  [
    "ibiharage",
    "beans"
  ],
  [
    "ibirayi",
    "potatoes"
  ],
  [
    "inshyushyu",
    "hot pepper"
  ],
  [
    "inyama",
    "meat"
  ],
  [
    "ifi",
    "fish (pl.)"
  ],
  [
    "ikijumba",
    "sweet potato"
  ],
  [
    "ubugari",
    "ugali / porridge"
  ],
  [
    "ameza",
    "table"
  ],
  [
    "inzira",
    "path / road"
  ],
  [
    "umuhanda",
    "road / street"
  ],
  [
    "imodoka",
    "car"
  ],
  [
    "bisi",
    "bus"
  ],
  [
    "indege",
    "airplane / bird"
  ],
  [
    "umudugudu",
    "village"
  ],
  [
    "umujyi",
    "city / town"
  ],
  [
    "iwacu",
    "our home"
  ],
  [
    "inzu",
    "house / building"
  ],
  [
    "ikiraro",
    "bridge"
  ],
  [
    "isoko",
    "market"
  ],
  [
    "ibitaro",
    "hospital"
  ],
  [
    "ishuri",
    "school"
  ],
  [
    "kaminuza",
    "university"
  ],
  [
    "leta",
    "government / state"
  ],
  [
    "perezida",
    "president"
  ],
  [
    "minisitiri",
    "minister"
  ],
  [
    "polisi",
    "police"
  ],
  [
    "itegeko",
    "law / rule"
  ],
  [
    "iterambere",
    "development / progress"
  ],
  [
    "ubukungu",
    "economy"
  ],
  [
    "amafaranga",
    "money"
  ],
  [
    "banki",
    "bank"
  ],
  [
    "akazi",
    "work / job"
  ],
  [
    "umushahara",
    "salary"
  ],
  [
    "umurimo",
    "profession / work"
  ],
  [
    "uburere",
    "upbringing / education"
  ],
  [
    "ubumenyi",
    "knowledge / science"
  ],
  [
    "ubushakashatsi",
    "research"
  ],
  [
    "intego",
    "goal / aim"
  ],
  [
    "icyizere",
    "hope / trust"
  ],
  [
    "amahirwe",
    "opportunity / luck"
  ],
  [
    "ibibazo",
    "problems / questions"
  ],
  [
    "ibisubizo",
    "answers / solutions"
  ],
  [
    "icyemezo",
    "decision / certificate"
  ],
  [
    "amategeko",
    "laws / rules"
  ],
  [
    "ingufu",
    "force / power"
  ],
  [
    "umurenge",
    "sector (admin.)"
  ],
  [
    "akarere",
    "district"
  ],
  [
    "igihugu",
    "country / nation"
  ],
  [
    "Afrika",
    "Africa"
  ],
  [
    "Rwanda",
    "Rwanda"
  ],
  [
    "Kigali",
    "Kigali (capital)"
  ],
  [
    "umuganda",
    "community work"
  ],
  [
    "gahunda",
    "program / plan"
  ],
  [
    "imbere",
    "future / front"
  ],
  [
    "ikibazo",
    "problem / question"
  ],
  [
    "igisubizo",
    "answer / solution"
  ],
  [
    "amahoro",
    "peace"
  ],
  [
    "ubwiyunge",
    "reconciliation"
  ],
  [
    "umuvuduko",
    "speed"
  ],
  [
    "inkuru",
    "story / news"
  ],
  [
    "radio",
    "radio"
  ],
  [
    "televiziyo",
    "television"
  ],
  [
    "telefoni",
    "telephone / phone"
  ],
  [
    "interineti",
    "internet"
  ],
  [
    "mudasobwa",
    "computer"
  ],
  [
    "ibaruwa",
    "letter / email"
  ],
  [
    "ubutumwa",
    "message"
  ],
  [
    "igitabo",
    "book"
  ],
  [
    "ikinyamakuru",
    "newspaper"
  ],
  [
    "ubuyobozi",
    "leadership / management"
  ],
  [
    "kuvumbura",
    "to discover"
  ],
  [
    "guhuza",
    "to connect / unite"
  ],
  [
    "gusubira",
    "to return"
  ],
  [
    "gutangira",
    "to begin"
  ],
  [
    "kurangira",
    "to finish / end"
  ],
  [
    "gukomeza",
    "to continue"
  ],
  [
    "guhagarara",
    "to stop"
  ],
  [
    "kugira",
    "to have / be"
  ],
  [
    "kubaho",
    "to exist / live"
  ],
  [
    "kuzuka",
    "to rise / be reborn"
  ],
  [
    "gupfa",
    "to die"
  ],
  [
    "kuvuka",
    "to be born / sprout"
  ],
  [
    "gutera",
    "to plant / attack"
  ],
  [
    "gufasha",
    "to help / assist"
  ],
  [
    "kubaka",
    "to build"
  ],
  [
    "gutwara",
    "to carry / drive"
  ],
  [
    "kohereza",
    "to send"
  ],
  [
    "kwakira",
    "to receive / accept"
  ],
  [
    "gufatanya",
    "to cooperate"
  ],
  [
    "kwiyemeza",
    "to decide"
  ],
  [
    "guhitamo",
    "to choose"
  ],
  [
    "gusuzuma",
    "to examine / check"
  ],
  [
    "gukura",
    "to grow / develop"
  ],
  [
    "kwibagirwa",
    "to forget"
  ],
  [
    "gutandukana",
    "to separate"
  ],
  [
    "kuvugana",
    "to agree / consult"
  ],
  [
    "gukemura",
    "to solve"
  ],
  [
    "gucunga",
    "to manage"
  ],
  [
    "kwita ku",
    "to take care of"
  ],
  [
    "kwishimira",
    "to enjoy / be glad"
  ],
  [
    "gushimira",
    "to thank / appreciate"
  ],
  [
    "ukuri",
    "truth"
  ],
  [
    "ibinyoma",
    "lies"
  ],
  [
    "amashanyarazi",
    "electricity"
  ],
  [
    "amazi meza",
    "clean water"
  ],
  [
    "imvura",
    "rain"
  ],
  [
    "ikiyaga",
    "lake"
  ],
  [
    "uruzi",
    "river"
  ],
  [
    "umusozi",
    "mountain / hill"
  ],
  [
    "ubutaka",
    "land / soil"
  ],
  [
    "igiti",
    "tree"
  ],
  [
    "umurima",
    "farm / field"
  ],
  [
    "gukoresha",
    "to use / employ"
  ],
  [
    "gutunganya",
    "to organise"
  ],
  [
    "kuronka",
    "to get / obtain"
  ],
  [
    "kwiyongera",
    "to increase / grow"
  ],
  [
    "kugabanuka",
    "to decrease"
  ],
  [
    "gutakaza",
    "to lose"
  ],
  [
    "kwinjira",
    "to enter"
  ],
  [
    "gusohoka",
    "to exit"
  ],
  [
    "kuruha",
    "to get tired"
  ],
  [
    "kupumuka",
    "to rest"
  ],
  [
    "gukiza",
    "to heal / save"
  ],
  [
    "kubaza",
    "to ask / inquire"
  ],
  [
    "kwemera",
    "to agree / accept"
  ],
  [
    "kwanga",
    "to refuse / dislike"
  ],
  [
    "gushiraho",
    "to establish"
  ],
  [
    "izina",
    "name"
  ],
  [
    "ubushobozi",
    "ability / capacity"
  ],
  [
    "ubutwari",
    "courage"
  ],
  [
    "ubumwe",
    "unity"
  ],
  [
    "ubutabera",
    "justice"
  ],
  [
    "ukwemera",
    "faith / belief"
  ],
  [
    "urukundo",
    "love"
  ],
  [
    "amizero",
    "hope / optimism"
  ],
  [
    "agaciro",
    "value / dignity"
  ],
  [
    "uburinganire",
    "equality"
  ],
  [
    "ubumuntu",
    "humanity"
  ],
  [
    "inka",
    "cow"
  ],
  [
    "ihene",
    "goat"
  ],
  [
    "ingurube",
    "pig"
  ],
  [
    "inkoko",
    "chicken"
  ],
  [
    "imbwa",
    "dog"
  ],
  [
    "ifu",
    "flour"
  ],
  [
    "umusatsi",
    "hair"
  ],
  [
    "imyenda",
    "clothes"
  ],
  [
    "inkweto",
    "shoes"
  ],
  [
    "ingofero",
    "hat / cap"
  ],
  [
    "umurimyi",
    "farmer"
  ],
  [
    "intwali",
    "hero / brave person"
  ],
  [
    "urugamba",
    "struggle / journey"
  ],
  [
    "amakuru",
    "news / greetings"
  ],
  [
    "umushyikirano",
    "dialogue / consultation"
  ],
  [
    "ubwoko",
    "type / kind / ethnicity"
  ],
  [
    "igiti",
    "tree"
  ],
  [
    "isoko",
    "market / source"
  ],
  [
    "imyaka",
    "crops / age / years"
  ],
  [
    "ubworozi",
    "livestock / animal rearing"
  ],
  [
    "umuryango",
    "family / clan"
  ],
  [
    "ubuvandimwe",
    "brotherhood / kinship"
  ],
  [
    "imbuga nkoranyambaga",
    "social media"
  ],
  [
    "inyandiko",
    "document / text / writing"
  ],
  [
    "serivisi",
    "service"
  ],
  [
    "sosiyete",
    "company / society"
  ],
  [
    "igikorwa",
    "activity / action"
  ],
  [
    "umubano",
    "relationship / neighbourhood"
  ],
  [
    "amajyambere",
    "advancement / progress"
  ],
  [
    "ishoramari",
    "investment"
  ],
  [
    "imari",
    "finance"
  ],
  [
    "ubucuruzi",
    "commerce / trade"
  ],
  [
    "iminsi",
    "days"
  ],
  [
    "impapuro",
    "paper / documents"
  ],
  [
    "inzego",
    "levels / structures"
  ],
  [
    "intara",
    "province"
  ],
  [
    "umugabane",
    "district area"
  ],
  [
    "agace",
    "small area / cell"
  ],
  [
    "umugi",
    "city / town"
  ],
  [
    "isi",
    "earth / world"
  ],
  [
    "uko bimeze",
    "as it is / the situation"
  ],
  [
    "ubuzima bwiza",
    "good health"
  ],
  [
    "amatangazo",
    "announcements / ads"
  ],
  [
    "imbugabugwa",
    "software / app"
  ],
  [
    "umukuru",
    "leader / elder / head"
  ],
  [
    "ubuhamya",
    "testimony / evidence"
  ],
  [
    "inshuti za hafi",
    "close friends"
  ],
  [
    "akazi ka leta",
    "government job"
  ],
  [
    "ubushakashatsi bwa siyansi",
    "scientific research"
  ],
  [
    "gutsinda",
    "to win / to overcome"
  ],
  [
    "guhangana",
    "to face / to confront"
  ],
  [
    "gufatwa",
    "to be caught / arrested"
  ],
  [
    "guhabwa",
    "to be given"
  ],
  [
    "kwandikwa",
    "to be written"
  ],
  [
    "gusomwa",
    "to be read"
  ],
  [
    "kugezwa",
    "to be sent / delivered"
  ],
  [
    "kubonwa",
    "to be seen / found"
  ],
  [
    "kuvugwa",
    "to be spoken / said"
  ],
  [
    "kwigwa",
    "to be taught / studied"
  ],
  [
    "gukorwa",
    "to be done / worked"
  ],
  [
    "kujya",
    "to go (variant)"
  ],
  [
    "kuza",
    "to come (variant)"
  ],
  [
    "guhunga",
    "to flee / escape"
  ],
  [
    "gushonga",
    "to melt / dissolve"
  ],
  [
    "gusiga",
    "to smear / leave behind"
  ],
  [
    "gukata",
    "to cut"
  ],
  [
    "gushona",
    "to sew / to sink"
  ],
  [
    "gukeba",
    "to pick / select"
  ],
  [
    "gukanda",
    "to press / massage"
  ],
  [
    "gusekera",
    "to laugh at"
  ],
  [
    "gutwikurura",
    "to uncover / reveal"
  ],
  [
    "kwibaza",
    "to wonder / ask oneself"
  ],
  [
    "kunanirwa",
    "to fail / be unable"
  ],
  [
    "guhinduka",
    "to change / transform"
  ],
  [
    "guhindura",
    "to change / translate"
  ],
  [
    "kwangana",
    "to be equal / match"
  ],
  [
    "kunyurwa",
    "to be satisfied"
  ],
  [
    "gutekwa",
    "to be cooked"
  ],
  [
    "gutunikwa",
    "to be pierced"
  ],
  [
    "gukomereka",
    "to be wounded"
  ],
  [
    "gukomerwa",
    "to be injured"
  ],
  [
    "kwishyura",
    "to pay"
  ],
  [
    "kugabana",
    "to divide / share"
  ],
  [
    "gukanguka",
    "to wake up / be alert"
  ],
  [
    "kwiringira",
    "to rely on"
  ],
  [
    "gusengera",
    "to pray for"
  ],
  [
    "kwibohora",
    "to free oneself"
  ],
  [
    "kudindira",
    "to wait"
  ],
  [
    "gutegereza",
    "to wait patiently"
  ],
  [
    "gushaka",
    "to want / look for / marry"
  ],
  [
    "gukora intambwe",
    "to take a step"
  ],
  [
    "kwamamaza",
    "to advertise / publicize"
  ],
  [
    "gusangira",
    "to share / eat together"
  ],
  [
    "ibihugu",
    "countries"
  ],
  [
    "isi yose",
    "the whole world"
  ],
  [
    "amoko",
    "ethnicities / kinds"
  ],
  [
    "indangagaciro",
    "values / principles"
  ],
  [
    "ubugiraneza",
    "generosity"
  ],
  [
    "inyangamugayo",
    "integrity / honesty"
  ],
  [
    "kwisuzuma",
    "self-evaluation"
  ],
  [
    "kubyara",
    "to give birth"
  ],
  [
    "umurwayi",
    "patient / sick person"
  ],
  [
    "umuganga",
    "doctor"
  ],
  [
    "umuforomo",
    "nurse"
  ],
  [
    "amafuti",
    "fuel / oil"
  ],
  [
    "umurambi",
    "hill / ridge"
  ],
  [
    "icupa",
    "bottle"
  ],
  [
    "agaseke",
    "small basket"
  ],
  [
    "umutego",
    "trap / target / price"
  ],
  [
    "gucuruza",
    "to trade / sell"
  ],
  [
    "gutera imbere",
    "to make progress"
  ],
  [
    "kwita",
    "to call / name"
  ],
  [
    "kwitwa",
    "to be called"
  ],
  [
    "indangamuntu",
    "identity card"
  ],
  [
    "ububyutu",
    "speed / agility"
  ],
  [
    "ivugurura",
    "reform / renewal"
  ],
  [
    "iterambere ry'igihugu",
    "national development"
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

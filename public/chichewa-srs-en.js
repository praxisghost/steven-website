/* Chichewa-srs-en.js — Chichewa for English speakers.
   Single source of truth: WORDS array is BOTH the SRS deck AND the frequency table.
   SM-2 spaced repetition; progress in localStorage. 209 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = "ny-en";
  const WORDS = [
  [
    "moni",
    "hello / hi"
  ],
  [
    "moni bambo",
    "hello sir (to a man)"
  ],
  [
    "moni mayi",
    "hello madam (to a woman)"
  ],
  [
    "zikomo",
    "thank you"
  ],
  [
    "zikomo kwambiri",
    "thank you very much"
  ],
  [
    "chonde",
    "please"
  ],
  [
    "ndikukhululukani",
    "I'm sorry / excuse me"
  ],
  [
    "inde",
    "yes"
  ],
  [
    "ayi",
    "no"
  ],
  [
    "bwino",
    "good / well / fine"
  ],
  [
    "bwino bwino",
    "very good / excellent"
  ],
  [
    "muli bwanji?",
    "how are you? (formal)"
  ],
  [
    "nili bwino",
    "I am well"
  ],
  [
    "mukhale bwino",
    "goodbye (lit. stay well)"
  ],
  [
    "tionana",
    "see you later"
  ],
  [
    "pepani",
    "sorry / excuse me"
  ],
  [
    "ndimva bwino",
    "I feel well"
  ],
  [
    "sindikumva",
    "I don't understand"
  ],
  [
    "munenere mwachedwa",
    "please speak slowly"
  ],
  [
    "chiyani?",
    "what?"
  ],
  [
    "ndani?",
    "who?"
  ],
  [
    "kuti?",
    "where?"
  ],
  [
    "ndi liti?",
    "when?"
  ],
  [
    "chifukwa chiyani?",
    "why?"
  ],
  [
    "bwanji?",
    "how?"
  ],
  [
    "zingati?",
    "how many?"
  ],
  [
    "ine",
    "I / me"
  ],
  [
    "iwe",
    "you (singular)"
  ],
  [
    "iye",
    "he / she / it"
  ],
  [
    "ife",
    "we"
  ],
  [
    "inu",
    "you (plural)"
  ],
  [
    "iwo",
    "they / them"
  ],
  [
    "nyumba",
    "house / home / building"
  ],
  [
    "msewu",
    "road / path / street"
  ],
  [
    "msonkhano",
    "meeting / gathering / assembly"
  ],
  [
    "mudzi",
    "village / hometown"
  ],
  [
    "tauni",
    "town / city"
  ],
  [
    "banja",
    "family"
  ],
  [
    "bambo",
    "father / Mr. (respectful term for man)"
  ],
  [
    "mayi",
    "mother / Mrs. (respectful term for woman)"
  ],
  [
    "mwana",
    "child / son / daughter"
  ],
  [
    "ana",
    "children"
  ],
  [
    "mkulu",
    "elder / senior / older sibling"
  ],
  [
    "mng'ono",
    "younger sibling / smaller"
  ],
  [
    "munthu",
    "person"
  ],
  [
    "anthu",
    "people"
  ],
  [
    "mzungu",
    "European / white person / foreigner"
  ],
  [
    "wochiritsa",
    "doctor / healer"
  ],
  [
    "mphunzitsi",
    "teacher"
  ],
  [
    "wogulitsa",
    "seller / trader"
  ],
  [
    "wogula",
    "buyer"
  ],
  [
    "chilichonse",
    "everything / anything"
  ],
  [
    "kanthu",
    "nothing / something small"
  ],
  [
    "nthawi",
    "time / period / season"
  ],
  [
    "lero",
    "today"
  ],
  [
    "mawa",
    "tomorrow"
  ],
  [
    "dzulo",
    "yesterday"
  ],
  [
    "usiku",
    "night"
  ],
  [
    "m'mawa",
    "morning"
  ],
  [
    "masana",
    "afternoon / midday"
  ],
  [
    "madzulo",
    "evening"
  ],
  [
    "sabata",
    "week"
  ],
  [
    "mwezi",
    "month"
  ],
  [
    "chaka",
    "year"
  ],
  [
    "madzi",
    "water"
  ],
  [
    "chakula",
    "food"
  ],
  [
    "nyama",
    "meat / animal"
  ],
  [
    "nsomba",
    "fish"
  ],
  [
    "nkhuku",
    "chicken"
  ],
  [
    "mbuzi",
    "goat"
  ],
  [
    "ng'ombe",
    "cow"
  ],
  [
    "chimanga",
    "maize / corn"
  ],
  [
    "mbatata",
    "potato / sweet potato"
  ],
  [
    "phala",
    "porridge"
  ],
  [
    "nsima",
    "stiff maize porridge (main staple)"
  ],
  [
    "ndiwo",
    "relish / sauce (eaten with nsima)"
  ],
  [
    "mtedza",
    "groundnuts"
  ],
  [
    "mvuto",
    "groundnut flour sauce"
  ],
  [
    "chalimwe",
    "autumn / second rainy season"
  ],
  [
    "masika",
    "rainy season"
  ],
  [
    "chilimwe",
    "dry season"
  ],
  [
    "moto",
    "fire / heat / temperature"
  ],
  [
    "mvula",
    "rain"
  ],
  [
    "dzuwa",
    "sun / day"
  ],
  [
    "mphepo",
    "wind"
  ],
  [
    "mtengo",
    "tree / wood / price"
  ],
  [
    "thengo",
    "bush / wilderness"
  ],
  [
    "nkhalamba",
    "old person / elder"
  ],
  [
    "mtsikana",
    "girl / young woman"
  ],
  [
    "mnyamata",
    "boy / young man"
  ],
  [
    "mkazi",
    "woman / wife"
  ],
  [
    "mwamuna",
    "man / husband"
  ],
  [
    "kuganiza",
    "to think / to consider / to plan"
  ],
  [
    "kukumana",
    "to meet / to encounter"
  ],
  [
    "kuyenda",
    "to go / to travel / to walk"
  ],
  [
    "kubwera",
    "to come"
  ],
  [
    "kukhala",
    "to be / to stay / to live / to sit"
  ],
  [
    "kudya",
    "to eat"
  ],
  [
    "kumwa",
    "to drink"
  ],
  [
    "kugona",
    "to sleep"
  ],
  [
    "kudzuka",
    "to wake up"
  ],
  [
    "kuimba",
    "to sing"
  ],
  [
    "kusewera",
    "to play"
  ],
  [
    "kuphunzira",
    "to learn / to study"
  ],
  [
    "kuphunzitsa",
    "to teach"
  ],
  [
    "kugwira ntchito",
    "to work"
  ],
  [
    "kukwera",
    "to climb / to ride"
  ],
  [
    "kutsika",
    "to descend / to come down"
  ],
  [
    "kupita",
    "to go / to pass"
  ],
  [
    "kufika",
    "to arrive / to reach"
  ],
  [
    "kubwerera",
    "to return / to come back"
  ],
  [
    "kuona",
    "to see / to look"
  ],
  [
    "kumva",
    "to hear / to feel / to understand"
  ],
  [
    "kuyankhula",
    "to speak / to answer"
  ],
  [
    "kufunsa",
    "to ask"
  ],
  [
    "kuuza",
    "to tell / to inform / to sell"
  ],
  [
    "kugula",
    "to buy"
  ],
  [
    "kulipira",
    "to pay"
  ],
  [
    "kupereka",
    "to give / to hand over / to offer"
  ],
  [
    "kutenga",
    "to take / to carry / to bring"
  ],
  [
    "kupita kutali",
    "to go far"
  ],
  [
    "kufika pafupi",
    "to arrive nearby"
  ],
  [
    "kupanga",
    "to make / to do / to create"
  ],
  [
    "kuvala",
    "to wear / to dress"
  ],
  [
    "kusamba",
    "to bathe / to wash"
  ],
  [
    "kumanga",
    "to build / to tie / to lock"
  ],
  [
    "kothyola",
    "to break"
  ],
  [
    "kutseka",
    "to close / to lock"
  ],
  [
    "kutsegula",
    "to open"
  ],
  [
    "kutumiza",
    "to send"
  ],
  [
    "kulandila",
    "to receive / to welcome"
  ],
  [
    "kuvomereza",
    "to agree / to accept"
  ],
  [
    "kukana",
    "to refuse / to deny"
  ],
  [
    "kukamba",
    "to say / to talk"
  ],
  [
    "kulumikizana",
    "to connect / to be related"
  ],
  [
    "wabwino",
    "good (adjective)"
  ],
  [
    "woyipa",
    "bad / evil"
  ],
  [
    "wokongola",
    "beautiful / handsome"
  ],
  [
    "wating'a",
    "stubborn / difficult"
  ],
  [
    "wafupi",
    "short / near"
  ],
  [
    "wotali",
    "tall / long / far"
  ],
  [
    "wamkulu",
    "big / large / important"
  ],
  [
    "wamng'ono",
    "small / little / young"
  ],
  [
    "woyera",
    "white / clean / pure / holy"
  ],
  [
    "wakuda",
    "black / dark"
  ],
  [
    "wofiira",
    "red / reddish"
  ],
  [
    "mawu",
    "words / language / voice"
  ],
  [
    "chiyankhulo",
    "language / dialect"
  ],
  [
    "chichewa",
    "Chichewa language"
  ],
  [
    "chingerezi",
    "English language"
  ],
  [
    "chifalansa",
    "French language"
  ],
  [
    "chitumbuka",
    "Tumbuka language"
  ],
  [
    "chiswahili",
    "Swahili language"
  ],
  [
    "bukhala",
    "peace / calm"
  ],
  [
    "chimwemwe",
    "joy / happiness"
  ],
  [
    "chisoni",
    "sadness / sorrow / pity"
  ],
  [
    "mkwiyo",
    "anger / rage"
  ],
  [
    "mantha",
    "fear"
  ],
  [
    "chikondi",
    "love"
  ],
  [
    "chiyambi",
    "start / beginning / origin"
  ],
  [
    "mapeto",
    "end / conclusion"
  ],
  [
    "phindu",
    "benefit / profit"
  ],
  [
    "tsoka",
    "misfortune / trouble / disaster"
  ],
  [
    "bwampini",
    "hospitality"
  ],
  [
    "chuma",
    "wealth / iron / money"
  ],
  [
    "ndalama",
    "money / currency"
  ],
  [
    "ngongole",
    "debt / loan"
  ],
  [
    "ntchito",
    "work / job / task"
  ],
  [
    "malipiro",
    "payment / wages"
  ],
  [
    "mphoto",
    "reward / prize / gift"
  ],
  [
    "mphatso",
    "gift / present"
  ],
  [
    "masunga",
    "care / keeping / protection"
  ],
  [
    "chipatala",
    "hospital / clinic"
  ],
  [
    "mankhwala",
    "medicine / drugs"
  ],
  [
    "odwala",
    "patient / sick person"
  ],
  [
    "bzotha",
    "lie / falsehood"
  ],
  [
    "choonadi",
    "truth"
  ],
  [
    "chilungamo",
    "justice / righteousness"
  ],
  [
    "ufulu",
    "freedom / independence"
  ],
  [
    "mtendere",
    "peace"
  ],
  [
    "chitukuko",
    "development / progress"
  ],
  [
    "zachuma",
    "economics / finances"
  ],
  [
    "nzeru",
    "wisdom / intelligence"
  ],
  [
    "udziwa",
    "knowledge / awareness"
  ],
  [
    "maphunziro",
    "education / training"
  ],
  [
    "sukulu",
    "school"
  ],
  [
    "msewu waukulu",
    "main road / highway"
  ],
  [
    "galimoto",
    "car / vehicle"
  ],
  [
    "sitima",
    "train / engine / boat"
  ],
  [
    "ndege",
    "airplane / bird"
  ],
  [
    "basi",
    "bus"
  ],
  [
    "njinga",
    "bicycle"
  ],
  [
    "malangizo",
    "instructions / advice"
  ],
  [
    "malamulo",
    "rules / laws"
  ],
  [
    "boma",
    "government / district / fort"
  ],
  [
    "unduna",
    "ministry / government department"
  ],
  [
    "mboni",
    "witness / testimony"
  ],
  [
    "mpingo",
    "church denomination / organization"
  ],
  [
    "mosque",
    "mosque"
  ],
  [
    "chikhalidwe",
    "culture / tradition / custom"
  ],
  [
    "mwambo",
    "custom / ceremony / tradition"
  ],
  [
    "nthano",
    "story / folktale / myth"
  ],
  [
    "nyimbo",
    "song / hymn"
  ],
  [
    "lipenga",
    "horn / trumpet"
  ],
  [
    "ng'oma",
    "drum"
  ],
  [
    "masewero",
    "game / sport / play"
  ],
  [
    "mpira",
    "ball / balloon / rubber"
  ],
  [
    "karate",
    "martial arts"
  ],
  [
    "swimming",
    "swimming"
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

/* Lingala-srs-en.js — Lingala for English speakers.
   Single source of truth: WORDS array is BOTH the SRS deck AND the frequency table.
   SM-2 spaced repetition; progress in localStorage. 255 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = "ln-en";
  const WORDS = [
  [
    "mbote",
    "hello / greetings"
  ],
  [
    "mbote mingi",
    "hello / many greetings (warm)"
  ],
  [
    "boyei bolamu",
    "welcome (lit. come well)"
  ],
  [
    "matondo",
    "thanks / gratitude"
  ],
  [
    "matondo mingi",
    "thank you very much"
  ],
  [
    "soki",
    "please / if"
  ],
  [
    "nabongi te",
    "I don't understand"
  ],
  [
    "koloba",
    "to speak / to say"
  ],
  [
    "komeka",
    "to try"
  ],
  [
    "kotika",
    "to stop / to leave / to let"
  ],
  [
    "kokeya",
    "to go"
  ],
  [
    "koya",
    "to come"
  ],
  [
    "kozala",
    "to be / to exist / to have"
  ],
  [
    "kolya",
    "to eat"
  ],
  [
    "komela",
    "to drink"
  ],
  [
    "kolala",
    "to sleep"
  ],
  [
    "kofanda",
    "to sit / to stay / to live"
  ],
  [
    "kotomboka",
    "to stand up"
  ],
  [
    "kokomba",
    "to sweep / to search"
  ],
  [
    "kozwa",
    "to take / to get / to receive"
  ],
  [
    "kopesa",
    "to give"
  ],
  [
    "komona",
    "to see"
  ],
  [
    "koyeba",
    "to know"
  ],
  [
    "kobanda",
    "to start / to begin"
  ],
  [
    "kosilisa",
    "to finish / to end"
  ],
  [
    "kotambola",
    "to walk / to travel"
  ],
  [
    "kokende",
    "let's go / going"
  ],
  [
    "kolanda",
    "to follow / to continue"
  ],
  [
    "kobanga",
    "to fear / to be afraid"
  ],
  [
    "kolinga",
    "to love / to want / to like"
  ],
  [
    "kokanisa",
    "to think / to consider"
  ],
  [
    "kokanga",
    "to catch / to close / to lock"
  ],
  [
    "kobuka",
    "to break / to cross"
  ],
  [
    "kokela",
    "to put / to place / to build"
  ],
  [
    "koteka",
    "to sell"
  ],
  [
    "kosomba",
    "to buy"
  ],
  [
    "kobeta",
    "to hit / to beat / to play (music)"
  ],
  [
    "kokota",
    "to enter / to go in"
  ],
  [
    "kobima",
    "to exit / to go out"
  ],
  [
    "kotanga",
    "to read / to count"
  ],
  [
    "kokomba",
    "to look for / to sweep"
  ],
  [
    "lelo",
    "today"
  ],
  [
    "lobi",
    "tomorrow"
  ],
  [
    "loba ya kala",
    "yesterday"
  ],
  [
    "suka",
    "end / finish / stop"
  ],
  [
    "nzoto",
    "body"
  ],
  [
    "motó",
    "head"
  ],
  [
    "miso",
    "eyes"
  ],
  [
    "matoyi",
    "ears"
  ],
  [
    "monoko",
    "mouth"
  ],
  [
    "zolo",
    "nose"
  ],
  [
    "loboko",
    "arm / hand"
  ],
  [
    "lokolo",
    "leg / foot"
  ],
  [
    "motema",
    "heart"
  ],
  [
    "epai",
    "place / location"
  ],
  [
    "na",
    "in / at / with / and / to"
  ],
  [
    "te",
    "not / no (negation)"
  ],
  [
    "awa",
    "here"
  ],
  [
    "kuna",
    "there / over there"
  ],
  [
    "wapi",
    "where?"
  ],
  [
    "nani",
    "who?"
  ],
  [
    "nini",
    "what?"
  ],
  [
    "ndenge nini",
    "how?"
  ],
  [
    "tango nini",
    "when?"
  ],
  [
    "mpo nini",
    "why?"
  ],
  [
    "boni",
    "how much / how many?"
  ],
  [
    "ee",
    "yes"
  ],
  [
    "te",
    "no / not"
  ],
  [
    "soki",
    "if / please"
  ],
  [
    "kasi",
    "but"
  ],
  [
    "to",
    "or"
  ],
  [
    "mpe",
    "also / and / too"
  ],
  [
    "solo",
    "true / really / indeed"
  ],
  [
    "ata",
    "even / although / despite"
  ],
  [
    "sikoyo",
    "now"
  ],
  [
    "mbala",
    "time / occasion"
  ],
  [
    "mbala moko",
    "once / one time"
  ],
  [
    "mbala mingi",
    "many times / often"
  ],
  [
    "kala",
    "old / long ago / before"
  ],
  [
    "malamu",
    "good / well / nice"
  ],
  [
    "mabe",
    "bad / wrong / ugly"
  ],
  [
    "monene",
    "big / large / important"
  ],
  [
    "moke",
    "small / little / few"
  ],
  [
    "mosusu",
    "another / other"
  ],
  [
    "nyonso",
    "all / every"
  ],
  [
    "moto",
    "person / someone / fire"
  ],
  [
    "bato",
    "people / persons"
  ],
  [
    "mwasi",
    "woman / wife / female"
  ],
  [
    "mobali",
    "man / husband / male"
  ],
  [
    "mwana",
    "child / son / daughter"
  ],
  [
    "bana",
    "children"
  ],
  [
    "tata",
    "father / Mr."
  ],
  [
    "mama",
    "mother / Mrs."
  ],
  [
    "ndeko",
    "sibling / friend / relative"
  ],
  [
    "monganga",
    "doctor / healer"
  ],
  [
    "mokristo",
    "Christian"
  ],
  [
    "moako",
    "farmer / peasant"
  ],
  [
    "mosali",
    "worker / employee"
  ],
  [
    "mokonzi",
    "chief / leader / boss"
  ],
  [
    "mokambi",
    "guide / director"
  ],
  [
    "lopango",
    "compound / fence / yard"
  ],
  [
    "ndako",
    "house / home / building"
  ],
  [
    "liboso",
    "front / before / first"
  ],
  [
    "nsima",
    "after / behind / back"
  ],
  [
    "likoló",
    "up / above / sky / heaven"
  ],
  [
    "nse",
    "down / below / ground"
  ],
  [
    "kati",
    "inside / middle / among"
  ],
  [
    "libanda",
    "outside / foreign"
  ],
  [
    "penepene",
    "near / close / almost"
  ],
  [
    "mosika",
    "far / distant"
  ],
  [
    "makasi",
    "strong / hard / powerful / serious"
  ],
  [
    "nkembo",
    "glory / honour / praise"
  ],
  [
    "bolingo",
    "love / affection"
  ],
  [
    "ntalo",
    "price / cost / value"
  ],
  [
    "mbongo",
    "money / wealth"
  ],
  [
    "biloko",
    "things / goods / stuff"
  ],
  [
    "eloko",
    "thing / stuff"
  ],
  [
    "esika",
    "place / location / position"
  ],
  [
    "loposo",
    "country / outside / abroad"
  ],
  [
    "mboka",
    "village / hometown / country"
  ],
  [
    "etuka",
    "neighbourhood / village area"
  ],
  [
    "engumba",
    "city / town"
  ],
  [
    "lopango la mboka",
    "country compound"
  ],
  [
    "mikili",
    "countries / lands"
  ],
  [
    "ngai",
    "I / me / my"
  ],
  [
    "yo",
    "you (sing.) / your"
  ],
  [
    "ye",
    "he / she / it / his / her"
  ],
  [
    "biso",
    "we / us / our"
  ],
  [
    "bino",
    "you (pl.) / your (pl.)"
  ],
  [
    "bango",
    "they / them / their"
  ],
  [
    "oyo",
    "this / these / that / these"
  ],
  [
    "wana",
    "that / those over there"
  ],
  [
    "ye moko",
    "alone / him/herself"
  ],
  [
    "elanga",
    "farm / garden / field"
  ],
  [
    "mbisi",
    "fish"
  ],
  [
    "nyama",
    "meat / animal"
  ],
  [
    "mbuma",
    "fruit / seed"
  ],
  [
    "makemba",
    "plantains / bananas"
  ],
  [
    "lituma",
    "plantain dish"
  ],
  [
    "liboke",
    "food wrap"
  ],
  [
    "mai",
    "water"
  ],
  [
    "lotoko",
    "traditional alcohol / drink"
  ],
  [
    "sango",
    "news / information"
  ],
  [
    "lisapo",
    "story / tale / fable"
  ],
  [
    "nzela",
    "path / road / way"
  ],
  [
    "bato ba ndako",
    "household / family"
  ],
  [
    "boloko",
    "prison / jail"
  ],
  [
    "nsango",
    "news / message / gospel"
  ],
  [
    "kelasi",
    "class / school"
  ],
  [
    "sukali",
    "sugar"
  ],
  [
    "mungwa",
    "salt"
  ],
  [
    "mafuta",
    "oil / fat / fuel"
  ],
  [
    "mpembe",
    "white"
  ],
  [
    "ndombe",
    "black"
  ],
  [
    "pupa",
    "red / yellow"
  ],
  [
    "langi",
    "colour / paint"
  ],
  [
    "nsango ya sika",
    "news update / recent news"
  ],
  [
    "kokangama",
    "to be stuck / to hang / to cling"
  ],
  [
    "kolakisa",
    "to show / to teach / to demonstrate"
  ],
  [
    "kosalisa",
    "to help / to assist"
  ],
  [
    "kotombola",
    "to carry / to lift"
  ],
  [
    "kozela",
    "to wait"
  ],
  [
    "kozongela",
    "to reply / to respond / to return"
  ],
  [
    "koyoka",
    "to hear / to feel / to obey"
  ],
  [
    "kopona",
    "to fall / to choose"
  ],
  [
    "kobakisa",
    "to add / to increase"
  ],
  [
    "kokata",
    "to cut"
  ],
  [
    "kofuta",
    "to pay"
  ],
  [
    "kobongisa",
    "to prepare / to fix / to repair"
  ],
  [
    "kosangana",
    "to meet / to gather"
  ],
  [
    "koleka",
    "to pass / to exceed / to cross"
  ],
  [
    "kobalisa",
    "to inform / to notify"
  ],
  [
    "kosekwa",
    "to be surprised / to laugh"
  ],
  [
    "kobunga",
    "to mix / to confuse / to lose the way"
  ],
  [
    "kolobaka",
    "to say / to speak often"
  ],
  [
    "kopusha",
    "to ask"
  ],
  [
    "koloba malamu",
    "to speak well / to say something good"
  ],
  [
    "kotindela",
    "to send to"
  ],
  [
    "kobakama",
    "to be caught"
  ],
  [
    "kotombela",
    "to carry for"
  ],
  [
    "kopesela",
    "to give to"
  ],
  [
    "kotangela",
    "to read for / to count for"
  ],
  [
    "koyebisa",
    "to inform / to make known"
  ],
  [
    "kosalela",
    "to work for / to serve"
  ],
  [
    "komipesa",
    "to offer / to donate"
  ],
  [
    "komiyeba",
    "to know oneself / to be aware"
  ],
  [
    "komizela",
    "to wait for oneself"
  ],
  [
    "esika oyo",
    "here / this place"
  ],
  [
    "tango oyo",
    "now / this time"
  ],
  [
    "mbula",
    "rain / year"
  ],
  [
    "moyi",
    "sun / day / daylight"
  ],
  [
    "butu",
    "night"
  ],
  [
    "tongo",
    "dawn / morning"
  ],
  [
    "midi",
    "noon / midday"
  ],
  [
    "mpokwa",
    "evening / late afternoon"
  ],
  [
    "eleko",
    "season / period / era"
  ],
  [
    "ntango",
    "time / period"
  ],
  [
    "sanza",
    "month / moon"
  ],
  [
    "poso",
    "week"
  ],
  [
    "tango ya poso",
    "weekend / end of week"
  ],
  [
    "ye akei",
    "he/she went"
  ],
  [
    "biso tokeyi",
    "we went"
  ],
  [
    "ye akoya",
    "he/she will come"
  ],
  [
    "biso tokoya",
    "we will come"
  ],
  [
    "ye azali",
    "he/she is"
  ],
  [
    "biso tozali",
    "we are"
  ],
  [
    "nakei",
    "I went"
  ],
  [
    "nakoya",
    "I will come"
  ],
  [
    "nazali",
    "I am"
  ],
  [
    "ozali",
    "you are"
  ],
  [
    "azali",
    "he/she/it is"
  ],
  [
    "tozali",
    "we are"
  ],
  [
    "bino bozali",
    "you (pl.) are"
  ],
  [
    "bango bazali",
    "they are"
  ],
  [
    "moto moko",
    "one person"
  ],
  [
    "bato mibale",
    "two people"
  ],
  [
    "bana misato",
    "three children"
  ],
  [
    "ndako moko",
    "one house"
  ],
  [
    "biloko mingi",
    "many things"
  ],
  [
    "mbongo mingi",
    "a lot of money"
  ],
  [
    "liboso ya",
    "before / in front of"
  ],
  [
    "nsima ya",
    "after / behind"
  ],
  [
    "kati ya",
    "inside / between / among"
  ],
  [
    "banda",
    "since / from"
  ],
  [
    "tii",
    "until / as far as"
  ],
  [
    "pamba te",
    "not for nothing / seriously"
  ],
  [
    "ntina",
    "reason / cause / root"
  ],
  [
    "ntina ya nini",
    "what is the reason?"
  ],
  [
    "likolo ya",
    "on top of / above"
  ],
  [
    "nse ya",
    "below / under"
  ],
  [
    "mpe",
    "also / and / too"
  ],
  [
    "boye",
    "like this / so / thus"
  ],
  [
    "ndenge",
    "manner / way / how"
  ],
  [
    "ndenge moko",
    "the same way / same"
  ],
  [
    "ndenge ya malamu",
    "in a good way"
  ],
  [
    "ndenge ya mabe",
    "in a bad way"
  ],
  [
    "tosali nini",
    "what shall we do?"
  ],
  [
    "tokeya wapi",
    "where shall we go?"
  ],
  [
    "nakosalisa yo",
    "I will help you"
  ],
  [
    "nakopesa yo biloko",
    "I will give you things"
  ],
  [
    "ozali malamu?",
    "are you well? / are you good?"
  ],
  [
    "nazali malamu",
    "I am well / I am good"
  ],
  [
    "osali nini?",
    "what did you do?"
  ],
  [
    "osali malamu",
    "you did well"
  ],
  [
    "nakei kelasi",
    "I went to school"
  ],
  [
    "akoya lobi",
    "he/she will come tomorrow"
  ],
  [
    "tokei lisanga",
    "we went together"
  ],
  [
    "batomboli biloko",
    "they carried things"
  ],
  [
    "epai ya nani?",
    "where to? / whose place?"
  ],
  [
    "epai ya monganga",
    "at the doctor's place"
  ],
  [
    "esika ya malamu",
    "a good place"
  ],
  [
    "ntalo ya biloko",
    "price of goods"
  ],
  [
    "mbongo ya kofuta",
    "money to pay"
  ],
  [
    "mosali ya biso",
    "our worker"
  ],
  [
    "mokonzi ya etuka",
    "neighbourhood chief"
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

/* Lingala-srs-fr.js — Lingala for French speakers.
   Single source of truth: WORDS array is BOTH the SRS deck AND the frequency table.
   SM-2 spaced repetition; progress in localStorage. 218 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = "ln-fr";
  const WORDS = [
  [
    "mbote",
    "bonjour / salutations"
  ],
  [
    "mbote mingi",
    "bonjour / grands salutations"
  ],
  [
    "boyei bolamu",
    "bienvenue (lit. viens bien)"
  ],
  [
    "matondo",
    "merci / gratitude"
  ],
  [
    "matondo mingi",
    "merci beaucoup"
  ],
  [
    "soki",
    "s'il vous plaît / si"
  ],
  [
    "nabongi te",
    "je ne comprends pas"
  ],
  [
    "koloba",
    "parler / dire"
  ],
  [
    "komeka",
    "essayer"
  ],
  [
    "kotika",
    "arrêter / laisser / quitter"
  ],
  [
    "kokeya",
    "aller"
  ],
  [
    "koya",
    "venir"
  ],
  [
    "kozala",
    "être / exister / avoir"
  ],
  [
    "kolya",
    "manger"
  ],
  [
    "komela",
    "boire"
  ],
  [
    "kolala",
    "dormir"
  ],
  [
    "kofanda",
    "s'asseoir / rester / habiter"
  ],
  [
    "kotomboka",
    "se lever"
  ],
  [
    "kokomba",
    "balayer / chercher"
  ],
  [
    "kozwa",
    "prendre / obtenir / recevoir"
  ],
  [
    "kopesa",
    "donner"
  ],
  [
    "komona",
    "voir"
  ],
  [
    "koyeba",
    "savoir / connaître"
  ],
  [
    "kobanda",
    "commencer"
  ],
  [
    "kosilisa",
    "finir / terminer"
  ],
  [
    "kotambola",
    "marcher / voyager"
  ],
  [
    "kokende",
    "allons-y / partir"
  ],
  [
    "kolanda",
    "suivre / continuer"
  ],
  [
    "kobanga",
    "craindre / avoir peur"
  ],
  [
    "kolinga",
    "aimer / vouloir / désirer"
  ],
  [
    "kokanisa",
    "penser / considérer"
  ],
  [
    "kokanga",
    "attraper / fermer / verrouiller"
  ],
  [
    "kobuka",
    "casser / traverser"
  ],
  [
    "kokela",
    "mettre / placer / construire"
  ],
  [
    "koteka",
    "vendre"
  ],
  [
    "kosomba",
    "acheter"
  ],
  [
    "kobeta",
    "frapper / battre / jouer (musique)"
  ],
  [
    "kokota",
    "entrer / rentrer"
  ],
  [
    "kobima",
    "sortir"
  ],
  [
    "kotanga",
    "lire / compter"
  ],
  [
    "kokomba",
    "chercher / balayer"
  ],
  [
    "lelo",
    "aujourd'hui"
  ],
  [
    "lobi",
    "demain"
  ],
  [
    "loba ya kala",
    "hier"
  ],
  [
    "suka",
    "fin / arrêt"
  ],
  [
    "nzoto",
    "corps"
  ],
  [
    "motó",
    "tête"
  ],
  [
    "miso",
    "yeux"
  ],
  [
    "matoyi",
    "oreilles"
  ],
  [
    "monoko",
    "bouche"
  ],
  [
    "zolo",
    "nez"
  ],
  [
    "loboko",
    "bras / main"
  ],
  [
    "lokolo",
    "jambe / pied"
  ],
  [
    "motema",
    "cœur"
  ],
  [
    "epai",
    "endroit / lieu"
  ],
  [
    "na",
    "dans / à / avec / et / vers"
  ],
  [
    "te",
    "ne pas / non (négation)"
  ],
  [
    "awa",
    "ici"
  ],
  [
    "kuna",
    "là / là-bas"
  ],
  [
    "wapi",
    "où?"
  ],
  [
    "nani",
    "qui?"
  ],
  [
    "nini",
    "quoi?"
  ],
  [
    "ndenge nini",
    "comment?"
  ],
  [
    "tango nini",
    "quand?"
  ],
  [
    "mpo nini",
    "pourquoi?"
  ],
  [
    "boni",
    "combien?"
  ],
  [
    "ee",
    "oui"
  ],
  [
    "kasi",
    "mais"
  ],
  [
    "to",
    "ou"
  ],
  [
    "mpe",
    "aussi / et"
  ],
  [
    "solo",
    "vrai / vraiment"
  ],
  [
    "ata",
    "même si / malgré"
  ],
  [
    "sikoyo",
    "maintenant"
  ],
  [
    "mbala",
    "fois / occasion"
  ],
  [
    "mbala moko",
    "une fois"
  ],
  [
    "mbala mingi",
    "souvent"
  ],
  [
    "kala",
    "ancien / autrefois / avant"
  ],
  [
    "malamu",
    "bon / bien / agréable"
  ],
  [
    "mabe",
    "mauvais / mal / laid"
  ],
  [
    "monene",
    "grand / important"
  ],
  [
    "moke",
    "petit / peu"
  ],
  [
    "mosusu",
    "autre"
  ],
  [
    "nyonso",
    "tout / chaque"
  ],
  [
    "moto",
    "personne / quelqu'un / feu"
  ],
  [
    "bato",
    "gens / personnes"
  ],
  [
    "mwasi",
    "femme / épouse"
  ],
  [
    "mobali",
    "homme / mari"
  ],
  [
    "mwana",
    "enfant / fils / fille"
  ],
  [
    "bana",
    "enfants"
  ],
  [
    "tata",
    "père / M."
  ],
  [
    "mama",
    "mère / Mme"
  ],
  [
    "ndeko",
    "frère / ami / parent"
  ],
  [
    "monganga",
    "médecin / guérisseur"
  ],
  [
    "mosali",
    "travailleur / employé"
  ],
  [
    "mokonzi",
    "chef / dirigeant / patron"
  ],
  [
    "mokambi",
    "guide / directeur"
  ],
  [
    "lopango",
    "cour / clôture / enceinte"
  ],
  [
    "ndako",
    "maison / bâtiment"
  ],
  [
    "liboso",
    "devant / avant / premier"
  ],
  [
    "nsima",
    "après / derrière"
  ],
  [
    "likoló",
    "haut / ciel / au-dessus"
  ],
  [
    "nse",
    "bas / en dessous / sol"
  ],
  [
    "kati",
    "intérieur / milieu / parmi"
  ],
  [
    "libanda",
    "extérieur / étranger"
  ],
  [
    "penepene",
    "près / proche"
  ],
  [
    "mosika",
    "loin / distant"
  ],
  [
    "makasi",
    "fort / dur / puissant"
  ],
  [
    "nkembo",
    "gloire / honneur"
  ],
  [
    "bolingo",
    "amour / affection"
  ],
  [
    "ntalo",
    "prix / valeur"
  ],
  [
    "mbongo",
    "argent / richesse"
  ],
  [
    "biloko",
    "choses / marchandises"
  ],
  [
    "eloko",
    "chose / truc"
  ],
  [
    "esika",
    "lieu / endroit / position"
  ],
  [
    "loposo",
    "pays / à l'étranger"
  ],
  [
    "mboka",
    "village / ville natale / pays"
  ],
  [
    "etuka",
    "quartier / zone villageoise"
  ],
  [
    "engumba",
    "ville / agglomération"
  ],
  [
    "ngai",
    "je / moi / mon"
  ],
  [
    "yo",
    "tu / toi / ton"
  ],
  [
    "ye",
    "il / elle / lui / son"
  ],
  [
    "biso",
    "nous / notre"
  ],
  [
    "bino",
    "vous / votre"
  ],
  [
    "bango",
    "ils / elles / leur"
  ],
  [
    "oyo",
    "ce / cet / ces / ceci"
  ],
  [
    "wana",
    "ce / ces / là-bas"
  ],
  [
    "elanga",
    "ferme / jardin / champ"
  ],
  [
    "mbisi",
    "poisson"
  ],
  [
    "nyama",
    "viande / animal"
  ],
  [
    "mbuma",
    "fruit / graine"
  ],
  [
    "makemba",
    "plantains / bananes"
  ],
  [
    "mai",
    "eau"
  ],
  [
    "lotoko",
    "alcool traditionnel / boisson"
  ],
  [
    "sango",
    "nouvelles / informations"
  ],
  [
    "lisapo",
    "histoire / conte / fable"
  ],
  [
    "nzela",
    "chemin / route / voie"
  ],
  [
    "sukali",
    "sucre"
  ],
  [
    "mungwa",
    "sel"
  ],
  [
    "mafuta",
    "huile / graisse / carburant"
  ],
  [
    "nsango",
    "nouvelles / message / évangile"
  ],
  [
    "kelasi",
    "classe / école"
  ],
  [
    "mpembe",
    "blanc"
  ],
  [
    "ndombe",
    "noir"
  ],
  [
    "pupa",
    "rouge / jaune"
  ],
  [
    "langi",
    "couleur / peinture"
  ],
  [
    "kokangama",
    "être coincé / accroché"
  ],
  [
    "kolakisa",
    "montrer / enseigner"
  ],
  [
    "kosalisa",
    "aider / assister"
  ],
  [
    "kotombola",
    "porter / soulever"
  ],
  [
    "kozela",
    "attendre"
  ],
  [
    "kozongela",
    "répondre / revenir"
  ],
  [
    "koyoka",
    "entendre / sentir / obéir"
  ],
  [
    "kopona",
    "tomber / choisir"
  ],
  [
    "kobakisa",
    "ajouter / augmenter"
  ],
  [
    "kokata",
    "couper"
  ],
  [
    "kofuta",
    "payer"
  ],
  [
    "kobongisa",
    "préparer / réparer"
  ],
  [
    "kosangana",
    "se réunir / se retrouver"
  ],
  [
    "koleka",
    "passer / dépasser / traverser"
  ],
  [
    "kobalisa",
    "informer / notifier"
  ],
  [
    "kobunga",
    "mélanger / confondre / se perdre"
  ],
  [
    "kotombela",
    "porter pour"
  ],
  [
    "kopesela",
    "donner à"
  ],
  [
    "kotangela",
    "lire pour / compter pour"
  ],
  [
    "koyebisa",
    "informer / faire savoir"
  ],
  [
    "kosalela",
    "travailler pour / servir"
  ],
  [
    "komipesa",
    "offrir / donner volontairement"
  ],
  [
    "esika oyo",
    "ici / cet endroit"
  ],
  [
    "tango oyo",
    "maintenant / à ce moment"
  ],
  [
    "mbula",
    "pluie / an / année"
  ],
  [
    "moyi",
    "soleil / jour / lumière du jour"
  ],
  [
    "butu",
    "nuit"
  ],
  [
    "tongo",
    "aube / matin"
  ],
  [
    "midi",
    "midi"
  ],
  [
    "mpokwa",
    "soir / fin d'après-midi"
  ],
  [
    "eleko",
    "saison / période / ère"
  ],
  [
    "ntango",
    "temps / période"
  ],
  [
    "sanza",
    "mois / lune"
  ],
  [
    "poso",
    "semaine"
  ],
  [
    "ye akei",
    "il/elle est parti(e)"
  ],
  [
    "ye azali",
    "il/elle est"
  ],
  [
    "biso tozali",
    "nous sommes"
  ],
  [
    "nakei",
    "je suis allé(e)"
  ],
  [
    "nakoya",
    "je viendrai"
  ],
  [
    "nazali",
    "je suis"
  ],
  [
    "ozali",
    "tu es"
  ],
  [
    "azali",
    "il/elle/ça est"
  ],
  [
    "tozali",
    "nous sommes"
  ],
  [
    "bango bazali",
    "ils/elles sont"
  ],
  [
    "moto moko",
    "une personne"
  ],
  [
    "bato mibale",
    "deux personnes"
  ],
  [
    "ndako moko",
    "une maison"
  ],
  [
    "biloko mingi",
    "beaucoup de choses"
  ],
  [
    "mbongo mingi",
    "beaucoup d'argent"
  ],
  [
    "liboso ya",
    "avant / devant"
  ],
  [
    "nsima ya",
    "après / derrière"
  ],
  [
    "kati ya",
    "à l'intérieur de / entre / parmi"
  ],
  [
    "banda",
    "depuis / à partir de"
  ],
  [
    "tii",
    "jusqu'à / aussi loin que"
  ],
  [
    "ntina",
    "raison / cause / racine"
  ],
  [
    "ndenge",
    "manière / façon / comment"
  ],
  [
    "ndenge moko",
    "de la même façon / identique"
  ],
  [
    "tosali nini",
    "qu'allons-nous faire?"
  ],
  [
    "tokeya wapi",
    "où allons-nous?"
  ],
  [
    "nakosalisa yo",
    "je vais t'aider"
  ],
  [
    "nakopesa yo biloko",
    "je vais te donner des choses"
  ],
  [
    "ozali malamu?",
    "tu vas bien?"
  ],
  [
    "nazali malamu",
    "je vais bien"
  ],
  [
    "osali nini?",
    "qu'as-tu fait?"
  ],
  [
    "osali malamu",
    "tu as bien fait"
  ],
  [
    "nakei kelasi",
    "je suis allé à l'école"
  ],
  [
    "akoya lobi",
    "il/elle viendra demain"
  ],
  [
    "tokei lisanga",
    "nous y sommes allés ensemble"
  ],
  [
    "epai ya nani?",
    "où? / chez qui?"
  ],
  [
    "epai ya monganga",
    "chez le médecin"
  ],
  [
    "esika ya malamu",
    "un bon endroit"
  ],
  [
    "ntalo ya biloko",
    "prix des marchandises"
  ],
  [
    "mbongo ya kofuta",
    "argent pour payer"
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

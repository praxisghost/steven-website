/* Chichewa-srs-fr.js — Chichewa for French speakers.
   Single source of truth: WORDS array is BOTH the SRS deck AND the frequency table.
   SM-2 spaced repetition; progress in localStorage. 162 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = "ny-fr";
  const WORDS = [
  [
    "moni",
    "bonjour / salut"
  ],
  [
    "moni bambo",
    "bonjour monsieur"
  ],
  [
    "moni mayi",
    "bonjour madame"
  ],
  [
    "zikomo",
    "merci"
  ],
  [
    "zikomo kwambiri",
    "merci beaucoup"
  ],
  [
    "chonde",
    "s'il vous plaît"
  ],
  [
    "ndikukhululukani",
    "je suis désolé(e) / excusez-moi"
  ],
  [
    "inde",
    "oui"
  ],
  [
    "ayi",
    "non"
  ],
  [
    "bwino",
    "bon / bien"
  ],
  [
    "bwino bwino",
    "très bien / excellent"
  ],
  [
    "muli bwanji?",
    "comment allez-vous?"
  ],
  [
    "nili bwino",
    "je vais bien"
  ],
  [
    "mukhale bwino",
    "au revoir (lit. restez bien)"
  ],
  [
    "tionana",
    "à bientôt"
  ],
  [
    "pepani",
    "désolé(e) / excusez-moi"
  ],
  [
    "sindikumva",
    "je ne comprends pas"
  ],
  [
    "chiyani?",
    "quoi?"
  ],
  [
    "ndani?",
    "qui?"
  ],
  [
    "kuti?",
    "où?"
  ],
  [
    "ndi liti?",
    "quand?"
  ],
  [
    "chifukwa chiyani?",
    "pourquoi?"
  ],
  [
    "bwanji?",
    "comment?"
  ],
  [
    "zingati?",
    "combien?"
  ],
  [
    "ine",
    "je / moi"
  ],
  [
    "iwe",
    "tu / toi"
  ],
  [
    "iye",
    "il / elle"
  ],
  [
    "ife",
    "nous"
  ],
  [
    "inu",
    "vous"
  ],
  [
    "iwo",
    "ils / elles / eux"
  ],
  [
    "nyumba",
    "maison / bâtiment"
  ],
  [
    "msewu",
    "route / chemin / rue"
  ],
  [
    "mudzi",
    "village / ville natale"
  ],
  [
    "tauni",
    "ville / agglomération"
  ],
  [
    "banja",
    "famille"
  ],
  [
    "bambo",
    "père / Monsieur (terme respectueux)"
  ],
  [
    "mayi",
    "mère / Madame (terme respectueux)"
  ],
  [
    "mwana",
    "enfant / fils / fille"
  ],
  [
    "ana",
    "enfants"
  ],
  [
    "mkulu",
    "aîné / ancien / frère/sœur aîné(e)"
  ],
  [
    "mng'ono",
    "cadet(te) / plus jeune"
  ],
  [
    "munthu",
    "personne"
  ],
  [
    "anthu",
    "personnes / gens"
  ],
  [
    "wochiritsa",
    "médecin / guérisseur"
  ],
  [
    "mphunzitsi",
    "enseignant(e) / professeur"
  ],
  [
    "wogulitsa",
    "vendeur / commerçant"
  ],
  [
    "wogula",
    "acheteur"
  ],
  [
    "nthawi",
    "temps / période / saison"
  ],
  [
    "lero",
    "aujourd'hui"
  ],
  [
    "mawa",
    "demain"
  ],
  [
    "dzulo",
    "hier"
  ],
  [
    "usiku",
    "nuit"
  ],
  [
    "m'mawa",
    "matin"
  ],
  [
    "masana",
    "après-midi / midi"
  ],
  [
    "madzulo",
    "soir"
  ],
  [
    "sabata",
    "semaine"
  ],
  [
    "mwezi",
    "mois"
  ],
  [
    "chaka",
    "année"
  ],
  [
    "madzi",
    "eau"
  ],
  [
    "chakula",
    "nourriture"
  ],
  [
    "nyama",
    "viande / animal"
  ],
  [
    "nsomba",
    "poisson"
  ],
  [
    "nkhuku",
    "poulet"
  ],
  [
    "mbuzi",
    "chèvre"
  ],
  [
    "ng'ombe",
    "vache"
  ],
  [
    "chimanga",
    "maïs"
  ],
  [
    "mbatata",
    "pomme de terre / patate douce"
  ],
  [
    "nsima",
    "ugali / bouillie de maïs (plat de base)"
  ],
  [
    "ndiwo",
    "accompagnement / sauce (avec l'nsima)"
  ],
  [
    "mtedza",
    "cacahuètes / arachides"
  ],
  [
    "moto",
    "feu / chaleur / température"
  ],
  [
    "mvula",
    "pluie"
  ],
  [
    "dzuwa",
    "soleil / jour"
  ],
  [
    "mphepo",
    "vent"
  ],
  [
    "mtengo",
    "arbre / bois / prix"
  ],
  [
    "nkhalamba",
    "vieille personne / ancêtre"
  ],
  [
    "mtsikana",
    "fille / jeune femme"
  ],
  [
    "mnyamata",
    "garçon / jeune homme"
  ],
  [
    "mkazi",
    "femme / épouse"
  ],
  [
    "mwamuna",
    "homme / mari"
  ],
  [
    "kuganiza",
    "penser / considérer / planifier"
  ],
  [
    "kukumana",
    "rencontrer"
  ],
  [
    "kuyenda",
    "aller / voyager / marcher"
  ],
  [
    "kubwera",
    "venir"
  ],
  [
    "kukhala",
    "être / rester / habiter / s'asseoir"
  ],
  [
    "kudya",
    "manger"
  ],
  [
    "kumwa",
    "boire"
  ],
  [
    "kugona",
    "dormir"
  ],
  [
    "kudzuka",
    "se réveiller"
  ],
  [
    "kuimba",
    "chanter"
  ],
  [
    "kusewera",
    "jouer"
  ],
  [
    "kuphunzira",
    "apprendre / étudier"
  ],
  [
    "kuphunzitsa",
    "enseigner"
  ],
  [
    "kugwira ntchito",
    "travailler"
  ],
  [
    "kukwera",
    "grimper / monter"
  ],
  [
    "kupita",
    "aller / passer"
  ],
  [
    "kufika",
    "arriver / atteindre"
  ],
  [
    "kubwerera",
    "revenir / retourner"
  ],
  [
    "kuona",
    "voir / regarder"
  ],
  [
    "kumva",
    "entendre / sentir / comprendre"
  ],
  [
    "kuyankhula",
    "parler / répondre"
  ],
  [
    "kufunsa",
    "demander / questionner"
  ],
  [
    "kuuza",
    "dire / informer / vendre"
  ],
  [
    "kugula",
    "acheter"
  ],
  [
    "kulipira",
    "payer"
  ],
  [
    "kupereka",
    "donner / offrir"
  ],
  [
    "kutenga",
    "prendre / porter / apporter"
  ],
  [
    "kupanga",
    "faire / créer / fabriquer"
  ],
  [
    "kuvala",
    "porter / s'habiller"
  ],
  [
    "kusamba",
    "se baigner / se laver"
  ],
  [
    "kumanga",
    "construire / attacher / fermer"
  ],
  [
    "kothyola",
    "casser / briser"
  ],
  [
    "kutseka",
    "fermer / verrouiller"
  ],
  [
    "kutsegula",
    "ouvrir"
  ],
  [
    "kutumiza",
    "envoyer"
  ],
  [
    "kulandila",
    "recevoir / accueillir"
  ],
  [
    "kuvomereza",
    "accepter / être d'accord"
  ],
  [
    "kukana",
    "refuser / nier"
  ],
  [
    "wabwino",
    "bon / bien (adjectif)"
  ],
  [
    "woyipa",
    "mauvais / méchant"
  ],
  [
    "wokongola",
    "beau / belle"
  ],
  [
    "wafupi",
    "court / proche"
  ],
  [
    "wotali",
    "grand / long / loin"
  ],
  [
    "wamkulu",
    "grand / important"
  ],
  [
    "wamng'ono",
    "petit / jeune"
  ],
  [
    "woyera",
    "blanc / propre / pur / saint"
  ],
  [
    "wakuda",
    "noir / sombre"
  ],
  [
    "wofiira",
    "rouge / rougeâtre"
  ],
  [
    "mawu",
    "mots / langue / voix"
  ],
  [
    "chiyankhulo",
    "langue / dialecte"
  ],
  [
    "chichewa",
    "langue chichewa"
  ],
  [
    "chingerezi",
    "langue anglaise"
  ],
  [
    "chifalansa",
    "langue française"
  ],
  [
    "chimwemwe",
    "joie / bonheur"
  ],
  [
    "chisoni",
    "tristesse / pitié"
  ],
  [
    "chikondi",
    "amour"
  ],
  [
    "chiyambi",
    "début / commencement / origine"
  ],
  [
    "chuma",
    "richesse / fer / argent"
  ],
  [
    "ndalama",
    "argent / monnaie"
  ],
  [
    "ntchito",
    "travail / emploi / tâche"
  ],
  [
    "malipiro",
    "paiement / salaire"
  ],
  [
    "mphatso",
    "cadeau / présent"
  ],
  [
    "chipatala",
    "hôpital / clinique"
  ],
  [
    "mankhwala",
    "médicament / remède"
  ],
  [
    "odwala",
    "patient / malade"
  ],
  [
    "choonadi",
    "vérité"
  ],
  [
    "mtendere",
    "paix"
  ],
  [
    "chitukuko",
    "développement / progrès"
  ],
  [
    "nzeru",
    "sagesse / intelligence"
  ],
  [
    "maphunziro",
    "éducation / formation"
  ],
  [
    "sukulu",
    "école"
  ],
  [
    "galimoto",
    "voiture / véhicule"
  ],
  [
    "ndege",
    "avion / oiseau"
  ],
  [
    "basi",
    "bus / autobus"
  ],
  [
    "njinga",
    "vélo / bicyclette"
  ],
  [
    "malamulo",
    "règles / lois"
  ],
  [
    "boma",
    "gouvernement / district"
  ],
  [
    "chikhalidwe",
    "culture / tradition / coutume"
  ],
  [
    "nthano",
    "histoire / conte / mythe"
  ],
  [
    "nyimbo",
    "chanson / hymne"
  ],
  [
    "ng'oma",
    "tambour"
  ],
  [
    "masewero",
    "jeu / sport / spectacle"
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

/* Swahili-srs-fr.js — Swahili for French speakers.
   Single source of truth: WORDS array is BOTH the SRS deck AND the frequency table.
   SM-2 spaced repetition; progress in localStorage. 288 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = "sw-fr";
  const WORDS = [
  [
    "habari",
    "nouvelles / comment allez-vous? (lit. quelles nouvelles?)"
  ],
  [
    "habari gani?",
    "comment allez-vous?"
  ],
  [
    "nzuri",
    "bien / bon"
  ],
  [
    "asante",
    "merci"
  ],
  [
    "asante sana",
    "merci beaucoup"
  ],
  [
    "tafadhali",
    "s'il vous plaît"
  ],
  [
    "samahani",
    "pardon / excusez-moi"
  ],
  [
    "ndio",
    "oui"
  ],
  [
    "hapana / la",
    "non"
  ],
  [
    "karibu",
    "bienvenue / je vous en prie"
  ],
  [
    "karibu sana",
    "très bienvenu(e)"
  ],
  [
    "sawa",
    "d'accord / ça va"
  ],
  [
    "sawa sawa",
    "très bien / d'accord"
  ],
  [
    "pole",
    "désolé(e) / condoléances"
  ],
  [
    "pole pole",
    "doucement / lentement"
  ],
  [
    "haraka",
    "vite / rapidement"
  ],
  [
    "pamoja",
    "ensemble"
  ],
  [
    "safi",
    "propre / pur / génial"
  ],
  [
    "bado",
    "pas encore / toujours / encore"
  ],
  [
    "tayari",
    "déjà / prêt"
  ],
  [
    "kwisha",
    "fini / terminé / déjà"
  ],
  [
    "kabla",
    "avant"
  ],
  [
    "baada",
    "après"
  ],
  [
    "sasa",
    "maintenant"
  ],
  [
    "kesho",
    "demain"
  ],
  [
    "jana",
    "hier"
  ],
  [
    "leo",
    "aujourd'hui"
  ],
  [
    "usiku",
    "nuit"
  ],
  [
    "asubuhi",
    "matin"
  ],
  [
    "mchana",
    "après-midi / milieu de la journée"
  ],
  [
    "jioni",
    "soir / après-midi tardif"
  ],
  [
    "wiki",
    "semaine"
  ],
  [
    "mwezi",
    "mois"
  ],
  [
    "mwaka",
    "année"
  ],
  [
    "wakati",
    "temps / quand / moment"
  ],
  [
    "mara",
    "fois / fois"
  ],
  [
    "mara nyingi",
    "souvent / beaucoup de fois"
  ],
  [
    "mara moja",
    "immédiatement / une fois"
  ],
  [
    "kidogo",
    "un peu / un peu"
  ],
  [
    "mengi",
    "beaucoup / nombreux (pour les choses)"
  ],
  [
    "wengi",
    "nombreux / la plupart (pour les gens)"
  ],
  [
    "sana",
    "très / beaucoup"
  ],
  [
    "kabisa",
    "complètement / tout à fait"
  ],
  [
    "tu",
    "seulement / juste"
  ],
  [
    "pia",
    "aussi / également"
  ],
  [
    "au",
    "ou"
  ],
  [
    "na",
    "et / avec / par"
  ],
  [
    "lakini",
    "mais"
  ],
  [
    "kwa sababu",
    "parce que"
  ],
  [
    "ili",
    "afin que / pour que"
  ],
  [
    "kama",
    "si / comme / environ"
  ],
  [
    "kwamba",
    "que (conjonction)"
  ],
  [
    "yeye",
    "il / elle / lui"
  ],
  [
    "mimi",
    "je / moi"
  ],
  [
    "wewe",
    "tu / toi"
  ],
  [
    "sisi",
    "nous"
  ],
  [
    "ninyi",
    "vous"
  ],
  [
    "wao",
    "ils / elles / eux / leur"
  ],
  [
    "mtu",
    "personne / quelqu'un"
  ],
  [
    "watu",
    "gens / personnes"
  ],
  [
    "mtoto",
    "enfant"
  ],
  [
    "watoto",
    "enfants"
  ],
  [
    "mzee",
    "ancien / personne âgée / sage"
  ],
  [
    "mama",
    "mère / Mme"
  ],
  [
    "baba",
    "père / M."
  ],
  [
    "kaka",
    "frère"
  ],
  [
    "dada",
    "sœur"
  ],
  [
    "ndugu",
    "frère / sœur / famille / camarade"
  ],
  [
    "rafiki",
    "ami(e)"
  ],
  [
    "mwalimu",
    "enseignant(e) / professeur"
  ],
  [
    "daktari",
    "médecin / docteur"
  ],
  [
    "polisi",
    "police"
  ],
  [
    "mwanafunzi",
    "étudiant(e) / élève"
  ],
  [
    "mfanyabiashara",
    "commerçant / homme d'affaires"
  ],
  [
    "bwana",
    "monsieur / Monsieur"
  ],
  [
    "bibi",
    "grand-mère / Madame"
  ],
  [
    "nyumba",
    "maison / bâtiment"
  ],
  [
    "chumba",
    "chambre / pièce"
  ],
  [
    "mlango",
    "porte"
  ],
  [
    "dirisha",
    "fenêtre"
  ],
  [
    "meza",
    "table"
  ],
  [
    "kiti",
    "chaise"
  ],
  [
    "kitanda",
    "lit"
  ],
  [
    "jiko",
    "cuisinière / fourneau"
  ],
  [
    "bafu",
    "salle de bain / bain"
  ],
  [
    "choo",
    "toilettes"
  ],
  [
    "shule / shule",
    "école"
  ],
  [
    "hospitali",
    "hôpital"
  ],
  [
    "kanisa",
    "église"
  ],
  [
    "msikiti",
    "mosquée"
  ],
  [
    "soko",
    "marché"
  ],
  [
    "duka",
    "boutique / magasin"
  ],
  [
    "benki",
    "banque"
  ],
  [
    "ofisi",
    "bureau"
  ],
  [
    "barabara",
    "rue / route / autoroute"
  ],
  [
    "njia",
    "chemin / voie / moyen"
  ],
  [
    "mto",
    "rivière / cours d'eau"
  ],
  [
    "ziwa",
    "lac"
  ],
  [
    "bahari",
    "mer / océan"
  ],
  [
    "milima",
    "montagnes"
  ],
  [
    "msitu",
    "forêt"
  ],
  [
    "jangwa",
    "désert"
  ],
  [
    "shamba",
    "ferme / champ / jardin"
  ],
  [
    "mji",
    "ville / localité"
  ],
  [
    "nchi",
    "pays"
  ],
  [
    "dunia",
    "monde / terre"
  ],
  [
    "maji",
    "eau"
  ],
  [
    "chakula",
    "nourriture"
  ],
  [
    "mkate",
    "pain"
  ],
  [
    "mchele",
    "riz (non cuit)"
  ],
  [
    "wali",
    "riz (cuit)"
  ],
  [
    "mahindi",
    "maïs"
  ],
  [
    "ndizi",
    "bananes"
  ],
  [
    "nyanya",
    "tomates"
  ],
  [
    "vitunguu",
    "oignons"
  ],
  [
    "nyama",
    "viande"
  ],
  [
    "samaki",
    "poisson"
  ],
  [
    "kuku",
    "poulet"
  ],
  [
    "mayai",
    "œufs"
  ],
  [
    "maziwa",
    "lait"
  ],
  [
    "sukari",
    "sucre"
  ],
  [
    "chumvi",
    "sel"
  ],
  [
    "mafuta",
    "huile / graisse"
  ],
  [
    "mchango",
    "contribution / cotisation"
  ],
  [
    "chai",
    "thé"
  ],
  [
    "kahawa",
    "café"
  ],
  [
    "maji ya machungwa",
    "jus d'orange"
  ],
  [
    "pombe",
    "alcool / bière"
  ],
  [
    "kula",
    "manger"
  ],
  [
    "kunywa",
    "boire"
  ],
  [
    "kupika",
    "cuisiner"
  ],
  [
    "kulala",
    "dormir"
  ],
  [
    "kuamka",
    "se réveiller"
  ],
  [
    "kusimama",
    "se lever / s'arrêter / se tenir debout"
  ],
  [
    "kukaa",
    "s'asseoir / rester / habiter"
  ],
  [
    "kutembea",
    "marcher / se promener / voyager"
  ],
  [
    "kwenda",
    "aller"
  ],
  [
    "kuja",
    "venir"
  ],
  [
    "kurudi",
    "revenir / retourner"
  ],
  [
    "kuingia",
    "entrer"
  ],
  [
    "kutoka",
    "sortir / venir de / partir"
  ],
  [
    "kusema",
    "dire / parler"
  ],
  [
    "kusikia",
    "entendre / sentir"
  ],
  [
    "kuona",
    "voir"
  ],
  [
    "kujua",
    "savoir / connaître"
  ],
  [
    "kufanya",
    "faire"
  ],
  [
    "kusaidia",
    "aider"
  ],
  [
    "kutaka",
    "vouloir"
  ],
  [
    "kupenda",
    "aimer"
  ],
  [
    "kucheza",
    "jouer"
  ],
  [
    "kufanya kazi",
    "travailler"
  ],
  [
    "kusoma",
    "lire / étudier"
  ],
  [
    "kuandika",
    "écrire"
  ],
  [
    "kuhesabu",
    "compter / calculer"
  ],
  [
    "kupata",
    "obtenir / trouver"
  ],
  [
    "kulipa",
    "payer"
  ],
  [
    "kununua",
    "acheter"
  ],
  [
    "kuuza",
    "vendre"
  ],
  [
    "kutoa",
    "donner / retirer"
  ],
  [
    "kuchukua",
    "prendre / saisir"
  ],
  [
    "kupeleka",
    "envoyer / emmener"
  ],
  [
    "kuleta",
    "apporter"
  ],
  [
    "kufungua",
    "ouvrir"
  ],
  [
    "kufunga",
    "fermer"
  ],
  [
    "kusafisha",
    "nettoyer"
  ],
  [
    "kujenga",
    "construire"
  ],
  [
    "kukata",
    "couper"
  ],
  [
    "kupiga",
    "frapper / battre"
  ],
  [
    "kuvunja",
    "casser"
  ],
  [
    "kuomba",
    "demander / prier"
  ],
  [
    "kujibu",
    "répondre"
  ],
  [
    "kuuliza",
    "questionner"
  ],
  [
    "kufundisha",
    "enseigner"
  ],
  [
    "kujifunza",
    "apprendre"
  ],
  [
    "kubwa",
    "grand / gros / important"
  ],
  [
    "ndogo",
    "petit / peu"
  ],
  [
    "nzuri",
    "bon / beau / bien"
  ],
  [
    "mbaya",
    "mauvais / laid"
  ],
  [
    "kali",
    "fort / dur / épicé / en colère"
  ],
  [
    "laini",
    "doux / tendre"
  ],
  [
    "nyeupe",
    "blanc"
  ],
  [
    "nyeusi",
    "noir"
  ],
  [
    "nyekundu",
    "rouge"
  ],
  [
    "njano",
    "jaune"
  ],
  [
    "kijani",
    "vert"
  ],
  [
    "buluu",
    "bleu"
  ],
  [
    "moja",
    "un"
  ],
  [
    "mbili",
    "deux"
  ],
  [
    "tatu",
    "trois"
  ],
  [
    "nne",
    "quatre"
  ],
  [
    "tano",
    "cinq"
  ],
  [
    "sita",
    "six"
  ],
  [
    "saba",
    "sept"
  ],
  [
    "nane",
    "huit"
  ],
  [
    "tisa",
    "neuf"
  ],
  [
    "kumi",
    "dix"
  ],
  [
    "ishirini",
    "vingt"
  ],
  [
    "thelathini",
    "trente"
  ],
  [
    "mia",
    "cent"
  ],
  [
    "elfu",
    "mille"
  ],
  [
    "nusu",
    "moitié / demi"
  ],
  [
    "robo",
    "quart"
  ],
  [
    "asilimia",
    "pourcentage / intérêt"
  ],
  [
    "swahili",
    "swahili / kiswahili"
  ],
  [
    "kiswahili",
    "la langue swahili"
  ],
  [
    "lugha",
    "langue"
  ],
  [
    "neno",
    "mot"
  ],
  [
    "sentensi",
    "phrase"
  ],
  [
    "sarufi",
    "grammaire"
  ],
  [
    "msamiati",
    "vocabulaire"
  ],
  [
    "matamshi",
    "prononciation"
  ],
  [
    "darasa",
    "classe / leçon"
  ],
  [
    "kitabu",
    "livre"
  ],
  [
    "kalamu",
    "stylo / crayon"
  ],
  [
    "karatasi",
    "papier"
  ],
  [
    "kompyuta",
    "ordinateur"
  ],
  [
    "simu",
    "téléphone"
  ],
  [
    "mtandao",
    "internet / réseau"
  ],
  [
    "televisheni",
    "télévision"
  ],
  [
    "redio",
    "radio"
  ],
  [
    "picha",
    "photo / image / tableau"
  ],
  [
    "wimbo",
    "chanson / chant"
  ],
  [
    "ngoma",
    "tambour / musique / fête"
  ],
  [
    "mchezo",
    "jeu / sport / spectacle"
  ],
  [
    "saa",
    "heure / montre"
  ],
  [
    "dakika",
    "minute"
  ],
  [
    "sekunde",
    "seconde"
  ],
  [
    "nambari",
    "nombre / numéro"
  ],
  [
    "tarehe",
    "date"
  ],
  [
    "jina",
    "nom"
  ],
  [
    "jibu",
    "réponse"
  ],
  [
    "swali",
    "question"
  ],
  [
    "tatizo",
    "problème"
  ],
  [
    "jibu",
    "solution / réponse"
  ],
  [
    "habari",
    "informations / nouvelles"
  ],
  [
    "historia",
    "histoire"
  ],
  [
    "sayansi",
    "science"
  ],
  [
    "hisabati",
    "mathématiques"
  ],
  [
    "sheria",
    "droit / loi"
  ],
  [
    "dini",
    "religion"
  ],
  [
    "siasa",
    "politique"
  ],
  [
    "uchumi",
    "économie / richesse"
  ],
  [
    "pesa",
    "argent"
  ],
  [
    "kodi",
    "impôt / code"
  ],
  [
    "kazi",
    "travail / emploi"
  ],
  [
    "mishahara",
    "salaire"
  ],
  [
    "afya",
    "santé"
  ],
  [
    "mgonjwa",
    "malade / patient"
  ],
  [
    "dawa",
    "médicament / poison"
  ],
  [
    "operesheni",
    "opération / chirurgie"
  ],
  [
    "hospitali",
    "hôpital"
  ],
  [
    "fahamu",
    "comprendre / comprends"
  ],
  [
    "simama",
    "arrête / debout"
  ],
  [
    "nenda",
    "vas-y / pars"
  ],
  [
    "njoo",
    "viens"
  ],
  [
    "kaa",
    "assieds-toi / reste"
  ],
  [
    "angalia",
    "regarde / fais attention"
  ],
  [
    "sikiliza",
    "écoute"
  ],
  [
    "sema",
    "dis / parle"
  ],
  [
    "andika",
    "écris"
  ],
  [
    "soma",
    "lis / étudie"
  ],
  [
    "la",
    "mange"
  ],
  [
    "nywa",
    "bois"
  ],
  [
    "lala",
    "dors"
  ],
  [
    "amka",
    "réveille-toi"
  ],
  [
    "kwaheri",
    "au revoir"
  ],
  [
    "tutaonana",
    "à bientôt / on se reverra"
  ],
  [
    "lala salama",
    "bonne nuit (lit. dors en paix)"
  ],
  [
    "safari njema",
    "bon voyage"
  ],
  [
    "asante kwa kila kitu",
    "merci pour tout"
  ],
  [
    "samahani sana",
    "désolé(e) vraiment"
  ],
  [
    "sikusikia",
    "je n'ai pas entendu"
  ],
  [
    "tena",
    "encore / de nouveau"
  ],
  [
    "si",
    "ne pas (préfixe négatif)"
  ],
  [
    "sina",
    "je n'ai pas"
  ],
  [
    "sijui",
    "je ne sais pas"
  ],
  [
    "sielewi",
    "je ne comprends pas"
  ],
  [
    "sijasikia",
    "je n'ai pas entendu"
  ],
  [
    "sijakula",
    "je n'ai pas mangé"
  ],
  [
    "sijafika",
    "je ne suis pas encore arrivé(e)"
  ],
  [
    "ninahitaji",
    "j'ai besoin de / je nécessite"
  ],
  [
    "ninaweza",
    "je peux / je suis capable"
  ],
  [
    "labda",
    "peut-être"
  ],
  [
    "pengine",
    "peut-être / autrement"
  ],
  [
    "bila shaka",
    "sans doute / certainement"
  ],
  [
    "kweli",
    "vrai / vraiment"
  ],
  [
    "sivyo?",
    "n'est-ce pas? / non?"
  ],
  [
    "ndiyo hivyo",
    "c'est ça / exactement"
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

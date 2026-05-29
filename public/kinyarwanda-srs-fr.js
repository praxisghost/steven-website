/* Kinyarwanda-srs-fr.js — Kinyarwanda for French speakers.
   Single source of truth: WORDS array is BOTH the SRS deck AND the
   data rendered into the page frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 353 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = "ki-fr";
  const WORDS = [
  [
    "muraho",
    "bonjour (formel)"
  ],
  [
    "bite",
    "bonjour / comment ça va?"
  ],
  [
    "murakoze",
    "merci"
  ],
  [
    "murakoze cyane",
    "merci beaucoup"
  ],
  [
    "yego",
    "oui"
  ],
  [
    "oya",
    "non"
  ],
  [
    "mfashe",
    "s'il vous plaît / aidez-moi"
  ],
  [
    "murakaza neza",
    "bienvenue"
  ],
  [
    "amahoro",
    "paix / bonjour"
  ],
  [
    "nibyo",
    "c'est ça / en effet"
  ],
  [
    "nta",
    "non / pas / aucun"
  ],
  [
    "bwana",
    "monsieur"
  ],
  [
    "nyakubahwa",
    "honorable / respecté"
  ],
  [
    "inshuti",
    "ami(e)"
  ],
  [
    "umuryango",
    "famille / porte"
  ],
  [
    "ababyeyi",
    "parents"
  ],
  [
    "se",
    "père"
  ],
  [
    "nyina",
    "mère"
  ],
  [
    "mukuru",
    "aîné / frère ou sœur aîné(e)"
  ],
  [
    "murumuna",
    "cadet(te) / frère ou sœur plus jeune"
  ],
  [
    "umugabo",
    "homme / mari"
  ],
  [
    "umugore",
    "femme / épouse"
  ],
  [
    "umwana",
    "enfant"
  ],
  [
    "abana",
    "enfants"
  ],
  [
    "umuntu",
    "personne"
  ],
  [
    "abantu",
    "personnes / gens"
  ],
  [
    "undi",
    "autre"
  ],
  [
    "buri",
    "chaque / tout"
  ],
  [
    "wa",
    "de (possessif)"
  ],
  [
    "ni",
    "est / suis / sommes"
  ],
  [
    "na",
    "et / avec / aussi"
  ],
  [
    "ariko",
    "mais / cependant"
  ],
  [
    "kuko",
    "parce que"
  ],
  [
    "kugira ngo",
    "pour / afin de"
  ],
  [
    "niba",
    "si"
  ],
  [
    "igihe",
    "temps / moment"
  ],
  [
    "none",
    "maintenant / alors"
  ],
  [
    "rero",
    "donc / par conséquent"
  ],
  [
    "mbere",
    "avant / devant"
  ],
  [
    "nyuma",
    "après / derrière"
  ],
  [
    "hafi",
    "près / presque"
  ],
  [
    "kure",
    "loin"
  ],
  [
    "hino",
    "ici"
  ],
  [
    "hariya",
    "là-bas"
  ],
  [
    "aho",
    "là / où"
  ],
  [
    "iki",
    "ceci / quoi?"
  ],
  [
    "icyo",
    "cela"
  ],
  [
    "uyu",
    "cette (personne)"
  ],
  [
    "uwo",
    "cet(te) autre (personne)"
  ],
  [
    "aba",
    "ces (personnes)"
  ],
  [
    "izo",
    "ceux-là / celles-là"
  ],
  [
    "gute",
    "comment?"
  ],
  [
    "nde",
    "qui?"
  ],
  [
    "he",
    "où?"
  ],
  [
    "ryari",
    "quand?"
  ],
  [
    "kuki",
    "pourquoi?"
  ],
  [
    "angahe",
    "combien?"
  ],
  [
    "kumva",
    "entendre / comprendre / sentir"
  ],
  [
    "kuvuga",
    "parler / dire"
  ],
  [
    "gusobanura",
    "expliquer"
  ],
  [
    "kwandika",
    "écrire"
  ],
  [
    "gusoma",
    "lire"
  ],
  [
    "kwiga",
    "étudier / apprendre"
  ],
  [
    "gukora",
    "travailler / faire"
  ],
  [
    "kuva",
    "venir de / partir"
  ],
  [
    "kuja",
    "venir"
  ],
  [
    "kugenda",
    "aller / marcher"
  ],
  [
    "gutura",
    "habiter / résider"
  ],
  [
    "kuririmba",
    "chanter"
  ],
  [
    "kurarika",
    "dormir"
  ],
  [
    "kuzinduka",
    "se réveiller"
  ],
  [
    "gufata",
    "prendre / tenir"
  ],
  [
    "guha",
    "donner"
  ],
  [
    "kubona",
    "voir / trouver / obtenir"
  ],
  [
    "kureba",
    "regarder / observer"
  ],
  [
    "gusobanukirwa",
    "bien comprendre"
  ],
  [
    "kwibuka",
    "se souvenir"
  ],
  [
    "kurima",
    "cultiver / labourer"
  ],
  [
    "kugura",
    "acheter"
  ],
  [
    "kugurisha",
    "vendre"
  ],
  [
    "kurya",
    "manger"
  ],
  [
    "kunywa",
    "boire"
  ],
  [
    "gufungura",
    "ouvrir / manger"
  ],
  [
    "gufunga",
    "fermer / verrouiller"
  ],
  [
    "kuvoma",
    "aller chercher de l'eau"
  ],
  [
    "guteka",
    "cuisiner"
  ],
  [
    "kwambara",
    "porter / s'habiller"
  ],
  [
    "kubara",
    "compter"
  ],
  [
    "gutanga",
    "donner / offrir / commencer"
  ],
  [
    "gusaba",
    "demander / prier"
  ],
  [
    "gusubiza",
    "répondre"
  ],
  [
    "kuganira",
    "converser / discuter"
  ],
  [
    "guseka",
    "rire"
  ],
  [
    "kurira",
    "pleurer / couler"
  ],
  [
    "gutinya",
    "craindre / avoir peur"
  ],
  [
    "gukunda",
    "aimer / apprécier"
  ],
  [
    "gutekereza",
    "penser / réfléchir"
  ],
  [
    "kwizera",
    "faire confiance / croire"
  ],
  [
    "guhangayika",
    "s'inquiéter"
  ],
  [
    "gutunga",
    "posséder / avoir"
  ],
  [
    "gusabana",
    "emprunter / partager"
  ],
  [
    "ubwenge",
    "intelligence / sagesse"
  ],
  [
    "imbaraga",
    "force / énergie"
  ],
  [
    "ubuzima",
    "santé / vie"
  ],
  [
    "indwara",
    "maladie"
  ],
  [
    "umubiri",
    "corps"
  ],
  [
    "umutwe",
    "tête"
  ],
  [
    "amaso",
    "yeux"
  ],
  [
    "amatwi",
    "oreilles"
  ],
  [
    "inyonga",
    "main"
  ],
  [
    "amaguru",
    "jambes / pieds"
  ],
  [
    "umunwa",
    "bouche"
  ],
  [
    "inzara",
    "faim"
  ],
  [
    "inyota",
    "soif"
  ],
  [
    "imana",
    "Dieu"
  ],
  [
    "isengesho",
    "prière"
  ],
  [
    "itorero",
    "église"
  ],
  [
    "icyumweru",
    "semaine"
  ],
  [
    "ukwezi",
    "mois"
  ],
  [
    "umwaka",
    "année"
  ],
  [
    "uyu munsi",
    "aujourd'hui"
  ],
  [
    "ejo",
    "hier / demain"
  ],
  [
    "ejo hashize",
    "hier"
  ],
  [
    "ejo hazaza",
    "demain"
  ],
  [
    "ubu",
    "maintenant / actuellement"
  ],
  [
    "noneho",
    "maintenant même"
  ],
  [
    "amasaha",
    "heures"
  ],
  [
    "mu gitondo",
    "le matin"
  ],
  [
    "nijoro",
    "la nuit"
  ],
  [
    "nimugoroba",
    "le soir / la soirée"
  ],
  [
    "umuriro",
    "feu / fièvre"
  ],
  [
    "amazi",
    "eau"
  ],
  [
    "ibyokurya",
    "nourriture / aliments"
  ],
  [
    "inzoga",
    "bière / boisson alcoolisée"
  ],
  [
    "amata",
    "lait"
  ],
  [
    "isukari",
    "sucre"
  ],
  [
    "umunyu",
    "sel"
  ],
  [
    "ibiryaro",
    "légumes"
  ],
  [
    "imbuto",
    "graine / fruit"
  ],
  [
    "uburo",
    "sorgho / millet"
  ],
  [
    "ibiharage",
    "haricots"
  ],
  [
    "ibirayi",
    "pommes de terre"
  ],
  [
    "inshyushyu",
    "piment rouge"
  ],
  [
    "inyama",
    "viande"
  ],
  [
    "ifi",
    "poisson (pluriel)"
  ],
  [
    "ikijumba",
    "patate douce"
  ],
  [
    "ubugari",
    "bouillie / ugali"
  ],
  [
    "ameza",
    "table"
  ],
  [
    "inzira",
    "chemin / route"
  ],
  [
    "umuhanda",
    "route / rue"
  ],
  [
    "imodoka",
    "voiture / automobile"
  ],
  [
    "bisi",
    "bus / autobus"
  ],
  [
    "indege",
    "avion / oiseau"
  ],
  [
    "umudugudu",
    "village"
  ],
  [
    "umujyi",
    "ville / cité"
  ],
  [
    "iwacu",
    "chez nous / notre maison"
  ],
  [
    "inzu",
    "maison / bâtiment"
  ],
  [
    "ikiraro",
    "pont"
  ],
  [
    "isoko",
    "marché"
  ],
  [
    "ibitaro",
    "hôpital"
  ],
  [
    "ishuri",
    "école"
  ],
  [
    "kaminuza",
    "université"
  ],
  [
    "leta",
    "gouvernement / État"
  ],
  [
    "perezida",
    "président"
  ],
  [
    "minisitiri",
    "ministre"
  ],
  [
    "polisi",
    "police"
  ],
  [
    "itegeko",
    "loi / règle"
  ],
  [
    "iterambere",
    "développement / progrès"
  ],
  [
    "ubukungu",
    "économie"
  ],
  [
    "amafaranga",
    "argent"
  ],
  [
    "banki",
    "banque"
  ],
  [
    "akazi",
    "travail / emploi"
  ],
  [
    "umushahara",
    "salaire"
  ],
  [
    "umurimo",
    "travail / profession"
  ],
  [
    "uburere",
    "éducation / élevage"
  ],
  [
    "ubumenyi",
    "connaissance / science"
  ],
  [
    "ubushakashatsi",
    "recherche"
  ],
  [
    "intego",
    "objectif / but"
  ],
  [
    "icyizere",
    "espoir / confiance"
  ],
  [
    "amahirwe",
    "opportunité / chance"
  ],
  [
    "ibibazo",
    "problèmes / questions"
  ],
  [
    "ibisubizo",
    "réponses / solutions"
  ],
  [
    "icyemezo",
    "décision / certificat"
  ],
  [
    "amategeko",
    "lois / règles"
  ],
  [
    "ingufu",
    "force / énergie"
  ],
  [
    "umurenge",
    "secteur (admin.)"
  ],
  [
    "akarere",
    "district"
  ],
  [
    "igihugu",
    "pays / nation"
  ],
  [
    "Afrika",
    "Afrique"
  ],
  [
    "Rwanda",
    "Rwanda"
  ],
  [
    "Kigali",
    "Kigali (capitale)"
  ],
  [
    "umuganda",
    "travaux communautaires"
  ],
  [
    "gahunda",
    "programme / plan"
  ],
  [
    "imbere",
    "avenir / devant"
  ],
  [
    "ikibazo",
    "problème / question"
  ],
  [
    "igisubizo",
    "réponse / solution"
  ],
  [
    "amahoro",
    "paix"
  ],
  [
    "ubwiyunge",
    "réconciliation"
  ],
  [
    "umuvuduko",
    "vitesse"
  ],
  [
    "inkuru",
    "histoire / nouvelles"
  ],
  [
    "radio",
    "radio"
  ],
  [
    "televiziyo",
    "télévision"
  ],
  [
    "telefoni",
    "téléphone"
  ],
  [
    "interineti",
    "internet"
  ],
  [
    "mudasobwa",
    "ordinateur"
  ],
  [
    "ibaruwa",
    "lettre / email"
  ],
  [
    "ubutumwa",
    "message"
  ],
  [
    "igitabo",
    "livre"
  ],
  [
    "ikinyamakuru",
    "journal / presse"
  ],
  [
    "ubuyobozi",
    "direction / gestion"
  ],
  [
    "kuvumbura",
    "découvrir"
  ],
  [
    "guhuza",
    "connecter / unir"
  ],
  [
    "gusubira",
    "retourner / revenir"
  ],
  [
    "gutangira",
    "commencer / débuter"
  ],
  [
    "kurangira",
    "finir / terminer"
  ],
  [
    "gukomeza",
    "continuer"
  ],
  [
    "guhagarara",
    "s'arrêter / cesser"
  ],
  [
    "kugira",
    "avoir / être"
  ],
  [
    "kubaho",
    "exister / vivre"
  ],
  [
    "kuzuka",
    "se lever / ressusciter"
  ],
  [
    "gupfa",
    "mourir"
  ],
  [
    "kuvuka",
    "naître / germer"
  ],
  [
    "gutera",
    "planter / attaquer"
  ],
  [
    "gufasha",
    "aider / assister"
  ],
  [
    "kubaka",
    "construire / bâtir"
  ],
  [
    "gutwara",
    "transporter / conduire"
  ],
  [
    "kohereza",
    "envoyer"
  ],
  [
    "kwakira",
    "recevoir / accepter"
  ],
  [
    "gufatanya",
    "coopérer / collaborer"
  ],
  [
    "kwiyemeza",
    "décider / se déterminer"
  ],
  [
    "guhitamo",
    "choisir / sélectionner"
  ],
  [
    "gusuzuma",
    "examiner / vérifier"
  ],
  [
    "gukura",
    "grandir / se développer"
  ],
  [
    "kwibagirwa",
    "oublier"
  ],
  [
    "gutandukana",
    "se séparer / différer"
  ],
  [
    "kuvugana",
    "s'accorder / se consulter"
  ],
  [
    "gukemura",
    "résoudre / régler"
  ],
  [
    "gucunga",
    "gérer / administrer"
  ],
  [
    "kwita ku",
    "prendre soin de"
  ],
  [
    "kwishimira",
    "se réjouir / apprécier"
  ],
  [
    "gushimira",
    "remercier / être reconnaissant"
  ],
  [
    "ukuri",
    "vérité"
  ],
  [
    "ibinyoma",
    "mensonges"
  ],
  [
    "amashanyarazi",
    "électricité"
  ],
  [
    "amazi meza",
    "eau potable / eau propre"
  ],
  [
    "imvura",
    "pluie"
  ],
  [
    "ikiyaga",
    "lac"
  ],
  [
    "uruzi",
    "rivière / fleuve"
  ],
  [
    "umusozi",
    "montagne / colline"
  ],
  [
    "ubutaka",
    "terre / sol"
  ],
  [
    "igiti",
    "arbre"
  ],
  [
    "umurima",
    "ferme / champ cultivé"
  ],
  [
    "gukoresha",
    "utiliser / employer"
  ],
  [
    "gutunganya",
    "organiser / arranger"
  ],
  [
    "kuronka",
    "obtenir / trouver / recevoir"
  ],
  [
    "kwiyongera",
    "augmenter / s'accroître"
  ],
  [
    "kugabanuka",
    "diminuer / décliner"
  ],
  [
    "gutakaza",
    "perdre / gaspiller"
  ],
  [
    "kwinjira",
    "entrer"
  ],
  [
    "gusohoka",
    "sortir"
  ],
  [
    "kuruha",
    "se fatiguer / être épuisé"
  ],
  [
    "kupumuka",
    "se reposer"
  ],
  [
    "gukiza",
    "guérir / sauver"
  ],
  [
    "kubaza",
    "demander / interroger"
  ],
  [
    "kwemera",
    "accepter / reconnaître / admettre"
  ],
  [
    "kwanga",
    "refuser / ne pas aimer"
  ],
  [
    "gushiraho",
    "établir / mettre en place"
  ],
  [
    "izina",
    "nom / prénom"
  ],
  [
    "ubushobozi",
    "capacité / compétence / aptitude"
  ],
  [
    "ubutwari",
    "courage / bravoure"
  ],
  [
    "ubumwe",
    "unité / cohésion"
  ],
  [
    "ubutabera",
    "justice"
  ],
  [
    "ukwemera",
    "foi / croyance"
  ],
  [
    "urukundo",
    "amour"
  ],
  [
    "amizero",
    "espoir / optimisme"
  ],
  [
    "agaciro",
    "valeur / dignité"
  ],
  [
    "uburinganire",
    "égalité"
  ],
  [
    "ubumuntu",
    "humanité / humanisme"
  ],
  [
    "inka",
    "vache"
  ],
  [
    "ihene",
    "chèvre"
  ],
  [
    "ingurube",
    "porc / cochon"
  ],
  [
    "inkoko",
    "poulet / poule"
  ],
  [
    "imbwa",
    "chien"
  ],
  [
    "ifu",
    "farine"
  ],
  [
    "umusatsi",
    "cheveux / poils"
  ],
  [
    "imyenda",
    "vêtements / habits"
  ],
  [
    "inkweto",
    "chaussures"
  ],
  [
    "ingofero",
    "chapeau / coiffure"
  ],
  [
    "umurimyi",
    "agriculteur / cultivateur"
  ],
  [
    "intwali",
    "héros / personne courageuse"
  ],
  [
    "urugamba",
    "lutte / combat / voyage"
  ],
  [
    "amakuru",
    "nouvelles / informations"
  ],
  [
    "umushyikirano",
    "dialogue / consultation / concertation"
  ],
  [
    "ubwoko",
    "type / genre / ethnie"
  ],
  [
    "isoko",
    "marché / source"
  ],
  [
    "imyaka",
    "récoltes / âge / années"
  ],
  [
    "ubworozi",
    "élevage d'animaux"
  ],
  [
    "imbuga nkoranyambaga",
    "réseaux sociaux"
  ],
  [
    "inyandiko",
    "document / texte / écrit"
  ],
  [
    "serivisi",
    "service"
  ],
  [
    "sosiyete",
    "entreprise / société"
  ],
  [
    "igikorwa",
    "activité / action"
  ],
  [
    "umubano",
    "relation / voisinage"
  ],
  [
    "amajyambere",
    "avancement / développement"
  ],
  [
    "ishoramari",
    "investissement"
  ],
  [
    "imari",
    "finances"
  ],
  [
    "ubucuruzi",
    "commerce / négoce"
  ],
  [
    "iminsi",
    "jours (pluriel)"
  ],
  [
    "impapuro",
    "papier / documents"
  ],
  [
    "inzego",
    "niveaux / structures / échelons"
  ],
  [
    "intara",
    "province / région"
  ],
  [
    "umugabane",
    "entité / zone de district"
  ],
  [
    "umugi",
    "agglomération / centre urbain"
  ],
  [
    "isi",
    "terre / monde"
  ],
  [
    "uko bimeze",
    "tel quel / la situation actuelle"
  ],
  [
    "ubuzima bwiza",
    "bonne santé"
  ],
  [
    "amatangazo",
    "annonces / publicités"
  ],
  [
    "imbugabugwa",
    "logiciel / application"
  ],
  [
    "umukuru",
    "chef / responsable / aîné"
  ],
  [
    "ubuhamya",
    "témoignage / preuve"
  ],
  [
    "gutsinda",
    "vaincre / gagner"
  ],
  [
    "guhangana",
    "faire face / affronter"
  ],
  [
    "guhinduka",
    "changer / se transformer"
  ],
  [
    "guhindura",
    "modifier / traduire"
  ],
  [
    "kwishyura",
    "payer"
  ],
  [
    "gukanguka",
    "s'éveiller / être attentif"
  ],
  [
    "kwiringira",
    "se fier à / compter sur"
  ],
  [
    "gusengera",
    "prier pour"
  ],
  [
    "kudindira",
    "attendre"
  ],
  [
    "gutegereza",
    "attendre patiemment / s'attendre à"
  ],
  [
    "gushaka",
    "vouloir / chercher / se marier"
  ],
  [
    "kwamamaza",
    "publiciser / populariser"
  ],
  [
    "ibihugu",
    "pays (pluriel)"
  ],
  [
    "isi yose",
    "le monde entier"
  ],
  [
    "amoko",
    "ethnies / types"
  ],
  [
    "indangagaciro",
    "valeurs / principes"
  ],
  [
    "ubugiraneza",
    "générosité"
  ],
  [
    "inyangamugayo",
    "intégrité / honnêteté"
  ],
  [
    "kubyara",
    "accoucher / enfanter"
  ],
  [
    "umurwayi",
    "patient(e) / malade"
  ],
  [
    "umuganga",
    "médecin / docteur"
  ],
  [
    "umuforomo",
    "infirmier / infirmière"
  ],
  [
    "amafuti",
    "carburant / huile / graisse"
  ],
  [
    "umurambi",
    "colline / crête"
  ],
  [
    "icupa",
    "bouteille"
  ],
  [
    "agaseke",
    "petit panier"
  ],
  [
    "umutego",
    "piège / cible / prix"
  ],
  [
    "gucuruza",
    "commercer / vendre"
  ],
  [
    "gutera imbere",
    "progresser / avancer"
  ],
  [
    "kwita",
    "appeler / nommer"
  ],
  [
    "kwitwa",
    "s'appeler"
  ],
  [
    "indangamuntu",
    "carte d'identité"
  ],
  [
    "ivugurura",
    "réforme / renouveau"
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

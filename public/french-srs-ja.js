/* french-srs-ja.js — Français for Japanese speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 113 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'fr-ja';
  const WORDS = [
    /* --- Greetings / 挨拶 --- */
    ["bonjour", "こんにちは / おはようございます"],
    ["bonsoir", "こんばんは"],
    ["bonne nuit", "おやすみなさい"],
    ["salut", "やあ（くだけた挨拶）"],
    ["comment allez-vous ?", "お元気ですか？（丁寧）"],
    ["ça va ?", "元気？／調子はどう？"],
    ["ça va bien", "元気です／大丈夫です"],
    ["merci", "ありがとう"],
    ["merci beaucoup", "どうもありがとうございます"],
    ["de rien", "どういたしまして"],
    ["s'il vous plaît", "お願いします"],
    ["pardon / excusez-moi", "すみません／失礼します"],
    ["oui", "はい"],
    ["non", "いいえ"],
    ["au revoir", "さようなら"],
    ["à bientôt", "またすぐに"],
    ["je m'appelle…", "私の名前は〜です"],
    ["comment vous appelez-vous ?", "お名前は何とおっしゃいますか？"],
    /* --- Pronouns / 代名詞 --- */
    ["je", "私（は）"],
    ["tu", "君（は）（くだけた二人称）"],
    ["il / elle", "彼 / 彼女（は）"],
    ["nous", "私たち（は）"],
    ["vous", "あなた（は）／あなた方（は）"],
    ["ils / elles", "彼ら / 彼女たち（は）"],
    ["on", "人々（口語では「私たち」）"],
    /* --- People & Family / 人・家族 --- */
    ["l'homme", "男性／男の人"],
    ["la femme", "女性／女の人"],
    ["l'enfant", "子ども"],
    ["l'ami / l'amie", "友人"],
    ["la mère", "お母さん"],
    ["le père", "お父さん"],
    ["le fils", "息子"],
    ["la fille", "娘／女の子"],
    ["le frère", "兄弟"],
    ["la sœur", "姉妹"],
    ["la famille", "家族"],
    /* --- Places / 場所 --- */
    ["la maison", "家"],
    ["la ville", "都市"],
    ["la rue", "通り／道"],
    ["le pays", "国"],
    ["le monde", "世界"],
    ["la gare", "駅"],
    ["l'école", "学校"],
    ["le restaurant", "レストラン"],
    /* --- Food & Drink / 食べ物・飲み物 --- */
    ["l'eau (f)", "水"],
    ["le pain", "パン"],
    ["le vin", "ワイン"],
    ["le fromage", "チーズ"],
    ["la viande", "肉"],
    ["le poisson", "魚"],
    ["le café", "コーヒー"],
    ["le lait", "牛乳"],
    ["le sucre", "砂糖"],
    ["le sel", "塩"],
    ["la pomme", "りんご"],
    ["le riz", "ごはん／米"],
    ["la soupe", "スープ"],
    ["le gâteau", "ケーキ"],
    /* --- Numbers / 数字 --- */
    ["un / une", "ひとつ／1"],
    ["deux", "ふたつ／2"],
    ["trois", "みっつ／3"],
    ["quatre", "よっつ／4"],
    ["cinq", "いつつ／5"],
    ["six", "むっつ／6"],
    ["sept", "ななつ／7"],
    ["huit", "やっつ／8"],
    ["neuf", "ここのつ／9"],
    ["dix", "とお／10"],
    ["vingt", "20（ヴァン）"],
    ["cent", "100（サン）"],
    /* --- Core Verbs / 基本動詞 --- */
    ["être", "〜である（be動詞、だ・です・いる・ある）"],
    ["avoir", "持つ／ある（have）"],
    ["aller", "行く"],
    ["venir", "来る"],
    ["faire", "する／作る"],
    ["dire", "言う"],
    ["voir", "見る"],
    ["savoir", "知っている"],
    ["pouvoir", "できる"],
    ["vouloir", "〜したい／欲しい"],
    ["devoir", "〜しなければならない"],
    ["parler", "話す"],
    ["manger", "食べる"],
    ["boire", "飲む"],
    ["dormir", "眠る"],
    ["lire", "読む"],
    ["écrire", "書く"],
    ["travailler", "働く"],
    ["vivre", "生きる／住む"],
    ["comprendre", "理解する"],
    ["prendre", "取る／乗る"],
    ["aimer", "好きだ／愛する"],
    /* --- Adjectives / 形容詞 --- */
    ["bon / bonne", "良い"],
    ["mauvais/e", "悪い"],
    ["grand/e", "大きい"],
    ["petit/e", "小さい"],
    ["nouveau / nouvelle", "新しい"],
    ["vieux / vieille", "古い"],
    ["beau / belle", "美しい"],
    ["chaud/e", "温かい／暑い"],
    ["froid/e", "冷たい／寒い"],
    ["rapide", "速い"],
    ["facile", "簡単な"],
    ["difficile", "難しい"],
    /* --- Question Words / 疑問詞 --- */
    ["quoi ?", "何？"],
    ["qui ?", "誰？"],
    ["où ?", "どこ？"],
    ["quand ?", "いつ？"],
    ["comment ?", "どうやって？／どんな様子？"],
    ["combien ?", "いくら？／いくつ？"],
    ["pourquoi ?", "なぜ？"],
    /* --- Connectors / 接続詞・前置詞 --- */
    ["et", "〜と／そして"],
    ["mais", "しかし"],
    ["parce que", "なぜなら〜だから"],
    ["avec", "〜と一緒に"],
    ["sans", "〜なしで"],
    ["dans", "〜の中に"],
    ["sur", "〜の上に"],
    ["pour", "〜のために"],
    /* --- Time / 時間表現 --- */
    ["aujourd'hui", "今日"],
    ["demain", "明日"],
    ["hier", "昨日"],
    ["maintenant", "今"],
    ["toujours", "いつも"],
    ["jamais", "決して〜ない"],
    /* --- Colors / 色 --- */
    ["rouge", "赤い"],
    ["bleu/e", "青い"],
    ["vert/e", "緑の"],
    ["blanc / blanche", "白い"],
    ["noir/e", "黒い"],
    ["jaune", "黄色い"],
    ["rose", "ピンクの"]
  ];

  /* ---- escape + render the frequency table from WORDS (single source) ---- */
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  (function renderFreqTable(){
    const tbody = document.querySelector('.vocab-freq-table tbody');
    if (!tbody) return;
    tbody.innerHTML = WORDS.map(function(w,i){
      return '<tr><td>'+(i+1)+'</td><td>'+esc(w[0])+'</td><td>'+esc(w[1])+'</td></tr>';
    }).join('');
  })();

  /* ---- SM-2 spaced repetition engine ---- */
  function loadState(){try{return JSON.parse(localStorage.getItem('srs_'+PAIR)||'{}');}catch(e){return {};}}
  function saveState(s){try{localStorage.setItem('srs_'+PAIR,JSON.stringify(s));}catch(e){}}
  function today(){return Math.floor(Date.now()/86400000);}
  function getDue(state){const t=today();return WORDS.filter(function(_,i){const c=state[i];return !c||c.nextDay<=t;});}
  function updateCard(state,idx,quality){
    const c=state[idx]||{ef:2.5,interval:1,reps:0};
    if(quality<3){c.reps=0;c.interval=1;}
    else{
      if(c.reps===0)c.interval=1;
      else if(c.reps===1)c.interval=6;
      else c.interval=Math.round(c.interval*c.ef);
      c.reps+=1;
      c.ef=Math.max(1.3,c.ef+0.1-(5-quality)*(0.08+(5-quality)*0.02));
    }
    c.nextDay=today()+c.interval;state[idx]=c;return state;
  }
  const elInfo=document.getElementById('srs-info'),elCard=document.getElementById('srs-card'),
        elFront=document.getElementById('srs-front'),elBack=document.getElementById('srs-back'),
        elControls=document.getElementById('srs-controls'),elFlip=document.getElementById('srs-flip'),
        elAgain=document.getElementById('srs-again'),elGood=document.getElementById('srs-good'),
        elDone=document.getElementById('srs-done'),elRestart=document.getElementById('srs-restart'),
        elBar=document.getElementById('srs-bar');
  if(!elInfo)return;
  let state=loadState(),queue=[],current=null;
  function buildQueue(){queue=getDue(state).map(function(w){return WORDS.indexOf(w);}).sort(function(){return Math.random()-0.5;});}
  function updateBar(){if(elBar)elBar.style.width=(WORDS.length?((WORDS.length-getDue(state).length)/WORDS.length)*100:100)+'%';}
  function showCard(){
    if(!queue.length){elCard.style.display=elFlip.style.display=elControls.style.display='none';elDone.style.display='block';elInfo.textContent='Session complete!';updateBar();return;}
    current=queue.shift();
    const pair=WORDS[current];
    elFront.textContent=pair[0];elBack.textContent=pair[1];
    elBack.style.display='none';elFront.style.display='block';
    elControls.style.display='none';elFlip.style.display='inline-block';
    elCard.style.display='block';elDone.style.display='none';
    elInfo.textContent=(queue.length+1)+' / '+getDue(loadState()).length+' cards due';
    updateBar();
  }
  function flip(){elBack.style.display=elFront.style.display='block';elFlip.style.display='none';elControls.style.display='flex';}
  elFlip.addEventListener('click',flip);
  elAgain.addEventListener('click',function(){state=updateCard(state,current,1);saveState(state);queue.push(current);current=null;showCard();});
  elGood.addEventListener('click',function(){state=updateCard(state,current,5);saveState(state);current=null;showCard();});
  if(elRestart)elRestart.addEventListener('click',function(){buildQueue();elDone.style.display='none';showCard();});
  document.addEventListener('keydown',function(e){
    if((e.key===' '||e.key==='Enter')&&elFlip.style.display!=='none'){e.preventDefault();flip();}
    if(e.key==='1'&&elControls.style.display!=='none'){state=updateCard(state,current,1);saveState(state);queue.push(current);current=null;showCard();}
    if(e.key==='3'&&elControls.style.display!=='none'){state=updateCard(state,current,5);saveState(state);current=null;showCard();}
  });
  buildQueue();showCard();
})();

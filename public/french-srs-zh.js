/* french-srs-zh.js — Français for Mandarin speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 132 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'fr-zh';
  const WORDS = [
    /* --- Greetings / 问候语 --- */
    ["bonjour", "你好 / 早上好（日间问候）"],
    ["bonsoir", "晚上好"],
    ["bonne nuit", "晚安"],
    ["salut", "嗨 / 你好（非正式）"],
    ["comment allez-vous ?", "您好吗？（正式）"],
    ["ça va ?", "还好吗？/ 怎么样？"],
    ["ça va bien", "很好 / 还不错"],
    ["merci", "谢谢"],
    ["merci beaucoup", "非常感谢"],
    ["de rien", "不客气"],
    ["s'il vous plaît", "请 / 麻烦了"],
    ["pardon / excusez-moi", "打扰一下 / 对不起"],
    ["oui", "是 / 对"],
    ["non", "不 / 不是"],
    ["au revoir", "再见"],
    ["à bientôt", "待会见 / 回头见"],
    ["je m'appelle…", "我叫……"],
    ["comment vous appelez-vous ?", "您叫什么名字？"],
    /* --- Pronouns / 代词 --- */
    ["je", "我（第一人称单数）"],
    ["tu", "你（非正式第二人称）"],
    ["il / elle", "他 / 她（第三人称）"],
    ["nous", "我们"],
    ["vous", "您 / 你们（正式或复数）"],
    ["ils / elles", "他们 / 她们（第三人称复数）"],
    ["on", "人们（口语中常代替「我们」）"],
    /* --- People & Family / 人物·家庭 --- */
    ["l'homme", "男人"],
    ["la femme", "女人 / 妻子"],
    ["l'enfant", "孩子"],
    ["l'ami / l'amie", "朋友"],
    ["la mère", "母亲"],
    ["le père", "父亲"],
    ["le fils", "儿子"],
    ["la fille", "女儿 / 女孩"],
    ["le frère", "兄弟"],
    ["la sœur", "姐妹"],
    ["la famille", "家庭 / 家人"],
    ["le mari", "丈夫"],
    /* --- Places / 地点 --- */
    ["la maison", "家 / 房子"],
    ["la ville", "城市"],
    ["la rue", "街道"],
    ["le pays", "国家"],
    ["le monde", "世界"],
    ["la gare", "火车站"],
    ["l'école", "学校"],
    ["le restaurant", "餐厅"],
    /* --- Food & Drink / 饮食 --- */
    ["l'eau (f)", "水"],
    ["le pain", "面包"],
    ["le vin", "葡萄酒"],
    ["le fromage", "奶酪"],
    ["la viande", "肉"],
    ["le poisson", "鱼"],
    ["le café", "咖啡"],
    ["le lait", "牛奶"],
    ["le sucre", "糖"],
    ["le sel", "盐"],
    ["la pomme", "苹果"],
    ["le riz", "米饭"],
    ["la soupe", "汤"],
    ["le gâteau", "蛋糕"],
    /* --- Numbers / 数字 --- */
    ["un / une", "一 / 1"],
    ["deux", "二 / 2"],
    ["trois", "三 / 3"],
    ["quatre", "四 / 4"],
    ["cinq", "五 / 5"],
    ["six", "六 / 6"],
    ["sept", "七 / 7"],
    ["huit", "八 / 8"],
    ["neuf", "九 / 9"],
    ["dix", "十 / 10"],
    ["vingt", "二十 / 20"],
    ["cent", "一百 / 100"],
    /* --- Core Verbs / 核心动词 --- */
    ["être", "是 / 在（be 动词）"],
    ["avoir", "有 / 拥有"],
    ["aller", "去"],
    ["venir", "来"],
    ["faire", "做 / 制作"],
    ["dire", "说"],
    ["voir", "看 / 看见"],
    ["savoir", "知道"],
    ["pouvoir", "能 / 可以"],
    ["vouloir", "想要"],
    ["devoir", "必须 / 应该"],
    ["parler", "说话 / 讲"],
    ["manger", "吃"],
    ["boire", "喝"],
    ["dormir", "睡觉"],
    ["lire", "读 / 阅读"],
    ["écrire", "写"],
    ["travailler", "工作"],
    ["vivre", "生活 / 住"],
    ["comprendre", "理解 / 明白"],
    ["prendre", "拿 / 乘坐"],
    ["aimer", "喜欢 / 爱"],
    /* --- Adjectives / 形容词 --- */
    ["bon / bonne", "好的"],
    ["mauvais/e", "坏的"],
    ["grand/e", "大的"],
    ["petit/e", "小的"],
    ["nouveau / nouvelle", "新的"],
    ["vieux / vieille", "旧的 / 年老的"],
    ["beau / belle", "美丽的 / 帅的"],
    ["chaud/e", "热的 / 暖和的"],
    ["froid/e", "冷的"],
    ["rapide", "快的"],
    ["facile", "容易的"],
    ["difficile", "困难的"],
    /* --- Question Words / 疑问词 --- */
    ["quoi ?", "什么？"],
    ["qui ?", "谁？"],
    ["où ?", "在哪里？"],
    ["quand ?", "什么时候？"],
    ["comment ?", "怎么？/ 如何？"],
    ["combien ?", "多少？"],
    ["pourquoi ?", "为什么？"],
    /* --- Connectors / 连接词·介词 --- */
    ["et", "和 / 并且"],
    ["mais", "但是"],
    ["parce que", "因为"],
    ["avec", "和……一起 / 用"],
    ["sans", "没有 / 不带"],
    ["dans", "在……里面"],
    ["sur", "在……上面"],
    ["pour", "为了 / 对于"],
    /* --- Time / 时间表达 --- */
    ["aujourd'hui", "今天"],
    ["demain", "明天"],
    ["hier", "昨天"],
    ["maintenant", "现在"],
    ["toujours", "总是 / 还是"],
    ["jamais", "从不"],
    /* --- Colors / 颜色 --- */
    ["rouge", "红色的"],
    ["bleu/e", "蓝色的"],
    ["vert/e", "绿色的"],
    ["blanc / blanche", "白色的"],
    ["noir/e", "黑色的"],
    ["jaune", "黄色的"]
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

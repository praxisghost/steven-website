(function () {
  'use strict';

  /* ── DECK — Mandarin ↔ Cantonese (Traditional Characters, no romanization) ─
     Front (tr): Mandarin — Traditional / Simplified if they differ, or just Traditional
     Back  (en): Cantonese Traditional Characters equivalent
     pos: part of speech in Traditional Chinese
  ─────────────────────────────────────────────────────────────────────────── */
  var DECK = [
    // 代詞 Pronouns (0–7)
    { id:  0, tr: '我們 / 我们',        en: '我哋',                           pos: '代詞' },
    { id:  1, tr: '你們 / 你们',        en: '你哋',                           pos: '代詞' },
    { id:  2, tr: '他 / 他',            en: '佢',                             pos: '代詞' },
    { id:  3, tr: '她 / 她',            en: '佢',                             pos: '代詞' },
    { id:  4, tr: '他們 / 他们',        en: '佢哋',                           pos: '代詞' },
    { id:  5, tr: '這個 / 这个',        en: '呢個',                           pos: '指示詞' },
    { id:  6, tr: '那個 / 那个',        en: '嗰個',                           pos: '指示詞' },
    { id:  7, tr: '這裡 / 这里',        en: '呢度',                           pos: '指示詞' },

    // 疑問詞 Question words (8–15)
    { id:  8, tr: '什麼 / 什么',        en: '乜嘢',                           pos: '疑問詞' },
    { id:  9, tr: '誰 / 谁',            en: '邊個',                           pos: '疑問詞' },
    { id: 10, tr: '哪裡 / 哪里',        en: '邊度',                           pos: '疑問詞' },
    { id: 11, tr: '怎麼 / 怎么',        en: '點樣',                           pos: '疑問詞' },
    { id: 12, tr: '為什麼 / 为什么',    en: '點解',                           pos: '疑問詞' },
    { id: 13, tr: '什麼時候 / 什么时候', en: '幾時',                          pos: '疑問詞' },
    { id: 14, tr: '多少 / 多少',        en: '幾多',                           pos: '疑問詞' },
    { id: 15, tr: '哪個 / 哪个',        en: '邊個',                           pos: '疑問詞' },

    // 語法助詞 Grammar particles (16–23)
    { id: 16, tr: '的 / 的',            en: '嘅',                             pos: '助詞' },
    { id: 17, tr: '了 / 了',            en: '喇',                             pos: '助詞' },
    { id: 18, tr: '嗎 / 吗',            en: '咩',                             pos: '助詞' },
    { id: 19, tr: '著 / 着',            en: '住',                             pos: '助詞' },
    { id: 20, tr: '不 / 不',            en: '唔',                             pos: '否定詞' },
    { id: 21, tr: '沒有 / 没有',        en: '冇',                             pos: '否定詞' },
    { id: 22, tr: '是 / 是',            en: '係',                             pos: '動詞' },
    { id: 23, tr: '在 / 在',            en: '喺',                             pos: '介詞' },

    // 時間詞 Time words (24–31)
    { id: 24, tr: '現在 / 现在',        en: '而家',                           pos: '時間詞' },
    { id: 25, tr: '今天 / 今天',        en: '今日',                           pos: '時間詞' },
    { id: 26, tr: '明天 / 明天',        en: '聽日',                           pos: '時間詞' },
    { id: 27, tr: '昨天 / 昨天',        en: '琴日',                           pos: '時間詞' },
    { id: 28, tr: '剛才 / 刚才',        en: '啱啱',                           pos: '時間詞' },
    { id: 29, tr: '之後 / 之后',        en: '之後',                           pos: '時間詞' },
    { id: 30, tr: '以前 / 以前',        en: '以前',                           pos: '時間詞' },
    { id: 31, tr: '每天 / 每天',        en: '每日',                           pos: '時間詞' },

    // 動詞 Verbs (32–59)
    { id: 32, tr: '吃 / 吃',            en: '食',                             pos: '動詞' },
    { id: 33, tr: '喝 / 喝',            en: '飲',                             pos: '動詞' },
    { id: 34, tr: '看 / 看',            en: '睇',                             pos: '動詞' },
    { id: 35, tr: '說 / 说',            en: '講',                             pos: '動詞' },
    { id: 36, tr: '走 / 走',            en: '行',                             pos: '動詞' },
    { id: 37, tr: '跑 / 跑',            en: '走',                             pos: '動詞' },
    { id: 38, tr: '找 / 找',            en: '搵',                             pos: '動詞' },
    { id: 39, tr: '喜歡 / 喜欢',        en: '鍾意',                           pos: '動詞' },
    { id: 40, tr: '知道 / 知道',        en: '知',                             pos: '動詞' },
    { id: 41, tr: '認識 / 认识',        en: '識',                             pos: '動詞' },
    { id: 42, tr: '來 / 来',            en: '嚟',                             pos: '動詞' },
    { id: 43, tr: '給 / 给',            en: '俾',                             pos: '動詞' },
    { id: 44, tr: '買 / 买',            en: '買',                             pos: '動詞' },
    { id: 45, tr: '告訴 / 告诉',        en: '話俾知',                         pos: '動詞' },
    { id: 46, tr: '幫 / 帮',            en: '幫',                             pos: '動詞' },
    { id: 47, tr: '等 / 等',            en: '等',                             pos: '動詞' },
    { id: 48, tr: '聽 / 听',            en: '聽',                             pos: '動詞' },
    { id: 49, tr: '寫 / 写',            en: '寫',                             pos: '動詞' },
    { id: 50, tr: '用 / 用',            en: '用',                             pos: '動詞' },
    { id: 51, tr: '想 / 想',            en: '想',                             pos: '動詞' },
    { id: 52, tr: '做 / 做',            en: '做',                             pos: '動詞' },
    { id: 53, tr: '去 / 去',            en: '去',                             pos: '動詞' },
    { id: 54, tr: '需要 / 需要',        en: '需要',                           pos: '動詞' },
    { id: 55, tr: '覺得 / 觉得',        en: '覺得',                           pos: '動詞' },
    { id: 56, tr: '可以 / 可以',        en: '得',                             pos: '動詞' },
    { id: 57, tr: '應該 / 应该',        en: '應該',                           pos: '動詞' },
    { id: 58, tr: '開始 / 开始',        en: '開始',                           pos: '動詞' },
    { id: 59, tr: '完成 / 完成',        en: '搞掂',                           pos: '動詞' },

    // 形容詞與副詞 Adjectives & adverbs (60–74)
    { id: 60, tr: '漂亮 / 漂亮',        en: '靚',                             pos: '形容詞' },
    { id: 61, tr: '累 / 累',            en: '攰',                             pos: '形容詞' },
    { id: 62, tr: '很 / 很',            en: '好',                             pos: '副詞' },
    { id: 63, tr: '一點 / 一点',        en: '少少',                           pos: '副詞' },
    { id: 64, tr: '一起 / 一起',        en: '一齊',                           pos: '副詞' },
    { id: 65, tr: '還是 / 还是',        en: '定係',                           pos: '連接詞' },
    { id: 66, tr: '但是 / 但是',        en: '但係',                           pos: '連接詞' },
    { id: 67, tr: '好吃 / 好吃',        en: '好食',                           pos: '形容詞' },
    { id: 68, tr: '好玩 / 好玩',        en: '好玩',                           pos: '形容詞' },
    { id: 69, tr: '開心 / 开心',        en: '開心',                           pos: '形容詞' },
    { id: 70, tr: '厲害 / 厉害',        en: '叻',                             pos: '形容詞' },
    { id: 71, tr: '麻煩 / 麻烦',        en: '麻煩',                           pos: '形容詞' },
    { id: 72, tr: '難 / 难',            en: '難',                             pos: '形容詞' },
    { id: 73, tr: '容易 / 容易',        en: '易',                             pos: '形容詞' },
    { id: 74, tr: '快 / 快',            en: '快',                             pos: '形容詞' },

    // 名詞 Nouns (75–89)
    { id: 75, tr: '東西 / 东西',        en: '嘢',                             pos: '名詞' },
    { id: 76, tr: '衣服 / 衣服',        en: '衫',                             pos: '名詞' },
    { id: 77, tr: '房子 / 房子',        en: '屋',                             pos: '名詞' },
    { id: 78, tr: '錢 / 钱',            en: '銀',                             pos: '名詞' },
    { id: 79, tr: '食物 / 食物',        en: '嘢食',                           pos: '名詞' },
    { id: 80, tr: '孩子 / 孩子',        en: '細路',                           pos: '名詞' },
    { id: 81, tr: '哥哥 / 哥哥',        en: '大佬',                           pos: '名詞' },
    { id: 82, tr: '姐姐 / 姐姐',        en: '家姐',                           pos: '名詞' },
    { id: 83, tr: '弟弟 / 弟弟',        en: '細佬',                           pos: '名詞' },
    { id: 84, tr: '妹妹 / 妹妹',        en: '細妹',                           pos: '名詞' },
    { id: 85, tr: '工作 / 工作',        en: '返工',                           pos: '名詞' },
    { id: 86, tr: '時間 / 时间',        en: '時間',                           pos: '名詞' },
    { id: 87, tr: '地方 / 地方',        en: '地方',                           pos: '名詞' },
    { id: 88, tr: '朋友 / 朋友',        en: '朋友',                           pos: '名詞' },
    { id: 89, tr: '問題 / 问题',        en: '問題',                           pos: '名詞' },

    // 常用表達 Common expressions (90–99)
    { id: 90, tr: '謝謝 / 谢谢',        en: '唔該 / 多謝',                    pos: '表達' },
    { id: 91, tr: '對不起 / 对不起',    en: '對唔住',                         pos: '表達' },
    { id: 92, tr: '沒關係 / 没关系',    en: '冇事',                           pos: '表達' },
    { id: 93, tr: '不好意思 / 不好意思', en: '唔好意思',                       pos: '表達' },
    { id: 94, tr: '好的 / 好的',        en: '好',                             pos: '表達' },
    { id: 95, tr: '再見 / 再见',        en: '再見',                           pos: '表達' },
    { id: 96, tr: '早上好 / 早上好',    en: '早晨',                           pos: '表達' },
    { id: 97, tr: '你好 / 你好',        en: '你好',                           pos: '表達' },
    { id: 98, tr: '不客氣 / 不客气',    en: '唔客氣',                         pos: '表達' },
    { id: 99, tr: '當然 / 当然',        en: '梗係',                           pos: '表達' }
  ];

  var STORAGE_KEY         = 'srs-mandarin-yue-v1';
  var MAX_NEW_PER_SESSION = 20;
  var root, states, queue, queueIdx, sessionDone, sessionTotal, revealed;

  function loadStates(){try{var r=localStorage.getItem(STORAGE_KEY);return r?JSON.parse(r):{};}catch(e){return{};}}
  function saveStates(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(states));}catch(e){}}
  function getState(id){if(!states[id])states[id]={interval:0,ef:2.5,reps:0,due:0};return states[id];}
  function today(){return Math.floor(Date.now()/86400000);}
  function schedule(state,good){
    if(!good){state.reps=0;state.interval=1;state.ef=Math.max(1.3,state.ef-0.2);}
    else{if(state.reps===0)state.interval=1;else if(state.reps===1)state.interval=6;else state.interval=Math.round(state.interval*state.ef);state.ef=Math.min(2.5,state.ef+0.1);state.reps++;}
    state.due=today()+state.interval;
  }
  function previewIntervals(s){var g=s.reps===0?1:s.reps===1?6:Math.round(s.interval*s.ef);return{again:1,good:g};}
  function fmtDays(d){if(d<1)return'<1d';if(d<30)return d+'d';if(d<365)return Math.round(d/30)+'mo';return Math.round(d/365)+'y';}
  function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
  function buildQueue(){var t=today(),due=[],nc=[];DECK.forEach(function(c){var s=getState(c.id);if(s.reps>0&&s.due<=t)due.push(c);else if(s.reps===0)nc.push(c);});shuffle(due);shuffle(nc);return due.concat(nc.slice(0,MAX_NEW_PER_SESSION));}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function seenCount(){return DECK.filter(function(c){return getState(c.id).reps>0;}).length;}

  function renderMeta(){var el=document.getElementById('srs-meta');if(!el)return;var rem=queue.length-queueIdx,pct=sessionTotal>0?Math.round(sessionDone/sessionTotal*100):0;el.innerHTML='<span class="srs-count">已完成&nbsp;<b>'+sessionDone+'</b>&ensp;&middot;&ensp;剩餘&nbsp;<b>'+rem+'</b></span><div class="srs-bar-wrap"><div class="srs-bar" style="width:'+pct+'%"></div></div>';}
  function renderFront(card){var ce=document.getElementById('srs-card'),ae=document.getElementById('srs-actions');if(!ce||!ae)return;revealed=false;ce.className='srs-card';ce.innerHTML='<span class="srs-turkish">'+esc(card.tr)+'</span><span class="srs-pos">'+esc(card.pos)+'</span><span class="srs-hint">點擊顯示粵語對應</span>';ae.innerHTML='';renderMeta();}
  function renderBack(card){var ce=document.getElementById('srs-card'),ae=document.getElementById('srs-actions');if(!ce||!ae)return;revealed=true;var state=getState(card.id),preview=previewIntervals(state);ce.className='srs-card revealed';ce.innerHTML='<span class="srs-turkish">'+esc(card.tr)+'</span><span class="srs-pos">'+esc(card.pos)+'</span><div class="srs-divider"></div><span class="srs-english">'+esc(card.en)+'</span>';ae.innerHTML='<button class="srs-btn srs-btn-again" id="btn-again"><span class="srs-key">1</span>&nbsp;再試&nbsp;<span class="srs-interval">'+fmtDays(preview.again)+'</span></button><button class="srs-btn srs-btn-good" id="btn-good"><span class="srs-key">3</span>&nbsp;記住了&nbsp;<span class="srs-interval">'+fmtDays(preview.good)+'</span></button>';document.getElementById('btn-again').addEventListener('click',handleAgain);document.getElementById('btn-good').addEventListener('click',handleGood);}
  function renderDone(){root.innerHTML='<div class="srs-done"><div class="srs-done-title">本次練習完成</div><div class="srs-done-sub">今日嘅卡片全部複習完畢。</div><div class="srs-done-stats">本次複習咗&nbsp;'+sessionDone+'&nbsp;張卡片<br>已學習&nbsp;'+seenCount()+'&nbsp;／&nbsp;'+DECK.length+'&nbsp;個詞條</div><button class="srs-action-btn" id="btn-restart">再練習一次</button></div>';document.getElementById('btn-restart').addEventListener('click',function(){var t=today();queue.forEach(function(c){getState(c.id).due=t;});init();});}
  function renderNothingDue(){root.innerHTML='<div class="srs-done"><div class="srs-done-title">今日冇到期嘅卡片</div><div class="srs-done-sub">所有卡片都已排程到未來複習。</div><div class="srs-done-stats">已學習&nbsp;'+seenCount()+'&nbsp;／&nbsp;'+DECK.length+'&nbsp;個詞條</div><button class="srs-action-btn" id="btn-new">繼續學習新詞條</button></div>';document.getElementById('btn-new').addEventListener('click',function(){var nc=DECK.filter(function(c){return getState(c.id).reps===0;}).slice(0,MAX_NEW_PER_SESSION);if(!nc.length){root.innerHTML='<div class="srs-done"><div class="srs-done-title">全部完成！</div><div class="srs-done-sub">你已學習晒全部&nbsp;'+DECK.length+'&nbsp;個詞條，聽日再嚟複習。</div></div>';return;}queue=shuffle(nc);queueIdx=0;sessionDone=0;sessionTotal=queue.length;buildRootHTML();renderFront(queue[0]);});}
  function buildRootHTML(){root.innerHTML='<div class="srs-meta" id="srs-meta"></div><div class="srs-card" id="srs-card"></div><div class="srs-actions" id="srs-actions"></div>';document.getElementById('srs-card').addEventListener('click',function(){if(!revealed&&queue[queueIdx])renderBack(queue[queueIdx]);});}
  function handleAgain(){if(!revealed)return;var c=queue[queueIdx];schedule(getState(c.id),false);saveStates();queue.push(c);sessionTotal++;advance();}
  function handleGood(){if(!revealed)return;var c=queue[queueIdx];schedule(getState(c.id),true);saveStates();sessionDone++;advance();}
  function advance(){queueIdx++;if(queueIdx>=queue.length)renderDone();else renderFront(queue[queueIdx]);}
  function onKey(e){var tag=document.activeElement?document.activeElement.tagName:'';if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;if(e.key===' '||e.key==='Enter'){e.preventDefault();if(!revealed&&queue&&queue[queueIdx])renderBack(queue[queueIdx]);}else if(e.key==='1'){if(revealed)handleAgain();}else if(e.key==='3'){if(revealed)handleGood();}}
  function init(){states=loadStates();queue=buildQueue();queueIdx=0;sessionDone=0;sessionTotal=queue.length;revealed=false;if(!queue.length){renderNothingDue();return;}buildRootHTML();renderFront(queue[0]);}
  function setup(){root=document.getElementById('srs-root');if(!root)return;document.addEventListener('keydown',onKey);init();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
}());

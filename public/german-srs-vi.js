(function () {
  'use strict';

  /* ── DECK — 100 core German words (German ↔ Vietnamese) ──────────────── */
  var DECK = [
    // Liên từ & giới từ Conjunctions & prepositions (0–9)
    { id:  0, tr: 'ein / eine',       en: 'một (mạo từ bất định)',           pos: 'mạo từ' },
    { id:  1, tr: 'der / die / das',  en: 'mạo từ xác định (đực/cái/trung)', pos: 'mạo từ' },
    { id:  2, tr: 'und',              en: 'và',                              pos: 'liên từ' },
    { id:  3, tr: 'aber',             en: 'nhưng',                           pos: 'liên từ' },
    { id:  4, tr: 'weil',             en: 'vì, bởi vì',                      pos: 'liên từ' },
    { id:  5, tr: 'wenn',             en: 'nếu, khi',                        pos: 'liên từ' },
    { id:  6, tr: 'oder',             en: 'hoặc, hay',                       pos: 'liên từ' },
    { id:  7, tr: 'dass',             en: 'rằng (trong mệnh đề phụ)',        pos: 'liên từ' },
    { id:  8, tr: 'mit',              en: 'với, cùng (giới từ)',              pos: 'giới từ' },
    { id:  9, tr: 'für',              en: 'cho, để (giới từ)',                pos: 'giới từ' },

    // Đại từ & từ hỏi Pronouns & question words (10–24)
    { id: 10, tr: 'ich',              en: 'tôi, mình',                       pos: 'đại từ' },
    { id: 11, tr: 'du',               en: 'bạn, mày (thân mật)',             pos: 'đại từ' },
    { id: 12, tr: 'er',               en: 'anh ấy, ông ấy',                  pos: 'đại từ' },
    { id: 13, tr: 'sie (cô ấy)',       en: 'cô ấy, bà ấy',                   pos: 'đại từ' },
    { id: 14, tr: 'es',               en: 'nó, cái đó',                      pos: 'đại từ' },
    { id: 15, tr: 'wir',              en: 'chúng tôi, chúng ta',             pos: 'đại từ' },
    { id: 16, tr: 'ihr',              en: 'các bạn (số nhiều thân mật)',      pos: 'đại từ' },
    { id: 17, tr: 'sie (họ)',          en: 'họ',                              pos: 'đại từ' },
    { id: 18, tr: 'Sie',              en: 'bạn / ông / bà (kính ngữ)',       pos: 'đại từ' },
    { id: 19, tr: 'dieser / diese',   en: 'cái này, người này',              pos: 'đại từ / tính từ' },
    { id: 20, tr: 'was',              en: 'gì, cái gì',                      pos: 'từ hỏi' },
    { id: 21, tr: 'wer',              en: 'ai',                              pos: 'từ hỏi' },
    { id: 22, tr: 'wo',               en: 'ở đâu',                           pos: 'từ hỏi' },
    { id: 23, tr: 'wie',              en: 'như thế nào, bao nhiêu',           pos: 'từ hỏi' },
    { id: 24, tr: 'warum',            en: 'tại sao, vì sao',                 pos: 'từ hỏi' },

    // Trạng từ Adverbs (25–39)
    { id: 25, tr: 'sehr',             en: 'rất',                             pos: 'trạng từ' },
    { id: 26, tr: 'mehr',             en: 'hơn, nhiều hơn',                  pos: 'trạng từ' },
    { id: 27, tr: 'auch',             en: 'cũng',                            pos: 'trạng từ' },
    { id: 28, tr: 'schon',            en: 'rồi, đã rồi',                     pos: 'trạng từ' },
    { id: 29, tr: 'immer',            en: 'luôn luôn',                       pos: 'trạng từ' },
    { id: 30, tr: 'nie',              en: 'không bao giờ',                   pos: 'trạng từ' },
    { id: 31, tr: 'jetzt',            en: 'bây giờ',                         pos: 'trạng từ' },
    { id: 32, tr: 'dann',             en: 'sau đó, rồi',                     pos: 'trạng từ' },
    { id: 33, tr: 'noch',             en: 'còn, vẫn',                        pos: 'trạng từ' },
    { id: 34, tr: 'hier',             en: 'ở đây, đây',                      pos: 'trạng từ' },
    { id: 35, tr: 'dort',             en: 'ở đó, đó',                        pos: 'trạng từ' },
    { id: 36, tr: 'nur',              en: 'chỉ, chỉ có',                     pos: 'trạng từ' },
    { id: 37, tr: 'vielleicht',       en: 'có lẽ, có thể',                   pos: 'trạng từ' },
    { id: 38, tr: 'fast',             en: 'gần như, hầu như',                pos: 'trạng từ' },
    { id: 39, tr: 'zusammen',         en: 'cùng nhau',                       pos: 'trạng từ' },

    // Tính từ Adjectives (40–54)
    { id: 40, tr: 'gut',              en: 'tốt, hay',                        pos: 'tính từ' },
    { id: 41, tr: 'schlecht',         en: 'xấu, tệ',                         pos: 'tính từ' },
    { id: 42, tr: 'groß',             en: 'to, lớn',                         pos: 'tính từ' },
    { id: 43, tr: 'klein',            en: 'nhỏ, bé',                         pos: 'tính từ' },
    { id: 44, tr: 'neu',              en: 'mới',                             pos: 'tính từ' },
    { id: 45, tr: 'alt',              en: 'cũ, già',                         pos: 'tính từ' },
    { id: 46, tr: 'erste',            en: 'đầu tiên, thứ nhất',              pos: 'tính từ' },
    { id: 47, tr: 'letzte',           en: 'cuối, cuối cùng',                 pos: 'tính từ' },
    { id: 48, tr: 'viel',             en: 'nhiều',                           pos: 'tính từ' },
    { id: 49, tr: 'wenig',            en: 'ít',                              pos: 'tính từ' },
    { id: 50, tr: 'gleiche',          en: 'giống nhau, cùng',                pos: 'tính từ' },
    { id: 51, tr: 'andere',           en: 'khác, khác nhau',                 pos: 'tính từ' },
    { id: 52, tr: 'alle',             en: 'tất cả',                          pos: 'tính từ' },
    { id: 53, tr: 'einfach / leicht', en: 'dễ',                              pos: 'tính từ' },
    { id: 54, tr: 'schwer / schwierig', en: 'khó',                           pos: 'tính từ' },

    // Động từ Verbs (55–79)
    { id: 55, tr: 'sein',             en: 'là, ở',                           pos: 'động từ' },
    { id: 56, tr: 'haben',            en: 'có',                              pos: 'động từ' },
    { id: 57, tr: 'werden',           en: 'sẽ, trở thành',                   pos: 'động từ' },
    { id: 58, tr: 'machen',           en: 'làm',                             pos: 'động từ' },
    { id: 59, tr: 'gehen',            en: 'đi',                              pos: 'động từ' },
    { id: 60, tr: 'kommen',           en: 'đến, tới',                        pos: 'động từ' },
    { id: 61, tr: 'sagen',            en: 'nói',                             pos: 'động từ' },
    { id: 62, tr: 'wissen',           en: 'biết (sự thật)',                  pos: 'động từ' },
    { id: 63, tr: 'kennen',           en: 'biết (người/nơi)',                pos: 'động từ' },
    { id: 64, tr: 'sehen',            en: 'thấy, nhìn thấy',                 pos: 'động từ' },
    { id: 65, tr: 'wollen',           en: 'muốn',                            pos: 'động từ' },
    { id: 66, tr: 'können',           en: 'có thể, được',                    pos: 'động từ' },
    { id: 67, tr: 'müssen',           en: 'phải, cần phải',                  pos: 'động từ' },
    { id: 68, tr: 'geben',            en: 'cho, đưa',                        pos: 'động từ' },
    { id: 69, tr: 'nehmen',           en: 'lấy, cầm',                        pos: 'động từ' },
    { id: 70, tr: 'sprechen',         en: 'nói, nói chuyện',                 pos: 'động từ' },
    { id: 71, tr: 'hören',            en: 'nghe',                            pos: 'động từ' },
    { id: 72, tr: 'lesen',            en: 'đọc',                             pos: 'động từ' },
    { id: 73, tr: 'schreiben',        en: 'viết',                            pos: 'động từ' },
    { id: 74, tr: 'verstehen',        en: 'hiểu',                            pos: 'động từ' },
    { id: 75, tr: 'denken',           en: 'nghĩ, suy nghĩ',                  pos: 'động từ' },
    { id: 76, tr: 'finden',           en: 'tìm, tìm thấy',                   pos: 'động từ' },
    { id: 77, tr: 'benutzen',         en: 'sử dụng, dùng',                   pos: 'động từ' },
    { id: 78, tr: 'brauchen',         en: 'cần',                             pos: 'động từ' },
    { id: 79, tr: 'heißen',           en: 'tên là, được gọi là',             pos: 'động từ' },

    // Danh từ Nouns (80–94)
    { id: 80, tr: 'das Ding',         en: 'thứ, cái, đồ vật',               pos: 'danh từ' },
    { id: 81, tr: 'die Zeit',         en: 'thời gian',                       pos: 'danh từ' },
    { id: 82, tr: 'der Mann',         en: 'đàn ông, người đàn ông',          pos: 'danh từ' },
    { id: 83, tr: 'die Frau',         en: 'phụ nữ, bà',                     pos: 'danh từ' },
    { id: 84, tr: 'das Kind',         en: 'đứa trẻ, trẻ em',                pos: 'danh từ' },
    { id: 85, tr: 'das Haus',         en: 'nhà',                             pos: 'danh từ' },
    { id: 86, tr: 'die Arbeit',       en: 'công việc, việc làm',             pos: 'danh từ' },
    { id: 87, tr: 'der Tag',          en: 'ngày',                            pos: 'danh từ' },
    { id: 88, tr: 'das Jahr',         en: 'năm',                             pos: 'danh từ' },
    { id: 89, tr: 'die Stadt',        en: 'thành phố',                       pos: 'danh từ' },
    { id: 90, tr: 'das Geld',         en: 'tiền',                            pos: 'danh từ' },
    { id: 91, tr: 'das Wasser',       en: 'nước',                            pos: 'danh từ' },
    { id: 92, tr: 'das Essen',        en: 'đồ ăn, cơm',                     pos: 'danh từ' },
    { id: 93, tr: 'das Wort',         en: 'từ, chữ',                         pos: 'danh từ' },
    { id: 94, tr: 'die Sprache',      en: 'ngôn ngữ, tiếng',                pos: 'danh từ' },

    // Biểu đạt thông dụng Common expressions (95–99)
    { id: 95, tr: 'ja',               en: 'có, vâng, ừ',                     pos: 'biểu đạt' },
    { id: 96, tr: 'nein',             en: 'không',                           pos: 'biểu đạt' },
    { id: 97, tr: 'okay',             en: 'được, oke',                       pos: 'biểu đạt' },
    { id: 98, tr: 'Hallo',            en: 'xin chào, chào',                  pos: 'biểu đạt' },
    { id: 99, tr: 'Danke',            en: 'cảm ơn',                          pos: 'biểu đạt' }
  ];

  var STORAGE_KEY         = 'srs-german-vi-v1';
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

  function renderMeta(){var el=document.getElementById('srs-meta');if(!el)return;var rem=queue.length-queueIdx,pct=sessionTotal>0?Math.round(sessionDone/sessionTotal*100):0;el.innerHTML='<span class="srs-count">Đã xong&nbsp;<b>'+sessionDone+'</b>&ensp;&middot;&ensp;Còn lại&nbsp;<b>'+rem+'</b></span><div class="srs-bar-wrap"><div class="srs-bar" style="width:'+pct+'%"></div></div>';}
  function renderFront(card){var ce=document.getElementById('srs-card'),ae=document.getElementById('srs-actions');if(!ce||!ae)return;revealed=false;ce.className='srs-card';ce.innerHTML='<span class="srs-turkish">'+esc(card.tr)+'</span><span class="srs-pos">'+esc(card.pos)+'</span><span class="srs-hint">nhấp để xem đáp án</span>';ae.innerHTML='';renderMeta();}
  function renderBack(card){var ce=document.getElementById('srs-card'),ae=document.getElementById('srs-actions');if(!ce||!ae)return;revealed=true;var state=getState(card.id),preview=previewIntervals(state);ce.className='srs-card revealed';ce.innerHTML='<span class="srs-turkish">'+esc(card.tr)+'</span><span class="srs-pos">'+esc(card.pos)+'</span><div class="srs-divider"></div><span class="srs-english">'+esc(card.en)+'</span>';ae.innerHTML='<button class="srs-btn srs-btn-again" id="btn-again"><span class="srs-key">1</span>&nbsp;Thử lại&nbsp;<span class="srs-interval">'+fmtDays(preview.again)+'</span></button><button class="srs-btn srs-btn-good" id="btn-good"><span class="srs-key">3</span>&nbsp;Nhớ rồi&nbsp;<span class="srs-interval">'+fmtDays(preview.good)+'</span></button>';document.getElementById('btn-again').addEventListener('click',handleAgain);document.getElementById('btn-good').addEventListener('click',handleGood);}
  function renderDone(){root.innerHTML='<div class="srs-done"><div class="srs-done-title">Xong buổi học!</div><div class="srs-done-sub">Tất cả thẻ hôm nay đã được ôn tập.</div><div class="srs-done-stats">Đã ôn&nbsp;'+sessionDone+'&nbsp;thẻ trong buổi này<br>Đã học&nbsp;'+seenCount()+'&nbsp;/&nbsp;'+DECK.length+'&nbsp;từ</div><button class="srs-action-btn" id="btn-restart">Ôn tập lại</button></div>';document.getElementById('btn-restart').addEventListener('click',function(){var t=today();queue.forEach(function(c){getState(c.id).due=t;});init();});}
  function renderNothingDue(){root.innerHTML='<div class="srs-done"><div class="srs-done-title">Không có thẻ nào hôm nay</div><div class="srs-done-sub">Tất cả thẻ đã được lên lịch cho những ngày tới.</div><div class="srs-done-stats">Đã học&nbsp;'+seenCount()+'&nbsp;/&nbsp;'+DECK.length+'&nbsp;từ</div><button class="srs-action-btn" id="btn-new">Học từ mới</button></div>';document.getElementById('btn-new').addEventListener('click',function(){var nc=DECK.filter(function(c){return getState(c.id).reps===0;}).slice(0,MAX_NEW_PER_SESSION);if(!nc.length){root.innerHTML='<div class="srs-done"><div class="srs-done-title">Hoàn thành tất cả!</div><div class="srs-done-sub">Bạn đã học hết '+DECK.length+' từ. Quay lại ngày mai nhé.</div></div>';return;}queue=shuffle(nc);queueIdx=0;sessionDone=0;sessionTotal=queue.length;buildRootHTML();renderFront(queue[0]);});}
  function buildRootHTML(){root.innerHTML='<div class="srs-meta" id="srs-meta"></div><div class="srs-card" id="srs-card"></div><div class="srs-actions" id="srs-actions"></div>';document.getElementById('srs-card').addEventListener('click',function(){if(!revealed&&queue[queueIdx])renderBack(queue[queueIdx]);});}
  function handleAgain(){if(!revealed)return;var c=queue[queueIdx];schedule(getState(c.id),false);saveStates();queue.push(c);sessionTotal++;advance();}
  function handleGood(){if(!revealed)return;var c=queue[queueIdx];schedule(getState(c.id),true);saveStates();sessionDone++;advance();}
  function advance(){queueIdx++;if(queueIdx>=queue.length)renderDone();else renderFront(queue[queueIdx]);}
  function onKey(e){var tag=document.activeElement?document.activeElement.tagName:'';if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;if(e.key===' '||e.key==='Enter'){e.preventDefault();if(!revealed&&queue&&queue[queueIdx])renderBack(queue[queueIdx]);}else if(e.key==='1'){if(revealed)handleAgain();}else if(e.key==='3'){if(revealed)handleGood();}}
  function init(){states=loadStates();queue=buildQueue();queueIdx=0;sessionDone=0;sessionTotal=queue.length;revealed=false;if(!queue.length){renderNothingDue();return;}buildRootHTML();renderFront(queue[0]);}
  function setup(){root=document.getElementById('srs-root');if(!root)return;document.addEventListener('keydown',onKey);init();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
}());

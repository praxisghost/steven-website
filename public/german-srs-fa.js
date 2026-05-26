(function () {
  'use strict';

  /* ── DECK — 100 core German words (German ↔ Persian) ─────────────────── */
  var DECK = [
    // حروف ربط و حروف اضافه Conjunctions & prepositions (0–9)
    { id:  0, tr: 'ein / eine',       en: 'یک (حرف تعریف نامعین)',          pos: 'حرف تعریف' },
    { id:  1, tr: 'der / die / das',  en: 'حرف تعریف معین (مذکر/مؤنث/خنثی)', pos: 'حرف تعریف' },
    { id:  2, tr: 'und',              en: 'و',                              pos: 'حرف ربط' },
    { id:  3, tr: 'aber',             en: 'اما، ولی',                       pos: 'حرف ربط' },
    { id:  4, tr: 'weil',             en: 'چون، زیرا',                      pos: 'حرف ربط' },
    { id:  5, tr: 'wenn',             en: 'اگر، وقتی که',                   pos: 'حرف ربط' },
    { id:  6, tr: 'oder',             en: 'یا',                             pos: 'حرف ربط' },
    { id:  7, tr: 'dass',             en: 'که (در جمله وابسته)',             pos: 'حرف ربط' },
    { id:  8, tr: 'mit',              en: 'با (حرف اضافه)',                  pos: 'حرف اضافه' },
    { id:  9, tr: 'für',              en: 'برای (حرف اضافه)',                pos: 'حرف اضافه' },

    // ضمایر و کلمات پرسشی Pronouns & question words (10–24)
    { id: 10, tr: 'ich',              en: 'من',                             pos: 'ضمیر' },
    { id: 11, tr: 'du',               en: 'تو (غیررسمی)',                   pos: 'ضمیر' },
    { id: 12, tr: 'er',               en: 'او (مذکر)',                      pos: 'ضمیر' },
    { id: 13, tr: 'sie (مؤنث)',        en: 'او (مؤنث)',                      pos: 'ضمیر' },
    { id: 14, tr: 'es',               en: 'آن (خنثی)',                      pos: 'ضمیر' },
    { id: 15, tr: 'wir',              en: 'ما',                             pos: 'ضمیر' },
    { id: 16, tr: 'ihr',              en: 'شما (جمع غیررسمی)',              pos: 'ضمیر' },
    { id: 17, tr: 'sie (جمع)',         en: 'آن‌ها',                          pos: 'ضمیر' },
    { id: 18, tr: 'Sie',              en: 'شما (رسمی)',                     pos: 'ضمیر' },
    { id: 19, tr: 'dieser / diese',   en: 'این',                            pos: 'ضمیر / صفت' },
    { id: 20, tr: 'was',              en: 'چه / چی',                        pos: 'کلمه پرسشی' },
    { id: 21, tr: 'wer',              en: 'چه کسی / کی',                   pos: 'کلمه پرسشی' },
    { id: 22, tr: 'wo',               en: 'کجا',                            pos: 'کلمه پرسشی' },
    { id: 23, tr: 'wie',              en: 'چطور / چگونه',                   pos: 'کلمه پرسشی' },
    { id: 24, tr: 'warum',            en: 'چرا',                            pos: 'کلمه پرسشی' },

    // قیدها Adverbs (25–39)
    { id: 25, tr: 'sehr',             en: 'خیلی، بسیار',                    pos: 'قید' },
    { id: 26, tr: 'mehr',             en: 'بیشتر',                          pos: 'قید' },
    { id: 27, tr: 'auch',             en: 'هم، نیز',                        pos: 'قید' },
    { id: 28, tr: 'schon',            en: 'قبلاً، دیگر',                    pos: 'قید' },
    { id: 29, tr: 'immer',            en: 'همیشه',                          pos: 'قید' },
    { id: 30, tr: 'nie',              en: 'هرگز، هیچ‌وقت',                  pos: 'قید' },
    { id: 31, tr: 'jetzt',            en: 'الان، حالا',                     pos: 'قید' },
    { id: 32, tr: 'dann',             en: 'بعد، آنگاه',                     pos: 'قید' },
    { id: 33, tr: 'noch',             en: 'هنوز',                           pos: 'قید' },
    { id: 34, tr: 'hier',             en: 'اینجا',                          pos: 'قید' },
    { id: 35, tr: 'dort',             en: 'آنجا',                           pos: 'قید' },
    { id: 36, tr: 'nur',              en: 'فقط',                            pos: 'قید' },
    { id: 37, tr: 'vielleicht',       en: 'شاید',                           pos: 'قید' },
    { id: 38, tr: 'fast',             en: 'تقریباً',                        pos: 'قید' },
    { id: 39, tr: 'zusammen',         en: 'با هم',                          pos: 'قید' },

    // صفت‌ها Adjectives (40–54)
    { id: 40, tr: 'gut',              en: 'خوب',                            pos: 'صفت' },
    { id: 41, tr: 'schlecht',         en: 'بد',                             pos: 'صفت' },
    { id: 42, tr: 'groß',             en: 'بزرگ',                           pos: 'صفت' },
    { id: 43, tr: 'klein',            en: 'کوچک',                           pos: 'صفت' },
    { id: 44, tr: 'neu',              en: 'جدید',                           pos: 'صفت' },
    { id: 45, tr: 'alt',              en: 'قدیمی، پیر',                     pos: 'صفت' },
    { id: 46, tr: 'erste',            en: 'اول',                            pos: 'صفت' },
    { id: 47, tr: 'letzte',           en: 'آخرین',                          pos: 'صفت' },
    { id: 48, tr: 'viel',             en: 'زیاد، خیلی',                     pos: 'صفت' },
    { id: 49, tr: 'wenig',            en: 'کم',                             pos: 'صفت' },
    { id: 50, tr: 'gleiche',          en: 'یکسان',                          pos: 'صفت' },
    { id: 51, tr: 'andere',           en: 'دیگر',                           pos: 'صفت' },
    { id: 52, tr: 'alle',             en: 'همه',                            pos: 'صفت' },
    { id: 53, tr: 'einfach / leicht', en: 'آسان',                           pos: 'صفت' },
    { id: 54, tr: 'schwer / schwierig', en: 'سخت، دشوار',                  pos: 'صفت' },

    // افعال Verbs (55–79)
    { id: 55, tr: 'sein',             en: 'بودن',                           pos: 'فعل' },
    { id: 56, tr: 'haben',            en: 'داشتن',                          pos: 'فعل' },
    { id: 57, tr: 'werden',           en: 'شدن',                            pos: 'فعل' },
    { id: 58, tr: 'machen',           en: 'کردن، ساختن',                    pos: 'فعل' },
    { id: 59, tr: 'gehen',            en: 'رفتن',                           pos: 'فعل' },
    { id: 60, tr: 'kommen',           en: 'آمدن',                           pos: 'فعل' },
    { id: 61, tr: 'sagen',            en: 'گفتن',                           pos: 'فعل' },
    { id: 62, tr: 'wissen',           en: 'دانستن (واقعیت)',                 pos: 'فعل' },
    { id: 63, tr: 'kennen',           en: 'شناختن (شخص/مکان)',               pos: 'فعل' },
    { id: 64, tr: 'sehen',            en: 'دیدن',                           pos: 'فعل' },
    { id: 65, tr: 'wollen',           en: 'خواستن',                         pos: 'فعل' },
    { id: 66, tr: 'können',           en: 'توانستن',                        pos: 'فعل' },
    { id: 67, tr: 'müssen',           en: 'باید / مجبور بودن',              pos: 'فعل' },
    { id: 68, tr: 'geben',            en: 'دادن',                           pos: 'فعل' },
    { id: 69, tr: 'nehmen',           en: 'گرفتن، برداشتن',                 pos: 'فعل' },
    { id: 70, tr: 'sprechen',         en: 'صحبت کردن',                      pos: 'فعل' },
    { id: 71, tr: 'hören',            en: 'شنیدن',                          pos: 'فعل' },
    { id: 72, tr: 'lesen',            en: 'خواندن (مطالعه)',                 pos: 'فعل' },
    { id: 73, tr: 'schreiben',        en: 'نوشتن',                          pos: 'فعل' },
    { id: 74, tr: 'verstehen',        en: 'فهمیدن',                         pos: 'فعل' },
    { id: 75, tr: 'denken',           en: 'فکر کردن',                       pos: 'فعل' },
    { id: 76, tr: 'finden',           en: 'پیدا کردن، یافتن',               pos: 'فعل' },
    { id: 77, tr: 'benutzen',         en: 'استفاده کردن',                   pos: 'فعل' },
    { id: 78, tr: 'brauchen',         en: 'نیاز داشتن',                     pos: 'فعل' },
    { id: 79, tr: 'heißen',           en: 'نامیده شدن، اسمش هست',           pos: 'فعل' },

    // اسم‌ها Nouns (80–94)
    { id: 80, tr: 'das Ding',         en: 'چیز',                            pos: 'اسم' },
    { id: 81, tr: 'die Zeit',         en: 'زمان، وقت',                      pos: 'اسم' },
    { id: 82, tr: 'der Mann',         en: 'مرد',                            pos: 'اسم' },
    { id: 83, tr: 'die Frau',         en: 'زن',                             pos: 'اسم' },
    { id: 84, tr: 'das Kind',         en: 'بچه',                            pos: 'اسم' },
    { id: 85, tr: 'das Haus',         en: 'خانه',                           pos: 'اسم' },
    { id: 86, tr: 'die Arbeit',       en: 'کار',                            pos: 'اسم' },
    { id: 87, tr: 'der Tag',          en: 'روز',                            pos: 'اسم' },
    { id: 88, tr: 'das Jahr',         en: 'سال',                            pos: 'اسم' },
    { id: 89, tr: 'die Stadt',        en: 'شهر',                            pos: 'اسم' },
    { id: 90, tr: 'das Geld',         en: 'پول',                            pos: 'اسم' },
    { id: 91, tr: 'das Wasser',       en: 'آب',                             pos: 'اسم' },
    { id: 92, tr: 'das Essen',        en: 'غذا',                            pos: 'اسم' },
    { id: 93, tr: 'das Wort',         en: 'کلمه',                           pos: 'اسم' },
    { id: 94, tr: 'die Sprache',      en: 'زبان',                           pos: 'اسم' },

    // عبارات رایج Common expressions (95–99)
    { id: 95, tr: 'ja',               en: 'بله، آره',                       pos: 'عبارت' },
    { id: 96, tr: 'nein',             en: 'نه',                             pos: 'عبارت' },
    { id: 97, tr: 'okay',             en: 'باشه، خوبه',                     pos: 'عبارت' },
    { id: 98, tr: 'Hallo',            en: 'سلام',                           pos: 'عبارت' },
    { id: 99, tr: 'Danke',            en: 'ممنون، متشکرم',                  pos: 'عبارت' }
  ];

  var STORAGE_KEY         = 'srs-german-fa-v1';
  var MAX_NEW_PER_SESSION = 20;
  var root, states, queue, queueIdx, sessionDone, sessionTotal, revealed;

  function loadStates() { try { var r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : {}; } catch(e) { return {}; } }
  function saveStates() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(states)); } catch(e) {} }
  function getState(id) { if (!states[id]) states[id] = { interval:0, ef:2.5, reps:0, due:0 }; return states[id]; }
  function today() { return Math.floor(Date.now() / 86400000); }
  function schedule(state, good) {
    if (!good) { state.reps=0; state.interval=1; state.ef=Math.max(1.3,state.ef-0.2); }
    else { if(state.reps===0) state.interval=1; else if(state.reps===1) state.interval=6; else state.interval=Math.round(state.interval*state.ef); state.ef=Math.min(2.5,state.ef+0.1); state.reps++; }
    state.due = today() + state.interval;
  }
  function previewIntervals(s) { var g = s.reps===0?1:s.reps===1?6:Math.round(s.interval*s.ef); return {again:1,good:g}; }
  function fmtDays(d) { if(d<1) return '<1d'; if(d<30) return d+'d'; if(d<365) return Math.round(d/30)+'mo'; return Math.round(d/365)+'y'; }
  function shuffle(a) { for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;} return a; }
  function buildQueue() {
    var t=today(),due=[],nc=[];
    DECK.forEach(function(c){var s=getState(c.id);if(s.reps>0&&s.due<=t)due.push(c);else if(s.reps===0)nc.push(c);});
    shuffle(due);shuffle(nc);return due.concat(nc.slice(0,MAX_NEW_PER_SESSION));
  }
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function seenCount(){return DECK.filter(function(c){return getState(c.id).reps>0;}).length;}

  function renderMeta(){
    var el=document.getElementById('srs-meta');if(!el)return;
    var rem=queue.length-queueIdx,pct=sessionTotal>0?Math.round(sessionDone/sessionTotal*100):0;
    el.innerHTML='<span class="srs-count">انجام‌شده&nbsp;<b>'+sessionDone+'</b>&ensp;&middot;&ensp;باقی‌مانده&nbsp;<b>'+rem+'</b></span><div class="srs-bar-wrap"><div class="srs-bar" style="width:'+pct+'%"></div></div>';
  }
  function renderFront(card){
    var ce=document.getElementById('srs-card'),ae=document.getElementById('srs-actions');if(!ce||!ae)return;
    revealed=false;ce.className='srs-card';
    ce.innerHTML='<span class="srs-turkish">'+esc(card.tr)+'</span><span class="srs-pos">'+esc(card.pos)+'</span><span class="srs-hint">برای نمایش جواب کلیک کنید</span>';
    ae.innerHTML='';renderMeta();
  }
  function renderBack(card){
    var ce=document.getElementById('srs-card'),ae=document.getElementById('srs-actions');if(!ce||!ae)return;
    revealed=true;var state=getState(card.id),preview=previewIntervals(state);
    ce.className='srs-card revealed';
    ce.innerHTML='<span class="srs-turkish">'+esc(card.tr)+'</span><span class="srs-pos">'+esc(card.pos)+'</span><div class="srs-divider"></div><span class="srs-english">'+esc(card.en)+'</span>';
    ae.innerHTML='<button class="srs-btn srs-btn-again" id="btn-again"><span class="srs-key">1</span>&nbsp;دوباره&nbsp;<span class="srs-interval">'+fmtDays(preview.again)+'</span></button>'+
      '<button class="srs-btn srs-btn-good" id="btn-good"><span class="srs-key">3</span>&nbsp;یاد گرفتم&nbsp;<span class="srs-interval">'+fmtDays(preview.good)+'</span></button>';
    document.getElementById('btn-again').addEventListener('click',handleAgain);
    document.getElementById('btn-good').addEventListener('click',handleGood);
  }
  function renderDone(){
    root.innerHTML='<div class="srs-done"><div class="srs-done-title">جلسه تمام شد</div><div class="srs-done-sub">تمام کارت‌های امروز مرور شدند.</div>'+
      '<div class="srs-done-stats">'+sessionDone+'&nbsp;کارت در این جلسه مرور شد<br>'+seenCount()+'&nbsp;از&nbsp;'+DECK.length+'&nbsp;کلمه دیده شده</div>'+
      '<button class="srs-action-btn" id="btn-restart">دوباره مرور کن</button></div>';
    document.getElementById('btn-restart').addEventListener('click',function(){var t=today();queue.forEach(function(c){getState(c.id).due=t;});init();});
  }
  function renderNothingDue(){
    root.innerHTML='<div class="srs-done"><div class="srs-done-title">کارتی برای امروز نیست</div><div class="srs-done-sub">همه کارت‌ها برای روزهای آینده برنامه‌ریزی شده‌اند.</div>'+
      '<div class="srs-done-stats">'+seenCount()+'&nbsp;از&nbsp;'+DECK.length+'&nbsp;کلمه دیده شده</div><button class="srs-action-btn" id="btn-new">ادامه با کلمات جدید</button></div>';
    document.getElementById('btn-new').addEventListener('click',function(){
      var nc=DECK.filter(function(c){return getState(c.id).reps===0;}).slice(0,MAX_NEW_PER_SESSION);
      if(!nc.length){root.innerHTML='<div class="srs-done"><div class="srs-done-title">تمام!</div><div class="srs-done-sub">همه '+DECK.length+' کلمه را دیده‌اید. فردا برگردید.</div></div>';return;}
      queue=shuffle(nc);queueIdx=0;sessionDone=0;sessionTotal=queue.length;buildRootHTML();renderFront(queue[0]);
    });
  }
  function buildRootHTML(){
    root.innerHTML='<div class="srs-meta" id="srs-meta"></div><div class="srs-card" id="srs-card"></div><div class="srs-actions" id="srs-actions"></div>';
    document.getElementById('srs-card').addEventListener('click',function(){if(!revealed&&queue[queueIdx])renderBack(queue[queueIdx]);});
  }
  function handleAgain(){if(!revealed)return;var c=queue[queueIdx];schedule(getState(c.id),false);saveStates();queue.push(c);sessionTotal++;advance();}
  function handleGood(){if(!revealed)return;var c=queue[queueIdx];schedule(getState(c.id),true);saveStates();sessionDone++;advance();}
  function advance(){queueIdx++;if(queueIdx>=queue.length)renderDone();else renderFront(queue[queueIdx]);}
  function onKey(e){
    var tag=document.activeElement?document.activeElement.tagName:'';
    if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;
    if(e.key===' '||e.key==='Enter'){e.preventDefault();if(!revealed&&queue&&queue[queueIdx])renderBack(queue[queueIdx]);}
    else if(e.key==='1'){if(revealed)handleAgain();}
    else if(e.key==='3'){if(revealed)handleGood();}
  }
  function init(){states=loadStates();queue=buildQueue();queueIdx=0;sessionDone=0;sessionTotal=queue.length;revealed=false;if(!queue.length){renderNothingDue();return;}buildRootHTML();renderFront(queue[0]);}
  function setup(){root=document.getElementById('srs-root');if(!root)return;document.addEventListener('keydown',onKey);init();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
}());

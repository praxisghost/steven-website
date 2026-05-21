(function () {
  'use strict';

  /* ── KARTLAR — 100 temel Almanca kelime (Türkçe anlamları) ────────────── */
  var DECK = [
    // Bağlaçlar & partiküller (0–15)
    { id:  0, de: 'ein / eine',     tr: 'bir',                              pos: 'artikel / sayı' },
    { id:  1, de: 'und',            tr: 've',                               pos: 'bağlaç' },
    { id:  2, de: 'aber',           tr: 'ama / ancak',                      pos: 'bağlaç' },
    { id:  3, de: 'weil',           tr: 'çünkü / -dığı için',               pos: 'bağlaç' },
    { id:  4, de: 'wenn',           tr: 'eğer / ne zaman',                  pos: 'bağlaç' },
    { id:  5, de: 'oder',           tr: 'ya da / veya',                     pos: 'bağlaç' },
    { id:  6, de: 'dass',           tr: 'ki / olduğunu',                    pos: 'bağlaç' },
    { id:  7, de: 'für',            tr: 'için',                             pos: 'edat' },
    { id:  8, de: 'mit',            tr: 'ile / birlikte',                   pos: 'edat' },
    { id:  9, de: 'bis',            tr: 'kadar / -e değin',                 pos: 'edat' },
    { id: 10, de: 'wie',            tr: 'nasıl / gibi',                     pos: 'edat / zarf' },
    { id: 11, de: 'auch',           tr: 'de / da / aynı zamanda',           pos: 'zarf' },
    { id: 12, de: 'nicht',          tr: 'değil / olumsuzluk',               pos: 'partikül' },
    { id: 13, de: 'kein / keine',   tr: 'hiç / hiçbir',                     pos: 'partikül' },
    { id: 14, de: 'es gibt',        tr: 'var / mevcut',                     pos: 'partikül' },
    { id: 15, de: 'es gibt nicht',  tr: 'yok / mevcut değil',               pos: 'partikül' },

    // Zamirler & soru kelimeleri (16–29)
    { id: 16, de: 'ich',            tr: 'ben',                              pos: 'zamir' },
    { id: 17, de: 'du',             tr: 'sen',                              pos: 'zamir' },
    { id: 18, de: 'er / sie / es',  tr: 'o (er/sie/es)',                    pos: 'zamir' },
    { id: 19, de: 'wir',            tr: 'biz',                              pos: 'zamir' },
    { id: 20, de: 'ihr',            tr: 'siz (çoğul)',                      pos: 'zamir' },
    { id: 21, de: 'sie (Plural)',   tr: 'onlar',                            pos: 'zamir' },
    { id: 22, de: 'dieser / diese', tr: 'bu / bu (m/f)',                    pos: 'zamir / belirteç' },
    { id: 23, de: 'jener / jene',   tr: 'şu / o (uzakta)',                  pos: 'zamir / belirteç' },
    { id: 24, de: 'was',            tr: 'ne',                               pos: 'soru sözcüğü' },
    { id: 25, de: 'wer',            tr: 'kim',                              pos: 'soru sözcüğü' },
    { id: 26, de: 'wo',             tr: 'nerede',                           pos: 'soru sözcüğü' },
    { id: 27, de: 'wie',            tr: 'nasıl',                            pos: 'soru sözcüğü' },
    { id: 28, de: 'warum',          tr: 'neden / niye',                     pos: 'soru sözcüğü' },
    { id: 29, de: 'sich',           tr: 'kendini / kendi (dönüşlü)',        pos: 'zamir' },

    // Zarflar (30–46)
    { id: 30, de: 'sehr',           tr: 'çok / fazlasıyla',                 pos: 'zarf' },
    { id: 31, de: 'mehr',           tr: 'daha fazla',                       pos: 'zarf' },
    { id: 32, de: 'jetzt',          tr: 'şimdi / artık',                    pos: 'zarf' },
    { id: 33, de: 'nie / niemals',  tr: 'hiçbir zaman / asla',              pos: 'zarf' },
    { id: 34, de: 'immer',          tr: 'her zaman / daima',                pos: 'zarf' },
    { id: 35, de: 'nun',            tr: 'şimdi / artık',                    pos: 'zarf' },
    { id: 36, de: 'danach',         tr: 'sonra / ardından',                 pos: 'zarf' },
    { id: 37, de: 'vorher',         tr: 'önce / daha önce',                 pos: 'zarf' },
    { id: 38, de: 'vielleicht',     tr: 'belki / muhtemelen',               pos: 'zarf' },
    { id: 39, de: 'noch',           tr: 'hâlâ / daha / henüz',              pos: 'zarf' },
    { id: 40, de: 'das heißt',      tr: 'yani / demek ki',                  pos: 'zarf' },
    { id: 41, de: 'natürlich',      tr: 'tabii / elbette',                  pos: 'zarf' },
    { id: 42, de: 'zusammen',       tr: 'birlikte / beraber',               pos: 'zarf' },
    { id: 43, de: 'meiner Meinung', tr: 'benim görüşüme göre',              pos: 'zarf' },
    { id: 44, de: 'sowieso',        tr: 'zaten / nasıl olsa',               pos: 'zarf' },
    { id: 45, de: 'nur',            tr: 'sadece / yalnızca',                pos: 'zarf' },
    { id: 46, de: 'sofort',         tr: 'hemen / derhal',                   pos: 'zarf' },

    // Sıfatlar (47–62)
    { id: 47, de: 'jeder / jede',   tr: 'her / her bir',                    pos: 'sıfat' },
    { id: 48, de: 'ganz / alle',    tr: 'bütün / hepsi',                    pos: 'sıfat' },
    { id: 49, de: 'gut',            tr: 'iyi',                              pos: 'sıfat' },
    { id: 50, de: 'groß',           tr: 'büyük',                            pos: 'sıfat' },
    { id: 51, de: 'klein',          tr: 'küçük',                            pos: 'sıfat' },
    { id: 52, de: 'neu',            tr: 'yeni',                             pos: 'sıfat' },
    { id: 53, de: 'alt',            tr: 'eski / yaşlı',                     pos: 'sıfat' },
    { id: 54, de: 'erst-',          tr: 'ilk',                              pos: 'sıfat' },
    { id: 55, de: 'letzt-',         tr: 'son / en son',                     pos: 'sıfat' },
    { id: 56, de: 'schön',          tr: 'güzel / hoş',                      pos: 'sıfat' },
    { id: 57, de: 'richtig',        tr: 'doğru / correct',                  pos: 'sıfat' },
    { id: 58, de: 'andere',         tr: 'başka / diğer',                    pos: 'sıfat' },
    { id: 59, de: 'gleich',         tr: 'aynı / eşit',                      pos: 'sıfat' },
    { id: 60, de: 'wichtig',        tr: 'önemli',                           pos: 'sıfat' },
    { id: 61, de: 'einfach',        tr: 'kolay / basit',                    pos: 'sıfat' },
    { id: 62, de: 'schwierig',      tr: 'zor / güç',                        pos: 'sıfat' },

    // Fiiller — infinitif (63–80)
    { id: 63, de: 'sein / werden',  tr: 'olmak / -mek',                     pos: 'fiil' },
    { id: 64, de: 'machen',         tr: 'yapmak / hazırlamak',              pos: 'fiil' },
    { id: 65, de: 'kommen',         tr: 'gelmek',                           pos: 'fiil' },
    { id: 66, de: 'gehen',          tr: 'gitmek',                           pos: 'fiil' },
    { id: 67, de: 'sagen',          tr: 'söylemek / demek',                 pos: 'fiil' },
    { id: 68, de: 'wissen',         tr: 'bilmek',                           pos: 'fiil' },
    { id: 69, de: 'sehen',          tr: 'görmek',                           pos: 'fiil' },
    { id: 70, de: 'wollen',         tr: 'istemek',                          pos: 'fiil' },
    { id: 71, de: 'geben',          tr: 'vermek',                           pos: 'fiil' },
    { id: 72, de: 'nehmen',         tr: 'almak / kabul etmek',              pos: 'fiil' },
    { id: 73, de: 'schauen',        tr: 'bakmak / izlemek',                 pos: 'fiil' },
    { id: 74, de: 'verstehen',      tr: 'anlamak / kavramak',               pos: 'fiil' },
    { id: 75, de: 'denken',         tr: 'düşünmek',                         pos: 'fiil' },
    { id: 76, de: 'finden',         tr: 'bulmak',                           pos: 'fiil' },
    { id: 77, de: 'erzählen',       tr: 'anlatmak / söylemek',              pos: 'fiil' },
    { id: 78, de: 'können',         tr: 'yapabilmek / bilmek',              pos: 'fiil' },
    { id: 79, de: 'müssen',         tr: '-mek zorunda olmak',               pos: 'fiil' },
    { id: 80, de: 'benutzen',       tr: 'kullanmak',                        pos: 'fiil' },

    // İsimler (81–94)
    { id: 81, de: 'das Ding',       tr: 'şey / nesne',                      pos: 'isim' },
    { id: 82, de: 'die Zeit',       tr: 'zaman / vakit',                    pos: 'isim' },
    { id: 83, de: 'der Mann',       tr: 'adam / erkek',                     pos: 'isim' },
    { id: 84, de: 'die Frau',       tr: 'kadın / hanım',                    pos: 'isim' },
    { id: 85, de: 'das Kind',       tr: 'çocuk',                            pos: 'isim' },
    { id: 86, de: 'das Haus',       tr: 'ev / bina',                        pos: 'isim' },
    { id: 87, de: 'die Arbeit',     tr: 'iş / çalışma',                     pos: 'isim' },
    { id: 88, de: 'der Tag',        tr: 'gün',                              pos: 'isim' },
    { id: 89, de: 'das Jahr',       tr: 'yıl',                              pos: 'isim' },
    { id: 90, de: 'der Ort',        tr: 'yer / mekân',                      pos: 'isim' },
    { id: 91, de: 'die Stadt',      tr: 'şehir',                            pos: 'isim' },
    { id: 92, de: 'das Geld',       tr: 'para',                             pos: 'isim' },
    { id: 93, de: 'das Wasser',     tr: 'su',                               pos: 'isim' },
    { id: 94, de: 'das Essen',      tr: 'yemek / yiyecek',                  pos: 'isim / fiil' },

    // Genel ifadeler (95–99)
    { id: 95, de: 'ja',             tr: 'evet',                             pos: 'ifade' },
    { id: 96, de: 'nein',           tr: 'hayır',                            pos: 'ifade' },
    { id: 97, de: 'okay / gut',     tr: 'tamam',                            pos: 'ifade' },
    { id: 98, de: 'Hallo',          tr: 'merhaba',                          pos: 'ifade' },
    { id: 99, de: 'danke',          tr: 'teşekkürler',                      pos: 'ifade' }
  ];

  var STORAGE_KEY        = 'srs-german-tr-v1';
  var MAX_NEW_PER_SESSION = 20;

  var root, states, queue, queueIdx, sessionDone, sessionTotal, revealed;

  /* ── DEPOLAMA ────────────────────────────────────────────────────────── */

  function loadStates() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveStates() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(states)); } catch (e) {}
  }

  function getState(id) {
    if (!states[id]) {
      states[id] = { interval: 0, ef: 2.5, reps: 0, due: 0 };
    }
    return states[id];
  }

  /* ── ALGORİTMA — SM-2 lite ───────────────────────────────────────────── */

  function today() {
    return Math.floor(Date.now() / 86400000);
  }

  function schedule(state, good) {
    if (!good) {
      state.reps     = 0;
      state.interval = 1;
      state.ef       = Math.max(1.3, state.ef - 0.2);
    } else {
      if (state.reps === 0) {
        state.interval = 1;
      } else if (state.reps === 1) {
        state.interval = 6;
      } else {
        state.interval = Math.round(state.interval * state.ef);
      }
      state.ef  = Math.min(2.5, state.ef + 0.1);
      state.reps += 1;
    }
    state.due = today() + state.interval;
  }

  function previewIntervals(state) {
    var good;
    if (state.reps === 0) {
      good = 1;
    } else if (state.reps === 1) {
      good = 6;
    } else {
      good = Math.round(state.interval * state.ef);
    }
    return { again: 1, good: good };
  }

  function fmtDays(d) {
    if (d < 1)   return '<1g';
    if (d < 30)  return d + 'g';
    if (d < 365) return Math.round(d / 30) + 'ay';
    return Math.round(d / 365) + 'y';
  }

  /* ── SIRA ────────────────────────────────────────────────────────────── */

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j   = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i]  = arr[j];
      arr[j]  = tmp;
    }
    return arr;
  }

  function buildQueue() {
    var t = today();
    var due = [], newCards = [];
    DECK.forEach(function (card) {
      var s = getState(card.id);
      if (s.reps > 0 && s.due <= t) {
        due.push(card);
      } else if (s.reps === 0) {
        newCards.push(card);
      }
    });
    shuffle(due);
    shuffle(newCards);
    return due.concat(newCards.slice(0, MAX_NEW_PER_SESSION));
  }

  /* ── YARDIMCI FONKSİYONLAR ───────────────────────────────────────────── */

  function esc(s) {
    return String(s)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;');
  }

  function seenCount() {
    return DECK.filter(function (c) { return getState(c.id).reps > 0; }).length;
  }

  /* ── RENDER ──────────────────────────────────────────────────────────── */

  function renderMeta() {
    var metaEl = document.getElementById('srs-meta');
    if (!metaEl) return;
    var remaining = queue.length - queueIdx;
    var pct = sessionTotal > 0 ? Math.round((sessionDone / sessionTotal) * 100) : 0;
    metaEl.innerHTML =
      '<span class="srs-count">Tamamlanan&nbsp;<b>' + sessionDone + '</b>&ensp;&middot;&ensp;Kalan&nbsp;<b>' + remaining + '</b></span>' +
      '<div class="srs-bar-wrap"><div class="srs-bar" style="width:' + pct + '%"></div></div>';
  }

  function renderFront(card) {
    var cardEl = document.getElementById('srs-card');
    var actEl  = document.getElementById('srs-actions');
    if (!cardEl || !actEl) return;
    revealed = false;
    cardEl.className   = 'srs-card';
    cardEl.innerHTML   =
      '<span class="srs-turkish">' + esc(card.de) + '</span>' +
      '<span class="srs-pos">'     + esc(card.pos) + '</span>' +
      '<span class="srs-hint">görmek için tıkla</span>';
    actEl.innerHTML = '';
    renderMeta();
  }

  function renderBack(card) {
    var cardEl = document.getElementById('srs-card');
    var actEl  = document.getElementById('srs-actions');
    if (!cardEl || !actEl) return;
    revealed = true;
    var state   = getState(card.id);
    var preview = previewIntervals(state);
    cardEl.className = 'srs-card revealed';
    cardEl.innerHTML =
      '<span class="srs-turkish">' + esc(card.de) + '</span>' +
      '<span class="srs-pos">'     + esc(card.pos) + '</span>' +
      '<div class="srs-divider"></div>' +
      '<span class="srs-english">' + esc(card.tr)  + '</span>';
    actEl.innerHTML =
      '<button class="srs-btn srs-btn-again" id="btn-again">' +
        '<span class="srs-key">1</span>&nbsp;Tekrar&nbsp;<span class="srs-interval">' + fmtDays(preview.again) + '</span>' +
      '</button>' +
      '<button class="srs-btn srs-btn-good" id="btn-good">' +
        '<span class="srs-key">3</span>&nbsp;Biliyorum&nbsp;<span class="srs-interval">' + fmtDays(preview.good) + '</span>' +
      '</button>';
    document.getElementById('btn-again').addEventListener('click', handleAgain);
    document.getElementById('btn-good').addEventListener('click', handleGood);
  }

  function renderDone() {
    root.innerHTML =
      '<div class="srs-done">' +
        '<div class="srs-done-title">Oturum tamamlandı</div>' +
        '<div class="srs-done-sub">Bugünkü tüm kartlar çalışıldı.</div>' +
        '<div class="srs-done-stats">' +
          sessionDone + '&nbsp;kart bu oturumda çalışıldı<br>' +
          seenCount() + '&nbsp;/&nbsp;' + DECK.length + '&nbsp;kelime şimdiye kadar görüldü' +
        '</div>' +
        '<button class="srs-action-btn" id="btn-restart">Tekrar çalış</button>' +
      '</div>';
    document.getElementById('btn-restart').addEventListener('click', function () {
      var t = today();
      queue.forEach(function (card) {
        var s = getState(card.id);
        s.due = t;
      });
      init();
    });
  }

  function renderNothingDue() {
    root.innerHTML =
      '<div class="srs-done">' +
        '<div class="srs-done-title">Bekleyen kart yok</div>' +
        '<div class="srs-done-sub">Tüm kartlar sonraki tekrar için planlandı.</div>' +
        '<div class="srs-done-stats">' +
          seenCount() + '&nbsp;/&nbsp;' + DECK.length + '&nbsp;kelime şimdiye kadar görüldü' +
        '</div>' +
        '<button class="srs-action-btn" id="btn-new">Yine de yeni kartları başlat</button>' +
      '</div>';
    document.getElementById('btn-new').addEventListener('click', function () {
      var newCards = DECK.filter(function (c) { return getState(c.id).reps === 0; })
                        .slice(0, MAX_NEW_PER_SESSION);
      if (newCards.length === 0) {
        root.innerHTML =
          '<div class="srs-done">' +
            '<div class="srs-done-title">Her şey tamamlandı!</div>' +
            '<div class="srs-done-sub">Tüm ' + DECK.length + ' kelimeyi gördün. Tekrarlar için yarın gel.</div>' +
          '</div>';
        return;
      }
      queue        = shuffle(newCards);
      queueIdx     = 0;
      sessionDone  = 0;
      sessionTotal = queue.length;
      buildRootHTML();
      renderFront(queue[0]);
    });
  }

  /* ── DOM YAPISI ──────────────────────────────────────────────────────── */

  function buildRootHTML() {
    root.innerHTML =
      '<div class="srs-meta"    id="srs-meta"></div>'    +
      '<div class="srs-card"    id="srs-card"></div>'    +
      '<div class="srs-actions" id="srs-actions"></div>';
    document.getElementById('srs-card').addEventListener('click', function () {
      if (!revealed && queue[queueIdx]) {
        renderBack(queue[queueIdx]);
      }
    });
  }

  /* ── DEĞERLENDİRME ───────────────────────────────────────────────────── */

  function handleAgain() {
    if (!revealed) return;
    var card = queue[queueIdx];
    schedule(getState(card.id), false);
    saveStates();
    queue.push(card);
    sessionTotal++;
    advance();
  }

  function handleGood() {
    if (!revealed) return;
    var card = queue[queueIdx];
    schedule(getState(card.id), true);
    saveStates();
    sessionDone++;
    advance();
  }

  function advance() {
    queueIdx++;
    if (queueIdx >= queue.length) {
      renderDone();
    } else {
      renderFront(queue[queueIdx]);
    }
  }

  /* ── KLAVYE ──────────────────────────────────────────────────────────── */

  function onKey(e) {
    var tag = document.activeElement ? document.activeElement.tagName : '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!revealed && queue && queue[queueIdx]) {
        renderBack(queue[queueIdx]);
      }
    } else if (e.key === '1') {
      if (revealed) handleAgain();
    } else if (e.key === '3') {
      if (revealed) handleGood();
    }
  }

  /* ── BAŞLAT ──────────────────────────────────────────────────────────── */

  function init() {
    states       = loadStates();
    queue        = buildQueue();
    queueIdx     = 0;
    sessionDone  = 0;
    sessionTotal = queue.length;

    if (queue.length === 0) {
      renderNothingDue();
      return;
    }
    buildRootHTML();
    renderFront(queue[0]);
  }

  document.addEventListener('DOMContentLoaded', function () {
    root = document.getElementById('srs-root');
    if (!root) return;
    document.addEventListener('keydown', onKey);
    init();
  });

})();

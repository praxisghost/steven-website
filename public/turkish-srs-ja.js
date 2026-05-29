/* turkish-srs-ja.js — SRS flashcard data: トルコ語 for Japanese speakers
   SM-2 spaced-repetition algorithm. Progress stored in localStorage.
   Card set: 40 Turkish words and phrases with Japanese meanings.
   Front: Turkish | Back: Japanese meaning + notes
*/
(function () {
  'use strict';

  const PAIR = 'tr-ja';
  const WORDS = [
    /* ── あいさつ・基本表現 ──────────────────────────────────── */
    ['merhaba',              'こんにちは — 最も一般的な挨拶'],
    ['teşekkür ederim',      'ありがとうございます — 丁寧な感謝の表現'],
    ['lütfen',               'お願いします — 依頼・丁寧さを示す'],
    ['evet / hayır',         'はい / いいえ'],
    ['özür dilerim',         'すみません / ごめんなさい'],
    /* ── 母音調和 ────────────────────────────────────────── */
    ['evde',                 '家で — 処格。ev（家）は前舌、だからde'],
    ['okulda',               '学校で — 処格。okul（学校）は後舌、だからda'],
    ['kitabı',               '本を — 対格。kitap（本）の語末pがbに変化'],
    ['ünlü uyumu',           '母音調和 — トルコ語最重要文法概念'],
    /* ── 日常語彙 ────────────────────────────────────────── */
    ['su',                   '水'],
    ['ekmek',                'パン'],
    ['ev',                   '家'],
    ['çay',                  'お茶 — トルコ文化の中心'],
    ['kahve',                'コーヒー —「コーヒー」の語源はトルコ語・アラビア語'],
    /* ── 代名詞 ─────────────────────────────────────────── */
    ['ben',                  '私'],
    ['sen',                  'あなた（インフォーマル）'],
    ['siz',                  'あなた（敬称・複数）— 目上の人にはsizを使う'],
    ['o',                    '彼 / 彼女 / それ — 三人称は一語のみ'],
    /* ── 動詞の核 ────────────────────────────────────────── */
    ['gitmek',               '行く — 不定詞の語尾は-mek/-mak'],
    ['gelmek',               '来る'],
    ['yemek yemek',          '食べる（不定詞 yemek = 食べる / 食べ物の両義）'],
    ['bilmek',               '知っている'],
    ['istemek',              '欲しい / 望む'],
    /* ── 語順・文構造 ────────────────────────────────────── */
    ['Ben kitap okuyorum.',  '私は本を読んでいます。（SOV語順 — 日本語と同じ）'],
    ['Ben gitmiyorum.',      '私は行かない。（否定-mi/-mi: gitmek → gitmiyorum）'],
    /* ── 数・時間 ────────────────────────────────────────── */
    ['bir, iki, üç',         '1, 2, 3'],
    ['bugün / yarın / dün',  '今日 / 明日 / 昨日'],
    ['şimdi',                '今'],
    /* ── 色・形容詞 ──────────────────────────────────────── */
    ['büyük / küçük',        '大きい / 小さい'],
    ['iyi / kötü',           '良い / 悪い'],
    ['yeni / eski',          '新しい / 古い'],
    ['kırmızı / mavi',       '赤 / 青'],
    /* ── 文化・地名 ──────────────────────────────────────── */
    ['Türkiye',              'トルコ（国名）'],
    ['İstanbul',             'イスタンブール — ビザンツ・オスマン帝国の古都'],
    ['inşallah',             '神の御心のままに — 日常会話で頻繁に使われる表現'],
    ['türkü',                'トルコ民謡 — 地方ごとに独自の旋律と詞を持つ'],
    /* ── テュルク語族 ─────────────────────────────────────── */
    ['Türkçe',               'トルコ語'],
    ['Japonca',              '日本語'],
    ['eklemeli dil',         '膠着語 — 日本語と同じ言語類型'],
  ];

  function loadState() {
    try { return JSON.parse(localStorage.getItem('srs_' + PAIR) || '{}'); }
    catch (e) { return {}; }
  }
  function saveState(s) {
    try { localStorage.setItem('srs_' + PAIR, JSON.stringify(s)); } catch (e) {}
  }
  function today() { return Math.floor(Date.now() / 86400000); }
  function getDue(state) {
    const t = today();
    return WORDS.filter((_, i) => { const c = state[i]; return !c || c.nextDay <= t; });
  }
  function updateCard(state, idx, quality) {
    const c = state[idx] || { ef: 2.5, interval: 1, reps: 0 };
    if (quality < 3) { c.reps = 0; c.interval = 1; }
    else {
      if (c.reps === 0)      c.interval = 1;
      else if (c.reps === 1) c.interval = 6;
      else                   c.interval = Math.round(c.interval * c.ef);
      c.reps += 1;
      c.ef = Math.max(1.3, c.ef + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    }
    c.nextDay = today() + c.interval;
    state[idx] = c;
    return state;
  }

  const elInfo = document.getElementById('srs-info'), elCard = document.getElementById('srs-card'),
        elFront = document.getElementById('srs-front'), elBack = document.getElementById('srs-back'),
        elControls = document.getElementById('srs-controls'), elFlip = document.getElementById('srs-flip'),
        elAgain = document.getElementById('srs-again'), elGood = document.getElementById('srs-good'),
        elDone = document.getElementById('srs-done'), elRestart = document.getElementById('srs-restart'),
        elBar = document.getElementById('srs-bar');

  if (!elInfo) return;
  let state = loadState(), queue = [], current = null;

  function buildQueue() { queue = getDue(state).map((w) => WORDS.indexOf(w)).sort(() => Math.random() - 0.5); }
  function updateBar() { if (elBar) elBar.style.width = (WORDS.length ? ((WORDS.length - getDue(state).length) / WORDS.length) * 100 : 100) + '%'; }
  function showCard() {
    if (!queue.length) { elCard.style.display = elFlip.style.display = elControls.style.display = 'none'; elDone.style.display = 'block'; elInfo.textContent = '今日の分は終了です！'; return; }
    current = queue.shift();
    const [f, b] = WORDS[current];
    elFront.textContent = f; elBack.textContent = b;
    elBack.style.display = 'none'; elFront.style.display = 'block';
    elControls.style.display = 'none'; elFlip.style.display = 'inline-block';
    elCard.style.display = 'block'; elDone.style.display = 'none';
    elInfo.textContent = (queue.length + 1) + ' / ' + getDue(loadState()).length + ' 枚';
    updateBar();
  }
  function flip() { elBack.style.display = elFront.style.display = 'block'; elFlip.style.display = 'none'; elControls.style.display = 'flex'; }
  elFlip.addEventListener('click', flip);
  elAgain.addEventListener('click', () => { state = updateCard(state, current, 1); saveState(state); queue.push(current); current = null; showCard(); });
  elGood.addEventListener('click', () => { state = updateCard(state, current, 5); saveState(state); current = null; showCard(); });
  if (elRestart) elRestart.addEventListener('click', () => { buildQueue(); elDone.style.display = 'none'; showCard(); });
  document.addEventListener('keydown', (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && elFlip.style.display !== 'none') { e.preventDefault(); flip(); }
    if (e.key === '1' && elControls.style.display !== 'none') { state = updateCard(state, current, 1); saveState(state); queue.push(current); current = null; showCard(); }
    if (e.key === '3' && elControls.style.display !== 'none') { state = updateCard(state, current, 5); saveState(state); current = null; showCard(); }
  });
  buildQueue(); showCard();
})();

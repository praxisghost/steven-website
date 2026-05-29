/* ukrainian-srs-ja.js — SRS flashcard data: ウクライナ語 for Japanese speakers
   SM-2 spaced-repetition algorithm. Progress stored in localStorage.
   Card set: 40 Ukrainian words and phrases with Japanese meanings.
   Front: Ukrainian (Cyrillic) | Back: Japanese meaning + romanization
*/
(function () {
  'use strict';

  const PAIR = 'uk-ja';
  const WORDS = [
    /* ── あいさつ・基本表現 ──────────────────────────────────── */
    ['привіт',               'こんにちは (Pryvit) — インフォーマルな挨拶'],
    ['дякую',                'ありがとうございます (Dyakuyu)'],
    ['будь ласка',           'お願いします (Bud\' laska)'],
    ['так / ні',             'はい / いいえ (Tak / Ni)'],
    ['вибачте',              'すみません (Vybachte) — 丁寧な謝罪・呼びかけ'],
    /* ── キリル文字の基礎 ─────────────────────────────────── */
    ['Г г — 発音はh',        'ウクライナ語のГは有声摩擦音（英語のhに近い）— ロシア語のГ（破裂音）と異なる'],
    ['Ґ ґ — 発音はg',        '破裂音のg。ロシア語にはない文字'],
    ['і / ї の区別',         'іは「イ」; їは前に半母音を伴う「ヤ行のイ」'],
    ['є — 発音はye',          '前母音化したe。「イェ」の音'],
    /* ── 日常語彙 ────────────────────────────────────────── */
    ['вода',                 '水 (voda)'],
    ['хліб',                 'パン (khlib) — 東欧文化の主食'],
    ['дім',                  '家・家庭 (dim)'],
    ['мова',                 '言語・言葉 (mova) — ウクライナ人にとって言語は文化的アイデンティティの核'],
    /* ── 代名詞 ─────────────────────────────────────────── */
    ['я / ти / він / вона',  '私 / あなた / 彼 / 彼女'],
    ['ми / ви / вони',       '私たち / あなたたち（敬） / 彼ら'],
    /* ── 格変化の概念 ─────────────────────────────────────── */
    ['називний відмінок',    '主格 — 文の主語'],
    ['знахідний відмінок',   '対格 — 直接目的語（〜を）'],
    ['давальний відмінок',   '与格 — 間接目的語（〜に）'],
    ['родовий відмінок',     '生格 — 所有・否定（〜の、〜がない）'],
    /* ── 動詞の核 ────────────────────────────────────────── */
    ['читати',               '読む (chytaty) — 不完了体'],
    ['прочитати',            '読み終える (prochytaty) — 完了体（読む）'],
    ['говорити',             '話す・しゃべる (hovoryty) — 不完了体'],
    ['знати',                '知っている (znaty)'],
    /* ── アスペクトの概念 ─────────────────────────────────── */
    ['вчора я читав книгу',  '昨日私は本を読んでいた（不完了体 — 完結していない、途中）'],
    ['вчора я прочитав книгу','昨日私は本を読み終えた（完了体 — 完結した行為）'],
    /* ── 数・時間 ────────────────────────────────────────── */
    ['один, два, три',       '1, 2, 3 (odyn, dva, try)'],
    ['сьогодні / завтра / вчора', '今日 / 明日 / 昨日'],
    ['зараз',                '今 (zaraz)'],
    /* ── 色・形容詞 ──────────────────────────────────────── */
    ['великий / маленький',  '大きい / 小さい (velykyy / malenkyy)'],
    ['добрий / поганий',     '良い / 悪い (dobryy / pohanyy)'],
    ['червоний / синій',     '赤 / 青 (chervonyy / syniy)'],
    /* ── 文化 ────────────────────────────────────────────── */
    ['Україна',              'ウクライナ (Ukrayina)'],
    ['вишиванка',            'ウクライナ刺繍シャツ — 文化的アイデンティティの象徴'],
    ['борщ',                 'ボルシチ — ウクライナのビーツスープ。国民的料理'],
    ['Тарас Шевченко',       'タラス・シェフチェンコ — ウクライナ語文学の父、国民的英雄'],
    /* ── 言語的特徴 ──────────────────────────────────────── */
    ['Українська мова',      'ウクライナ語 (Ukrayinska mova)'],
    ['Японська мова',        '日本語 (Yaponska mova)'],
    ['відмінок',             '格 (vidminok) — ウクライナ語には7つの格がある'],
    ['вид дієслова',         '動詞のアスペクト (vyd diyeslova) — 完了体・不完了体の区別'],
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

/* ainu-srs-ja.js — SRS flashcard data: アイヌ語 for Japanese speakers
   SM-2 spaced-repetition algorithm. Progress stored in localStorage.
   Card set: 40 Ainu words and phrases with Japanese meanings + pronunciation notes.
   Front: Ainu (Latin orthography) | Back: Japanese meaning + notes
*/
(function () {
  'use strict';

  const PAIR = 'ain-ja';
  const WORDS = [
    /* ── あいさつ・基本表現 ──────────────────────────────────── */
    ['irankarapte',        'こんにちは（直訳：あなたの心にそっと触れさせてください）'],
    ['iyairaikere',        'ありがとうございます（略してiyayiraykere）'],
    ['pirka',              '美しい・良い・素晴らしい'],
    ['pon',                '小さい'],
    ['poro',               '大きい・多い'],
    /* ── 人・社会 ─────────────────────────────────────────── */
    ['ainu',               '人・人間（アイヌ語で人を指す普通名詞）'],
    ['menoko',             '女性'],
    ['okkayo',             '男性'],
    ['pon ainu',           '子ども（直訳：小さい人）'],
    ['ekasi',              '祖父・老人・長老（敬称）'],
    /* ── 自然・地名 ──────────────────────────────────────── */
    ['wakka',              '水'],
    ['abe',                '火'],
    ['kim',                '山・山林'],
    ['pet',                '川（北海道の地名「ペット」はここから：サッポロ＝乾いた大きな川）'],
    ['mos',                '小さい川（モシリ＝静かな大地 の「モシ」の語根）'],
    ['mosir',              '大地・国・世界（例：Ainu mosir = アイヌの大地）'],
    ['nupuri',             '山（独立した山、登別「ノボリベツ」はヌプルペツ：濁った川）'],
    ['to',                 '湖・池'],
    ['chikap',             '鳥'],
    ['kamuy',              '神・霊的存在（熊は特に重要なカムイ）'],
    /* ── 動詞・述語 ──────────────────────────────────────── */
    ['e-',                 '動詞の人称接辞「あなたが〜する」（e-ipe = あなたが食べる）'],
    ['ku=',                '動詞の人称接辞「私が〜する」（ku=ipe = 私が食べる）'],
    ['ipe',                '食べる（ku=ipe = 私が食べる）'],
    ['arki',               '来る'],
    ['paye',               '行く'],
    ['ye',                 '言う・話す'],
    ['oma',                '〜にいる・〜に存在する'],
    /* ── 語彙注記 ────────────────────────────────────────── */
    ['seta',               '犬（北海道・樺太に広く見られるアイヌ犬の名はここから）'],
    ['kim kamuy',          'ヒグマ（直訳：山の神）— アイヌ文化の中心的存在'],
    ['yukar',              '英雄叙事詩・口頭文学（アイヌの口承文芸の中核）'],
    ['inau',               '木を削って作る神への供物・祭具'],
    ['iyomante',           '熊の霊送り儀式（イヨマンテ）'],
    /* ── 語音・正書法のポイント ───────────────────────────── */
    ['語末子音',           'アイヌ語は語末子音を持つ（p, t, k, s, m, n, r など）— 日本語にはない特徴'],
    ['= 記号',             '= は動詞への人称接辞を示す境界（ku=ipe の ku= = 「私が」）'],
    ['- 記号',             '- は接辞境界（e-ipe の e- = 「あなたが」）'],
    ['二重母音',           'ai, aw, uy など — 日本語のローマ字表記と混同しないこと'],
    ['強勢',               'アイヌ語は音調言語ではない — 日本語と同様にトーンで語義を区別しない'],
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

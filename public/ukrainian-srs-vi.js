/* ukrainian-srs-vi.js — SRS flashcard data: Ukrainian / Tiếng Ukraina for Vietnamese speakers
   SM-2 spaced-repetition algorithm. Progress stored in localStorage.
   Card set: 40 words and phrases.
   Front: Ukrainian | Back: Vietnamese meaning + notes
*/
(function () {
  'use strict';

  const PAIR = 'uk-vi';
  const WORDS = [
    ['привіт (pryvit)', 'xin chào — lời chào thân mật'],
    ['дякую (dyakuyu)', 'cảm ơn'],
    ['будь ласка (bud laska)', 'làm ơn / xin'],
    ['так / ні (tak / ni)', 'có / không'],
    ['вибачте (vybachte)', 'xin lỗi'],
    ['вода (voda)', 'nước — gốc Slav, liên quan đến «vodka»'],
    ['хліб (khlib)', 'bánh mì'],
    ['будинок (budynok)', 'toà nhà / căn hộ'],
    ['я (ya)', 'tôi'],
    ['ти (ty)', 'bạn (thân mật)'],
    ['він / вона', 'anh ấy / cô ấy'],
    ['ми (my)', 'chúng tôi'],
    ['іти (ity)', 'đi'],
    ['говорити (hovoryty)', 'nói'],
    ['Я читаю книгу.', 'Tôi đang đọc sách. — trật tự SVO'],
    ['Я не йду.', 'Tôi không đi. — phủ định «не»'],
    ['один, два, три', '1, 2, 3'],
    ['сьогодні / завтра', 'hôm nay / ngày mai'],
    ['зараз (zaraz)', 'bây giờ'],
    ['великий / малий', 'to / nhỏ'],
    ['добрий / поганий', 'tốt / xấu'],
    ['новий / старий', 'mới / cũ'],
    ['червоний / синій', 'đỏ / xanh dương'],
    ['Україна', 'Ukraine'],
    ['Київ (Kyiv)', 'Kyiv — thủ đô, thành lập thế kỷ IX'],
    ['відмінок (vidminok)', '7 cách ngữ — biến cách danh từ'],
    ['Danh cách (Nominative)', 'chủ ngữ'],
    ['Đối cách (Accusative)', 'tân ngữ trực tiếp'],
    ['Sở hữu cách (Genitive)', 'sở hữu / phủ định'],
    ['Tặng cách (Dative)', 'đối tượng gián tiếp'],
    ['Công cụ cách (Instr.)', 'phương tiện'],
    ['Định sở cách (Loc.)', 'vị trí — luôn dùng với giới từ'],
    ['Hô cách (Vocative)', 'gọi thẳng đến người'],
    ['вид (vyd)', 'thể động từ — hoàn thành / chưa hoàn thành'],
    ['борщ (borshch)', 'borscht — súp củ cải đỏ, biểu tượng Ukraine'],
    ['вареники', 'varenyky — bánh bao Ukraine'],
    ['абетка', 'bảng chữ cái Cyrillic — 33 chữ cái'],
    ['українська мова', 'tiếng Ukraina'],
    ['в\'язанка', 'thêu thùa truyền thống Ukraine (vyshyvanka)'],
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
    if (!queue.length) { elCard.style.display = elFlip.style.display = elControls.style.display = 'none'; elDone.style.display = 'block'; elInfo.textContent = 'Xong rồi!'; return; }
    current = queue.shift();
    const [f, b] = WORDS[current];
    elFront.textContent = f; elBack.textContent = b;
    elBack.style.display = 'none'; elFront.style.display = 'block';
    elControls.style.display = 'none'; elFlip.style.display = 'inline-block';
    elCard.style.display = 'block'; elDone.style.display = 'none';
    elInfo.textContent = (queue.length + 1) + ' / ' + getDue(loadState()).length + ' thẻ';
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

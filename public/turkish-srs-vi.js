/* turkish-srs-vi.js — SRS flashcard data: Turkish / Tiếng Thổ Nhĩ Kỳ for Vietnamese speakers
   SM-2 spaced-repetition algorithm. Progress stored in localStorage.
   Card set: 40 words and phrases.
   Front: Turkish | Back: Vietnamese meaning + notes
*/
(function () {
  'use strict';

  const PAIR = 'tr-vi';
  const WORDS = [
    ['merhaba', 'xin chào — lời chào thông thường nhất'],
    ['teşekkür ederim', 'cảm ơn — dạng lịch sự, đầy đủ'],
    ['lütfen', 'làm ơn / xin — thể hiện sự lịch sự'],
    ['evet / hayır', 'có / không'],
    ['özür dilerim', 'xin lỗi — cho lỗi lầm'],
    ['su', 'nước'],
    ['ekmek', 'bánh mì — thực phẩm chính của Thổ Nhĩ Kỳ'],
    ['ev', 'nhà'],
    ['çay', 'trà — trung tâm văn hoá Thổ Nhĩ Kỳ'],
    ['kahve', 'cà phê — từ «café» bắt nguồn từ tiếng Thổ/Ả-rập'],
    ['ben', 'tôi'],
    ['sen', 'bạn (thân mật)'],
    ['siz', 'quý vị (kính ngữ / số nhiều)'],
    ['o', 'anh ấy / cô ấy / nó — chỉ một từ cho cả ba'],
    ['gitmek', 'đi — động từ nguyên thể kết thúc bằng -mek/-mak'],
    ['gelmek', 'đến'],
    ['yemek', 'ăn / bữa ăn — hai nghĩa như «bữa ăn»'],
    ['bilmek', 'biết'],
    ['istemek', 'muốn'],
    ['Ben kitap okuyorum.', 'Tôi đang đọc sách. — trật tự SOV như tiếng Nhật'],
    ['Ben gitmiyorum.', 'Tôi không đi. — phủ định -mi-/-mı-'],
    ['bir, iki, üç', '1, 2, 3'],
    ['bugün / yarın / dün', 'hôm nay / ngày mai / hôm qua'],
    ['şimdi', 'bây giờ'],
    ['büyük / küçük', 'to / nhỏ'],
    ['iyi / kötü', 'tốt / xấu'],
    ['yeni / eski', 'mới / cũ'],
    ['kırmızı / mavi', 'đỏ / xanh dương'],
    ['Türkiye', 'Thổ Nhĩ Kỳ'],
    ['İstanbul', 'Istanbul — cố đô Byzantine và Ottoman'],
    ['inşallah', 'nếu Chúa cho phép — biểu đạt thường dùng hằng ngày'],
    ['ünlü uyumu', 'hoà âm nguyên âm — quy tắc cốt lõi tiếng Thổ'],
    ['eklemeli dil', 'ngôn ngữ chắp dính — như tiếng Nhật, tiếng Phần Lan'],
    ['apartman', 'căn hộ / chung cư — từ mượn gốc Pháp'],
    ['kuaför', 'thợ hớt tóc — từ mượn gốc Pháp «coiffeur»'],
    ['Türkçe', 'tiếng Thổ Nhĩ Kỳ'],
    ['Tiếng Việt', 'tiếng Việt — tên ngôn ngữ của bạn bằng tiếng Thổ'],
    ['ç', 'âm ch — như «chào» nhưng rõ hơn'],
    ['ş', 'âm sh — như «sh» trong tiếng Anh'],
    ['ğ', 'g mềm — kéo dài âm trước nó, hầu như im lặng'],
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

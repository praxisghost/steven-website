/* cantonese-srs-vi.js — SRS flashcard data: Cantonese / Tiếng Quảng Đông for Vietnamese speakers
   SM-2 spaced-repetition algorithm. Progress stored in localStorage.
   Card set: 40 words and phrases.
   Front: Cantonese | Back: Vietnamese meaning + notes
*/
(function () {
  'use strict';

  const PAIR = 'yue-vi';
  const WORDS = [
    ['你好 (nei hou)', 'xin chào'],
    ['唔該 (m goi)', 'cảm ơn / làm ơn — cho dịch vụ'],
    ['多謝 (do je)', 'cảm ơn — cho quà tặng'],
    ['係 / 唔係 (hai / m hai)', 'có / không'],
    ['對唔住 (deoi m jyu)', 'xin lỗi'],
    ['水 (seoi)', 'nước'],
    ['麵包 (min baau)', 'bánh mì'],
    ['屋 (uk)', 'nhà'],
    ['茶 (caa)', 'trà — âm điệu 4 (thấp)'],
    ['咖啡 (gaa fe)', 'cà phê — mượn âm'],
    ['我 (ngo)', 'tôi'],
    ['你 (nei)', 'bạn'],
    ['佢 (keoi)', 'anh ấy / cô ấy — trung lập giới tính'],
    ['我哋 (ngo dei)', 'chúng tôi'],
    ['去 (heoi)', 'đi'],
    ['嚟 (lai)', 'đến'],
    ['食 (sik)', 'ăn'],
    ['識 (sik)', 'biết — đồng âm với «ăn»!'],
    ['想 (soeng)', 'muốn'],
    ['我睇書。(ngo tai syu)', 'Tôi đọc sách. — trật tự SVO'],
    ['我唔去。(ngo m heoi)', 'Tôi không đi. — phủ định 唔'],
    ['一 二 三 (jat ji saam)', '1, 2, 3'],
    ['今日 / 聽日 / 尋日', 'hôm nay / ngày mai / hôm qua'],
    ['而家 (ji gaa)', 'bây giờ'],
    ['大 / 細 (daai / sai)', 'to / nhỏ'],
    ['靚 (leng)', 'đẹp — rất thông dụng'],
    ['Thanh điệu 1 (sing1)', 'cao đều — 55, như «si» trong nhạc'],
    ['Thanh điệu 2 (sing2)', 'lên — 25'],
    ['Thanh điệu 3 (sing3)', 'trung thấp — 33'],
    ['Thanh điệu 4 (sing4)', 'thấp xuống — 21'],
    ['Thanh điệu 5 (sing5)', 'thấp lên — 23'],
    ['Thanh điệu 6 (sing6)', 'thấp đều — 22'],
    ['繁體字', 'chữ phồn thể — dùng ở HK và Macao'],
    ['廣東話 / 粵語', 'tiếng Quảng Đông / ngữ Việt'],
    ['飲茶 (jam caa)', 'yum cha — uống trà, truyền thống dim sum'],
    ['點心 (dim sam)', 'dim sum — nghĩa đen «chạm trái tim»'],
    ['Chợ Lớn', 'khu người Hoa ở TP.HCM — cộng đồng Quảng Đông lớn'],
    ['tiếng Quảng Đông', 'tiếng Việt gọi tiếng Cantonese'],
    ['Jyutping', 'hệ thống phiên âm Jyutping — ký âm La-tinh chính thức'],
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

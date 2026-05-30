/* ainu-srs-ko.js — 아이누어 for Korean speakers
   SM-2 spaced-repetition. Front: Ainu | Back: Korean meaning
*/
(function () {
  'use strict';
  const PAIR = 'ain-ko';
  const WORDS = [
    ['irankarapte',   '안녕하세요 (직역: 당신의 마음을 살며시 만지게 해주세요)'],
    ['iyairaikere',   '감사합니다 (이야이라이케레)'],
    ['pirka',         '아름다운 / 좋은 / 훌륭한'],
    ['pon',           '작은 / 적은'],
    ['poro',          '큰 / 많은'],
    ['ainu',          '사람 / 인간 (아이누어에서 사람을 뜻하는 일반 명사)'],
    ['menoko',        '여성 / 여자'],
    ['okkayo',        '남성 / 남자'],
    ['pon ainu',      '어린이 (직역: 작은 사람)'],
    ['ekasi',         '할아버지 / 노인 / 존경받는 어른'],
    ['wakka',         '물'],
    ['abe',           '불'],
    ['kim',           '산 / 산림 / 고지'],
    ['pet',           '강 (홋카이도 지명에 -pet가 많이 포함됨)'],
    ['mosir',         '대지 / 나라 / 세계 (Ainu mosir = 아이누의 땅)'],
    ['nupuri',        '산 (독립된 봉우리)'],
    ['kamuy',         '신 / 영혼 / 신성한 존재'],
    ['kotan',         '마을 / 정착지 / 고향'],
    ['chise',         '집 / 가정'],
    ['cikap',         '새'],
    ['kimun kamuy',   '곰 (직역: 산의 신)'],
    ['repun kamuy',   '범고래 (직역: 바다의 신)'],
    ['ku',            '나 / 저 (1인칭 대명사)'],
    ['eani',          '너 / 당신 (단수)'],
    ['ipe',           '먹다 / 음식'],
    ['ekari',         '걷다 / 여행하다'],
    ['ye',            '말하다 / 이야기하다'],
    ['arki',          '오다'],
    ['paye',          '가다'],
    ['kor',           '갖다 / 가지다 / 소유하다'],
    ['hunna',         '누구?'],
    ['nep',           '무엇?'],
    ['hemanta',       '어떻게? / 어떤 종류의?'],
    ['hempak',        '몇 개? / 얼마나?'],
    ['pirka no',      '잘 / 제대로 / 진지하게'],
    ['ene … an',      '이렇게 / 이런 방식으로'],
    ['iyoiraykere',   '죄송합니다 / 실례합니다'],
    ['nea',           '저것 / 저기 있는 것'],
    ['toy',           '흙 / 땅'],
    ['maw',           '바람'],
  ];

  (function () {
    const tbody = document.querySelector('.vocab-freq-table tbody');
    if (!tbody) return;
    WORDS.forEach(function (w, i) {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td>' + (i + 1) + '</td><td>' + w[0].replace(/</g,'&lt;') + '</td><td>' + w[1].replace(/</g,'&lt;') + '</td>';
      tbody.appendChild(tr);
    });
  })();

  function loadState() { try { return JSON.parse(localStorage.getItem('srs_' + PAIR)) || {}; } catch (e) { return {}; } }
  function saveState(s) { try { localStorage.setItem('srs_' + PAIR, JSON.stringify(s)); } catch (e) {} }
  function today() { return Math.floor(Date.now() / 86400000); }
  function getDue(state) { const t = today(); return WORDS.filter((_, i) => { const c = state[i]; return !c || c.nextDay <= t; }); }
  function updateCard(state, idx, quality) {
    const c = state[idx] || { ef: 2.5, interval: 1, reps: 0 };
    if (quality < 3) { c.reps = 0; c.interval = 1; }
    else {
      if (c.reps === 0) c.interval = 1;
      else if (c.reps === 1) c.interval = 6;
      else c.interval = Math.round(c.interval * c.ef);
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
    if (!queue.length) { elCard.style.display = elFlip.style.display = elControls.style.display = 'none'; elDone.style.display = 'block'; elInfo.textContent = '오늘 분 완료!'; return; }
    current = queue.shift();
    const [f, b] = WORDS[current];
    elFront.textContent = f; elBack.textContent = b;
    elBack.style.display = 'none'; elFront.style.display = 'block';
    elControls.style.display = 'none'; elFlip.style.display = 'inline-block';
    elCard.style.display = 'block'; elDone.style.display = 'none';
    elInfo.textContent = (queue.length + 1) + ' / ' + getDue(loadState()).length;
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

'use strict';
(() => {
  const data = window.TIMELINE_DATA;
  const context = window.TIMELINE_CONTEXT?.events ?? {};
  const Cal = window.TimelineCalendars;
  const Layout = window.TimelineLayout;
  const $ = id => document.getElementById(id);
  const fold = s => String(s).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
  const label = s => ({lgbtqia: 'LGBTQIA+', 'african-american': 'African American', 'indigenous-colonized': 'Indigenous & colonized', 'middle-east-central-asia': 'Middle East & Central Asia', 'south-se-asia-oceania': 'South & Southeast Asia & Oceania', 'east-asia': 'East Asia'}[s] || s.replaceAll('-', ' ').replace(/^./, x => x.toUpperCase()));
  const byId = new Map(data.events.map(e => [e.id, e]));

  // ---------- Saved settings ----------
  const store = {
    get(key, fallback) { try { const v = localStorage.getItem(`timeline.${key}`); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(`timeline.${key}`, JSON.stringify(value)); } catch { /* private mode: settings last for this visit */ } },
  };
  const settings = {
    calendar: store.get('calendar', 'ad'),
    format: store.get('format', 'mdy'),
    language: store.get('language', 'en'),
    edge: store.get('edge', true),
    customs: store.get('customs', []),
  };
  const sys = () => Cal.system(settings.calendar, settings.customs);

  // ---------- Description languages ----------
  const LANGUAGES = [
    {id: 'en', name: 'English'},
    {id: 'ie', name: 'Occidental'},
    {id: 'eo', name: 'Esperanto'},
    {id: 'isv', name: 'Interslavic'},
    {id: 'zh-yue', name: 'Cantonese 粵語', linkKey: 'yue'},
    {id: 'zh', name: 'Mandarin 中文', variant: 'zh-hans'},
    {id: 'es', name: 'Español'},
    {id: 'fr', name: 'Français'},
    {id: 'ar', name: 'Arabic العربية', rtl: true},
    {id: 'ru', name: 'Russian Русский'},
    {id: 'sw', name: 'Kiswahili'},
  ];
  const WORDS = {
    en: {began: 'How it began', ended: 'How it ended', beganRuler: 'How they came to power', endedRuler: 'How their rule ended', why: 'Why it matters', people: 'Key people', background: 'Background from Wikipedia', sources: 'Sources', read: 'Read more on Wikipedia'},
    ie: {began: 'Qualmen it comensat', ended: 'Qualmen it finit', beganRuler: 'Qualmen ili ganiat li potentie', endedRuler: 'Qualmen lor dominantie finit', why: 'Pro quo it es important', people: 'Important persones', background: 'Fund de Wikipedia', sources: 'Fontes', read: 'Leer in Wikipedia', note: 'Ti-ci controlat description ancor ne es traductet, pro to it apari in anglesi.', none: 'Wikipedia ancor ne have un articul pri to in ti-ci lingue.', wiki: 'Scrit de voluntarios de Wikipedia. Ti-ci projecte ne ha controlat it.', loading: 'Cargante…', failed: 'Li articul ne posset esser cargat.'},
    eo: {began: 'Kiel ĝi komenciĝis', ended: 'Kiel ĝi finiĝis', beganRuler: 'Kiel ri venis al potenco', endedRuler: 'Kiel ria regado finiĝis', why: 'Kial ĝi gravas', people: 'Ĉefaj homoj', background: 'Fono el Vikipedio', sources: 'Fontoj', read: 'Legi en Vikipedio', note: 'Ĉi tiu kontrolita priskribo ankoraŭ ne estas tradukita, do ĝi aperas angle.', none: 'Vikipedio ankoraŭ ne havas artikolon pri tio en ĉi tiu lingvo.', wiki: 'Verkita de volontuloj de Vikipedio. Ĉi tiu projekto ne kontrolis ĝin.', loading: 'Ŝargante…', failed: 'Ne eblis ŝargi la artikolon.'},
    isv: {began: 'Kako se jest načelo', ended: 'Kako se jest skončilo', beganRuler: 'Kako prišli do vlasti', endedRuler: 'Kako se jest skončilo vladanje', why: 'Čemu jest važno', people: 'Glavne osoby', background: 'Kontekst iz Vikipedije', sources: 'Izvory', read: 'Čitati na Vikipediji', note: 'Toj prověrjeny opis ješče ne jest prěvedeny, zato jest pokazany po-anglijsky.', none: 'Vikipedija ješče ne imaje članka o tom na medžuslovjanskom.', wiki: 'Napisano dobrovoljnikami Vikipedije. Toj projekt ne jest to prověril.', loading: 'Nagružanje…', failed: 'Članok ne bylo možno nagruziti.'},
    'zh-yue': {began: '點樣開始', ended: '點樣結束', beganRuler: '點樣掌權', endedRuler: '點樣結束統治', why: '點解重要', people: '關鍵人物', background: '維基百科背景', sources: '來源', read: '喺維基百科睇', note: '呢段經過核實嘅描述仲未翻譯，所以用英文顯示。', none: '維基百科暫時未有呢個語言嘅相關文章。', wiki: '由維基百科義工撰寫，本項目未有核實。', loading: '載入緊…', failed: '載入唔到文章。'},
    zh: {began: '如何开始', ended: '如何结束', beganRuler: '如何掌权', endedRuler: '统治如何结束', why: '为何重要', people: '关键人物', background: '维基百科背景', sources: '来源', read: '在维基百科阅读', note: '这段经过核实的描述尚未翻译，因此以英文显示。', none: '维基百科暂无该语言的相关文章。', wiki: '由维基百科志愿者撰写，本项目未核实。', loading: '正在加载…', failed: '无法加载文章。'},
    es: {began: 'Cómo empezó', ended: 'Cómo terminó', beganRuler: 'Cómo llegó al poder', endedRuler: 'Cómo terminó su gobierno', why: 'Por qué importa', people: 'Personas clave', background: 'Contexto de Wikipedia', sources: 'Fuentes', read: 'Leer en Wikipedia', note: 'Esta descripción verificada aún no está traducida, por lo que aparece en inglés.', none: 'Wikipedia todavía no tiene un artículo sobre esto en este idioma.', wiki: 'Escrito por voluntarios de Wikipedia. Este proyecto no lo ha verificado.', loading: 'Cargando…', failed: 'No se pudo cargar el artículo.'},
    fr: {began: 'Comment cela a commencé', ended: 'Comment cela a pris fin', beganRuler: 'Son arrivée au pouvoir', endedRuler: 'La fin de son règne', why: 'Pourquoi c’est important', people: 'Personnes clés', background: 'Contexte tiré de Wikipédia', sources: 'Sources', read: 'Lire sur Wikipédia', note: 'Cette description vérifiée n’est pas encore traduite ; elle apparaît donc en anglais.', none: 'Wikipédia n’a pas encore d’article sur ce sujet dans cette langue.', wiki: 'Rédigé par des bénévoles de Wikipédia. Ce projet ne l’a pas vérifié.', loading: 'Chargement…', failed: 'Impossible de charger l’article.'},
    ar: {began: 'كيف بدأ', ended: 'كيف انتهى', beganRuler: 'كيف وصل إلى السلطة', endedRuler: 'كيف انتهى حكمه', why: 'لماذا هو مهم', people: 'شخصيات رئيسية', background: 'خلفية من ويكيبيديا', sources: 'المصادر', read: 'اقرأ في ويكيبيديا', note: 'لم يُترجم هذا الوصف المدقق بعد، لذا يظهر بالإنجليزية.', none: 'لا تتوفر بعد مقالة عن هذا الموضوع في ويكيبيديا بهذه اللغة.', wiki: 'كتبه متطوعو ويكيبيديا، ولم يدققه هذا المشروع.', loading: 'جارٍ التحميل…', failed: 'تعذر تحميل المقالة.'},
    ru: {began: 'Как это началось', ended: 'Как это закончилось', beganRuler: 'Как пришёл к власти', endedRuler: 'Как закончилось правление', why: 'Почему это важно', people: 'Ключевые люди', background: 'Справка из Википедии', sources: 'Источники', read: 'Читать в Википедии', note: 'Это проверенное описание ещё не переведено, поэтому показано на английском.', none: 'В Википедии пока нет статьи об этом на этом языке.', wiki: 'Написано волонтёрами Википедии. Этот проект её не проверял.', loading: 'Загрузка…', failed: 'Не удалось загрузить статью.'},
    sw: {began: 'Jinsi lilivyoanza', ended: 'Jinsi lilivyoisha', beganRuler: 'Jinsi alivyoingia madarakani', endedRuler: 'Jinsi utawala wake ulivyoisha', why: 'Kwa nini ni muhimu', people: 'Watu muhimu', background: 'Maelezo kutoka Wikipedia', sources: 'Vyanzo', read: 'Soma kwenye Wikipedia', note: 'Maelezo haya yaliyokaguliwa bado hayajatafsiriwa, kwa hivyo yanaonyeshwa kwa Kiingereza.', none: 'Wikipedia bado haina makala kuhusu hili kwa lugha hii.', wiki: 'Imeandikwa na wajitolea wa Wikipedia. Mradi huu haujaikagua.', loading: 'Inapakia…', failed: 'Imeshindwa kupakia makala.'},
  };

  const AI_NOTE = {"ie": "Traductet per AI e ancor ne revidet de un parlante.", "eo": "Tradukita de AI kaj ankoraŭ ne kontrolita de parolanto.", "isv": "Prěvedeno umětnym intelektom, ješče ne prověreno govoriteljem.", "zh-yue": "由 AI 翻譯，仲未經語言使用者審閱。", "zh": "由 AI 翻译，尚未经母语者审阅。", "es": "Traducido por IA; aún sin revisar por un hablante.", "fr": "Traduit par IA ; pas encore relu par un locuteur.", "ar": "ترجمة بالذكاء الاصطناعي، ولم يراجعها متحدث باللغة بعد.", "ru": "Переведено ИИ; носитель языка ещё не проверял.", "sw": "Imetafsiriwa na AI na bado haijakaguliwa na mzungumzaji."};

  // Each language's translated event text loads the first time it is chosen.
  const translationState = new Map();
  const loadTranslation = lang => {
    if (translationState.has(lang)) return;
    translationState.set(lang, 'loading');
    const script = document.createElement('script');
    script.src = `dist/translations/${lang}.js`;
    script.onload = () => { translationState.set(lang, 'ready'); renderPanel(); };
    script.onerror = () => { translationState.set(lang, 'none'); renderPanel(); };
    document.head.append(script);
  };

  // ---------- Page state and hash ----------
  const blank = () => ({topic: '', region: '', lens: [], highlights: false, q: '', event: ''});
  const readHash = () => {
    const h = new URLSearchParams(location.hash.slice(1));
    return {topic: h.get('topic') || '', region: h.get('region') || '', lens: (h.get('lens') || '').split(',').filter(Boolean), highlights: h.get('highlights') === '1', q: h.get('q') || '', event: h.get('event') || ''};
  };
  let state = readHash();
  let lastHash = location.hash;
  const writeHash = () => {
    const h = new URLSearchParams();
    if (state.topic) h.set('topic', state.topic);
    if (state.region) h.set('region', state.region);
    if (state.lens.length) h.set('lens', state.lens.join(','));
    if (state.highlights) h.set('highlights', '1');
    if (state.q) h.set('q', state.q);
    if (state.event) h.set('event', state.event);
    const next = h.size ? `#${h}` : location.pathname + location.search;
    if ((h.size ? `#${h}` : '') !== location.hash) history.pushState(null, '', next);
    lastHash = location.hash;
  };

  // ---------- Elements ----------
  const scroller = $('scroller');
  const world = $('world');
  const stage = $('stage');
  const rail = $('rail');
  const status = $('status');
  let layout = null;
  let current = [];
  let listing = false;
  let nodes = new Map();
  let tickLayer = null;

  const filtered = () => {
    const q = fold(state.q);
    return data.events.filter(e =>
      (!state.highlights || e.importance === 3) &&
      (!state.topic || e.topics.includes(state.topic)) &&
      (!state.region || e.regions.includes(state.region)) &&
      (!state.lens.length || state.lens.some(l => e.lenses?.includes(l))) &&
      (!q || fold([e.title, e.summary, ...(e.people || []), ...(e.aliases || [])].join(' ')).includes(q)));
  };

  const thumb = (url, width) => url.replace(/\/960px-/, `/${width}px-`);

  // ---------- Image loading: limited at once, so fast scrolling does not flood Wikimedia ----------
  const imageQueue = [];
  let imagesLoading = 0;
  const pumpImages = () => {
    while (imagesLoading < 6 && imageQueue.length) {
      const job = imageQueue.pop();
      if (!job.img.isConnected) continue;
      imagesLoading++;
      const done = () => { imagesLoading--; pumpImages(); };
      job.img.addEventListener('load', done, {once: true});
      job.img.addEventListener('error', () => {
        done();
        if (job.img.dataset.full && job.img.src !== job.img.dataset.full) {
          job.img.src = job.img.dataset.full;
        } else {
          job.img.parentElement?.remove();
        }
      }, {once: true});
      job.img.src = job.src;
    }
  };

  // ---------- Drawing ----------
  const makeCard = item => {
    const e = item.event;
    const on = e.id === state.event;
    const s = layout.scale;
    const card = document.createElement('button');
    const media = e.slide?.media;
    card.type = 'button';
    const big = item.tier === 'large' || item.tier === 'textLarge';
    card.className = `ev${big ? ' large' : ''}${on ? ' on' : ''}`;
    card.dataset.id = e.id;
    const top = item.side === 'up' ? layout.axisY - item.distance - item.height : layout.axisY + item.distance;
    card.style.cssText = `left:${item.left}px;top:${top}px;width:${item.width}px;height:${item.height}px;--t:${Math.max(11, (big ? 15 : 12.5) * s)}px;--d:${Math.max(10, 10.5 * s)}px;--c:${big || s >= 0.9 ? 3 : 2}`;
    const dateText = Cal.dateRange(e, sys(), 'year');
    card.setAttribute('aria-label', `${e.title}, ${dateText}`);
    card.title = `${e.title} · ${dateText}`;
    const text = document.createElement('span');
    text.className = 'ev-label';
    const title = document.createElement('span');
    title.className = 'ev-title';
    if (e.discovery) {
      const mark = document.createElement('span');
      mark.className = 'ev-mark';
      mark.textContent = '◆ ';
      title.append(mark);
    }
    title.append(e.title);
    const date = document.createElement('span');
    date.className = 'ev-date';
    date.textContent = dateText;
    text.append(title, date);
    card.append(text);
    if (media) {
      const frame = document.createElement('span');
      frame.className = 'ev-image';
      const img = document.createElement('img');
      img.alt = '';
      img.draggable = false;
      img.dataset.full = media.url;
      frame.append(img);
      card.append(frame);
      imageQueue.push({img, src: thumb(media.url, big ? 500 : 330)});
    }
    const line = document.createElement('div');
    line.className = `line${on ? ' on' : ''}`;
    line.dataset.id = e.id;
    const y1 = item.side === 'up' ? layout.axisY - item.distance : layout.axisY;
    line.style.cssText = `left:${item.x}px;top:${y1}px;height:${item.distance}px`;
    const dot = document.createElement('div');
    dot.className = `dot${e.importance === 3 ? ' big' : ''}${on ? ' on' : ''}`;
    dot.dataset.id = e.id;
    dot.style.cssText = `left:${item.x}px;top:${layout.axisY}px`;
    const heat = hot => { line.classList.toggle('hot', hot); dot.classList.toggle('hot', hot); };
    card.addEventListener('pointerenter', () => heat(true));
    card.addEventListener('pointerleave', () => heat(false));
    return [card, line, dot];
  };

  const drawVisible = () => {
    if (!layout) return;
    const left = scroller.scrollLeft - 500;
    const right = scroller.scrollLeft + scroller.clientWidth + 500;
    const seen = new Set();
    const items = layout.items;
    let low = 0;
    let high = items.length;
    while (low < high) {
      const mid = (low + high) >> 1;
      if (items[mid].x + 300 < left) low = mid + 1; else high = mid;
    }
    const fresh = document.createDocumentFragment();
    for (let i = low; i < items.length && items[i].left <= right; i++) {
      const id = items[i].event.id;
      seen.add(id);
      if (!nodes.has(id)) {
        const parts = makeCard(items[i]);
        nodes.set(id, parts);
        fresh.append(...parts);
      }
    }
    world.append(fresh);
    for (const [id, parts] of nodes) {
      if (!seen.has(id) && !parts[0].contains(document.activeElement)) {
        parts.forEach(part => part.remove());
        nodes.delete(id);
      }
    }
    pumpImages();
  };

  const drawAxis = () => {
    tickLayer?.remove();
    tickLayer = document.createElement('div');
    const add = (className, css, text) => {
      const el = document.createElement('div');
      el.className = className;
      el.style.cssText = css;
      if (text) el.textContent = text;
      tickLayer.append(el);
      return el;
    };
    const y = layout.axisY;
    const s = layout.scale;
    const spans = eraSpans();
    spans.forEach((era, index) => add(`band${index % 2 ? ' alt' : ''}`, `left:${era.left}px;width:${era.right - era.left}px`));
    const axis = add('', `left:0;top:${y}px;width:${layout.width}px`);
    axis.id = 'axis';
    for (const t of layout.ticks) {
      add(`tick${t.major ? ' major' : ''}`, `left:${t.x}px;top:${y}px`);
      add(`tick-label${t.major ? ' major' : ''}`, `left:${t.x}px;top:${y + 9 * s}px;font-size:${11 * s}px`, Cal.yearLabel(t.y, sys()));
    }
    const firstYear = layout.items[0]?.year ?? 1;
    const lastYear = layout.items.at(-1)?.year ?? 1;
    if (firstYear < 1 && lastYear >= 1) {
      const boundary = add('', `left:${layout.boundaryX}px;top:${y - 16}px;height:32px`);
      boundary.id = 'boundary';
      const text = add('boundary-label', `left:${layout.boundaryX}px;top:${y + 9 * s}px;font-size:${12 * s}px`, `${Cal.yearLabel(-1, sys())} | ${Cal.yearLabel(1, sys())}`);
      text.id = 'boundary-label';
    }
    const today = add('', `left:${layout.endX}px;top:${y - 16}px;height:32px`);
    today.id = 'today';
    const todayLabel = add('', `right:${layout.width - layout.endX - 4}px;top:${y + 9 * s}px;font-size:${12 * s}px`, `Current day (${Cal.yearLabel(Layout.CURRENT_YEAR, sys())})`);
    todayLabel.id = 'today-label';
    world.prepend(tickLayer);
  };

  // Each era's stretch of the axis, used for background bands and the navigator.
  function eraSpans() {
    const eras = data.taxonomy.eras;
    return eras.map((era, index) => ({
      era,
      left: index === 0 ? 0 : layout.xOfYear(Cal.toAstro(era.start)),
      right: index === eras.length - 1 ? layout.width : layout.xOfYear(Cal.toAstro(eras[index + 1].start)),
    }));
  }
  const eraAt = year => {
    let found = null;
    for (const era of data.taxonomy.eras) if (Cal.toAstro(era.start) <= year) found = era;
    return found;
  };

  const clearCards = () => {
    for (const parts of nodes.values()) parts.forEach(part => part.remove());
    nodes = new Map();
    imageQueue.length = 0;
  };

  const centreYear = () => (layout ? layout.yearOfX(scroller.scrollLeft + scroller.clientWidth / 2) : null);
  const goToYear = (year, smooth) => goToX(layout.xOfYear(year), smooth);
  const goToX = (x, smooth) => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    scroller.scrollTo({left: x - scroller.clientWidth / 2, behavior: smooth && !reduced ? 'smooth' : 'auto'});
  };

  const syncChrome = () => {
    const max = scroller.scrollWidth - scroller.clientWidth;
    if (document.activeElement !== rail || !railHeld) rail.value = String(max > 0 ? Math.round(scroller.scrollLeft / max * 1000) : 0);
    const year = centreYear();
    const count = current.length.toLocaleString('en-US');
    const shown = current.length === data.events.length ? `${count} events` : `${count} of ${data.events.length.toLocaleString('en-US')} events`;
    status.replaceChildren(shown);
    rail.style.setProperty('--thumb', `${Math.max(28, scroller.clientWidth / Math.max(1, scroller.scrollWidth) * rail.clientWidth)}px`);
    if (year !== null && current.length && !listing) {
      const y = Cal.fromAstro(Math.floor(Math.min(year, Layout.CURRENT_YEAR)));
      const era = eraAt(year);
      const when = document.createElement('b');
      when.textContent = Cal.yearLabel(y === 0 ? 1 : y, sys());
      status.append(' · ', when);
      document.querySelectorAll('#eras [data-era]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.era === era?.id)));
    }
  };

  let scrollFrame = 0;
  scroller.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      drawVisible();
      syncChrome();
    });
  }, {passive: true});

  const rebuild = ({keepYear = null, toEvent = '', initial = false} = {}) => {
    current = filtered();
    clearCards();
    syncMenu();
    const empty = !current.length;
    $('empty').hidden = !empty;
    $('list-view').hidden = !listing || empty;
    const height = scroller.clientHeight;
    layout = Layout.compute(current, {stageHeight: height, reserveBottom: rail.offsetHeight + 4});
    world.style.width = `${layout.width}px`;
    drawAxis();
    const target = toEvent ? layout.items.find(i => i.event.id === toEvent) : null;
    if (target) goToX(target.x + target.width / 3);
    else if (initial) goToYear(1);
    else if (keepYear !== null) goToYear(keepYear);
    else scroller.scrollLeft = scroller.scrollLeft;
    if (listing) renderList();
    drawVisible();
    syncChrome();
    window.TIMELINE_VIEW = {ready: true, count: current.length, ids: current.map(e => e.id), layout, rendered: () => nodes.size};
  };

  // ---------- List view ----------
  function renderList() {
    const table = document.createElement('table');
    table.innerHTML = '<thead><tr><th>Date</th><th>Event</th><th>Perspectives</th></tr></thead>';
    const body = document.createElement('tbody');
    for (const e of current) {
      const row = document.createElement('tr');
      const date = document.createElement('td');
      date.textContent = Cal.dateRange(e, sys(), settings.format);
      const name = document.createElement('td');
      const button = document.createElement('button');
      button.textContent = e.title;
      button.onclick = () => select(e.id);
      name.append(button);
      const lens = document.createElement('td');
      lens.textContent = (e.lenses || []).map(label).join(', ');
      row.append(date, name, lens);
      body.append(row);
    }
    table.append(body);
    $('list-view').replaceChildren(table);
  }

  // ---------- Description panel ----------
  const decode = html => new DOMParser().parseFromString(html, 'text/html').body;
  const extractCache = new Map();
  let panelToken = 0;

  const block = (tag, text, attrs = {}) => {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    Object.assign(el, attrs);
    return el;
  };
  const link = (href, text) => {
    const a = block('a', text);
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    return a;
  };
  const wikiUrl = (host, title) => `https://${host}.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(' ', '_'))}`;

  const renderFigure = e => {
    const figure = $('figure');
    const media = e.slide?.media;
    figure.hidden = !media;
    if (!media) return figure.replaceChildren();
    const img = document.createElement('img');
    img.src = media.url;
    img.alt = media.alt || '';
    const cap = document.createElement('figcaption');
    if (media.caption) cap.append(block('span', decode(media.caption).textContent));
    const credit = decode(media.credit || '');
    const licence = credit.querySelector('a');
    const line = document.createElement('span');
    const creditText = credit.textContent.replace(/,?\s*via Wikimedia Commons\s*$/, '');
    if (licence) {
      line.append(creditText.replace(licence.textContent, '').replace(/,\s*$/, '').trim(), creditText.trim() === licence.textContent ? '' : ', ', link(licence.href, licence.textContent));
    } else {
      line.append(creditText);
    }
    cap.append(line);
    if (media.link) cap.append(link(media.link, 'Image page on Wikimedia Commons'));
    figure.replaceChildren(img, cap);
  };

  const renderForeignLead = async (e, language, holder, token) => {
    const words = WORDS[language.id];
    const info = context[e.id];
    const title = info?.links?.[language.linkKey || language.id];
    const attrs = {lang: language.id, dir: language.rtl ? 'rtl' : 'auto'};
    holder.replaceChildren(block('h3', words.background, attrs));
    if (!title) {
      holder.append(block('p', words.none, attrs));
      return;
    }
    const loading = block('p', words.loading, attrs);
    holder.append(loading);
    const key = `${language.id}:${title}`;
    try {
      if (!extractCache.has(key)) {
        const params = new URLSearchParams({action: 'query', format: 'json', formatversion: '2', origin: '*', prop: 'extracts', exintro: '1', explaintext: '1', redirects: '1', titles: title});
        if (language.variant) params.set('variant', language.variant);
        const response = await fetch(`https://${language.id}.wikipedia.org/w/api.php?${params}`);
        if (!response.ok) throw new Error(String(response.status));
        const json = await response.json();
        extractCache.set(key, json.query?.pages?.[0]?.extract || '');
      }
      if (token !== panelToken) return;
      const text = extractCache.get(key);
      loading.remove();
      if (text) for (const part of text.split(/\n+/).filter(Boolean)) holder.append(block('p', part, attrs));
      else holder.append(block('p', words.none, attrs));
      holder.append(block('p', words.wiki, {...attrs, className: 'note'}));
    } catch {
      if (token !== panelToken) return;
      loading.textContent = words.failed;
    }
    const out = block('p', '', attrs);
    out.append(link(wikiUrl(language.id, title), words.read));
    holder.append(out);
  };

  const renderPanel = () => {
    const token = ++panelToken;
    const e = byId.get(state.event);
    $('panel-body').hidden = !e;
    $('peek-hint').hidden = !e;
    if (!e) {
      $('figure').hidden = true;
      $('panel-inner').classList.add('solo');
      $('peek-date').textContent = '';
      $('peek-title').textContent = 'A world of connected histories';
      $('peek-summary').textContent = matchMedia('(pointer: coarse)').matches
        ? 'Swipe left or right to travel through time, and tap any event to read about it.'
        : 'Explore the people, ideas and turning points that shaped our world. Move the mouse to the left or right edge of the screen to travel through time, then click any event to read about it.';
      return;
    }
    const language = LANGUAGES.find(l => l.id === settings.language) || LANGUAGES[0];
    if (language.id !== 'en') loadTranslation(language.id);
    const translated = language.id === 'en' ? null : window.TIMELINE_TRANSLATIONS?.[language.id]?.[e.id] ?? null;
    const textAttrs = translated ? {lang: language.id, dir: language.rtl ? 'rtl' : 'auto'} : {lang: 'en', dir: 'ltr'};
    const system = sys();
    Object.assign($('peek-title'), textAttrs);
    Object.assign($('peek-summary'), textAttrs);
    $('peek-title').textContent = translated?.title ?? e.title;
    const main = Cal.dateRange(e, system, settings.format);
    const recorded = system.gregorian ? '' : ` · recorded as ${Cal.dateRange(e, Cal.system('ad'), settings.format)}`;
    $('peek-date').textContent = main + recorded;
    $('peek-summary').textContent = translated?.summary ?? e.summary;
    renderFigure(e);
    $('panel-inner').classList.toggle('solo', !e.slide?.media);

    const words = {...WORDS.en, ...WORDS[language.id]};
    const headingAttrs = {lang: language.id, dir: language.rtl ? 'rtl' : 'auto'};
    const article = $('article');
    article.replaceChildren();

    if (language.id !== 'en') article.append(block('p', translated ? AI_NOTE[language.id] : words.note, {...headingAttrs, className: 'note'}));
    const ruler = e.kind === 'ruler';
    const section = (heading, text) => {
      if (!text) return;
      const p = document.createElement('p');
      Object.assign(p, translated ? textAttrs : {});
      p.append(block('strong', `${heading}:`, headingAttrs), ` ${text}`);
      article.append(p);
    };
    section(ruler ? words.beganRuler : words.began, translated?.began ?? e.began);
    section(ruler ? words.endedRuler : words.ended, translated?.ended ?? e.ended);
    section(words.why, translated?.why ?? e.why);
    if (e.people?.length) section(words.people, e.people.join(', '));
    if (e.date_note) article.append(block('p', translated?.date_note ?? e.date_note, translated?.date_note ? textAttrs : {}));

    const tags = document.createElement('ul');
    tags.className = 'tags';
    if (e.discovery) tags.append(block('li', '◆ Landmark discovery', {className: 'tag mark'}));
    for (const l of e.lenses || []) tags.append(block('li', label(l), {className: 'tag'}));
    for (const r of e.regions || []) tags.append(block('li', label(r), {className: 'tag'}));
    article.append(tags);
    const more = document.createElement('p');
    more.append(link(wikiUrl('en', e.wiki), WORDS.en.read));
    article.append(more);

    const switcher = document.createElement('div');
    switcher.id = 'languages';
    switcher.append(block('p', 'Description language'));
    const row = document.createElement('div');
    row.className = 'lang-row';
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', 'Description language');
    for (const l of LANGUAGES) {
      const b = block('button', l.name, {type: 'button'});
      b.setAttribute('aria-pressed', String(l.id === language.id));
      b.onclick = () => {
        settings.language = l.id;
        store.set('language', l.id);
        renderPanel();
      };
      row.append(b);
    }
    switcher.append(row);
    article.append(switcher);

    const info = context[e.id];
    const lead = document.createElement('section');
    article.append(lead);
    if (language.id === 'en') {
      if (info?.lead) {
        lead.append(block('h3', words.background));
        for (const part of info.lead.split(/\n+/).filter(Boolean)) lead.append(block('p', part));
      }
    } else {
      renderForeignLead(e, language, lead, token);
    }

    const sources = document.createElement('section');
    sources.className = 'sources';
    sources.append(block('h3', words.sources, headingAttrs));
    const source = block('p', '', {className: 'small'});
    source.append(link(wikiUrl('en', e.wiki), `Wikipedia: ${e.wiki}`));
    if (info?.lead) source.append('. The background text is from Wikipedia, licensed CC BY-SA 4.0.');
    sources.append(source);
    article.append(sources);
  };

  const applySelection = () => {
    for (const [id, parts] of nodes) {
      const on = id === state.event;
      parts.forEach(part => part.classList.toggle('on', on));
    }
  };

  function select(id) {
    state.event = id;
    writeHash();
    applySelection();
    renderPanel();
  }

  // ---------- Edge scrolling: only in the first and last 10% of the screen ----------
  const EDGE_FRACTION = 0.1;
  const EDGE_SLOW = 140;
  const EDGE_FAST = 2100;
  let pointer = null;
  let pressed = false;
  let edgeFrame = 0;
  let edgeTime = 0;
  let edgeCarry = 0;

  const edgeSpeed = () => {
    if (!settings.edge || !pointer || pressed || listing || !current.length) return 0;
    if ($('calendar-dialog').open || $('menu').classList.contains('open')) return 0;
    const box = stage.getBoundingClientRect();
    if (pointer.y < box.top || pointer.y > box.bottom - rail.offsetHeight) return 0;
    const width = document.documentElement.clientWidth;
    const zone = width * EDGE_FRACTION;
    const ramp = depth => EDGE_SLOW + (EDGE_FAST - EDGE_SLOW) * depth * depth;
    if (pointer.x < zone) return -ramp((zone - pointer.x) / zone);
    if (pointer.x > width - zone) return ramp((pointer.x - (width - zone)) / zone);
    return 0;
  };
  const showEdges = speed => {
    const max = scroller.scrollWidth - scroller.clientWidth;
    $('edge-left').classList.toggle('on', speed < 0 && scroller.scrollLeft > 0);
    $('edge-right').classList.toggle('on', speed > 0 && scroller.scrollLeft < max - 1);
  };
  const edgeTick = now => {
    const speed = edgeSpeed();
    showEdges(speed);
    if (!speed) {
      edgeFrame = 0;
      edgeCarry = 0;
      return;
    }
    const elapsed = edgeTime ? Math.min(50, now - edgeTime) : 16;
    edgeTime = now;
    edgeCarry += speed * elapsed / 1000;
    const whole = Math.trunc(edgeCarry);
    if (whole) {
      scroller.scrollLeft += whole;
      edgeCarry -= whole;
    }
    edgeFrame = requestAnimationFrame(edgeTick);
  };
  const wakeEdge = () => {
    if (!edgeFrame && edgeSpeed()) {
      edgeTime = 0;
      edgeFrame = requestAnimationFrame(edgeTick);
    } else if (!edgeFrame) {
      showEdges(0);
    }
  };
  window.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    pointer = {x: e.clientX, y: e.clientY};
    wakeEdge();
  }, {passive: true});
  document.documentElement.addEventListener('mouseleave', () => { pointer = null; });
  window.addEventListener('blur', () => { pointer = null; });

  // ---------- Drag, keyboard and rail ----------
  let drag = null;
  let suppressClick = false;
  scroller.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    pressed = true;
    drag = {x: e.clientX, left: scroller.scrollLeft, moved: false};
  });
  window.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 4) {
      drag.moved = true;
      scroller.classList.add('dragging');
    }
    if (drag.moved) scroller.scrollLeft = drag.left - dx;
  });
  window.addEventListener('pointerup', () => {
    pressed = false;
    if (drag?.moved) suppressClick = true;
    drag = null;
    scroller.classList.remove('dragging');
    wakeEdge();
  });
  scroller.addEventListener('click', e => {
    if (suppressClick) {
      suppressClick = false;
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const card = e.target.closest('.ev');
    if (card) select(card.dataset.id);
  }, true);

  window.addEventListener('keydown', e => {
    if (e.target.closest?.('input, select, textarea, dialog') || e.altKey || e.ctrlKey || e.metaKey) return;
    if (listing) return;
    const page = scroller.clientWidth * 0.8;
    const moves = {ArrowLeft: -340, ArrowRight: 340, PageUp: -page};
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') scroller.scrollBy({left: moves[e.key]});
    else if (e.key === 'Home') scroller.scrollLeft = 0;
    else if (e.key === 'End') scroller.scrollLeft = scroller.scrollWidth;
    else return;
    e.preventDefault();
  });

  let railHeld = false;
  rail.addEventListener('pointerdown', () => { railHeld = true; });
  window.addEventListener('pointerup', () => { railHeld = false; });
  rail.addEventListener('input', () => {
    scroller.scrollLeft = Number(rail.value) / 1000 * (scroller.scrollWidth - scroller.clientWidth);
  });

  // ---------- Menu ----------
  function syncMenu() {
    if ($('menu').classList.contains('open')) return;
    document.documentElement.style.setProperty('--menu', `${$('menu').offsetHeight}px`);
  }

  const fillSelect = (select, options) => {
    for (const [value, text] of options) select.append(new Option(text, value));
  };
  fillSelect($('topic'), data.taxonomy.topics.map(t => [t.id, t.label || label(t.id)]));
  fillSelect($('region'), [...new Set(data.events.flatMap(e => e.regions))].sort().map(r => [r, label(r)]));
  fillSelect($('format'), Cal.FORMATS.map(f => [f.id, f.label]));
  const eraButtons = document.createDocumentFragment();
  for (const era of data.taxonomy.eras) {
    const b = block('button', era.label, {type: 'button'});
    b.dataset.era = era.id;
    b.setAttribute('aria-pressed', 'false');
    b.onclick = () => goToYear(Cal.toAstro(era.start) + 1, true);
    eraButtons.append(b);
  }
  $('eras').append(eraButtons);
  for (const lens of data.taxonomy.lenses) {
    const b = block('button', lens.label || label(lens.id), {type: 'button'});
    b.dataset.lens = lens.id;
    b.onclick = () => {
      state.lens = state.lens.includes(lens.id) ? state.lens.filter(x => x !== lens.id) : [...state.lens, lens.id];
      filterChanged();
    };
    $('lenses').append(b);
  }

  const fillCalendars = () => {
    const select = $('calendar');
    select.replaceChildren();
    fillSelect(select, Cal.SYSTEMS.map(s => [s.id, s.label]));
    fillSelect(select, settings.customs.map(c => [c.id, Cal.customSystem(c).label]));
    select.append(new Option('Custom calendars…', '__custom'));
    select.value = sys().id;
  };

  const syncControls = () => {
    $('topic').value = state.topic;
    $('region').value = state.region;
    $('search').value = state.q;
    $('highlights').setAttribute('aria-pressed', String(state.highlights));
    document.querySelectorAll('[data-lens]').forEach(b => b.setAttribute('aria-pressed', String(state.lens.includes(b.dataset.lens))));
    $('list').setAttribute('aria-pressed', String(listing));
    $('edge-scroll').setAttribute('aria-pressed', String(settings.edge));
    $('format').value = settings.format;
    $('pending').hidden = data.reservedPresent;
  };

  function filterChanged() {
    const year = centreYear();
    state.event = state.event && filtered().some(e => e.id === state.event) ? state.event : '';
    writeHash();
    syncControls();
    rebuild({keepYear: year});
    renderPanel();
  }

  $('topic').onchange = e => { state.topic = e.target.value; filterChanged(); };
  $('region').onchange = e => { state.region = e.target.value; filterChanged(); };
  $('highlights').onclick = () => { state.highlights = !state.highlights; filterChanged(); };
  let debounce;
  $('search').oninput = e => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { state.q = e.target.value; filterChanged(); }, 180);
  };
  const clearAll = () => {
    clearTimeout(debounce);
    state = blank();
    writeHash();
    syncControls();
    rebuild({keepYear: 1});
    renderPanel();
  };
  $('clear').onclick = clearAll;
  $('empty-clear').onclick = clearAll;
  $('list').onclick = () => {
    listing = !listing;
    syncControls();
    $('list-view').hidden = !listing;
    if (listing) renderList();
    syncChrome();
  };
  $('edge-scroll').onclick = () => {
    settings.edge = !settings.edge;
    store.set('edge', settings.edge);
    syncControls();
    wakeEdge();
  };
  $('menu-toggle').onclick = () => {
    const open = $('menu').classList.toggle('open');
    $('menu-toggle').setAttribute('aria-expanded', String(open));
    if (!open) syncMenu();
  };

  const redrawDates = () => {
    clearCards();
    drawAxis();
    drawVisible();
    syncChrome();
    if (listing) renderList();
    renderPanel();
  };
  $('format').onchange = e => {
    settings.format = e.target.value;
    store.set('format', settings.format);
    redrawDates();
  };
  $('calendar').onchange = e => {
    if (e.target.value === '__custom') {
      e.target.value = sys().id;
      showCalendarDialog();
      return;
    }
    settings.calendar = e.target.value;
    store.set('calendar', settings.calendar);
    redrawDates();
  };

  // ---------- Custom calendars ----------
  const renderCustomList = () => {
    const list = $('cal-list');
    list.replaceChildren();
    for (const c of settings.customs) {
      const row = document.createElement('li');
      row.append(block('span', `${c.name} (${c.suffix}), year 1 = ${Math.abs(c.epoch)} ${c.epoch < 0 ? 'BC' : 'AD'}`));
      const remove = block('button', 'Remove', {type: 'button'});
      remove.onclick = () => {
        settings.customs = settings.customs.filter(x => x.id !== c.id);
        store.set('customs', settings.customs);
        if (settings.calendar === c.id) {
          settings.calendar = 'ad';
          store.set('calendar', 'ad');
        }
        fillCalendars();
        renderCustomList();
        redrawDates();
      };
      row.append(remove);
      list.append(row);
    }
  };
  const showCalendarDialog = () => {
    $('error').hidden = true;
    renderCustomList();
    $('calendar-dialog').showModal();
  };
  $('cal-close').onclick = () => $('calendar-dialog').close();
  $('calendar-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('cal-name').value.trim();
    const suffix = $('cal-suffix').value.trim();
    const year = Number($('cal-year').value);
    if (!name || !suffix || !Number.isInteger(year) || year < 1) {
      $('error').textContent = 'Enter a name, an abbreviation and a whole year of 1 or later.';
      $('error').hidden = false;
      return;
    }
    const custom = {id: `custom-${Date.now()}`, name, suffix, epoch: $('cal-era').value === 'bc' ? -year : year};
    settings.customs = [...settings.customs, custom];
    settings.calendar = custom.id;
    store.set('customs', settings.customs);
    store.set('calendar', custom.id);
    fillCalendars();
    $('calendar-form').reset();
    $('calendar-dialog').close();
    redrawDates();
  });

  // ---------- Start ----------
  const restore = () => {
    if (location.hash === lastHash) return;
    lastHash = location.hash;
    const year = centreYear();
    state = readHash();
    syncControls();
    rebuild({keepYear: year, toEvent: state.event});
    renderPanel();
  };
  window.addEventListener('popstate', restore);
  window.addEventListener('hashchange', restore);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const year = centreYear();
      rebuild({keepYear: year});
    }, 140);
  });

  fillCalendars();
  syncControls();
  syncMenu();
  rebuild({toEvent: state.event, initial: !state.event});
  renderPanel();
})();

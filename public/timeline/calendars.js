'use strict';
// Year systems and date formats. Pure functions: nothing here touches the page.
// Stored years use the data's convention: negative is BC, and there is no year 0.
(function (root) {
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const STEMS = '甲乙丙丁戊己庚辛壬癸';
  const BRANCHES = '子丑寅卯辰巳午未申酉戌亥';

  const toAstro = y => (y < 0 ? y + 1 : y);
  const fromAstro = a => (a <= 0 ? a - 1 : a);
  const num = n => String(n);

  // A counted era: "n suffix" from its epoch, "n before suffix" earlier.
  const counted = (offset, suffix) => a => {
    const v = a + offset;
    return v >= 1 ? `${num(v)} ${suffix}` : `${num(1 - v)} before ${suffix}`;
  };

  const SYSTEMS = [
    {id: 'ad', label: 'Gregorian (AD / BC)', exact: true, gregorian: true, labels: {bc: 'BC', ad: 'AD'}},
    {id: 'ce', label: 'Common Era (CE / BCE)', exact: true, gregorian: true, labels: {bc: 'BCE', ad: 'CE'}},
    {id: 'he', label: 'Holocene (HE)', exact: true, format: counted(10000, 'HE')},
    {id: 'astro', label: 'Astronomical (has a year 0)', exact: true, format: a => (a < 0 ? `−${num(-a)}` : num(a))},
    {id: 'auc', label: 'Roman (AUC, from Rome’s founding)', format: counted(753, 'AUC')},
    {id: 'be', label: 'Buddhist Era (BE)', format: counted(543, 'BE')},
    {id: 'am', label: 'Hebrew (AM)', format: counted(3760, 'AM')},
    {id: 'ah', label: 'Islamic (AH)', format: a => (a >= 622 ? `${num(Math.floor((a - 622) * 33 / 32) + 1)} AH` : `${num(Math.ceil((622 - a) * 33 / 32))} BH`)},
    {id: 'sh', label: 'Persian solar (SH)', format: counted(-621, 'SH')},
    {id: 'saka', label: 'Indian national (Śaka)', format: counted(-78, 'Śaka')},
    {id: 'coptic', label: 'Coptic (AM)', format: counted(-284, 'Coptic AM')},
    {id: 'ec', label: 'Ethiopian (EC)', format: counted(-8, 'EC')},
    {id: 'sexagenary', label: 'Chinese sexagenary cycle', format: a => {
      const i = (((a - 4) % 60) + 60) % 60;
      const y = fromAstro(a);
      return `${STEMS[i % 10]}${BRANCHES[i % 12]} (${Math.abs(y)}${y < 0 ? ' BC' : ''})`;
    }},
  ];

  const FORMATS = [
    {id: 'mdy', label: 'July 19, 1848'},
    {id: 'dmy', label: '19 July 1848'},
    {id: 'ymd', label: '1848-07-19'},
    {id: 'year', label: 'Year only'},
  ];

  function customSystem(c) {
    const offset = 1 - toAstro(c.epoch);
    return {id: c.id, label: `${c.name} (${c.suffix})`, custom: true, exact: true, format: counted(offset, c.suffix)};
  }

  function system(id, customs = []) {
    return SYSTEMS.find(s => s.id === id) || customs.map(customSystem).find(s => s.id === id) || SYSTEMS[0];
  }

  // The year alone, for axis ticks and cards.
  function yearLabel(y, sys) {
    if (sys.gregorian) return `${Math.abs(y)}${y < 0 ? ` ${sys.labels.bc}` : y < 1000 ? ` ${sys.labels.ad}` : ''}`;
    return sys.format(toAstro(y));
  }

  function pointLabel(d, sys, format) {
    if (!sys.gregorian) return yearLabel(d.y, sys);
    const year = yearLabel(d.y, sys);
    if (format === 'year' || !d.m) return year;
    if (format === 'ymd') {
      const pad = n => String(n).padStart(2, '0');
      const sign = d.y < 0 ? `${Math.abs(d.y)} ${sys.labels.bc}` : d.y < 1000 ? `${d.y} ${sys.labels.ad}` : String(d.y);
      return `${sign}-${pad(d.m)}${d.d ? `-${pad(d.d)}` : ''}`;
    }
    if (format === 'dmy') return d.d ? `${d.d} ${MONTHS[d.m - 1]} ${year}` : `${MONTHS[d.m - 1]} ${year}`;
    return d.d ? `${MONTHS[d.m - 1]} ${d.d}, ${year}` : `${MONTHS[d.m - 1]} ${year}`;
  }

  // Mirrors displayDate in tools/build.mjs so the Common Era output stays comparable.
  function dateRange(e, sys, format = 'mdy') {
    const circa = ['approx', 'traditional'].includes(e.certainty) ? 'c. ' : '';
    const prefix = sys.exact || sys.gregorian ? '' : '≈ ';
    const one = d => pointLabel(d, sys, format);
    const a = e.start;
    const b = e.end;
    if (b === 'present') return `${prefix}${circa}${one(a)} – present`;
    if (!b) return prefix + circa + one(a);
    if (a.y === b.y && a.m === b.m && a.d === b.d) return prefix + circa + one(a);
    if (sys.gregorian && format === 'mdy') {
      const era = y => (y < 0 ? ` ${sys.labels.bc}` : y < 1000 ? ` ${sys.labels.ad}` : '');
      if (a.y === b.y && a.m === b.m && a.d && b.d) return `${circa}${MONTHS[a.m - 1]} ${a.d}–${b.d}, ${Math.abs(a.y)}${era(a.y)}`;
      if (a.y < 0 && b.y < 0 && !a.m && !b.m) return `${circa}${Math.abs(a.y)}${circa ? ' – c. ' : '–'}${Math.abs(b.y)} ${sys.labels.bc}`;
    }
    return `${prefix}${circa}${one(a)} – ${circa}${one(b)}`;
  }

  root.TimelineCalendars = {SYSTEMS, FORMATS, system, yearLabel, dateRange, toAstro, fromAstro, customSystem};
})(typeof window !== 'undefined' ? window : globalThis);

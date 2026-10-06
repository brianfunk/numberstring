import numberstring, {
  comma, ordinal, roman, year, currency, telephone, fraction,
  nth, compact, fancy, egyptian, babylonian, greek, chinese, japanese, nato, morse,
  scientific, binary, octal, hex, bytes, clock
} from './lib/index.js';

const LANGS = [
  ['en', 'English'], ['es', 'Español'], ['fr', 'Français'], ['de', 'Deutsch'],
  ['pt', 'Português'], ['it', 'Italiano'], ['nl', 'Nederlands'], ['da', 'Dansk'],
  ['sv', 'Svenska'], ['no', 'Norsk'], ['fi', 'Suomi'], ['is', 'Íslenska'],
  ['pl', 'Polski'], ['ru', 'Русский'], ['tr', 'Türkçe'], ['ar', 'العربية'],
  ['hi', 'हिन्दी'], ['zh', '中文'], ['ja', '日本語'], ['ko', '한국어'],
  ['id', 'Indonesia'], ['th', 'ไทย']
];
const RTL = new Set(['ar']);

const $ = (id) => document.getElementById(id);
const input = $('n');
const english = $('english');
const error = $('error');
const facts = $('facts');
const langs = $('langs');

/** Turn the raw string into a number/BigInt plus flags, or null. */
const interpret = (raw) => {
  const str = raw.trim().replace(/[,_\s]/g, '');
  if (!/^-?\d+(\.\d+)?$/.test(str)) return null;
  const negative = str.startsWith('-');
  const isDecimal = str.includes('.');
  const digits = str.replace('-', '').split('.')[0];
  let value;
  if (isDecimal) value = Number(str);
  else value = digits.length <= 15 ? Number(str) : BigInt(str);
  return { str, value, negative, isDecimal, magnitude: digits.length };
};

const row = (label, text, cls) => {
  const dt = document.createElement('dt');
  dt.textContent = label;
  const dd = document.createElement('dd');
  if (cls) dd.classList.add(cls);
  if (text === false || text == null) {
    dd.textContent = '—';
    dd.className = 'na';
  } else {
    dd.textContent = text;
  }
  facts.append(dt, dd);
};

/** Extra row for the Chinese 大写 / Japanese 大字 financial numerals */
const formalRow = (code, value) => {
  const tr = document.createElement('tr');
  const c = document.createElement('td');
  c.className = 'code';
  c.textContent = code;
  const n = document.createElement('td');
  n.className = 'name';
  n.textContent = code === 'zh' ? '大写' : '大字';
  const w = document.createElement('td');
  w.className = 'words';
  const fn = code === 'zh' ? chinese : japanese;
  const out = value === null ? false : fn(value, { formal: true });
  w.textContent = out === false ? '—' : out;
  tr.append(c, n, w);
  return tr;
};

const render = (raw) => {
  const parsed = interpret(raw);
  facts.replaceChildren();
  langs.replaceChildren();

  if (!parsed) {
    english.textContent = '';
    error.hidden = raw.trim() === '';
    error.textContent = 'That is not a number I know how to say.';
    return;
  }

  const words = numberstring(parsed.str);
  if (words === false) {
    english.textContent = '';
    error.hidden = false;
    error.textContent = 'Too big. I stop at 10^36 − 1 (nine hundred ninety-nine decillion…).';
    return;
  }
  error.hidden = true;
  english.textContent = words;

  const { value, negative, isDecimal } = parsed;
  const wholeInt = !isDecimal && !negative;
  const smallInt = wholeInt && typeof value === 'number';

  row('comma', isDecimal ? false : comma(value));
  row('ordinal', wholeInt && value !== 0 && value !== 0n ? ordinal(value) : false);
  row('roman', smallInt && value >= 1 && value <= 3999999999 ? roman(value) : false, 'roman');
  row('year', smallInt && value >= 1 && value <= 9999 ? year(value) : false);
  row('currency', !negative && typeof value === 'number' && value < 1e15 ? currency(`$${parsed.str}`) : false);
  row('telephone', wholeInt && parsed.magnitude <= 15 ? telephone(parsed.str, { oh: true }) : false);
  row('pilot', nato(parsed.str));
  row('scientific', scientific(parsed.str));
  row('binary', !isDecimal ? binary(value, { prefix: true }) : false, 'roman');
  row('octal', !isDecimal ? octal(value, { prefix: true }) : false, 'roman');
  row('hex', !isDecimal ? hex(value, { prefix: true }) : false, 'roman');
  row('bytes', wholeInt ? `${bytes(value)} · ${bytes(value, { binary: true })}` : false);
  row('morse', morse(parsed.str), 'roman');
  row('fraction', smallInt && value >= 2 ? fraction(1, value) : false);
  row('british', wholeInt ? numberstring(value, { and: true }) : false);
  row('nth', wholeInt ? nth(value) : false);
  row('compact', compact(parsed.str));
  row('title', numberstring(parsed.str, { cap: 'title' }));
  row('shout', numberstring(parsed.str, { cap: 'upper', punc: '!' }));
  row('circled', fancy(parsed.str, 'circled'));
  row('superscript', fancy(parsed.str, 'superscript'));
  row('fullwidth', fancy(parsed.str, 'fullwidth'));
  row('doublestruck', fancy(parsed.str, 'doublestruck'));
  row('emoji', fancy(parsed.str, 'emoji'));
  row('clock', smallInt && value >= 0 && value <= 24 ? clock(value) : false, 'glyphs');
  row('braille', fancy(parsed.str, 'braille'));
  row('egyptian', wholeInt ? egyptian(value) : false, 'glyphs');
  row('babylonian', wholeInt ? babylonian(value) : false, 'glyphs');
  row('greek', wholeInt ? greek(value) : false, 'glyphs');

  for (const [code, name] of LANGS) {
    const tr = document.createElement('tr');
    const c = document.createElement('td');
    c.className = 'code';
    c.textContent = code;
    const n = document.createElement('td');
    n.className = 'name';
    n.textContent = name;
    const w = document.createElement('td');
    w.className = 'words';
    if (RTL.has(code)) w.dir = 'rtl';
    const out = numberstring(parsed.str, { lang: code });
    w.textContent = out === false ? '—' : out;
    tr.append(c, n, w);
    langs.append(tr);
    if (code === 'zh' || code === 'ja') langs.append(formalRow(code, wholeInt ? value : null));
  }
};

input.addEventListener('input', () => render(input.value));
document.querySelectorAll('.chips button').forEach((b) => {
  b.addEventListener('click', () => {
    input.value = b.dataset.n;
    render(input.value);
    input.focus();
  });
});

let fromHash = '';
try {
  fromHash = decodeURIComponent(location.hash.slice(1));
} catch {
  fromHash = '';
}
if (fromHash) input.value = fromHash;
render(input.value);
input.addEventListener('change', () => {
  history.replaceState(null, '', input.value ? `#${encodeURIComponent(input.value)}` : ' ');
});

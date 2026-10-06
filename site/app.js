import numberstring, {
  comma, ordinal, roman, year, currency, telephone, fraction
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

const row = (label, text) => {
  const dt = document.createElement('dt');
  dt.textContent = label;
  const dd = document.createElement('dd');
  if (text === false || text == null) {
    dd.textContent = '—';
    dd.className = 'na';
  } else {
    dd.textContent = text;
  }
  facts.append(dt, dd);
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
  row('roman', smallInt && value >= 1 && value <= 3999 ? roman(value) : false);
  row('year', smallInt && value >= 1000 && value <= 9999 ? year(value) : false);
  row('currency', !negative && typeof value === 'number' && value < 1e15 ? currency(`$${parsed.str}`) : false);
  row('telephone', wholeInt && parsed.magnitude <= 15 ? telephone(parsed.str) : false);
  row('fraction', smallInt && value >= 2 && value <= 1000 ? `1/${value} = ${fraction(1, value)}` : false);
  row('title', numberstring(parsed.str, { cap: 'title' }));
  row('shout', numberstring(parsed.str, { cap: 'upper', punc: '!' }));

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

const fromHash = decodeURIComponent(location.hash.slice(1));
if (fromHash) input.value = fromHash;
render(input.value);
input.addEventListener('change', () => {
  history.replaceState(null, '', input.value ? `#${encodeURIComponent(input.value)}` : ' ');
});

/**
 * Alternative numeral systems and Unicode digit styles.
 * Everything here is pure, table-driven, and renders with Unicode glyphs,
 * so results depend on the viewer having a font that covers the block.
 * @module numerals
 */

// ============================================================================
// SHARED
// ============================================================================

/** Normalize a non-negative integer input to BigInt, or null if invalid */
const toCount = (n) => {
  if (typeof n === 'bigint') return n >= 0n ? n : null;
  if (typeof n === 'number') return Number.isInteger(n) && n >= 0 ? BigInt(n) : null;
  if (typeof n === 'string' && /^\d+$/.test(n.trim())) return BigInt(n.trim());
  return null;
};

/** Normalize any numeric input (sign, decimal point) to a digit string, or null */
const toDigitString = (n) => {
  if (typeof n === 'bigint') return n.toString();
  if (typeof n === 'number') {
    if (!Number.isFinite(n)) return null;
    const str = n.toString();
    if (str.includes('e')) return Number.isInteger(n) ? BigInt(n).toString() : null;
    return str;
  }
  if (typeof n === 'string') {
    const str = n.trim();
    return /^-?\d+(\.\d+)?$/.test(str) ? str : null;
  }
  return null;
};

// ============================================================================
// UNICODE DIGIT STYLES
// ============================================================================

/** Digit tables: ten glyphs for 0-9, plus minus and point */
const FANCY_STYLES = Object.freeze({
  circled: { digits: '⓪①②③④⑤⑥⑦⑧⑨', minus: '−', point: '·' },
  superscript: { digits: '⁰¹²³⁴⁵⁶⁷⁸⁹', minus: '⁻', point: '˙' },
  subscript: { digits: '₀₁₂₃₄₅₆₇₈₉', minus: '₋', point: '.' },
  fullwidth: { digits: '０１２３４５６７８９', minus: '－', point: '．' },
  bold: { digits: '𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗', minus: '−', point: '.' },
  doublestruck: { digits: '𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡', minus: '−', point: '.' },
  sans: { digits: '𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫', minus: '−', point: '.' },
  monospace: { digits: '𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿', minus: '−', point: '.' },
  keycap: { digits: ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'], minus: '➖', point: '.' },
  // Braille: numeric indicator ⠼ then a-j, decimal point ⠨, minus ⠤
  braille: { digits: '⠚⠁⠃⠉⠙⠑⠋⠛⠓⠊', minus: '⠤', point: '⠨', prefix: '⠼' }
});

/** Style names accepted by fancy() */
const FANCY_STYLE_NAMES = Object.freeze(Object.keys(FANCY_STYLES));

/**
 * Render a number's digits in a Unicode style.
 * @param {number|bigint|string} n - The number
 * @param {string} [style='circled'] - One of circled, superscript, subscript,
 *   fullwidth, bold, doublestruck, sans, monospace, keycap, braille
 * @returns {string|false} Styled digits or false if invalid
 *
 * @example
 * fancy(42)                 // '④②'
 * fancy(42, 'superscript')  // '⁴²'
 * fancy(-3.5, 'fullwidth')  // '－３．５'
 */
const fancy = (n, style = 'circled') => {
  const table = FANCY_STYLES[style];
  if (!table) return false;
  const str = toDigitString(n);
  if (str === null) return false;

  const glyphs = Array.isArray(table.digits) ? table.digits : [...table.digits];
  let out = table.prefix || '';
  for (const ch of str) {
    if (ch === '-') out += table.minus;
    else if (ch === '.') out += table.point;
    else out += glyphs[Number(ch)];
  }
  return out;
};

// ============================================================================
// EGYPTIAN HIEROGLYPHS
// ============================================================================

/** Hieroglyphs for 1, 10, 100, ... 1,000,000 (stroke, heel bone, coil, lotus, finger, tadpole, Heh) */
const EGYPTIAN_SYMBOLS = Object.freeze(['𓏺', '𓎆', '𓍢', '𓆼', '𓂭', '𓆐', '𓁨']);

/** Largest value expressible with repeated hieroglyphs (9,999,999) */
const EGYPTIAN_MAX = 9999999n;

/**
 * Egyptian hieroglyphic numerals, additive: each power of ten is a symbol
 * repeated up to nine times, largest first.
 * @param {number|bigint|string} n - Integer from 1 to 9,999,999
 * @returns {string|false}
 *
 * @example
 * egyptian(42)   // '𓎆𓎆𓎆𓎆𓏺𓏺'
 * egyptian(1000) // '𓆼'
 */
const egyptian = (n) => {
  const count = toCount(n);
  if (count === null || count < 1n || count > EGYPTIAN_MAX) return false;

  const digits = count.toString();
  let out = '';
  for (let i = 0; i < digits.length; i++) {
    const power = digits.length - 1 - i;
    out += EGYPTIAN_SYMBOLS[power].repeat(Number(digits[i]));
  }
  return out;
};

// ============================================================================
// BABYLONIAN CUNEIFORM
// ============================================================================

const CUNEIFORM_ONE = '𒐕';
const CUNEIFORM_TEN = '𒌋';
/** Late Babylonian placeholder for an empty sexagesimal position */
const CUNEIFORM_ZERO = '𒑊';

/**
 * Babylonian sexagesimal (base 60) numerals. Each position is written with
 * tens wedges then unit wedges; positions are separated by a space and an
 * empty inner position uses the Late Babylonian placeholder sign.
 * @param {number|bigint|string} n - Non-negative integer
 * @returns {string|false}
 *
 * @example
 * babylonian(42)   // '𒌋𒌋𒌋𒌋𒐕𒐕'
 * babylonian(3600) // '𒐕 𒑊 𒑊'
 */
const babylonian = (n) => {
  const count = toCount(n);
  if (count === null) return false;
  if (count === 0n) return CUNEIFORM_ZERO;

  const places = [];
  let rest = count;
  while (rest > 0n) {
    places.unshift(Number(rest % 60n));
    rest /= 60n;
  }
  return places
    .map((p) => (p === 0 ? CUNEIFORM_ZERO : CUNEIFORM_TEN.repeat(Math.floor(p / 10)) + CUNEIFORM_ONE.repeat(p % 10)))
    .join(' ');
};

// ============================================================================
// MAYAN
// ============================================================================

/** Unicode Mayan numerals 0-19 (U+1D2E0 .. U+1D2F3) */
const MAYAN_DIGITS = Object.freeze([...'𝋠𝋡𝋢𝋣𝋤𝋥𝋦𝋧𝋨𝋩𝋪𝋫𝋬𝋭𝋮𝋯𝋰𝋱𝋲𝋳']);

/**
 * Mayan vigesimal (base 20) numerals using the Unicode Mayan Numerals block.
 * Pure base 20 (the calendar's 18-based third place is not applied).
 * Most significant digit first; pass `{ vertical: true }` to stack with
 * newlines the way the Maya wrote them.
 * @param {number|bigint|string} n - Non-negative integer
 * @param {Object} [opt]
 * @param {boolean} [opt.vertical] - Join places with newlines
 * @returns {string|false}
 *
 * @example
 * mayan(42)  // '𝋢𝋢'  (2 twenties + 2)
 * mayan(0)   // '𝋠'
 */
const mayan = (n, opt) => {
  const count = toCount(n);
  if (count === null) return false;
  if (count === 0n) return MAYAN_DIGITS[0];

  const places = [];
  let rest = count;
  while (rest > 0n) {
    places.unshift(MAYAN_DIGITS[Number(rest % 20n)]);
    rest /= 20n;
  }
  return places.join(opt?.vertical ? '\n' : '');
};

// ============================================================================
// GREEK (IONIC / MILESIAN)
// ============================================================================

const GREEK_ONES = Object.freeze(['', 'α', 'β', 'γ', 'δ', 'ε', 'ϛ', 'ζ', 'η', 'θ']);
const GREEK_TENS = Object.freeze(['', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ϟ']);
const GREEK_HUNDREDS = Object.freeze(['', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', 'ϡ']);
/** Keraia marks a number; the lower keraia marks thousands */
const GREEK_KERAIA = 'ʹ';
const GREEK_THOUSANDS = '͵';

/**
 * Greek alphabetic (Ionic) numerals for 1-9999, with stigma, koppa and sampi
 * for 6, 90 and 900 and the keraia marks.
 * @param {number|bigint|string} n - Integer from 1 to 9999
 * @returns {string|false}
 *
 * @example
 * greek(42)   // 'μβʹ'
 * greek(1999) // '͵αϡϟθʹ'
 */
const greek = (n) => {
  const count = toCount(n);
  if (count === null || count < 1n || count > 9999n) return false;

  const v = Number(count);
  const thousands = Math.floor(v / 1000);
  const rest = v % 1000;
  let out = thousands ? GREEK_THOUSANDS + GREEK_ONES[thousands] : '';
  out += GREEK_HUNDREDS[Math.floor(rest / 100)] + GREEK_TENS[Math.floor((rest % 100) / 10)] + GREEK_ONES[rest % 10];
  return out + GREEK_KERAIA;
};

// ============================================================================
// TALLY MARKS
// ============================================================================

const TALLY_FIVE = '𝍸';
const TALLY_ONE = '𝍷';
/** Keep tally output to something a page can show */
const TALLY_MAX = 1000n;

/**
 * Tally marks in groups of five using the Unicode tally glyphs.
 * @param {number|bigint|string} n - Integer from 0 to 1000
 * @returns {string|false}
 *
 * @example
 * tally(7)  // '𝍸 𝍷𝍷'
 * tally(0)  // ''
 */
const tally = (n) => {
  const count = toCount(n);
  if (count === null || count > TALLY_MAX) return false;
  const v = Number(count);
  const groups = [];
  for (let i = 0; i < Math.floor(v / 5); i++) groups.push(TALLY_FIVE);
  if (v % 5) groups.push(TALLY_ONE.repeat(v % 5));
  return groups.join(' ');
};

export { fancy, FANCY_STYLE_NAMES, egyptian, babylonian, mayan, greek, tally };

/**
 * Spanish number-to-words converter
 * @module languages/es
 */

const ES_ONES = Object.freeze(['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve']);
const ES_TENS = Object.freeze(['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa']);
const ES_TEENS = Object.freeze(['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve']);
const ES_TWENTIES = Object.freeze(['veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve']);
const ES_ILLIONS = Object.freeze(['', 'mil', 'millón', 'mil millones', 'billón', 'mil billones', 'trillón', 'mil trillones', 'cuatrillón', 'mil cuatrillones', 'quintillón', 'mil quintillones']);
const ES_ILLIONS_PLURAL = Object.freeze(['', 'mil', 'millones', 'mil millones', 'billones', 'mil billones', 'trillones', 'mil trillones', 'cuatrillones', 'mil cuatrillones', 'quintillones', 'mil quintillones']);

const MAX_VALUE = 10n ** 36n - 1n;

const group = (n) => Math.ceil(n.toString().length / 3) - 1;
const power = (g) => 10n ** BigInt(g * 3);
const segment = (n, g) => n % power(g + 1);
const hundment = (n, g) => Number(segment(n, g) / power(g));
const tenment = (n, g) => hundment(n, g) % 100;

const hundredEs = (n) => {
  if (n < 100 || n >= 1000) return '';
  const h = Math.floor(n / 100);
  if (h === 1) return 'ciento ';
  if (h === 5) return 'quinientos ';
  if (h === 7) return 'setecientos ';
  if (h === 9) return 'novecientos ';
  return `${ES_ONES[h]}cientos `;
};

const tenEs = (n) => {
  if (n === 0) return '';
  if (n < 10) return `${ES_ONES[n]} `;
  if (n < 20) return `${ES_TEENS[n - 10]} `;
  if (n < 30) return `${ES_TWENTIES[n - 20]} `;
  const onesDigit = n % 10;
  if (onesDigit) return `${ES_TENS[Math.floor(n / 10)]} y ${ES_ONES[onesDigit]} `;
  return `${ES_TENS[Math.floor(n / 10)]} `;
};

const cap = (str, style) => {
  switch (style) {
    case 'title':
      return str.replace(/\w([^-\s]*)/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
      );
    case 'upper': return str.toUpperCase();
    case 'lower': return str.toLowerCase();
    default: return str;
  }
};

/**
 * Convert a number to Spanish words
 * @param {number|bigint} n - The number to convert
 * @param {Object} [opt] - Options object
 * @returns {string|false} The Spanish word representation
 *
 * @example
 * spanish(42) // 'cuarenta y dos'
 * spanish(1000) // 'mil'
 */
const spanish = (n, opt) => {
  let num;

  if (typeof n === 'bigint') {
    if (n < 0n || n > MAX_VALUE) return false;
    num = n;
  } else if (typeof n === 'number') {
    if (isNaN(n) || n < 0 || !Number.isInteger(n)) return false;
    if (n > Number.MAX_SAFE_INTEGER) return false;
    num = BigInt(n);
  } else {
    return false;
  }

  if (num === 0n) return 'cero';
  if (num === 1n) return 'uno';

  let s = '';
  for (let i = group(num); i >= 0; i--) {
    const h = hundment(num, i);
    if (h > 0) {
      if (i === 0) {
        s += hundredEs(h);
        s += tenEs(tenment(num, i));
      } else {
        if (h === 1 && i === 1) {
          s += 'mil ';
        } else {
          s += hundredEs(h);
          s += tenEs(tenment(num, i));
          const illionWord = h === 1 ? ES_ILLIONS[i] : ES_ILLIONS_PLURAL[i];
          s += `${illionWord} `;
        }
      }
    }
  }

  s = s.trim();
  if (opt?.cap) s = cap(s, opt.cap);
  return s;
};

export default spanish;
export { spanish };

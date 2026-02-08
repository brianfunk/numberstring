/**
 * Norwegian (Bokmål) number-to-words converter
 * Norwegian uses long scale like Danish but with simpler tens
 * @module languages/no
 */

const NO_ONES = Object.freeze(['', 'en', 'to', 'tre', 'fire', 'fem', 'seks', 'sju', 'åtte', 'ni']);
const NO_TENS = Object.freeze(['', '', 'tjue', 'tretti', 'førti', 'femti', 'seksti', 'sytti', 'åtti', 'nitti']);
const NO_TEENS = Object.freeze(['ti', 'elleve', 'tolv', 'tretten', 'fjorten', 'femten', 'seksten', 'sytten', 'atten', 'nitten']);
const NO_ILLIONS = Object.freeze(['', 'tusen', 'million', 'milliard', 'billion', 'billiard', 'trillion', 'trilliard', 'kvadrillion', 'kvadrilliard', 'kvintillion', 'kvintilliard']);
const NO_ILLIONS_PLURAL = Object.freeze(['', 'tusen', 'millioner', 'milliarder', 'billioner', 'billiarder', 'trillioner', 'trilliarder', 'kvadrillioner', 'kvadrilliarder', 'kvintillioner', 'kvintilliarder']);

const MAX_VALUE = 10n ** 36n - 1n;

const group = (n) => Math.ceil(n.toString().length / 3) - 1;
const power = (g) => 10n ** BigInt(g * 3);
const segment = (n, g) => n % power(g + 1);
const hundment = (n, g) => Number(segment(n, g) / power(g));
const tenment = (n, g) => hundment(n, g) % 100;

const tenNo = (n) => {
  if (n === 0) return '';
  if (n < 10) return NO_ONES[n];
  if (n < 20) return NO_TEENS[n - 10];
  const onesDigit = n % 10;
  const tensDigit = Math.floor(n / 10);
  if (onesDigit === 0) return NO_TENS[tensDigit];
  return `${NO_TENS[tensDigit]}${NO_ONES[onesDigit]}`;
};

const hundredNo = (n) => {
  if (n < 100 || n >= 1000) return '';
  const h = Math.floor(n / 100);
  if (h === 1) return 'etthundre';
  return `${NO_ONES[h]}hundre`;
};

/**
 * Convert a number to Norwegian words
 * @param {number|bigint} n - The number to convert
 * @returns {string|false} The Norwegian word representation
 *
 * @example
 * norwegian(42) // 'førtito'
 * norwegian(1000) // 'ettusen'
 */
const norwegian = (n) => {
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

  if (num === 0n) return 'null';
  if (num === 1n) return 'en';

  let s = '';
  for (let i = group(num); i >= 0; i--) {
    const h = hundment(num, i);
    if (h > 0) {
      if (i === 0) {
        if (h >= 100) s += hundredNo(h) + ' ';
        const t = tenment(num, i);
        if (t > 0) s += tenNo(t);
      } else if (i === 1) {
        if (h === 1) {
          s += 'ettusen ';
        } else {
          if (h >= 100) s += hundredNo(h) + ' ';
          const t = tenment(num, i);
          if (t > 0) s += tenNo(t);
          s += 'tusen ';
        }
      } else {
        if (h >= 100) s += hundredNo(h) + ' ';
        const t = tenment(num, i);
        if (t > 0) {
          if (t === 1) {
            s += 'en ';
          } else {
            s += tenNo(t) + ' ';
          }
        } else if (h < 100 && h >= 1 && h === 1) {
          s += 'en ';
        }
        const illionWord = h === 1 ? NO_ILLIONS[i] : NO_ILLIONS_PLURAL[i];
        s += `${illionWord} `;
      }
    }
  }

  return s.trim();
};

export default norwegian;
export { norwegian };

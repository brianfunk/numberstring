/**
 * Danish number-to-words converter
 * Danish also reverses ones and tens like German
 * @module languages/da
 */

const DA_ONES = Object.freeze(['', 'en', 'to', 'tre', 'fire', 'fem', 'seks', 'syv', 'otte', 'ni']);
const DA_TENS = Object.freeze(['', '', 'tyve', 'tredive', 'fyrre', 'halvtreds', 'tres', 'halvfjerds', 'firs', 'halvfems']);
const DA_TEENS = Object.freeze(['ti', 'elleve', 'tolv', 'tretten', 'fjorten', 'femten', 'seksten', 'sytten', 'atten', 'nitten']);
const DA_ILLIONS = Object.freeze(['', 'tusind', 'million', 'milliard', 'billion', 'billiard', 'trillion', 'trilliard', 'kvadrillion', 'kvadrilliard', 'kvintillion', 'kvintilliard']);
const DA_ILLIONS_PLURAL = Object.freeze(['', 'tusind', 'millioner', 'milliarder', 'billioner', 'billiarder', 'trillioner', 'trilliarder', 'kvadrillioner', 'kvadrilliarder', 'kvintillioner', 'kvintilliarder']);

const MAX_VALUE = 10n ** 36n - 1n;

const group = (n) => Math.ceil(n.toString().length / 3) - 1;
const power = (g) => 10n ** BigInt(g * 3);
const segment = (n, g) => n % power(g + 1);
const hundment = (n, g) => Number(segment(n, g) / power(g));
const tenment = (n, g) => hundment(n, g) % 100;

const tenDa = (n) => {
  if (n === 0) return '';
  if (n < 10) return DA_ONES[n];
  if (n < 20) return DA_TEENS[n - 10];
  const onesDigit = n % 10;
  const tensDigit = Math.floor(n / 10);
  if (onesDigit === 0) return DA_TENS[tensDigit];
  return `${DA_ONES[onesDigit]}og${DA_TENS[tensDigit]}`;
};

const hundredDa = (n) => {
  if (n < 100 || n >= 1000) return '';
  const h = Math.floor(n / 100);
  if (h === 1) return 'ethundrede';
  return `${DA_ONES[h]}hundrede`;
};

/**
 * Convert a number to Danish words
 * @param {number|bigint} n - The number to convert
 * @returns {string|false} The Danish word representation
 *
 * @example
 * danish(42) // 'toogfyrre'
 * danish(1000) // 'ettusind'
 */
const danish = (n) => {
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

  if (num === 0n) return 'nul';
  if (num === 1n) return 'en';

  let s = '';
  for (let i = group(num); i >= 0; i--) {
    const h = hundment(num, i);
    if (h > 0) {
      if (i === 0) {
        if (h >= 100) s += hundredDa(h) + ' ';
        const t = tenment(num, i);
        if (t > 0) s += tenDa(t);
      } else if (i === 1) {
        if (h === 1) {
          s += 'ettusind ';
        } else {
          if (h >= 100) s += hundredDa(h) + ' ';
          const t = tenment(num, i);
          if (t > 0) s += tenDa(t);
          s += 'tusind ';
        }
      } else {
        if (h >= 100) s += hundredDa(h) + ' ';
        const t = tenment(num, i);
        if (t > 0) {
          if (t === 1) {
            s += 'en ';
          } else {
            s += tenDa(t) + ' ';
          }
        } else if (h < 100 && h >= 1 && h === 1) {
          s += 'en ';
        }
        const illionWord = h === 1 ? DA_ILLIONS[i] : DA_ILLIONS_PLURAL[i];
        s += `${illionWord} `;
      }
    }
  }

  return s.trim();
};

export default danish;
export { danish };

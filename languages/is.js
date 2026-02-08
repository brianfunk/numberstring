/**
 * Icelandic number-to-words converter
 * Icelandic uses long scale and "og" connector between ones and tens
 * @module languages/is
 */

const IS_ONES = Object.freeze(['', 'einn', 'tveir', 'þrír', 'fjórir', 'fimm', 'sex', 'sjö', 'átta', 'níu']);
const IS_TENS = Object.freeze(['', '', 'tuttugu', 'þrjátíu', 'fjörutíu', 'fimmtíu', 'sextíu', 'sjötíu', 'áttatíu', 'níutíu']);
const IS_TEENS = Object.freeze(['tíu', 'ellefu', 'tólf', 'þrettán', 'fjórtán', 'fimmtán', 'sextán', 'sautján', 'átján', 'nítján']);
const IS_ILLIONS = Object.freeze(['', 'þúsund', 'milljón', 'milljarður', 'billjón', 'billjarður', 'trilljón', 'trilljarður', 'kvadrilljón', 'kvadrilljarður', 'kvintilljón', 'kvintilljarður']);
const IS_ILLIONS_PLURAL = Object.freeze(['', 'þúsund', 'milljónir', 'milljarðar', 'billjónir', 'billjarðar', 'trilljónir', 'trilljarðar', 'kvadrilljónir', 'kvadrilljarðar', 'kvintilljónir', 'kvintilljarðar']);

const MAX_VALUE = 10n ** 36n - 1n;

const group = (n) => Math.ceil(n.toString().length / 3) - 1;
const power = (g) => 10n ** BigInt(g * 3);
const segment = (n, g) => n % power(g + 1);
const hundment = (n, g) => Number(segment(n, g) / power(g));
const tenment = (n, g) => hundment(n, g) % 100;

const tenIs = (n) => {
  if (n === 0) return '';
  if (n < 10) return IS_ONES[n];
  if (n < 20) return IS_TEENS[n - 10];
  const onesDigit = n % 10;
  const tensDigit = Math.floor(n / 10);
  if (onesDigit === 0) return IS_TENS[tensDigit];
  return `${IS_TENS[tensDigit]} og ${IS_ONES[onesDigit]}`;
};

const hundredIs = (n) => {
  if (n < 100 || n >= 1000) return '';
  const h = Math.floor(n / 100);
  if (h === 1) return 'eitt hundrað';
  return `${IS_ONES[h]} hundruð`;
};

/**
 * Convert a number to Icelandic words
 * @param {number|bigint} n - The number to convert
 * @returns {string|false} The Icelandic word representation
 *
 * @example
 * icelandic(42) // 'fjörutíu og tveir'
 * icelandic(1000) // 'eitt þúsund'
 */
const icelandic = (n) => {
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

  if (num === 0n) return 'núll';
  if (num === 1n) return 'einn';

  let s = '';
  for (let i = group(num); i >= 0; i--) {
    const h = hundment(num, i);
    if (h > 0) {
      if (i === 0) {
        if (h >= 100) s += hundredIs(h) + ' ';
        const t = tenment(num, i);
        if (t > 0) s += tenIs(t);
      } else if (i === 1) {
        if (h === 1) {
          s += 'eitt þúsund ';
        } else {
          if (h >= 100) s += hundredIs(h) + ' ';
          const t = tenment(num, i);
          if (t > 0) s += tenIs(t) + ' ';
          s += 'þúsund ';
        }
      } else {
        if (h >= 100) s += hundredIs(h) + ' ';
        const t = tenment(num, i);
        if (t > 0) {
          if (t === 1) {
            s += 'einn ';
          } else {
            s += tenIs(t) + ' ';
          }
        } else if (h < 100 && h >= 1 && h === 1) {
          s += 'einn ';
        }
        const illionWord = h === 1 ? IS_ILLIONS[i] : IS_ILLIONS_PLURAL[i];
        s += `${illionWord} `;
      }
    }
  }

  return s.trim();
};

export default icelandic;
export { icelandic };

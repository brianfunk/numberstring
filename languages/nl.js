/**
 * Dutch number-to-words converter
 * Dutch reverses ones and tens (eenentwintig = one-and-twenty)
 * @module languages/nl
 */

const NL_ONES = Object.freeze(['', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen']);
const NL_TENS = Object.freeze(['', '', 'twintig', 'dertig', 'veertig', 'vijftig', 'zestig', 'zeventig', 'tachtig', 'negentig']);
const NL_TEENS = Object.freeze(['tien', 'elf', 'twaalf', 'dertien', 'veertien', 'vijftien', 'zestien', 'zeventien', 'achttien', 'negentien']);
const NL_ILLIONS = Object.freeze(['', 'duizend', 'miljoen', 'miljard', 'biljoen', 'biljard', 'triljoen', 'triljard', 'quadriljoen', 'quadriljard', 'quintiljoen', 'quintiljard']);
const NL_ILLIONS_PLURAL = Object.freeze(['', 'duizend', 'miljoen', 'miljard', 'biljoen', 'biljard', 'triljoen', 'triljard', 'quadriljoen', 'quadriljard', 'quintiljoen', 'quintiljard']);

/** Maximum supported value (10^36 - 1, up to decillions) */
const MAX_VALUE = 10n ** 36n - 1n;

const group = (n) => Math.ceil(n.toString().length / 3) - 1;
const power = (g) => 10n ** BigInt(g * 3);
const segment = (n, g) => n % power(g + 1);
const hundment = (n, g) => Number(segment(n, g) / power(g));
const tenment = (n, g) => hundment(n, g) % 100;

const tenNl = (n) => {
  if (n === 0) return '';
  if (n < 10) return NL_ONES[n];
  if (n < 20) return NL_TEENS[n - 10];
  const onesDigit = n % 10;
  const tensDigit = Math.floor(n / 10);
  if (onesDigit === 0) return NL_TENS[tensDigit];
  // Use "en" connector between ones and tens
  // Use "ën" after words ending in vowel-e (twee, drie)
  const connector = (onesDigit === 2 || onesDigit === 3) ? 'ën' : 'en';
  return `${NL_ONES[onesDigit]}${connector}${NL_TENS[tensDigit]}`;
};

const hundredNl = (n) => {
  if (n < 100 || n >= 1000) return '';
  const h = Math.floor(n / 100);
  // 100 = "honderd" (not "eenhonderd")
  if (h === 1) return 'honderd';
  return `${NL_ONES[h]}honderd`;
};

/**
 * Convert a number to Dutch words
 * @param {number|bigint} n - The number to convert
 * @returns {string|false} The Dutch word representation
 *
 * @example
 * dutch(42) // 'tweeënveertig'
 * dutch(1000) // 'duizend'
 * dutch(21) // 'eenentwintig'
 */
const dutch = (n) => {
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

  let s = '';
  for (let i = group(num); i >= 0; i--) {
    const h = hundment(num, i);
    if (h > 0) {
      if (i === 0) {
        // Units group
        if (h >= 100) s += hundredNl(h);
        const t = tenment(num, i);
        if (t > 0) s += tenNl(t);
      } else if (i === 1) {
        // Thousands: 1000 = "duizend" (not "eenduizend")
        if (h === 1) {
          s += 'duizend';
        } else {
          if (h >= 100) s += hundredNl(h);
          const t = tenment(num, i);
          if (t > 0) s += tenNl(t);
          s += 'duizend';
        }
      } else {
        // Millions and above: separated by spaces
        // 1 million = "een miljoen", 2 million = "twee miljoen"
        if (h >= 100) s += hundredNl(h);
        const t = tenment(num, i);
        if (t > 0) {
          if (t === 1) {
            s += 'een ';
          } else {
            s += tenNl(t) + ' ';
          }
        } else if (h < 100 && h === 1) {
          s += 'een ';
        }
        const illionWord = h === 1 ? NL_ILLIONS[i] : NL_ILLIONS_PLURAL[i];
        s += `${illionWord} `;
      }
    }
  }

  return s.trim();
};

export default dutch;
export { dutch };

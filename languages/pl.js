/**
 * Polish number-to-words converter
 * Handles Polish plural forms (singular, 2-4, 5+)
 * @module languages/pl
 */

const PL_ONES = Object.freeze(['', 'jeden', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć']);
const PL_TENS = Object.freeze(['', '', 'dwadzieścia', 'trzydzieści', 'czterdzieści', 'pięćdziesiąt', 'sześćdziesiąt', 'siedemdziesiąt', 'osiemdziesiąt', 'dziewięćdziesiąt']);
const PL_TEENS = Object.freeze(['dziesięć', 'jedenaście', 'dwanaście', 'trzynaście', 'czternaście', 'piętnaście', 'szesnaście', 'siedemnaście', 'osiemnaście', 'dziewiętnaście']);
const PL_HUNDREDS = Object.freeze(['', 'sto', 'dwieście', 'trzysta', 'czterysta', 'pięćset', 'sześćset', 'siedemset', 'osiemset', 'dziewięćset']);
const PL_ILLIONS = Object.freeze([
  ['', '', ''],                          // ones
  ['tysiąc', 'tysiące', 'tysięcy'],      // thousands
  ['milion', 'miliony', 'milionów'],     // millions
  ['miliard', 'miliardy', 'miliardów'], // billions
  ['bilion', 'biliony', 'bilionów'],     // trillions
  ['biliard', 'biliardy', 'biliardów'], // quadrillions
  ['trylion', 'tryliony', 'trylionów'], // quintillions
  ['tryliard', 'tryliardy', 'tryliardów'], // sextillions
  ['kwadrylion', 'kwadryliony', 'kwadrylionów'], // septillions
  ['kwadryliard', 'kwadryliardy', 'kwadryliardów'], // octillions
  ['kwintylion', 'kwintyliony', 'kwintylionów'], // nonillions
  ['kwintyliard', 'kwintyliardy', 'kwintyliardów']  // decillions
]);

/** Maximum supported value (10^36 - 1, up to decillions) */
const MAX_VALUE = 10n ** 36n - 1n;

const group = (n) => Math.ceil(n.toString().length / 3) - 1;
const power = (g) => 10n ** BigInt(g * 3);
const segment = (n, g) => n % power(g + 1);
const hundment = (n, g) => Number(segment(n, g) / power(g));
const tenment = (n, g) => hundment(n, g) % 100;

/**
 * Get the correct Polish plural form based on number
 * Polish has 3 forms: singular (1), plural 2-4, plural 5+
 * @param {number} n - The number to check
 * @param {string[]} forms - [singular, plural2_4, plural5_plus]
 * @returns {string} The correct plural form
 */
const getPlPlural = (n, forms) => {
  if (n === 1) return forms[0];
  const lastTwo = n % 100;
  const lastOne = n % 10;
  if (lastTwo >= 12 && lastTwo <= 14) return forms[2];
  if (lastOne >= 2 && lastOne <= 4) return forms[1];
  return forms[2];
};

const hundredPl = (n) => {
  if (n < 100 || n >= 1000) return '';
  return PL_HUNDREDS[Math.floor(n / 100)];
};

const tenPl = (n) => {
  if (n === 0) return '';
  if (n < 10) return PL_ONES[n];
  if (n < 20) return PL_TEENS[n - 10];
  const onesDigit = n % 10;
  const tensDigit = Math.floor(n / 10);
  if (onesDigit === 0) return PL_TENS[tensDigit];
  return `${PL_TENS[tensDigit]} ${PL_ONES[onesDigit]}`;
};

/**
 * Convert a number to Polish words
 * @param {number|bigint} n - The number to convert
 * @returns {string|false} The Polish word representation
 *
 * @example
 * polish(42) // 'czterdzieści dwa'
 * polish(1000) // 'tysiąc'
 * polish(2000) // 'dwa tysiące'
 * polish(5000) // 'pięć tysięcy'
 */
const polish = (n) => {
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

  if (num === 0n) return 'zero';

  let s = '';
  for (let i = group(num); i >= 0; i--) {
    const h = hundment(num, i);
    if (h > 0) {
      const hund = hundredPl(h);
      if (hund) s += hund + ' ';

      const t = tenment(num, i);

      if (i === 0) {
        // Units group: just tens
        const tenWord = tenPl(t);
        if (tenWord) s += tenWord + ' ';
      } else if (i === 1) {
        // Thousands
        if (h === 1 && t === 0) {
          // Just "tysiąc" for exactly 1 thousand (with possible hundreds)
          s += 'tysiąc ';
        } else {
          if (t > 0) {
            // Skip "jeden" before "tysiąc" when it's just 1
            if (t === 1) {
              s += 'tysiąc ';
            } else {
              s += tenPl(t) + ' ';
              s += getPlPlural(t, PL_ILLIONS[i]) + ' ';
            }
          } else {
            // h >= 100 with no tens portion, use h for plural
            s += getPlPlural(h, PL_ILLIONS[i]) + ' ';
          }
        }
      } else {
        // Millions and above
        if (t > 0) {
          if (t === 1) {
            s += 'jeden ';
          } else {
            s += tenPl(t) + ' ';
          }
        } else if (h < 100 && h === 1) {
          s += 'jeden ';
        }
        const illionWord = getPlPlural(t || h, PL_ILLIONS[i]);
        s += illionWord + ' ';
      }
    }
  }

  return s.trim().replace(/\s+/g, ' ');
};

export default polish;
export { polish };

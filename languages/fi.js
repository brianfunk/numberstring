/**
 * Finnish number-to-words converter
 * Finnish is agglutinative with partitive forms for plurals
 * @module languages/fi
 */

const FI_ONES = Object.freeze(['', 'yksi', 'kaksi', 'kolme', 'neljä', 'viisi', 'kuusi', 'seitsemän', 'kahdeksan', 'yhdeksän']);
const FI_TEENS = Object.freeze(['kymmenen', 'yksitoista', 'kaksitoista', 'kolmetoista', 'neljätoista', 'viisitoista', 'kuusitoista', 'seitsemäntoista', 'kahdeksantoista', 'yhdeksäntoista']);
const FI_TENS = Object.freeze(['', '', 'kaksikymmentä', 'kolmekymmentä', 'neljäkymmentä', 'viisikymmentä', 'kuusikymmentä', 'seitsemänkymmentä', 'kahdeksankymmentä', 'yhdeksänkymmentä']);
const FI_ILLIONS = Object.freeze(['', 'tuhat', 'miljoona', 'miljardi', 'biljoona', 'biljardi', 'triljoona', 'triljardi', 'kvadriljoona', 'kvadriljardi', 'kvintiljoona', 'kvintiljardi']);
const FI_ILLIONS_PLURAL = Object.freeze(['', 'tuhatta', 'miljoonaa', 'miljardia', 'biljoonaa', 'biljardia', 'triljoonaa', 'triljardia', 'kvadriljoonaa', 'kvadriljardia', 'kvintiljoonaa', 'kvintiljardia']);

const MAX_VALUE = 10n ** 36n - 1n;

const group = (n) => Math.ceil(n.toString().length / 3) - 1;
const power = (g) => 10n ** BigInt(g * 3);
const segment = (n, g) => n % power(g + 1);
const hundment = (n, g) => Number(segment(n, g) / power(g));
const tenment = (n, g) => hundment(n, g) % 100;

const tenFi = (n) => {
  if (n === 0) return '';
  if (n < 10) return FI_ONES[n];
  if (n < 20) return FI_TEENS[n - 10];
  const onesDigit = n % 10;
  const tensDigit = Math.floor(n / 10);
  if (onesDigit === 0) return FI_TENS[tensDigit];
  return `${FI_TENS[tensDigit]}${FI_ONES[onesDigit]}`;
};

const hundredFi = (n) => {
  if (n < 100 || n >= 1000) return '';
  const h = Math.floor(n / 100);
  if (h === 1) return 'sata';
  return `${FI_ONES[h]}sataa`;
};

/**
 * Convert a number to Finnish words
 * @param {number|bigint} n - The number to convert
 * @returns {string|false} The Finnish word representation
 *
 * @example
 * finnish(42) // 'neljäkymmentäkaksi'
 * finnish(1000) // 'tuhat'
 */
const finnish = (n) => {
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

  if (num === 0n) return 'nolla';
  if (num === 1n) return 'yksi';

  let s = '';
  for (let i = group(num); i >= 0; i--) {
    const h = hundment(num, i);
    if (h > 0) {
      if (i === 0) {
        if (h >= 100) s += hundredFi(h);
        const t = tenment(num, i);
        if (t > 0) s += tenFi(t);
      } else if (i === 1) {
        if (h === 1) {
          s += 'tuhat';
        } else {
          if (h >= 100) s += hundredFi(h);
          const t = tenment(num, i);
          if (t > 0) s += tenFi(t);
          s += 'tuhatta';
        }
      } else {
        if (h >= 100) s += hundredFi(h);
        const t = tenment(num, i);
        if (t > 0) {
          if (t === 1) {
            s += 'yksi ';
          } else {
            s += tenFi(t) + ' ';
          }
        } else if (h < 100 && h >= 1 && h === 1) {
          s += 'yksi ';
        }
        const illionWord = h === 1 ? FI_ILLIONS[i] : FI_ILLIONS_PLURAL[i];
        s += `${illionWord} `;
      }
    }
  }

  return s.trim();
};

export default finnish;
export { finnish };

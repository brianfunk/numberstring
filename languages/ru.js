/**
 * Russian number-to-words converter
 * Handles Russian plural forms (1, 2-4, 5-20/0)
 * @module languages/ru
 */

const RU_ONES = Object.freeze(['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять']);
const RU_ONES_FEM = Object.freeze(['', 'одна', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять']);
const RU_TENS = Object.freeze(['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто']);
const RU_TEENS = Object.freeze(['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать']);
const RU_HUNDREDS = Object.freeze(['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот']);
const RU_ILLIONS = Object.freeze([
  ['', '', ''],  // ones
  ['тысяча', 'тысячи', 'тысяч'],  // thousands (feminine)
  ['миллион', 'миллиона', 'миллионов'],  // millions
  ['миллиард', 'миллиарда', 'миллиардов'],  // billions
  ['триллион', 'триллиона', 'триллионов'],  // trillions
  ['квадриллион', 'квадриллиона', 'квадриллионов'],  // quadrillions
  ['квинтиллион', 'квинтиллиона', 'квинтиллионов'],  // quintillions
  ['секстиллион', 'секстиллиона', 'секстиллионов'],  // sextillions
  ['септиллион', 'септиллиона', 'септиллионов'],  // septillions
  ['октиллион', 'октиллиона', 'октиллионов'],  // octillions
  ['нониллион', 'нониллиона', 'нониллионов'],  // nonillions
  ['дециллион', 'дециллиона', 'дециллионов']  // decillions
]);

const MAX_VALUE = 10n ** 36n - 1n;

const group = (n) => Math.ceil(n.toString().length / 3) - 1;
const power = (g) => 10n ** BigInt(g * 3);
const segment = (n, g) => n % power(g + 1);
const hundment = (n, g) => Number(segment(n, g) / power(g));
const tenment = (n, g) => hundment(n, g) % 100;

/**
 * Get the correct Russian plural form based on number
 * Russian has 3 forms: 1, 2-4, 5-20/0
 */
const getRuPlural = (n, forms) => {
  const abs = Math.abs(n);
  const lastTwo = abs % 100;
  const lastOne = abs % 10;

  if (lastTwo >= 11 && lastTwo <= 19) {
    return forms[2];
  }
  if (lastOne === 1) {
    return forms[0];
  }
  if (lastOne >= 2 && lastOne <= 4) {
    return forms[1];
  }
  return forms[2];
};

const tenRu = (n, feminine = false) => {
  if (n === 0) return '';
  if (n < 10) return feminine ? RU_ONES_FEM[n] : RU_ONES[n];
  if (n < 20) return RU_TEENS[n - 10];
  const onesDigit = n % 10;
  const tensDigit = Math.floor(n / 10);
  if (onesDigit === 0) return RU_TENS[tensDigit];
  const oneWord = feminine ? RU_ONES_FEM[onesDigit] : RU_ONES[onesDigit];
  return `${RU_TENS[tensDigit]} ${oneWord}`;
};

const hundredRu = (n) => {
  if (n < 100 || n >= 1000) return '';
  return RU_HUNDREDS[Math.floor(n / 100)];
};

/**
 * Convert a number to Russian words
 * @param {number|bigint} n - The number to convert
 * @returns {string|false} The Russian word representation
 *
 * @example
 * russian(42) // 'сорок два'
 * russian(1000) // 'одна тысяча'
 * russian(2000) // 'две тысячи'
 */
const russian = (n) => {
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

  if (num === 0n) return 'ноль';

  let s = '';
  for (let i = group(num); i >= 0; i--) {
    const h = hundment(num, i);
    if (h > 0) {
      const isFeminine = i === 1;

      const hund = hundredRu(h);
      if (hund) s += hund + ' ';

      const t = tenment(num, i);
      const tenWord = tenRu(t, isFeminine);
      if (tenWord) s += tenWord + ' ';

      if (i > 0) {
        const illionForms = RU_ILLIONS[i];
        if (illionForms && illionForms[0]) {
          const illion = getRuPlural(t || h, illionForms);
          s += illion + ' ';
        }
      }
    }
  }

  return s.trim().replace(/\s+/g, ' ');
};

export default russian;
export { russian };

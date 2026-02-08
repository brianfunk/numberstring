/**
 * Arabic number-to-words converter
 * Uses masculine default forms with standard group-of-3 pattern
 * @module languages/ar
 */

const AR_ONES = Object.freeze(['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة']);
const AR_TEENS = Object.freeze(['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر']);
const AR_TENS = Object.freeze(['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون']);
const AR_HUNDREDS = Object.freeze(['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة']);
const AR_ILLIONS = Object.freeze([
  ['', '', ''],                         // ones
  ['ألف', 'ألفان', 'آلاف'],             // thousands
  ['مليون', 'مليونان', 'ملايين'],        // millions
  ['مليار', 'ملياران', 'مليارات'],       // billions
  ['تريليون', 'تريليونان', 'تريليونات'], // trillions
  ['كوادريليون', 'كوادريليونان', 'كوادريليونات'], // quadrillions
  ['كوينتيليون', 'كوينتيليونان', 'كوينتيليونات'], // quintillions
  ['سكستيليون', 'سكستيليونان', 'سكستيليونات'],     // sextillions
  ['سبتيليون', 'سبتيليونان', 'سبتيليونات'],       // septillions
  ['أوكتيليون', 'أوكتيليونان', 'أوكتيليونات'],     // octillions
  ['نونيليون', 'نونيليونان', 'نونيليونات'],       // nonillions
  ['ديسيليون', 'ديسيليونان', 'ديسيليونات']        // decillions
]);

/** Maximum supported value (10^36 - 1, up to decillions) */
const MAX_VALUE = 10n ** 36n - 1n;

const group = (n) => Math.ceil(n.toString().length / 3) - 1;
const power = (g) => 10n ** BigInt(g * 3);
const segment = (n, g) => n % power(g + 1);
const hundment = (n, g) => Number(segment(n, g) / power(g));
const tenment = (n, g) => hundment(n, g) % 100;

/**
 * Get the correct Arabic scale word form
 * Arabic has 3 forms: singular (1), dual (2), plural (3-10)
 * For 11+, use the singular form
 */
const getArScale = (n, forms) => {
  if (n === 1) return forms[0];
  if (n === 2) return forms[1];
  if (n >= 3 && n <= 10) return forms[2];
  return forms[0]; // 11+ uses singular
};

const hundredAr = (n) => {
  if (n < 100 || n >= 1000) return '';
  return AR_HUNDREDS[Math.floor(n / 100)];
};

const tenAr = (n) => {
  if (n === 0) return '';
  if (n < 10) return AR_ONES[n];
  if (n < 20) return AR_TEENS[n - 10];
  const onesDigit = n % 10;
  const tensDigit = Math.floor(n / 10);
  if (onesDigit === 0) return AR_TENS[tensDigit];
  // In Arabic, ones come before tens: واحد وعشرون (one and twenty)
  return `${AR_ONES[onesDigit]} و${AR_TENS[tensDigit]}`;
};

/**
 * Convert a number to Arabic words
 * @param {number|bigint} n - The number to convert
 * @returns {string|false} The Arabic word representation
 *
 * @example
 * arabic(42) // 'اثنان وأربعون'
 * arabic(1000) // 'ألف'
 */
const arabic = (n) => {
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

  if (num === 0n) return 'صفر';

  const parts = [];
  for (let i = group(num); i >= 0; i--) {
    const h = hundment(num, i);
    if (h === 0) continue;

    let chunk = '';
    const hund = hundredAr(h);
    const t = tenment(num, i);
    const tenWord = tenAr(t);

    if (hund && tenWord) {
      chunk = `${hund} و${tenWord}`;
    } else if (hund) {
      chunk = hund;
    } else if (tenWord) {
      chunk = tenWord;
    }

    if (i > 0) {
      const forms = AR_ILLIONS[i];
      if (h === 1) {
        // Just the scale word alone (e.g., ألف for 1000)
        chunk = forms[0];
      } else if (h === 2) {
        // Dual form (e.g., ألفان for 2000)
        chunk = forms[1];
      } else {
        // 3+: chunk + scale word
        const scaleWord = getArScale(h, forms);
        chunk = `${chunk} ${scaleWord}`;
      }
    }

    parts.push(chunk);
  }

  return parts.join(' و');
};

export default arabic;
export { arabic, AR_ONES, AR_TENS, AR_TEENS, AR_HUNDREDS, AR_ILLIONS, MAX_VALUE };

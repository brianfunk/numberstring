/**
 * Hindi number-to-words converter
 * Uses the Indian numbering system (lakh, crore)
 * @module languages/hi
 */

const HI_ONES = Object.freeze(['', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ']);
const HI_TENS = Object.freeze(['', '', 'बीस', 'तीस', 'चालीस', 'पचास', 'साठ', 'सत्तर', 'अस्सी', 'नब्बे']);
const HI_TEENS = Object.freeze(['दस', 'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस']);

// Special Hindi words for numbers 21-99 that are irregular
const HI_SPECIAL = Object.freeze({
  21: 'इक्कीस', 22: 'बाईस', 23: 'तेईस', 24: 'चौबीस', 25: 'पच्चीस',
  26: 'छब्बीस', 27: 'सत्ताईस', 28: 'अट्ठाईस', 29: 'उनतीस',
  31: 'इकतीस', 32: 'बत्तीस', 33: 'तैंतीस', 34: 'चौंतीस', 35: 'पैंतीस',
  36: 'छत्तीस', 37: 'सैंतीस', 38: 'अड़तीस', 39: 'उनतालीस',
  41: 'इकतालीस', 42: 'बयालीस', 43: 'तैंतालीस', 44: 'चवालीस', 45: 'पैंतालीस',
  46: 'छियालीस', 47: 'सैंतालीस', 48: 'अड़तालीस', 49: 'उनचास',
  51: 'इक्यावन', 52: 'बावन', 53: 'तिरपन', 54: 'चौवन', 55: 'पचपन',
  56: 'छप्पन', 57: 'सत्तावन', 58: 'अट्ठावन', 59: 'उनसठ',
  61: 'इकसठ', 62: 'बासठ', 63: 'तिरसठ', 64: 'चौंसठ', 65: 'पैंसठ',
  66: 'छियासठ', 67: 'सड़सठ', 68: 'अड़सठ', 69: 'उनहत्तर',
  71: 'इकहत्तर', 72: 'बहत्तर', 73: 'तिहत्तर', 74: 'चौहत्तर', 75: 'पचहत्तर',
  76: 'छिहत्तर', 77: 'सतहत्तर', 78: 'अठहत्तर', 79: 'उनासी',
  81: 'इक्यासी', 82: 'बयासी', 83: 'तिरासी', 84: 'चौरासी', 85: 'पचासी',
  86: 'छियासी', 87: 'सत्तासी', 88: 'अट्ठासी', 89: 'नवासी',
  91: 'इक्यानवे', 92: 'बानवे', 93: 'तिरानवे', 94: 'चौरानवे', 95: 'पचानवे',
  96: 'छियानवे', 97: 'सत्तानवे', 98: 'अट्ठानवे', 99: 'निन्यानवे'
});

const MAX_VALUE = 10n ** 36n - 1n;

/**
 * Convert a number to Hindi words (internal helper)
 */
const hindiInternal = (n) => {
  if (n === 0) return '';
  if (n < 10) return HI_ONES[n];
  if (n < 20) return HI_TEENS[n - 10];
  if (HI_SPECIAL[n]) return HI_SPECIAL[n];
  if (n < 100) {
    const onesDigit = n % 10;
    if (onesDigit === 0) return HI_TENS[Math.floor(n / 10)];
  }

  // For larger numbers, use position-based system
  let s = '';
  let remaining = n;

  // Crore (10 million)
  const crores = Math.floor(remaining / 10000000);
  if (crores > 0) {
    s += hindiInternal(crores) + ' करोड़ ';
    remaining %= 10000000;
  }

  // Lakh (100 thousand)
  const lakhs = Math.floor(remaining / 100000);
  if (lakhs > 0) {
    s += hindiInternal(lakhs) + ' लाख ';
    remaining %= 100000;
  }

  // Thousand
  const thousands = Math.floor(remaining / 1000);
  if (thousands > 0) {
    s += hindiInternal(thousands) + ' हज़ार ';
    remaining %= 1000;
  }

  // Hundred
  const hundreds = Math.floor(remaining / 100);
  if (hundreds > 0) {
    s += hindiInternal(hundreds) + ' सौ ';
    remaining %= 100;
  }

  // Tens and ones
  if (remaining > 0) {
    if (HI_SPECIAL[remaining]) {
      s += HI_SPECIAL[remaining];
    } else if (remaining < 10) {
      s += HI_ONES[remaining];
    } else if (remaining < 20) {
      s += HI_TEENS[remaining - 10];
    } else {
      s += HI_TENS[Math.floor(remaining / 10)];
    }
  }

  return s.trim();
};

/**
 * Convert a number to Hindi words
 * @param {number|bigint} n - The number to convert
 * @returns {string|false} The Hindi word representation
 *
 * @example
 * hindi(42) // 'बयालीस'
 * hindi(100000) // 'एक लाख'
 */
const hindi = (n) => {
  let num;

  if (typeof n === 'bigint') {
    if (n < 0n || n > MAX_VALUE) return false;
    num = Number(n);
    if (n > BigInt(Number.MAX_SAFE_INTEGER)) return false;
  } else if (typeof n === 'number') {
    if (isNaN(n) || n < 0 || !Number.isInteger(n)) return false;
    if (n > Number.MAX_SAFE_INTEGER) return false;
    num = n;
  } else {
    return false;
  }

  if (num === 0) return 'शून्य';

  return hindiInternal(num);
};

export default hindi;
export { hindi };

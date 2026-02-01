/**
 * Portuguese number-to-words converter
 * @module languages/pt
 */

const PT_ONES = Object.freeze(['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove']);
const PT_TENS = Object.freeze(['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa']);
const PT_TEENS = Object.freeze(['dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove']);
const PT_HUNDREDS = Object.freeze(['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos']);
const PT_ILLIONS = Object.freeze(['', 'mil', 'milhão', 'bilhão', 'trilhão', 'quatrilhão', 'quintilhão', 'sextilhão', 'septilhão', 'octilhão', 'nonilhão', 'decilhão']);
const PT_ILLIONS_PLURAL = Object.freeze(['', 'mil', 'milhões', 'bilhões', 'trilhões', 'quatrilhões', 'quintilhões', 'sextilhões', 'septilhões', 'octilhões', 'nonilhões', 'decilhões']);

const MAX_VALUE = 10n ** 36n - 1n;

const group = (n) => Math.ceil(n.toString().length / 3) - 1;
const power = (g) => 10n ** BigInt(g * 3);
const segment = (n, g) => n % power(g + 1);
const hundment = (n, g) => Number(segment(n, g) / power(g));
const tenment = (n, g) => hundment(n, g) % 100;

const hundredPt = (n) => {
  if (n < 100 || n >= 1000) return '';
  const h = Math.floor(n / 100);
  const remainder = n % 100;
  // "cem" when exactly 100, "cento" otherwise
  if (h === 1 && remainder === 0) return 'cem';
  return PT_HUNDREDS[h];
};

const tenPt = (n) => {
  if (n === 0) return '';
  if (n < 10) return PT_ONES[n];
  if (n < 20) return PT_TEENS[n - 10];
  const onesDigit = n % 10;
  if (onesDigit) return `${PT_TENS[Math.floor(n / 10)]} e ${PT_ONES[onesDigit]}`;
  return PT_TENS[Math.floor(n / 10)];
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
 * Convert a number to Portuguese words
 * @param {number|bigint} n - The number to convert
 * @param {Object} [opt] - Options object
 * @returns {string|false} The Portuguese word representation
 *
 * @example
 * portuguese(42) // 'quarenta e dois'
 * portuguese(1000) // 'mil'
 */
const portuguese = (n, opt) => {
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
  if (num === 1n) return 'um';

  const parts = [];

  for (let i = group(num); i >= 0; i--) {
    const h = hundment(num, i);
    if (h > 0) {
      let part = '';

      const hundreds = Math.floor(h / 100);
      const tens = h % 100;

      if (hundreds > 0) {
        part += hundredPt(h);
        if (tens > 0) part += ' e ';
      }

      if (tens > 0) {
        part += tenPt(tens);
      }

      if (i > 0) {
        // Add scale word (mil, milhão, etc.)
        if (i === 1) {
          // "mil" doesn't change for plural and doesn't need "um" before it
          if (h === 1) {
            part = 'mil';
          } else {
            part += ' mil';
          }
        } else {
          // milhão, bilhão, etc. - use singular for 1, plural for others
          const scaleWord = h === 1 ? PT_ILLIONS[i] : PT_ILLIONS_PLURAL[i];
          part += ` ${scaleWord}`;
        }
      }

      parts.push(part);
    }
  }

  // Join parts with appropriate connectors
  let result = '';
  for (let i = 0; i < parts.length; i++) {
    if (i > 0) {
      // Use "e" (and) for connecting in Portuguese
      const prevPart = parts[i - 1];
      const currPart = parts[i];
      // Add "e" when the current part is less than 100 or ends with 00
      if (currPart && !currPart.includes('mil') && !currPart.includes('ilhão') && !currPart.includes('ilhões')) {
        result += ' e ';
      } else {
        result += ' ';
      }
    }
    result += parts[i];
  }

  result = result.trim();
  if (opt?.cap) result = cap(result, opt.cap);
  return result;
};

export default portuguese;
export { portuguese };

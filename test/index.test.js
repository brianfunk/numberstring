import { describe, it, expect } from 'vitest';
import numberstring, { comma, group, ordinal, decimal, currency, roman, parse, negative, fraction, year, telephone, percent, spanish, french, german, danish, chinese, hindi, russian, toWords } from '../index.js';

describe('numberstring', () => {
  describe('basic conversions', () => {
    it('returns a string from a number', () => {
      expect(typeof numberstring(1)).toBe('string');
    });

    it('converts zero', () => {
      expect(numberstring(0)).toBe('zero');
    });

    it('converts single digits', () => {
      expect(numberstring(1)).toBe('one');
      expect(numberstring(5)).toBe('five');
      expect(numberstring(9)).toBe('nine');
    });

    it('converts teens', () => {
      expect(numberstring(10)).toBe('ten');
      expect(numberstring(11)).toBe('eleven');
      expect(numberstring(15)).toBe('fifteen');
      expect(numberstring(19)).toBe('nineteen');
    });

    it('converts tens', () => {
      expect(numberstring(20)).toBe('twenty');
      expect(numberstring(50)).toBe('fifty');
      expect(numberstring(90)).toBe('ninety');
    });

    it('converts tens with ones', () => {
      expect(numberstring(21)).toBe('twenty-one');
      expect(numberstring(55)).toBe('fifty-five');
      expect(numberstring(99)).toBe('ninety-nine');
    });

    it('converts hundreds', () => {
      expect(numberstring(100)).toBe('one hundred');
      expect(numberstring(500)).toBe('five hundred');
      expect(numberstring(999)).toBe('nine hundred ninety-nine');
    });

    it('converts hundreds with complex numbers', () => {
      expect(numberstring(101)).toBe('one hundred one');
      expect(numberstring(110)).toBe('one hundred ten');
      expect(numberstring(115)).toBe('one hundred fifteen');
      expect(numberstring(155)).toBe('one hundred fifty-five');
    });
  });

  describe('thousands and beyond', () => {
    it('converts thousands', () => {
      expect(numberstring(1000)).toBe('one thousand');
      expect(numberstring(5000)).toBe('five thousand');
      expect(numberstring(50000)).toBe('fifty thousand');
      expect(numberstring(500000)).toBe('five hundred thousand');
    });

    it('converts millions', () => {
      expect(numberstring(1000000)).toBe('one million');
      expect(numberstring(5000000)).toBe('five million');
      expect(numberstring(5555555)).toBe('five million five hundred fifty-five thousand five hundred fifty-five');
    });

    it('converts billions', () => {
      expect(numberstring(1000000000)).toBe('one billion');
      expect(numberstring(1234567890)).toBe('one billion two hundred thirty-four million five hundred sixty-seven thousand eight hundred ninety');
    });

    it('converts trillions', () => {
      expect(numberstring(1000000000000)).toBe('one trillion');
    });

    it('converts quadrillions (bug fix)', () => {
      expect(numberstring(1000000000000000)).toBe('one quadrillion');
      expect(numberstring(5000000000000000)).toBe('five quadrillion');
    });

    it('returns false for regular numbers exceeding MAX_SAFE_INTEGER', () => {
      // Regular numbers lose precision above MAX_SAFE_INTEGER
      expect(numberstring(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
    });

    it('handles MAX_SAFE_INTEGER', () => {
      // MAX_SAFE_INTEGER = 9007199254740991 (about 9 quadrillion)
      const result = numberstring(Number.MAX_SAFE_INTEGER);
      expect(result).toContain('quadrillion');
      expect(typeof result).toBe('string');
    });
  });

  describe('BigInt support', () => {
    it('converts BigInt zero', () => {
      expect(numberstring(0n)).toBe('zero');
    });

    it('converts small BigInts', () => {
      expect(numberstring(42n)).toBe('forty-two');
      expect(numberstring(100n)).toBe('one hundred');
      expect(numberstring(1000n)).toBe('one thousand');
    });

    it('converts quintillions with BigInt', () => {
      expect(numberstring(10n ** 18n)).toBe('one quintillion');
      expect(numberstring(5n * 10n ** 18n)).toBe('five quintillion');
    });

    it('converts sextillions with BigInt', () => {
      expect(numberstring(10n ** 21n)).toBe('one sextillion');
    });

    it('converts septillions with BigInt', () => {
      expect(numberstring(10n ** 24n)).toBe('one septillion');
    });

    it('converts octillions with BigInt', () => {
      expect(numberstring(10n ** 27n)).toBe('one octillion');
    });

    it('converts nonillions with BigInt', () => {
      expect(numberstring(10n ** 30n)).toBe('one nonillion');
    });

    it('converts decillions with BigInt', () => {
      expect(numberstring(10n ** 33n)).toBe('one decillion');
    });

    it('converts complex large BigInts', () => {
      const result = numberstring(123456789012345678901234567890n);
      expect(result).toContain('octillion');
      expect(result).toContain('septillion');
      expect(result).toContain('sextillion');
    });

    it('returns false for negative BigInts', () => {
      expect(numberstring(-1n)).toBe(false);
      expect(numberstring(-1000000000000000000n)).toBe(false);
    });

    it('returns false for BigInts exceeding decillions', () => {
      // 10^36 is beyond our supported range
      expect(numberstring(10n ** 36n)).toBe(false);
    });

    it('applies options to BigInt conversions', () => {
      expect(numberstring(10n ** 18n, { cap: 'title' })).toBe('One Quintillion');
      expect(numberstring(10n ** 18n, { cap: 'upper' })).toBe('ONE QUINTILLION');
      expect(numberstring(10n ** 18n, { punc: '!' })).toBe('one quintillion!');
    });
  });

  describe('invalid inputs', () => {
    it('returns false for non-numbers', () => {
      expect(numberstring('one')).toBe(false);
      expect(numberstring('123')).toBe(false);
    });

    it('returns false for NaN', () => {
      expect(numberstring(NaN)).toBe(false);
    });

    it('returns false for negative numbers', () => {
      expect(numberstring(-1)).toBe(false);
      expect(numberstring(-100)).toBe(false);
    });

    it('returns false for numbers exceeding MAX_SAFE_INTEGER', () => {
      expect(numberstring(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
    });

    it('returns false for boolean values', () => {
      expect(numberstring(false)).toBe(false);
      expect(numberstring(true)).toBe(false);
    });

    it('returns false for null and undefined', () => {
      expect(numberstring(null)).toBe(false);
      expect(numberstring(undefined)).toBe(false);
    });

    it('returns false for objects and arrays', () => {
      expect(numberstring({})).toBe(false);
      expect(numberstring([])).toBe(false);
    });
  });

  describe('capitalization options', () => {
    it('applies lowercase (default behavior)', () => {
      expect(numberstring(500, { cap: 'lower' })).toBe('five hundred');
    });

    it('applies uppercase', () => {
      expect(numberstring(500, { cap: 'upper' })).toBe('FIVE HUNDRED');
    });

    it('applies title case', () => {
      expect(numberstring(500, { cap: 'title' })).toBe('Five Hundred');
    });

    it('applies title case with hyphenated numbers', () => {
      expect(numberstring(55, { cap: 'title' })).toBe('Fifty-Five');
      expect(numberstring(99, { cap: 'title' })).toBe('Ninety-Nine');
    });

    it('ignores invalid capitalization option', () => {
      expect(numberstring(500, { cap: 'topper' })).toBe('five hundred');
      expect(numberstring(500, { cap: '' })).toBe('five hundred');
    });
  });

  describe('punctuation options', () => {
    it('adds exclamation mark', () => {
      expect(numberstring(500, { punc: '!' })).toBe('five hundred!');
    });

    it('adds question mark', () => {
      expect(numberstring(500, { punc: '?' })).toBe('five hundred?');
    });

    it('adds period', () => {
      expect(numberstring(500, { punc: '.' })).toBe('five hundred.');
    });

    it('ignores invalid punctuation', () => {
      expect(numberstring(500, { punc: '&' })).toBe('five hundred');
      expect(numberstring(500, { punc: '@' })).toBe('five hundred');
      expect(numberstring(500, { punc: '' })).toBe('five hundred');
    });

    it('handles null/undefined punctuation (bug fix)', () => {
      expect(numberstring(500, { punc: null })).toBe('five hundred');
      expect(numberstring(500, { punc: undefined })).toBe('five hundred');
    });
  });

  describe('combined options', () => {
    it('applies both capitalization and punctuation', () => {
      expect(numberstring(55, { cap: 'title', punc: '!' })).toBe('Fifty-Five!');
      expect(numberstring(100, { cap: 'upper', punc: '.' })).toBe('ONE HUNDRED.');
    });

    it('handles empty options object', () => {
      expect(numberstring(42, {})).toBe('forty-two');
    });
  });
});

describe('ordinal', () => {
  describe('basic ordinals', () => {
    it('converts 1-9 to ordinals', () => {
      expect(ordinal(1)).toBe('first');
      expect(ordinal(2)).toBe('second');
      expect(ordinal(3)).toBe('third');
      expect(ordinal(4)).toBe('fourth');
      expect(ordinal(5)).toBe('fifth');
      expect(ordinal(6)).toBe('sixth');
      expect(ordinal(7)).toBe('seventh');
      expect(ordinal(8)).toBe('eighth');
      expect(ordinal(9)).toBe('ninth');
    });

    it('converts teens to ordinals', () => {
      expect(ordinal(10)).toBe('tenth');
      expect(ordinal(11)).toBe('eleventh');
      expect(ordinal(12)).toBe('twelfth');
      expect(ordinal(13)).toBe('thirteenth');
      expect(ordinal(14)).toBe('fourteenth');
      expect(ordinal(15)).toBe('fifteenth');
      expect(ordinal(19)).toBe('nineteenth');
    });

    it('converts tens to ordinals', () => {
      expect(ordinal(20)).toBe('twentieth');
      expect(ordinal(30)).toBe('thirtieth');
      expect(ordinal(40)).toBe('fortieth');
      expect(ordinal(50)).toBe('fiftieth');
      expect(ordinal(90)).toBe('ninetieth');
    });

    it('converts compound numbers to ordinals', () => {
      expect(ordinal(21)).toBe('twenty-first');
      expect(ordinal(22)).toBe('twenty-second');
      expect(ordinal(23)).toBe('twenty-third');
      expect(ordinal(42)).toBe('forty-second');
      expect(ordinal(99)).toBe('ninety-ninth');
    });
  });

  describe('larger ordinals', () => {
    it('converts hundreds to ordinals', () => {
      expect(ordinal(100)).toBe('one hundredth');
      expect(ordinal(101)).toBe('one hundred first');
      expect(ordinal(200)).toBe('two hundredth');
    });

    it('converts thousands to ordinals', () => {
      expect(ordinal(1000)).toBe('one thousandth');
      expect(ordinal(1001)).toBe('one thousand first');
    });

    it('converts millions to ordinals', () => {
      expect(ordinal(1000000)).toBe('one millionth');
    });
  });

  describe('ordinal options', () => {
    it('applies capitalization', () => {
      expect(ordinal(1, { cap: 'title' })).toBe('First');
      expect(ordinal(21, { cap: 'upper' })).toBe('TWENTY-FIRST');
    });
  });

  describe('ordinal edge cases', () => {
    it('returns false for zero', () => {
      expect(ordinal(0)).toBe(false);
    });

    it('returns false for negative numbers', () => {
      expect(ordinal(-1)).toBe(false);
    });

    it('returns false for non-numbers', () => {
      expect(ordinal('first')).toBe(false);
    });
  });
});

describe('decimal', () => {
  describe('basic decimals', () => {
    it('converts simple decimals', () => {
      expect(decimal(3.14)).toBe('three point one four');
      expect(decimal(0.5)).toBe('zero point five');
      expect(decimal(1.0)).toBe('one');
    });

    it('converts decimals with many digits', () => {
      expect(decimal(3.14159)).toBe('three point one four one five nine');
    });

    it('converts whole numbers (no decimal part)', () => {
      expect(decimal(42)).toBe('forty-two');
      expect(decimal(100)).toBe('one hundred');
    });

    it('converts decimals starting with zero', () => {
      expect(decimal(0.123)).toBe('zero point one two three');
    });
  });

  describe('decimal with zeros', () => {
    it('handles zeros in decimal part', () => {
      expect(decimal(1.01)).toBe('one point zero one');
      expect(decimal(10.001)).toBe('ten point zero zero one');
    });
  });

  describe('negative decimals', () => {
    it('converts negative decimals', () => {
      expect(decimal(-3.14)).toBe('negative three point one four');
      expect(decimal(-0.5)).toBe('negative zero point five');
    });
  });

  describe('decimal from string', () => {
    it('accepts string input', () => {
      expect(decimal('3.14')).toBe('three point one four');
      expect(decimal('0.001')).toBe('zero point zero zero one');
    });
  });

  describe('decimal options', () => {
    it('applies capitalization', () => {
      expect(decimal(3.14, { cap: 'title' })).toBe('Three Point One Four');
    });

    it('uses custom point word', () => {
      expect(decimal(3.14, { point: 'dot' })).toBe('three dot one four');
    });
  });

  describe('decimal edge cases', () => {
    it('returns false for invalid input', () => {
      expect(decimal('abc')).toBe(false);
      expect(decimal(NaN)).toBe(false);
    });
  });
});

describe('currency', () => {
  describe('USD', () => {
    it('converts dollar amounts with symbol', () => {
      expect(currency('$1')).toBe('one dollar');
      expect(currency('$1.00')).toBe('one dollar');
      expect(currency('$5')).toBe('five dollars');
      expect(currency('$100')).toBe('one hundred dollars');
    });

    it('converts dollars and cents', () => {
      expect(currency('$1.01')).toBe('one dollar and one cent');
      expect(currency('$1.50')).toBe('one dollar and fifty cents');
      expect(currency('$123.45')).toBe('one hundred twenty-three dollars and forty-five cents');
    });

    it('converts with currency option', () => {
      expect(currency(50, { currency: '$' })).toBe('fifty dollars');
      expect(currency(50, { currency: 'USD' })).toBe('fifty dollars');
    });
  });

  describe('EUR', () => {
    it('converts euro amounts', () => {
      expect(currency('€1')).toBe('one euro');
      expect(currency('€5')).toBe('five euros');
      expect(currency('€1.50')).toBe('one euro and fifty cents');
    });

    it('converts with EUR code', () => {
      expect(currency(100, { currency: 'EUR' })).toBe('one hundred euros');
    });
  });

  describe('GBP', () => {
    it('converts pound amounts', () => {
      expect(currency('£1')).toBe('one pound');
      expect(currency('£5')).toBe('five pounds');
    });

    it('uses pence/penny correctly', () => {
      expect(currency('£1.01')).toBe('one pound and one penny');
      expect(currency('£1.50')).toBe('one pound and fifty pence');
    });
  });

  describe('JPY', () => {
    it('converts yen amounts (no subunit)', () => {
      expect(currency('¥100')).toBe('one hundred yen');
      expect(currency('¥1000')).toBe('one thousand yen');
    });
  });

  describe('INR', () => {
    it('converts rupee amounts', () => {
      expect(currency('₹1')).toBe('one rupee');
      expect(currency('₹100')).toBe('one hundred rupees');
    });

    it('uses paisa/paise correctly', () => {
      expect(currency('₹1.01')).toBe('one rupee and one paisa');
      expect(currency('₹1.50')).toBe('one rupee and fifty paise');
    });
  });

  describe('currency options', () => {
    it('applies capitalization', () => {
      expect(currency('$100', { cap: 'title' })).toBe('One Hundred Dollars');
    });
  });

  describe('currency edge cases', () => {
    it('returns false for missing currency', () => {
      expect(currency(100)).toBe(false);
      expect(currency('100')).toBe(false);
    });

    it('returns false for invalid amounts', () => {
      expect(currency('$abc')).toBe(false);
      expect(currency('$-100')).toBe(false);
    });
  });
});

describe('roman', () => {
  describe('basic roman numerals', () => {
    it('converts 1-10', () => {
      expect(roman(1)).toBe('I');
      expect(roman(2)).toBe('II');
      expect(roman(3)).toBe('III');
      expect(roman(4)).toBe('IV');
      expect(roman(5)).toBe('V');
      expect(roman(6)).toBe('VI');
      expect(roman(7)).toBe('VII');
      expect(roman(8)).toBe('VIII');
      expect(roman(9)).toBe('IX');
      expect(roman(10)).toBe('X');
    });

    it('converts larger numbers', () => {
      expect(roman(42)).toBe('XLII');
      expect(roman(99)).toBe('XCIX');
      expect(roman(100)).toBe('C');
      expect(roman(500)).toBe('D');
      expect(roman(1000)).toBe('M');
    });

    it('converts complex numbers', () => {
      expect(roman(1999)).toBe('MCMXCIX');
      expect(roman(2024)).toBe('MMXXIV');
      expect(roman(3999)).toBe('MMMCMXCIX');
    });
  });

  describe('roman options', () => {
    it('converts to lowercase', () => {
      expect(roman(42, { lower: true })).toBe('xlii');
      expect(roman(1999, { lower: true })).toBe('mcmxcix');
    });
  });

  describe('roman edge cases', () => {
    it('returns false for 0', () => {
      expect(roman(0)).toBe(false);
    });

    it('returns false for negative numbers', () => {
      expect(roman(-1)).toBe(false);
    });

    it('returns false for numbers over 3999', () => {
      expect(roman(4000)).toBe(false);
    });

    it('returns false for non-integers', () => {
      expect(roman(3.14)).toBe(false);
    });

    it('returns false for non-numbers', () => {
      expect(roman('X')).toBe(false);
    });
  });
});

describe('parse', () => {
  describe('basic parsing', () => {
    it('parses zero', () => {
      expect(parse('zero')).toBe(0);
    });

    it('parses single digits', () => {
      expect(parse('one')).toBe(1);
      expect(parse('five')).toBe(5);
      expect(parse('nine')).toBe(9);
    });

    it('parses teens', () => {
      expect(parse('ten')).toBe(10);
      expect(parse('eleven')).toBe(11);
      expect(parse('fifteen')).toBe(15);
      expect(parse('nineteen')).toBe(19);
    });

    it('parses tens', () => {
      expect(parse('twenty')).toBe(20);
      expect(parse('fifty')).toBe(50);
      expect(parse('ninety')).toBe(90);
    });

    it('parses compound numbers', () => {
      expect(parse('twenty-one')).toBe(21);
      expect(parse('forty-two')).toBe(42);
      expect(parse('ninety-nine')).toBe(99);
    });
  });

  describe('parsing larger numbers', () => {
    it('parses hundreds', () => {
      expect(parse('one hundred')).toBe(100);
      expect(parse('five hundred')).toBe(500);
      expect(parse('one hundred twenty-three')).toBe(123);
    });

    it('parses thousands', () => {
      expect(parse('one thousand')).toBe(1000);
      expect(parse('five thousand')).toBe(5000);
      expect(parse('one thousand two hundred thirty-four')).toBe(1234);
    });

    it('parses millions', () => {
      expect(parse('one million')).toBe(1000000);
      expect(parse('one million two hundred thirty-four thousand five hundred sixty-seven')).toBe(1234567);
    });

    it('parses billions', () => {
      expect(parse('one billion')).toBe(1000000000);
    });

    it('parses trillions', () => {
      expect(parse('one trillion')).toBe(1000000000000);
    });
  });

  describe('parsing with "and"', () => {
    it('ignores "and" in input', () => {
      expect(parse('one hundred and twenty-three')).toBe(123);
      expect(parse('one thousand and one')).toBe(1001);
    });
  });

  describe('parsing BigInt scale', () => {
    it('parses quintillions as BigInt', () => {
      expect(parse('one quintillion')).toBe(1000000000000000000n);
    });
  });

  describe('parse edge cases', () => {
    it('handles case insensitivity', () => {
      expect(parse('FORTY-TWO')).toBe(42);
      expect(parse('One Hundred')).toBe(100);
    });

    it('returns false for invalid input', () => {
      expect(parse('hello')).toBe(false);
      expect(parse('')).toBe(false);
      expect(parse(123)).toBe(false);
    });
  });
});

describe('spanish', () => {
  it('converts basic numbers', () => {
    expect(spanish(0)).toBe('cero');
    expect(spanish(1)).toBe('uno');
    expect(spanish(10)).toBe('diez');
    expect(spanish(15)).toBe('quince');
    expect(spanish(21)).toBe('veintiuno');
    expect(spanish(42)).toBe('cuarenta y dos');
  });

  it('converts hundreds', () => {
    expect(spanish(100)).toBe('ciento');
    expect(spanish(500)).toBe('quinientos');
  });

  it('converts thousands', () => {
    expect(spanish(1000)).toBe('mil');
    expect(spanish(2000)).toBe('dos mil');
  });

  it('applies capitalization', () => {
    expect(spanish(42, { cap: 'title' })).toBe('Cuarenta Y Dos');
  });
});

describe('french', () => {
  it('converts basic numbers', () => {
    expect(french(0)).toBe('zéro');
    expect(french(1)).toBe('un');
    expect(french(10)).toBe('dix');
    expect(french(15)).toBe('quinze');
    expect(french(21)).toBe('vingt et un');
    expect(french(42)).toBe('quarante-deux');
  });

  it('handles special French counting (70s, 80s, 90s)', () => {
    expect(french(70)).toBe('soixante-dix');
    expect(french(71)).toBe('soixante et onze');
    expect(french(80)).toBe('quatre-vingts');
    expect(french(81)).toBe('quatre-vingt-un');
    expect(french(90)).toBe('quatre-vingt-dix');
    expect(french(91)).toBe('quatre-vingt-onze');
  });

  it('converts thousands', () => {
    expect(french(1000)).toBe('mille');
    expect(french(2000)).toBe('deux mille');
  });
});

describe('chinese', () => {
  it('converts basic numbers', () => {
    expect(chinese(0)).toBe('零');
    expect(chinese(1)).toBe('一');
    expect(chinese(10)).toBe('十');
    expect(chinese(11)).toBe('十一');
    expect(chinese(42)).toBe('四十二');
    expect(chinese(100)).toBe('一百');
  });

  it('handles zeros in the middle', () => {
    expect(chinese(101)).toBe('一百零一');
    expect(chinese(1001)).toBe('一千零一');
  });

  it('converts thousands and wan', () => {
    expect(chinese(1000)).toBe('一千');
    expect(chinese(10000)).toBe('一万');
    expect(chinese(100000000)).toBe('一亿');
  });
});

describe('hindi', () => {
  it('converts basic numbers', () => {
    expect(hindi(0)).toBe('शून्य');
    expect(hindi(1)).toBe('एक');
    expect(hindi(10)).toBe('दस');
    expect(hindi(42)).toBe('बयालीस');
  });

  it('converts with Indian numbering system', () => {
    expect(hindi(100)).toBe('एक सौ');
    expect(hindi(1000)).toBe('एक हज़ार');
    expect(hindi(100000)).toBe('एक लाख');
    expect(hindi(10000000)).toBe('एक करोड़');
  });
});

describe('german', () => {
  it('converts basic numbers', () => {
    expect(german(0)).toBe('null');
    expect(german(1)).toBe('eins');
    expect(german(10)).toBe('zehn');
    expect(german(11)).toBe('elf');
    expect(german(12)).toBe('zwölf');
  });

  it('converts tens with ones (reversed order)', () => {
    expect(german(21)).toBe('einundzwanzig');
    expect(german(42)).toBe('zweiundvierzig');
    expect(german(99)).toBe('neunundneunzig');
  });

  it('converts hundreds', () => {
    expect(german(100)).toBe('einhundert');
    expect(german(200)).toBe('zweihundert');
    expect(german(123)).toBe('einhundertdreiundzwanzig');
  });

  it('converts thousands', () => {
    expect(german(1000)).toBe('eintausend');
    expect(german(2000)).toBe('zweitausend');
    expect(german(1234)).toBe('eintausendzweihundertvierunddreißig');
  });

  it('converts millions', () => {
    expect(german(1000000)).toBe('eine Million');
    expect(german(2000000)).toBe('zwei Millionen');
  });
});

describe('danish', () => {
  it('converts basic numbers', () => {
    expect(danish(0)).toBe('nul');
    expect(danish(1)).toBe('en');
    expect(danish(10)).toBe('ti');
    expect(danish(11)).toBe('elleve');
    expect(danish(12)).toBe('tolv');
  });

  it('converts tens with ones (reversed order)', () => {
    expect(danish(21)).toBe('enogtyve');
    expect(danish(42)).toBe('toogfyrre');
    expect(danish(50)).toBe('halvtreds');
    expect(danish(99)).toBe('nioghalvfems');
  });

  it('converts hundreds', () => {
    expect(danish(100)).toBe('ethundrede');
    expect(danish(200)).toBe('tohundrede');
  });

  it('converts thousands', () => {
    expect(danish(1000)).toBe('ettusind');
    expect(danish(2000)).toBe('totusind');
  });

  it('converts millions', () => {
    expect(danish(1000000)).toBe('en million');
    expect(danish(2000000)).toBe('to millioner');
  });
});

describe('russian', () => {
  it('converts basic numbers', () => {
    expect(russian(0)).toBe('ноль');
    expect(russian(1)).toBe('один');
    expect(russian(2)).toBe('два');
    expect(russian(10)).toBe('десять');
    expect(russian(11)).toBe('одиннадцать');
    expect(russian(21)).toBe('двадцать один');
    expect(russian(42)).toBe('сорок два');
  });

  it('converts hundreds', () => {
    expect(russian(100)).toBe('сто');
    expect(russian(200)).toBe('двести');
    expect(russian(300)).toBe('триста');
    expect(russian(500)).toBe('пятьсот');
  });

  it('uses feminine for thousands', () => {
    expect(russian(1000)).toBe('одна тысяча');
    expect(russian(2000)).toBe('две тысячи');
    expect(russian(5000)).toBe('пять тысяч');
  });

  it('uses correct plural forms', () => {
    expect(russian(1000000)).toBe('один миллион');
    expect(russian(2000000)).toBe('два миллиона');
    expect(russian(5000000)).toBe('пять миллионов');
  });
});

describe('negative', () => {
  it('converts negative numbers', () => {
    expect(negative(-1)).toBe('negative one');
    expect(negative(-42)).toBe('negative forty-two');
    expect(negative(-100)).toBe('negative one hundred');
  });

  it('handles positive numbers normally', () => {
    expect(negative(42)).toBe('forty-two');
    expect(negative(0)).toBe('zero');
  });

  it('handles negative BigInts', () => {
    expect(negative(-1000n)).toBe('negative one thousand');
  });

  it('applies capitalization', () => {
    expect(negative(-42, { cap: 'title' })).toBe('Negative Forty-Two');
  });

  it('returns false for invalid input', () => {
    expect(negative('abc')).toBe(false);
    expect(negative(NaN)).toBe(false);
  });
});

describe('fraction', () => {
  it('converts common fractions', () => {
    expect(fraction(1, 2)).toBe('one half');
    expect(fraction(1, 3)).toBe('one third');
    expect(fraction(1, 4)).toBe('one quarter');
    expect(fraction(3, 4)).toBe('three quarters');
  });

  it('pluralizes correctly', () => {
    expect(fraction(2, 3)).toBe('two thirds');
    expect(fraction(5, 8)).toBe('five eighths');
  });

  it('handles uncommon denominators', () => {
    expect(fraction(1, 7)).toBe('one seventh');
    expect(fraction(3, 11)).toBe('three elevenths');
  });

  it('applies capitalization', () => {
    expect(fraction(1, 2, { cap: 'title' })).toBe('One Half');
  });

  it('returns false for invalid input', () => {
    expect(fraction(1, 0)).toBe(false);
    expect(fraction(-1, 2)).toBe(false);
    expect(fraction('one', 2)).toBe(false);
  });
});

describe('year', () => {
  it('converts years in spoken style', () => {
    expect(year(1984)).toBe('nineteen eighty-four');
    expect(year(1999)).toBe('nineteen ninety-nine');
    expect(year(2024)).toBe('twenty twenty-four');
  });

  it('handles special years', () => {
    expect(year(2000)).toBe('two thousand');
    expect(year(2001)).toBe('two thousand one');
    expect(year(1900)).toBe('nineteen hundred');
  });

  it('handles small years', () => {
    expect(year(0)).toBe('zero');
    expect(year(42)).toBe('forty-two');
    expect(year(500)).toBe('five hundred');
  });

  it('applies capitalization', () => {
    expect(year(1984, { cap: 'title' })).toBe('Nineteen Eighty-Four');
  });

  it('returns false for invalid years', () => {
    expect(year(-1)).toBe(false);
    expect(year(10000)).toBe(false);
    expect(year(3.14)).toBe(false);
  });
});

describe('telephone', () => {
  it('converts phone numbers to words', () => {
    expect(telephone('555-1234')).toBe('five five five one two three four');
    expect(telephone(8675309)).toBe('eight six seven five three zero nine');
  });

  it('handles various formats', () => {
    expect(telephone('(555) 123-4567')).toBe('five five five one two three four five six seven');
    expect(telephone('1-800-555-1234')).toBe('one eight zero zero five five five one two three four');
  });

  it('applies capitalization', () => {
    expect(telephone('123', { cap: 'title' })).toBe('One Two Three');
  });

  it('returns false for empty input', () => {
    expect(telephone('')).toBe(false);
    expect(telephone('abc')).toBe(false);
  });
});

describe('percent', () => {
  it('converts whole percentages', () => {
    expect(percent(50)).toBe('fifty percent');
    expect(percent(100)).toBe('one hundred percent');
    expect(percent(0)).toBe('zero percent');
  });

  it('handles string with % symbol', () => {
    expect(percent('25%')).toBe('twenty-five percent');
    expect(percent('100%')).toBe('one hundred percent');
  });

  it('converts decimal percentages', () => {
    expect(percent(3.5)).toBe('three point five percent');
    expect(percent(99.9)).toBe('ninety-nine point nine percent');
  });

  it('applies capitalization', () => {
    expect(percent(50, { cap: 'title' })).toBe('Fifty Percent');
  });

  it('returns false for invalid input', () => {
    expect(percent('abc')).toBe(false);
  });
});

describe('toWords', () => {
  it('defaults to English', () => {
    expect(toWords(42)).toBe('forty-two');
  });

  it('converts to Spanish', () => {
    expect(toWords(42, { lang: 'es' })).toBe('cuarenta y dos');
    expect(toWords(42, { lang: 'spanish' })).toBe('cuarenta y dos');
  });

  it('converts to French', () => {
    expect(toWords(42, { lang: 'fr' })).toBe('quarante-deux');
    expect(toWords(42, { lang: 'french' })).toBe('quarante-deux');
  });

  it('converts to Chinese', () => {
    expect(toWords(42, { lang: 'zh' })).toBe('四十二');
    expect(toWords(42, { lang: 'chinese' })).toBe('四十二');
  });

  it('converts to Hindi', () => {
    expect(toWords(42, { lang: 'hi' })).toBe('बयालीस');
    expect(toWords(42, { lang: 'hindi' })).toBe('बयालीस');
  });

  it('converts to German', () => {
    expect(toWords(42, { lang: 'de' })).toBe('zweiundvierzig');
    expect(toWords(42, { lang: 'german' })).toBe('zweiundvierzig');
  });

  it('converts to Danish', () => {
    expect(toWords(42, { lang: 'da' })).toBe('toogfyrre');
    expect(toWords(42, { lang: 'danish' })).toBe('toogfyrre');
  });

  it('converts to Russian', () => {
    expect(toWords(42, { lang: 'ru' })).toBe('сорок два');
    expect(toWords(42, { lang: 'russian' })).toBe('сорок два');
    expect(toWords(42, { lang: 'русский' })).toBe('сорок два');
  });
});

describe('comma', () => {
  it('returns a string from a number', () => {
    expect(typeof comma(1)).toBe('string');
  });

  it('formats small numbers without commas', () => {
    expect(comma(1)).toBe('1');
    expect(comma(999)).toBe('999');
  });

  it('formats thousands with commas', () => {
    expect(comma(1000)).toBe('1,000');
    expect(comma(10000)).toBe('10,000');
    expect(comma(100000)).toBe('100,000');
  });

  it('formats millions with commas', () => {
    expect(comma(1000000)).toBe('1,000,000');
    expect(comma(1234567)).toBe('1,234,567');
  });

  it('returns false for non-numbers', () => {
    expect(comma('one')).toBe(false);
    expect(comma(NaN)).toBe(false);
  });

  it('handles zero', () => {
    expect(comma(0)).toBe('0');
  });

  it('formats BigInts with commas', () => {
    expect(comma(10n ** 18n)).toBe('1,000,000,000,000,000,000');
    expect(comma(123456789012345678901234567890n)).toBe('123,456,789,012,345,678,901,234,567,890');
  });
});

describe('group', () => {
  it('returns 0 for numbers under 1000', () => {
    expect(group(1)).toBe(0);
    expect(group(999)).toBe(0);
  });

  it('returns 1 for thousands', () => {
    expect(group(1000)).toBe(1);
    expect(group(999999)).toBe(1);
  });

  it('returns 2 for millions', () => {
    expect(group(1000000)).toBe(2);
    expect(group(999999999)).toBe(2);
  });

  it('returns 3 for billions', () => {
    expect(group(1000000000)).toBe(3);
  });

  it('returns 4 for trillions', () => {
    expect(group(1000000000000)).toBe(4);
  });

  it('returns 5 for quadrillions', () => {
    expect(group(1000000000000000)).toBe(5);
  });
});

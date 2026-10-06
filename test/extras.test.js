import { describe, it, expect } from 'vitest';
import numberstring, {
  ordinal, nth, compact, fancy, FANCY_STYLE_NAMES, nato, icao, military, morse, telephone,
  scientific, radix, binary, octal, hex, bytes, bits, clock, CAP_STYLES, roman, decimal, currency, year,
  egyptian, babylonian, greek,
  chinese, japanese, toWords
} from '../index.js';

describe('and option (British style)', () => {
  it('inserts and after hundreds', () => {
    expect(numberstring(123, { and: true })).toBe('one hundred and twenty-three');
    expect(numberstring(101, { and: true })).toBe('one hundred and one');
    expect(numberstring(100, { and: true })).toBe('one hundred');
  });

  it('inserts and before a final group under one hundred', () => {
    expect(numberstring(1001, { and: true })).toBe('one thousand and one');
    expect(numberstring(2000001, { and: true })).toBe('two million and one');
    expect(numberstring(1101, { and: true })).toBe('one thousand one hundred and one');
  });

  it('does not add and where nothing follows', () => {
    expect(numberstring(1000000, { and: true })).toBe('one million');
    expect(numberstring(1000, { and: true })).toBe('one thousand');
    expect(numberstring(42, { and: true })).toBe('forty-two');
  });

  it('is off by default', () => {
    expect(numberstring(123)).toBe('one hundred twenty-three');
    expect(numberstring(1001)).toBe('one thousand one');
  });

  it('applies to the integer part of decimals', () => {
    expect(numberstring('123.4', { and: true })).toBe('one hundred and twenty-three point four');
    expect(numberstring(1001.5, { and: true })).toBe('one thousand and one point five');
  });

  it('flows through negatives and ordinals', () => {
    expect(numberstring(-1001, { and: true })).toBe('negative one thousand and one');
    expect(ordinal(101, { and: true })).toBe('one hundred and first');
    expect(numberstring(1001, { and: true, cap: 'title' })).toBe('One Thousand And One');
  });
});

describe('nth', () => {
  it('uses st, nd, rd, th', () => {
    expect(nth(1)).toBe('1st');
    expect(nth(2)).toBe('2nd');
    expect(nth(3)).toBe('3rd');
    expect(nth(4)).toBe('4th');
    expect(nth(0)).toBe('0th');
  });

  it('handles the teens', () => {
    expect(nth(11)).toBe('11th');
    expect(nth(12)).toBe('12th');
    expect(nth(13)).toBe('13th');
    expect(nth(111)).toBe('111th');
    expect(nth(112)).toBe('112th');
    expect(nth(113)).toBe('113th');
  });

  it('handles larger numbers', () => {
    expect(nth(21)).toBe('21st');
    expect(nth(22)).toBe('22nd');
    expect(nth(23)).toBe('23rd');
    expect(nth(101)).toBe('101st');
    expect(nth(1000)).toBe('1000th');
  });

  it('accepts strings, BigInt, and negatives', () => {
    expect(nth('42')).toBe('42nd');
    expect(nth(10n ** 20n + 1n)).toBe('100000000000000000001st');
    expect(nth(-1)).toBe('-1st');
  });

  it('rejects invalid input', () => {
    expect(nth(1.5)).toBe(false);
    expect(nth('abc')).toBe(false);
    expect(nth(NaN)).toBe(false);
    expect(nth(null)).toBe(false);
  });
});

describe('compact', () => {
  it('leaves small numbers alone', () => {
    expect(compact(999)).toBe('999');
    expect(compact(12)).toBe('12');
    expect(compact(0.5)).toBe('0.5');
    expect(compact(-7)).toBe('-7');
  });

  it('abbreviates thousands and up', () => {
    expect(compact(1000)).toBe('1K');
    expect(compact(1500)).toBe('1.5K');
    expect(compact(1234567)).toBe('1.2M');
    expect(compact(2300000000)).toBe('2.3B');
    expect(compact(1e12)).toBe('1T');
    expect(compact(10n ** 21n)).toBe('1Sx');
  });

  it('carries when rounding crosses a scale', () => {
    expect(compact(999950)).toBe('1M');
    expect(compact(999999)).toBe('1M');
    expect(compact(999.99)).toBe('1K');
    expect(compact(999.999, { digits: 2 })).toBe('1K');
    expect(compact(-999.99)).toBe('-1K');
    expect(compact(999.99, { long: true })).toBe('1 thousand');
    expect(compact(999.4)).toBe('999.4');
  });

  it('handles negatives, strings, and decimals', () => {
    expect(compact(-1500)).toBe('-1.5K');
    expect(compact('1500.75')).toBe('1.5K');
  });

  it('honors digits and long options', () => {
    expect(compact(1234567, { digits: 2 })).toBe('1.23M');
    expect(compact(1234567, { digits: 0 })).toBe('1M');
    expect(compact(1500000, { long: true })).toBe('1.5 million');
    expect(compact(2000, { long: true })).toBe('2 thousand');
  });

  it('ignores leading zeros when picking a scale', () => {
    expect(compact('0001')).toBe('1');
    expect(compact('0001000')).toBe('1K');
    expect(compact('00')).toBe('0');
  });

  it('keeps the top scale instead of failing at the upper bound', () => {
    expect(compact(10n ** 36n - 1n)).toBe('1000Dc');
    expect(compact(10n ** 36n - 1n, { long: true })).toBe('1000 decillion');
  });

  it('rejects invalid input', () => {
    expect(compact('abc')).toBe(false);
    expect(compact(NaN)).toBe(false);
    expect(compact(Infinity)).toBe(false);
    expect(compact(1e37)).toBe(false);
    expect(compact({})).toBe(false);
  });
});

describe('fancy', () => {
  it('defaults to circled digits', () => {
    expect(fancy(42)).toBe('④②');
    expect(fancy(0)).toBe('⓪');
  });

  it('supports every listed style', () => {
    const expected = {
      circled: '④②',
      superscript: '⁴²',
      subscript: '₄₂',
      fullwidth: '４２',
      bold: '𝟒𝟐',
      doublestruck: '𝟜𝟚',
      sans: '𝟦𝟤',
      monospace: '𝟺𝟸',
      keycap: '4️⃣2️⃣',
      emoji: '4️⃣2️⃣',
      clock: '🕓🕑',
      braille: '⠼⠙⠃'
    };
    expect([...FANCY_STYLE_NAMES].sort()).toEqual(Object.keys(expected).sort());
    for (const [style, out] of Object.entries(expected)) {
      expect(fancy(42, style)).toBe(out);
    }
  });

  it('maps minus signs and decimal points', () => {
    expect(fancy(-3.5, 'fullwidth')).toBe('－３．５');
    expect(fancy(-3.5, 'superscript')).toBe('⁻³˙⁵');
    expect(fancy(-3.5, 'braille')).toBe('⠼⠤⠉⠨⠑');
    expect(fancy('-42', 'circled')).toBe('−④②');
    expect(fancy(814, 'clock')).toBe('🕗🕐🕓');
    expect(fancy(10.5, 'clock')).toBe('🕐🕛·🕔');
  });

  it('handles BigInt and exponent-form integers', () => {
    expect(fancy(10n ** 3n, 'doublestruck')).toBe('𝟙𝟘𝟘𝟘');
    expect(fancy(1e21, 'subscript')).toBe('₁₀₀₀₀₀₀₀₀₀₀₀₀₀₀₀₀₀₀₀₀₀');
  });

  it('rejects unknown styles and bad input', () => {
    expect(fancy(42, 'wingdings')).toBe(false);
    expect(fancy('abc')).toBe(false);
    expect(fancy(NaN)).toBe(false);
    expect(fancy(1.5e-7)).toBe(false);
  });
});

describe('egyptian', () => {
  it('repeats symbols additively', () => {
    expect(egyptian(1)).toBe('𓏺');
    expect(egyptian(9)).toBe('𓏺'.repeat(9));
    expect(egyptian(10)).toBe('𓎆');
    expect(egyptian(42)).toBe('𓎆𓎆𓎆𓎆𓏺𓏺');
    expect(egyptian(1000)).toBe('𓆼');
    expect(egyptian(1000000)).toBe('𓁨');
    expect(egyptian(1234567)).toBe('𓁨𓆐𓆐𓂭𓂭𓂭𓆼𓆼𓆼𓆼𓍢𓍢𓍢𓍢𓍢𓎆𓎆𓎆𓎆𓎆𓎆𓏺𓏺𓏺𓏺𓏺𓏺𓏺');
  });

  it('rejects zero and values beyond 9,999,999', () => {
    expect(egyptian(0)).toBe(false);
    expect(egyptian(10000000)).toBe(false);
    expect(egyptian(-1)).toBe(false);
    expect(egyptian(1.5)).toBe(false);
  });
});

describe('babylonian', () => {
  it('writes base-60 places with tens and ones wedges', () => {
    expect(babylonian(1)).toBe('𒁹');
    expect(babylonian(10)).toBe('𒌋');
    expect(babylonian(42)).toBe('𒌋𒌋𒌋𒌋𒁹𒁹');
    expect(babylonian(59)).toBe('𒌋𒌋𒌋𒌋𒌋𒁹𒁹𒁹𒁹𒁹𒁹𒁹𒁹𒁹');
    expect(babylonian(60)).toBe('𒁹 𒑊');
    expect(babylonian(61)).toBe('𒁹 𒁹');
    expect(babylonian(3600)).toBe('𒁹 𒑊 𒑊');
    expect(babylonian(1984)).toBe('𒌋𒌋𒌋𒁹𒁹𒁹 𒁹𒁹𒁹𒁹');
  });

  it('uses the placeholder for zero', () => {
    expect(babylonian(0)).toBe('𒑊');
  });

  it('accepts BigInt and rejects invalid input', () => {
    expect(babylonian(10n ** 18n)).toMatch(/^𒁹/);
    expect(babylonian(-1)).toBe(false);
    expect(babylonian('x')).toBe(false);
  });
});

describe('greek', () => {
  it('uses Ionic letters with keraia', () => {
    expect(greek(1)).toBe('αʹ');
    expect(greek(6)).toBe('ϛʹ');
    expect(greek(42)).toBe('μβʹ');
    expect(greek(90)).toBe('ϟʹ');
    expect(greek(900)).toBe('ϡʹ');
    expect(greek(1999)).toBe('͵αϡϟθʹ');
    expect(greek(2026)).toBe('͵βκϛʹ');
    expect(greek(1000)).toBe('͵αʹ');
  });

  it('rejects zero and values over 9999', () => {
    expect(greek(0)).toBe(false);
    expect(greek(10000)).toBe(false);
    expect(greek(-5)).toBe(false);
  });
});

describe('formal Chinese and Japanese numerals', () => {
  it('uses 大写 financial forms in Chinese', () => {
    expect(chinese(42, { formal: true })).toBe('肆拾贰');
    expect(chinese(10, { formal: true })).toBe('壹拾');
    expect(chinese(1001, { formal: true })).toBe('壹仟零壹');
    expect(chinese(123456, { formal: true })).toBe('壹拾贰万叁仟肆佰伍拾陆');
    expect(chinese(100000001, { formal: true })).toBe('壹亿零壹');
    expect(chinese(10001, { formal: true })).toBe('壹万零壹');
    expect(chinese(10010, { formal: true })).toBe('壹万零壹拾');
    expect(chinese(10100, { formal: true })).toBe('壹万零壹佰');
    expect(chinese(0, { formal: true })).toBe('零');
  });

  it('uses 大字 forms in Japanese', () => {
    expect(japanese(42, { formal: true })).toBe('四拾弐');
    expect(japanese(10, { formal: true })).toBe('壱拾');
    expect(japanese(1000, { formal: true })).toBe('壱千');
    expect(japanese(1001, { formal: true })).toBe('壱千壱');
    expect(japanese(123456, { formal: true })).toBe('壱拾弐万参千四百五拾六');
    expect(japanese(0, { formal: true })).toBe('零');
    expect(japanese(0)).toBe('ゼロ');
  });

  it('is off by default and reachable through toWords', () => {
    expect(chinese(42)).toBe('四十二');
    expect(japanese(1000)).toBe('千');
    expect(toWords(42, { lang: 'zh', formal: true })).toBe('肆拾贰');
    expect(toWords(10000, { lang: 'ja', formal: true })).toBe('壱万');
  });
});

describe('language aliases', () => {
  it('accepts bahasa for Indonesian', () => {
    expect(numberstring(42, { lang: 'bahasa' })).toBe('empat puluh dua');
  });
});

describe('nato', () => {
  it('reads digits with ICAO pronunciations', () => {
    expect(nato(1984)).toBe('wun niner ait fower');
    expect(nato(42)).toBe('fower too');
    expect(nato(0)).toBe('zero');
    expect(nato('007')).toBe('zero zero seven');
    expect(nato('000')).toBe('zero zero zero');
    expect(nato('0000')).toBe('zero zero zero zero');
    expect(nato('00100')).toBe('zero zero wun zero zero');
    expect(nato('01200')).toBe('zero wun too zero zero');
    expect(nato(10000)).toBe('wun zero tousand');
  });

  it('reads whole hundreds and thousands as words', () => {
    expect(nato(500)).toBe('fife hundred');
    expect(nato(1000)).toBe('wun tousand');
    expect(nato(2500)).toBe('too tousand fife hundred');
    expect(nato(11000)).toBe('wun wun tousand');
    expect(nato(25000)).toBe('too fife tousand');
    expect(nato(100000)).toBe('wun zero zero zero zero zero');
  });

  it('handles decimals, negatives, BigInt, and options', () => {
    expect(nato(3.14)).toBe('tree decimal wun fower');
    expect(nato('123.45')).toBe('wun too tree decimal fower fife');
    expect(nato(-7)).toBe('minus seven');
    expect(nato(10n ** 3n)).toBe('wun tousand');
    expect(nato(2500, { digits: true })).toBe('too fife zero zero');
    expect(nato(1984, { cap: 'upper' })).toBe('WUN NINER AIT FOWER');
  });

  it('is also exported as icao and military', () => {
    expect(icao).toBe(nato);
    expect(military).toBe(nato);
  });

  it('rejects invalid input', () => {
    expect(nato('abc')).toBe(false);
    expect(nato(NaN)).toBe(false);
    expect(nato(Infinity)).toBe(false);
    expect(nato(null)).toBe(false);
  });
});

describe('morse', () => {
  it('encodes digits', () => {
    expect(morse(0)).toBe('-----');
    expect(morse(42)).toBe('....- ..---');
    expect(morse('1984')).toBe('.---- ----. ---.. ....-');
    expect(morse(10n ** 3n)).toBe('.---- ----- ----- -----');
  });

  it('encodes point and minus', () => {
    expect(morse(3.1)).toBe('...-- .-.-.- .----');
    expect(morse(-5)).toBe('-....- .....');
  });

  it('rejects invalid input', () => {
    expect(morse('sos')).toBe(false);
    expect(morse(NaN)).toBe(false);
    expect(morse(Infinity)).toBe(false);
  });
});

describe('telephone oh option', () => {
  it('says oh for zero', () => {
    expect(telephone('555-0100', { oh: true })).toBe('five five five oh one oh oh');
    expect(telephone('555-0100')).toBe('five five five zero one zero zero');
    expect(telephone(8675309, { oh: true, cap: 'title' })).toBe('Eight Six Seven Five Three Oh Nine');
  });
});

describe('scientific', () => {
  it('formats with a superscript exponent by default', () => {
    expect(scientific(1984)).toBe('1.984 × 10³');
    expect(scientific(42)).toBe('4.2 × 10¹');
    expect(scientific(1)).toBe('1 × 10⁰');
    expect(scientific(0)).toBe('0 × 10⁰');
    expect(scientific(100)).toBe('1 × 10²');
    expect(scientific(0.00042)).toBe('4.2 × 10⁻⁴');
    expect(scientific('0.5')).toBe('5 × 10⁻¹');
    expect(scientific(-1500)).toBe('-1.5 × 10³');
  });

  it('keeps an exact mantissa for floats, BigInt, and exponent-form input', () => {
    expect(scientific(1.5e-7)).toBe('1.5 × 10⁻⁷');
    expect(scientific(-1.5e-7)).toBe('-1.5 × 10⁻⁷');
    expect(scientific(1e21)).toBe('1 × 10²¹');
    expect(scientific(6.02214076e23)).toBe('6.02214076 × 10²³');
    expect(scientific(10n ** 36n - 1n)).toBe('1 × 10³⁶');
    expect(scientific(123456789012345)).toBe('1.23456789012 × 10¹⁴');
  });

  it('rounds to the requested significant digits with carry', () => {
    expect(scientific(1984, { digits: 2 })).toBe('2 × 10³');
    expect(scientific(1984, { digits: 3 })).toBe('1.98 × 10³');
    expect(scientific(999, { digits: 2 })).toBe('1 × 10³');
  });

  it('supports caret, e, and words formats', () => {
    expect(scientific(1984, { format: 'caret' })).toBe('1.984 × 10^3');
    expect(scientific(1984, { format: 'e' })).toBe('1.984e3');
    expect(scientific(0.00042, { format: 'e' })).toBe('4.2e-4');
    expect(scientific(1984, { format: 'words' })).toBe('one point nine eight four times ten to the third');
    expect(scientific(0.00042, { format: 'words' })).toBe('four point two times ten to the negative fourth');
    expect(scientific(1, { format: 'words' })).toBe('one');
    expect(scientific(-0.00042, { format: 'words', cap: 'title' })).toBe('Negative Four Point Two Times Ten To The Negative Fourth');
  });

  it('rejects invalid input and formats', () => {
    expect(scientific('abc')).toBe(false);
    expect(scientific(NaN)).toBe(false);
    expect(scientific(Infinity)).toBe(false);
    expect(scientific(1, { format: 'latex' })).toBe(false);
  });
});

describe('radix, binary, octal, hex', () => {
  it('converts integers between bases', () => {
    expect(binary(42)).toBe('101010');
    expect(octal(42)).toBe('52');
    expect(hex(42)).toBe('2a');
    expect(radix(42, 36)).toBe('16');
    expect(hex('255')).toBe('ff');
    expect(binary(10n ** 20n)).toBe((10n ** 20n).toString(2));
  });

  it('supports prefix, upper, pad, and negatives', () => {
    expect(hex(255, { prefix: true, upper: true })).toBe('0xFF');
    expect(binary(-5, { prefix: true })).toBe('-0b101');
    expect(binary(5, { pad: 8 })).toBe('00000101');
    expect(octal(8, { prefix: true })).toBe('0o10');
    expect(radix(42, 36, { prefix: true })).toBe('16');
  });

  it('rejects bad bases and non-integers', () => {
    expect(radix(42, 1)).toBe(false);
    expect(radix(42, 37)).toBe(false);
    expect(radix(1.5)).toBe(false);
    expect(radix('x')).toBe(false);
    expect(binary(NaN)).toBe(false);
  });
});

describe('bytes', () => {
  it('uses decimal units by default', () => {
    expect(bytes(0)).toBe('0 B');
    expect(bytes(999)).toBe('999 B');
    expect(bytes(1000)).toBe('1 KB');
    expect(bytes(1536)).toBe('1.5 KB');
    expect(bytes(1048576)).toBe('1 MB');
    expect(bytes(1536000)).toBe('1.5 MB');
    expect(bytes(10n ** 15n)).toBe('1 PB');
    expect(bytes(999999)).toBe('1 MB');
  });

  it('uses binary units on request', () => {
    expect(bytes(1536, { binary: true })).toBe('1.5 KiB');
    expect(bytes(1048576, { binary: true })).toBe('1 MiB');
    expect(bytes(1023, { binary: true })).toBe('1023 B');
  });

  it('spells out long form with plurals', () => {
    expect(bytes(1536, { long: true })).toBe('one point five kilobytes');
    expect(bytes(1, { long: true })).toBe('one byte');
    expect(bytes(1000, { long: true })).toBe('one kilobyte');
    expect(bytes(1048576, { binary: true, long: true })).toBe('one mebibyte');
  });

  it('honors digits and rejects invalid input', () => {
    expect(bytes(1536, { digits: 0 })).toBe('2 KB');
    expect(bytes(1234567890, { digits: 6 })).toBe('1.234568 GB');
    expect(bytes(1234567890, { digits: 3 })).toBe('1.235 GB');
    expect(bytes(100000000000123456000000000000000000n, { digits: 6 })).toBe('100000000000.123456 YB');
    expect(bytes(10n ** 30n)).toBe('1000000 YB');
    expect(bytes(1999, { digits: 0 })).toBe('2 KB');
    expect(bytes(999999999, { digits: 2 })).toBe('1 GB');
    expect(bytes(1536, { digits: 1.5 })).toBe('1.5 KB');
    expect(bytes(1536, { digits: NaN })).toBe('1.5 KB');
    expect(bits(1536, { digits: Infinity })).toBe('1.5 kb');
    expect(compact(1536, { digits: 2.7 })).toBe('1.54K');
    expect(scientific(1984, { digits: 2.9 })).toBe('2 × 10³');
    expect(bytes(-1)).toBe(false);
    expect(bytes(1.5)).toBe(false);
    expect(bytes('abc')).toBe(false);
  });
});

describe('bits', () => {
  it('uses bandwidth-style units', () => {
    expect(bits(0)).toBe('0 b');
    expect(bits(999)).toBe('999 b');
    expect(bits(1000)).toBe('1 kb');
    expect(bits(1500000)).toBe('1.5 Mb');
    expect(bits(10n ** 9n)).toBe('1 Gb');
  });

  it('supports binary units and long form', () => {
    expect(bits(1536, { binary: true })).toBe('1.5 Kib');
    expect(bits(1500000, { long: true })).toBe('one point five megabits');
    expect(bits(1, { long: true })).toBe('one bit');
    expect(bits(1048576, { binary: true, long: true })).toBe('one mebibit');
  });

  it('rejects invalid input', () => {
    expect(bits(-1)).toBe(false);
    expect(bits(2.5)).toBe(false);
  });
});

describe('clock', () => {
  it('maps hours to clock faces', () => {
    expect(clock(1)).toBe('🕐');
    expect(clock(3)).toBe('🕒');
    expect(clock(12)).toBe('🕛');
    expect(clock(0)).toBe('🕛');
    expect(clock(24)).toBe('🕛');
    expect(clock(15)).toBe('🕒');
  });

  it('rounds H:MM to the nearest half hour', () => {
    expect(clock('3:30')).toBe('🕞');
    expect(clock('3:14')).toBe('🕒');
    expect(clock('3:15')).toBe('🕞');
    expect(clock('12:44')).toBe('🕧');
    expect(clock('12:45')).toBe('🕐');
    expect(clock('23:50')).toBe('🕛');
    expect(clock('0:30')).toBe('🕧');
  });

  it('rejects invalid input', () => {
    expect(clock(25)).toBe(false);
    expect(clock(1.5)).toBe(false);
    expect(clock('x')).toBe(false);
    expect(clock('3:60')).toBe(false);
    expect(clock(null)).toBe(false);
  });
});

describe('cap casing styles', () => {
  it('joins words for code-style casing', () => {
    expect(numberstring(123, { cap: 'camel' })).toBe('oneHundredTwentyThree');
    expect(numberstring(123, { cap: 'pascal' })).toBe('OneHundredTwentyThree');
    expect(numberstring(123, { cap: 'snake' })).toBe('one_hundred_twenty_three');
    expect(numberstring(123, { cap: 'kebab' })).toBe('one-hundred-twenty-three');
    expect(numberstring(123, { cap: 'hyphen' })).toBe('one-hundred-twenty-three');
    expect(numberstring(123, { cap: 'constant' })).toBe('ONE_HUNDRED_TWENTY_THREE');
    expect(numberstring(123, { cap: 'screaming' })).toBe('ONE_HUNDRED_TWENTY_THREE');
    expect(numberstring(123, { cap: 'dot' })).toBe('one.hundred.twenty.three');
  });

  it('sentence case capitalizes only the first letter', () => {
    expect(numberstring(123, { cap: 'sentence' })).toBe('One hundred twenty-three');
    expect(numberstring(-5, { cap: 'sentence' })).toBe('Negative five');
  });

  it('works through delegated paths and other helpers', () => {
    expect(numberstring(-3.5, { cap: 'snake' })).toBe('negative_three_point_five');
    expect(numberstring(-123, { cap: 'camel' })).toBe('negativeOneHundredTwentyThree');
    expect(numberstring(-123, { cap: 'pascal' })).toBe('NegativeOneHundredTwentyThree');
    expect(numberstring(-5n, { cap: 'title', punc: '!' })).toBe('Negative Five!');
    expect(numberstring('42', { cap: 'camel', punc: '!' })).toBe('fortyTwo!');
    expect(numberstring(42, { lang: 'es', cap: 'kebab' })).toBe('cuarenta-y-dos');
    expect(numberstring(1001, { and: true, cap: 'constant' })).toBe('ONE_THOUSAND_AND_ONE');
    expect(ordinal(21, { cap: 'camel' })).toBe('twentyFirst');
    expect(decimal(3.14, { cap: 'pascal' })).toBe('ThreePointOneFour');
    expect(currency('$1.50', { cap: 'snake' })).toBe('one_dollar_and_fifty_cents');
    expect(nato(1984, { cap: 'kebab' })).toBe('wun-niner-ait-fower');
  });

  it('leaves unknown styles alone and exports the list', () => {
    expect(numberstring(42, { cap: 'wingdings' })).toBe('forty-two');
    expect(CAP_STYLES).toContain('camel');
    expect(CAP_STYLES).toContain('snake');
    expect(CAP_STYLES).toContain('hyphen');
    expect(CAP_STYLES).toContain('screaming');
    expect(roman(4, { lower: true })).toBe('iv');
  });
});

describe('year beyond 9999', () => {
  it('reads far-future years as cardinals', () => {
    expect(year(10000)).toBe('ten thousand');
    expect(year(8675309)).toBe('eight million six hundred seventy-five thousand three hundred nine');
    expect(year(10n ** 6n)).toBe('one million');
    expect(year(1984n)).toBe('nineteen eighty-four');
    expect(year(12345, { cap: 'title' })).toBe('Twelve Thousand Three Hundred Forty-Five');
  });

  it('still rejects negatives and non-integers', () => {
    expect(year(-1)).toBe(false);
    expect(year(-1n)).toBe(false);
    expect(year(1.5)).toBe(false);
  });
});

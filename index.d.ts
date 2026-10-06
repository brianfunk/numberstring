/**
 * Type declarations for numberstring
 */

/** Capitalization styles */
export type CapStyle = 'title' | 'upper' | 'lower';

/** Trailing punctuation */
export type Punc = '!' | '?' | '.';

/** Language codes and aliases accepted by `lang` */
export type Lang =
  | 'en' | 'english'
  | 'es' | 'spanish' | 'español'
  | 'fr' | 'french' | 'français'
  | 'de' | 'german' | 'deutsch'
  | 'da' | 'danish' | 'dansk'
  | 'zh' | 'chinese' | 'mandarin' | '中文'
  | 'hi' | 'hindi' | 'हिन्दी'
  | 'ru' | 'russian' | 'русский'
  | 'pt' | 'portuguese' | 'português'
  | 'ja' | 'japanese' | '日本語'
  | 'ko' | 'korean' | '한국어'
  | 'ar' | 'arabic' | 'العربية'
  | 'it' | 'italian' | 'italiano'
  | 'nl' | 'dutch' | 'nederlands'
  | 'tr' | 'turkish' | 'türkçe'
  | 'pl' | 'polish' | 'polski'
  | 'sv' | 'swedish' | 'svenska'
  | 'id' | 'indonesian' | 'bahasa' | 'bahasa indonesia'
  | 'th' | 'thai' | 'ไทย'
  | 'no' | 'norwegian' | 'norsk'
  | 'fi' | 'finnish' | 'suomi'
  | 'is' | 'icelandic' | 'íslenska'
  | (string & {});

export interface Options {
  /** Capitalization: 'title', 'upper', or 'lower' */
  cap?: CapStyle;
  /** Trailing punctuation: '!', '?', or '.' */
  punc?: Punc;
  /** Language code (default 'en'). Non-English languages cover non-negative integers only. */
  lang?: Lang;
  /** Word for the decimal point (default 'point') */
  point?: string;
  /** British style: 'one hundred and twenty-three', 'one thousand and one' */
  and?: boolean;
  /** Chinese/Japanese only: financial 大写 / 大字 numerals (壹贰叁, 壱弐参) */
  formal?: boolean;
}

export interface CompactOptions {
  /** Maximum decimal places (default 1, max 6) */
  digits?: number;
  /** Spell the scale word: '1.5 million' instead of '1.5M' */
  long?: boolean;
}


/** Unicode digit styles accepted by fancy() */
export type FancyStyle =
  | 'circled' | 'superscript' | 'subscript' | 'fullwidth' | 'bold'
  | 'doublestruck' | 'sans' | 'monospace' | 'keycap' | 'emoji' | 'braille';

export interface ScientificOptions extends Pick<Options, 'cap'> {
  /** Maximum significant digits, rounds half up (default 12) */
  digits?: number;
  /** 'unicode' (1.984 × 10³), 'caret' (1.984 × 10^3), 'e' (1.984e3), or 'words' */
  format?: 'unicode' | 'caret' | 'e' | 'words';
}

export interface RadixOptions {
  /** Add 0b / 0o / 0x for bases 2, 8, 16 */
  prefix?: boolean;
  /** Uppercase letter digits */
  upper?: boolean;
  /** Left-pad with zeros to this many digits */
  pad?: number;
}

export interface BytesOptions {
  /** Use 1024 steps and KiB/MiB units */
  binary?: boolean;
  /** Maximum decimal places (default 1) */
  digits?: number;
  /** Spell it out: 'one point five kilobytes' */
  long?: boolean;
}

export interface CurrencyOptions extends Pick<Options, 'cap'> {
  /** Currency symbol or ISO code when the amount has none: '$', 'USD', '€', 'EUR', '£', 'GBP', '¥', 'JPY', '₹', 'INR', '元', 'CNY' */
  currency?: string;
}

export interface RomanOptions {
  /** Return lowercase numerals */
  lower?: boolean;
}

/** A conversion result, or `false` when the input cannot be converted */
export type Result = string | false;

/** Any value numberstring will try to convert */
export type Numeric = number | bigint | string;

/**
 * Convert a number to words. Accepts integers, negatives, decimals,
 * numeric strings, and BigInt up to 10^36 - 1. Honors `lang`.
 *
 * @example
 * numberstring(42)                  // 'forty-two'
 * numberstring(-3.14)               // 'negative three point one four'
 * numberstring('1000')              // 'one thousand'
 * numberstring(42, { lang: 'es' })  // 'cuarenta y dos'
 */
declare function numberstring(n: Numeric, opt?: Options): Result;
export default numberstring;

/** Convert to words in any supported language (non-negative integers) */
export function toWords(n: number | bigint, opt?: Pick<Options, 'cap' | 'lang' | 'formal'>): Result;

/** Ordinal words: 1 → 'first', 21 → 'twenty-first' */
export function ordinal(n: number | bigint, opt?: Pick<Options, 'cap' | 'and'>): Result;

/** Numeric ordinal suffix: 1 → '1st', 22 → '22nd', 113 → '113th' */
export function nth(n: Numeric): string | false;

/** Compact notation: 1500 → '1.5K', 2300000000 → '2.3B' */
export function compact(n: Numeric, opt?: CompactOptions): string | false;

/** Digits in a Unicode style: fancy(42) → '④②', fancy(42, 'superscript') → '⁴²' */
export function fancy(n: Numeric, style?: FancyStyle): string | false;

/** The style names fancy() accepts */
export const FANCY_STYLE_NAMES: readonly FancyStyle[];

/** Egyptian hieroglyphic numerals, 1 to 9,999,999 */
export function egyptian(n: Numeric): string | false;

/** Babylonian base-60 cuneiform numerals */
export function babylonian(n: Numeric): string | false;

/** Greek Ionic alphabetic numerals, 1 to 9999 */
export function greek(n: Numeric): string | false;



/** Decimal words: 3.14 → 'three point one four' */
export function decimal(n: number | string, opt?: Pick<Options, 'cap' | 'point'>): Result;

/** Currency words: '$123.45' → 'one hundred twenty-three dollars and forty-five cents' */
export function currency(amount: number | string, opt?: CurrencyOptions): Result;

/** Roman numerals for 1–3,999,999,999: 42 → 'XLII'; above 3999 uses vinculum bars (4000 → 'I̅V̅') */
export function roman(n: number, opt?: RomanOptions): Result;

/** Parse English words back to a number: 'forty-two' → 42. Returns BigInt above the safe integer range. */
export function parse(str: string): number | bigint | false;

/** Signed words: -42 → 'negative forty-two' */
export function negative(n: number | bigint, opt?: Pick<Options, 'cap'>): Result;

/** Fraction words: (1, 2) → 'one half', (3, 4) → 'three quarters' */
export function fraction(numerator: number, denominator: number, opt?: Pick<Options, 'cap'>): Result;

/** Year as spoken: 1984 → 'nineteen eighty-four' */
export function year(y: number, opt?: Pick<Options, 'cap'>): Result;

export interface TelephoneOptions extends Pick<Options, 'cap'> {
  /** Say 'oh' instead of 'zero' */
  oh?: boolean;
}

/** Digits read individually: '555-1234' → 'five five five one two three four' */
export function telephone(phone: number | string, opt?: TelephoneOptions): Result;

export interface NatoOptions extends Pick<Options, 'cap'> {
  /** Always read digit by digit, even round hundreds and thousands */
  digits?: boolean;
}

/** ICAO / NATO radiotelephony numerals: 1984 → 'wun niner ait fower', 2500 → 'too tousand fife hundred' */
export function nato(n: Numeric, opt?: NatoOptions): Result;
/** Alias of nato() */
export function icao(n: Numeric, opt?: NatoOptions): Result;
/** Alias of nato() */
export function military(n: Numeric, opt?: NatoOptions): Result;

/** International Morse code digits: 42 → '....- ..---' */
export function morse(n: Numeric): string | false;

/** Scientific notation with an exact mantissa: 1984 → '1.984 × 10³' */
export function scientific(n: Numeric, opt?: ScientificOptions): string | false;

/** Integer in another base, 2 to 36: radix(42, 16) → '2a' */
export function radix(n: Numeric, base?: number, opt?: RadixOptions): string | false;
/** Binary: 42 → '101010' */
export function binary(n: Numeric, opt?: RadixOptions): string | false;
/** Octal: 42 → '52' */
export function octal(n: Numeric, opt?: RadixOptions): string | false;
/** Hexadecimal: 42 → '2a' */
export function hex(n: Numeric, opt?: RadixOptions): string | false;

/** Human-readable byte sizes: 1536 → '1.5 KB' */
export function bytes(n: Numeric, opt?: BytesOptions): string | false;

/** Clock-face emoji for an hour (0-24) or 'H:MM': clock('3:30') → '🕞' */
export function clock(time: number | string): string | false;

/** Percent words: 50 → 'fifty percent' */
export function percent(pct: number | string, opt?: Pick<Options, 'cap'>): Result;

/** Thousands separators: 1234567 → '1,234,567' */
export function comma(n: number | bigint): string | false;

/** Magnitude group: 0 = ones, 1 = thousands, 2 = millions, ... */
export function group(n: number | bigint): number;

/** A single-language converter for non-negative integers. Use toWords() for `cap`. */
export type LanguageConverter = (n: number | bigint) => Result;

/** Spanish and Portuguese also accept `cap` directly */
export type LanguageConverterWithCap = (n: number | bigint, opt?: Pick<Options, 'cap'>) => Result;

/** Chinese and Japanese accept `formal` for 大写 / 大字 numerals */
export type LanguageConverterWithFormal = (n: number | bigint, opt?: Pick<Options, 'formal'>) => Result;

export const spanish: LanguageConverterWithCap;
export const french: LanguageConverter;
export const german: LanguageConverter;
export const danish: LanguageConverter;
export const chinese: LanguageConverterWithFormal;
export const hindi: LanguageConverter;
export const russian: LanguageConverter;
export const portuguese: LanguageConverterWithCap;
export const japanese: LanguageConverterWithFormal;
export const korean: LanguageConverter;
export const arabic: LanguageConverter;
export const italian: LanguageConverter;
export const dutch: LanguageConverter;
export const turkish: LanguageConverter;
export const polish: LanguageConverter;
export const swedish: LanguageConverter;
export const indonesian: LanguageConverter;
export const thai: LanguageConverter;
export const norwegian: LanguageConverter;
export const finnish: LanguageConverter;
export const icelandic: LanguageConverter;

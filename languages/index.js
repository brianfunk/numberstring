/**
 * Language exports for numberstring
 * Each language module provides a function to convert numbers to words
 *
 * Adding a new language:
 * 1. Create a new file (e.g., pt.js for Portuguese)
 * 2. Export a default function that takes (n, opt) and returns string|false
 * 3. Add the import and export below
 * 4. Add the language to LANGUAGES and toWords switch in main index.js
 *
 * @module languages
 */

import english from './en.js';
import spanish from './es.js';
import french from './fr.js';
import german from './de.js';
import danish from './da.js';
import chinese from './zh.js';
import hindi from './hi.js';
import russian from './ru.js';
import portuguese from './pt.js';
import japanese from './ja.js';
import korean from './ko.js';
import arabic from './ar.js';
import italian from './it.js';
import dutch from './nl.js';
import turkish from './tr.js';
import polish from './pl.js';
import swedish from './sv.js';
import indonesian from './id.js';
import thai from './th.js';
import norwegian from './no.js';
import finnish from './fi.js';
import icelandic from './is.js';

/** Supported language codes and aliases */
const LANGUAGES = Object.freeze({
  en: 'english',
  english: 'english',
  es: 'spanish',
  spanish: 'spanish',
  español: 'spanish',
  fr: 'french',
  french: 'french',
  français: 'french',
  de: 'german',
  german: 'german',
  deutsch: 'german',
  da: 'danish',
  danish: 'danish',
  dansk: 'danish',
  zh: 'chinese',
  chinese: 'chinese',
  mandarin: 'chinese',
  '中文': 'chinese',
  hi: 'hindi',
  hindi: 'hindi',
  'हिन्दी': 'hindi',
  ru: 'russian',
  russian: 'russian',
  'русский': 'russian',
  pt: 'portuguese',
  portuguese: 'portuguese',
  português: 'portuguese',
  ja: 'japanese',
  japanese: 'japanese',
  '日本語': 'japanese',
  ko: 'korean',
  korean: 'korean',
  '한국어': 'korean',
  ar: 'arabic',
  arabic: 'arabic',
  'العربية': 'arabic',
  it: 'italian',
  italian: 'italian',
  italiano: 'italian',
  nl: 'dutch',
  dutch: 'dutch',
  nederlands: 'dutch',
  tr: 'turkish',
  turkish: 'turkish',
  türkçe: 'turkish',
  pl: 'polish',
  polish: 'polish',
  polski: 'polish',
  sv: 'swedish',
  swedish: 'swedish',
  svenska: 'swedish',
  id: 'indonesian',
  indonesian: 'indonesian',
  'bahasa indonesia': 'indonesian',
  th: 'thai',
  thai: 'thai',
  'ไทย': 'thai',
  no: 'norwegian',
  norwegian: 'norwegian',
  norsk: 'norwegian',
  fi: 'finnish',
  finnish: 'finnish',
  suomi: 'finnish',
  is: 'icelandic',
  icelandic: 'icelandic',
  íslenska: 'icelandic'
});

export {
  english,
  spanish,
  french,
  german,
  danish,
  chinese,
  hindi,
  russian,
  portuguese,
  japanese,
  korean,
  arabic,
  italian,
  dutch,
  turkish,
  polish,
  swedish,
  indonesian,
  thai,
  norwegian,
  finnish,
  icelandic,
  LANGUAGES
};

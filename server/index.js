/*
                                   /##                                       /""               /""
                                  | ##                                      | ""              |__/
 /#######  /##   /## /######/#### | #######   /######   /######   /""""""" /""""""    /""""""  /"" /"""""""   /""""""
| ##__  ##| ##  | ##| ##_  ##_  ##| ##__  ## /##__  ## /##__  ## /""_____/|_  ""_/   /""__  ""| ""| ""__  "" /""__  ""
| ##  \ ##| ##  | ##| ## \ ## \ ##| ##  \ ##| ########| ##  \__/|  """"""   | ""    | ""  \__/| ""| ""  \ ""| ""  \ ""
| ##  | ##| ##  | ##| ## | ## | ##| ##  | ##| ##_____/| ##       \____  ""  | "" /""| ""      | ""| ""  | ""| ""  | ""
| ##  | ##|  ######/| ## | ## | ##| #######/|  #######| ##       /"""""""/  |  """"/| ""      | ""| ""  | ""|  """""""
|__/  |__/ \______/ |__/ |__/ |__/|_______/  \_______/|__/      |_______/    \___/  |__/      |__/|__/  |__/ \____  ""
                                                                                                             /""  \ ""
                                                                                                            |  """"""/
                                                                                                             \______/
   ___   ___  ___
  / _ | / _ \/  _/
 / __ |/ ___// /
/_/ |_/_/  /___/

*/

/**
 * numberstring API Server
 * REST API for number-to-word conversions
 */

import express from 'express';
import numberstring, {
  comma,
  ordinal,
  decimal,
  currency,
  roman,
  parse,
  toWords
} from '../index.js';

const PORT = process.env.PORT || 3456;

/**
 * Create and configure the Express app
 * @returns {express.Application} Configured Express app
 */
export const createApp = () => {
  const app = express();
  app.use(express.json());

  // Root route
  app.get('/', (_req, res) => {
    res.json({
      name: 'numberstring API',
      version: '1.0.0',
      endpoints: [
        'GET /convert/:number',
        'GET /ordinal/:number',
        'GET /decimal/:number',
        'GET /currency/:amount',
        'GET /roman/:number',
        'GET /parse/:words',
        'GET /comma/:number',
        'GET /languages'
      ]
    });
  });

  // List supported languages
  app.get('/languages', (_req, res) => {
    res.json({
      languages: [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish (Español)' },
        { code: 'fr', name: 'French (Français)' },
        { code: 'de', name: 'German (Deutsch)' },
        { code: 'da', name: 'Danish (Dansk)' },
        { code: 'zh', name: 'Chinese (中文)' },
        { code: 'hi', name: 'Hindi (हिन्दी)' }
      ]
    });
  });

  // Convert number to words
  // GET /convert/42?lang=en&cap=title
  app.get('/convert/:number', (req, res) => {
    const { number } = req.params;
    const { lang, cap: capStyle, punc } = req.query;

    const num = number.includes('n') ? BigInt(number.replace('n', '')) : parseInt(number, 10);

    const opt = {};
    if (lang) opt.lang = lang;
    if (capStyle) opt.cap = capStyle;
    if (punc) opt.punc = punc;

    const result = lang ? toWords(num, opt) : numberstring(num, opt);

    if (result === false) {
      res.status(400).json({ error: 'Invalid number', input: number });
      return;
    }

    res.json({ input: number, output: result, lang: lang || 'en' });
  });

  // Convert to ordinal
  // GET /ordinal/42
  app.get('/ordinal/:number', (req, res) => {
    const { number } = req.params;
    const { cap: capStyle } = req.query;

    const num = parseInt(number, 10);
    const opt = capStyle ? { cap: capStyle } : undefined;
    const result = ordinal(num, opt);

    if (result === false) {
      res.status(400).json({ error: 'Invalid number for ordinal', input: number });
      return;
    }

    res.json({ input: number, output: result });
  });

  // Convert decimal to words
  // GET /decimal/3.14
  app.get('/decimal/:number', (req, res) => {
    const { number } = req.params;
    const { cap: capStyle, point } = req.query;

    const num = parseFloat(number);
    const opt = {};
    if (capStyle) opt.cap = capStyle;
    if (point) opt.point = point;

    const result = decimal(num, Object.keys(opt).length ? opt : undefined);

    if (result === false) {
      res.status(400).json({ error: 'Invalid decimal', input: number });
      return;
    }

    res.json({ input: number, output: result });
  });

  // Convert currency to words
  // GET /currency/$123.45 or GET /currency/123.45?currency=USD
  app.get('/currency/:amount', (req, res) => {
    const { amount } = req.params;
    const { currency: curr, cap: capStyle } = req.query;

    const opt = {};
    if (curr) opt.currency = curr;
    if (capStyle) opt.cap = capStyle;

    const result = currency(amount, Object.keys(opt).length ? opt : undefined);

    if (result === false) {
      res.status(400).json({ error: 'Invalid currency amount', input: amount });
      return;
    }

    res.json({ input: amount, output: result });
  });

  // Convert to Roman numerals
  // GET /roman/42
  app.get('/roman/:number', (req, res) => {
    const { number } = req.params;
    const { lower } = req.query;

    const num = parseInt(number, 10);
    const opt = lower === 'true' ? { lower: true } : undefined;
    const result = roman(num, opt);

    if (result === false) {
      res.status(400).json({ error: 'Invalid number for roman (1-3999)', input: number });
      return;
    }

    res.json({ input: number, output: result });
  });

  // Parse words to number
  // GET /parse/forty-two
  app.get('/parse/:words', (req, res) => {
    const { words } = req.params;
    const result = parse(decodeURIComponent(words));

    if (result === false) {
      res.status(400).json({ error: 'Could not parse words', input: words });
      return;
    }

    res.json({ input: words, output: result.toString() });
  });

  // Format number with commas
  // GET /comma/1234567
  app.get('/comma/:number', (req, res) => {
    const { number } = req.params;
    const num = number.includes('n') ? BigInt(number.replace('n', '')) : parseInt(number, 10);
    const result = comma(num);

    if (result === false) {
      res.status(400).json({ error: 'Invalid number', input: number });
      return;
    }

    res.json({ input: number, output: result });
  });

  return app;
};

// Start server if run directly
const app = createApp();
const server = app.listen(PORT, () => {
  console.log(`numberstring API listening on port ${PORT}`);
  console.log(`Try: http://localhost:${PORT}/convert/42`);
});

export { app, server };
export default app;

/**
 * numberstring API Server Tests
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from './index.js';

const app = createApp();

describe('numberstring API', () => {
  describe('GET /', () => {
    it('should return API info', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('numberstring API');
      expect(res.body.version).toBe('1.0.0');
      expect(res.body.endpoints).toBeInstanceOf(Array);
    });
  });

  describe('GET /languages', () => {
    it('should list supported languages', async () => {
      const res = await request(app).get('/languages');
      expect(res.status).toBe(200);
      expect(res.body.languages).toBeInstanceOf(Array);
      expect(res.body.languages.length).toBeGreaterThan(5);
      expect(res.body.languages.find(l => l.code === 'en')).toBeTruthy();
      expect(res.body.languages.find(l => l.code === 'es')).toBeTruthy();
    });
  });

  describe('GET /convert/:number', () => {
    it('should convert a number to words', async () => {
      const res = await request(app).get('/convert/42');
      expect(res.status).toBe(200);
      expect(res.body.input).toBe('42');
      expect(res.body.output).toBe('forty-two');
      expect(res.body.lang).toBe('en');
    });

    it('should convert large numbers', async () => {
      const res = await request(app).get('/convert/1000000');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('one million');
    });

    it('should convert quadrillions', async () => {
      const res = await request(app).get('/convert/1000000000000000');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('one quadrillion');
    });

    it('should support Spanish', async () => {
      const res = await request(app).get('/convert/42?lang=es');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('cuarenta y dos');
      expect(res.body.lang).toBe('es');
    });

    it('should support French', async () => {
      const res = await request(app).get('/convert/80?lang=fr');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('quatre-vingts');
    });

    it('should support German', async () => {
      const res = await request(app).get('/convert/21?lang=de');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('einundzwanzig');
    });

    it('should support Russian', async () => {
      const res = await request(app).get('/convert/42?lang=ru');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('сорок два');
    });

    it('should support Portuguese', async () => {
      const res = await request(app).get('/convert/42?lang=pt');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('quarenta e dois');
    });

    it('should support capitalization', async () => {
      const res = await request(app).get('/convert/42?cap=title');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('Forty-Two');
    });

    it('should handle BigInt notation', async () => {
      const res = await request(app).get('/convert/1000000000000000000n');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('one quintillion');
    });

    it('should return error for invalid input', async () => {
      const res = await request(app).get('/convert/notanumber');
      expect(res.status).toBe(400);
      expect(res.body.error).toBeTruthy();
    });
  });

  describe('GET /ordinal/:number', () => {
    it('should convert to ordinal', async () => {
      const res = await request(app).get('/ordinal/1');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('first');
    });

    it('should handle complex ordinals', async () => {
      const res = await request(app).get('/ordinal/21');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('twenty-first');
    });

    it('should handle hundredth', async () => {
      const res = await request(app).get('/ordinal/100');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('one hundredth');
    });

    it('should support capitalization', async () => {
      const res = await request(app).get('/ordinal/1?cap=title');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('First');
    });
  });

  describe('GET /decimal/:number', () => {
    it('should convert decimals', async () => {
      const res = await request(app).get('/decimal/3.14');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('three point one four');
    });

    it('should handle zero point', async () => {
      const res = await request(app).get('/decimal/0.5');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('zero point five');
    });

    it('should return error for invalid decimal', async () => {
      const res = await request(app).get('/decimal/notadecimal');
      expect(res.status).toBe(400);
      expect(res.body.error).toBeTruthy();
    });
  });

  describe('GET /currency/:amount', () => {
    it('should convert USD', async () => {
      const res = await request(app).get('/currency/$123.45');
      expect(res.status).toBe(200);
      expect(res.body.output).toContain('one hundred twenty-three dollars');
      expect(res.body.output).toContain('forty-five cents');
    });

    it('should convert EUR', async () => {
      const res = await request(app).get('/currency/€50');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('fifty euros');
    });

    it('should convert GBP with pence', async () => {
      const res = await request(app).get('/currency/£1.01');
      expect(res.status).toBe(200);
      expect(res.body.output).toContain('one pound');
      expect(res.body.output).toContain('one penny');
    });

    it('should return error for invalid currency', async () => {
      const res = await request(app).get('/currency/notcurrency');
      expect(res.status).toBe(400);
      expect(res.body.error).toBeTruthy();
    });
  });

  describe('GET /roman/:number', () => {
    it('should convert to Roman numerals', async () => {
      const res = await request(app).get('/roman/42');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('XLII');
    });

    it('should handle 2024', async () => {
      const res = await request(app).get('/roman/2024');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('MMXXIV');
    });

    it('should support lowercase', async () => {
      const res = await request(app).get('/roman/4?lower=true');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('iv');
    });

    it('should return error for out of range', async () => {
      const res = await request(app).get('/roman/5000');
      expect(res.status).toBe(400);
      expect(res.body.error).toBeTruthy();
    });
  });

  describe('GET /parse/:words', () => {
    it('should parse words to number', async () => {
      const res = await request(app).get('/parse/forty-two');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('42');
    });

    it('should parse large numbers', async () => {
      const res = await request(app).get('/parse/one%20million');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('1000000');
    });

    it('should return error for unparseable words', async () => {
      const res = await request(app).get('/parse/notanumber');
      expect(res.status).toBe(400);
      expect(res.body.error).toBeTruthy();
    });
  });

  describe('GET /comma/:number', () => {
    it('should format with commas', async () => {
      const res = await request(app).get('/comma/1234567');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('1,234,567');
    });

    it('should handle small numbers', async () => {
      const res = await request(app).get('/comma/42');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('42');
    });

    it('should handle BigInt notation', async () => {
      const res = await request(app).get('/comma/1000000000000000000n');
      expect(res.status).toBe(200);
      expect(res.body.output).toBe('1,000,000,000,000,000,000');
    });
  });
});

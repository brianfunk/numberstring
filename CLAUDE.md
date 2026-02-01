# Claude Code Instructions for numberstring

## Project Context

This is a lightweight JavaScript library for converting numbers to English words. It's designed to be simple, fast, and have zero dependencies.

## Development Commands

```bash
npm install        # Install dev dependencies
npm test           # Run Vitest tests
npm run lint       # Run ESLint
npm run test:coverage  # Run tests with coverage report
```

## Code Style

- ES2022+ syntax (const/let, arrow functions, template literals)
- ESM modules only (`import`/`export`)
- Full JSDoc documentation
- 100% test coverage target

## Architecture

The library uses a mathematical approach to break numbers into groups of three digits (ones, thousands, millions, etc.) and converts each group to words.

Key constants:
- `ONES` - Words for 1-9
- `TEENS` - Words for 10-19
- `TENS` - Words for 20, 30, 40, etc.
- `ILLIONS` - Scale words (thousand, million, billion, trillion, quadrillion, etc.)

## When Making Changes

1. Ensure all tests pass: `npm test`
2. Maintain 100% coverage: `npm run test:coverage`
3. Run linter: `npm run lint`
4. Update CHANGELOG.md for any user-facing changes
5. Preserve the fun flair (ASCII art header, tagline)

## Known Limitations

- Maximum supported number: `Number.MAX_SAFE_INTEGER` (9,007,199,254,740,991)
- No decimal support
- English only
- No ordinal support (1st, 2nd, 3rd)

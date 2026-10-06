# Contributing to numberstring

First off, thanks for taking the time to contribute!

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in Issues
- If not, open a new issue with a clear title and description
- Include code samples and expected vs actual behavior

### Suggesting Features

- Open an issue describing the feature
- Explain why it would be useful

### Adding a New Language

We'd love help adding more languages! Here's how:

1. Create a new file in `languages/` (e.g., `pt.js` for Portuguese)
2. Follow the pattern in `languages/en.js`
3. Export a default function that converts non-negative integers to words
4. Add your language and its aliases to `languages/index.js`, re-export it from `index.js`, and add it to the `toWords` switch
5. Add a row to the spot-check table in `test/languages.test.js` and a named export in `index.d.ts`
6. Update README.md (feature list, language table, direct exports) and CHANGELOG.md
7. Submit a PR against `dev`

### Pull Request Process

1. Fork the repo and create your branch from `dev` (PRs target `dev`; `master` is the release branch)
2. Run `npm install` to install dependencies
3. Make your changes
4. Run `npm test` to ensure tests pass
5. Run `npm run lint` to check code style
6. Update documentation if needed
7. Submit your PR!

### Adding a New Conversion

1. Add the function to `index.js` (or `numerals.js` for glyph-based systems) with JSDoc and an `@example`
2. Return `false` for input you cannot convert; never throw
3. Add it to the export block, `index.d.ts`, the README at-a-glance table and API section, and CHANGELOG.md
4. Add tests in `test/extras.test.js`
5. Add a row to the playground in `site/app.js` if it is worth seeing

### Code Style

- ES2022+ syntax (const/let, arrow functions, template literals)
- ESM modules only
- **Zero runtime dependencies.** Dev dependencies only.
- Add JSDoc comments for public functions
- Maintain test coverage (`npm run test:coverage`)
- Unicode output must render with macOS system fonts out of the box

## Code of Conduct

Be respectful and inclusive. We welcome contributors of all backgrounds and experience levels.

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
3. Export a default function that converts numbers to words
4. Add your language to `languages/index.js`
5. Add tests in `test/index.test.js`
6. Update README.md with the new language
7. Submit a PR!

### Pull Request Process

1. Fork the repo and create your branch from `main`
2. Run `npm install` to install dependencies
3. Make your changes
4. Run `npm test` to ensure tests pass
5. Run `npm run lint` to check code style
6. Update documentation if needed
7. Submit your PR!

### Code Style

- ES2022+ syntax (const/let, arrow functions, async/await)
- ESM modules only
- Add JSDoc comments for public functions
- Maintain test coverage

## Code of Conduct

Be respectful and inclusive. We welcome contributors of all backgrounds and experience levels.

# Changelog

## 1.0.1 (2026-09-28)

- Standardize package documentation, preserve the API reference and upstream attribution, and add Stackline community links.
- Add focused npm discovery keywords and consistent repository metadata.
- Keep runtime behavior and dependency versions unchanged.
- Correct the pinned artifact-upload action commit while preserving the publish.yml workflow and Prod environment.

## 1.0.0

- Fork adler-32 1.3.1 under the `@stackline` scope; retain its Apache-2.0 license and API.
- The `str` function encodes unpaired UTF-16 surrogates as U+FFFD, matching standard UTF-8 encoders. Valid strings, byte inputs, signed results, and seed behavior are preserved.
- Replace obsolete test dependencies with Mocha 12 and a locked, audited development install.
- Build the original source fragments with Node.js and validate declaration usage with current TypeScript; remove unused legacy coverage, minifier, codepage and type-checking dependencies.

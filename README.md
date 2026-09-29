# @stackline/adler-32

> Pure-JS ADLER-32.

[![npm version](https://img.shields.io/npm/v/@stackline/adler-32.svg?style=flat-square)](https://www.npmjs.com/package/@stackline/adler-32)
[![license](https://img.shields.io/npm/l/@stackline/adler-32.svg?style=flat-square)](https://github.com/alexandroit/stackline-adler-32)
[![GitHub repository](https://img.shields.io/badge/GitHub-repository-181717?style=flat-square&logo=github)](https://github.com/alexandroit/stackline-adler-32)
[![Docs](https://img.shields.io/badge/docs-alexandro.net-0f766e?style=flat-square)](https://alexandro.net/docs/vanilla/adler-32/)
[![Reddit community](https://img.shields.io/badge/community-r%2FStackline-ff4500?style=flat-square&logo=reddit&logoColor=white)](https://www.reddit.com/r/Stackline/)

**[Documentation](https://alexandro.net/docs/vanilla/adler-32/)** | **[npm](https://www.npmjs.com/package/@stackline/adler-32)** | **[Issues](https://github.com/alexandroit/stackline-adler-32/issues)** | **[Repository](https://github.com/alexandroit/stackline-adler-32)**

**Current package version:** `1.0.2`

---

## Why this package?

Maintained fork of [adler-32](https://github.com/SheetJS/js-adler32) 1.3.1. Apache-2.0; original copyright notices are retained.

The `str` function encodes unpaired UTF-16 surrogates as U+FFFD, matching standard UTF-8 encoders. Valid strings, byte inputs, signed results, and seed behavior are preserved.

Requires Node.js 20.19 or newer. No runtime dependencies.

Signed ADLER-32 algorithm implementation in JS (for the browser and nodejs).
Emphasis on correctness, performance, and IE6+ support.

## Compatibility

| Item | Value |
| --- | --- |
| Package | `@stackline/adler-32@1.0.2` |
| Supported Node.js | `>=20.19.0` |
| Module entry | `adler32.js` (CommonJS) |
| Runtime dependencies | 0 direct dependencies |
| Types | `types/index.d.ts` |

## Installation

```bash
npm install @stackline/adler-32
```

With [npm](https://www.npmjs.com/package/@stackline/adler-32):

```bash
$ npm install @stackline/adler-32
```

In the browser:

```html
<script src="adler32.js"></script>
```

The browser exposes a variable `ADLER32`.

The scoped package does not install an `adler32` command. The separate upstream
`adler32-cli` examples below describe that independently installed tool.

The script will manipulate `module.exports` if available .  This is not always
desirable.  To prevent the behavior, define `DO_NOT_EXPORT_ADLER`.

## Usage

```js
const ADLER32 = require('@stackline/adler-32');
console.log(ADLER32.str('SheetJS')); // 176947863
```

In all cases, the relevant function takes an argument representing data and an
optional second argument representing the starting "seed" (for running hash).

The return value is a signed 32-bit integer.

- `ADLER32.buf(byte array or buffer[, seed])` assumes the argument is a sequence
  of 8-bit unsigned integers (nodejs `Buffer`, `Uint8Array` or array of bytes).

- `ADLER32.bstr(binary string[, seed])` assumes the argument is a binary string
  where byte `i` is the low byte of the UCS-2 char: `str.charCodeAt(i) & 0xFF`

- `ADLER32.str(string)` assumes the argument is a standard JS string and
  calculates the hash of the UTF-8 encoding.

For example:

```js
// var ADLER32 = require('@stackline/adler-32');           // uncomment if in node
ADLER32.str("SheetJS")                          // 176947863
ADLER32.bstr("SheetJS")                         // 176947863
ADLER32.buf([ 83, 104, 101, 101, 116, 74, 83 ]) // 176947863

adler32 = ADLER32.buf([83, 104])                // 17825980  "Sh"
adler32 = ADLER32.str("eet", adler32)           // 95486458  "Sheet"
ADLER32.bstr("JS", adler32)                     // 176947863  "SheetJS"

[ADLER32.str("\u2603"),  ADLER32.str("\u0003")]  // [ 73138686, 262148 ]
[ADLER32.bstr("\u2603"), ADLER32.bstr("\u0003")] // [ 262148,   262148 ]
[ADLER32.buf([0x2603]),  ADLER32.buf([0x0003])]  // [ 262148,   262148 ]
```

## Features

### Performance

`make perf` will run algorithmic performance tests (which should justify certain
decisions in the code).

Bit twiddling is much faster than taking the mod in Safari and Firefox browsers.
Instead of taking the literal mod 65521, it is faster to keep it in the integers
by bit-shifting: `65536 ~ 15 mod 65521` so for nonnegative integer `a`:

```
    a = (a >>> 16) * 65536 + (a & 65535)            [equality]
    a ~ (a >>> 16) * 15    + (a & 65535) mod 65521
```

The mod is taken at the very end, since the intermediate result may exceed 65521

### Magic Number

The magic numbers were chosen so as to not overflow a 31-bit integer:

```mathematica
F[n_] := Reduce[x*(x + 1)*n/2 + (x + 1)*(65521) < (2^31 - 1) && x > 0, x, Integers]
F[255] (* bstr:  x \[Element] Integers && 1 <= x <= 3854 *)
F[127] (* ascii: x \[Element] Integers && 1 <= x <= 5321 *)
```

Subtract up to 4 elements for the Unicode case.

## Security

ADLER-32 detects accidental data changes; it is not a cryptographic hash or an authentication mechanism.

## API Surface

The usage reference above documents the existing public API and its input/output behavior.

## Local Development

Clone the [repository](https://github.com/alexandroit/stackline-adler-32) and run the following commands from its root:

```bash
npm ci
npm run build
npm test
npm run lint
npm run test:types
```

The retained upstream development notes below include historical tooling; the commands above are the maintained package checks.

### Stackline development

Run `npm ci`, `npm run build`, `npm test` and `npm run lint` and `npm run test:types`. The checked-in upstream fixtures and focused regression suite run without downloading external test data.

### Upstream testing

`make test` will run the nodejs-based test.

To run the in-browser tests, run a local server and go to the `ctest` directory.
`make ctestserv` will start a python `SimpleHTTPServer` server on port 8000.

To update the browser artifacts, run `make ctest`.

To generate the bits file, use the `adler32` function from python `zlib`:

```python
>>> from zlib import adler32
>>> x="foo bar baz٪☃🍣"
>>> adler32(x)
1543572022
>>> adler32(x+x)
-2076896149
>>> adler32(x+x+x)
2023497376
```

The [`adler32-cli`](https://www.npmjs.com/package/adler32-cli) package includes
scripts for processing files or text on standard input:

```bash
$ echo "this is a test" > t.txt
$ adler32-cli t.txt
726861088
```

For comparison, the `adler32.py` script in the subdirectory uses python `zlib`:

```bash
$ packages/adler32-cli/bin/adler32.py t.txt
726861088
```

## Release Checklist

1. Update the package version, lockfile, generated version fields, and changelog together.
2. Run the development checks above and audit both `npm audit` and `npm audit --omit=dev`.
3. Use the [GitHub publish workflow](https://github.com/alexandroit/stackline-adler-32/actions/workflows/publish.yml) with its `Prod` environment to publish the exact CI tarball.
4. Verify public npm bytes, package identity, provenance, and the immutable GitHub release evidence.

## License

[Apache-2.0](https://github.com/alexandroit/stackline-adler-32/blob/main/LICENSE). Original copyright notices and upstream attribution are retained.

Please consult the attached LICENSE file for details.  All rights not explicitly
granted by the Apache 2.0 license are reserved by the Original Author.

See [NOTICE](https://github.com/alexandroit/stackline-adler-32/blob/main/NOTICE) for retained attribution.

## Credits and original authors

- sheetjs.
- Copyright (C) 2014-present   SheetJS LLC.
- Original work Copyright SheetJS; distributed under the Apache License 2.0.
- Stackline modifications Copyright 2026 Stackline contributors.
- Stackline maintenance: [Alexandro Paixao Marques](https://www.linkedin.com/in/aleinfo/) and [Stackline contributors](https://github.com/alexandroit).

Original copyright, license notices and contributor acknowledgements remain part of this distribution. Stackline maintenance does not replace authorship of the original work.

## Community and Links

- [Stackline website](https://alexandro.net/)
- [GitHub projects](https://github.com/alexandroit)
- [npm packages](https://www.npmjs.com/~alex360qc)
- [Reddit community — r/Stackline](https://www.reddit.com/r/Stackline/)
- [Maintainer LinkedIn](https://www.linkedin.com/in/aleinfo/)

Use this repository's issue tracker for reproducible bugs and feature requests. Join r/Stackline for examples, usage questions and release discussions.

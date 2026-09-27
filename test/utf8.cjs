'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const checksum = require('../');

function reference(bytes, seed = 1) {
  let a = seed & 0xffff, b = seed >>> 16;
  for (const byte of bytes) { a = (a + byte) % 65521; b = (b + a) % 65521; }
  return ((b % 65521) << 16) | (a % 65521);
}

describe('UTF-8 and compatibility regressions', function () {
  const cases = ['', 'ASCII', 'café 日本語', '😀𝄞', '\ud800', '\udc00', '\ud800A', '\udc00B', '\ud800\ud800', '\udc00\ud800', '\ud800\udc00', 'x'.repeat(2917) + '\ud800A', ('😀\ud800A').repeat(4000)];
  for (const input of cases) it('matches encoded bytes for ' + JSON.stringify(input.slice(0, 24)), function () {
    for (const seed of [undefined, 0, 1, -1, 0x12345678]) {
      const bytes = Buffer.from(input, 'utf8');
      const expected = reference(bytes, seed);
      assert.equal(checksum.str(input, seed), expected);
      assert.equal(checksum.buf(bytes, seed), expected);
      assert.equal(checksum.bstr(bytes.toString('latin1'), seed), expected);
    }
  });
  it('matches a byte reference for every individual UTF-16 code unit', function () {
    for (let code = 0; code <= 0xffff; ++code) {
      const input = String.fromCharCode(code);
      assert.equal(checksum.str(input), reference(Buffer.from(input)), 'U+' + code.toString(16));
    }
  });
  it('preserves seeded byte streaming at every split', function () {
    const bytes = Buffer.from('café 😀 \ud800 end');
    for (let i = 0; i <= bytes.length; ++i)
      assert.equal(checksum.buf(bytes.subarray(i), checksum.buf(bytes.subarray(0, i))), reference(bytes));
  });
  it('works in the browser global without Buffer or Node APIs', function () {
    const context = {};
    vm.runInNewContext(fs.readFileSync(require.resolve('../'), 'utf8'), context);
    assert.equal(context.ADLER32.str('\ud800A😀'), reference(Buffer.from('\ud800A😀')));
  });
});

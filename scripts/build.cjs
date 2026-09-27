/* Build the upstream source fragments without shell or Make dependencies. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const version = require('../package.json').version;
const library = 'adler32';
fs.writeFileSync(path.join(root, 'bits/01_version.js'), library.toUpperCase() + ".version = '" + version + "';\n");
const source = fs.readdirSync(path.join(root, 'bits')).filter(name => name.endsWith('.js')).sort()
  .map(name => fs.readFileSync(path.join(root, 'bits', name), 'utf8')).join('').replace(/[\r\x1a]/g, '');
const output = source.replace(/^[ \t]*\/\*[:#][^*]*\*\/\s*(\n)?/gm, '').replace(/\/\*[:#][^*]*\*\//gm, '');
fs.writeFileSync(path.join(root, library + '.js'), output);

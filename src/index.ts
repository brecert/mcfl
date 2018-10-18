const fs = require('fs')
const { join } = require('path')
const { Parser } = require('./parser')
const { Translator } = require('./translator')

// Output
const cmd = fs.readFileSync(join('test.cmd'), 'utf8');
const ast = new Parser().parse(cmd);
const mcfunctions = new Translator().walk(ast)
console.log(mcfunctions[0].join('\n'))
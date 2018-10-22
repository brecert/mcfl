const fs = require('fs')
const { join } = require('path')
const { Parser } = require('./parser')
const { Exporter } = require('./exporter')
const { Translator } = require('./translator')

// Output
const cmd = fs.readFileSync(join('test.cmd'), 'utf8');
const ast = new Parser().parse(cmd);
const translator = new Translator()
const mcfunction = translator.walk(ast)
// console.log(translator.io)
// console.log(mcfunction)

const exporter = new Exporter(translator.io)
const exported = exporter.consoleExport()
console.log(exporter.io.join("\n"))
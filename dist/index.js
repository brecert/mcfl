"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser");
const exporter_1 = require("./exporter");
const translator_1 = require("./translator");
// // Output
// const cmd = fs.readFileSync(join('./examples/afk.mcfl'), 'utf8');
// const ast = new Parser().parse(cmd);
// const translator = new Translator()
// const mcfunction = translator.walk(ast)
// // console.log(translator.io)
// // console.log(mcfunction)
// const exporter = new Exporter(translator.io)
// const exported = exporter.consoleExport()
// console.log(exporter.io.join("\n"))
function transpileString(str, debug = false) {
    const ast = new parser_1.Parser().parse(str);
    const translator = new translator_1.Translator();
    const mcfunction = translator.walk(ast);
    if (debug) {
        console.log('--debug--');
        console.log(ast);
        console.log(translator.io);
        console.log(mcfunction);
    }
    const exporter = new exporter_1.Exporter(translator.io);
    if (debug) {
        exporter.consoleExport();
        console.log(exporter.io.join("\n"));
    }
    return exporter;
}
exports.transpileString = transpileString;
// const cmd = fs.readFileSync(join('./examples/bending.mcfl'), 'utf8')
// transpileString(cmd).exportFiles('./test')

import { Parser } from './parser'
import { Exporter } from './exporter'
import { Translator } from './translator'

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

export function transpileString(str: string, debug: boolean = false) {
  const ast = new Parser().parse(str)
  const translator = new Translator()
  const mcfunction = translator.walk(ast)
  if(debug) {
  	console.log('--debug--')
  	console.log(ast)
  	console.log(translator.io)
  	console.log(mcfunction)
  }
  const exporter = new Exporter(translator.io)
  if(debug) {
    exporter.consoleExport()
    console.log(exporter.io.join("\n"))
  }
  return exporter
}

// const cmd = fs.readFileSync(join('./examples/bending.mcfl'), 'utf8')
// transpileString(cmd).exportFiles('./test')

const ohm = require('ohm-js')
const { join } = require('path')
const fs = require('fs')
const contents = fs.readFileSync(join(__dirname, 'grammar', 'cmd.ohm'), 'utf8')
const AST = require('./ast')


// Translator
class Parser {
  grammar
  semantics

  constructor() {
    this.grammar = ohm.grammar(contents)
    const self = this
    
    this.semantics = this.grammar.createSemantics().addOperation( 'parse', {
      Block(begin, selector, value, statement, end) {
        return new AST.Block(statement.parse())
      },
      
      raw(begin, content, end) {
        return new AST.Raw(content.sourceString)
      }
    });
  }

  parse(input) {
    const match = this.grammar.match(input);
    if (match.succeeded()) {
      return this.semantics(match).parse()
    } else {
      throw match.message;
    }
  }
}

// Output
const cmd = fs.readFileSync(join(__dirname, 'test.cmd'), 'utf8');
const out = new Parser().parse(cmd);
console.log(JSON.stringify(out, null,' '));
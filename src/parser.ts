const ohm = require('ohm-js')
const fs = require('fs')
const { join } = require('path')
const contents = fs.readFileSync(join(__dirname, 'grammar', 'cmd.ohm'), 'utf8')
const AST = require('./ast')


// Translator
export class Parser {
  grammar
  semantics

  constructor() {
    this.grammar = ohm.grammar(contents)
    const self = this
    
    this.semantics = this.grammar.createSemantics().addOperation( 'parse', {
      LocalAssignment(target, _, value) {
        return new AST.LocalAssignment(target.parse(), value.parse())
      },

      Block(begin, _, selector, statement, end) {
        return new AST.Block(statement.parse(), selector.parse()[0].value)
      },
      
      raw(begin, content, end) {
        return new AST.Raw(content.sourceString)
      },

      ident(letter, alnum) {
        return this.sourceString
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
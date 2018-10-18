ohm = require('ohm-js')
join = require('path').join
fs = require('fs')
contents = fs.readFileSync(join(__dirname, 'grammar', 'cmd.ohm'), 'utf8')

# Translator
class Parser
  constructor: ->
    @grammar = ohm.grammar(contents)
    @io = []
    @namespaceStack = ['test']
    @selectorStack = ['@s']
    self = this
    
    @semantics = @grammar.createSemantics().addOperation( 'parse', {
      Block: (begin, selector, value, statement, end) ->
        new AST.Block(statement.parse())
      
      raw: (begin, content, end) ->
        new AST.Raw content.sourceString
    })

  parse: (input) ->
    match = this.grammar.match(input)
    if match.succeeded()
      this.semantics(match).parse()
    else
      throw match.message

# Output
cmd = fs.readFileSync(join(__dirname, 'test.cmd'), 'utf8')
out = new Parser(ohm).parse(cmd)

console.log JSON.stringify(out, null,' ')
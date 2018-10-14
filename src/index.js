const ohm = require('ohm-js')
const join = require('path').join
const fs = require('fs')

const contents = fs.readFileSync(join(__dirname, 'grammar', 'cmd.ohm'))
const grammar = ohm.grammar(contents)

class Translator {
	constructor() {
		this.namespace = "test"

		this.out = [] // of string

		this.semantics = grammar.createSemantics().addOperation('eval', {
			Program: (data) => {
				return data.eval()
			},

			identifier: function(data) {
				return data.eval()
			},

			identifierName: function(data) {
				return this.sourceString
			},

			identifierPart: function(data) {
				return data
			},

		  number: function(data) {
		  	console.log("number")
		    return parseInt(chars, 10);
		  },

			InternalAssignment: function(target, seperator, value) {
				let r

				switch(target.eval()) {
					case 'namespace':
						updateNamespace(value.eval())
						break;
					default:
						break;
				}
			},

			raw: function(open, data, close) {
				console.log(data)
				return this.sourceString
			},

			_terminal: function() {
				console.log("_terminal")
				return this.sourceString
			}
		})
	}

	updateNamespace(string) {
		this.namespace = string
		this.out.push(`# namespace: ${string}`)
	}

	parse(input) {
		let match
		let result

		match = grammar.match(input)
		if (match.succeeded()) {
	  	result = this.semantics(match).eval()
		} else {
	  	result = match.message
		}
		return result
	}
}

out = new Translator().parse(`

namespace: click


`)[0]
ppOut = JSON.stringify(out, null, '  ')
console.log(ppOut)
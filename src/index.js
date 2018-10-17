const ohm = require('ohm-js')
const join = require('path').join
const fs = require('fs')

const contents = fs.readFileSync(join(__dirname, 'grammar', 'cmd.ohm'))


class Translator {
	constructor() {
		this.grammar = ohm.grammar(contents)

		this.namespace = 'test'
		this.selector = '@s'

		let self = this
		this.semantics = this.grammar.createSemantics().addOperation('parse', {
			Program(sourceElement) {
				return sourceElement.parse()
			},

			identifierName(parts) {
				return this.sourceString
			},

			selector(_, type) {
				return type.parse()
			},

			Block(type) {
				return `
# BEGIN
${type.parse()}
# END`
			},

			SelectorBlock(begin, selector, block, end) {
				self.updateSelector(selector.sourceString)

				let name = `${self.namespace}:as/${selector.parse()}`

				return `execute as ${selector.sourceString} run function ${name}

# ${name}.mcfunction 
${block.parse()}`
			},

			DefaultBlock(begin, block, end) {
				let name = `${self.namespace}:as/execute/0`

				return `execute run function ${name}
# ${name}.mcfunction
${block.parse()}`
			},

			ConditionalIf(_, target, comparator, value, block) {
				return `execute if score @s ${target.parse()} matches ${self.toRange(comparator.parse(), value.parse())} ${block.parse()}`
			},

			StatementList(statments) {
				let out = []

				for(let child of statments.children) {
					out.push(child.parse())
				}
				return out.join("\n")
			},

			VariableDeclaration(modifier, target, _, value) {
				return `scoreboard players set @s ${target.parse()} ${value.parse()}`
			},

			InternalAssignment(target, _, value) {
				let res

				switch(target.parse()) {
					case 'namespace':
						res = self.updateNamespace(value.parse())
						break;
					default:
						res = ''
						break;
				}

				return res
			},

			Statement(item) {
				return item.parse()
			},

			comparator(not, greater, equal, equals) {
				return this.sourceString
			},

			letter(char) {
				return this.sourceString
			},

			number(char) {
				return this.sourceString
			}
		})
	}

	toRange(comparator, value) {
		let out

		switch (comparator) {
			case '>':
				out = `${value}..`
				break
			case '<':
				out = `..${value}`
				break
			case '==':
				out = value
				break
			default:
				console.warn("Unknown comparator, using exact")
				break;
		}
		return out
	}

	updateNamespace(value) {
		this.namespace = value
		return `# data/${value}`
	}

	updateSelector(value) {
		this.selector = value
	}

	parse(input) {
		let match
		let result

		match = this.grammar.match(input)
		if (match.succeeded()) {
	  	result = this.semantics(match).parse()
		} else {
	  	result = match.message
		}
		return result
	}
}

let out
let ppOut

out = new Translator().parse(`

namespace: click

do as @a
	if clicked > 0 do
	end

	clicked = 0
	clicked = 1
end

`).join('\n')
// out = JSON.stringify(out, null, '  ')
console.log(out)
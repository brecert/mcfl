import * as AST from './ast'

export class Translator {
	namespace: string
	selector: string
	path: string[]

	io

	constructor() {
		this.namespace = 'test'
		this.selector = '@s'
		this.path = []
		this.io = {}
	}

	walk(node) {
		console.log(`walking: ${node.name}`)

		if( Array.isArray(node) ) {
			return this.walkArray(node)
		} else {
			switch (node.name) {
				case "Block":
					return this.walkBlock(node)
				case "Raw":
					return this.walkRaw(node)
				default:
					throw `Unknown node type ${JSON.stringify(node)}`
					break;
			}
		}
	}

	walkArray(nodes: AST.Block[]) {
		let result = []

		for(let node of nodes) {
			result.push(this.walk(node))
		}

		return result
	}

	walkBlock(node: AST.Block) {
		this.io[this.selector]
		return this.walk(node.statement)
	}

	walkRaw(node: AST.Raw) {
		return node.value
	}
}
import * as AST from './ast'

export class Translator {
	namespace: string
	selector: string
	path: string[]

	io

	constructor() {
		this.namespace = 'test'
		this.selector = '@s'
		this.path = ['main']
		this.io = {}
	}

	walk(node) {
		console.log(`walking: ${node.name}`)

		if( Array.isArray(node) ) {
			return this.walkArray(node)
		} else {
			switch (node.astName) {
				case "Block":
					return this.walkBlock(node)
				case "Definition":
					return this.walkDefinition(node)
				case "LocalAssignment":
					return this.walkLocalAssignment(node)
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

	walkLocalAssignment(node: AST.LocalAssignment) {
		switch (node.target) {
			case "namespace":
				this.updateNamespace(node.value)
				break
			default:
				throw `unknown local assignment ${node.target}`
				break
		}
	}

	walkDefinition(node: AST.Definition) {
		this.updatePath(node.name)
		this.walk(node.block)
		this.path.pop()
	}

	walkBlock(node: AST.Block) {
		if(node.selector != undefined) {
			this.updateSelector(node.selector)
		}
		return this.walk(node.statement)
	}

	walkRaw(node: AST.Raw) {
		this.add(node.value)
		return node.value
	}

	add<T>(value: T) {
		let path = this.path.slice(-1)[0]

		if(!(this.namespace in this.io)) {
			this.io[this.namespace] = []
		}

		if(!(path in this.io[this.namespace])) {
			this.io[this.namespace][path] = []
		}

		this.io[this.namespace][path].push(value)
	}

	genPath(value: string) {
		return `${this.namespace}:${value}`
	}

	updateWorkingFile(path: string = this.path.slice(-1)[0]) {
		this.add(`execute as ${this.selector} run function ${this.genPath(path)}`)
		this.path.push(path)
	}

	updatePath(path: string) {
		this.path.push(path)
	}

	updateNamespace(name: string) {
		this.namespace = name
	}

	updateSelector(raw_selector: string | undefined) {
		if(raw_selector === undefined) {
			raw_selector = this.selector
		}

		let selector

		this.selector = raw_selector
		selector = raw_selector.replace(/[^0-9\-a-z\_]/g,'');

		if(selector in this.io) {
			let i

			while(selector in this.io) {
				i++

				selector = `${selector}${i}`
			}

			this.updateWorkingFile(selector)
		} else {
			this.updateWorkingFile(selector)
		}
	}
}








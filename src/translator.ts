import * as AST from './ast'
import { last } from './util/last'

interface BlockInfo {
	type: string
	selector: string
}

export class Translator {
	namespace: string
	path: string[]

	// blockType is the type of block you are in
	// 
	// this should help when checking if a block is in
	// a definition or if it's anonymous
	blockInfo: BlockInfo[]

	io

	constructor() {
		this.namespace = 'test'
		this.path = ['main']
		this.blockInfo = [{type: 'main', selector: '@s'}]
		this.io = {}
	}

	// Top level walk to other walks to make it easier
	// and more consistent when adding or modifying code
	// 
	// The structure emulates method overloading
	walk(node) {
		console.log(`walking: ${node.astName}`)

		if( Array.isArray(node) ) {
			return this.walkArray(node)
		} else {
			if(node.astName === undefined) {
				throw `Unknown node type ${node.astName} with data ${JSON.stringify(node)}`
			}

			if(`walk${node.astName}` in this) {
				this[`walk${node.astName}`](node)
			} else {
				throw `No walk set for '${node.astName}'`
			}
		}
	}

	// Walks an array of AST Nodes
	walkArray(nodes: AST.ASTNode[]) {
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
		this.blockInfo.push({type: 'def', selector: '$none'})
		this.updatePath(node.name, () => {
			this.walk(node.block)
		})
		this.blockInfo.pop()
	}

	walkBlock(node: AST.Block) {
		if(last(this.blockInfo).type != "def") {
			this.blockInfo.push({type: 'block', selector: '$none'})
			this.updateSelector(node.selector)
			this.blockInfo.pop()
		}

		this.walk(node.statement)
	}

	walkRaw(node: AST.Raw) {
		this.add(node.value)
		return node.value
	}

	// Adds text to the "io"
	// 
	// This handles most if not all of the work
	// involving paths and namespacing for the exporter
	add<T>(value: T) {
		let path = last(this.path)

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

	updateWorkingFile(path: string = last(this.path), selector = this.currentSelector()) {
		let as = ''

		if(selector != undefined && selector != '$inherit' && selector != '$none') {
			as = `as ${selector} `
		} else if (selector == '$none') {
			as = ''
		}

		switch (last(this.blockInfo).type) {
			case "def":
				break
			default:
				this.add(`execute ${as}run function ${this.genPath(path)}`)
				break;
		}
		this.path.push(path)
	}

	updatePath(path: string, cb) {
		this.path.push(path)
		cb()
		this.path.pop()
	}

	updateNamespace(name: string) {
		this.namespace = name
	}

	addBlock(name: string, selector = '$none') {
		this.blockInfo.push({type: name, selector: selector})
	}

	// Updates the currently used selector
	// 
	// formats correctly for future use
	updateSelector(raw_selector: string | undefined) {
		let selector

		if(raw_selector == undefined) {
			selector = '$none'
		} else {
			selector = raw_selector
		}

		last(this.blockInfo).selector = selector
		selector = selector.replace(/[^0-9\-a-z\_]/g,'');

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

	currentSelector() {
		return last(this.blockInfo).selector
	}
}








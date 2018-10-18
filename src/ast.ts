export abstract class ASTNode {
	constructor(public name: string) {
		this.name = name
 	}
}

export class Block extends ASTNode {
	statement
	selector

	constructor(statement, selector = '@s') {
		super('Block')
		this.statement = statement
		this.selector = selector
	}
}

export class Raw extends ASTNode {
	value

	constructor(value) {
		super('Raw')
		this.value = value
	}
}
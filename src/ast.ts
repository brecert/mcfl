export abstract class ASTNode {
	constructor(public name: string) {
		this.name = name
 	}
}

export class LocalAssignment extends ASTNode {
	target
	value

	constructor(target, value) {
		super('LocalAssignment')
		this.target = target
		this.value = value
	}
}

export class Block extends ASTNode {
	statement
	selector

	constructor(statement, selector?) {
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
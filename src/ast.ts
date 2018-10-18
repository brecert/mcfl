export class Block {
	statement
	selector

	constructor(statement, selector = '@s') {
		this.statement = statement
		this.selector = selector
	}
}

export class Raw {
	value

	constructor(value) {
		this.value = value
	}
}
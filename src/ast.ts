export abstract class ASTNode {
  constructor(public astName: string) {
    this.astName = astName
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

export class Definition extends ASTNode {
  name
  block

  constructor(name, block) {
    super('Definition')
    this.name = name
    this.block = block
  }
}

export class Call extends ASTNode {
  name
  args

  constructor(name, args?) {
    super('Call')
    this.name = name
    this.args = args
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
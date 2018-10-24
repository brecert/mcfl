export abstract class ASTNode {
  constructor(public astName: string) {
    this.astName = astName
  }

  isA(type) {
    return this.astName === type
  }

  abstract toPrimitive<T>(): string
}

interface Assignment {
  target
  value
}

export class DefaultAssignment extends ASTNode implements Assignment {
  target
  value

  constructor(target, value) {
    super('DefaultAssignment')
    this.target = target
    this.value = value
  }

  toPrimitive() {
    return this.target
  }
}

export class InitialAssignment extends ASTNode {
  modifier
  target
  criteria

  constructor(modifier, target, criteria?) {
    super('InitialAssignment')
    this.modifier = modifier
    this.target = target
    this.criteria = criteria
  }

  toPrimitive() {
    return this.target
  }
}

export class PrivateAssignment extends ASTNode implements Assignment {
  target
  value

  constructor(target, value) {
    super('PrivateAssignment')
    this.target = target
    this.value = value
  }

  toPrimitive() {
    return this.target
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

  toPrimitive() {
    return this.name
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

  toPrimitive() {
    return this.name
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

  toPrimitive() {
    return this.selector
  }
}

export class Raw extends ASTNode {
  value

  constructor(value) {
    super('Raw')
    this.value = value
  }

  toPrimitive() {
    return this.value
  }
}
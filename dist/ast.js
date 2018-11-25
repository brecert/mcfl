"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ASTNode {
    constructor(astName) {
        this.astName = astName;
        this.astName = astName;
    }
    isA(type) {
        return this.astName === type;
    }
}
exports.ASTNode = ASTNode;
class DefaultAssignment extends ASTNode {
    constructor(target, value) {
        super('DefaultAssignment');
        this.target = target;
        this.value = value;
    }
    toPrimitive() {
        return this.target;
    }
}
exports.DefaultAssignment = DefaultAssignment;
class InitialAssignment extends ASTNode {
    constructor(modifier, target, criteria) {
        super('InitialAssignment');
        this.modifier = modifier;
        this.target = target;
        this.criteria = criteria;
    }
    toPrimitive() {
        return this.target;
    }
}
exports.InitialAssignment = InitialAssignment;
class PrivateAssignment extends ASTNode {
    constructor(target, value) {
        super('PrivateAssignment');
        this.target = target;
        this.value = value;
    }
    toPrimitive() {
        return this.target;
    }
}
exports.PrivateAssignment = PrivateAssignment;
class Macro extends ASTNode {
    constructor(name, args, block) {
        super('Macro');
        this.name = name;
        this.args = args;
        this.block = block;
    }
    toPrimitive() {
        return this.name;
    }
}
exports.Macro = Macro;
class MacroArgument extends ASTNode {
    constructor(name, type, splat) {
        super('MacroArgument');
    }
    toPrimitive() {
        return this.name;
    }
}
exports.MacroArgument = MacroArgument;
class Definition extends ASTNode {
    constructor(name, block) {
        super('Definition');
        this.name = name;
        this.block = block;
    }
    toPrimitive() {
        return this.name;
    }
}
exports.Definition = Definition;
class Call extends ASTNode {
    constructor(name, args) {
        super('Call');
        this.name = name;
        this.args = args;
    }
    toPrimitive() {
        return this.name;
    }
}
exports.Call = Call;
class Block extends ASTNode {
    constructor(statement, selector) {
        super('Block');
        this.statement = statement;
        this.selector = selector;
        this.statement = statement;
        this.selector = selector;
    }
    toPrimitive() {
        return this.selector;
    }
}
exports.Block = Block;
class StringLiteral extends ASTNode {
    constructor(value) {
        super('StringLiteral');
        this.value = value;
    }
    toPrimitive() {
        return "";
    }
}
exports.StringLiteral = StringLiteral;
class StringInterpolation extends ASTNode {
    constructor(expressions) {
        super('StringInterpolation');
        this.expressions = expressions;
    }
    toPrimitive() {
        return this.expressions;
    }
}
exports.StringInterpolation = StringInterpolation;
class Raw extends ASTNode {
    constructor(value) {
        super('Raw');
        this.value = value;
    }
    toPrimitive() {
        return this.value;
    }
}
exports.Raw = Raw;

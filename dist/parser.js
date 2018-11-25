"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ohm = require('ohm-js');
const fs = require('fs-extra');
const { join } = require('path');
const contents = fs.readFileSync(join(__dirname, 'grammar', 'mcfl.ohm'), 'utf8');
const AST = require('./ast');
// Translator
class Parser {
    constructor() {
        this.grammar = ohm.grammar(contents);
        const self = this;
        this.semantics = this.grammar
            .createSemantics()
            .addOperation('parse', {
            PrivateAssignment(target, _, value) {
                return new AST.PrivateAssignment(target.parse(), value.parse());
            },
            DefaultAssignment(target, is, value) {
                return new AST.DefaultAssignment(target.parse(), value.parse());
            },
            InitialAssignment(modifier, target, using, criteria) {
                let parsedCriteria = criteria.parse();
                if (parsedCriteria.length > 0) {
                    return new AST.InitialAssignment(modifier.parse(), target.parse(), parsedCriteria[0].value);
                }
                else {
                    return new AST.InitialAssignment(modifier.parse(), target.parse());
                }
            },
            Macro(key, name, open, args, close, block) {
                console.log(new AST.Macro(name.parse(), args.parse(), block.parse()));
            },
            MacroArgument(splat, name, _, type) {
                if (splat.parse() != undefined) {
                    return new AST.MacroArgument(name.parse(), type.parse(), true);
                }
                else {
                    return new AST.MacroArgument(name.parse(), type.parse(), false);
                }
            },
            Definition(def, name, block) {
                return new AST.Definition(name.parse(), block.parse());
            },
            Call_paramaterized(name, begin, args, end) {
                return new AST.Call(name.parse(), args.parse());
            },
            Call_optional_paramaterized(name, args) {
                return new AST.Call(name.parse(), args.parse());
            },
            Call_run(run, name) {
                return new AST.Call(name.parse());
            },
            Block(begin, _, selector, statement, end) {
                let sel = selector.parse();
                if (0 in sel) {
                    return new AST.Block(statement.parse(), sel[0].value);
                }
                else {
                    return new AST.Block(statement.parse());
                }
            },
            string(begin, data, close) {
                console.log(data.parse());
            },
            interpolation(begin, data, close) {
                return data.parse();
            },
            raw(begin, content, end) {
                return new AST.Raw(content.sourceString);
            },
            ident(alnum) {
                return this.sourceString;
            },
            number(num) {
                return parseFloat(this.sourceString);
            },
            NonemptyListOf(x, seperator, xs) {
                return [x.parse()].concat(xs.parse());
            },
            EmptyListOf() {
                return [];
            },
            _terminal() {
                return this.sourceString;
            },
        })
            .addOperation('isA(type)', {
            _nonterminal(children) {
                return this.astName === this.args.type;
            },
        });
    }
    parse(input) {
        const match = this.grammar.match(input);
        if (match.succeeded()) {
            return this.semantics(match).parse();
        }
        else {
            throw match.message;
        }
    }
}
exports.Parser = Parser;

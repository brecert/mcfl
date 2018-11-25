import * as AST from './ast'
import { last } from './util/last'

interface BlockInfo {
  type: string
  selector: string
}

interface ArgInfo {
  name: string
  type: string[]
  splat?: boolean
}

interface DefInfo {
  [index: string]: {
    type: string
    selector: string
    args: ArgInfo[]
    run: Function
  }
}

export class Translator {
  namespace: string
  path: string[]

  // blockType is the type of block you are in
  //
  // this should help when checking if a block is in
  // a definition or if it's anonymous
  blockInfo: BlockInfo[]
  defs: DefInfo
  safe: boolean
  io
  selectors

  constructor() {
    this.namespace = 'test'
    this.path = ['main']
    this.blockInfo = [{ type: 'main', selector: '@s' }]
    this.defs = {
      print: {
        type: '$stdlib',
        selector: '$none',
        args: [{ name: 'content', type: ['Raw'], splat: true }],
        run: (node, args) => {
          const message = args.content.map(arg => this.safeWalk(arg)).join(' ')
          this.add(`tellraw @s "${message}"`)
        },
      },

      del: {
        type: '$stdlib',
        selector: '$none',
        args: [{ name: 'objective', type: ['$any'] }],
        run: (node, args) => {
          this.add(`scoreboard objectives remove ${args.objective}`)
        },
      },
    }
    this.io = {}
    this.safe = true
    this.selectors = {}
  }

  // TODO: Make the not needed
  safeWalk(node) {
    this.safe = false
    let res = this.walk(node)
    this.safe = true
    return res
  }

  // Top level walk to other walks to make it easier
  // and more consistent when adding or modifying code
  //
  // The structure emulates method overloading
  walk(node) {
    console.log(`walking: [array: ${Array.isArray(node)}] ${node.astName}`)

    if (Array.isArray(node)) {
      return this.walkArray(node)
    } else if (typeof node === 'number') {
      return this.walkNumber(node)
    } else if (typeof node === 'string') {
      return this.walkString(node)
    } else {
      if (node.astName === undefined) {
        throw `Unknown node type ${node.astName} with data ${JSON.stringify(
          node
        )}`
      }

      if (`walk${node.astName}` in this) {
        return this[`walk${node.astName}`](node)
      } else {
        throw `No walk set for '${node.astName}'`
      }
    }
  }

  walkNumber(number) {
    return number
  }

  walkString(string) {
    return string
  }

  // Walks an array of AST Nodes
  walkArray(nodes: AST.ASTNode[]) {
    let result = []

    for (let node of nodes) {
      result.push(this.walk(node))
    }
    return result
  }

  walkDefaultAssignment(node: AST.DefaultAssignment) {
    if (typeof node.value === 'number') {
      this.assign(node.target, node.value)
    } else if (node.value.astName === 'Raw') {
      this.assign(node.target, node.value.value, 'operation')
    } else {
      throw `Unknown assignment with type ${typeof node.value}(astName: ${
        node.value.astName
      })`
    }
  }

  walkInitialAssignment(node: AST.InitialAssignment) {
    this.add(`scoreboard objectives add ${node.target}`)
    if (node.criteria != undefined) {
      this.add(` ${node.criteria}`, false)
    }
  }

  walkPrivateAssignment(node: AST.PrivateAssignment) {
    switch (node.target) {
      case 'namespace':
        this.updateNamespace(node.value)
        break
      default:
        throw `unknown private assignment ${node.target}`
        break
    }
  }

  walkDefinition(node: AST.Definition) {
    this.blockInfo.push({ type: 'def', selector: '$none' })
    this.selectors[node.name] = node.block.selector
    this.updatePath(node.name, () => {
      this.walk(node.block)
    })
    this.blockInfo.pop()
  }

  // TODO: Add better warning messages and logging
  walkCall(node: AST.Call) {
    if (node.name in this.defs) {
      let defined = this.defs[node.name]

      if (defined.type == '$stdlib' || defined.type == '$macro') {
        this.callLib(node)
      } else {
        this.callMethod(node.name, defined.selector, node.args)
      }
    } else {
      this.callMethod(node.name, this.selectors[node.name], node.args)
    }
  }

  // TODO: Remove large swaths of duplicate code and clean up
  callLib(node) {
    let def, args

    def = this.defs[node.name]
    args = {}

    for (let arg in def.args) {
      let defArg = def.args[arg]
      let nodeArg = node.args[arg]

      if (defArg.splat) {
        let splat = node.args.slice(arg)

        for (let splattedArg of splat) {
          if (defArg.type.includes(nodeArg.astName) || defArg.type === '$any') {
            if (!(defArg.name in args)) {
              args[defArg.name] = []
            }
            args[defArg.name].push(nodeArg)
          } else {
            throw `Method '${node.name}' accepts types \`${defArg.type.join(
              ' | '
            )}\` not '${nodeArg.astName}' for argument '${defArg.name}'`
          }
        }
      } else {
        if (defArg.type.includes(nodeArg.astName) || defArg.type == '$any') {
          if (!(defArg.name in args)) {
            args[defArg.name] = []
          }

          args[defArg.name].push(nodeArg)
        } else {
          throw `Method '${node.name}' accepts types \`${defArg.type.join(
            ' | '
          )}\` not '${nodeArg.astName}' for argument '${defArg.name}'`
        }
      }
    }

    def.run(node, args)
  }

  callMethod(name: string, selector?: string, args?: string[]) {
    if (args != undefined) {
      throw `Arguments are not yet supported when calling a non stdlib method '${name}(${args.join(
        ', '
      )})'\nPlease use 'run ${name}' instead.`
    }

    let exec = this.genExecute(name, selector)
    this.add(exec)
  }

  walkBlock(node: AST.Block) {
    if (last(this.blockInfo).type != 'def') {
      this.blockInfo.push({ type: 'block', selector: (node.selector) ? node.selector : '$none' })
      this.updateSelector(node.selector)
      this.walk(node.statement)
      this.blockInfo.pop()
    } else {
      this.blockInfo.push({ type: 'block', selector: (node.selector) ? node.selector : '$none' })
      this.walk(node.statement)      
      this.blockInfo.pop()
    }
  }

  walkRaw(node: AST.Raw) {
    this.add(node.value)
    return node.value
  }

  // Adds text to the "io"
  //
  // This handles most if not all of the work
  // involving paths and namespacing for the exporter
  add<T>(value: T, newline: boolean = true) {
    if (!this.safe) {
      return value
    }

    let path = last(this.path)

    if (!(this.namespace in this.io)) {
      this.io[this.namespace] = []
    }

    if (!(path in this.io[this.namespace])) {
      this.io[this.namespace][path] = []
    }

    let result
    result = value

    if (newline === false) {
      result = [this.io[this.namespace][path].pop(), value].join('')
    }

    this.io[this.namespace][path].push(result)
  }

  genPath(value: string = last(this.path)) {
    return `${this.namespace}:${value}`
  }

  genExecute(path: string = last(this.path), selector?) {
    let as

    if (
      selector != undefined &&
      selector != '$inherit' &&
      selector != '$none'
    ) {
      as = `as ${selector} `
    } else if (selector == '$none') {
      as = ''
    }

    if (as === undefined) {
      return `function ${this.genPath(path)}`
    } else {
      return `execute ${as}run function ${this.genPath(path)}`
    }
  }

  updateWorkingFile(
    path: string = last(this.path),
    selector = this.currentSelector()
  ) {
    let exec = this.genExecute(path, selector)

    switch (last(this.blockInfo).type) {
      case 'def':
        break
      default:
        this.add(exec)
        break
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

  assign(target, value, type?, operation = '=', sourceSelector = '@s') {
    if (type === 'operation') {
      this.add(
        `scoreboard players operation @s ${target} ${operation} ${sourceSelector} ${value}`
      )
    } else {
      this.add(`scoreboard players set @s ${target} ${value}`)
    }
  }

  addBlock(name: string, selector = '$none') {
    this.blockInfo.push({ type: name, selector: selector })
  }

  // Updates the currently used selector
  //
  // formats correctly for future use
  updateSelector(raw_selector: string | undefined) {
    let selector

    if (raw_selector == undefined) {
      selector = '$none'
    } else {
      selector = raw_selector
    }

    last(this.blockInfo).selector = selector
    selector = selector.replace(/[^0-9\-a-z\_]/g, '')

    if (selector in this.io) {
      let i

      while (selector in this.io) {
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

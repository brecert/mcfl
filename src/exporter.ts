export class Exporter {
  dataTree
  io: string[]

  constructor(dataTree) {
    this.dataTree = dataTree
    this.io = []
  }

  consoleExport(namespaces = this.dataTree) {
    for(let namespace in namespaces) {
      for(let path in namespaces[namespace]) {
        this.add(`\n# ${namespace}:${path}`)
        let commands = namespaces[namespace][path]
        this.add(commands.join('\n'))
      }
    }
  }

  private add(value: string) {
    this.io.push(value)
  }
}


import fs from 'fs-extra'
import { join } from 'path'

interface IPackData {
  description: string
  pack_format: number
}

interface IPack {
	pack: IPackData
}

export class Exporter {
  dataTree
  io: string[]
  format: number
  pack: IPack

  constructor(dataTree) {
    this.dataTree = dataTree
    this.io = []
    this.format = 4
    this.pack = {
    	pack: {
	      description: 'generated with mcfl',
	      pack_format: this.format,
    	}
    }
  }

  exportFiles(out, namespaces = this.dataTree) {
    this.io = []

    fs.ensureDir(out).catch(console.error)
    fs.writeFile(join(out, 'pack.mcmeta'), JSON.stringify(this.pack)).catch(
      console.error
    )

    for (let namespace in namespaces) {
      const namespacePath = join(out, 'data', namespace, 'functions')
      for (let file in namespaces[namespace]) {
        const filePath = join(namespacePath, `${file}.mcfunction`)

        switch (file) {
          case 'main':
            this.createTag(out, namespace, 'main', 'tick')
            break
          case 'setup':
            this.createTag(out, namespace, 'setup', 'load')
            break
          default:
            break
        }

        const commands = namespaces[namespace][file]
        fs.ensureFile(filePath)
          .then(() => {
            fs.writeFile(filePath, commands.join('\n')).catch(console.error)
          })
          .catch(console.error)
      }
    }
  }

  consoleExport(namespaces = this.dataTree) {
    this.io = []

    for (let namespace in namespaces) {
      for (let path in namespaces[namespace]) {
        this.add(`\n# ${namespace}:${path}`)
        let commands = namespaces[namespace][path]
        this.add(commands.join('\n'))
      }
    }
  }

  private createTag(
    path: string,
    namespace: string,
    name: string,
    tagType: string
  ) {
    const tag = {
      replace: false,
      values: [`${namespace}:${name}`],
    }

    const tagFile = join(
      path,
      'data',
      'minecraft',
      'tags',
      'functions',
      `${tagType}.json`
    )

    fs.ensureFile(tagFile)
      .then(() => {
        fs.writeFile(tagFile, JSON.stringify(tag)).catch(console.error)
      })
      .catch(console.error)
  }

  private add(value: string) {
    this.io.push(value)
  }
}

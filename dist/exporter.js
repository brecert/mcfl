"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
class Exporter {
    constructor(dataTree) {
        this.dataTree = dataTree;
        this.io = [];
        this.format = 4;
        this.pack = {
            pack: {
                description: 'generated with mcfl',
                pack_format: this.format,
            }
        };
    }
    exportFiles(out, namespaces = this.dataTree) {
        fs_extra_1.default.ensureDir(out).catch(console.error);
        fs_extra_1.default.writeFile(path_1.join(out, 'pack.mcmeta'), JSON.stringify(this.pack)).catch(console.error);
        for (let namespace in namespaces) {
            this.io = [];
            const namespacePath = path_1.join(out, 'data', namespace);
            for (let file in namespaces[namespace]) {
                const filePath = path_1.join(namespacePath, `${file}.mcfunction`);
                const commands = namespaces[namespace][file];
                switch (file) {
                    case 'main':
                        this.createTag(out, namespace, 'main', 'tick');
                        break;
                    case 'setup':
                        this.createTag(out, namespace, 'setup', 'load');
                        break;
                    default:
                        break;
                }
                this.add(commands.join('\n'));
                fs_extra_1.default.ensureFile(filePath)
                    .then(() => {
                    fs_extra_1.default.writeFile(filePath, this.io.join('\n')).catch(console.error);
                })
                    .catch(console.error);
            }
        }
    }
    consoleExport(namespaces = this.dataTree) {
        for (let namespace in namespaces) {
            for (let path in namespaces[namespace]) {
                this.add(`\n# ${namespace}:${path}`);
                let commands = namespaces[namespace][path];
                this.add(commands.join('\n'));
            }
        }
    }
    createTag(path, namespace, name, tagType) {
        const tag = {
            replace: false,
            values: [`${namespace}:${name}`],
        };
        const tagFile = path_1.join(path, 'data', 'minecraft', 'tags', 'functions', `${tagType}.json`);
        fs_extra_1.default.ensureFile(tagFile)
            .then(() => {
            fs_extra_1.default.writeFile(tagFile, JSON.stringify(tag)).catch(console.error);
        })
            .catch(console.error);
    }
    add(value) {
        this.io.push(value);
    }
}
exports.Exporter = Exporter;

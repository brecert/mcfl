#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')
const mcfl = require('./index')

require('yargs')
  .usage('$0 <cmd> [args]')
  .options({
    'debug': {
      alias: 'd',
      describe: 'debug?',
      type: 'boolean'
    }
  })
  .command({
  	command: ['transpile <file> <out>'],
  	aliases: ['t'],
  	desc: 'transpile an mcfl file to a datapack',
  	builder: (yargs) => {
	    yargs.positional('file', {
	      describe: 'the file to transpile',
	      type: 'string'
    	}),
      yargs.positional('out', {
        describe: 'the output folder',
        type: 'string'
      })
  	},
  	check: (yargs) => {
			fs.existsSync(yargs.file)
  	},
  	handler: (yargs) => {
  		console.info(`transpiling ${yargs.file}`);
  		let exporter = mcfl.transpileString(fs.readFileSync(yargs.file, 'utf8'), yargs.debug)
  		exporter.exportFiles(yargs.out)
  	}
  })
  .command({
    command: ['test <file>'],
    desc: 'test the compilation',
    builder: (yargs) => {
      yargs.positional('file', {
        describe: 'the file to transpile',
        type: 'string'
      })
    },
    check: (yargs) => {
      fs.existsSync(yargs.file)
    },
    handler: (yargs) => {
      console.info(`transpiling ${yargs.file}`);
      let exporter = mcfl.transpileString(fs.readFileSync(yargs.file, 'utf8'), yargs.debug)
      exporter.consoleExport()
      let message = "TestedOutput"
      let padding = (process.stdout.columns + message.length) / 2
      console.log(process.stdout.columns, padding)
      message = message.padStart(padding, '-')
      message = message.padEnd(process.stdout.columns, '-')
      console.log(message)
      console.log(exporter.io.join("\n"))
    }
  })
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .argv
#!/usr/bin/env node

const program = require('commander')
const updateNotifier = require('update-notifier')
const pkg = require('./package.json')
 
updateNotifier({pkg}).notify()

// .version(require('./package').version, '-v --version')

program
  .version(require('./package').version)
  .usage('<Command>')

program
  .command('init [name]')
  .description('init program')
  .action((name = false) => require('./src/init')(name))

program
  .command('page <name>')
  .description('add page')
  .action(name => require('./src/page-and-mod')(name, 'page'))

program
  .command('mod <name>')
  .description('add page')
  .action(name => require('./src/page-and-mod')(name, 'component'))

program
  .command('rename <type> <newName> <oldName>')
  .description('rename page/mod')
  .action((type, newName, oldName) => require('./src/rename')(type, newName, oldName))

program.parse(process.argv)

const argvLen = process.argv.slice(2).length

if (!argvLen || argvLen === 1 && typeof program.args[0] === 'string') program.help()

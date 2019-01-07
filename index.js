#!/usr/bin/env node

const program = require('commander')
const path = require('path')

program
  .command('init [name]')
  .description('init program')
  .action((name = false) => require('./src/init')(name))

program
  .command('page <name>')
  .description('add page')
  .action(name => require('./src/page')(name))

program.parse(process.argv)

const argvLen = process.argv.slice(2).length

if (!argvLen || argvLen === 1 && typeof program.args[0] === 'string') program.help()

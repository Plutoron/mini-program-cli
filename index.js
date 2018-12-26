#!/usr/bin/env node

const program = require('commander');
const path = require('path');

program
  .command('init')
  .description('init program')
  .action(function() {
    console.log('init');
  })

program
  .command('page')
  .description('add page')
  .action(function() {

    console.log('page');
  })


program.parse(process.argv)

const argvLen = process.argv.slice(2).length;

if (!argvLen || argvLen === 1 && typeof program.args[0] === 'string') program.help()

#!/usr/bin/env node

const program = require('commander')

program
  .version(require('../package').version)
  .usage('<command> [options]')
  .command('init', 'generate webpack configuration file(s)')
 
program.parse(process.argv)

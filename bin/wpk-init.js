#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const path = require('path')
const slash = require('slash')
const pkgDir = require('pkg-dir')
const makeDir = require('make-dir')
const chalk = require('chalk')
const bigInt = require('big-integer')
const cryptoRandomString = require('crypto-random-string')

program
  .option('-V3, --v3', 'init webpack.config.js for webpack 3.x')
  .option('-V4, --v4', 'init webpack.config.js for webpack 4.x')
  .option('-N, --num [value]', 'init webpack.config.js * num (default 1)')
  .option('-D, --dir [value]', 'init configuration file(s) in dir|path (default pkg root)')

program.on('--help', function() {
  console.log('')
  console.log('  Examples:    wpk init -D webpack')
  console.log('')
  console.log('')
})

program.parse(process.argv)

const { v3, v4, num = 1, dir } = program

function checkOptions () {
  !(v3 || v4) && program.help()
}

function msgCallback (err) {
	if (err) {
		console.log(chalk.red('Files generation failed!'))
		console.log(chalk.red(err))
		process.exitCode = 1
	} else {
    console.log(chalk.green('Files generation success!'))
	}
}

checkOptions()
const pkgRoot = pkgDir.sync(process.cwd())
let outPath = dir ? path.join(pkgRoot, dir) : pkgRoot

const version = v4 ? 'v4' : 'v3'
const filePath = slash(path.resolve(__dirname, `../lib/webpack.config.${version}.js`))
const normalConfig = fs.readFileSync(filePath, 'utf8').replace(/\r\n/gm, '\n')

if (!fs.existsSync(outPath)) {
  outPath = makeDir.sync(outPath)
}

const pathPromises = []
let intNum = bigInt(num).gt(0) ? bigInt(num) : 1
while (intNum > 0) {
  pathPromises.push(
    slash(outPath.concat(`/webpack.config.${version}.${cryptoRandomString(8)}.js`))
  )
  intNum--
}

console.log(chalk.blue('Files are being generated... '))
pathPromises.forEach(dest => {
  fs.writeFile(dest, normalConfig, 'utf8', msgCallback)
})

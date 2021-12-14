/**
 * script to build (transpile) files.
 * By default it transpiles all files for all packages and writes them
 * into `lib/` directory.
 * Non-js or files matching IGNORE_PATTERN will be copied without transpiling.
 *
 * Example:
 *  compile all packages: node ./scripts/compile.js
 *  watch compile some packages: node ./scripts/compile.js --watch --packages react,react-cli
 */
'use strict';

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const chalk = require('chalk');
const parseArgs = require('minimist');

const args = parseArgs(process.argv);
const customPackage = args.package || 'examples';
const runInDebug = args.debug === undefined ? true : args.debug;
const demo = args.demo;
const packagesName = 'packages';
const packagesDir = path.resolve(__dirname, `../${packagesName}`);

function startPackage(packagesDir, filePath) {
  var filename = filePath.split(packagesDir + '/')[1];

  process.stdout.write(chalk.bold.inverse(`Starting package "${filename}"\n`));

  if (fs.statSync(filePath).isDirectory()) {
    // start package
    shell.cd(path.join(filePath));

    if (customPackage === 'playground' && demo) {
      shell.exec('rm ./demo/index.js')
      shell.exec(`ln ./demos/${demo}/index.js ./demo/index.js`)
    }

    shell.exec(
      runInDebug
        ? 'export DEBUG=true && build-scripts start'
        : 'build-scripts start',
    );
  }
}

function getPackage(packagesDir, customPackage) {
  return fs
    .readdirSync(packagesDir)
    .map(file => path.resolve(packagesDir, file))
    .filter(f => {
      const packageName = path.relative(packagesDir, f).split(path.sep)[0];
      return customPackage === packageName;
    })
    .filter(f => fs.lstatSync(path.resolve(f)).isDirectory())[0];
}

const filePath = getPackage(packagesDir, customPackage);
if (filePath) {
  startPackage(packagesDir, filePath);
} else {
  process.stdout.write(
    chalk.bold.inverse(`package ${customPackage} not exists\n`),
  );
}
process.stdout.write('\n');

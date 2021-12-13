/**
 * script to build (transpile) files.
 * By default it transpiles all files for all packages and writes them
 * into `lib/` directory.
 * Non-js or files matching IGNORE_PATTERN will be copied without transpiling.
 *
 * Example:
 *  compile all packages: node ./scripts/compile.js
 *  watch compile some packages: node ./scripts/compile.js --watch --packages rax,rax-cli
 */
'use strict';

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const chalk = require('chalk');
const parseArgs = require('minimist');

function buildPackage(packagesDir, filePath) {
  var filename = filePath.split(packagesDir + '/')[1];

  process.stdout.write(chalk.bold.inverse(`Build package "${filename}"\n`));

  if (fs.statSync(filePath).isDirectory()) {
    if (process.argv[2] && process.argv[2] == filename) {
      // build one package
      shell.cd(path.join(filePath));
      shell.exec('npm run build');
      shell.cd('../');
    } else {
      // build all package
      shell.cd(path.join(filePath));
      shell.exec('npm run build');
      shell.cd('../');
    }
  }
}

function getPackages(packagesDir, customPackage) {
  return fs
    .readdirSync(packagesDir)
    .map(file => path.resolve(packagesDir, file))
    .filter(f => {
      if (
        customPackage &&
        customPackage.length > 0 &&
        customPackage[0] !== '*'
      ) {
        const packageName = path.relative(packagesDir, f);
        return customPackage[0] === packageName;
      } else if (customPackage[0] === '*') {
        return true;
      } else {
        return false;
      }
    })
    .filter(f => fs.lstatSync(path.resolve(f)).isDirectory());
}

const args = parseArgs(process.argv);
const customPackage = args.packages ? args.packages.split(',') : [];
const packagesName = 'packages';
const packagesDir = path.resolve(__dirname, `../${packagesName}`);
const packages = getPackages(packagesDir, customPackage);

if (packages.length > 0) {
  process.stdout.write(
    chalk.bold.inverse(`Compiling packages ${customPackage.join(', ')}\n`),
  );
  packages.forEach(buildPackage.bind(null, packagesDir));
} else {
  process.stdout.write(chalk.bold.inverse('No packages to complie\n'));
}

process.stdout.write('\n');

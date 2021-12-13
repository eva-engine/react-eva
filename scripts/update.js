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
const chalk = require('chalk');

const rootPackage = require(path.resolve(__dirname, '../package.json'));
const packageVersion = rootPackage.version;
const packagesName = 'packages';
const packagesDir = path.resolve(__dirname, `../${packagesName}`);
const updating = {...rootPackage.dependencies};

function updateDeps(deps) {
  if (!deps) return;

  for (const name in deps) {
    const version = updating[name];
    if (version) {
      deps[name] = version;
    }
  }
}

function updateDependencies(basename) {
  const filePath = path.resolve(packagesDir, basename);
  const packagePath = path.resolve(filePath, 'package.json');

  process.stdout.write(chalk.bold.inverse(`Update dependencies of "${basename}" \n`));

  if (fs.statSync(packagePath).isFile()) {
    const packageJson = require(packagePath);

    updateDeps(packageJson.dependencies);
    updateDeps(packageJson.devDependencies);
    updateDeps(packageJson.peerDependencies);

    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, '  ') + '\n');
  }
}

function updatePackageVersion(basename) {
  const filePath = path.resolve(packagesDir, basename);
  const packagePath = path.resolve(filePath, 'package.json');

  process.stdout.write(chalk.bold.inverse(`Update package "${basename}" to ${packageVersion} \n`));

  if (fs.statSync(packagePath).isFile()) {
    const packageJson = require(packagePath);
    packageJson.version = packageVersion;
    updating[packageJson.name] = `^${packageVersion}`;
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, '  ') + '\n');
  }

  return basename;
}

function getPackages(packagesDir) {
  return fs
    .readdirSync(packagesDir)
    .filter(f => fs.lstatSync(path.resolve(packagesDir, f)).isDirectory())
}

process.stdout.write(
  chalk.bold.inverse(`Updating packages\n`),
);

getPackages(packagesDir).map(updatePackageVersion).forEach(updateDependencies);

process.stdout.write('\n');

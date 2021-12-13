/**
 * Scripts to check unpublished version and run publish
 */
const {existsSync, readdirSync, readFileSync} = require('fs');
const {join, resolve, basename} = require('path');
const {spawnSync} = require('child_process');
const axios = require('axios');
const semver = require('semver');
const parseArgs = require('minimist');

const lernaConfig = require(resolve(__dirname, '..', 'lerna.json'));

const {registry, npmClient} = lernaConfig.publish;

const args = parseArgs(process.argv);
const customPackage = args.packages ? args.packages.split(',') : [];
const tag = args.tag || false;

function checkVersion(folder) {
  const ret = []; // { name: 'foo', workDir, version: 'x.x.x' }
  if (existsSync(folder)) {
    const packages = readdirSync(folder).filter((packageFolderName) => {
      if (customPackage[0] === '*' && !packageFolderName.startsWith('.')) {
        return true;
      } else if (customPackage.indexOf(basename(packageFolderName)) > -1) {
        return true;
      }
      return false;
    });

    console.log('[ADD DIST TAG] Start check with following packages:');

    for (let i = 0; i < packages.length; i++) {
      const packageFolderName = packages[i];
      const packageInfoPath = join(folder, packageFolderName, 'package.json');
      if (existsSync(packageInfoPath)) {
        console.log(`- ${packageFolderName}: true`);
        const packageInfo = JSON.parse(readFileSync(packageInfoPath));
        if (packageInfo.private !== true) {
          ret.push({
            name: packageInfo.name,
            version: packageInfo.version,
            workDir: join(folder, packageFolderName),
          });
        } else {
          console.log(`- ${packageFolderName}: false`);
        }
      }
    }
  }

  return ret;
}

function addDistTag(pkg, version, workDir, tag) {
  console.log('[ADD DIST TAG]', `${pkg}@${version} ${tag}`);
  // npm dist tag
  spawnSync(npmClient, ['dist-tag', 'add', `${pkg}@${version}`, tag, `--regsitry=${registry}`], {
    stdio: 'inherit',
    cwd: workDir,
  });
}

if (tag) {
  const ret = checkVersion(join(__dirname, '../packages'));

  if (ret.length === 0) {
    console.log('[ADD DIST TAG] No packages.');
  } else {
    console.log('[ADD DIST TAG] Will add tag to following packages:');
  }

  for (let i = 0; i < ret.length; i++) {
    const {name, version, workDir} = ret[i];
    addDistTag(name, version, workDir, tag);
  }
} else {
  console.log('[ADD DIST TAG] No tag specified.');
}



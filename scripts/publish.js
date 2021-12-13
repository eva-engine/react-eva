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

function checkVersion(folder, callback) {
  const ret = []; // { name: 'foo', workDir, latest: 'x.x.x', local: 'x.x.x', shouldBuild }
  if (existsSync(folder)) {
    const packages = readdirSync(folder).filter((packageFolderName) => {
      if (customPackage[0] === '*' && !packageFolderName.startsWith('.')) {
        return true;
      } else if (customPackage.indexOf(basename(packageFolderName)) > -1) {
        return true;
      }
      return false;
    });
    console.log('[PUBLISH] Start check with following packages:');

    let finishCount = 0;
    function finish() {
      finishCount++;
      if (finishCount === packages.length) {
        callback(ret);
      }
    }

    for (let i = 0; i < packages.length; i++) {
      const packageFolderName = packages[i];
      const packageInfoPath = join(folder, packageFolderName, 'package.json');
      if (existsSync(packageInfoPath)) {
        const packageInfo = JSON.parse(readFileSync(packageInfoPath));
        if (packageInfo.private !== true) {
          checkVersionExists(packageInfo.name, packageInfo.version).then(
            exists => {
              console.log(`- ${packageFolderName}: ${!exists}`)
              if (!exists) {
                ret.push({
                  name: packageInfo.name,
                  workDir: join(folder, packageFolderName),
                  local: packageInfo.version,
                  shouldBuild: false,
                  // If exists scripts.build, then run it.
                  // shouldBuild: !!(
                  //   packageInfo.scripts && packageInfo.scripts.build
                  // ),
                });
              }
              finish();
            },
          );
        } else {
          finish();
        }
      }
    }
  } else {
    callback(ret);
  }
}

function checkVersionExists(pkg, version) {
  return axios(
    `${registry}/${encodeURIComponent(pkg)}/${encodeURIComponent(version)}`,
    {timeout: 2000},
  )
    .then(res => res.status === 200)
    .catch(err => false);
}

function publish(pkg, workDir, version, shouldBuild, tag) {
  console.log('[PUBLISH]', `${pkg}@${version}`);

  if (shouldBuild) {
    // npm install
    spawnSync(npmClient, ['install'], {
      stdio: 'inherit',
      cwd: workDir,
    });

    // npm run build
    spawnSync(npmClient, ['run', 'build'], {
      stdio: 'inherit',
      cwd: workDir,
    });
  }

  // npm publish
  spawnSync(npmClient, ['publish', '--tag=' + tag, '--regsitry=' + registry], {
    stdio: 'inherit',
    cwd: workDir,
  });
}

function getPrerelease(v) {
  const semVer = semver.parse(v);
  if (semVer === null) return false;
  return semVer.prerelease;
}

checkVersion(join(__dirname, '../packages'), ret => {
  if (ret.length === 0) {
    console.log('[PUBLISH] No diff with all packages.');
  } else {
    console.log('[PUBLISH] Will publish following packages:');
  }

  for (let i = 0; i < ret.length; i++) {
    const {name, workDir, local, shouldBuild} = ret[i];
    const [tag = 'latest'] = args.tag ? [args.tag] : getPrerelease(local);
    console.log(`--- ${name}@${local} current tag: ${tag} ---`);
    publish(name, workDir, local, shouldBuild, tag);
  }
});


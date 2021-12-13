import * as Babel from '@babel/standalone';
import getBabelConfig from '../libs/rax-babel-config';

const babelConfig = getBabelConfig({});

const importRegExp = /^import (?:\s*([^{}]+?),?\s*)?(?:\s*{([^{}]+?)}\s*)? from \s*['"]([^'"]+?)['"]\s*;?$/gm;
const importRegExp2 = new RegExp(importRegExp.source);
const importRegExp3 = /^import\s+['"]([^'"]+?)['"]\s*;?$/gm

export default function transform(code) {
  code = code.replace(importRegExp, (str) => {
    let result = '';
    const match = str.match(importRegExp2);
    if (match) {
      let name = match[3];
      if (name.indexOf('@eva/eva.js') === 0) {
        name = 'window.EVA';
      } else if (name.indexOf('@eva/plugin') === 0) {
        name = name.split('-').slice(1);
        if (name.length === 3) {
          name = name[0] + '.' + name[1] + name[2][0].toUpperCase() + name[2].substr(1);
        } else {
          name = name.join('.');
        }
        name = `window.EVA.plugin.${name}`;
      } else {
        name = `window['${name}']`;
      }
      const defaultVars = match[1] ? `default: ${match[1]}, ` : '';
      const exportVars = match[2] ? match[2].replace(/as\s+([^,{}]+)/g, ': $1') : '';
      result = `const {${defaultVars}${exportVars}} = ${name}`;
    }

    // console.debug(match, result);
    return result;
  });

  code = code.replace(importRegExp3, '');
  // console.debug(code);
  code = Babel.transform(code, babelConfig).code;

  return `
(function() {
  ${code}
})();
`
}

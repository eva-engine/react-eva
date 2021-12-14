const chalk = require('chalk');

const defaultOptions = {
  jsxPlus: !process.env.DISABLE_JSX_PLUS,
  styleSheet: false,
  modules: false,
};

let logOnce = true;

module.exports = (userOptions = {}) => {
  const options = Object.assign({}, defaultOptions, userOptions);
  const {
    styleSheet,
    jsxPlus = true,
    jsxToHtml,
    disableRegenerator = false,
    // preset-env modules options
    modules,
  } = options;

  const baseConfig = {
    presets: [
      require('@babel/preset-flow'),
      [
        require('@babel/preset-env'),
        {
          loose: true,
          "targets": {
            "chrome": "58",
          },
          modules,
          include: [
            'transform-computed-properties',
          ],
          exclude: disableRegenerator ? ['transform-regenerator'] : [],
        },
      ],
      [
        require('@babel/preset-react'), {
          pragma: 'createElement',
          pragmaFrag: 'Fragment',
          throwIfNamespace: false,
        },
      ],
    ],
    plugins: [
      require('@babel/plugin-syntax-dynamic-import'),
      // Stage 0
      require('@babel/plugin-proposal-function-bind'),
      // Stage 1
      require('@babel/plugin-proposal-export-default-from'),
      [
        require('@babel/plugin-proposal-optional-chaining'),
        { loose: true },
      ],
      [
        require('@babel/plugin-proposal-nullish-coalescing-operator'),
        { loose: true },
      ],
      // Stage 2
      [require('@babel/plugin-proposal-decorators'), { legacy: true }],
      require('@babel/plugin-proposal-export-namespace-from'),
      // Stage 3
      [
        require('@babel/plugin-proposal-class-properties'),
        { loose: true },
      ],
      require('babel-plugin-minify-dead-code-elimination-while-loop-fixed'),
    ],
  };

  const configArr = [baseConfig];

  if (jsxToHtml) {
    // Must transform before other jsx transformer
    baseConfig.plugins.push(
      require('babel-plugin-transform-jsx-to-html'),
    );
  }

  // Enable jsx plus default.
  if (jsxPlus) {
    baseConfig.plugins.push(
      require('babel-plugin-transform-jsx-list'),
      require('babel-plugin-transform-jsx-condition'),
      require('babel-plugin-transform-jsx-memo'),
      require('babel-plugin-transform-jsx-slot'),
      [require('babel-plugin-transform-jsx-fragment'), { moduleName: 'react' }],
      require('babel-plugin-transform-jsx-class'),
    );

    if (logOnce) {
      console.log(chalk.green('JSX+ enabled, documentation: https://react.js.org/docs/guide/jsxplus'));
      logOnce = false;
    }
  }

  if (styleSheet) {
    baseConfig.plugins.push(
      [require('babel-plugin-transform-jsx-stylesheet'), { retainClassName: true }],
    );
  }

  return baseConfig;
};

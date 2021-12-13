const path = require('path');

module.exports = {
  entry: {
    'rax-eva': './src/rax-eva.js',
  },
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'static'),
  },
  resolve: {
    mainFields: ['esmodule']
  },
  externals: {
    react: 'react',
    'pixi.js': 'window.PIXI',
    '@eva/eva.js': 'window.EVA',
    '@eva/plugin-renderer': 'window.EVA.plugin.renderer',
    '@eva/plugin-renderer-img': 'window.EVA.plugin.renderer.img',
    '@eva/plugin-renderer-text': 'window.EVA.plugin.renderer.text',
    '@eva/plugin-renderer-dragonbone': 'window.EVA.plugin.renderer.dragonbone',
    '@eva/plugin-renderer-spine': 'window.EVA.plugin.renderer.spine',
    '@eva/plugin-renderer-sprite': 'window.EVA.plugin.renderer.sprite',
    '@eva/plugin-renderer-sprite-animation': 'window.EVA.plugin.renderer.spriteAnimation',
    '@eva/plugin-renderer-tiling-sprite': 'window.EVA.plugin.renderer.tilingSprite',
    '@eva/plugin-renderer-render': 'window.EVA.plugin.renderer.render',
    '@eva/plugin-renderer-graphics': 'window.EVA.plugin.renderer.graphics',
    '@eva/plugin-renderer-event': 'window.EVA.plugin.renderer.event',
    '@eva/plugin-renderer-mask': 'window.EVA.plugin.renderer.mask',
    '@eva/plugin-renderer-lottie': 'window.EVA.plugin.renderer.lottie',
    '@eva/plugin-transition': 'window.EVA.plugin.transition',
    '@eva/plugin-a11y': 'window.EVA.plugin.a11y',
  },
};

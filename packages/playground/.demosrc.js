var pkg = require('./package.json');
var evaPkg = require('../../package.json');
var evaCdn = 'https://unpkg.com/@eva/'

function getEVAUrl(name, file) {
  const version = evaPkg.dependencies['@eva/' + name].replace(/^[\^~=><]/, '');

  return evaCdn + `${name}@${version}` + '/dist/' + file;
}

module.exports = {
  devServer: {
    port: 3000, //配置开发服务器的端口号，默认值3000
  },
  output: {
    dir: 'public', // 配置构建部署时输出的目录，默认dist目录
    html: {
      title: 'Rax EVA Playground',
    },
  },
  staticFolder: 'static',
  demoList: '.demoList.json', // demoList配置文件的文件名，默认为.demoList.json
  name: 'Rax EVA Playground', // 配置Playground的标题
  version: `v${pkg.version}`,
  homePage: 'https://eva.js.org/rax-eva-playground', // 配置Playground链接跳转的主页
  boxTheme: 'monokai', // 配置代码编辑器的主题
  // 可选主题: active4d, allHallowsEve, amy, blackboard, brillianceBlack,
  // brillianceDull, chromeDevtools, cloudsMidnight, clouds, cobalt,
  // dawn, dreamweaver, eiffel, espressoLibre, github, idle, katzenmilch,
  // kuroirTheme, lazy, magicwbAmiga, merbivoreSoft, merbivore, monokai,
  // pastelsOnDark, slushAndPoppies, solarizedDark, solarizedLight,
  // spacecadet, sunburst, textmateMacClassic, tomorrowNightBlue,
  // tomorrowNightBright, tomorrowNightEighties, tomorrowNight, tomorrow,
  // twilight, vibrantInk, zenburnesque, iplastic, idlefingers, krtheme,
  // monoindustrial,
  globalPackages: {
    // 配置需要加载的 JS、CSS 库
    js: [
      '//unpkg.com/pixi.js@4.8.9/dist/pixi.min.js',
      getEVAUrl('eva.js', 'EVA.min.js'),
      getEVAUrl('renderer-adapter', 'EVA.rendererAdapter.min.js'),
      getEVAUrl('plugin-renderer', 'EVA.plugin.renderer.min.js'),
      getEVAUrl('plugin-renderer-img', 'EVA.plugin.renderer.img.min.js'),
      getEVAUrl('plugin-renderer-dragonbone', 'EVA.plugin.renderer.dragonbone.min.js'),
      getEVAUrl('plugin-renderer-spine', 'EVA.plugin.renderer.spine.min.js'),
      getEVAUrl('plugin-renderer-sprite', 'EVA.plugin.renderer.sprite.min.js'),
      getEVAUrl('plugin-renderer-sprite-animation', 'EVA.plugin.renderer.spriteAnimation.min.js'),
      getEVAUrl('plugin-renderer-tiling-sprite', 'EVA.plugin.renderer.tilingSprite.min.js'),
      getEVAUrl('plugin-renderer-render', 'EVA.plugin.renderer.render.min.js'),
      getEVAUrl('plugin-renderer-text', 'EVA.plugin.renderer.text.min.js'),
      getEVAUrl('plugin-renderer-nine-patch', 'EVA.plugin.renderer.ninePatch.min.js'),
      getEVAUrl('plugin-renderer-graphics', 'EVA.plugin.renderer.graphics.min.js'),
      getEVAUrl('plugin-renderer-event', 'EVA.plugin.renderer.event.min.js'),
      getEVAUrl('plugin-renderer-mask', 'EVA.plugin.renderer.mask.min.js'),
      getEVAUrl('plugin-renderer-lottie', 'EVA.plugin.renderer.lottie.min.js'),
      getEVAUrl('plugin-transition', 'EVA.plugin.transition.min.js'),
      getEVAUrl('plugin-a11y', 'EVA.plugin.a11y.min.js'),
      './rax.js',
      './rax-eva.js'
    ],
    css: [],
  },
  // tab waterfall
  editorViewMode: 'tab', // 配置代码块的UI展示方式，现在支持tab和waterfall两种展示方式
};

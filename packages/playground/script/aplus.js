const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const publicDir = path.join(__dirname, '..', 'public');

let htmlContent = fs.readFileSync(path.resolve(publicDir, 'index.html'));
const $ = cheerio.load(htmlContent);

$('head').append('<meta name="data-spm" content="a21714" />');
$('body')
  .attr('data-spm', 'playground')
  .prepend('<script src="//g.alicdn.com/tb/tracker/index.js"></script>')
  .prepend(
    `<script>
var g_config = window.g_config || {};
g_config.jstracker2 = g_config.jstracker2 || {};

g_config.jstracker2.sampling = 1; // 配置采样率，默认是 1%
g_config.jstracker2.p_sampling = 1; // 配置性能采样率，默认是 10%
</script>`,
  );

htmlContent = $.html();
fs.writeFileSync(path.resolve(publicDir, 'index.html'), htmlContent);

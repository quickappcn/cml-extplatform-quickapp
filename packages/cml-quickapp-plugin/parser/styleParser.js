const postcss = require('postcss');
const cpx = require('chameleon-css-loader/postcss/cpx.js')
const weexPlus = require('chameleon-css-loader/postcss/weex-plus.js')
const fs = require('fs');
const path = require('path');
let css = '';
module.exports = function (source) {
  let isQuickappInjectBaseStyle = cml.config.get().baseStyle.quickapp;
  let options = {
    cpxType: 'px'
  }
  if (isQuickappInjectBaseStyle) {
    let quickAppBaseStylePath = path.resolve(__dirname, '../style/index.css')
    if (!css) {
      css = fs.readFileSync(quickAppBaseStylePath, "utf8")
    }
    source = css + source
    return postcss([cpx(options), weexPlus()]).process(source).css;
  }
  return postcss([cpx(options), weexPlus()]).process(source).css;
}
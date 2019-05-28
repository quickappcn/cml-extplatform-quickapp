const postcss = require('postcss');
const weex = require('chameleon-css-loader/postcss/weex.js')

module.exports = function(source) {
  return weex(source);
}
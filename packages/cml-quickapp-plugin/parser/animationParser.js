const { types: t } = require('mvvm-template-parser');

module.exports = function(context) {
  let { attr } = context;
  if (t.isJSXIdentifier(attr.name) && attr.name.name === 'c-animation') {
    // 快应用无animation属性，需要转换进style
    // Todo
    attr.name.name = 'animation';
  }
}
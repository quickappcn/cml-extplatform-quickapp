const utils = require('../util.js')

module.exports = function (context) {
  let {
    attr
  } = context;
  if (attr.name && attr.name.name === 'style') { //只有是style属性的时候才处理
    let styleNode = attr;
    if (styleNode && styleNode.value && utils.isMustacheReactive(styleNode.value.value)) { // 动态的style  cpx转化成px
      styleNode.value && (styleNode.value.value = utils.transformWxDynamicStyleCpxToPx(styleNode.value.value));
    } else { // 静态的style
      styleNode.value && (styleNode.value.value = utils.transformNotInMustacheCpxToPx(styleNode.value.value));
    }

  }

}
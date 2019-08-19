const { isDivComp, isBlockCom } = require('../util')

module.exports = function(context) {
    let { tagName, node } = context;
    let newtagName = ''
    // origin-tag原生组件替换
    if(/^origin\-/.test(tagName)) {
      newtagName = tagName.replace(/^origin\-/,'');
    }
    // 部分组件替换
    if(isDivComp(tagName)) {
      newtagName = 'div';
    }
    if (isBlockCom(tagName)) {
      newtagName = 'block';
    }
    if(tagName === 'cell') {
      newtagName = 'list-item';
    }
    if (newtagName !== '') {
      node.openingElement.name.name = newtagName;
      node.closingElement.name.name = newtagName;
    }
  }
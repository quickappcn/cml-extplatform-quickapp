const {
  types: t,
} = require("mvvm-template-parser");

const {
  isDivComp,
  isBlockCom
} = require('../util')

module.exports = function (context) {
  let {
    tagName,
    node,
    attributes,
    EMPTYTAG
  } = context;
  let newtagName = ''
  // origin-tag原生组件替换
  if (/^origin\-/.test(tagName)) {
    newtagName = tagName.replace(/^origin\-/, '');
  }
  // 部分组件替换
  if (isDivComp(tagName)) {
    newtagName = 'div';
  }
  if (isBlockCom(tagName)) {
    newtagName = 'block';
  }
  if (tagName === 'cell') {
    newtagName = 'list-item';
  }
  if (newtagName !== '') {
    node.openingElement.name.name = newtagName;
    node.closingElement.name.name = newtagName;
  }
  if (tagName === 'cml-buildin-page') {
    const hasFlag = attributes.find(attr => attr.name.name === '__page__')
    if (!hasFlag) {
      let newtagName = 'div';
      node.openingElement.name.name = newtagName;
      node.closingElement.name.name = newtagName;
      node.children = [t.jsxElement(t.jsxOpeningElement(t.jsxIdentifier(tagName), attributes.concat([t.jsxAttribute(t.jsxIdentifier(`__page__`), t.stringLiteral('true'))])), t.jsxClosingElement(t.jsxIdentifier(tagName)), node.children, [])]
      // attributes.forEach(attr => {
      //   attr.name.name = EMPTYTAG
      // });
    }
  }
}
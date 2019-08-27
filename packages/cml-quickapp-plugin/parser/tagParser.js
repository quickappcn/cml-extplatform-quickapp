const {
  types: t,
} = require("mvvm-template-parser");

module.exports = function (context) {
  let {
    tagName,
    node,
    attributes,
    EMPTYTAG,
  } = context;
  // origin-tag原生组件替换
  if (/^origin\-/.test(tagName)) {
    let newtagName = tagName.replace(/^origin\-/, '');
    node.openingElement.name.name = newtagName;
    node.closingElement.name.name = newtagName;
  }
  // 部分组件替换
  if (tagName === 'cover-view' || tagName === 'view' || tagName === 'scroller') {
    let newtagName = 'div';
    node.openingElement.name.name = newtagName;
    node.closingElement.name.name = newtagName;
  }
  if (tagName === 'cell') {
    let newtagName = 'list-item';
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
      attributes.forEach(attr => {
        attr.name.name = EMPTYTAG
      });
    }
  }
}
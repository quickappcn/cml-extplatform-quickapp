const { types: t } = require('mvvm-template-parser');
const { trimCurly, trim } = require('../util');

module.exports = function (context) {
  let { options, path, node, tagName, attributes, attr } = context;
  if (tagName.toLowerCase() === 'component' && t.isJSXIdentifier(attr.name) && attr.name.name === 'is') {
    let hasIfDirective = attributes.find((attr) => attr.name.name === 'c-if' || attr.name.name === 'if')
    if (hasIfDirective) {
      // 因为动态组件就是用c-if实现的，讲道理不能和c-if同时使用
      throw new Error(`The c-if directive can't be used in the  dynamic element`);
    }
    const shrinkcomponentsAttr = attributes.find((attr) => attr.name.name === 'shrinkcomponents');
    const shrinkcomponents = shrinkcomponentsAttr ? shrinkcomponentsAttr.value.value : []
    const currentComp = trimCurly(attr.value.value);
    let usingComponents = (options.usingComponents || []).map(item => item.tagName);
    let jsxElementChildren = node.children || [];
    if (shrinkcomponents.length) {
      usingComponents = shrinkcomponents.split(',').reduce((result, comp) => {
        comp = trim(comp);
        if (comp) {
          result.push(comp);
        }
        return result;
      }, [])
    }
    if (usingComponents.length) {
      let newComList = [];
      usingComponents.forEach((comp) => {
        // 去掉is和shrinkcomponents属性
        let newAttributes = attributes.filter(inner => inner.name.name !== 'is' && inner.name.name !== 'shrinkcomponents');

        newAttributes.push(t.jsxAttribute(t.jsxIdentifier(`if`), t.stringLiteral(`{{${currentComp} === '${comp}'}}`)));
        let openTag = t.jsxOpeningElement(t.jsxIdentifier(comp), newAttributes);
        let closeTag = t.jsxClosingElement(t.jsxIdentifier(comp))
        let insertNode = t.jsxElement(openTag, closeTag, jsxElementChildren, false);
        newComList.push(insertNode);
      })
      // 动态组件替换为新的组件数组
      path.replaceInline(newComList);
    }
  }
}
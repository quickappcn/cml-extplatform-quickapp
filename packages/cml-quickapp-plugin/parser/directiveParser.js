const {
  types: t
} = require('mvvm-template-parser');
const {
  trimCurly,
  getModelKey
} = require('../util');
const quickappMixin = require('cml-quickapp-mixins');

module.exports = function (context) {
  let {
    attributes,
    attr,
    node,
    EMPTYTAG
  } = context;

  // 列表渲染
  if (t.isJSXIdentifier(attr.name) && attr.name.name === 'c-for') {
    let forIndex = 'index'
    let forItem = 'item'
    let cForIndex = attributes.find(attr => attr.name.name === 'c-for-index')
    let cForItem = attributes.find(attr => attr.name.name === 'c-for-item')

    attr.name.name = 'for'

    if (cForIndex) {
      forIndex = cForIndex.value.value
      cForIndex.name.name = EMPTYTAG
    }
    if (cForItem) {
      forItem = cForItem.value.value
      cForItem.name.name = EMPTYTAG
    }

    forList = trimCurly(attr.value.value);
    attr.value.value = `(${forIndex}, ${forItem}) in ${forList}`
  }
  if (t.isJSXIdentifier(attr.name) && attr.name.name === 'c-for-index') {
    // attr.name.name = EMPTYTAG
  }
  if (t.isJSXIdentifier(attr.name) && attr.name.name === 'c-for-item') {
    // attr.name.name = EMPTYTAG
  }
  if (t.isJSXIdentifier(attr.name) && attr.name.name === 'c-key') {
    // attr.name.name = 'key'
  }

  // 条件渲染
  if (t.isJSXIdentifier(attr.name) && attr.name.name === 'c-if') {
    attr.name.name = 'if'
  }
  if (t.isJSXIdentifier(attr.name) && attr.name.name === 'c-else') {
    attr.name.name = 'else'
  }
  if (t.isJSXIdentifier(attr.name) && attr.name.name === 'c-else-if') {
    attr.name.name = 'elif'
  }

  // c-model
  if (t.isJSXIdentifier(attr.name) && attr.name.name === 'c-model') {
    // 去除原本的cml-model指令，替换为value和input双向的语法糖
    attr.name.name = EMPTYTAG;
    let modelKey = getModelKey(attr.value.value);
    attributes.push(t.jsxAttribute(t.jsxIdentifier(`value`), t.stringLiteral(attr.value.value)));
    attributes.push(t.jsxAttribute(t.jsxIdentifier(`data-modelkey`), t.stringLiteral(`${modelKey}`)));
    attributes.push(t.jsxAttribute(t.jsxIdentifier(`onchange`), t.stringLiteral(`${quickappMixin.modelEventProxyName}`)));
  }

  // c-show
  if (t.isJSXIdentifier(attr.name) && attr.name.name === 'c-show') {
    // c-show和style不能同时使用
    let styleNode = attributes.find((attr) => attr.name.name === 'style' || attr.name.name.name === 'style');
    if (styleNode) {
      throw new Error(`The style attribute can't be used in the element that has attributes with c-show `);
    }
    attr.name.name = 'show'
  }

  // c-text
  if (t.isJSXIdentifier(attr.name) && attr.name.name === 'c-text') {
    // 去掉c-text指令
    attr.name.name = EMPTYTAG;
    let textValue = attr.value.value;    
    node.children = [t.jsxElement(t.jsxOpeningElement(t.jsxIdentifier('text'), attributes), t.jsxClosingElement(t.jsxIdentifier('text')), [t.jsxText(textValue)], null)];
  }
}
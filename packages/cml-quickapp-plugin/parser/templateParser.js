const {
  cmlparse,
  generator,
  types: t,
  traverse
} = require("mvvm-template-parser");
const {
  trimCurly,
  getModelKey,
  modelEventProxyName,
  trim,
  isInlineStatementFn
} = require('../util');

const tagParser = require('./tagParser');
const classParser = require('./classParser');
const eventParser = require('./eventParser');
const directiveParser = require('./directiveParser');
const animationParser = require('./animationParser');

// 标记此attr需要被替换或者是单纯的删除
const EMPTYTAG = Symbol('cml-remove-tag');

module.exports = function (content, options = {}) {
  let ast = cmlparse(content);
  traverse(ast, {
    enter(path) {
      let node = path.node;
      if (t.isJSXElement(node)) {
        let tagName = node.openingElement.name.name;
        let attributes = node.openingElement.attributes;
        let context = {
          options,
          path,
          node,
          tagName,
          attributes,
          EMPTYTAG
        };
        attributes.forEach(attr => {
          context.attr = attr;
          directiveParser(context);
          eventParser(context);
          animationParser(context);
        });
        tagParser(context);
        classParser(context);
        // 去掉被标记为删除的attr
        node.openingElement.attributes = attributes = attributes.filter(attr => attr.name.name !== EMPTYTAG);
      }
    }
  });
  return generator(ast).code;
};
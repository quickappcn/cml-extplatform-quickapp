const { types: t } = require('mvvm-template-parser');
const {
  trim,
  isInlineStatementFn,
  isOriginTagOrNativeComp,
  doublequot2singlequot,
  getInlineStatementArgs
} = require('../util');
const quickappMixin = require('cml-quickapp-mixins');

module.exports = function (context) {
  let { options, attributes, attr, tagName } = context;
  let namespace = attr.name && attr.name.namespace;
  if (namespace && (namespace.name === 'c-bind' || attr.name.namespace.name === 'c-catch')) {
    
    // 文档上并没有找到关于catch的描述。。。。。。
    let handler = attr.value.value && trim(attr.value.value);
    let eventNameKey = namespace.name === 'c-bind' ? 'on' : '@';
    let eventNameVal = attr.name.name.name === 'tap' ? 'click' : attr.name.name.name;
    let eventKey = eventNameVal.toLowerCase();
    let eventName = `${eventNameKey}${eventNameVal}`;
    let match = isInlineStatementFn(handler);
    attr.name = t.jsxIdentifier(eventName);
    // ====这里作用是阻止对 origin-tag标签的事件进行代理
    if (isOriginTagOrNativeComp(tagName, options)) {
      return // 原生标签和原生组件直接不解析
    }
    // ====这里作用是阻止对 origin-tag标签的事件进行代理
    if (!match) {
      attributes.push(t.jsxAttribute(t.jsxIdentifier(`data-event${eventKey}`), t.stringLiteral(`{{['${handler}']}}`)))
      attr.value.value = quickappMixin.eventProxyName;
    } else {
      let index = handler.indexOf('(');
      index > 0 && (handler = trim(handler.slice(0, index)));
      attr.value.value = quickappMixin.inlineStatementEventProxy;
      let args = match && doublequot2singlequot(match[1]).trim();
      if (args) { // 内联函数传参
        let inlineArgs = getInlineStatementArgs(args);
        attributes.push(t.jsxAttribute(t.jsxIdentifier(`data-event${eventKey}`), t.stringLiteral(`{{['${handler}',${inlineArgs}]}}`)));
      } else { // 内联函数不传参
        attributes.push(t.jsxAttribute(t.jsxIdentifier(`data-event${eventKey}`), t.stringLiteral(`{{['${handler}']}}`)));
      }
    }
  }
}
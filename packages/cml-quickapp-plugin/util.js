const { types: t } = require('mvvm-template-parser');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse')["default"];
const generate = require('@babel/generator')["default"];
const _ = module.exports = {};
_.trimCurly = (str) => str.replace(/(?:{{)|(?:}})/ig, '');

_.getModelKey = function(modelKey) {
  modelKey = _.trimCurly(modelKey);
  modelKey = modelKey.trim();
  return modelKey;
}

// 判断是否直接转为快应用的 div
_.isDivComp = function(tag) {
  const divComList = ['view', 'cover-view', 'scroller', ''];
  return divComList.indexOf(tag) >= 0
}
_.isBlockCom = function(tag) {
  const blockComList = ['carousel-item']
  return blockComList.indexOf(tag) >= 0
}
// 驼峰化单词
_.camelize = function(str) {
  return str.replace(/[-_\s]+(.)/g, function(match, key) {
    return key ? key.toUpperCase() : '';
  })
}
// 中划线化单词
_.dasherise = function(str) {
  return str.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-')
    .toLowerCase();
}

/* 获取某个jsxElement 上的某个具体属性的值*
@params:
path:代表JSXElement的path值
return
该JSXElement上所有的属性集合
*/
_.trim = function (value) {
  return value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};
_.isInlineStatementFn = function (statament) {
  let reg = /\(([\s\S]*?)\)/;
  return statament.match(reg);
}
// 判断函数参数值在微信中是否是响应式的属性，'index' 代表字符串 'index'+1 代表表达式；
_.isReactive = function (value) {
  let reg = /(?:^'([^']*?)'$)/;
  return _.trim(value).match(reg);
}
_.doublequot2singlequot = function (value) {
  return value.replace(/["]/g, "'");
}
_.isOnlySpaceContent = function(value) {
  let reg = /[^\s]+/;
  return !reg.test(value);
}

// 转换 $event参数
_.getInlineStatementArgs = function(argsStr) {
  // argsStr:"1,'index'+1,$event,'item',index+1,item"
  const result = argsStr.split(',').reduce((result, current, index) => {
    if (current.trim() === '$event') {
      result.push("'$event'");
    } else {
      result.push(current)
    }
    return result
  }, []);
  return result.join();// "1,'index'+1,'$event','item',index+1,item"

}

_.isOriginTagOrNativeComp = function(tagName, options = {}) {
  let usedComponentInfo = (options.usingComponents || []).find((item) => item.tagName === tagName)
  let isNative = usedComponentInfo && usedComponentInfo.isNative;
  let isOrigin = (tagName && typeof tagName === 'string' && tagName.indexOf('origin-') === 0);
  if (isOrigin || isNative) {
    return true
  }
  return false;
}
_.isMustacheReactive = function (value) {
  let reg = /(?=.*[{]{2})(?=.*[}]{2})/;
  return reg.test(value);
}
_.transformWxDynamicStyleCpxToPx = function(value) {
  let reg = /[{]{2}([^{}]*?)[}]{2}/g;
  value = _.transformNotInMustacheCpxToPx(value);
  value = value.replace(reg, (match, statement) => `{{${_.transformMustacheCpxToPx(statement)}}}`);
  value = _.doublequot2singlequot(value)
  return value;
}
_.transformNotInMustacheCpxToPx = function(value) {
  let isNotMustacheCpxToPxReg = /([^{}]+)?(\{\{[^{}]+\}\})?/g;
  let temp = '';
  value.replace(isNotMustacheCpxToPxReg, (match, $1, $2, $3) => {
    if ($1) {
      temp += $1.replace(/cpx/g, 'px');
    }
    if ($2) {
      temp += $2;
    }
  });
  return temp
}
_.transformMustacheCpxToPx = function(source) {
  const ast = parser.parse(source, {
    plugins: ['jsx']
  })
  traverse(ast, {
    enter(path) {
      let node = path.node;
      if (t.isStringLiteral(node)) {
        if (node.value.includes('cpx')) {
          node.value = node.value.replace(/cpx/g, `px`);
        }
      }
    }
  })
  let result = generate(ast).code;
  if (/;$/.test(result)) { // 这里有个坑，jsx解析语法的时候，默认解析的是js语法，所以会在最后多了一个 ; 字符串；但是在 html中 ; 是无法解析的；
    result = result.slice(0, -1);
  }
  return result
}
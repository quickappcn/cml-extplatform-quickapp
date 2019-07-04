const { types: t } = require('mvvm-template-parser');
const _ = module.exports = {};
_.trimCurly = (str) => str.replace(/(?:{{)|(?:}})/ig, '');

_.getModelKey = function(modelKey) {
  modelKey = _.trimCurly(modelKey);
  modelKey = modelKey.trim();
  return modelKey;
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
_.analysisFor = function (nodeValue) {
  // v-for="item in items"
  let reg1 = /\s*(.+?)\s+(?:in|of)\s+(.+)\s*/;

  // v-for="(item, index) in items"
  let reg2 = /\s*\(([^\,\s]+?)\s*\,\s*([^\,\s]+?)\s*\)\s*(?:in|of)\s+(.+)\s*/
  let item, index, list;
  let matches1 = nodeValue.match(reg1);
  let matches2 = nodeValue.match(reg2);
  if (matches2) {
    item = matches2[1];
    index = matches2[2];
    list = matches2[3];

  } else if (matches1) {
    item = matches1[1];
    index = 'index';
    list = matches1[2];
  }
  return {
    item,
    index,
    list
  }
}
_.titleLize = function (word) {
  return word.replace(/^\w/, function (match) {
    return match.toUpperCase();
  })
}
// ast遍历相关
_.getSiblingPaths = function (path) {
  let container = path.container;
  let siblingPaths = [];
  for (let i = 0; i < container.length; i++) {
    siblingPaths.push(path.getSibling(i));
  }
  return siblingPaths;
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
_.isMustacheReactive = function (value) {
  let reg = /(?=.*[{]{2})(?=.*[}]{2})/;
  return reg.test(value);
}
_.isOnlySpaceContent = function(value) {
  let reg = /[^\s]+/;
  return !reg.test(value);
}

_.makeMap = function(str, expectsLowerCase) {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}
_.isPlainTextElement = _.makeMap('script,style,textarea', true)

// 转换 $event参数
_.getInlineStatementArgs = function(argsStr) {
  // argsStr:"1,'index'+1,$event,'item',index+1,item"
  const result = argsStr.split(',').reduce((result, current, index) => {
    if (current === '$event') {
      result.push("'$event'");
    } else {
      result.push(current)
    }
    return result
  }, []);
  return result.join();// "1,'index'+1,'$event','item',index+1,item"

}

_.isOriginTagOrNativeComp = function(tagName, options) {
  let usedComponentInfo = (options.usingComponents || []).find((item) => item.tagName === tagName)
  let isNative = usedComponentInfo && usedComponentInfo.isNative;
  let isOrigin = (tagName && typeof tagName === 'string' && tagName.indexOf('origin-') === 0);
  if (isOrigin || isNative) {
    return true
  }
  return false;
}

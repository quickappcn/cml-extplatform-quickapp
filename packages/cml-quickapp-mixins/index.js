const utils = require('./src/utils')
const _ = module.exports = {};
_.eventProxyName = '_cmlEventProxy';
_.modelEventProxyName = '_cmlModelEventProxy';// c-model的事件代理
_.inlineStatementEventProxy = '_cmlInline';// 内联语句的事件代理
_.eventEmitName = '$cmlEmit'; // 触发事件的方法
_.mergeStyleName = '$cmlMergeStyle';
_.animationProxy = '_animationCb';

_.isType = function (obj, type) {
  return Object.prototype.toString.call(obj).slice(8, -1) === type
}

_.mergeStyle = function (...args) {
  // 可以接受字符串或者对象
  function styleToObj(str) {
    let obj = {};
    str.split(';').filter(item => !!item.trim())
      .forEach(item => {
        let {key, value} = utils.getStyleKeyValue(item);
        key = key.replace(/\s+/, '')
        value = value.replace(/\s+/, '')
        obj[key] = value
      })
    return obj;
  }
  let arr = [];
  args.forEach(arg => {
    if (typeof arg === 'string') {
      arr.push(styleToObj(arg))
    } else if (Object.prototype.toString.call(arg) === '[object Object]') {
      arr.push(arg);
    }
  })
  let resultObj = Object.assign(...arr)

  let resultStr = ''
  Object.keys(resultObj).forEach(key => {
    resultStr += `${key}:${resultObj[key]};`
  })
  return resultStr;

}
_.trim = function (value) {
  return value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};
_.isReactive = function(value) {
  let reg = /(?:^'([^']*?)'$)/;
  return _.trim(value).match(reg);
}

_.mixins = {
  methods: {
    // 支持事件传参
    [_.inlineStatementEventProxy](e) {
      let { dataset } = e.currentTarget || e.target;
      let eventKey = e.type.toLowerCase();
      let originFuncName = dataset && dataset[`event${eventKey}`] && dataset[`event${eventKey}`][0];
      let inlineArgs = dataset && dataset[`event${eventKey}`] && dataset[`event${eventKey}`].slice(1);
      let argsArr = [];
      // 由于百度对于 data-arg="" 在dataset.arg = true 值和微信端不一样所以需要重新处理下这部分逻辑
      if (inlineArgs) {
        argsArr = inlineArgs.reduce((result, arg, index) => {
          if (arg === "$event") {
            let newEvent = utils.getNewEvent(e);
            result.push(newEvent);
          } else {
            result.push(arg)
          }
          return result;
        }, []);
      }
      if (originFuncName && this[originFuncName] && _.isType(this[originFuncName], 'Function')) {
        this[originFuncName](...argsArr)
      } else {
        console.log(`can not find method ${originFuncName}`)
      }
    },
    [_.modelEventProxyName](e) {
      let { dataset } = e.currentTarget || e.target;
      let modelKey = dataset && dataset.modelkey
      if (modelKey) {
        /* quickapp onchange event is not standard object
          {
            name: 'text | email | date | time | number | password',
            value: '',
            checked: true | false,
            text: ''
          }
        */
        this[modelKey] = e.value;
      }

    },
    [_.eventProxyName](e) {
      let { dataset } = e.currentTarget || e.target;
      let eventKey = e.type.toLowerCase();
      let originFuncName = dataset && dataset[`event${eventKey}`] && dataset[`event${eventKey}`][0];
      
      if (originFuncName && this[originFuncName] && _.isType(this[originFuncName], 'Function')) {
        let newEvent = utils.getNewEvent(e);
        
        this[originFuncName](newEvent)
      } else {
        console.log(`can not find method ${originFuncName}`)
      }
    },
    [_.mergeStyleName](...args) {
      return _.mergeStyle(...args);
    },
    [_.animationProxy](...args) {
      let animationValue = args[0];
      // animationValue:{cbs:{0:cb0,1:cb1,length:2},index}
      let animation = this[animationValue];// 引用值
      if (!animation) {
        return ;
      }
      const { cbs, index } = animation;
      // 配合 解决百度端动画bug
      if (cbs === undefined || index === undefined) {return ;}
      let cb = cbs[index];
      if (cb && typeof cb === 'function') {
        cb();
      }
      delete animation.index;
      animation.index = index + 1;
    },
    [_.eventEmitName]: function(eventKey, detail) {
      // Todo quickapp only supports this.on(customEvent, callback)
      this.$emit(eventKey, detail)
    }
  }

}

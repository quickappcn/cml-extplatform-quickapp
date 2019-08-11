import BaseVmAdapter from './BaseVmAdapter'
import {
  type
} from '../util/type'
import {
  propToFn,
  transferLifecycle
} from '../util/util'
import {
  mergeDefault,
  mergeHooks,
  mergeSimpleProps,
  mergeData,
  mergeWatch
} from '../util/resolve'


// web&&weex options transform 基类
class QuickAppVmAdapter extends BaseVmAdapter {
  constructor(config) {
    super(config)
    this.needAddHookMixin = config.needAddHookMixin
  }

  init() {
    this.initHooks(this.options)

    this.initOptions(this.options)
    // 处理 mixins 
    this.initMixins(this.options)
    // 处理 生命周期多态
    this.extendPolyHooks()

    // 添加各种mixins
    this.mergeBuiltinMixins()
    // 修改 vue options 的合并策略
    this.resolveOptions()
    this.transformHooks()

    // 添加生命周期代理
    this.needAddHookMixin && this.addHookMixin()
  }
  /**
   * merge cml hooks from mixins
   * handle hooks include:
   * 1. cml hooks
   * 2. platforms hooks in resolveOptions function
   * @param {Object} options 
   */
  initHooks(options) {
    if (!options.mixins) return
    const cmlHooks = lifecycle.get('cml.hooks')
    const mixins = options.mixins

    for (let i = mixins.length - 1; i >= 0; i--) {
      const mix = mixins[i]

      Object.keys(mix).forEach(key => {
        if (cmlHooks.indexOf(key) !== -1) {
          !Array.isArray(mix[key]) && (mix[key] = [mix[key]])

          if (hasOwn(options, key)) {
            !Array.isArray(options[key]) && (options[key] = [options[key]])

            options[key] = mix[key].concat(options[key])
          } else {
            options[key] = mix[key]
          }
          delete mix[key]
        }
      })
    }
  }
  initOptions(options) {
    // 处理 props
    this.handleProps(options)
    // 处理 data
    propToFn(options, 'data')
    // 处理 生命周期映射
    transferLifecycle(options, this.hooksMap)
  }

  /**
   * 处理组件props属性
   * @param  {Object} options 组件options
   * @return {[type]}     [description]
   */
  handleProps(options) {
    if (!options['props']) return

    Object.getOwnPropertyNames(options['props']).forEach((name) => {
      let prop = options['props'][name]

      propToFn(prop, 'default')
    })
  }

  initMixins(options) {
    if (!options.mixins) return

    const mixins = options.mixins

    mixins.forEach((mix) => {
      this.initOptions(mix)
    })
  }

  /**
   * 类web端差异化生命周期 hooks mixins
   */
  extendPolyHooks() {
    let methods = this.options.methods

    if (!methods || !this.polyHooks) {
      return
    }

    this.polyHooks.forEach((hook) => {
      // 目前是 给web的beforeRouteEnter|beforeRouteLeave 自定义生命钩子开一个口子
      if (type(methods[hook]) === 'Function') {
        this.options[hook] = methods[hook]
      }
    })
  }

  mergeBuiltinMixins() {
    const btMixin = [
      this.baseMixins,
      this.runtimeMixins
    ].filter(item => item)

    this.options.mixins = this.options.mixins ?
      btMixin.concat(this.options.mixins) :
      btMixin
  }

  resolveOptions() {
    const self = this
    let extractMixins = function (mOptions, options) {
      if (options.mixins) {
        for (const mix of options.mixins) {
          extractMixins(mOptions, mix)
        }
      }
      mergeMixins(mOptions, options)
    }

    let mergeMixins = function (parent, child) {
      for (let key in child) {
        if (self.hooks.indexOf(key) > -1) {
          mergeHooks(parent, child, key)
        } else if (key === 'data') {
          mergeData(parent, child, key)
        } else if (testProps(key)) {
          mergeSimpleProps(parent, child, key)
        } else if (key === 'watch') {
          mergeWatch(parent, child, key)
        } else if (key !== 'mixins') {
          mergeDefault(parent, child, key)
        }
      }
    }

    let testProps = function (key) {
      let regExp = new RegExp('computed|methods|proto|' + self.propsName)
      return regExp.test(key)
    }

    const newOptions = {}
    extractMixins(newOptions, this.options)

    this.options = newOptions
  }
  transformHooks() {
    if (!this.hooks || !this.hooks.length) return
    const self = this
    this.hooks.forEach(key => {
      const hooksArr = self.options[key]
      hooksArr && (self.options[key] = function (...args) {
        let result
        let asyncQuene = []

        // 多态生命周期需要统一回调参数
        // if (self.polyHooks.indexOf(key) > -1) {
        //   let res = args[0]
        //   if (type(res) !== 'Object') {
        //     res = {
        //       'detail': args[0]
        //     }
        //   }
        //   args = [res]
        // }

        if (type(hooksArr) === 'Function') {
          result = hooksArr.apply(this, args)
        } else if (type(hooksArr) === 'Array') {
          for (let i = 0; i < hooksArr.length; i++) {
            if (type(hooksArr[i]) === 'Function') {

              result = hooksArr[i].apply(this, args)

              // if (result && result.enableAsync) {
              //   asyncQuene = hooksArr.slice(i + 1)
              //   break
              // }
            }
          }
          // Promise.resolve().then(() => {
          //   asyncQuene.forEach(fn => {
          //     fn.apply(this, args)
          //   })
          // })
        }
        return result
      })
    })
  }

  addHookMixin() {
    if (!this.hooks || !this.hooks.length) return

    let self = this
    this.hooks.forEach(key => {
      const hook = this.options[key]
      hook && (this.options[key] = function (...args) {
        let result
        if (type(hook) === 'Function' || type(hook) === 'Array') {
          // 钩子函数参数mixin
          const proxyHook = self.proxyLifecycle(key, hook, this)
          result = proxyHook.apply(this, args)
        }

        return result
      })
    })
  }
}

export default QuickAppVmAdapter
import BaseCtor from '../../util/proto/BaseCtor'
import lifecycle from '../../util/util/lifecycle'
import VmAdapter from '../core/VmAdapter'
import MiniRuntimeCore from '../../util/proto/MiniRuntimeCore'

export class CmlComponent extends BaseCtor {
  constructor (options) {
    super(options)

    this.cmlType = 'quickapp'

    const runtimeCore = new MiniRuntimeCore({
      polyHooks: lifecycle.get('quickapp.component.polyHooks'),
      platform: this.cmlType,
      options: this.options
    })

    this.initVmAdapter(VmAdapter, {
      type: 'component',
      runtimeMixins: {
        created() {
          // 初始化
          runtimeCore
            .setContext(this)
            .init()
            // .addPageHooks()
        },
        attached() {
          runtimeCore
            .setContext(this)
            .start('component-view-render')
        },
        ready() {

        },
        detached() {
          // stop
          runtimeCore
            .setContext(this)
            .destory()
        }
      },
      hooks: lifecycle.get('quickapp.component.hooks'),
      hooksMap: lifecycle.get('quickapp.component.hooksMap'),
      polyHooks: lifecycle.get('quickapp.component.polyHooks'),
      usedHooks: lifecycle.get('quickapp.component.usedHooks'),
      needPropsHandler: true,
      needTransformProperties: true
    })
    
    this.options['options'] = {
      multipleSlots: true // 在组件定义时的选项中启用多slot支持
    }
      Component(this.options)
  }
}

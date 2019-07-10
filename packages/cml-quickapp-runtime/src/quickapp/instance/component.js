import BaseCtor from '../../util/proto/BaseCtor'
import lifecycle from '../../util/util/lifecycle'
import VmAdapter from '../core/VmAdapter'
import QuickAppRuntimeCore from '../../util/proto/QuickAppRuntimeCore'

export class CmlComponent extends BaseCtor {
  constructor (options) {
    super(options)
    this.cmlType = 'quickapp'

    const runtimeCore = new QuickAppRuntimeCore({
      polyHooks: lifecycle.get('quickapp.component.polyHooks'),
      platform: this.cmlType,
      options: this.options
    })

    this.initVmAdapter(VmAdapter, {
      type: 'component',
      runtimeMixins: {},
      hooks: lifecycle.get('quickapp.component.hooks'),
      hooksMap: lifecycle.get('quickapp.component.hooksMap'),
      polyHooks: lifecycle.get('quickapp.component.polyHooks'),
      usedHooks: lifecycle.get('quickapp.component.usedHooks'),
      needPropsHandler: true,
      needResolveAttrs: ['methods'],
      needTransformProperties: true
    })
    
    this.options['options'] = {
      multipleSlots: true // 在组件定义时的选项中启用多slot支持
    }
  }
}

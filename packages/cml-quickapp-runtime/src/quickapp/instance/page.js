import BaseCtor from '../../util/proto/BaseCtor'
import lifecycle from '../../util/util/lifecycle'
import VmAdapter from '../core/VmAdapter'
import QuickAppRuntimeCore from '../../util/proto/QuickAppRuntimeCore'

export class CmlPage extends BaseCtor {
  constructor(options) {
    super(options)
    this.cmlType = 'quickapp'

    const runtimeCore = new QuickAppRuntimeCore({
      polyHooks: lifecycle.get('quickapp.page.polyHooks'),
      platform: this.cmlType,
      options: this.options
    })

    this.initVmAdapter(VmAdapter, {
      options: this.options,
      type: 'page',
      runtimeMixins: {
        onInit() {
          // 初始化
          runtimeCore
            .setContext(this)
            .init()
        }
      },
      needResolveAttrs: ['methods'],
      hooks: lifecycle.get('quickapp.page.hooks'),
      hooksMap: lifecycle.get('quickapp.page.hooksMap'),
      polyHooks: lifecycle.get('quickapp.page.polyHooks'),
      usedHooks: lifecycle.get('quickapp.page.usedHooks')
    })
  }
}
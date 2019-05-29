import BaseCtor from '../../util/proto/BaseCtor'
import lifecycle from '../../util/util/lifecycle'
import VmAdapter from '../core/VmAdapter'
import MiniRuntimeCore from '../../util/proto/MiniRuntimeCore'

export class CmlPage extends BaseCtor {
  constructor (options) {
    super(options)

    this.cmlType = 'quickapp'

    const runtimeCore = new MiniRuntimeCore({
      polyHooks: lifecycle.get('quickapp.page.polyHooks'),
      platform: this.cmlType,
      options: this.options
    })

    this.initVmAdapter(VmAdapter, {
      options: this.options,
      type: 'page',
      runtimeMixins: {
        onLoad() {
          // 初始化
          runtimeCore
            .setContext(this)
            .init()
            .start('page-view-render')
        },
        onUnload() {
          // stop
          runtimeCore
            .setContext(this)
            .destory()
        },
        onPullDownRefresh() {
          const path = this.route
          
          this.$cmlEventBus.emit(`${path}_onPullDownRefresh`, {
            path
          })
        },
        onReachBottom() {
          const path = this.route
          
          this.$cmlEventBus.emit(`${path}_onReachBottom`, {
            path
          })
        }
      },
      needResolveAttrs: ['methods'],
      hooks: lifecycle.get('quickapp.page.hooks'),
      hooksMap: lifecycle.get('quickapp.page.hooksMap'),
      polyHooks: lifecycle.get('quickapp.page.polyHooks'),
      usedHooks: lifecycle.get('quickapp.page.usedHooks')
    })

    Page(this.options)
  }
}

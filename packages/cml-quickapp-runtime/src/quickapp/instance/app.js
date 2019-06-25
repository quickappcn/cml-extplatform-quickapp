// import BaseCtor from 'chameleon-runtime/src/platform/common/proto/BaseCtor'
// import lifecycle from 'chameleon-runtime/src/platform/common/util/lifecycle'
import VmAdapter from '../core/VmAdapter'
// import MiniRuntimeCore from 'chameleon-runtime/src/platform/common/proto/MiniRuntimeCore'
import MiniRuntimeCore from '../../util/proto/MiniRuntimeCore'
import BaseCtor from '../../util/proto/BaseCtor'
import lifecycle from '../../util/util/lifecycle'

export class CmlApp extends BaseCtor {
  constructor (options) {
    super(options)

    this.cmlType = 'quickapp'

    const runtimeCore = new MiniRuntimeCore({
      polyHooks: lifecycle.get('quickapp.app.polyHooks'),
      platform: this.cmlType,
      options: this.options
    })

    this.initVmAdapter(VmAdapter, {
      type: 'app',
      runtimeMixins: {
        onLaunch() {
          // 初始化
          runtimeCore
            .setContext(this)
            .init()
            .start('app-view-render')
        }
      },
      needResolveAttrs: ['methods'],
      hooks: lifecycle.get('quickapp.app.hooks'),
      hooksMap: lifecycle.get('quickapp.app.hooksMap'),
      polyHooks: lifecycle.get('quickapp.app.polyHooks'),
      usedHooks: lifecycle.get('quickapp.app.usedHooks')
    })
      // App(this.options)
  }
}

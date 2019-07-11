// import BaseCtor from 'chameleon-runtime/src/platform/common/proto/BaseCtor'
// import lifecycle from 'chameleon-runtime/src/platform/common/util/lifecycle'
import VmAdapter from '../core/VmAdapter'
// import MiniRuntimeCore from 'chameleon-runtime/src/platform/common/proto/MiniRuntimeCore'
import QuickAppRuntimeCore from '../../util/proto/QuickAppRuntimeCore'
import BaseCtor from '../../util/proto/BaseCtor'
import lifecycle from '../../util/util/lifecycle'

export class CmlApp extends BaseCtor {
  constructor (options) {
    super(options)
    this.cmlType = 'quickapp'

    const runtimeCore = new QuickAppRuntimeCore({
      polyHooks: lifecycle.get('quickapp.app.polyHooks'),
      platform: this.cmlType,
      options: this.options
    })

    this.initVmAdapter(VmAdapter, {
      type: 'app',
      runtimeMixins: {},
      needResolveAttrs: ['methods'],
      hooks: lifecycle.get('quickapp.app.hooks'),
      hooksMap: lifecycle.get('quickapp.app.hooksMap'),
      polyHooks: lifecycle.get('quickapp.app.polyHooks'),
      usedHooks: lifecycle.get('quickapp.app.usedHooks')
    })
  }
}

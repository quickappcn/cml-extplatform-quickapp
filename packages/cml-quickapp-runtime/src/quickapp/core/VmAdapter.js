// import MiniVmAdapter from 'chameleon-runtime/src/platform/common/proto/MiniVmAdapter'
import QuickAppVmAdapter from '../../util/proto/QuickAppVmAdapter';
import quickappMixins from 'cml-quickapp-mixins'

class VmAdapter extends QuickAppVmAdapter {
  constructor(config) {
    super(config)

    this.platform = 'quickapp'
    // 样式、事件代理 mixins
    this.baseMixins = quickappMixins.mixins
    this.init()
  }
}
export default VmAdapter
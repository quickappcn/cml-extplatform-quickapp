// import MiniVmAdapter from 'chameleon-runtime/src/platform/common/proto/MiniVmAdapter'
import QuickAppVmAdapter from '../../util/proto/QuickAppVmAdapter';
import wxMixins from 'chameleon-mixins/wx-mixins.js'

class VmAdapter extends QuickAppVmAdapter {
  constructor(config) {
    super(config)

    this.platform = 'quickapp'
    // 样式、事件代理 mixins
    this.baseMixins = wxMixins.mixins
    this.init()
  }
}
export default VmAdapter
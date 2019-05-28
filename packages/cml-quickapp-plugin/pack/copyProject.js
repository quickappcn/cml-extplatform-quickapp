

const path = require('path');
const cmlUtils = require('chameleon-tool-utils');
module.exports = function(compiler) {
  let quickappDir = path.join(cml.projectRoot, 'src/quickapp');
  if(cmlUtils.isDir(quickappDir)) {
    cmlUtils.fse.copySync(quickappDir, path.join(compiler.outputPath))
  }
}


const path = require('path');
var defaultDir = path.join(__dirname, '../default');
const cmlUtils = require('chameleon-tool-utils');
module.exports = function(compiler) {
  cmlUtils.fse.copySync(path.join(__dirname,'../default'), path.join(compiler.outputPath))
}
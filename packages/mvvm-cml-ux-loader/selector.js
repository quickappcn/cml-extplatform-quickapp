

const loaderUtils = require('loader-utils');
const path = require('path');
const fs = require('fs');
const cmlUtils = require('chameleon-tool-utils');

module.exports = function(content) {
  const self = this;
  let output = '';
  const rawOptions = loaderUtils.getOptions(this) || {};
  const resourcePath = this.resourcePath;
  let parts = cmlUtils.splitParts({content});
  let {partType} = rawOptions;
  this._module._nodeType = 'module';
  this._module._moduleType = partType;
  this._module._parentNodeType = 'components';

  switch (partType) {
    case 'template':
      this._module._cmlSource = parts.template && parts.template[0].content;
      output = `module.exports = ${JSON.stringify(this._module._cmlSource)}`;
      break;
    case 'script':
      output =  parts.script && parts.script[0].content;
    case 'style':
      output = parts.style && parts.style[0].content;
      break;
    default:
      break;
  }

  return output;

}

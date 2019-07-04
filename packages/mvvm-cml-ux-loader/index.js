
const cmlUtils = require('chameleon-tool-utils');
const loaderUtils = require('loader-utils');
const helper = require('./helper.js');
module.exports = function(content) {
  let output = "";
  this._module._nodeType = "component";
  
  let self = this;
  const rawOptions = loaderUtils.getOptions(this) || {};
  let {loaders, cmlType, media} = rawOptions;
  const resourcePath = this.resourcePath;
  let selectorOptions = {
    cmlType,
    media
  }
  let parts = cmlUtils.splitParts({content});

  if (parts.style && parts.style[0]) {
    let part = parts.style[0];
    let lang = part.attrs && part.attrs.lang || 'less';
    output += `
    var style = require(${helper.getPartLoaders({loaderContext: self, selectorOptions, partType: 'style', lang, loaders, resourcePath})});
    `
  }
  output += `var template = require(${helper.getPartLoaders({loaderContext: self, selectorOptions, partType: 'template', loaders, resourcePath})});\n`
  output += `var script = require(${helper.getPartLoaders({loaderContext: self, selectorOptions, partType: 'script', loaders, resourcePath})});\n`
  
  let uximports = [];
  
  parts.customBlocks.forEach(item=>{
    if(item.type === 'import') {
      item.attrs = item.attrs || {}; 
      let {name, src} = item.attrs;
      uximports.push({
        name,
        src
      })
      if(src) {
        if(!/\.ux$/.test(src)) {
          src += '.ux';
        }
        output += `require('${src}')`
      }
    }
  })
  this._module._cmlExtra = {
    uximports
  }
  return output;
}

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
  output += `var template = require(${helper.getPartLoaders({loaderContext: self, selectorOptions, partType: 'template', loaders, resourcePath})});\n`
  output += `var style = require(${helper.getPartLoaders({loaderContext: self, selectorOptions, partType: 'style', lang: 'css', loaders, resourcePath})});\n`
  output += `var script = require(${helper.getPartLoaders({loaderContext: self, selectorOptions, partType: 'script', loaders, resourcePath})});\n`

  return output;
}
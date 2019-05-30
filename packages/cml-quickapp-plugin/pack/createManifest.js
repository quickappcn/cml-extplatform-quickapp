
const fs = require('fs');
const path = require('path');
const cmlUtils = require('chameleon-tool-utils');

module.exports = function(jsonNode, compiler) {

  let manifestObj = jsonNode.convert;
  if(manifestObj.pages) {
    delete manifestObj.pages
  }
  let {projectRouter, subProjectRouter} = compiler.getRouterConfig();
  let resultRouter = manifestObj.router || {};
  resultRouter.pages = resultRouter.pages || {};
  if(projectRouter && projectRouter.routes) {
    projectRouter.routes.forEach((item, index)=>{
      let matches = item.path.match(/(.*)\/(.*)$/);
      if(matches) {
        let key = matches[1];
        let value = matches[2];
        if(index === 0 && !resultRouter.entry) {
          resultRouter.entry = key;
        }
        if(!resultRouter.pages[key]) {
          resultRouter.pages[key] = {
            component: value
          };
        }
      }
    })
  }
  // 子项目
  if(subProjectRouter) {
    Object.keys(subProjectRouter).forEach(npmName=>{
      let item = subProjectRouter[npmName];
      if(item && item.routes) {
        item.routes.forEach(route=>{
          let matches = route.path.match(/(.*)\/(.*)$/);
          if(matches) {
            let key = `/npm/${npmName}/src${matches[1]}`;
            let value = matches[2];
            if(!resultRouter.pages[key]) {
              resultRouter.pages[key] = {
                component: value
              };
            }
          }
        })
      }
    })
  }
  manifestObj.router = resultRouter;
  // 拷贝图片 
  if(manifestObj.icon) {
    let filePath;
    if(manifestObj.icon[0] !== '/') {
      filePath = cmlUtils.resolveSync(jsonNode.realPath, manifestObj.icon);
    } else {
      filePath = path.join(cml.projectRoot, 'src' , manifestObj.icon);
    }
    if(cmlUtils.isFile(filePath)) {
      let relativePath = path.relative(path.join(cml.projectRoot,'src'), filePath);
      if(relativePath[0] !== '/') {
        relativePath = '/'+ relativePath;
      }
      compiler.writeFile('/src'+ relativePath, fs.readFileSync(filePath));
      manifestObj.icon = relativePath;
    }
  }
  compiler.writeFile('/src/manifest.json', JSON.stringify(manifestObj,'', 4));
  
}
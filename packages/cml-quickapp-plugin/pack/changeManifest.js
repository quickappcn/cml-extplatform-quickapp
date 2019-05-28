
const fs = require('fs');
const path = require('path');
const cmlUtils = require('chameleon-tool-utils');

module.exports = function(compiler) {
  let manifestPath = path.join(compiler.outputPath, 'src/manifest.json');
  if(cmlUtils.isFile(manifestPath)) {
    let manifestObj = JSON.parse(fs.readFileSync(manifestPath,{encoding: 'utf8'}));
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
    manifestObj.router = resultRouter;
    fs.writeFileSync(manifestPath,JSON.stringify(manifestObj,'', 4))
  } else {
    throw new Error('not set quickapp manifest.json')
  }
}
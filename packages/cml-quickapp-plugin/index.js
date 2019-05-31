const templateParser = require("./templateParser.js");
const styleParser = require("./styleParser.js");
const pkg = require("./package.json");
const cmlUtils = require("chameleon-tool-utils");
const path = require("path");
const copyDefault = require('./pack/copyDefault.js');
const copyProject = require('./pack/copyProject.js');
const changeManifest = require('./pack/changeManifest.js');
const fs = require('fs');
const apiContent = fs.readFileSync(path.join(__dirname, '/api/index.js'), 'utf-8');

module.exports = class QuickAppPlugin {
  constructor(options) {
    let { cmlType, media} = options;
    this.webpackRules = []; // webpack的rules设置  用于当前端特殊文件处理
    this.moduleRules = []; // 文件后缀对应的节点moduleType  
    this.logLevel = 3;
    this.originComponentExtList = ['.ux']; // 用于扩展原生组件的文件后缀查找
    this.runtimeNpmName = 'cml-quickapp-runtime'; // 指定当前端的运行时库
    this.builtinUINpmName = 'cml-quickapp-ui-builtin'; // 指定当前端的内置组件库
    this.cmlType = cmlType;
    this.media = media;
    // 需要压缩文件的后缀
    this.minimizeExt = {
      js: ['.js'],
      css: ['.css']
    }
    this.assetsPrePath = 'src/';
    this.cmlConfig = {
      dev: {
        publicPath: '/'
      },
      build: {
        publicPath: '/'
      }
    }
  }
  /**
   * @description 注册插件
   * @param {compiler} 编译对象
   * */

  register(compiler) {
    let self = this;
    /**
     * cml节点编译前
     * currentNode 当前节点
     * nodeType 节点的nodeType
     */
    compiler.hook("compile-preCML", function (currentNode, nodeType) { });
    /**
     * cml节点编译后
     * currentNode 当前节点
     * nodeType 节点的nodeType
     */
    compiler.hook("compile-postCML", function (currentNode, nodeType) { });

    /**
     * 编译script节点，比如做模块化
     * currentNode 当前节点
     * parentNodeType 父节点的nodeType
     */
    compiler.hook("compile-script", function (currentNode, parentNodeType) {
      currentNode.output = compiler.amd.amdWrapModule({
        content: currentNode.source,
        modId: currentNode.modId
      });
    });

    /**
     * 编译script节点，比如做模块化
     * currentNode 当前节点
     * parentNodeType 父节点的nodeType
     */
    compiler.hook("compile-asset", function (currentNode, parentNodeType) {
      currentNode.output = compiler.amd.amdWrapModule({
        content: currentNode.source,
        modId: currentNode.modId
      });
    });

    /**
     * 编译template节点 语法转义
     * currentNode 当前节点
     * parentNodeType 父节点的nodeType
     */
    compiler.hook("compile-template", function (currentNode, parentNodeType) {
      let {componentFiles} = currentNode.parent.extra;
      currentNode.output = templateParser(currentNode.source);
      if(componentFiles) {
        let components = '';
        Object.keys(componentFiles).forEach(key=>{
          let targetEntry = cmlUtils.getPureEntryName(componentFiles[key], self.cmlType, cml.projectRoot);
          let sourceEntry = cmlUtils.getPureEntryName(currentNode.realPath, self.cmlType, cml.projectRoot);
          let relativePath = cmlUtils.handleRelativePath(sourceEntry, targetEntry);
          components += `<import name='${key}' src='${relativePath}'></import>\n`
        })
        // 记录引入的组件
        currentNode.importComponents = components;
      }
    });

    /**
     * 编译style节点  比如尺寸单位转义
     * currentNode 当前节点
     * parentNodeType 父节点的nodeType
     */
    compiler.hook("compile-style", function (currentNode, parentNodeType) {
      currentNode.output = styleParser(currentNode.source);
    });

    /**
     * 编译json节点
     * currentNode 当前节点
     * parentNodeType 父节点的nodeType
     */
    compiler.hook("compile-json", function (currentNode, parentNodeType) {
      currentNode.output = currentNode.source;
    });

    /**
     * 编译other类型节点
     * currentNode 当前节点
     */
    compiler.hook("compile-other", function (currentNode) { });

    /**
     * 编译结束进入打包阶段
     */
    compiler.hook("pack", function (projectGraph) {
      // 拷贝默认文件        
      copyDefault(compiler);
      // 拷贝项目中配置的快应用文件
      copyProject(compiler);
      // 修改manifest文件 路由
      changeManifest(compiler);
      // 导出api
      compiler.writeFile('/src/js/api.js', apiContent);
            
      // 遍历编译图的节点，进行各项目的拼接
      let hasCompiledNode = [];
      

      let bootstrapCode = compiler.amd.getModuleBootstrap();
      compiler.writeFile('/src/js/manifest.js', bootstrapCode);
      let commonjsContent = `var manifest = require('./manifest.js');\n`;
      commonjsContent += `var quickapp = require('./api.js');\n`;
      commonjsContent += `var cmldefine = manifest.cmldefine;\n`;
      // 遍历节点
      outputNode(projectGraph);
      compiler.writeFile('/src/js/common.js', commonjsContent);
      function outputNode(currentNode) {
        if (~hasCompiledNode.indexOf(currentNode)) {
          return;
        }
        hasCompiledNode.push(currentNode);

        if(currentNode.nodeType === 'app') {
          let output = '';
          let filePath = '/src/app.ux';
          currentNode.childrens.forEach(item=>{
            if(item.moduleType === 'script') {
              output += `
              <script>
                var manifest = require('./js/manifest.js');
                var cmldefine = manifest.cmldefine;
                var cmlrequire = manifest.cmlrequire;
                require('./js/common.js');
                module.exports = cmlrequire('${item.modId}');
              </script>
              `
            }
            outputNode(item);
          })
          compiler.writeFile(filePath, output);
          
        }
  
        if(~['page','component'].indexOf(currentNode.nodeType)) {
          let output = '';
          let entryName = cmlUtils.getPureEntryName(currentNode.realPath, self.cmlType, cml.projectRoot);
          // 统一加上src
          entryName = 'src/' + entryName;
          let filePath = entryName + '.ux';
          let childrenObj = {};
          currentNode.childrens.forEach(item=>{
            childrenObj[item.moduleType] = item;
            outputNode(item);
          })

          if(childrenObj.template) {
            if(childrenObj.template.importComponents) {
              output += childrenObj.template.importComponents + '\n';
            }
            output += `
            <template>
              ${childrenObj.template.output}
            </template>
            `
          }

          if(childrenObj.script) {
            output += `
            <script>
              var manifest = require('${cmlUtils.handleRelativePath(entryName, 'src/js/manifest.js')}');
              var cmldefine = manifest.cmldefine;
              var cmlrequire = manifest.cmlrequire;
              require('${cmlUtils.handleRelativePath(entryName, 'src/js/common.js')}');
              module.exports = cmlrequire('${childrenObj.script.modId}');
            </script>
            `
          }

          if(childrenObj.style) {
            output += `
            <style>
              ${childrenObj.style.output}
            </style>
            `
          }

          compiler.writeFile(filePath, output);
        }

        if(currentNode.nodeType === 'module' && ~['script','asset'].indexOf(currentNode.moduleType)) {
          commonjsContent += currentNode.output;
        }
  
        currentNode.dependencies.forEach(item => {
          outputNode(item);
        })
      }

    });
  }
};
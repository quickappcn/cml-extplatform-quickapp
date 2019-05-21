const templateParser = require("./templateParser.js");
const styleParser = require("./styleParser.js");
const pkg = require("./package.json");
const cmlUtils = require("chameleon-tool-utils");
const path = require("path");

const CERTIFICATE_PEM = `
-----BEGIN CERTIFICATE-----
MIIDMTCCAhmgAwIBAgIJAMKpjyszxkDpMA0GCSqGSIb3DQEBCwUAMC4xCzAJBgNV
BAYTAkNOMQwwCgYDVQQKDANSUEsxETAPBgNVBAMMCFJQS0RlYnVnMCAXDTE3MDQx
OTAyMzE0OVoYDzIxMTYwMzI2MDIzMTQ5WjAuMQswCQYDVQQGEwJDTjEMMAoGA1UE
CgwDUlBLMREwDwYDVQQDDAhSUEtEZWJ1ZzCCASIwDQYJKoZIhvcNAQEBBQADggEP
ADCCAQoCggEBAK3kPd9jzvTctTIA3XNZVv9cHHDbAc6nTBfdZp9mtPOTkXFpvyCb
kL0QjOog0+1pv8D7dFeP4ptWXU5CT3ImvaPR+16dAtMRcsxEr5q4zieJzx3O6huL
UBa1k+xrzjXpRzkcOysmc8fTxt0tAwbDgJ2AA5TlXLTcVyb7GmJ+hl5CjnhoG5NN
LrkqI7S29c1U3uokj8Q7hzaj0TURu/uB5ZIMCLZY9KFDugqaEcvmUyJiD0fuV6sA
O/4kpiZUOnhV8/xWpRbMI4WFQsfgLOCV+X9uzUa29D677y//46t/EDSuQTHyBZbl
AcNMENkpMWZsH7J/+F19+U0/Hd5bJgneVRkCAwEAAaNQME4wHQYDVR0OBBYEFKDN
SZtt47ttOBDQzIchFYyxsg3mMB8GA1UdIwQYMBaAFKDNSZtt47ttOBDQzIchFYyx
sg3mMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBABaZctNrn4gLmNf/
eNJ3x5CJIPjPwm6j9nwKhtadJ6BF+TIzSkJuHSgxULjW436F37otv94NPzT5PCBF
WxgXoqgLqnWwvsaqC4LUEjsZviWW4CB824YDUquEUVGFLE/U5KTZ7Kh1ceyUk4N8
+mtkXkanWoBBk0OF24lNrAsNLB63yTLr9HxEe75+kmvxf1qVJUGtaOEWIhiFMiAB
5D4w/j2EFWktumjuy5TTwU0zhl52bc8V9SNixM1IaqzNrVPrdjv8viUX548pU3WT
xZ5ylDsxhMC1q4BXQVeIY8C0cMEX+WHOmOCvWrkxCkP91pKsSPkuVrWlzrkn8Ojo
swP6sBw=
-----END CERTIFICATE-----
`
const PRIVATE_PEM = `
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCt5D3fY8703LUy
AN1zWVb/XBxw2wHOp0wX3WafZrTzk5Fxab8gm5C9EIzqINPtab/A+3RXj+KbVl1O
Qk9yJr2j0ftenQLTEXLMRK+auM4nic8dzuobi1AWtZPsa8416Uc5HDsrJnPH08bd
LQMGw4CdgAOU5Vy03Fcm+xpifoZeQo54aBuTTS65KiO0tvXNVN7qJI/EO4c2o9E1
Ebv7geWSDAi2WPShQ7oKmhHL5lMiYg9H7lerADv+JKYmVDp4VfP8VqUWzCOFhULH
4Czglfl/bs1GtvQ+u+8v/+OrfxA0rkEx8gWW5QHDTBDZKTFmbB+yf/hdfflNPx3e
WyYJ3lUZAgMBAAECggEBAJTnCBBdUB+fSs1prjeS/gsmnfgJoY+K9H7PCIxgj3yw
FXAvZAmRDKzJGlF2EOOQlTG0YNiGDj6EAtv7rjoKcINyULSg8IU6wLmn61MrAuUa
fa+Bujgh4E/B5swhOHAztNhzkzsM70Hi17wXSislh+HWd7qteOgqcbqgdOR4gaj+
HUqtcxG3H3hCL3dWugnjLZMtestLKGHSSZvbQNjYM3kKy2LvO8NpxmDE4a+TXygK
qhaZjmS/dc/nJBJzOfkzby58RvGbzlJflfW/Uu3/gizj13GFQKWonq1xh630RAhv
xX5ySok2aAx/+/SiJSpNXvM09grQuoORSr7D1tm+5rECgYEA3vf0hRfua0XAOu6f
pyzNvLRRJ/pEew7XpNPCyS2TuMTd1yvXjGVxQfP46N6x1IM3SRU0zE+LSk80EF7l
u1Or7GyCEhabYNe/7P2F8ENP73Do0HwvcI1jGrgr6r9oK0J27Xei+f6Q0bgJOPI2
qaLj+V37cOjkNSM1mhTjtDwK8k0CgYEAx6cMrkjHl1+lDIIOc3qAEL3jb3xQveYk
WrMF/B+j048k6boU4VvFJAIyQxOxMNxLjw3/9+zXCFJT4WaZK3TMXlg614ASGx3H
tKjJM9O07ywwMq1gbutFS4nHCg3L3Os6esL0SPwMdATR3Yh22n5OGI9o+/aURulL
GPEXef1Z2/0CgYEAgmwp5LxV4vu+8Pnp+4DSq4ISQr861XyeGTUhKEp3sUm+tgFY
KTChakHKpHS3Mqa6bQ5xft08je/8dWL9IHFWDIqAHxKIOsKY6oh1k0/cbyPtmx45
Ja4efV+jmMHzrfJH3KnxdCg7D+GFy4CrBtlYXuJhlO81pft9fC6h7yh8ArUCgYBq
gvkl5Zftbs4rnRq+iqTVyagTKvwcQzIz3PwdZHfO/rfPpUFMdNv4eN99n3zRN0Vs
HSjoiEazntA3GLgwUdBRqLpDi4SdSMbo337vkksdqbJQ5uPiaMuAIBG6kF+pDSkW
ovkWErlGD+gySoI10FozihaVDRhPuFgjB0PiBcIxtQKBgGNSzX+Bx5+ux1Qny0Sn
SUcBtepLnO8M8wafoGNyehbMnLzfuMbaDiJOdozGlBNHZTtPB3r4AYb8WnltdKW0
7i3fk26YZGiMVeUJvewA6/LOBEaqMdwoNwnoptvbR6ehHeE/PPtRtge2cD3bPIM7
U9VlWgfgj9Dxfwhslqb9hmyp
-----END PRIVATE KEY-----
`
module.exports = class QuickAppPlugin {
  constructor(options) {
    let {
      cmlType,
      media
    } = options;
    this.webpackRules = []; // webpack的rules设置  用于当前端特殊文件处理
    this.moduleRules = []; // 文件后缀对应的节点moduleType
    this.logLevel = 3;
    this.originComponentExtList = [".ux"]; // 用于扩展原生组件的文件后缀查找
    this.runtimeNpmName = "cml-quickapp-runtime";
    this.runtimeNeedComponents = false;
    this.cmlType = cmlType;
    this.media = media;
    this.miniappExt = {
      // 小程序原生组件处理
      rule: /\.ux$/,
      mapping: {
        template: ".ux",
        style: ".css",
      }
    };
    // 需要压缩文件的后缀
    this.minimizeExt = {
      js: [".js"],
      css: [".css"]
    };
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
      currentNode.output = templateParser(currentNode.source);
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
      // 遍历编译图的节点，进行各项目的拼接
      let hasCompiledNode = [];

      let bootstrapCode = compiler.amd.getModuleBootstrap();
      compiler.writeFile("/static/js/manifest.js", bootstrapCode);
      let commonjsContent = `var manifest = require('./manifest.js');\n`;
      commonjsContent += `var cmldefine = manifest.cmldefine;\n`;
      // 遍历节点
      outputNode(projectGraph);
      compiler.writeFile("/static/js/common.js", commonjsContent);

      function outputNode(currentNode) {
        if (~hasCompiledNode.indexOf(currentNode)) {
          return;
        }
        hasCompiledNode.push(currentNode);

        if (currentNode.nodeType === "app") {
          const uxPath = "/app.ux";
          let uxContent = `<script>
          /**
          * 应用级别的配置，供所有页面公用
          */
          import util from './util'
          
          export default {}
          </script>`;
          const manifestPath = "/manifest.json";
          let manifestContent = `{
            "package": "${pkg.name.split("-").join(".")}",
            "name": "${pkg.name}",
            "versionName": "${pkg.version}",
            "versionCode": "1",
            "minPlatformVersion": "1020",
            "icon": "/static/img/chameleon_83ee00e.png",
            "features": [
              { "name": "system.prompt" },
              { "name": "system.router" },
              { "name": "system.shortcut" }
            ],
            "permissions": [
              { "origin": "*" }
            ],
            "config": {
              "logLevel": "debug"
            },
            "router": {
              "entry": "index",
              "pages": {
                "index": {
                  "component": "index"
                }
              },
              "widgets": {}
            },
            "display": {}
          }`;
          const utilPath = '/util.js';
          let uitlContent = `module.exports = {}`;

          
          // app.ux is an entry file whose content is an export object
          compiler.writeFile(uxPath, uxContent);

          // manifest.json lack some dynamic mappings of cml configuration
          compiler.writeFile(manifestPath, manifestContent);
          
          // util.js is optional, only for common multi pages api
          compiler.writeFile(utilPath, uitlContent);

          compiler.writeFile('/sign/debug/certificate.pem', CERTIFICATE_PEM);
          compiler.writeFile('/sign/debug/private.pem', PRIVATE_PEM)

          /* currentNode.childrens.forEach(item => {
            if (["template", "style"].indexOf(item.moduleType) > -1) {
              uxContent += `<${item.moduleType}>${item.output}</${
                item.moduleType
                }>`;
            } else if (item.moduleType === 'script') {
              uxContent += `<script>${item.originSource}</script>`
            }
            outputNode(item);
          }); */

        }

        if (~["page", "component"].indexOf(currentNode.nodeType)) {
          let uxContent = ''
          let destPath = ''
          currentNode.childrens.forEach(item => {
            let entryName = cmlUtils.getPureEntryName(
              item.realPath,
              self.cmlType,
              cml.projectRoot
            );
            destPath = entryName.split(`${currentNode.nodeType}s/`)[1]
            
            if (["template", "style"].indexOf(item.moduleType) > -1) {
              uxContent += `<${item.moduleType}>${item.output}</${
                item.moduleType
                }>`;
            } else if (item.moduleType === "script") {
              let relativePath;
              let pureResourcePath = cmlUtils.delQueryPath(item.realPath);


              if (~pureResourcePath.indexOf("node_modules")) {
                relativePath = path.relative(
                  pureResourcePath,
                  path.join(cml.projectRoot, "node_modules")
                );
              } else {
                relativePath = path.relative(
                  pureResourcePath,
                  path.join(cml.projectRoot, "src")
                );
                if (relativePath == ".." || relativePath == ".") {
                  relativePath = "";
                } else {
                  relativePath = relativePath.slice(3);
                }
              }
              relativePath = cmlUtils.handleWinPath(relativePath);

              let jsFileName = cmlUtils.getEntryPath(
                pureResourcePath,
                cml.projectRoot
              );
              jsFileName = cmlUtils.handleWinPath(jsFileName);
              let array = jsFileName.split("/");
              let basename = array[array.length - 1].split(".")[0] + ".js";
              jsFileName = [].concat(array.slice(0, -1), basename).join("/");
              let content = `var manifest = require('${relativePath}/static/js/manifest.js');\n`;
              content += `var cmldefine = manifest.cmldefine;\n`;
              content += `var cmlrequire = manifest.cmlrequire;\n`;
              content += `require('${relativePath}/static/js/common.js');\n`;
              content += `cmlrequire('${item.modId}');\n`;
              uxContent += `<script>${content}</script>`
            }
            outputNode(item);
          });
          compiler.writeFile(`/src/${destPath}.ux`, uxContent);
        }

        if (
          currentNode.nodeType === "module" &&
          ~["script", "asset"].indexOf(currentNode.moduleType)
        ) {
          // commonjsContent += currentNode.output;
        }

        currentNode.dependencies.forEach(item => {
          outputNode(item);
        });
      }
    });
  }
};
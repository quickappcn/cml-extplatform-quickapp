# 仓库说明
本仓库是基于[chameleon扩展新端标准](https://cml.js.org/doc/extend/extend.html)进行快应用开发。
排期：https://github.com/didi/chameleon/issues/185

### 运行项目
- 首先全局安装支持扩展新端的脚手架`npm i chameleon-tool@0.4.0-mvvm.12 -g`。
- 全局安装`lerna` 对本项目进行管理 `npm i lerna -g`。
- 在本仓库根目录执行`lerna bootstrap`，安装外部依赖与建立本仓库npm包之间的依赖。
- 在`cml-quickapp-project`目录执行`cml quickapp dev`, 将会生成`cml-tt-project/dist/quickapp`目录。

### 如何开发测试

fork该仓库，修改后提pull request。

运行项目时执行了`lerna bootstrap`，`cml-quickapp-project`的node_modules下的依赖的开发npm包会符号链接到packages下的同名文件夹，所以直接在`packages`下开发，`cml-quickapp-project`即可生效。

## ui组件问题汇总

### 快应用平台问题
1. computed必须1050才支持
2. 文件名和组件名不能一样，会循环加载
3. createanimal不可用，暂时先注释掉动画，等后续进展再决定是否自己使用css实现动画

遗留问题
1. computed 转换cpx到px存在问题 !!!
2. 动画支持无法动态修改起止状态（等快应用方修复优化）
3. getRect无效，无法计算mask,需要讨论下是否需要全屏处理
4. page内部必须嵌套view，否则style会失效

### c-picker
1. c-picker 需要支持defaultIndex(cici)，itemStyle(cici)
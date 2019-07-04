const cmlUtils = require('chameleon-tool-utils');

let content = `
<import name="com1" src="../age"></import>
<import name="com1" src="../age"></import>
<template>
  <div class="scroller-wrap">
    <div><text>chameleon</text></div>
    <demo-com></demo-com>
    <div class="class1"></div>
  </div>

</template>
`
let parts = cmlUtils.splitParts({content});
let imports = [];
parts.customBlocks.forEach(item=>{
  if(item.type === 'import') {
    imports.push(item)
  }
 })
console.log(imports)
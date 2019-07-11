module.exports = function(context) {
    let { tagName, node } = context;
    // origin-tag原生组件替换
    if(/^origin\-/.test(tagName)) {
      let newtagName = tagName.replace(/^origin\-/,'');
      node.openingElement.name.name = newtagName;
      node.closingElement.name.name = newtagName;
    }
    // 部分组件替换
    if(tagName === 'cover-view' || tagName === 'view') {
      let newtagName = 'div';
      node.openingElement.name.name = newtagName;
      node.closingElement.name.name = newtagName;
    }
    if(tagName === 'cell') {
      let newtagName = 'list-item';
      node.openingElement.name.name = newtagName;
      node.closingElement.name.name = newtagName;
    }
    if(tagName === 'carousel') {
      let newtagName = 'swiper';
      node.openingElement.name.name = newtagName;
      node.closingElement.name.name = newtagName;
    }
    if(tagName === 'carousel-item') {
      let newtagName = 'div';
      node.openingElement.name.name = newtagName;
      node.closingElement.name.name = newtagName;
    }
  }
const { types: t } = require('mvvm-template-parser');

module.exports = function(context) {
  let { options, attributes, tagName } = context;
  let classNodes = attributes.filter((attr) => attr.name.name === 'class');
  let isUsingComponents = (options.usingComponents || []).find((comp) => comp.tagName === tagName);
  let extraClass = isUsingComponents ? ` cml-view cml-${tagName}` : ` cml-base cml-${tagName}`;

  if (classNodes.length === 0) {
    attributes.push(t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral(extraClass)));
  } else if (classNodes.length === 1) {
    classNodes.forEach((itemNode) => {
      const dealedClassNodeValue = `${itemNode.value.value} ${extraClass}`
      // const dealedClassNodeValue = `${itemNode.value.value}`
      itemNode.value.value = dealedClassNodeValue;
    })
  } else {
    throw new Error(`Only allow one class node in element's attribute with cml syntax`);
  }
}

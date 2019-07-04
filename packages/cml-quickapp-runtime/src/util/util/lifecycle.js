import Config from "../config";
// polyhooks 不同端差异化hooks
/**
 * hooks: all hooks
 * hooksMap: {
 *  [cmlHook]: clientHook
 * },
 * usedHooks: used by hooksMap
 * polyHooks: client hook
 */
const LIFECYCLE = {
  quickapp: {
    // https://developer.toutiao.com/docs/framework/startupApp.html#app
    app: {
      hooks: ["onCreate", "onDestroy"],
      hooksMap: {
        beforeCreate: "onCreate",
        created: "onCreate",
        beforeMount: "onCreate",
        mounted: "onCreate",
        beforeDestroy: "onCreate",
        destroyed: "onDestroy"
      },
      usedHooks: ["onCreate", "onDestroy"],
      polyHooks: []
    },
    // https://developer.toutiao.com/docs/framework/startupPage.html#%E5%90%AF%E5%8A%A8%E9%A1%B5%E9%9D%A2
    page: {
      hooks: ["onInit", "onReady", "onShow", "onHide", "onDestroy", "onBackPress", "onMenuPress"],
      hooksMap: {
        beforeCreate: "onInit",
        created: "onInit",
        beforeMount: "onInit",
        mounted: "onReady",
        beforeDestroy: "onHide",
        destroyed: "onDestroy"
      },
      usedHooks: ["onInit", "onReady", "onShow", "onHide", "onDestroy"],
      polyHooks: ["onBackPress", "onMenuPress"]
    },
    // https://developer.toutiao.com/docs/framework/custom_component_constructor.html
    component: {
      hooks: ["onCreate", "onInit", "onReady", "onDestroy"],
      hooksMap: {
        beforeCreate: "onCreate",
        created: "onCreate",
        beforeMount: "onCreate",
        mounted: "onReady",
        beforeDestroy: "onInit",
        destroyed: "onDestroy"
      },
      usedHooks: ["onInit", "onReady", "onCreate", "onDestroy"],
      polyHooks: []
    }   
  },
  cml: {
    hooks: [
      'beforeCreate',
      'created',
      'beforeMount',
      'mounted',
      'beforeUpdate',
      'updated',
      'beforeDestroy',
      'destroyed',
      'onShow',
      'onHide'
    ]
  }
};

export default new Config(LIFECYCLE);

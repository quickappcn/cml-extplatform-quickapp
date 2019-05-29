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
    // https://developer.toutiao.com/docs/framework/startupPage.html#%E5%90%AF%E5%8A%A8%E9%A1%B5%E9%9D%A2
    page: {
      hooks: [
        "onLoad",
        "onShow",
        "onReady",
        "onHide",
        "onUnload",
        "onPullDownRefresh",
        "onReachBottom",
        "onShareAppMessage",
        "onPageScroll",
        "onTabItemTap"
      ],
      hooksMap: {
        beforeCreate: "onLoad",
        created: "onLoad",
        beforeMount: "onLoad",
        mounted: "onReady",
        beforeDestroy: "onUnload",
        destroyed: "onUnload",
        onShow: "onShow",
        onHide: "onHide"
      },
      usedHooks: ["onLoad", "onReady", "onShow", "onHide", "onUnload"],
      polyHooks: [
        "onPullDownRefresh",
        "onReachBottom",
        "onShareAppMessage",
        "onPageScroll",
        "onTabItemTap"
      ]
    },
    // https://developer.toutiao.com/docs/framework/custom_component_constructor.html
    component: {
      hooks: ["created", "attached", "ready", "detached", "moved"],
      hooksMap: {
        beforeCreate: "created",
        created: "attached",
        beforeMount: "attached",
        mounted: "ready",
        beforeDestroy: "detached",
        destroyed: "detached"
      },
      usedHooks: ["created", "attached", "ready", "detached"],
      polyHooks: ["moved"]
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

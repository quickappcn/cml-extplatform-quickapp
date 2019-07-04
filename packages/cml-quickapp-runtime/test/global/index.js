global.quickapp = {
    quickappPage: {
      title: '',
      closed: false
    },
    app: {
      opened: false
    }
  };
  global.quickapp.getSystemInfo = function (params) {
    params.success({
      system: 'ios',
      windowWidth: 375,
      windowHeight: 667,
    });
  }
  global.quickapp.getSystemInfoSync = function (params) {
    return {
      windowWidth: 375
    }
  }
  global.quickapp.getUserInfo = function (params) {
    params.success({
      uid: 123456
    });
  }
  global.quickapp.getLocation = function (params) {
    params.success({
      latitude: 123456,
      longitude: 123456
    });
  }
  global.quickapp.getLaunchOptionsSync = function (params) {
    return {
      path: '',
      query: {
        name: 'cml'
      }
    }
  }
  
  global.quickapp.chooseImage = function (params) {
    params.success({
      tempFilePaths: ['filepath']
    });
  }
  
  global.quickapp._clipboardData = '';
  global.quickapp.setClipboardData = function (params) {
    global.quickapp._clipboardData = params.data;
    params.success();
  }
  global.quickapp.getClipboardData = function (params) {
    params.success({
      data: global.quickapp._clipboardData
    });
  }
  
  global.quickapp._storage = {};
  global.quickapp.setStorageSync = function (key, value) {
    global.quickapp._storage[key] = value;
  }
  
  global.quickapp.getStorageSync = function (key) {
    return global.quickapp._storage[key];
  }
  
  global.quickapp.setNavigationBarTitle = function (params) {
    global.quickapp.quickappPage.title = params.title;
  }
  
  global.quickapp.navigateBack = function (params) {
    global.quickapp.quickappPage.closed = true;
  }
  
  global.quickapp.navigateToMiniProgram = function (params) {
    global.quickapp.app.opened = true;
  }
  
  global.quickapp.request = function (params) {
    var fromData = queryParse(params.data);
    var fromDataLength = Object.keys(fromData).length;
    var res = {
      errno: "0"
    }
    if (fromDataLength) {
      res = fromData;
    }
    params.success({
      statusCode: 200,
      header: {},
      data: res
    })
  }
  global.quickapp.createSelectorQuery = function (params) {
    return {
      in: function () {
        return {
          exec: function (cb) {
            cb([{
              width: 100,
              height: 100,
              left: 100,
              top: 100,
              right: 100,
              bottom: 100
            }])
          },
          select: function () {
            return {
              boundingClientRect: function () {
  
              }
            }
          },
          selectAll: function() {
            return {
              boundingClientRect: function () {
  
              }
            }
          }
        }
      }
    }
  }
  
  function queryParse(search = '') {
    let arr = search.split(/(\?|&)/);
    let parmsObj = {};
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].indexOf('=') !== -1) {
        let keyValue = arr[i].match(/([^=]*)=(.*)/);
        parmsObj[keyValue[1]] = keyValue[2];
      }
    }
    return parmsObj;
  }
  
  global.__CML__GLOBAL = {
    App(options) {
      return {
        setData() {}
      }
    },
    Page(options) {
      return {
        setData() {}
      }
    },
    Component(options) {
      return {
        setData() {}
      }
    }
  }
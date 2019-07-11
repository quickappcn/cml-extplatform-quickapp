const mixins = require('../index').mixins.methods;


let e = {
  type: 'touchstart',
  currentTarget: {
    dataset: {
      eventtouchstart: ['handleTouchStart']
    }
  }
}
let thisArg = {
  handleTouchStart: function() {

  }
}
mixins._cmlEventProxy.call(thisArg, e)

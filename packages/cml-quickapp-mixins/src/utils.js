const _ = module.exports = {};

_.getStyleKeyValue = function(declaration) {
  let colonIndex = declaration.indexOf(':');
  let key = declaration.slice(0, colonIndex);
  let value = declaration.slice(colonIndex + 1);
  return {
    key, value
  }
}

_.handleCompEventType = function(eventType) {
  let aliEventMap = {
    touchstart: 'touchStart',
    touchend: 'touchEnd',
    touchmove: 'touchMove'
  }
  if (Object.keys(aliEventMap).includes(eventType)) {
    return aliEventMap[eventType]
  } else {
    return eventType
  }
}

_.getNewEvent = function (e) {
  let newEvent = {};
  ['type', 'timeStamp', 'target', 'currentTarget', 'detail', 'touches', 'changedTouches'].forEach((key) => {
    if (e[key]) {
      if (~['target', 'currentTarget'].indexOf(key)) {
        let newTarget = {}
        newTarget = {
          id: e[key].id,
          dataset: e[key].dataset
        }
        newEvent[key] = newTarget
      } else {
        newEvent[key] = e[key]
      }
    }
  })

  newEvent._originEvent = e;
  return newEvent;
}


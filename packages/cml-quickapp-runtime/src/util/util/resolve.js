import { merge, extend } from './util'
import { type } from './type'

export function mergeDefault(parent, child, key) {
  if (parent[key]) {
    if (Array.isArray(parent[key])){
      if (Array.isArray(child[key])){
        parent[key] = parent[key].concat(child[key])
      }
      else {
        parent[key] = parent[key].concat([child[key]])
      }
    }
    else {
      parent[key] = [parent[key]]
      if (Array.isArray(child[key])){
        parent[key] = parent[key].concat(child[key])
      }
      else {
        parent[key] = parent[key].concat([child[key]])
      }
    }
  }
  else {
    parent[key] = child[key]
  }
}

export function mergeSimpleProps(parent, child, key) {
  let parentVal = parent[key]
  const childVal = child[key]
  if (!parentVal) {
    parent[key] = parentVal = {}
  }
  if (key !== 'methods') {
    extend(parentVal, childVal)
  } else {
    extend(parent, childVal)
  }
}

export function mergeData(parent, child, key) {
  const childVal = child[key]
  if (!parent[key]) {
    parent[key] = {}
  }
  merge(parent[key], childVal)
}

export function mergeWatch(parent, child, key) {
  let parentVal = parent[key]
  const childVal = child[key]
  const ret = []
  if (!parentVal) {
    parent[key] = parentVal = {}
  }
  Object.keys(childVal).forEach(key => {
    if (key in parentVal) {
      parentVal[key] = type(parentVal[key]) !== 'Array'
        ? [parentVal[key], childVal[key]]
        : parentVal[key].concat([childVal[key]])
    } else {
      parentVal[key] = childVal[key]
    }
  })
}



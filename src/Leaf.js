import keysIn from 'lodash/object/keysIn'
import isObject from 'lodash/lang/isObject'
import isArray from 'lodash/lang/isArray'
import _isFinite from 'lodash/lang/isFinite'
import includes from 'lodash/collection/includes'
import Connect from './Connect'
import Item from './Item'
import React from 'react'

export default class Leaf {
  constructor(path, root, idx, parentLeaf) {
    this.childLeafs = []
    this.root = root
    this.idx = idx
    this.parentLeaf = parentLeaf

    this.setup(path)
  }

  setup(nextPath) {
    this.path = nextPath
    this.connect = new Connect(
      nextPath,
      this.update,
      this.delete,
      () => this.root.reportChange()
    )
    var nextSettings = this.root.getSettings(nextPath)
    var settingsChanged = !this.root.matchSettings(nextSettings, this.settings)

    if (settingsChanged) {
      this.settings = nextSettings
    }
    else {
      //children aren't really tested for matching because child leafs will do
      //that and this leaf only care about the count of the them
      //so the next children have to be taken no matter what
      this.settings.children = nextSettings.children
    }

    var childCountChanged = this.setupChildren()

    if (childCountChanged || settingsChanged) {
      if (this.onUpdate) {
        this.onUpdate()
      }
    }
  }

  setupChildren() {
    var {settings, childLeafs, path} = this
    var value = this.path[this.path.length - 1]
    var children
    var childCountChanged = false

    if (settings.children !== undefined) {
      children = settings.children
    }
    else if (isObject(value)) {
      children = value
    }
    else {
      children = []
    }

    var keys
    if (isArray(children)) {
      keys = Object.keys(children)
    }
    else if (isObject(children)) {
      keys = getKeysInOrder(children, settings)
      keys = applyWhiteAndBlacklist(keys, settings)
    }
    else {
      keys = []
    }

    if (childLeafs.length > keys.length) {
      // let extraLeafs =
      childLeafs.splice(keys.length)
      // extraLeafs.forEach(childLeaf => childLeaf.dispose())
      childCountChanged = true
    }

    keys.forEach((key, idx) => {
      var childPath = path.concat([key, children[key]])

      if (childLeafs[idx]) {
        childLeafs[idx].setup(childPath)
      }
      else {
        childLeafs[idx] = new Leaf(childPath, this.root, idx, this)
        childCountChanged = true
      }
    })

    return childCountChanged
  }

  update = (value) => {
    var {connect, parentLeaf, settings, root} = this

    if (parentLeaf && parentLeaf.settings.children) {
      //if the children of the parentLeaf set by the settings modify there
      parentLeaf.settings.children[connect.key] = value
    }
    else {
      connect.parent[connect.key] = value
    }

    root.reportChange()
    this._callOnChangeHandler()
  }

  delete = () => {
    var {connect, parentLeaf, settings, root} = this

    if (parentLeaf && parentLeaf.settings.children) {
      //if the children of the parentLeaf set by the settings modify there
      delete parentLeaf.settings.children[connect.key]
    }
    else {
      delete connect.parent[connect.key]
    }

    root.reportChange()
    this._callOnChangeHandler()
  }

  _callOnChangeHandler(value) {
    var {settings, connect} = this

    var onChange = settings.input && settings.input.onChange
    if (typeof onChange === 'function') {
      onChange(value, connect)
    }
  }

  acceptDrop(payload, dropPosition) {
    var {connect, idx, settings, parentLeaf} = this
    var taken = false
    var userHandled = false
    var dragSourceConnect

    if (payload instanceof Connect) {
      dragSourceConnect = payload
    }

    if (dropPosition === 'before' || dropPosition === 'after') {
      if (settings.acceptDropAround) {
        taken = settings.acceptDropAround(
          payload, connect, parentLeaf.connect, dropPosition)

        userHandled = true
      }
      else if (parentLeaf) {
        let parentDropPosition = idx
        if (dropPosition === 'after') {
          ++parentDropPosition
        }
        //return the dropResult of the parentLeaf
        return parentLeaf.acceptDrop(payload, parentDropPosition)
      }
    }
    else if (dropPosition === 'in' || _isFinite(dropPosition)) {
      if (settings.acceptDrop) {
        //acceptDrop should returns true if it takes the dragSource
        taken = settings.acceptDrop(payload, connect, dropPosition)
        userHandled = true
      }
      else if (dragSourceConnect) {
        if (isArray(connect.value)) {
          this.connect.value.splice(dropPosition, 0, dragSourceConnect.value)
          taken = true
        }
        else if (typeof connect.value === 'object') {
          connect.value[dragSourceConnect.key] = dragSourceConnect.value
          taken = true
        }
        else {
          connect.value = dragSourceConnect.value
          taken = true
        }
      }
    }

    return {taken, userHandled}
  }

  canDrop(payload, dropPosition) {
    var {connect, idx, settings, parentLeaf} = this
    var canDrop = true

    if (dropPosition === 'before' || dropPosition === 'after') {
      if (settings.canDropAround) {
        canDrop = settings.canDropAround(
          payload, connect, parentLeaf.connect, dropPosition)
      }
      else if (parentLeaf) {
        let parentDropPosition = idx
        if (dropPosition === 'after') {
          ++parentDropPosition
        }
        canDrop = parentLeaf.canDrop(payload, parentDropPosition)
      }
    }
    else if (dropPosition === 'in' || _isFinite(dropPosition)) {
      if (settings.canDrop) {
        canDrop = settings.canDrop(payload, connect, dropPosition)
      }
    }

    return canDrop
  }

  getComponent() {
    if (!this._component) {//hack until React@0.14
      this._component = <Item key={this.idx} leaf={this}/>
    }
    return this._component
  }
}

function getKeysInOrder(children, settings) {
  var {order, includeInheriteds} = settings
  var keys = includeInheriteds ? keysIn(children) : Object.keys(children)

  if (!order) {
    return keys
  }

  let l = keys.length - 1
  return keys.sort((a, b) => {
    var aIdx = order.indexOf(a)
    var bIdx = order.indexOf(b)

    if (aIdx !== -1) aIdx = l - aIdx
    if (bIdx !== -1) bIdx = l - bIdx

    return bIdx - aIdx
  })
}

function applyWhiteAndBlacklist(keys, settings) {
  var {whitelist, blacklist} = settings

  if (!whitelist && !blacklist) {
    return keys
  }

  return keys.filter((key) => {
    if (whitelist && !includes(whitelist, key)) return false
    if (blacklist && includes(blacklist, key)) return false
    return true
  })
}

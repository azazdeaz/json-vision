import has from 'lodash/object/has';
import keysIn from 'lodash/object/keysIn';
import isObject from 'lodash/lang/isObject';
import isArray from 'lodash/lang/isArray';
import _isFinite from 'lodash/lang/isFinite';
import isPlainObject from 'lodash/lang/isPlainObject';
import includes from 'lodash/collection/includes';
import matchSettings from './matchSettings';
import React from 'react';
import Item from './Item';

export default class Leaf {
  constructor(path, root, idx, parentLeaf) {
    this.childLeafs = [];
    this.root = root;
    this.idx = idx;
    this.parentLeaf = parentLeaf;

    this.setup(path);
  }

  setup(nextPath) {
    this.path = nextPath;
    this.utils = this.root.createUtils(nextPath);
    var nextSettings = this.root.getSettings(nextPath);

    if (!matchSettings(nextSettings, this.settings)) {
      this.settings = nextSettings;

      if (this.onUpdate) {
        this.onUpdate();
      }
    }

    this.setupChildren();
  }

  setupChildren() {
    var {settings, childLeafs, path} = this;
    var value = this.path[this.path.length - 1];
    var children;
    var childCountChanged = false;

    if (has(settings, 'children')) {
      children = settings.children;
    }
    else if (isObject(value)) {
      children = value;
    }
    else {
      children = [];
    }

    var keys = getKeysInOrder(children, settings);
    keys = applyWhiteAndBlacklist(keys, settings);

    if (childLeafs.length > keys.length) {
      let extraLeafs = childLeafs.splice(keys.length);
      // extraLeafs.forEach(childLeaf => childLeaf.dispose());
      childCountChanged = true;
    }

    keys.forEach((key, idx) => {
      var childPath = path.concat([key, children[key]]);

      if (childLeafs[idx]) {
        childLeafs[idx].setup(childPath);
      }
      else {
        childLeafs[idx] = new Leaf(childPath, this.root, idx, this);
        childCountChanged = true;
      }
    });

    if (childCountChanged && this.onUpdate) {
      this.onUpdate();
    }
  }

  update(value, utils) {
    utils.value = value;

    var {settings} = this;
    var onChange = settings.input && settings.input.onChange;
    if (typeof onChange === 'function') {
      onChange(value, utils);
    }
  }

  acceptDrop(dragSourceConnect, dropPosition) {
    var {root, utils, idx, settings, parentLeaf} = this;

    if (dropPosition === 'before' || dropPosition === 'after') {
      if (settings.acceptDropAround) {
        return settings.acceptDropAround(
          dragSourceConnect, utils, parentLeaf.utils, dropPosition);
      }

      if (parentLeaf) {
        let parentDropPosition = idx;
        if (dropPosition === 'after') {
          ++parentDropPosition;
        }
        return parentLeaf.acceptDrop(dragSourceConnect, parentDropPosition);
      }
    }
    else if (dropPosition === 'in' || _isFinite(dropPosition)) {
      if (settings.acceptDrop) {
        //acceptDrop should returns true if it takes the dragSource
        return settings.acceptDrop(dragSourceConnect, utils, dropPosition);
      }

      if (isArray(utils.value)) {
        this.utils.value.splice(dropPosition, 0, dragSourceConnect.value);
        return true;
      }

      if (typeof utils.value === 'object') {
        utils.value[dragSourceConnect.key] = dragSourceConnect.value;
        return true;
      }

      utils.value = dragSourceConnect.value;
      return true;
    }
  }

  getComponent() {
    if (!this._component) {//hack until React@0.14
      this._component = <Item key={this.idx} leaf={this}/>;
    }
    return this._component;
  }

  // dispose() {
  //
  // }
}

function getKeysInOrder(children, settings) {
  var {order, includeInheriteds} = settings;

  var keys = settings.includeInheriteds ?
    keysIn(children) : Object.keys(children);

  if (!order || !isPlainObject(children)) {
    return keys;
  }

  let l = keys.length - 1;
  return keys.sort((a, b) => {
    var aIdx = order.indexOf(a);
    var bIdx = order.indexOf(b);

    if (aIdx !== -1) aIdx = l - aIdx;
    if (bIdx !== -1) bIdx = l - bIdx;

    return bIdx - aIdx;
  });
}

function applyWhiteAndBlacklist(keys, settings) {
  var {whitelist, blacklist} = settings;

  if (!whitelist && !blacklist) {
    return keys;
  }

  return keys.filter((key) => {
    if (whitelist && !includes(whitelist, key)) return false;
    if (blacklist && includes(blacklist, key)) return false;
    return true;
  });
}

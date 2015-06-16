import has from 'lodash/object/has';
import keysIn from 'lodash/object/keysIn';
import isObject from 'lodash/lang/isObject';
import isPlainObject from 'lodash/lang/isPlainObject';
import includes from 'lodash/collection/includes';
import matchSettings from './matchSettings';
import React from 'react';
import Item from './Item';

export default class Leaf {
  constructor(path, root, idx) {
    this.childLeafs = [];
    this.root = root;
    this.idx = idx;

    this.setup(path);
    this.component = <Item key={idx} leaf={this}/>;
  }

  setup(nextPath) {
    this.path = nextPath;
    this.utils = this.root.createUtils(nextPath);
    var nextSettings = this.root.getSettings(nextPath);

    if (!matchSettings(nextSettings, this.settings)) {
      this.settings = nextSettings;

      if (this.onSettingsChange) {
        this.onSettingsChange();
      }
    }

    this.setupChildren();
  }

  setupChildren() {
    var {settings, childLeafs, path} = this;
    var value = this.path[this.path.length - 1];
    var children;

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
      extraLeafs.forEach(childLeaf => childLeaf.dispose());
    }

    keys.forEach((key, idx) => {
      var childPath = path.concat([key, children[key]]);

      if (childLeafs[idx]) {
        childLeafs[idx].setup(childPath);
      }
      else {
        childLeafs[idx] = new Leaf(childPath, this.root, idx);
      }
    });
  }

  update(value, utils) {
    utils.value = value;

    var {settings} = this;
    var onChange = settings.input && settings.input.onChange;
    if (typeof onChange === 'function') {
      onChange(value, utils);
    }
  }

  getComponent() {
    return this.component;
  }
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

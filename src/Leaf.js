import has from 'lodash/object/has';
import keysIn from 'lodash/object/keysIn';
import isObject from 'lodash/lang/isObject';
import includes from 'lodash/collection/includes';
import getSettings from './getSettings';
import settingsMatch from './settingsMatch';

export default class Leaf {
  constructor(path, root) {
    this.childLeafs = [];
    this.root = root;

    this.setup(path);
    this.component = <Item leaf={this}/>;
  }

  setup(nextPath) {
    this.path = nextPath;
    var nextSettings = getSettings(this.path);


    if (settingsMatch(nextSettings, this.settings)) {
      this.settings = nextSettings;

      if (this.onSettingsChange) {
        this.onSettingsChange();
      }
    }
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

    children = applyOrder(children, settings);
    children = applyWhiteAndBlacklist(children, settings);

    if (children.length > childLeafs.length) {
      let extraLeafs = childLeafs.splice(children.length);
      extraLeafs.forEach(childLeaf => childLeaf.dispose());
    }

    var idx = 0;
    children.forEach((_value, _key) => {
      var childPath = path.concat([_key, _value]);

      if (childLeafs[idx]) {
        childLeafs[idx].setup(childPath);
      }
      else {
        childLeafs[idx] = new Leaf(childPath, this.root);
      }

      ++idx;
    });
  }

  getComponent() {
    return this.component;
  }
}

function applyOrder(children, settings) {
  var {order, includeInheriteds} = settings;

  var keys = settings.includeInheriteds ?
    keysIn(children) : Object.keys(children);

  if (order) {
    let l = keys.length - 1;
    keys = keys.sort((a, b) => {
      var aIdx = order.indexOf(a);
      var bIdx = order.indexOf(b);

      if (aIdx !== -1) aIdx = l - aIdx;
      if (bIdx !== -1) bIdx = l - bIdx;

      return bIdx - aIdx;
    });
  }
}

function applyWhiteAndBlacklist(children, settings) {
  var {whitelist, blacklist} = settings;

  return children.filter((child, key) => {
    if (whitelist && !includes(whitelist, key)) return false;
    if (blacklist && includes(blacklist, key)) return false;
    return true;
  });
}

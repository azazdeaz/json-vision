var mapValues = require('lodash/object/mapValues');
var includes = require('lodash/collection/includes');
var forEach = require('lodash/collection/forEach');
var isArray = require('lodash/lang/isArray');
var clone = require('lodash/lang/clone');
var minimatch = require('minimatch');
var Contact = require('./Contact')

export default function getSettings(path) {
// var __t = window.performance.now()
  var utils = new Contact(path);
  var settings = {
    input: {
      value: utils.value
    },
    label: utils.key
  };

  checkSettingsList(this.props.settings, []);
  // window.GET_SETTINGSTIME = window.GET_SETTINGSTIME || 0;
  // window.GET_SETTINGSTIME += window.performance.now() - __t;
  return settings;

  function checkSettingsNode(settingsNode, path, preselectors) {
    var match, selector, selectorType;
    var utils = new Contact(path);

    if (!settingsNode.selector) {
      return true;
    }

    if (typeof(settingsNode.selector) === 'function') {

      selectorType = 'function';
      selector = settingsNode.selector;
    }
    else if (typeof(settingsNode.selector) === 'object') {

      selectorType = Object.keys(settingsNode.selector)[0];
      selector = settingsNode.selector[selectorType];
    }
    else {
      throw Error();
    }


    if (selectorType === 'function') {

      match = selector(utils);
    }
    else if (selectorType === 'instanceOf') {

      if (isArray(selector)) {
        match = selector.some(s => utils.value instanceof s);
      }
      else {
        match = utils.value instanceof selector;
      }
    }
    else if (selectorType === 'key') {

      if (isArray(selector)) {
        match = includes(selector, utils.key);
      }
      else {
        match = utils.key === selector;
      }
    }
    else if (selectorType === 'value') {

      match = utils.value === selector;
    }
    else if (selectorType === 'path') {
    }
    else if (selectorType === 'regexp') {
    }
    else if (selectorType === 'glob') {

      match = minimatch(utils.fullPath, selector);
    }
    else {
      throw Error();
    }

    if (match) {

      if (preselectors.length === 0) {
        return true;
      }
      else {

        let newSettingsNode = preselectors[0];
        let newPath = path.slice(0, path.length - 2);
        let newPreselectors = preselectors.slice(1);

        return checkSettingsNode(
          newSettingsNode, newPath, newPreselectors);
      }
    }
  }

  function checkSettingsList(settingsList, preselectors) {

    settingsList.forEach(settingsNode => {

      if (typeof settingsNode === 'function') {
        settingsNode = settingsNode(utils);
      }

      if (typeof settingsNode !== 'object') {
        return;
      }

      if (checkSettingsNode(settingsNode, path, preselectors)) {

        forEach(settingsNode, (value, key) => {

          value = compute(value, key);

          if (key === 'extraInputs' || key === 'buttons') {

            let copy = value.map((val, idx) => {

              var itemValue = compute(val, idx);

              return computeObjectValues(itemValue);
            });

            let curr = settings[key];
            if (curr) {
              curr.push(...copy);
            }
            else {
              settings[key] = copy;
            }
          }
          else if (key === 'input') {
            settings[key] = computeObjectValues(value);
          }
          else if (value !== undefined) {
            settings[key] = value;
          }
        });
      }

      if (settingsNode.settings) {

        let newPreselectors = [settingsNode].concat(preselectors);
        checkSettingsList(settingsNode.settings, newPreselectors);
      }
    });
  }

  function computeObjectValues(obj) {
    return mapValues(obj, (val, key) => compute(val, key));
  }

  function compute(value, key) {

    var type = typeof(value);

    if (type === 'function' &&
      ['onClick', 'onChange', 'chooseType', 'Component',
        'canDrop', 'acceptDrop', 'getDragPreview'].indexOf(key) === -1)
    {
      return value(utils);
    }
    else if (type === 'object') {
      return clone(value);
    }
    else {
      return value;
    }
  }
}


/**Settings Node
{
  selector: {key, value, function, instanceof, glob, path, regex, }
  children: [],
  highlighted: true,
  label: 'Prop',
  labelStyle: {color: style.palette.red}
  draggable: true,
  whitelist: ['foo', 'bar'],
  blacklist: ['qux', 'baz'],
  order: ['tux', 'baz'],
  onClick: utils => {}
  hidden: true,
  canDrop: (targetUtils, itemUtils, idx) => {},
  acceptDrop: (targetUtils, itemUtils, idx) => {},
  getDragPreview: utils => utils.value.getClonedDOMNode(),
  Component: ReactComponent //use custom component
  input: {
    type: 'number',
    dragSpeed: 0.1,
    ...
  },
  extraInputs: [
    {
      type: 'string'
      value: 8,
      dragSpeed: 0.1,
      options: ['first', 'secound', 'third'],
      types: [
        {--//--}
      ],
      chooseType: utils => return 0;
    }
  ],
  buttons: [
    {
      kind: 'colored'
      label: 'Push'
      icon: 'github'
      onClick: utils => {},
      hideWhenLeaved: true,
    }
  ]
}

*/

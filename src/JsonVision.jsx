var React = require('react');
var assign = require('lodash/object/assign');
var mapValues = require('lodash/object/mapValues');
var includes = require('lodash/collection/includes');
var forEach = require('lodash/collection/forEach');
var isArray = require('lodash/lang/isArray');
var clone = require('lodash/lang/clone');
var Item = require('./Item');
var {getStyles} = require('react-matterkit').utils;
var FuncUtils = require('./FuncUtils');
var minimatch = require('minimatch');

var JsonVision = React.createClass({

  childContextTypes: {
    getSettings: React.PropTypes.func.isRequired,
    createAction: React.PropTypes.func.isRequired,
    createUtils: React.PropTypes.func.isRequired,
  },

  getDefaultProps() {

    return {
      title: 'json vision',
      value: {},
      settings: [],
    };
  },

  getInitialState() {

    return {
      getSettings: getSettings.bind(this),
      createAction: createAction.bind(this),
      createUtils: path => {
        return new FuncUtils(path, this.state.createAction);
      }
    };
  },

  statics: {
    doUpdate() {
      this.forceUpdate();
    },
  },

  getChildContext() {

    return {
      createAction: this.state.createAction,
      getSettings: this.state.getSettings,
      createUtils: this.state.createUtils,
    };
  },

  render() {

    var path = ['', this.props.value];

    var styleConfig = getStyles(this).get('config');
    var style = assign(this.props.style, {
      background: styleConfig.palette.grey4,
      color: styleConfig.fontColor.normal,
      fontFamily: styleConfig.fontFamily,
      fontWeight: styleConfig.fontWeight,
    });

    return <div style={style}>
      <Item
        hideHead = {this.props.hideHead}
        key = 'root'
        value = {this.props.value}
        name = {this.props.name || this.props.title}
        path = {path}
        settings = {this.state.getSettings(path)}/>
    </div>;
  }
});

module.exports = JsonVision;








function createAction(change) {

  if (this.props.onAction && this.props.onAction(change) === false) {

    return;
  }

  if (change) {

    switch (change.type) {

      case 'delete':
        delete change.object[change.key];
        break;

      case 'set':
        change.object[change.key] = change.value;
        break;

      case 'splice':
        // change.object[change.key].splice(change.index, change.removedCound, ...change.items);
        break;
    }
  }

  this.forceUpdate();

  if (this.props.onChange) {
    this.props.onChange(this.props.value);
  }
}


function getSettings(path) {

  var settings = {};
  var {createUtils} = this.state;
  var utils = createUtils(path);

  checkSettingsList(this.props.settings, []);

  return settings;

  function checkSettingsNode(settingsNode, path, preselectors) {

    var match, selector, selectorType;
    var utils = createUtils(path);

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

      if (isArray(selector)) {
        match = includes(selector, utils.value);
      }
      else {
        match = utils.value === selector;
      }
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

      if (typeof(settingsNode) === 'function') {
        settingsNode = settingsNode(utils);
      }

      if (typeof(settingsNode) !== 'object') {
        return;
      }

      if (checkSettingsNode(settingsNode, path, preselectors)) {

        forEach(settingsNode, (value, key) => {

          value = compute(value, key);

          if (key === 'extraInputs' || key === 'buttons') {

            let copy = value.map((val, idx) => {

              var itemValue = compute(val, idx);

              return mapValues(itemValue, (val, key) => compute(val, key));
            });

            let curr = settings[key];
            if (curr) {
              curr.push(...copy);
            }
            else {
              settings[key] = copy;
            }
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
  Component: ReactComponent
  input: {
    dragSpeed: 0.1,
    type: 'number',
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

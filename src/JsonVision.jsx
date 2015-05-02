var React = require('react');
var assign = require('lodash/object/assign');
var merge = require('lodash/object/merge');
var mapValues = require('lodash/object/mapValues');
var includes = require('lodash/collection/includes');
var forEach = require('lodash/collection/forEach');
var isObject = require('lodash/lang/isObject');
var isArray = require('lodash/lang/isArray');
var isFunction = require('lodash/lang/isFunction');
var clone = require('lodash/lang/clone');
var Item = require('./Item');
var FuncUtils = require('./FuncUtils');
var minimatch = require('minimatch');

var styles = {
  root: {
    background: 'rgba(255,255,255,.34)',
    color: '#191D21',
    fontFamily: 'Open Sans',
    fontWeight: '300',
    borderRadius: '1px',
    // margin: '3px',
    // boxShadow: '0 0 1px #000',
    // overflow: 'hidden',
  }
};


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

    return(
      <div style={styles.root}>
        <Item
          key='root'
          value = {this.props.value}
          name = {this.props.name || this.props.title}
          path = {['', this.props.value]}/>
      </div>
    );
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
        change.object[change.key].splice(change.index, change.removedCound, ...change.items);
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

          if (key === 'inputs' || key === 'buttons') {

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
      ['onClick', 'onChange', 'chooseType',
        'canDrop', 'getDragPreview'].indexOf(key) === -1) {

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
  onClick: utils => {}
  getDragPreview: utils => utils.value.getClonedDOMNode(),
  inputs: [
    {
      type: 'string'
      value: 8
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

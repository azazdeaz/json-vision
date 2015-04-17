var React = require('react');
var assign = require('lodash/object/assign');
var includes = require('lodash/collection/includes');
var isArray = require('lodash/lang/isArray');
var Item = require('./Item');
var FuncUtils = require('./FuncUtils');
var JSPath = require('jspath');

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
      createAction: createAction.bind(this),
      getSettings: getSettings.bind(this),
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
    };
  },

  render() {

    return(
      <div style={styles.root}>
        <Item
          key='root'
          value = {this.props.value}
          name = {this.props.name || this.props.title}
          path = {['', this.props.value]}
          createAction = {createAction.bind(this)}
          getSettings = {this.getSettings}/>
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
  var utils = new FuncUtils(path);

  checkSettingsList(this.props.settings, []);

  compute('children');
  compute('highlighted');
  compute('label');

  return settings;

  function compute(key) {

    if (typeof(settings[key]) === 'function') {

      settings[key] = settings[key](utils);
    }
  }

  function checkSettingsNode(settingsNode, path, preselectors) {

    var match, selector, selectorType;

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

        assign(settings, settingsNode);
      }

      if (settingsNode.settings) {

        let newPreselectors = [settingsNode].concat(preselectors);
        checkSettingsList(settingsNode.settings, newPreselectors);
      }
    });
  }
}

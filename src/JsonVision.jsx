var React = require('react');
var assign = require('lodash/object/assign');
var Item = require('./Item');
var FuncUtil = require('./FuncUtil');
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
  console.log('crateAction', change);

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

  checkSettingsList(this.props.settings, []);

  compute('children');
  compute('highlighted');

  return settings;

  function compute(key) {

    if (typeof(settings[key]) === 'function') {

      let scope = new FuncUtil(path);
      settings[key] = settings[key].call(scope);
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

      let scope = new FuncUtil(path);
      match = selector.call(scope);
    }
    else if (selectorType === 'instanceOf') {

      let value = path[path.length-1];
      match = value instanceof selector;
      // console.log(match, selector.prototype === match.prototype, path.length, path.reduce((v,k,i)=>v+(i%2===0?k+'/':''), ''), value);
    }
    else if (selectorType === 'key') {

      let key = path[path.length-2];
      match = key === selector;
    }
    else if (selectorType === 'value') {

      let value = path[1];
      match = value === selector;
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
        let scope = new FuncUtil(path);
        settingsNode = settingsNode.call(scope);
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

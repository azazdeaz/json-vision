var React = require('react');
var _ = require('lodash');
var style = require('./style');
var JsonVisionItem = require('./JsonVisionItem.jsx');
var JSPath = require('jspath');

var styles = {
  root: {
    background: 'rgba(255,255,255,.34)',
    color: '#191D21',
    fontFamily: 'Open Sans',
    fontWeight: '300',
    borderRadius: '1px',
    margin: '3px',
    // boxShadow: '0 0 1px #000',
    // overflow: 'hidden',
  }
};

var JsonVisionComponent = React.createClass({

  componentWillMount() {

    this.settingsMap = new Map();
  },
  getDefaultProps() {

    return {object: {}, settings: []};
  },
  getSettings(object) {

    return this.settingsMap.get(object) || {};
  },
  processSettings() {

    var map = this.settingsMap;

    function set (o, s) {

      map.set(o, _.merge(map.get(o) || {}, s));
    }

    function readList(settingsList, root) {

      settingsList.forEach(settings => read(settings, root));
    }

    function read(settings, root) {

      var selection = [];

      if (settings.selected) {

        selection.push(settings.selected);
      }

      if (settings.selecteds) {

        [].push.apply(selection, settings.selecteds);
      }

      if (settings.selector) {

        if (typeof(settings.selector) === 'string') {

          let selecteds = JSPath.apply(settings.selector, root);
          [].push.apply(selection, selecteds);
        }

      }

      selection.forEach(selected => {

        set(selected, settings);

        if (_.isArray(settings.settings)) {

          readList(settings.settings, selected);
        }
      });
    }

    map.clear();
    readList(this.props.settings, this.props.object);
  },
  render() {

    this.processSettings();

    return(
      <div style={styles.root}>
        <JsonVisionItem
          value = {this.props.value}
          name = {this.props.name || this.props.title}
          report = {this.props.report}
          getSettings = {this.getSettings}/>
      </div>
    );
  }
});

module.exports = JsonVisionComponent;

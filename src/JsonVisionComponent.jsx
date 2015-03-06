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

  getDefaultProps() {

    return {object: {}, settings: []};
  },
  getSettings(path) {
console.log('getSettings', path)
    var settings = {};

    function add (s) {
      _.assign(settings, s);
    }

    this.props.settings.forEach(s => {

      if (s.select) {

        if (typeof(s.select) === 'string' && s.select === path) {

            add(s);
        }
        else if (s.select instanceof RegExp && s.select.test(path)) {

          add(s);
        }
      }
    });

    return settings;
  },
  render() {

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

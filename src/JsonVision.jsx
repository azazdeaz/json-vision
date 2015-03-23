var React = require('react');
var _ = require('lodash');
var JsonVisionItem = require('./JsonVisionItem');
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

function createAction(change) {
  console.log('crateAction', change);

  if (this.props.onAction && this.props.onAction(change) === false) {

    return;
  }

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

  this.forceUpdate();

  if (this.props.onChange) {
    this.props.onChange(this.props.value);
  }
}

var JsonVision = React.createClass({

  getDefaultProps() {

    return {
      title: 'json vision',
      value: {},
      settings: []};
  },
  getSettings(path) {

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
          createAction = {createAction.bind(this)}
          getSettings = {this.getSettings}/>
      </div>
    );
  }
});

module.exports = JsonVision;

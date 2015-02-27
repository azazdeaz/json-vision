var React = require('react');
var _ = require('lodash');
var style = require('./style');
var JsonVisionItem = require('./JsonVisionItem.jsx');
var minimatch = require('minimatch');

window.minimatch = minimatch//test!

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

    return {data: {}, styles: []};
  },
  getSettings(path, value) {

    var ret = {};

    this.props.settings.forEach(style => {

      if (style.selector.test(path)) {

        _.merge(ret, style);
      }
    });

    delete ret.selector;

    return ret;
  },
  render() {
    return(
      <div style={styles.root}>
        <JsonVisionItem
          data = {this.props.data}
          path = {''}
          name = {this.props.name}
          report = {this.props.report}
          getByPath = {this.props.getByPath}
          getStyle = {this.getStyle}/>
      </div>
    );
  }
});

module.exports = JsonVisionComponent;

var React = require('react');
var _ = require('lodash');
var style = require('./style');

var Icon = React.createClass({

  render: function () {
    return <i className = {`fa fa-${this.props.icon} fl-lg`}
      style = {_.assign({
        margin: '0 4px 0 6px',
        lineHeight: this.props.lineHeight || style.lineHeightPX,
        width: '12px',
      }, this.props.style)}
      onClick = {this.props.onClick}
    ></i>;
  },
});

module.exports = Icon;

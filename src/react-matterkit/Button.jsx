var React = require('react');
var { StyleResolverMixin, BrowserStateMixin } = require('radium');
var _ = require('lodash');
var style = require('./style');
var Icon = require('./Icon.jsx');
var Base = require('./Base.jsx');

var Button = React.createClass({

  mixins: [ StyleResolverMixin, BrowserStateMixin ],

  getInitialState() {
    return {
      toggled: false,
      disabled: false,
    };
  },

  render() {

    var s;
    switch(this.props.type) {
      case 'colored': s = style.buttonColored; break;
      case 'empty': s = style.buttonEmpty; break;
      default: s = style.button;
    }

    if (this.state.disabled) s = s.disabled;
    else if (this.state.down || this.state.toggled) s = s.active;
    else if (this.state.hover) s = s.hover;
    else s = s.normal;

    var icon;
    if (this.props.icon) {
      icon = <Icon icon={this.props.icon}
        style={{marginRight:this.props.text ? 4 : 0}}/>;
    }

    return <Base
      {...this.getBrowserStateEvents()}
      style={this.buildStyles(style.button)}

      tooltip={this.props.tooltip}
      dropdownMenu={this.props.dropdownMenu}
      onClick={this.props.onClick}>
      {icon}
      {this.props.text}
    </Base>;
  }
});

module.exports = Button;

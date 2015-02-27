var React = require('react');
var _ = require('lodash');
var style = require('./style');

var Button = React.createClass({

  getInitialState() {
    return {
      hover: false,
      down: false,
      toggled: false,
      disabled: false,
    };
  },

  render() {

    var s = this.props.colored ? style.buttonColored : style.button;

    if (this.state.disabled) s = s.disabled;
    else if (this.state.down || this.state.toggled) s = s.active;
    else if (this.state.hover) s = s.hover;
    else s = s.normal;

    return <div style={s} onClick={this.props.onClick}>
      {this.props.text}
    </div>;
  }
});

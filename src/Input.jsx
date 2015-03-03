var React = require('react');
var _ = require('lodash');
var style = require('./style');

var Input = React.createClass({

  getInitialState() {
    return {
      disabled: false,
      error: false,
      focus: false,
      hover: false,
    };
  },
  onMouseEnter() { this.setState({hover: true}); },
  onMouseLeave() { this.setState({hover: false}); },
  onFocus() { this.setState({focus: true}); },
  onBlur() { this.setState({focus: false}); },
  render: function () {

    var s = style.input;
    if (this.state.disabled) s = style.inputDisabled;
    else if (this.state.error) s = style.inputError;
    else if (this.state.focus) s = style.inputActive;
    else if (this.state.hover) s = style.inputHover;

    return <input
      style = {s}
      defaultValue = {this.props.value}
      type={this.props.type}
      onChange = {e => this.props.update(e.target.name)}
      onMouseEnter = {this.onMouseEnter}
      onMouseLeave = {this.onMouseLeave}
      onBlur = {this.onBlur}
      onFocus = {this.onFocus}
      disabled = {this.state.disabled}
    ></input>;
  }
});

module.exports = Input;

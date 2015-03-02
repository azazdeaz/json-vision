var React = require('react');
var _ = require('lodash');
var style = require('./style');
var Icon = require('./Icon.jsx');

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

    return <div style={s}
      onMouseEnter={() => this.setState({hover: true})}
      onMouseLeave={() => this.setState({hover: false})}
      onMouseDown={() => this.setState({down: true})}
      onMouseUp={() => this.setState({down: false})}
      onClick={this.props.onClick}>
      {this.props.icon && <Icon icon={this.props.icon} style={{marginLeft:0}}/>}
      {this.props.text}
    </div>;
  }
});

module.exports = Button;

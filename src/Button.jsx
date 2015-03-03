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

    return <div style={s}
      onMouseEnter={() => this.setState({hover: true})}
      onMouseLeave={() => this.setState({hover: false})}
      onMouseDown={() => this.setState({down: true})}
      onMouseUp={() => this.setState({down: false})}
      onClick={this.props.onClick}>
      {icon}
      {this.props.text}
    </div>;
  }
});

module.exports = Button;

var React = require('react');
var Input = require('./Input.jsx');
var Icon = require('./Icon.jsx');
var ListItem = require('./ListItem.jsx');
var style = require('./style');
var _ = require('lodash');

var Dropdown = React.createClass({

  getInitialState() {
    return {
      open: false,
      hover: false,
    };
  },

  onMouseEnter() { this.setState({hover: true}); },
  onMouseLeave() { this.setState({hover: false}); },
  onFocus() {
    this.setState({open: true});
    // setTimeout(() => {//!hack
      this.refs.head.getDOMNode().addEventListener('mousedown', this.onCloseClick);
    // });
  },
  onBlur() {
    this.setState({open: false});
    this.refs.head.getDOMNode().removeEventListener('mousedown', this.onCloseClick);
  },
  onCloseClick(e) {
    this.getDOMNode().blur();
  },
  render() {

    var s;
    if (this.state.open) {

      let height = style.itemHeight * (this.props.options.length + 1);
      s = _.defaults({height}, style.dropdownOpen);
    }
    else if (this.state.hover) s = style.dropdownHover;
    else s = style.dropdown;

    return <div
      ref="head"
      style = {s}
      tabIndex = "0"
      onMouseEnter = {this.onMouseEnter}
      onMouseLeave = {this.onMouseLeave}
      onBlur = {this.onBlur}
      onFocus = {this.onFocus}
    >
      <div style={{padding: '0 8px'}}>
        {this.props.value}
        <Icon
          style={{marginLeft: 4}}
          lineHeight={style.itemHeightPX}
          icon={this.state.open ? 'chevron-up' : 'chevron-down'}/>
      </div>

      {this.props.options.map(value => {
        return <ListItem
          value={value}
          onClick={()=>{
            this.props.onChange(value);
            this.getDOMNode().blur();
            }}/>;
      })}
    </div>;
  }
});

module.exports = Dropdown;

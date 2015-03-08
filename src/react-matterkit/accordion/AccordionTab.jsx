var React = require('react');
var _ = require('lodash');
var style = require('../style');
var Icon = require('../Icon.jsx');
var Label = require('../Label.jsx');

var AccordionTab = React.createClass({
  getInitialState() {
    return {opened: true};
  },
  onClick() {
    this.setState({opened: !this.state.opened});
  },
  render: function () {

    var sBase = {};
    if (this.state.opened) sBase.backgroundColor = style.grey.active;
    else if (this.state.hover) sBase.backgroundColor = style.grey.hover;
    else sBase.backgroundColor = style.grey.normal;

    var sHead = {height: style.lineHeight};

    var content = this.state.opened ? <div>{this.props.children}</div> : '';

    return <div
      style={sBase}
      onMouseEnter={() => this.setState({hover: true})}
      onMouseLeave={() => this.setState({hover: false})}
      onMouseDown={() => this.setState({down: true})}
      onMouseUp={() => this.setState({down: false})}
      onClick={this.onClick}>

      <div style={sHead}>
       <Label>{this.props.label}</Label>
       <Icon
         icon={this.props.opened ?  'chevron-down' : 'chevron-up'}
         style={{color: style.palette.grey4}}/>
      </div>
      {content}
    </div>;
  },
});

module.exports = AccordionTab;

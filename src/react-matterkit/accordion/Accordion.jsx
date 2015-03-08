var React = require('react');
var _ = require('lodash');
var style = require('../style');
var AccordionTab = require('./AccordionTab.jsx');

var Accordion = React.createClass({
  selecteds: [],
  onSelect(index) {
    console.log('select tab', index);
  },
  render() {

    React.Children.forEach(this.props.children, child => console.log(child));
    return <div style={style.button.normal}>
      {this.props.children}
    </div>;
  },
});

module.exports = Accordion;

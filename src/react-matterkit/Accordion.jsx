var React = require('react');
var Input = require('./Input.jsx');

var Accordion = React.createClass({
  render() {
    return <Input type='text' {...this.props}/>;
  }
});

module.exports = Accordion;

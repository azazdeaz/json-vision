var style = require('./style');
var assign = require('lodash');
var React = require('react');
var tooltip;

var Tooltip = React.createClass({
  render () {

    if (!this.props.content) return '<div/>';

    return <div style={style.tooltip}>
        {this.props.content}
      </div>;
  }
});

var TooltipMixin = {

  componentWillMount: function() {

    if (!tooltip) {
      tooltip = React.render(<Tooltip/>, document.body);
    }
  },
  componentDidMount: function() {

    var el = this.getDOMNode();
    el.addEventListener('mouseenter', this.mouseenter, false);
    el.addEventListener('mouseleave', this.mouseleave, false);
  },
  componentWillUnmount: function() {

    var el = this.getDOMNode();
    el.removeEventListener('mouseenter', this.mouseenter);
    el.removeEventListener('mouseleave', this.mouseleave);
  },

  mouseenter: function() {

    if (typeof(this.tooltipContent) === 'function') {

      var br = this.getDOMNode().getBoundingClientRect();

        tooltip.setProps({
          style: {
            left: br.left,
            top: br.top,
          },
          content: this.tooltipContent(),
        });
    } else {
      console.warn("Component has TooltipMixin but does not provide tooltipContent()");
    }
  },
  mouseleave: function() {
      // Hide the tooltip only if we are still the owner.
      if (gTooltipOwner === this) {
          gTooltip.detach().hide();
          gTooltipOwner = null;
      }
  }
};

// module.exports = TooltipMixin;

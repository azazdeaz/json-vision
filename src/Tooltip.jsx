var style = require('./style');
var assign = require('lodash');
var React = require('react');
var _ = require('lodash');


var Tooltip = React.createClass({

  getInitialState() {
    return {show: false, style: {}};
  },
  show() {

    var domNode = this.getDOMNode(),
      parent = domNode.parentNode,
      br = parent.getBoundingClientRect();

    this.setState({
      show: true,
      style: {
        left: br.left - domNode.offsetWidth - 8,
        top: br.top,
      }
    });
  },
  hide() {
    this.setState({show: false});
  },
  componentDidMount() {

    var parent = this.getDOMNode().parentNode;
    parent.addEventListener('mouseover', this.show);
    parent.addEventListener('mouseleave', this.hide);
  },
  render () {

    if (!this.state.show) return <div style={{display:'none'}}/>;

    return <div
        style={_.defaults({}, this.state.style, style.tooltip)}>
        {this.props.content}
      </div>;
  }
});

var TooltipMixin = {

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

    if (!this._tooltip) {
      this._tooltip = React.render(<Tooltip/>, this.getDOMNode());
    }

    if (typeof(this.tooltipContent) === 'function') {

      var br = this.getDOMNode().getBoundingClientRect();

      this._tooltip.setProps({
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

    this._tooltip.setProps({
      content: false,
    });
  }
};

module.exports = Tooltip;

var React = require('react');
var _ = require('lodash');
var style = require('./style');
var CustomDrag = require('./CustomDrag');

var Slider = React.createClass({

  componentDidMount() {
    new CustomDrag({
      deTarget: this.refs.handle.getDOMNode(),
      onDrag: e => console.log(e),
    });
  },
  render() {
    return <div style={style.slider}
      onMouseDown={e => e.preventDefault()}>
      <Handle ref='handle'/>
      <div style={style.sliderBarBg}>
        <div ref='progress' style={style.sliderBarProgress}/>
      </div>
    </div>;
  },
});

var Handle = React.createClass({

  getInitialState() {
    return {
      hover: false,
      down: false,
    };
  },

  render() {

    var s;

    if (this.state.down) s = style.sliderHandleActive;
    else if (this.state.hover) s = style.sliderHandleHover;
    else s = style.sliderHandle;

    var icon;
    if (this.props.icon) {
      icon = <Icon icon={this.props.icon}
        style={{marginRight:this.props.text ? 4 : 0}}/>;
    }

    return <div style={s}
      onMouseEnter={() => this.setState({hover: true})}
      onMouseLeave={() => this.setState({hover: false})}
      onMouseDown={() => this.setState({down: true})}
      onMouseUp={() => this.setState({down: false})}>
    </div>;
  }
});

module.exports = Slider;

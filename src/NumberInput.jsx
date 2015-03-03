var React = require('react');
var Input = require('./Input.jsx');

var NumberInput = React.createClass({

  componentDidMount() {
    if (this.props.draggable) {
      new CustomDrag({
        deTarget: this.refs.handle.getDOMNode(),
        onDown(e) {
          return {
            value: this.props.value,
            moved: false,
          };
        },
        onDrag(md) {
          md.moved = true;
          this.props.update(md.value + e.dx);
        },
        onUp(md) {
          //TODO if (!md.moved) this.getDOM
        }
      });
    }
  },
  getDefaultState() {
    return {
      draggable: true,
      precision: 0,
      dragSpeed: 1,
      defaultValue: 0,
      min: Number.MIN_VALUE,
      max: Number.MAX_VALUE,
    };
  },
  render() {
    return <Input
      {...this.props}
      type='number'
    ></Input>;
  }
});

module.exports = NumberInput;

var React = require('react');
var shallowEquals = require('shallow-equals');
var has = require('lodash/object/has');
var assign = require('lodash/object/assign');
var Matterkit = require('react-matterkit');
var {ButtonGroup, Button} = Matterkit;
var Item;

var Buttons  = React.createClass({

  contextTypes: {
    createUtils: React.PropTypes.func.isRequired,
    createAction: React.PropTypes.func.isRequired,
  },

  shouldComponentUpdate(next) {

    var {hover, buttons} = this.props;

    return hover === next.hover &&
      buttons.length === next.buttons.length &&
      buttons.every((btn, idx) => shallowEquals(btn, next.buttons[idx]));

  },

  onBtnClick (btn) {

    var utils = this.context.createUtils(this.props.path);
    btn.onClick(utils);
  },

  render() {

    var {buttons} = this.props;

    return <ButtonGroup>
      {buttons.map((btn, idx) => {

        if (!has(btn, 'kind')) btn.kind = 'stamp';

        var s = assign({}, btn.style);
        if (btn.hideWhenLeaved && !this.props.hover) s.visibility = 'hidden';

        return <Button
          key={idx}
          {...btn}
          style={s}
          onClick={() => this.onBtnClick(btn)}/>;
      })}
    </ButtonGroup>;
  }
});

export default Buttons;

var React = require('react');
var clone = require('lodash/lang/clone');
var Matterkit = require('react-matterkit');
var {ItemGroup, Button} = Matterkit;

export default class Buttons extends React.Component {

  handleBtnClick (btn) {
    btn.onClick(this.prosp.leaf.utils);
  }

  render() {
    var {buttons} = this.props;

    return <ItemGroup>
      {buttons.map((btn, idx) => {
        var style = clone(btn.style);

        if (btn.hideWhenLeaved && !this.props.hover) {
          style.visibility = 'hidden';
        }

        return <Button
          key={idx}
          {...btn}
          style={style}
          onClick={() => this.onBtnClick(btn)}/>;
      })}
    </ItemGroup>;
  }
}

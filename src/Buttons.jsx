var React = require('react')
var clone = require('lodash/lang/clone')
var assign = require('lodash/object/assign')
var Matterkit = require('react-matterkit')
var {ItemGroup, Button} = Matterkit

export default class Buttons extends React.Component {
  handleBtnClick = (btn) => {
    btn.onClick(this.props.leaf.utils)
  }

  render() {
    var {buttons, buttonStyle} = this.props

    return <ItemGroup>
      {buttons.map((btn, idx) => {
        var style = btn.style ? clone(btn.style) : {}
        assign(style, buttonStyle)

        if (btn.hideWhenLeaved && !this.props.hover) {
          style.visibility = 'hidden'
        }

        return <Button
          key={idx}
          {...btn}
          style={style}
          onClick={() => this.handleBtnClick(btn)}/>
      })}
    </ItemGroup>
  }
}

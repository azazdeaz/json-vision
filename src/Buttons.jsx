var React = require('react')
var Matterkit = require('react-matterkit')
var {ItemGroup, Button} = Matterkit

export default function Buttons({buttons, buttonStyle, hover}) {
  return <ItemGroup>
    {buttons.map((btn, idx) => {
      var visibility = 'visible'
      var button

      if (btn.hideWhenLeaved && !hover) {
        visibility = 'hidden'
      }

      if (btn.getElement) {
        button = btn.getElement({style: buttonStyle})
      }
      else {
        button = <Button
          {...btn}
          style = {{...btn.style, ...buttonStyle}}
          mod = {{kind: 'stamp', ...btn.mod}}
          onClick = {btn.onClick}
        />
      }

      return <div key={idx} style={{visibility}}>
        {button}
      </div>
    })}
  </ItemGroup>
}

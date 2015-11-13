import React from 'react'
import has from 'lodash/object/has'
import Row from './Row'
import shouldPureComponentUpdate from 'react-pure-render/function'

export default class Item extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  constructor({createSettings, ...args}) {
    super()

    const settings = createSettings(args)

    this.settings = settings
    this.state = {
      open: has(settings, 'open')
        ? settings.open
        : has(settings, 'defaultOpen')
        ? settings.defaultOpen
        : true
    }
  }

  componentWillUpdate({createSettings, ...args}) {
    this.settings = createSettings(args)
  }

  handleClickOpenToggle = () => {
    var {settings} = this.props

    if (settings.onToggleOpen) {
      settings.onToggleOpen()
    }

    this.setState({open: !this.state.open})
  }

  render () {
    const {settings} = this
    const {children} = this.props
    const {open} = has(settings, 'open') ? settings : this.state
    const childCount = React.Children.count(children)

    if (settings.ItemComponent) {
      return <settings.ItemComponent {...this.props}/>
    }

    var row = settings.hiddenHead ? null : <Row
      settings = {settings}
      open = {open}
      hasChildren = {childCount > 0}
      onClickOpenToggle = {this.handleClickOpenToggle}/>

    return <div
      hidden = {settings.hidden}
      style = {{position: 'relative'}}>
      {row}
      <div hidden={!open} style={{marginLeft: 4}}>
        {children}
      </div>
    </div>
  }
}

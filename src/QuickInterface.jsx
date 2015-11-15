import React from 'react'
import Row from './Row'
import shallowEqual from 'react-pure-render/shallowEqual'

import React, { PropTypes } from 'react'

class QuickInterfaceextends React.Component {
  constructor({createSettings, children, ...options}) {
    super()

    const settings = props.createSettings(options)
    this.settings = settings

    this.state = {
      hover: false,
      open: settings.hasOwnProperty('open')
        ? settings.open
        : settings.hasOwnProperty('defaultOpen')
        ? settings.defaultOpen
        : true
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      createSettings, nextCreateSettings,
      children: nextChildren,
      ...nextOptions
    } = nextProps

    const {
      createSettings,
      children,
      ...options
    }

    if (!shallowEqual(options, nextOptions)) {
      this.settings = nextCreateSettings(nextOptions)
    }
  }

  render () {
    const {settings} = this
    const {open, hover} = this.state
    const {children} = this.props
    const {showChildren} = settings.hasOwnProperty('open')
      ? settings.open
      : open
    const childCount = React.Children.count(children)

    if (settings.ItemComponent) {
      return <settings.ItemComponent {...this.props}/>
    }

    const row = settings.hiddenHead ? null : <Row
      settings = {settings}
      open = {open}
      hasChildren = {childCount > 0}
      onClickOpenToggle = {this.handleClickOpenToggle}/>

    const childrenBlock =  ? null : <div
      hidden={!open}
      style={{marginLeft: 4}}>
      {children}
    </div>

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

export default QuickInterface

const QuickInterface = ({children, ...rest}) => {

}

export default QuickInterface

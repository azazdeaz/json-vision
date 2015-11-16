import React, { PropTypes } from 'react'
import Row from './Row'
import shallowEqual from 'react-pure-render/shallowEqual'

class QuickInterface extends React.Component {
  constructor({createSettings, children, ...options}) {
    super()

    const settings = createSettings(options)
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

  static propTypes = {
    createSettings: React.PropTypes.func.isRequired
  }

  componentWillReceiveProps(nextProps) {
    const {
      createSettings: nextCreateSettings,
      children: nextChildren,
      ...nextOptions
    } = nextProps

    const {
      createSettings,
      children,
      ...options
    } = this.props

    if (!shallowEqual(options, nextOptions)) {
      this.settings = nextCreateSettings(nextOptions)
    }
  }

  handleClickOpenToggle = () => {
    var {onToggleOpen} = this.settings

    if (onToggleOpen) {
      onToggleOpen()
    }

    this.setState({open: !this.state.open})
  }

  handleHover = () =>
    this.setState({hover: true})

  handleLeave = () =>
    this.setState({hover: false})

  render () {
    const {settings} = this
    const {open, hover} = this.state
    const {children} = this.props
    const showChildren = children && settings.hasOwnProperty('open')
      ? settings.open
      : open
    const hasChildren = React.Children.count(children) > 0

    if (settings.ItemComponent) {
      return <settings.ItemComponent {...this.props}/>
    }

    const row = settings.hiddenHead
      ? null
      : <Row
          settings = {settings}
          openState = {showChildren}
          hoverState = {hover}
          hasChildren = {hasChildren}
          onHover = {this.handleHover}
          onLeave = {this.handleLeave}
          onClickOpenToggle = {this.handleClickOpenToggle}/>

    const childrenBlock = !showChildren || !hasChildren
      ? null
      : <div
          hidden={!showChildren}
          style={{marginLeft: 4}}>
          {children}
        </div>

    return <div
      hidden = {settings.hidden}
      style = {{position: 'relative'}}>
      {row}
      {childrenBlock}
    </div>
  }
}

export default QuickInterface

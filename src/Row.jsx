import React from 'react'
import Input from './Input'
import Buttons from './Buttons'
import DndWrap from './DndWrap'
import ContextMenuWrap from './ContextMenuWrap'
import {Icon, Label, getTheme} from 'react-matterkit'

export default class Row extends React.Component {// eslint-disable-line no-shadow
  constructor(props) {
    super(props)

    this.state = {
      hover: false,
    }
  }

  static contextTypes = {
    matterkitTheme: React.PropTypes.object
  }

  render () {
    var {settings, open, hasChildren, onClickOpenToggle} = this.props
    var {hover} = this.state

    if (settings.Component) {
      return <settings.Component {...this.props}/>
    }

    var styleConfig = getTheme(this).getStyle('config')
    var textColor = settings.highlighted ? styleConfig.palette.grey4 : styleConfig.fontColor.normal

    var styleBlock = {
      position: 'relative',
      height: styleConfig.lineHeight,
      lineHeight: `${styleConfig.lineHeight}px`,
      display: 'flex',
      color: settings.highlighted ? styleConfig.palette.blue : styleConfig.palette.grey2,
      fontSize: '13px',
      backgroundColor: settings.highlighted ? styleConfig.palette.blue : styleConfig.palette.bg,
      borderBottom: 'solid 1px #1a1d21',
      boxSizing: 'border-box',
    }

    var items = {}


    //label
    if (settings.labels) {
      items.labels = <span style={{display: 'flex', flex: 1}}>
        {settings.labels.map((label, id) => {
          if (typeof label === 'string') {
            label = {label}
          }
          label = {
            ...label,
            style: {
              flex: 1,
              color: textColor,
              ...label.style
            }
          }

          return <Label {...label}/>
        })}
      </span>
    }

    //inputs
    if (settings.inputs) {

      items.inputs = <span style={{display: 'flex', flex: 1}}>

        {settings.inputs.map((inputProps, idx) => {
          return <Input
            key = {idx}
            {...inputProps}/>
        })}
      </span>
    }

    //buttons
    if (settings.buttons) {
      items.buttons = <Buttons
        hover = {hover}
        buttonStyle = {{color: textColor}}
        buttons = {settings.buttons}/>
    }

    //show/hide toggle btn
    items.toggle = <Icon
      icon={hasChildren ? (open ? 'chevron-down' : 'chevron-right') : ' '}
      onClick={hasChildren ? onClickOpenToggle : null}
      style={{margin: '0 4px', color: textColor}}/>


      // <DndWrap
      //   style={styleBlock}
      //   onMouseEnter={() => this.setState({hover: true})}
      //   onMouseLeave={() => this.setState({hover: false})}
      //   onClick={()=>{
      //     if (settings.onClick) {
      //       settings.onClick()
      //     }
      //   }}
      //   draggable = {settings.draggable}>}
      // </DndWrap>
    return <ContextMenuWrap options={settings.contextMenu}>
        <div style={styleBlock}>
        {items.toggle}
        {items.labels}
        {items.inputs}
        {items.buttons}

        </div>
    </ContextMenuWrap>
  }
}

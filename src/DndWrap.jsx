var {getTheme} = require('react-matterkit')
import React from 'react'
import {DragSource, DropTarget} from 'react-dnd'
import Connect from './Connect'
import Config from './Config'

function getDropPosition(monitor, component) {
  var node = React.findDOMNode(component)
  var br = node.getBoundingClientRect()
  var pos = monitor.getClientOffset()
  var y = (pos.y - br.top) / br.height
  var dropPosition

  if (y < 0.2) dropPosition = 'before'
  else if (y > 0.8) dropPosition = 'after'
  else dropPosition = 'in'

  return dropPosition
}

const dragSource = {
  beginDrag(props) {
    return {connect: props.leaf.connect}
  },
  canDrag(props) {
    return props.leaf.settings.draggable
  },
  endDrag(props, monitor) {
    var {taken, userHandled} = monitor.getDropResult()

    if (!userHandled && taken) {
      props.leaf.connect.delete()
    }
  }
}

function getDropValues(props, monitor, component) {
  var dropPosition = getDropPosition(monitor, component)
  var dropTargetLeaf = props.leaf
  var payload = monitor.getItem()
  var abort = false

  if (payload.connect instanceof Connect) {
    payload = payload.connect

    if (dropTargetLeaf.connect.value === payload.value) {
      //prevent to drop a value in itself
      abort = true
    }
  }

  return {dropPosition, dropTargetLeaf, payload, abort}
}

const dropTarget = {
  drop(props, monitor, component) {
    var {dropPosition, dropTargetLeaf, payload, abort} =
      getDropValues(props, monitor, component)
    var dropResult

    if (abort) {
      dropResult = {taken: false}
    }
    else {
      dropResult = dropTargetLeaf.acceptDrop(payload, dropPosition)
    }

    return dropResult
  },

  hover(props, monitor, component) {
    var {dropPosition, dropTargetLeaf, payload, abort} =
      getDropValues(props, monitor, component)
    var canDrop

    if (abort) {
      canDrop = false
    }
    else {
      canDrop = dropTargetLeaf.canDrop(payload, dropPosition)
    }
    component.setState({dropPosition, canDrop})
  },
}

@DragSource(Config.DND_TYPE, dragSource, function (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
})
@DropTarget(
  props => {
    return props.leaf.settings.dropTargetTypes || Config.DND_TYPE
  },
  dropTarget,
  function (connect, monitor) {
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver()
    }
  }
)
export default class DropLayer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dropPosition: undefined,
    }
  }

  render() {
    var {isDragging, isOver, connectDragSource, connectDropTarget} = this.props
    var {dropPosition, canDrop} = this.state

    if (!isOver || !canDrop) {
      dropPosition = null
    }

    return connectDropTarget(connectDragSource(<div
      style = {this.props.style}
      onMouseEnter = {this.props.onMouseEnter}
      onMouseLeave = {this.props.onMouseLeave}
      onClick = {this.props.onClick}>

      {this.props.children}

      <DropHighlight pos='in' currPos={dropPosition}/>
      <DropHighlight pos='before' currPos={dropPosition}/>
      <DropHighlight pos='after' currPos={dropPosition}/>
    </div>))
  }
}

class DropHighlight extends React.Component {
  render() {
    var {pos, currPos} = this.props
    var isHovering = pos === currPos

    // var styleConfig = getTheme(this).getStyle('config')

    var s = {
      pointerEvents: 'none',
      position: 'absolute',
      width: '100%',
      left: 0,
      [pos === 'after' ? 'bottom' : 'top']: 0,
      height: pos === 'in' ? '100%' : '6px',
      backgroundColor: '#0074D9',
      opacity: isHovering ? 0.3 : 0,
    }

    return <div style={s}/>
  }
}

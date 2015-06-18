var {getStyles} = require('react-matterkit').utils;
import React from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import Config from './Config';

function getDropPosition(monitor, component) {
  var node = React.findDOMNode(component);
  var br = node.getBoundingClientRect();
  var pos = monitor.getClientOffset();
  var y = (pos.y - br.top) / br.height;
  var dropPosition;

  if (y < 0.2) dropPosition = 'before';
  else if (y > 0.8) dropPosition = 'after';
  else dropPosition = 'in';

  return dropPosition;
}

const dragSource = {
  beginDrag(props) {
    return {utils: props.leaf.utils};
  },
  canDrag(props) {
    return props.leaf.settings.draggable;
  },
  endDrag(props, monitor) {
    if (monitor.getDropResult().taken) {
      props.leaf.utils.delete();
    }
  }
};

const dropTarget = {
  drop(props, monitor, component) {
    var dropPosition = getDropPosition(monitor, component);
    var dropTargetLeaf= props.leaf;
    var dragSourceConnect = monitor.getItem().utils;

    if (dropTargetLeaf.utils.value === dragSourceConnect.value) {
      //prevent to drop a value in itself
      return false;
    }

    var taken = dropTargetLeaf.acceptDrop(dragSourceConnect, dropPosition);

    return {taken};
  },

  hover(props, monitor, component) {
    var dropPosition = getDropPosition(monitor, component);
    component.setState({dropPosition});
  },
};

@DragSource(Config.DND_TYPE, dragSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
@DropTarget(Config.DND_TYPE, dropTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))
export default class DropLayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropPosition: undefined,
    };
  }

  render() {
    var {isDragging, isOver, connectDragSource, connectDropTarget} = this.props;
    var {dropPosition} = this.state;

    if (!isOver) {
      dropPosition = null;
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
    </div>));
  }
}

class DropHighlight extends React.Component {
  render() {
    var {pos, currPos} = this.props;
    var isHovering = pos === currPos;

    // var styleConfig = getStyles(this).get('config');

    var s = {
      pointerEvents: 'none',
      position: 'absolute',
      width: '100%',
      left: 0,
      [pos === 'after' ? 'bottom' : 'top']: 0,
      height: pos === 'in' ? '100%' : '6px',
      backgroundColor: '#0074D9',
      opacity: isHovering ? 0.3 : 0,
    };

    return <div style={s}/>;
  }
}

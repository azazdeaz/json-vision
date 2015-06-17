var {getStyles} = require('react-matterkit').utils;
import React from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import Config from './Config';

function getDropPosition(monitor, component) {
  var node = React.findDOMNode(component);
  var br = node.getBoundingClientRect();
  var pos = context.getCurrentOffsetFromClient();
  var y = (pos.y - br.top) / br.height;
  var dropPosition;

  if (y < 0.2) dropPosition = 'before';
  else if (y > 0.8) dropPosition = 'after';
  else dropPosition = 'in';

  return dropPosition;
}

const dragSource = {
  beginDrag(props) {
    var {utils} = props.leaf;
    return {
      item: {
        value: props.leaf.utils.value,
      }
    };
  },
  canDrag(props) {
    return props.leaf.settings.draggable;
  },
  endDrag(props, monitor) {
    if (monitor.getDropResoult().taken) {
      props.leaf.delete();
    }
  }
};

const dropTarget = {
  drop(props, monitor, component) {
    var {dropPosition} = getDropPosition(monitor, component);
    var {leaf} = props;
    var value = monitor.getItem().value;

    var taken = dropPosition === 'in' ?
      leaf.acceptDrop(value) : leaf.acceptDropAround(value, dropPosition);

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

  // statics: {
  //   configureDragDrop(register, context) {
  //
  //
  //
  //
  //     register(Config.DND_TYPE, {
  //
  //       dragSource: {
  //         beginDrag(component) {
  //
  //           var {path} = component.props;
  //           var utils = component.context.createUtils(path);
  //
  //           return {
  //             item: {
  //               value: utils.value,
  //               utils,
  //             },
  //           };
  //         },
  //
  //         canDrag(component) {
  //
  //           return component.props.draggable;
  //         },
  //       },
  //
  //       dropTarget: {
  //
  //         canDrop(component, item) {
  //
  //           var dropPosition = getDropPosition(component);
  //           component.setState({dropPosition});
  //
  //           var {canDrop, canDropAround} = component.props;
  //           var dropTargetUtils = component.getDropTargetUtils(dropPosition);
  //           var idx = component.getIdx(dropTargetUtils, dropPosition);
  //
  //           canDrop = dropPosition === 'in' ? canDrop : canDropAround;
  //
  //           return canDrop(dropTargetUtils, item, idx);
  //         },
  //
  //         acceptDrop(component, item) {
  //
  //           var {dropPosition} = component.state;
  //           var {acceptDrop, acceptDropAround} = component.props;
  //           var dropTargetUtils = component.getDropTargetUtils(dropPosition);
  //           var idx = component.getIdx(dropTargetUtils, dropPosition);
  //
  //           acceptDrop = dropPosition === 'in' ?
  //             acceptDrop : acceptDropAround;
  //
  //           component.setState({dropPosition: undefined});
  //
  //           return acceptDrop(dropTargetUtils, item, idx);
  //         },
  //
  //         leave(component) {
  //           component.setState({dropPosition: undefined});
  //         },
  //       }
  //     });
  //   }
  // }

  getIdx(utils, dropPosition) {

    if (dropPosition === 'in') {
      return 0;
    }
    else if (dropPosition === 'before') {
      return this.props.idx;
    }
    else if (dropPosition === 'after') {
      return this.props.idx + 1;
    }
  }

  getDropTargetUtils(dropPosition) {

    var {path} = this.props;
    var dropTargetUtils;

    if (dropPosition === 'in') {
      dropTargetUtils = this.context.createUtils(path);
    }
    else {
      //create a util whitch represents the parent
      dropTargetUtils = this.context.createUtils(path.slice(0, -2));
    }

    return dropTargetUtils;
  }

  render() {
    var {isDragging, connectDragSource, connectDropTarget} = this.props;
    var {dropPosition} = this.state;

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

    var styleConfig = getStyles(this).get('config');

    var s = {
      pointerEvents: 'none',
      position: 'absolute',
      width: '100%',
      left: 0,
      [pos === 'after' ? 'bottom' : 'top']: 0,
      height: pos === 'in' ? '100%' : '6px',
      backgroundColor: styleConfig.palette.green,
      opacity: isHovering ? 0.3 : 0,
    };

    return <div style={s}/>;
  }
}

var React = require('react/addons');
var {PureRenderMixin} = React;
var {DragDropMixin} = require('react-dnd');
var Config = require('./Config');
var isArray = require('lodash/lang/isArray');
var {style} = require('react-matterkit');

var DropLayer  = React.createClass({

  mixins: [DragDropMixin],

  contextTypes: {
    createUtils: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      dropPosition: undefined,
    }
  },

  statics: {
    configureDragDrop(register, context) {


      function getDropPosition(component) {

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

      register(Config.DND_TYPE, {

        dragSource: {
          beginDrag(component) {

            var {path} = component.props;
            var utils = component.context.createUtils(path);

            return {
              item: {
                value: utils.value,
                utils,
              },
            };
          },

          canDrag(component) {

            return component.props.draggable;
          },
        },

        dropTarget: {

          canDrop(component, item) {

            var dropPosition = getDropPosition(component);
            component.setState({dropPosition});

            var {canDrop, canDropAround} = component.props;
            var dropTargetUtils = component.getDropTargetUtils(dropPosition);
            var idx = component.getIdx(dropTargetUtils, dropPosition);
            var canDrop = dropPosition === 'in' ? canDrop : canDropAround;

            return canDrop(dropTargetUtils, item, idx);
          },

          acceptDrop(component, item) {

            var {dropPosition} = component.state;
            var {acceptDrop, acceptDropAround} = component.props;
            var dropTargetUtils = component.getDropTargetUtils(dropPosition);
            var idx = component.getIdx(dropTargetUtils, dropPosition);
            var acceptDrop = dropPosition === 'in' ?
              acceptDrop : acceptDropAround;

            component.setState({dropPosition: undefined});

            return acceptDrop(dropTargetUtils, item, idx);
          },

          leave(component) {
            component.setState({dropPosition: undefined});
          },
        }
      });
    }
  },

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
  },

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
  },

  render() {
    
    var {dropPosition} = this.state;

    return <div
      style = {this.props.style}
      onMouseEnter = {this.props.onMouseEnter}
      onMouseLeave = {this.props.onMouseLeave}
      onClick = {this.props.onClick}
      {...this.dragSourceFor(Config.DND_TYPE)}
      {...this.dropTargetFor(Config.DND_TYPE)}>

      {this.props.children}

      <DropField pos='in' currPos={dropPosition}/>
      <DropField pos='before' currPos={dropPosition}/>
      <DropField pos='after' currPos={dropPosition}/>
    </div>;
  }
});

export default DropLayer;

var DropField = React.createClass({

  render() {

    var {pos, currPos} = this.props;
    var isHovering = pos === currPos;

    var s = {
      pointerEvents: 'none',
      position: 'absolute',
      width: '100%',
      left: 0,
      [pos === 'after' ? 'bottom' : 'top']: 0,
      height: pos === 'in' ? '100%' : '6px',
      backgroundColor: style.palette.green,
      opacity: isHovering ? 0.3 : 0,
    };

    return <div style={s}/>;
  }
});

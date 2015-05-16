var React = require('react/addons');
var {PureRenderMixin} = React;
var {DragDropMixin} = require('react-dnd');
var Config = require('./Config');
var isArray = require('lodash/lang/isArray');
var {style} = require('react-matterkit');

var DropLayer  = React.createClass({

  contextTypes: {
    createUtils: React.PropTypes.func.isRequired,
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

  canDrop(dropPosition, item) {

    var dropTargetUtils = this.getDropTargetUtils(dropPosition);
    var idx = this.getIdx(dropTargetUtils, dropPosition);
    var canDrop = dropPosition === 'in' ?
      this.props.canDrop : this.props.canDropAround;

    return canDrop(dropTargetUtils, item, idx);
  },

  acceptDrop(dropPosition, item) {

    var dropTargetUtils = this.getDropTargetUtils(dropPosition);
    var idx = this.getIdx(dropTargetUtils, dropPosition);
    var acceptDrop = dropPosition === 'in' ?
      this.props.acceptDrop : this.props.acceptDropAround;

    return acceptDrop(dropTargetUtils, item, idx);
  },

  render() {

    var {canDropAround} = this.props;

    var createDropField = pos => {
      return <DropField
        pos = {pos}
        canDrop = {this.canDrop}
        acceptDrop = {this.acceptDrop}/>;
    };

    var s = {
      position: 'absolute',
      left: 0,
      width: '100%',
      height: '100%',
    };

    return <div style={s}>
      {createDropField('in')}
      {canDropAround ? createDropField('before') : ''}
      {canDropAround ? createDropField('after') : ''}
    </div>;
  }
});

export default DropLayer;

var DropField = React.createClass({

  mixins: [DragDropMixin],

  statics: {
    configureDragDrop(register) {

      register(Config.DND_TYPE, {

        dropTarget: {
          canDrop(component, item) {

            return component.props.canDrop(component.props.pos, item);
          },

          acceptDrop(component, item, isHandled) {

            return component.props.acceptDrop(component.props.pos, item);
          }
        }
      });
    }
  },

  render() {

    var {pos} = this.props;
    var {isHovering} = this.getDropState(Config.DND_TYPE);

    var s = {
      position: 'absolute',
      width: '100%',
      left: 0,
      [pos === 'after' ? 'bottom' : 'top']: 0,
      height: pos === 'in' ? '100%' : '6px',
      backgroundColor: style.palette.green,
      opacity: isHovering ? 0.3 : 0,
    };

    return <div
      {...this.dropTargetFor(Config.DND_TYPE)}
      style={s}/>;
  }
});

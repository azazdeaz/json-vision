var React = require('react/addons');
var {PureRenderMixin} = React;
var {DragDropMixin} = require('react-dnd');
var Config = require('./Config');

var DropLayer  = React.createClass({

  contextTypes: {
    createUtils: React.PropTypes.func.isRequired,
  },

  getIdx(utils, dropPosition) {

    var idx = 0;

    if (isArray(utils.parent)) {
      idx = utils.parent.indexOf(utils.value);

      if (dropPosition === 'after') {
        idx += 1;
      }
    }

    return idx;
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

    if (around) {
      return this.props.canDrop(dropTargetUtils, item, idx);
    }
  },

  acceptDrop(dropPosition, item) {

    var dropTargetUtils = this.getDropTargetUtils(dropPosition);
    var idx = this.getIdx(dropTargetUtils, dropPosition);

    if (around) {
      return this.props.acceptDrop(dropTargetUtils, item, idx);
    }
  },

  render() {

    var {canDrop, acceptDrop, canDropAround, acceptDropAround,
      path} = this.props;



    function createDropField(pos, canDrop, acceptDrop) {
      return <DropField
        pos = {pos}
        canDrop = {canDrop}
        acceptDrop = {acceptDrop}/>;
    }

    return <div>
      {canDropAround ? dropField('before', this.canDrop, this.accepDrop) : ''}
      {dropField('in', this.canDrop, this.accepDrop)}
      {canDropAround ? dropField('after', this.canDrop, this.accepDrop) : ''}
    </div>;
  }
});

export default DropLayer;

var DropField = React.createClass({

  mixins: [DragDropMixin],

  statics: {
    configureDragDrop(register, dragDropContext) {

      function createUtils(component) {

        var {path} = component.props;
        var create = component.context.createUtils;
        return create(path);
      }

      function getIdx(utils, dropPosition) {

        var idx = 0;

        if (isArray(utils.parent)) {
          idx = utils.parent.indexOf(utils.value);

          if (dropPosition === 'after') {
            idx += 1;
          }
        }

        return idx;
      }

      register(Config.DND_TYPE, {

        dropTarget: {
          canDrop(component, item) {

            return component.props.canDrop(item);
          },

          acceptDrop(component, item, isHandled) {

            return component.props.acceptDrop(item);
          },
        }
      });
    }
  },

  render() {

    var {pos} = this.props;
    var {hover} = this.getDropState(Config.DND_TYPE);

    var s = {
      position: 'absolute',
      width: '100%',
      left: 0,
      height: pos === 'in' ? '100%' : '6px',
      [pos === 'after' ? 'bottom' : 'top']: 0,
      backgroundColor: style.palette.green,
      opacity: hover ? 0.3 : 0,
    };

    items.dropEffect = <div
      {...this.dropTargetFor(DND_TYPE)}
      style={s}/>;
  }
});

var React = require('react');
var isObject = require('lodash/lang/isObject');
var isArray = require('lodash/lang/isArray');
var has = require('lodash/object/has');
var defaults = require('lodash/object/defaults');
var assign = require('lodash/object/assign');
var Children = require('./Children');
var Input = require('./Input');
var Buttons = require('./Buttons');
var DropLayer = require('./DropLayer');
var {DragDropMixin} = require('react-dnd');
var Config = require('./Config');

var {style, Button, Icon, ButtonGroup} = require('react-matterkit');

var styles = {
  root: {
    background: 'rgba(255,255,255,.34)',
    color: '#191D21',
    fontFamily: style.fontFamily,
    fontWeight: style.fontWeight,
    borderRadius: '1px',
    margin: '3px',
  },

  line: {
    position: 'relaitve',
    height: style.lineHeightPX,
    lineHeight: style.lineHeightPX,
    display: 'flex',
    color: '#96a6ad',
    fontSize: '13px',
    backgroundColor: '#262a2e',
    borderBottom: 'solid 1px #1a1d21',
    boxSizing: 'border-box',
  },

};

styles.lineGroup = defaults({
  color: style.palette.grey4,
  backgroundColor: style.palette.blue,
}, styles.line);

var Item = React.createClass({

  contextTypes: {
    createAction: React.PropTypes.func.isRequired,
    createUtils: React.PropTypes.func.isRequired,
  },
  getInitialState () {

    return {
      opened: true,
      hover: false,
    };
  },
  getDefaultProps() {
    return {
      path: [],
      value: null,
      indent: 0,
    };
  },
  // statics: {
  //   configureDragDrop(register, dragDropContext) {
  //
  //     function createUtils(component) {
  //
  //       var {path} = component.props;
  //       var create = component.context.createUtils;
  //       return create(path);
  //     }
  //
  //     function getIdx(utils, dropPosition) {
  //
  //       var idx = 0;
  //
  //       if (isArray(utils.parent)) {
  //         idx = utils.parent.indexOf(utils.value);
  //
  //         if (dropPosition === 'after') {
  //           idx += 1;
  //         }
  //       }
  //
  //       return idx;
  //     }
  //
  //     // register(Config.DND_TYPE, {
  //
  //       // dragSource: {
  //       //   beginDrag(component) {
  //       //
  //       //     var utils = createUtils(component);
  //       //
  //       //     return {
  //       //       item: {
  //       //         value: utils.value,
  //       //         utils,
  //       //       },
  //       //     };
  //       //   },
  //       //
  //       //   canDrag(component) {
  //       //
  //       //     return component.props.settings.draggable;
  //       //   },
  //       // },
  //
  //       // dropTarget: {
  //       //   canDrop(component, item) {
  //       //
  //       //     var {settings, canDropAround} = component.props;
  //       //     var {canDrop} = settings;
  //       //     var utils = createUtils(component);
  //       //     var idx = getIdx(utils, component.state.dragDropPosition);
  //       //
  //       //     if (canDrop && canDrop(utils, item.utils)) {
  //       //       return true;
  //       //     }
  //       //     else if (canDropAround && canDropAround(utils, item.utils, idx)) {
  //       //       return true;
  //       //     }
  //       //     else {
  //       //       item.dropChildKey = utils.key;
  //       //     }
  //       //   },
  //       //
  //       //   acceptDrop(component, item, isHandled) {
  //       //
  //       //     var {settings, acceptDropAround} = component.props;
  //       //     var {acceptDrop} = settings;
  //       //     var utils = createUtils(component);
  //       //     var idx = getIdx(utils, component.state.dragDropPosition);
  //       //
  //       //     if (acceptDrop) {
  //       //       return acceptDrop(utils, item.utils, idx);
  //       //     }
  //       //     else if (acceptDropAround) {
  //       //       return acceptDropAround(utils, item.utils, idx);
  //       //     }
  //       //     else if (isArray(utils.value))
  //       //     {
  //       //       item.utils.remove();
  //       //       utils.value.splice(idx, 0, item.utils.value);
  //       //     }
  //       //     else if (isObject(utils.value)) {
  //       //       item.utils.remove();
  //       //       utils.value[item.utils.key] = item.utils.value;
  //       //     }
  //       //   },
  //       //   over(component, item) {
  //       //     var clientPos = dragDropContext.getCurrentOffsetFromClient();
  //       //     var node = React.findDOMNode(component);
  //       //     var br = node.getBoundingClientRect();
  //       //     var y = clientPos.y - br.top;
  //       //     var pos = y / br.height;
  //       //
  //       //     var dropPosition = 'in';
  //       //
  //       //     var utils = createUtils(component);
  //       //     var {canDropAround} = component.props;
  //       //
  //       //     if (canDropAround) {
  //       //
  //       //       if (pos < 0.2) {
  //       //         let idx = getIdx(utils, 'before');
  //       //         if (canDropAround(utils, item.utils, idx)) {
  //       //           dropPosition = 'befor';
  //       //         }
  //       //       }
  //       //       else if (pos > 0.8) {
  //       //         let idx = getIdx(utils, 'after');
  //       //         if (canDropAround(utils, item.utils, idx)) {
  //       //           dropPosition = 'after';
  //       //         }
  //       //       }
  //       //     }
  //       //
  //       //     component.setState({dropPosition});
  //       //   },
  //       //   leave(component) {
  //       //     component.setState({dropPosition: undefined});
  //       //   },
  //       //   drop(component) {
  //       //     component.setState({dropPosition: undefined});
  //       //   }
  //       // }
  //     // });
  //   }
  // },
  // hasChildren() {
  //   var value = this.props.value;
  //   return isObject(value) && Object.keys(value).length > 0;
  // },

  getChildren() {

    if (has(this.props.settings, 'children')) {

      return this.props.settings.children;
    }
    else if (isObject(this.props.value)) {

      return this.props.value;
    }
  },

  onClickOpenToggle() {

    this.setState({opened: !this.state.opened});
  },
  update(value, utils) {

    utils.value = value;
  },

  tooltipContent() {
    return this.props.settings.tooltip || 'This is a tooltip';
  },

  canDrop(utils, item, idx) {

    var {canDrop} = this.props.settings;

    if (canDrop && canDrop(utils, item, idx)) {
      return true;
    }
  },

  acceptDrop(utils, item, idx) {

    var {acceptDrop} = this.props.settings;

    if (acceptDrop) {
      acceptDrop(utils, item, idx);
    }
    else {
      //TODO accept drop
    }
  },

  render () {

    var {settings, hideHead, indent} = this.props;

    if (settings.Component) {
      return <settings.Component {...this.props}/>;
    }

    var items = {};
    var children = this.getChildren();

    var styleBlock = defaults({
      marginTop: this.state.marginTop,
      marginBottom: this.state.marginBottom,
    }, settings.highlighted ? styles.lineGroup : styles.line);

    //indent
    items.indent = <span style={{width: indent*5, backgroundColor: style.palette.grey4}}/>;


    //label
    var styleLabel = assign({
      flex:1,
      // color: dropState.isDragging ? style.palette.purple : 'inherit',
      // backgroundColor: dropState.isHovering ? style.palette.blue : 'inherit',
    }, settings.labelStyle);

    items.label = <span style={styleLabel}>
      {settings.label || this.props.name}
    </span>;

    //input
    items.input = <Input
      {...assign({}, settings, settings.input)}
      value={this.props.value}
      path={this.props.path}
      onChange={this.update}/>;

    if (settings.inputs) {
      console.warn('settings.inputs is deprecated. Use settings.extraInputs instead!');
    }
    var extraInputs = settings.extraInputs || settings.inputs;
    if (extraInputs) {

      items.extraInputs = <span style={{flex: 1}}>

        {extraInputs.map((inputProps, idx) => {
          return <Input
            key={idx}
            {...inputProps}
            path={this.props.path}/>;
        })}
      </span>;
    }

    //buttons
    if (settings.buttons) {
      items.buttons = <Buttons
        hover = {this.state.hover}
        path = {this.props.path}
        buttons = {settings.buttons}/>;
    }

    //children
    if (this.state.opened) {
      items.children = <Children
        settings = {settings}
        value = {this.props.value}
        path = {this.props.path}
        children = {children}
        indent = {hideHead ? indent - 1 : indent}
        createAction = {this.context.createAction}/>;
    }

    //show/hide toggle btn

    items.toggle = <Icon
      icon={children ? (this.state.opened ? 'chevron-down' : 'chevron-right') : ' '}
      onClick={children ? this.onClickOpenToggle : null}
      style={{margin:'0 4px'}}/>;

    if (this.state.dropPosition) {

      let pos = this.state.dropPosition;

      var s = {
        position: 'absolute',
        width: '100%',
        left: 0,
        height: pos === 'in' ? '100%' : '6px',
        [pos === 'after' ? 'bottom' : 'top']: 0,
        backgroundColor: style.palette.green,
        opacity: 0.3
      };

      items.dropEffect = <div style={s}/>;
    }

    var renderItem = () => {

      return hideHead ? null : <DropLayer
        style={styleBlock}
        onMouseEnter={() => this.setState({hover: true})}
        onMouseLeave={() => this.setState({hover: false})}
        onClick={()=>{
          if (settings.onClick) {
            var utils = this.context.createUtils(this.props.path);
            settings.onClick(utils);
          }
        }}
        idx = {this.props.idx}
        path = {this.props.path}
        draggable = {this.props.settings.draggable}
        canDrop = {this.canDrop}
        acceptDrop = {this.acceptDrop}
        canDropAround = {this.props.canDropAround}
        acceptDropAround = {this.props.acceptDropAround}>

          {items.indent}
          {items.toggle}
          {items.label}
          {items.input}
          {items.extraInputs}
          {items.buttons}
      </DropLayer>;
    };

    return (
      <div hidden = {settings.hidden} style={{position: 'relative'}}>
        {renderItem()}
        {items.children}
      </div>
    );
  }
});


Children.handleItem(Item);
module.exports = Item;

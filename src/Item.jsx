var React = require('react');
var isObject = require('lodash/lang/isObject');
var has = require('lodash/object/has');
var defaults = require('lodash/object/defaults');
var assign = require('lodash/object/assign');
var Children = require('./Children');
var Input = require('./Input');
var Buttons = require('./Buttons');
var DropLayer = require('./DropLayer');
var Matter = require('react-matterkit');
var {Icon} = Matter;
var getStyles = Matter.utils.getStyles;

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

    var styleConfig = getStyles(this).get('config');

    var styleBlock = {
      marginTop: this.state.marginTop,
      marginBottom: this.state.marginBottom,
      position: 'relaitve',
      height: styleConfig.lineHeight,
      lineHeight: `${styleConfig.lineHeight}px`,
      display: 'flex',
      color: settings.highlighted ? styleConfig.palette.blue : styleConfig.palette.grey2,
      fontSize: '13px',
      backgroundColor: settings.highlighted ? styleConfig.palette.blue : styleConfig.palette.bg,
      borderBottom: 'solid 1px #1a1d21',
      boxSizing: 'border-box',
    };

    var items = {};
    var children = this.getChildren();

    //indent
    items.indent = <span
      style={{
        width: indent * 5,
        backgroundColor: styleConfig.palette.grey4}
      }/>;


    //label
    var styleLabel = assign({
      flex: 1,
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

    //extraInputs
    if (settings.extraInputs) {

      items.extraInputs = <span style={{flex: 1}}>

        {settings.extraInputs.map((inputProps, idx) => {
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
        backgroundColor: styleConfig.palette.green,
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

import shallowEqual from 'react-pure-render/shallowEqual';
import React from 'react';
import has from 'lodash/object/has';
import assign from 'lodash/object/assign';
import Input from './Input';
import Buttons from './Buttons';
import DropLayer from './DropLayer';
import Matter from 'react-matterkit';
var {Icon} = Matter;
var getStyles = Matter.utils.getStyles;

export default class Row extends React.Component {// eslint-disable-line no-shadow
  static contextTypes = {
    createAction: React.PropTypes.func.isRequired,
    createUtils: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      hover: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.value !== nextProps.value
    // var {props, state} = this;
    //
    // return !shallowEqual(props, nextProps) ||
    //   !shallowEqual(state, nextState) ||
    //   !shallowEqual(props.settings, nextProps.settigns);
  }

  update(value, utils) {

    utils.value = value;

    if (has(this.props.settings.input, 'onChange')) {

      let {onChange} = this.props.settings.input;

      if (typeof onChange === 'function') {
        onChange(value, utils);
      }
    }
  }

  tooltipContent() {
    return this.props.settings.tooltip || 'This is a tooltip';
  }

  canDrop(utils, item, idx) {

    var {canDrop} = this.props.settings;

    if (canDrop && canDrop(utils, item, idx)) {
      return true;
    }
  }

  acceptDrop(utils, item, idx) {

    var {acceptDrop} = this.props.settings;

    if (acceptDrop) {
      acceptDrop(utils, item, idx);
    }
    else {
      //TODO accept drop
    }
  }

  render () {

    var {settings, path, label, value, update, hasChildren,
      canDrop, acceptDrop, canDropAround, acceptDropAround,
      onClickOpenToggle} = this.props;
    var {hover} = this.state;

    if (settings.Component) {
      return <settings.Component {...this.props}/>;
    }

    var styleConfig = getStyles(this).get('config');

    var styleBlock = {
      position: 'relative',
      height: styleConfig.lineHeight + 3,
      lineHeight: `${styleConfig.lineHeight + 3}px`,
      display: 'flex',
      color: settings.highlighted ? styleConfig.palette.blue : styleConfig.palette.grey2,
      fontSize: '13px',
      backgroundColor: settings.highlighted ? styleConfig.palette.blue : styleConfig.palette.bg,
      borderBottom: 'solid 1px #1a1d21',
      boxSizing: 'border-box',
    };

    var items = {};


    //label
    var styleLabel = assign({
      flex: 1,
      // color: dropState.isDragging ? style.palette.purple : 'inherit',
      // backgroundColor: dropState.isHovering ? style.palette.blue : 'inherit',
    }, settings.labelStyle);

    items.label = <span style={styleLabel}>
      {settings.label || label}
    </span>;

    //input
    items.input = <Input
      {...assign({}, settings, settings.input)}
      value={value}
      path={path}
      onChange={update}/>;

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
        hover = {hover}
        path = {path}
        buttons = {settings.buttons}/>;
    }

    //show/hide toggle btn

    items.toggle = <Icon
      icon={hasChildren ? (this.state.opened ? 'chevron-down' : 'chevron-right') : ' '}
      onClick={hasChildren ? onClickOpenToggle : null}
      style={{margin: '0 4px'}}/>;


    return <DropLayer
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
      draggable = {settings.draggable}
      canDrop = {canDrop}
      acceptDrop = {acceptDrop}
      canDropAround = {canDropAround}
      acceptDropAround = {acceptDropAround}>

        {items.toggle}
        {items.label}
        {items.input}
        {items.extraInputs}
        {items.buttons}
    </DropLayer>;
  }
}

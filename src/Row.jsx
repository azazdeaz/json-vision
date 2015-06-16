import React from 'react';
import assign from 'lodash/object/assign';
import Input from './Input';
import Buttons from './Buttons';
import DropLayer from './DropLayer';
import Matter from 'react-matterkit';
var {Icon} = Matter;
var getStyles = Matter.utils.getStyles;

export default class Row extends React.Component {// eslint-disable-line no-shadow
  constructor(props) {
    super(props);

    this.state = {
      hover: false,
    };
  }

  render () {
    var {leaf, opened, hasChildren, onClickOpenToggle} = this.props;
    var {settings} = leaf;
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
      {settings.label}
    </span>;

    //input
    items.input = <Input
      {...settings.input}
      leaf = {leaf}
      onChange = {(value, utils) => leaf.update(value, utils)}/>;

    //extraInputs
    if (settings.extraInputs) {

      items.extraInputs = <span style={{flex: 1}}>

        {settings.extraInputs.map((inputProps, idx) => {
          return <Input
            key = {idx}
            {...inputProps}
            leaf = {leaf}/>;
        })}
      </span>;
    }

    //buttons
    if (settings.buttons) {
      items.buttons = <Buttons
        hover = {hover}
        leaf = {leaf}
        buttons = {settings.buttons}/>;
    }

    //show/hide toggle btn
    items.toggle = <Icon
      icon={hasChildren ? (opened ? 'chevron-down' : 'chevron-right') : ' '}
      onClick={hasChildren ? onClickOpenToggle : null}
      style={{margin: '0 4px'}}/>;


    return <DropLayer
      style={styleBlock}
      onMouseEnter={() => this.setState({hover: true})}
      onMouseLeave={() => this.setState({hover: false})}
      onClick={()=>{
        if (settings.onClick) {
          settings.onClick(leaf.utils);
        }
      }}
      leaf = {leaf}
      draggable = {settings.draggable}>
        {items.toggle}
        {items.label}
        {items.input}
        {items.extraInputs}
        {items.buttons}
    </DropLayer>;
  }
}

var React = require('react');
var colors = require('colors.css');
var _ = require('lodash');
var {DragDropMixin} = require('react-dnd');
var style = require('./style');
var Button = require('./Button.jsx');
var Icon = require('./Icon.jsx');

const DND_TYPE = 'json-vision-drag-type';

var key = 0;

var styles = {
  root: {
    background: 'rgba(255,255,255,.34)',
    color: '#191D21',
    fontFamily: 'Open Sans',
    fontWeight: '300',
    borderRadius: '1px',
    margin: '3px',
    // boxShadow: '0 0 1px #000',
    // overflow: 'hidden',
  }
};

var JsonVisionItem = React.createClass({
  mixins: [DragDropMixin],
  getInitialState () {

    return {opened: true};
  },
  statics: {
    configureDragDrop(register) {
        register(DND_TYPE, {

          dragSource: {
            beginDrag(component) {
              // console.log('begin drag', component.fullPath)
              return {
                item: {
                  path: component.fullPath,
                  name: component.props.name,
                },
              };
            }
          },

          dropTarget: {
            acceptDrop(component, item, e, isHandled) {

              if (isHandled){console.log('isHandled', component.props.path);return;}
              else {console.log('isNotHandled', component.props.path);}
              console.log('acceptDrop', component, item);

              component.props.report({
                type: 'set',
                path: component.props.path + '/' + item.name,
                value: component.props.getByPath(item.path).value
              });

              component.props.report({
                type: 'delete',
                path: item.path,
              });
            },
            canDrop(component, item) {

              return typeof(component.props.data) === 'object';
            }
            // enter(component, item) {console.log('enter', component, item);},
            // leave(component, item) {console.log('leave', component, item);},
            // over(component, item) {console.log('over', component, item);},
          }
        });
    }
  },
  hasChildren () {

    var data = this.props && this.props.data;
    return typeof(data) === 'object' && Object.keys(data).length > 0;
  },
  onClickOpenToggle () {

    this.setState({opened: !this.state.opened});
  },
  update (value) {

    this.props.report({
      type: 'set',
      path: this.fullPath,
      value: value
    });
  },
  onBtnClick (btn) {

    if (typeof(btn.onClick) === 'string') {

      if (btn.onClick === 'delete') {

        this.props.report({
          path: this.fullPath,
          type: 'delete',
        });
      }
    }
    else {
      btn.onClick(this.fullPath);
    }
  },
  render () {
    this.fullPath = this.props.path ? this.props.path+'/'+this.props.name : this.props.name;
    this.settings = this.props.getSettings(this.props.data);

    var items = {},
      dragState = this.getDragState(DND_TYPE),
      dropState = this.getDropState(DND_TYPE);

    var styleBlock = _.defaults({
      opacity: dragState.isDragging ? 0.4 : 1,
    }, this.hasChildren() ? style.lineGroup : style.line);

    var styleLabel = {
      flex:1,
      color: dropState.isDragging ? colors.blue : 'inherit',
      backgroundColor: dropState.isHovering ? colors.aqua : 'inherit',
    };

    //indent
    this.props.indent = this.props.indent || 0;
    items.indent = <span style={{width:this.props.indent*20}}/>;


    //show/hide toggle btn
    items.toggle = <Icon
      icon={this.hasChildren() ? (this.state.opened ? 'chevron-down' : 'chevron-right') : 'minus'}
        onClick={this.hasChildren() ? this.onClickOpenToggle : null}
        style={{margin:'0 4px'}}/>;


    //label
    items.label = <span style={styleLabel}>{this.settings.label || this.props.name}</span>;

    //input or children
    if (typeof(this.props.data) === 'object') {

      items.children = <div style={{display: this.state.opened ? 'block' : 'none'}}>

        {Object.keys(this.props.data).map(function(name, idx, arr) {

          return <JsonVisionItem
            key = {this.fullPath + '/' + name}
            indent = {this.props.indent + 1}
            name = {name}
            path = {this.fullPath}
            data = {this.props.data[name]}
            getSettings = {this.props.getSettings}
            report = {this.props.report}
            getByPath = {this.props.getByPath}/>;
        }, this)}
      </div>;
    }
    else {
      if (this.settings.type === 'dropdown' || _.isArray(this.settings.options)) {

        items.input = <Dropdown
          update={v=>this.update(v)}
          options={this.settings.options}
          value={this.props.data}/>;
      }
      else if (this.settings.type === 'checkbox') {
        items.input = <CheckboxComponent
          update={v=>this.update(v)}
          value={this.props.data} />;
      }
      else if (typeof(this.props.data) === 'function') {
        items.input = <Button
          icon={this.settings.icon}
          text={this.settings.text || this.props.data.name || 'Button'}
          onClick={this.props.data}
          colored={this.settings.colored}/>;
      }
      else {
        items.input = <InputComponent
          update={v=>this.update(v)}
          value={this.props.data} />;
      }
    }

    //buttons
    if (this.settings.buttons) {
      items.buttons = <div>
        {this.settings.buttons.map(btn => <Button {...btn} key={++key} onClick={() => this.onBtnClick(btn)}/>)}
      </div>;
    }

    //tooltips
    if (this.settings.tooltip) {
      items.tooltip = <Tooltip text={this.settings.tooltip}/>;
    }

    return (
      <div {...this.dropTargetFor(DND_TYPE)}>
        <div style={styleBlock} {...this.dragSourceFor(DND_TYPE)}>
          {items.tooltip}
          {items.indent}
          {items.toggle}
          {items.label}
          {items.input}
          {items.buttons}
        </div>
        {items.children}
      </div>
    );
  }
});

var InputComponent = React.createClass({

  getInitialState() {
    return {
      disabled: false,
      error: false,
      focus: false,
      hover: false,
    };
  },
  onMouseEnter() { this.setState({hover: true}); },
  onMouseLeave() { this.setState({hover: false}); },
  onFocus() { this.setState({focus: true}); },
  onBlur() { this.setState({focus: false}); },
  render: function () {

    var s = style.input;
    if (this.state.disabled) s = style.inputDisabled;
    else if (this.state.error) s = style.inputError;
    else if (this.state.focus) s = style.inputActive;
    else if (this.state.hover) s = style.inputHover;

    return <input
      type="text"
      defaultValue = {this.props.value}
      style = {s}
      onChange = {e => this.props.update(e.target.name)}
      onMouseEnter = {this.onMouseEnter}
      onMouseLeave = {this.onMouseLeave}
      onBlur = {this.onBlur}
      onFocus = {this.onFocus}
      disabled = {this.state.disabled}
    ></input>;
  }
});

var CheckboxComponent = React.createClass({
  render: function () {
    return <input
      type="checkbox"
      defaultChecked = {this.props.value}
      style = {_.defaults({margin: '5px'}, styles.input)}
      onChange = {e => this.props.update(e.target.name)}
    ></input>;
  }
});

// var SelectComponent = React.createClass({
//
//   render: function () {
//     return <select
//       style = {styles.input}
//       defaultValue = {this.props.value}
//       onInput = {e => this.props.update(e.target.value)}>
//       {this.props.options.map(o => <option key={++key}value={o}>{o}</option>)}
//     </select>;
//   }
// });

var Dropdown = React.createClass({

  getInitialState() {
    return {
      open: false,
      hover: false,
    };
  },

  onMouseEnter() { this.setState({hover: true}); },
  onMouseLeave() { this.setState({hover: false}); },
  onFocus() {
    this.setState({open: true});
    // setTimeout(() => {//!hack
      this.refs.head.getDOMNode().addEventListener('mousedown', this.onCloseClick);
    // });
  },
  onBlur() {
    this.setState({open: false});
    this.refs.head.getDOMNode().removeEventListener('mousedown', this.onCloseClick);
  },
  onCloseClick(e) {
    this.getDOMNode().blur();
  },
  render() {

    var s;
    if (this.state.open) {

      let height = style.itemHeight * (this.props.options.length + 1);
      s = _.defaults({height}, style.dropdownOpen);
    }
    else if (this.state.hover) s = style.dropdownHover;
    else s = style.dropdown;

    return <div
      ref="head"
      style = {s}
      tabIndex = "0"
      onMouseEnter = {this.onMouseEnter}
      onMouseLeave = {this.onMouseLeave}
      onBlur = {this.onBlur}
      onFocus = {this.onFocus}
    >
      <div style={{padding: '0 8px'}}>
        {this.props.value}
        <Icon
          style={{marginLeft: 4}}
          lineHeight={style.itemHeightPX}
          icon={this.state.open ? 'chevron-up' : 'chevron-down'}/>
      </div>

      {this.props.options.map(value => {
        return <DropdownItem
          value={value}
          onClick={()=>{
            this.props.update(value);
            this.getDOMNode().blur();
            }}/>;
      })}
    </div>;
  }
});

var DropdownItem = React.createClass({

  getInitialState() {
    return { hover: false };
  },

  onMouseEnter() { this.setState({hover: true}); },
  onMouseLeave() { this.setState({hover: false}); },
  render() {

    var s;
    if (this.state.hover) s = style.dropdownItemHover;
    else s = style.dropdownItem;

    return <div
      style = {s}
      onMouseEnter = {this.onMouseEnter}
      onMouseLeave = {this.onMouseLeave}
      onClick={this.props.onClick}
    >
      {this.props.value}
    </div>;
  }
});


var Tooltip = React.createClass({

  render: function () {
    return <div style={{
      pointerEvents: 'none',
      position: 'absolute',
      width: 0,
      left: -5,
    }}>
      <div style={{
        position: 'absolute',
        width: 231,
        right: 0,
        background: 'rgba(255,255,255,.34)',
      }}> {this.props.text} </div>
    </div>;
  },
});

module.exports = JsonVisionItem;

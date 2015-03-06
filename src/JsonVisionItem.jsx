var React = require('react');
var _ = require('lodash');
var {DragDropMixin} = require('react-dnd');

var style = require('./react-matterkit/style');
var Button = require('./react-matterkit/Button.jsx');
var Icon = require('./react-matterkit/Icon.jsx');
var StringInput = require('./react-matterkit/StringInput.jsx');
var NumberInput = require('./react-matterkit/NumberInput.jsx');
var Slider = require('./react-matterkit/Slider.jsx');
var Dropdown = require('./react-matterkit/Dropdown.jsx');
var Base = require('./react-matterkit/Base.jsx');

const DND_TYPE = 'json-vision-drag-type';

var key = 0;

var styles = {
  root: {
    background: 'rgba(255,255,255,.34)',
    color: '#191D21',
    fontFamily: style.fontFamily,
    fontWeight: style.fontWeight,
    borderRadius: '1px',
    margin: '3px',
    // boxShadow: '0 0 1px #000',
    // overflow: 'hidden',
  }
};

var JsonVisionItem = React.createClass({
  mixins: [/*DragDropMixin*/],
  getInitialState () {

    return {opened: true};
  },
  getDefaultProps() {
    return {
      path: '',
      value: null,
    };
  },
  statics: {
    configureDragDrop(register) {
      register(DND_TYPE, {

        dragSource: {
          beginDrag(component) {
            // console.log('begin drag', component.fullPath)
            return {
              item: {
                component: component,
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
              object: component.props.parentObject,
              key: component.props.name,
              value: component.props.value
            });

            component.props.report({
              type: 'delete',
              object: component.props.parentObject,
              key: component.props.name,
            });
          },
          canDrop(component, item) {

            return component.hasChildren();
          }
          // enter(component, item) {console.log('enter', component, item);},
          // leave(component, item) {console.log('leave', component, item);},
          // over(component, item) {console.log('over', component, item);},
        }
      });
    }
  },
  hasChildren () {

    var value = this.props.value;
    return _.isObject(value) && Object.keys(value).length > 0;
  },
  onClickOpenToggle () {

    this.setState({opened: !this.state.opened});
  },
  update (value) {

    this.props.report({
      type: 'set',
      object: this.props.parentObject,
      key: this.props.name,
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
  tooltipContent() {
    return this.settings.tooltip || 'This is a tooltip';
  },
  render () {
    this.settings = this.props.getSettings(this.props.path);

    var items = {},
      dragState = {},//this.getDragState(DND_TYPE),
      dropState = {};//this.getDropState(DND_TYPE);

    var styleBlock = _.defaults({
      opacity: dragState.isDragging ? 0.4 : 1,
    }, this.hasChildren() ? style.lineGroup : style.line);

    var styleLabel = {
      flex:1,
      color: dropState.isDragging ? style.palette.purple : 'inherit',
      backgroundColor: dropState.isHovering ? style.palette.blue : 'inherit',
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
    if (_.isObject(this.props.value)) {

      items.children = <div style={{display: this.state.opened ? 'block' : 'none'}}>

        {Object.keys(this.props.value).map(function(key, idx) {

          return <JsonVisionItem
            key = {key}
            name = {key}
            path = {this.props.path + '.' + key}
            indent = {this.props.indent + 1}
            parentObject = {this.props.value}
            value = {this.props.value[key]}
            getSettings = {this.props.getSettings}
            report = {this.props.report}/>;
        }, this)}
      </div>;
    }
    else {

      let numberInp = () => items.input = <NumberInput
        onChange={v=>this.update(v)}
        value={this.props.value} />;

      let stringInp = () => items.input = <StringInput
        onChange={v=>this.update(v)}
        value={this.props.value} />;

      if (this.settings.type === 'dropdown' || _.isArray(this.settings.options)) {

        items.input = <Dropdown
          onChange={v=>this.update(v)}
          options={this.settings.options}
          value={this.props.value}/>;
      }
      else if (this.settings.type === 'checkbox') {
        items.input = <CheckboxComponent
          onChange={v=>this.update(v)}
          value={this.props.value} />;
      }
      else if (this.settings.type === 'slider') {
        items.input = <Slider
          onChange={v=>this.update(v)}
          value={this.props.value} />;
      }
      else if (this.settings.type === 'number') {
        numberInp();
      }
      else if (this.settings.type === 'string') {
        stringInp();
      }
      else if (typeof(this.props.value) === 'function') {
        items.input = <Button
          icon={this.settings.icon}
          text={this.settings.text || this.props.value.name || 'Button'}
          onClick={this.props.value}
          colored={this.settings.colored}/>;
      }
      else if (typeof(this.props.value) === 'number') {
        numberInp();
      }
      else {
        stringInp();
      }
    }

    //buttons
    if (this.settings.buttons) {
      items.buttons = <span>
        {this.settings.buttons.map(btn => <span style={{float:'left'}}>
            <Button {...btn} key={++key} onClick={() => this.onBtnClick(btn)}/>
          </span>)}
      </span>;
    }

    return (
      <div>
        <Base tooltip={this.settings.tooltip} contextMenu={this.settings.dropdownMenu} style={styleBlock}>
          {items.indent}
          {items.toggle}
          {items.label}
          {items.input}
          {items.buttons}
        </Base>
        {items.children}
      </div>
    );
  }
});

var CheckboxComponent = React.createClass({
  render: function () {
    return <input
      type="checkbox"
      defaultChecked = {this.props.value}
      style = {_.defaults({margin: '5px'}, styles.input)}
      onChange = {e => this.props.update(e.target.checked)}
    ></input>;
  }
});


module.exports = JsonVisionItem;

var React = require('react');
var _ = require('lodash');
var isObject = require('lodash/lang/isObject');
var has = require('lodash/object/has');
var FuncUtil = require('./FuncUtil');
// var {DragDropMixin} = require('react-dnd');

var {style, Button, Icon, StringInput, NumberInput, Slider, Dropdown, Checkbox, Base} = require('react-matterkit');

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
  contextTypes: {
    getSettings: React.PropTypes.func.isRequired,
  },
  getInitialState () {

    return {opened: true};
  },
  getDefaultProps() {
    return {
      path: [],
      value: null,
      indent: 0,
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

            component.props.createAction({
              type: 'set',
              object: component.props.parentObject,
              key: component.props.name,
              value: component.props.value
            });

            component.props.createAction({
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
  hasChildren() {

    var value = this.props.value;
    return _.isObject(value) && Object.keys(value).length > 0;
  },
  onClickOpenToggle() {

    this.setState({opened: !this.state.opened});
  },
  update (value) {

    this.props.createAction({
      type: 'set',
      object: this.props.parentObject,
      key: this.props.name,
      value: value
    });
  },
  onBtnClick (btn) {

    if (typeof(btn.onClick) === 'string') {

      if (btn.onClick === 'delete') {

        this.props.createAction({
          path: this.fullPath,
          type: 'delete',
        });
      }
    }
    else {
      btn.onClick.call(new FuncUtil(this.props.path ));
    }
  },
  tooltipContent() {
    return this.settings.tooltip || 'This is a tooltip';
  },

  renderChildren() {

    var children = has(this.settings, 'children') ?
      this.settings.children :
      (isObject(this.props.value) && this.props.value);

    if (this.state.opened && children) {

      return Object.keys(children).map(key => {

        var value = children[key];

        return <JsonVisionItem
          key = {key}
          name = {key}
          value = {value}
          parentObject = {children}
          path = {this.props.path.concat([key, value])}
          indent = {this.props.indent + 1}
          createAction = {this.props.createAction}/>;
      }, this);
    }
  },

  renderInput() {

    if (isObject(this.props.value)) {
      return null;
    }

    var input;

    var numberInp = () => input = <NumberInput
      onChange={v=>this.update(v)}
      value={this.props.value} />;

    var stringInp = () => input = <StringInput
      onChange={v=>this.update(v)}
      value={this.props.value} />;

    if (this.settings.type === 'dropdown' || _.isArray(this.settings.options)) {

      input = <Dropdown
        onChange={v=>this.update(v)}
        options={this.settings.options}
        value={this.props.value}/>;
    }
    else if (this.settings.type === 'checkbox') {
      input = <Checkbox
        onChange={v=>this.update(v)}
        value={this.props.value} />;
    }
    else if (this.settings.type === 'slider') {
      input = <Slider
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
      input = <Button
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

    return input;
  },

  render () {
    this.settings = this.context.getSettings(this.props.path);

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
    items.indent = <span style={{width:this.props.indent*5, backgroundColor: style.palette.grey4}}/>;


    //show/hide toggle btn
    items.toggle = <Icon
      icon={this.hasChildren() ? (this.state.opened ? 'chevron-down' : 'chevron-right') : ' '}
        onClick={this.hasChildren() ? this.onClickOpenToggle : null}
        style={{margin:'0 4px'}}/>;


    //label
    items.label = <span style={styleLabel}>{this.settings.label || this.props.name}</span>;


    items.children = this.renderChildren();
    items.input = this.renderInput();

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



module.exports = JsonVisionItem;

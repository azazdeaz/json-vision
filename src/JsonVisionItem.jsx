var React = require('react');
var _ = require('lodash');
var isObject = require('lodash/lang/isObject');
var has = require('lodash/object/has');
var FuncUtil = require('./FuncUtil');
var Children = require('./Children');
// var {DragDropMixin} = require('react-dnd');

var {style, Button, Icon, Input, Slider, Dropdown, Checkbox, Base} = require('react-matterkit');

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

var Item = React.createClass({
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

  // renderChildren() {
  //
  //   var children = has(this.settings, 'children') ?
  //     this.settings.children :
  //     (isObject(this.props.value) && this.props.value);
  //
  //   if (this.state.opened && children) {
  //
  //     var keys = true ?
  //       keysIn(children) : Object.keys(children);
  //
  //     return keys.map((key, idx) => {
  //
  //       var {whitelist, blacklist} = this.settings;
  //       if (whitelist && !includes(whitelist, key)) return;
  //       if (blacklist && includes(whitelist, key)) return;
  //
  //       var value = children[key];
  //
  //       return <Item
  //         key = {key}
  //         name = {key}
  //         value = {value}
  //         parentObject = {children}
  //         path = {this.props.path.concat([key, value])}
  //         indent = {this.props.indent + 1}
  //         createAction = {this.props.createAction}/>;
  //     }, this);
  //   }
  // },

  renderInput() {

    if (isObject(this.props.value)) {
      return null;
    }

    var input;

    var createInput = (type) => input = <Input
      type={type}
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
      createInput('number');
    }
    else if (this.settings.type === 'string') {
      createInput('text');
    }
    else if (typeof(this.props.value) === 'function') {
      input = <Button
        icon={this.settings.icon}
        text={this.settings.text || this.props.value.name || 'Button'}
        onClick={this.props.value}
        colored={this.settings.colored}/>;
    }
    else if (typeof(this.props.value) === 'number') {
      createInput('number');
    }
    else {
      createInput('text');
    }

    return input;
  },

  render () {
    this.settings = this.context.getSettings(this.props.path);

    // var fu = new FuncUtil(this.props.path)
    // console.log('render item', fu.fullPath, fu.value;

    var items = {},
      dragState = {},//this.getDragState(DND_TYPE),
      dropState = {};//this.getDropState(DND_TYPE);

    var styleBlock = _.defaults({
      opacity: dragState.isDragging ? 0.4 : 1,
    }, this.settings.highlighted ? style.lineGroup : style.line);

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


    items.input = this.renderInput();

    //buttons
    if (this.settings.buttons) {
      items.buttons = <span key='buttons'>
        {this.settings.buttons.map(btn => <span style={{float:'left'}} key={++key}>
            <Button {...btn} onClick={() => this.onBtnClick(btn)}/>
          </span>)}
      </span>;
    }

    return (
      <div>
        <div
          tooltip={this.settings.tooltip}
          contextMenu={this.settings.dropdownMenu}
          style={styleBlock}
          onClick={()=>{
            if (this.settings.onClick) {

              var scope = new FuncUtil(this.props.path);
              this.settings.onClick.call(scope);
            }
          }}>

          {items.indent}
          {items.toggle}
          {items.label}
          {items.input}
          {items.buttons}
        </div>

        {this.state.opened ? <Children
          settings = {this.settings}
          value = {this.props.value}
          path = {this.props.path}
          indent = {this.props.indent}
          createAction = {this.props.createAction}/> : null}

      </div>
    );
  }
});


Children.handleItem(Item);
module.exports = Item;

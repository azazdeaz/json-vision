var React = require('react');
var isObject = require('lodash/lang/isObject');
var has = require('lodash/object/has');
var defaults = require('lodash/object/defaults');
var FuncUtil = require('./FuncUtil');
var Children = require('./Children');
var Input = require('./Input');
var {DragDropMixin} = require('react-dnd');

var {style, Button, Icon} = require('react-matterkit');

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

  mixins: [DragDropMixin],

  contextTypes: {
    createAction: React.PropTypes.func.isRequired,
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
            return {
              item: {
                key: component.props.key,
              },
            };
          }
        },

        dropTarget: {
          acceptDrop(component, item, e, isHandled) {

            component.props.sort(item.key, component.props.key);
          }
        }
      });
    }
  },
  hasChildren() {

    var value = this.props.value;
    return isObject(value) && Object.keys(value).length > 0;
  },
  onClickOpenToggle() {

    this.setState({opened: !this.state.opened});
  },
  update (value) {

    this.context.createAction({
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
    else if (typeof(btn.onClick) === 'function') {
      btn.onClick.call(new FuncUtil(this.props.path));
    }
  },
  tooltipContent() {
    return this.settings.tooltip || 'This is a tooltip';
  },

  render () {
    this.settings = this.context.getSettings(this.props.path);

    // var fu = new FuncUtil(this.props.path)
    // console.log('render item', fu.fullPath, fu.value;

    var items = {},
      dragState = {},//this.getDragState(DND_TYPE),
      dropState = {};//this.getDropState(DND_TYPE);

    var styleBlock = defaults({
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

    console.log(this.props.path, this.settings);
    //input
    items.input = <Input
      path={this.props.path}
      settings={this.settings}
      value={this.props.value}
      update={this.update}/>;

    //buttons
    if (this.settings.buttons) {
      items.buttons = <span key='buttons'>
        {this.settings.buttons.map(btn => {

          if (!has(btn, 'kind')) btn.kind = 'stamp';

          return <span style={{float:'left'}} key={++key}>
            <Button {...btn} onClick={() => this.onBtnClick(btn)}/>
          </span>;
        })}
      </span>;
    }

    //children
    if (this.state.opened) {
      items.children = <Children
        settings = {this.settings}
        value = {this.props.value}
        path = {this.props.path}
        indent = {this.props.indent}
        createAction = {this.props.createAction}/>;
    }


    return (
      <div>
        <div
          {...this.dragSourceFor(DND_TYPE)}
          {...this.dropTargetFor(DND_TYPE)}
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
        {items.children}
      </div>
    );
  }
});


Children.handleItem(Item);
module.exports = Item;

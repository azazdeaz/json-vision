var React = require('react');
var isObject = require('lodash/lang/isObject');
var has = require('lodash/object/has');
var defaults = require('lodash/object/defaults');
var assign = require('lodash/object/assign');
var Children = require('./Children');
var Input = require('./Input');
var {DragDropMixin} = require('react-dnd');

var {style, Button, Icon, ButtonGroup} = require('react-matterkit');

const DND_TYPE = 'dnd';

var key = 0;

var styles = {
  root: {
    background: 'rgba(255,255,255,.34)',
    color: '#191D21',
    fontFamily: style.fontFamily,
    fontWeight: style.fontWeight,
    borderRadius: '1px',
    margin: '3px',
  }
};

var Item = React.createClass({

  mixins: [DragDropMixin],

  contextTypes: {
    getSettings: React.PropTypes.func.isRequired,
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
  statics: {
    configureDragDrop(register) {

      register(DND_TYPE, {

        dragSource: {
          beginDrag(component) {

            function getDragPreview() {

              if (component.settings.getDragPreview) {

                let {path} = component.props;
                let {createUtils} = component.context;
                let utils = createUtils(path);
                let dragPreview = component.settings.getDragPreview(utils);

                //hack
                var dp = document.querySelector('#drag-preview');

                if (!dp) {
                  dp = document.createElement('div');
                  dp.id = 'drag-preview';
                  dp.style.width = 0;
                  dp.style.height = 0;
                  dp.style.overflow = 'hidden';
                  document.body.appendChild(dp);
                }

                dp.appendChild(dragPreview);

                component._dragPreview = dragPreview;

                return dragPreview;
              }
            }

            return {
              item: {
                idx: component.props.idx,
                value: component.props.value,
              },
              dragPreview: getDragPreview(),
            };
          },

          canDrag(component) {
            return component.props.draggable;
          },

          endDrag(component) {

            var dragPreview = component._dragPreview;

            if (dragPreview && dragPreview.parentNode) {
              dragPreview.parentNode.removeChild(dragPreview);
            }
          }
        },

        dropTarget: {
          acceptDrop(component, item, isHandled) {

            component.props.sort(item.idx, component.props.idx);

            if (item.dragPreview && item.dragPreview.parentNode) {
              item.dragPreview.parentNode.removeChild(item.dragPreview);
            }
          },
          enter(component, item) {

            if (item.idx > component.props.idx) {
              // component.setState({marginTop: 32});
            }
            else if (item.idx < component.props.idx) {
              // component.setState({marginBottom: 32});
            }
          },
          leave(component) {
            // component.setState({
            //   marginTop: 0,
            //   marginBottom: 0,
            // });
          }
        }
      });
    }
  },
  // hasChildren() {
  //   var value = this.props.value;
  //   return isObject(value) && Object.keys(value).length > 0;
  // },

  getChildren() {

    if (has(this.settings, 'children')) {

      return this.settings.children;
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

  onBtnClick (btn) {

    if (typeof(btn.onClick) === 'string') {

      if (btn.onClick === 'delete') {

        this.context.createAction({
          path: this.fullPath,
          type: 'delete',
        });
      }
    }
    else if (typeof(btn.onClick) === 'function') {
      var utils = this.context.createUtils(this.props.path);
      btn.onClick(utils);
    }
  },

  tooltipContent() {
    return this.settings.tooltip || 'This is a tooltip';
  },

  render () {

    this.settings = this.context.getSettings(this.props.path);

    var items = {},
      children = this.getChildren(),
      dragState = this.getDragState(DND_TYPE),
      dropState = this.getDropState(DND_TYPE);

    var styleBlock = defaults({
      marginTop: this.state.marginTop,
      marginBottom: this.state.marginBottom,
      opacity: dragState.isDragging ? 0.4 : 1,
    }, this.settings.highlighted ? style.lineGroup : style.line);

    //indent
    items.indent = <span style={{width:this.props.indent*5, backgroundColor: style.palette.grey4}}/>;


    //label
    var styleLabel = assign({
      flex:1,
      // color: dropState.isDragging ? style.palette.purple : 'inherit',
      // backgroundColor: dropState.isHovering ? style.palette.blue : 'inherit',
    }, this.settings.labelStyle);

    items.label = <span style={styleLabel}>
      {this.settings.label || this.props.name}
    </span>;

    //input
    items.input = <Input
      path={this.props.path}
      settings={this.settings}
      value={this.props.value}
      type={this.settings.type}
      min={this.settings.min}
      max={this.settings.max}
      hints={this.settings.hints}
      options={this.settings.options}
      label={this.settings.label}
      icon={this.settings.icon}
      types={this.settings.types}
      chooseType={this.settings.chooseType}
      onChange={this.update}/>;

    if (this.settings.inputs) {
      items.extraInputs = <span style={{flex: 1}}>
        {this.settings.inputs.map((inputProps, idx) => {
          return <Input
            {...inputProps}
            path={this.props.path}
            key={idx}/>;
        })}
      </span>;
    }

    //buttons
    if (this.settings.buttons) {
      items.buttons = <ButtonGroup>
        {this.settings.buttons.map(btn => {

          if (!has(btn, 'kind')) btn.kind = 'stamp';

          var s = assign({}, btn.style);
          if (btn.hideWhenLeaved && !this.state.hover) s.visibility = 'hidden';

          return <Button
            {...btn}
            style={s}
            onClick={() => this.onBtnClick(btn)}/>;
        })}
      </ButtonGroup>;
    }

    //children
    if (this.state.opened) {
      items.children = <Children
        settings = {this.settings}
        value = {this.props.value}
        path = {this.props.path}
        children = {children}
        indent = {this.props.indent}
        createAction = {this.context.createAction}/>;
    }

    //show/hide toggle btn
    
    items.toggle = <Icon
      icon={children ? (this.state.opened ? 'chevron-down' : 'chevron-right') : ' '}
      onClick={children ? this.onClickOpenToggle : null}
      style={{margin:'0 4px'}}/>;

    return (
      <div>
        <div
          {...this.dragSourceFor(DND_TYPE)}
          {...this.dropTargetFor(DND_TYPE)}
          tooltip={this.settings.tooltip}
          contextMenu={this.settings.dropdownMenu}
          style={styleBlock}
          onMouseEnter={() => this.setState({hover: true})}
          onMouseLeave={() => this.setState({hover: false})}
          onClick={()=>{
            if (this.settings.onClick) {

              var utils = this.context.createUtils(this.props.path);
              this.settings.onClick(utils);
            }
          }}>

          {items.indent}
          {items.toggle}
          {items.label}
          {items.input}
          {items.extraInputs}
          {items.buttons}
        </div>
        {items.children}
      </div>
    );
  }
});


Children.handleItem(Item);
module.exports = Item;

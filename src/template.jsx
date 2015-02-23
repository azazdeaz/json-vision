var React = require('react');
var colors = require('colors.css');
var _ = require('lodash');
var {DragDropMixin} = require('react-dnd');
var {Typeahead} = require('react-typeahead');

const DND_TYPE = 'json-vision-drag-type';

var key = 0;
var greys = {
  text1: '#96A6AD',
  text2: '#D8DDE1',
};

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
  },
  input: {
    background: 'rgba(23,27,24,.23)',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    color: 'inherit',
    border: 'none',
    padding: '0',
    paddingLeft: '2px',
    borderRadius: '0px',
    height: 21,
    margin: '0 3px',
    // boxShadow: '0 0 1px #000',
  },
};

var JEditComponent = React.createClass({

  getInitialState: function () {

    return {data: {}, styles: []};
  },
  getStyle: function (path) {

    var ret = {};

    this.state.styles.forEach(style => {

      if (style.selector.test(path)) {

        _.merge(ret, style);
      }
    });

    delete ret.selector;

    return ret;
  },
  render: function () {

    return(
      <div style={styles.root}>
        <JEditItem
          data = {this.state.data}
          path = {''}
          name = {this.props.name}
          report = {this.props.report}
          getByPath = {this.props.getByPath}
          getStyle = {this.getStyle} />
      </div>
    );
  }
});

var JEditItem = React.createClass({
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
    this.style = this.props.getStyle(this.fullPath);

    var children = '', input = '', buttons = '', tooltip = '';

    var dragState = this.getDragState(DND_TYPE),
      dropState = this.getDropState(DND_TYPE);

    var styleBlock = {
      // background: '#303338',
      width: '100%',
      display: 'flex',
      opacity: dragState.isDragging ? 0.4 : 1,
      height: 23,
    };

    var styleLabel = {
      flex:1,
      color: dropState.isDragging ? colors.blue : 'inherit',
      backgroundColor: dropState.isHovering ? colors.aqua : 'inherit',
    };

    this.props.indent = this.props.indent || 0;
    var indent = <span style={{width:this.props.indent*8}}/>;

    var label = <span style={styleLabel}>{this.style.label || this.props.name}</span>;

    if (typeof(this.props.data) === 'object') {

      children = <div style={{display: this.state.opened ? 'block' : 'none'}}>
        {Object.keys(this.props.data).map(function(name) {
           return <JEditItem
            key = {this.fullPath + '/' + name}
            indent = {this.props.indent + 1}
            name = {name}
            path = {this.fullPath}
            data = {this.props.data[name]}
            getStyle = {this.props.getStyle}
            report = {this.props.report}
            getByPath = {this.props.getByPath} />;
        }, this)}
      </div>;
    }
    else {
      if (this.style.type === 'select' || _.isArray(this.style.options)) {

        input = <SelectComponent
          update={v=>this.update(v)}
          options={this.style.options}
          value={this.props.data}/>;
      }
      else if (this.style.type === 'typeahead') {

        input = <InputTypeahead
          update={v=>this.update(v)}
          options={this.style.options}
          value={this.props.data}/>;
      }
      else if (this.style.type === 'checkbox') {
        input = <CheckboxComponent
          update={v=>this.update(v)}
          value={this.props.data} />;
      }
      else {
        input = <InputComponent
          update={v=>this.update(v)}
          value={this.props.data} />;
      }
    }

    if (this.style.buttons) {

      buttons = <div>
        {this.style.buttons.map(btn => <ButtonComponent {...btn} key={++key} onClick={() => this.onBtnClick(btn)}/>)}
      </div>;
    }

    if (this.style.tooltip) {
      tooltip = <Tooltip text={this.style.tooltip}/>;
    }

    return (
      <div {...this.dropTargetFor(DND_TYPE)}>
        <div style={styleBlock} {...this.dragSourceFor(DND_TYPE)}>
          {tooltip}
          {indent}
          <i className = {`fa fa-angle-${this.state.opened && this.hasChildren() ? 'down' : 'right'} fl-lg`}
            style = {{
              margin: '2px 4px 0 6px',
              visibility: this.hasChildren() ? 'visible' : 'hidden',
              width: '12px',
            }}
            onClick = {this.onClickOpenToggle}
            ></i>
          {label}
          {input}
          {buttons}
        </div>
        {children}
      </div>
    );
  }
});

var ButtonComponent = React.createClass({
  render: function () {
    return <i className = {`fa fa-${this.props.icon} fl-lg`}
      style = {{
        margin: '2px 4px 0 0',
        width: '12px',
      }}
      onClick = {this.props.onClick}
    ></i>;
  }
});

var InputComponent = React.createClass({
  render: function () {
    return <input
      type="text"
      defaultValue = {this.props.value}
      style = {styles.input}
      onChange = {e => this.props.update(e.target.name)}
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

var SelectComponent = React.createClass({

  render: function () {
    return <select
      style = {styles.input}
      defaultValue = {this.props.value}
      onInput = {e => this.props.update(e.target.value)}>
      {this.props.options.map(o => <option key={++key}value={o}>{o}</option>)}
    </select>;
  }
});

var InputTypeahead = React.createClass({

  render: function () {
    return <Typeahed
      style = {styles.input}
      placehonder = {this.props.value}
      options = {this.props.options}
      onKeyDown = {e => console.log('keyDown', e)}
      onOptionSelected = {e => console.log('onOptionSelected', e)}/>;
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
  }
});

module.exports = JEditComponent;

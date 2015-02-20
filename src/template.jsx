var React = require('react');
var colors = require('colors.css');
var _ = require('lodash');

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
          getStyle = {this.getStyle.bind(this)} />
      </div>
    );
  }
});

var JEditItem = React.createClass({
  getInitialState () {

    return {opened: true};
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
      type: 'update',
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

    var styleBlock = {
      // background: '#303338',
      width: '100%',
      display: 'flex',
      height: 23,
    };

    this.props.indent = this.props.indent || 0;
    var indent = <span style={{width:this.props.indent*8}}/>;

    var label = <span style={{flex:1}}>{this.style.label || this.props.name}</span>;

    if (typeof(this.props.data) === 'object') {

      children = <div style={{display: this.state.opened ? 'block' : 'none'}}>
        {Object.keys(this.props.data).map(function(name) {
           return <JEditItem
            key = {++key}
            indent = {this.props.indent + 1}
            name = {name}
            path = {this.fullPath}
            data = {this.props.data[name]}
            getStyle = {this.props.getStyle}
            report = {this.props.report} />;
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
        {this.style.buttons.map(btn => <ButtonComponent {...btn} onClick={() => this.onBtnClick(btn)}/>)}
      </div>;
    }

    if (this.style.tooltip) {
      tooltip = <Tooltip text={this.style.tooltip}/>;
    }

    return (
      <div>
        <div style={styleBlock}>
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
      {this.props.options.map(o => <option value={o}>{o}</option>)}
    </select>;
  }
});

var Tooltip = React.createClass({

  render: function () {
    return <div style={{
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

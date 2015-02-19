var React = require('react');
var colors = require('colors.css');
var _ = require('lodash');

var key = 0;

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

    var style = {
      background: colors.black,
      color: colors.aqua,
      fontFamily: 'Open Sans',
    };

    return(
      <div style={style}>
        <JEditItem
          data = {this.state.data}
          path = {''}
          name = {this.props.name}
          report = {this.props.report}
          getStyle = {this.getStyle.bind(this)}
        />
      </div>
    );
  }
});

var JEditItem = React.createClass({
  render: function() {

    var fullPath = this.props.path ? this.props.path+'/'+this.props.name : this.props.name,
      style = this.props.getStyle(fullPath);

    var children = '', input = '';

    var styleInput = {
      fontSize: 'inherit',
      fontFamily: 'inherit',
      color: style.textColor || 'inherit',
      background: 'none',
      border: 'none',
      padding: '0',
    };

    this.props.indent = this.props.indent || 0;
    var indent = <span style={{width:this.props.indent*8}}/>;

    if (typeof(this.props.data) === 'object') {

      children = <div>
        {Object.keys(this.props.data).map(function(name) {
           return <JEditItem
            key = {++key}
            indent = {this.props.indent + 1}
            name = {name}
            path = {fullPath}
            data = {this.props.data[name]}
            getStyle = {this.props.getStyle}
          />;
        }, this)}
      </div>;
    }
    else {
      input = <input
        type="text"
        defaultValue={this.props.data}
        style={styleInput}
        onInput = {e=>console.log('change', e.target.value)}
      ></input>;
    }

    return (
      <div>
        <div style={{width:'100%', display: 'flex'}}>
          {indent}
          <strong style={{flex:1}}>{this.props.name || 'obj name'}</strong>
          {input}
        </div>
        {children}
      </div>
    );
  }
});

module.exports = JEditComponent;

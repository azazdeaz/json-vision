var React = require('react');
var colors = require('colors.css');

var key = 0;

var JEditComponent = React.createClass({
  render: function () {

    var style = {
      background: colors.black,
      color: colors.aqua,
      fontFamily: 'Open Sans',
    };

    return(
      <div style={style}>
        <JEditItem {...this.props}/>
      </div>
    );
  }
});

var JEditItem = React.createClass({
  render: function() {

    var props = this.props;

    var children = '', input = '';

    var styleInput = {
      fontSize: 'inherit',
      fontFamily: 'inherit',
      color: 'inherit',
      background: 'none',
      border: 'none',
      padding: '0',
    };

    this.props.indent = this.props.indent || 0;
    var indent = <span style={{width:this.props.indent*8}}/>;

    if (typeof(props.data) === 'object') {

      children = <div>
        {Object.keys(props.data).map(function(name) {
           return <JEditComponent
            key = {++key}
            indent = {this.props.indent + 1}
            name = {name}
            data = {props.data[name]}/>;
        }, this)}
      </div>;
    }
    else {

      input = <input type="text" value={props.data} style={styleInput}></input>;
    }

    return (
      <div>
        <div style={{width:'100%', display: 'flex'}}>
          {indent}
          <strong style={{flex:1}}>{props.name || 'obj name'}</strong>
          {input}
        </div>
        {children}
      </div>
    );
  }
});

module.exports = JEditComponent;

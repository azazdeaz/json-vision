var React = require('react');
var has = require('lodash/object/has');
var isObject = require('lodash/lang/isObject');
var keysIn = require('lodash/object/keysIn');
var includes = require('lodash/collection/includes');
var FuncUtil = require('./FuncUtil');
var Item;

var Children  = React.createClass({

  render() {

    var {settings, value, path, indent, createAction} = this.props;
    var children;

    if (has(settings, 'children')) {

      children = settings.children;
    }
    else if (isObject(value)) {

      children = value;
    }

    if (children) {

      var keys = settings.includeInheriteds ?
        keysIn(children) : Object.keys(children);

      return <div>
        {keys.map((key, idx) => {

          var {whitelist, blacklist} = settings;
          if (whitelist && !includes(whitelist, key)) return;
          if (blacklist && includes(whitelist, key)) return;

          var value = children[key];

          return <Item
            key = {key}
            name = {key}
            value = {value}
            parentObject = {children}
            path = {path.concat([key, value])}
            indent = {indent + 1}
            createAction = {createAction}/>;
        })}
        </div>;
    }
    else {
      return <div hidden={true}/>;
    }
  }
});

Children.handleItem = (I) => {//dependency incjection to avoid circular deps
  Item = I;
};

export default Children;

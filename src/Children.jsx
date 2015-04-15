import React from 'react';
import has from 'lodash/object/has';
import isObject from 'lodash/lang/isObject';
import isArray from 'lodash/lang/isArray';
import keysIn from 'lodash/object/keysIn';
import includes from 'lodash/collection/includes';
import FuncUtil from './FuncUtil';
import Symbol from 'es6-symbol';
var Item;//Will be injected

var Children  = React.createClass({

  contextTypes: {
    createAction: React.PropTypes.func.isRequired,
  },

  render() {

    var {settings, value, path, indent, createAction} = this.props;
    var children, sort, SORT_DND_TYPE;

    if (has(settings, 'children')) {

      children = settings.children;
    }
    else if (isObject(value)) {

      children = value;
    }

    if (settings.sortable || isArray(children)) {

      SORT_DND_TYPE = Symbol();

      sort = (key, afterKey) => {

        var value = children.splice(key, 1)[0];
        children.splice(afterKey, 0, value);

        createAction();
      };
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
            createAction = {createAction}
            sort = {sort}
            SORT_DND_TYPE = {SORT_DND_TYPE}/>;
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

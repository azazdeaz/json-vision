import React from 'react';
import has from 'lodash/object/has';
import assign from 'lodash/object/assign';
import isObject from 'lodash/lang/isObject';
import isArray from 'lodash/lang/isArray';
import keysIn from 'lodash/object/keysIn';
import pluck from 'lodash/collection/pluck';
import includes from 'lodash/collection/includes';
import Symbol from 'es6-symbol';
var Item;//Will be injected

var Children  = React.createClass({

  contextTypes: {
    createAction: React.PropTypes.func.isRequired,
  },

  render() {

    var {settings, value, path, indent, createAction, children,
      onDragOver} = this.props;
    var commonProps = {createAction, indent: indent + 1};

    if (settings.sortable || isArray(children)) {

      commonProps.draggable = true;
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

          var props = assign({
            key,
            name: key,
            idx: idx,
            value,
            parentObject: children,
            path: path.concat([key, value]),
            onDragOver: () => onDragOver(idx)
          }, commonProps);

          return <Item {...props}/>;
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

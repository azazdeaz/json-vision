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
    getSettings: React.PropTypes.func.isRequired,
  },

  render() {

    var {settings, value, path, indent, createAction, children,
      onDragOver} = this.props;
    var commonProps = {createAction, indent: indent + 1};
    var {whitelist, blacklist, order} = settings;

    if (settings.canDrop && isArray(children)) {

      commonProps.parentCanDrop = settings.canDrop;
      commonProps.parentAcceptDrop = settings.acceptDrop;
    }

    if (settings.canDropAround) {

      commonProps.canDropAround = function () {};
    }

    if (children) {

      var keys = settings.includeInheriteds ?
        keysIn(children) : Object.keys(children);

      if (order) {
        let l = keys.length - 1;
        keys = keys.sort((a, b) => {

          var aIdx = order.indexOf(a);
          var bIdx = order.indexOf(b);

          if (aIdx !== -1) aIdx = l - aIdx;
          if (bIdx !== -1) bIdx = l - bIdx;

          return bIdx - aIdx;
        });
      }

      return <div>
        {keys.map((key, idx) => {

          if (whitelist && !includes(whitelist, key)) return;
          if (blacklist && includes(blacklist, key)) return;

          var value = children[key];
          var childPath = path.concat([key, value]);

          var props = assign({
            key,
            path: childPath,
            settings: this.context.getSettings(childPath),
            name: key,
            idx: idx,
            value,
            parentObject: children,
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

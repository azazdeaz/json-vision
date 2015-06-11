import React from 'react';
import assign from 'lodash/object/assign';
import isArray from 'lodash/lang/isArray';
import keysIn from 'lodash/object/keysIn';
import includes from 'lodash/collection/includes';
var Item;//Will be injected

var Children  = React.createClass({

  contextTypes: {
    createAction: React.PropTypes.func.isRequired,
    getSettings: React.PropTypes.func.isRequired,
    createUtils: React.PropTypes.func.isRequired,
  },

  render() {

    var {settings, path, indent, createAction, children,
      onDragOver} = this.props;
    var commonProps = {createAction, indent: indent + 1};
    var {whitelist, blacklist, order} = settings;

    if (isArray(children)) {

      let utils = this.context.createUtils(path);

      commonProps.canDropAround = (childUtils, targetUtils, idx) => {
        return settings.canDrop(utils, targetUtils, idx);
      };
      commonProps.acceptDropAround = (childUtils, targetUtils, idx) => {
        return settings.acceptDrop(utils, targetUtils, idx);
      };
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

          if (whitelist && !includes(whitelist, key)) return null;
          if (blacklist && includes(blacklist, key)) return null;

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

var React = require('react');
var isObject = require('lodash/lang/isObject');
var isArray = require('lodash/lang/isArray');
var Matterkit = require('react-matterkit');
var {style, Button, Icon, Slider, Dropdown, Checkbox,
  MultiTypeInput} = Matterkit;
var MatterInput = Matterkit.Input;
var Item;

var Input  = React.createClass({

  contextTypes: {
    createUtils: React.PropTypes.func.isRequired,
  },

  render() {

    var {type, options, label, icon, value, onChange, key,
       types, chooseType, path} = this.props;
    var input = null;
    var utils = this.context.createUtils(path);
    var handleChange = value => {
      if (typeof(onChange) === 'function') {
        onChange(value, utils);
      }
    };

    if (!path) throw Error;


    var createInput = type => input = <MatterInput
      type={type}
      background='transparent'
      onChange={handleChange}
      value={value} />;

    var createCheckbox = () => input = <Checkbox
      onChange={handleChange}
      value={value} />;

    if (isObject(value)) {
      //no input
    }
    else if (type === 'multi') {
      input = <MultiTypeInput
      background='transparent'
        onChange={handleChange}
        types={types}
        chooseType={chooseType}
        value={value}/>;
    }
    else if (type === 'dropdown' || isArray(options)) {

      input = <Dropdown
        onChange={handleChange}
        options={options}
        value={value}/>;
    }
    else if (type === 'checkbox') {

      createCheckbox();
    }
    else if (type === 'slider') {

      input = <Slider
        onChange={handleChange}
        value={value}/>;
    }
    else if (type === 'number') {

      createInput('number');
    }
    else if (type === 'string') {

      createInput('text');
    }
    else if (type === 'color') {

      createInput('text');
    }
    else if (type === 'no-input') {

      //no input
    }
    else if (type) {
      //no input
      console.warn(`Unknown type: "${type}"`);
    }
    else if (typeof(value) === 'function') {

      input = <Button
        icon={icon}
        label={label || value.name || 'Button'}
        onClick={value}
        colored={colored}/>;
    }
    else if (typeof(value) === 'number') {

      createInput('number');
    }
    else if (typeof(value) === 'string') {

      createInput('text');
    }
    else if (typeof(value) === 'boolean') {

      createCheckbox();
    }

    return input ?
      <span style={{flex: 1}} key={key}>{input}</span> :
      <span hidden={true} key={key}/>;
  }
});

export default Input;

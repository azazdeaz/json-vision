var React = require('react/addons');
var {PureRenderMixin} = React;
var isObject = require('lodash/lang/isObject');
var isArray = require('lodash/lang/isArray');
var Matterkit = require('react-matterkit');
var {Button, Slider, Dropdown, Checkbox, MultiTypeInput} = Matterkit;
var MatterInput = Matterkit.Input;

var Input = React.createClass({

  mixins: [PureRenderMixin],

  contextTypes: {
    createUtils: React.PropTypes.func.isRequired,
  },

  render() {

    var {type, options, label, icon, value, onChange, key, dragSpeed,
      min, max, hints, types, chooseType, path,
      addonLabel, addonIcon} = this.props;
    var input = null;
    var utils = this.context.createUtils(path);

    var handleChange = val => {
      if (typeof onChange === 'function') {
        onChange(val, utils);
      }
    };

    if (!path) throw Error;


    var createInput = inputType => input = <MatterInput
      type = {inputType}
      min = {min}
      max = {max}
      hints = {hints}
      addonLabel = {addonLabel}
      addonIcon = {addonIcon}
      dragSpeed = {dragSpeed}
      background = 'transparent'
      onChange = {handleChange}
      value = {value}/>;

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
        options={options.map(option => {
          if (typeof option === 'string') {
            return {label: option, value: option};
          }
          else {
            return option;
          }
        })}
        value={value}
        />;
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
    else if (typeof value === 'function') {

      input = <Button
        icon={icon}
        label={label || value.name || 'Button'}
        onClick={value}/>;
    }
    else if (typeof value === 'number') {

      createInput('number');
    }
    else if (typeof value === 'string') {

      createInput('text');
    }
    else if (typeof value === 'boolean') {

      createCheckbox();
    }

    return input ?
      <span style={{flex: 1}} key={key}>{input}</span> :
      <span hidden={true} key={key}/>;
  }
});

export default Input;

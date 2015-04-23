var React = require('react');
var isObject = require('lodash/lang/isObject');
var isArray = require('lodash/lang/isArray');
var Matterkit = require('react-matterkit');
var {style, Button, Icon, Slider, Dropdown, Checkbox,
  MultiTypeInput} = Matterkit;
var MatterInput = Matterkit.Input;
var Item;

var Input  = React.createClass({

  render() {

    var {type, options, label, icon, value, onChange, key,
       types, chooseType} = this.props;
    var input;

    var empty = () => input = null;


    var createInput = type => input = <MatterInput
      type={type}
      background='transparent'
      onChange={v=>onChange(v)}
      value={value} />;

    var createCheckbox = () => input = <Checkbox
      onChange={v=>onChange(v)}
      value={value} />;

    if (isObject(value)) {
      empty();
    }
    else if (type === 'multi') {
      input = <MultiTypeInput
      background='transparent'
        onChange={v=>onChange(v)}
        types={types}
        chooseType={chooseType}
        value={value}/>;
    }
    else if (type === 'dropdown' || isArray(options)) {

      input = <Dropdown
        onChange={v=>onChange(v)}
        options={options}
        value={value}/>;
    }
    else if (type === 'checkbox') {

      createCheckbox();
    }
    else if (type === 'slider') {

      input = <Slider
        onChange={v=>onChange(v)}
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

      empty();
    }
    else if (type) {

      empty();
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
    else {
      empty();
    }

    return input ?
      <span style={{flex: 1}} key={key}>{input}</span> :
      <span hidden={true} key={key}/>;
  }
});

export default Input;

var React = require('react');
var isObject = require('lodash/lang/isObject');
var isArray = require('lodash/lang/isArray');
var Matterkit = require('react-matterkit');
var {style, Button, Icon, Slider, Dropdown, Checkbox} = Matterkit;
var MatterInput = Matterkit.Input;
var Item;

var Input  = React.createClass({

  render() {

    var {settings, value, update} = this.props;
    var input;

    var empty = () => input = <div hidden={true}/>;


    var createInput = type => input = <MatterInput
      type={type}
      onChange={v=>update(v)}
      value={value} />;

    var createCheckbox = () => input = <Checkbox
      onChange={v=>update(v)}
      value={value} />;

    if (isObject(value)) {
      empty();
    }
    else if (settings.type === 'dropdown' || isArray(settings.options)) {

      input = <Dropdown
        onChange={v=>update(v)}
        options={settings.options}
        value={value}/>;
    }
    else if (settings.type === 'checkbox') {

      createCheckbox();
    }
    else if (settings.type === 'slider') {

      input = <Slider
        onChange={v=>update(v)}
        value={value} />;
    }
    else if (settings.type === 'number') {

      createInput('number');
    }
    else if (settings.type === 'string') {

      createInput('text');
    }
    else if (settings.type === 'color') {

      createInput('text');
    }
    else if (settings.type === 'no-input') {

      empty();
    }
    else if (settings.type) {

      empty();
      console.warn(`Unknown type: "${settings.type}"`);
    }
    else if (typeof(value) === 'function') {

      input = <Button
        icon={settings.icon}
        text={settings.text || value.name || 'Button'}
        onClick={value}
        colored={settings.colored}/>;
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

    return input;
  }
});

export default Input;

var React = require('react');
var isObject = require('lodash/lang/isObject');
var isArray = require('lodash/lang/isArray');
var {style, Button, Icon, Input, Slider, Dropdown, Checkbox} = require('react-matterkit');
var Item;

var INput  = React.createClass({

  render() {

    var {settings, value, update} = this.props;
    var input;

    if (isObject(value)) {
      return null;
    }


    var createInput = (type) => input = <Input
      type={type}
      onChange={v=>update(v)}
      value={value} />;

    if (settings.type === 'dropdown' || isArray(settings.options)) {

      input = <Dropdown
        onChange={v=>update(v)}
        options={settings.options}
        value={value}/>;
    }
    else if (settings.type === 'checkbox') {

      input = <Checkbox
        onChange={v=>update(v)}
        value={value} />;
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
    else {
      createInput('text');
    }

    return input;
  }
});

export default INput;

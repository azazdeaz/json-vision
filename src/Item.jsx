var React = require('react');
var isObject = require('lodash/lang/isObject');
var has = require('lodash/object/has');
var Children = require('./Children');
var Row = require('./Row');
var Matter = require('react-matterkit');
var {Icon} = Matter;

export default class Item extends React.Component {

  static contextTypes = {
    createAction: React.PropTypes.func.isRequired,
    createUtils: React.PropTypes.func.isRequired,
  }

  static defaultProps = {
    path: [],
    value: null,
    indent: 0,
  }

  constructor(props) {
    super(props);

    this.state = {
      opened: true,
      hover: false,
    };
  }

  getChildren() {

    if (has(this.props.settings, 'children')) {

      return this.props.settings.children;
    }
    else if (isObject(this.props.value)) {

      return this.props.value;
    }
  }

  tooltipContent() {
    return this.props.settings.tooltip || 'This is a tooltip';
  }

  onClickOpenToggle = () => {

    this.setState({opened: !this.state.opened});
  }

  update = (value, utils) => {

    utils.value = value;

    var {settings} = this.props;
    var onChange = settings.input && settings.input.onChange;

    if (typeof onChange === 'function') {
      onChange(value, utils);
    }
  }

  canDrop = (utils, item, idx) => {

    var {canDrop} = this.props.settings;

    if (canDrop && canDrop(utils, item, idx)) {
      return true;
    }
  }

  acceptDrop = (utils, item, idx) => {

    var {acceptDrop} = this.props.settings;

    if (acceptDrop) {
      acceptDrop(utils, item, idx);
    }
    else {
      //TODO accept drop
    }
  }

  render () {
    var {settings, hideHead, indent} = this.props;
    var {opened} = this.state;

    if (settings.Component) {
      return <settings.Component {...this.props}/>;
    }

    var children = this.getChildren();

    var row = hideHead ? null : <Row
      {...this.props}
      update = {this.update}
      hasChildren = {!!children}
      canDrop = {this.canDrop}
      acceptDrop = {this.acceptDrop}
      onClickOpenToggle = {this.onClickOpenToggle}
      opened = {opened}/>;

    var childItems = opened ? <Children
        settings = {settings}
        value = {this.props.value}
        path = {this.props.path}
        children = {children}
        indent = {hideHead ? indent - 1 : indent}
        createAction = {this.context.createAction}/> : null;

    return <div
      hidden = {settings.hidden}
      style = {{position: 'relative'}}>

      {row}
      {childItems}
    </div>;
  }
}


Children.handleItem(Item);

var React = require('react');
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

  shouldComponentUpdate(nextProps) {
    return this.__lastSettings !== nextProps.settings;
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

  renderChildren() {
    var {settings, childLeafs} = this.leaf;

    if (this.state.opened && childLeafs.length === 0) {
      return null;
    }

    var margin = has(settings, 'indent') ? settings.indent : 6;
    return <div style={{margin}}>
      {childLeafs.map(childLeaf => childLeaf.getComponent())}
    </div>;
  }

  render () {
    var {settings, hideHead, indent} = this.props;
    var {opened} = this.state;

    this.__lastSettings = settings;

    if (settings.ItemComponent) {
      return <settings.ItemComponent {...this.props}/>;
    }

    var row = hideHead ? null : <Row
      leaf = {this.props.leaf}
      onClickOpenToggle = {this.handleClickOpenToggle}/>;

    return <div
      hidden = {settings.hidden}
      style = {{position: 'relative'}}>
      {row}
      {this.renderChildren()}
    </div>;
  }
}


Children.handleItem(Item);

var React = require('react');
var has = require('lodash/object/has');
var Row = require('./Row');
var Matter = require('react-matterkit');
var {Icon} = Matter;

export default class Item extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opened: true,
    };
  }

  shouldComponentUpdate(nextProps) {
    return this.__lastRenderedSettings !== nextProps.leaf.settings;
  }

  handleClickOpenToggle = () => {
    this.setState({opened: !this.state.opened});
  }

  renderChildren() {
    var {settings, childLeafs} = this.props.leaf;

    if (!this.state.opened || childLeafs.length === 0) {
      return null;
    }

    var margin = has(settings, 'indent') ? settings.indent : 6;
    return <div style={{margin}}>
      {childLeafs.map(childLeaf => childLeaf.getComponent())}
    </div>;
  }

  render () {
    var {settings, childLeafs} = this.props.leaf;
    var {opened} = this.state;

    this.__lastRenderedSettings = settings;

    if (settings.ItemComponent) {
      return <settings.ItemComponent {...this.props}/>;
    }

    var row = settings.hideHead ? null : <Row
      leaf = {this.props.leaf}
      opened = {opened}
      hasChildren = {childLeafs.length !== 0}
      onClickOpenToggle = {this.handleClickOpenToggle}/>;

    return <div
      hidden = {settings.hidden}
      style = {{position: 'relative'}}>
      {row}
      {this.renderChildren()}
    </div>;
  }
}

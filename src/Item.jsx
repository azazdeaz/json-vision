var React = require('react')
var has = require('lodash/object/has')
var Row = require('./Row')
var Matter = require('react-matterkit')
var {Icon} = Matter

export default class Item extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      opened: true,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.opened !== this.state.opened
  }

  componentDidMount() {
    this.props.leaf.onUpdate = () => this.forceUpdate()
  }

  componentWillUnmount() {
    this.props.leaf.onUpdate = null
  }

  handleClickOpenToggle = () => {
    this.setState({opened: !this.state.opened})
  }

  renderChildren() {
    var {settings, childLeafs} = this.props.leaf

    if (!this.state.opened || childLeafs.length === 0) {
      return null
    }

    var marginLeft = has(settings, 'indent') ? settings.indent : 6
    return <div style={{marginLeft}}>
      {childLeafs.map(childLeaf => childLeaf.getComponent())}
    </div>
  }

  render () {
    var {settings, childLeafs} = this.props.leaf
    var {opened} = this.state

    if (settings.ItemComponent) {
      return <settings.ItemComponent {...this.props}/>
    }

    var row = settings.hideHead ? null : <Row
      leaf = {this.props.leaf}
      opened = {opened}
      hasChildren = {childLeafs.length !== 0}
      onClickOpenToggle = {this.handleClickOpenToggle}/>

    return <div
      hidden = {settings.hidden}
      style = {{position: 'relative'}}>
      {row}
      {this.renderChildren()}
    </div>
  }
}

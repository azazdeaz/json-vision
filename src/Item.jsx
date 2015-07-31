var React = require('react')
var has = require('lodash/object/has')
var Row = require('./Row')
var Matter = require('react-matterkit')
var {Icon} = Matter

export default class Item extends React.Component {
  constructor(props) {
    super(props)

    this.state = {open: true}

    var settings = props.leaf.settings

    if (has(settings, 'open')) {
      this.state.open = settings.open
    }
    else if (has(settings, 'defaultOpen')) {
      this.state.open = settings.defaultOpen
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.open !== this.state.open
  }

  componentDidMount() {
    this.props.leaf.onUpdate = () => this.forceUpdate()
  }

  componentWillUnmount() {
    this.props.leaf.onUpdate = null
  }

  handleClickOpenToggle = () => {
    var {leaf} = this.props

    if (leaf.settings.onToggleOpen) {
      leaf.settings.onToggleOpen(leaf.utils)
    }

    this.setState({open: !this.state.open})
  }

  renderChildren() {
    var {settings, childLeafs} = this.props.leaf

    if (!this.state.open || childLeafs.length === 0) {
      return null
    }

    var marginLeft = has(settings, 'indent') ? settings.indent : 6
    return <div style={{marginLeft}}>
      {childLeafs.map(childLeaf => childLeaf.getComponent())}
    </div>
  }

  render () {
    const {settings, childLeafs} = this.props.leaf
    const {open} = has(settings, 'open') ? settings : this.state

    if (settings.ItemComponent) {
      return <settings.ItemComponent {...this.props}/>
    }

    var row = settings.hiddenHead ? null : <Row
      leaf = {this.props.leaf}
      open = {open}
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

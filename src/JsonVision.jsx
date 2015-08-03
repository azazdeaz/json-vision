var React = require('react')
var assign = require('lodash/object/assign')
var {getTheme} = require('react-matterkit')
var getSettings = require('./getSettings')
var Leaf = require('./Leaf')
var Connect = require('./Connect')
var defaultSettignsModel = require('./defaultSettignsModel')
// import HTML5Backend from 'react-dnd/modules/backends/HTML5'
// import {DragDropContext} from 'react-dnd'
//
// @DragDropContext(HTML5Backend)
export default class JsonVision extends React.Component {
  static create() {//TODO
    // var parent = props.parent || document.createElement('div')
    //
    // React.render(<JsonVision
    //   title = {this.title}
    //   report = {change => this._report(change)}/>, parent)
    //
    // if (!props.parent && (!has(props, 'autoPlace') || props.autoPlace !== false)) {
    //   this.domElem.style.position = 'fixed'
    //   this.domElem.style.top = '0px'
    //   this.domElem.style.right = '15px'
    //   document.body.appendChild(this.domElem)
    // }
  }

  static defaultProps = {
    title: 'json vision',
    value: {},
    settings: [],
    settingsModel: defaultSettignsModel
  }

  constructor(props) {
    super(props)

    this.rootLeaf = new Leaf(this.getRootPath(this.props), this)
  }

  getRootPath(props) {
    return ['', props.value]
  }

  getSettings(path) {
    return getSettings(this.props.settings, this.props.settingsModel, path)
  }

  matchSettings(currentSettings, nextSettings) {
    return this.props.settingsModel.match(currentSettings, nextSettings)
  }

  reportChange() {
    if (this.props.onChange) {
      this.props.onChange(this.props.value)
    }
  }

  componentDidUpdate() {
    this.rootLeaf.setup(this.getRootPath(this.props))
  }

  render() {
    var styleConfig = getTheme(this).getStyle('config')
    var style = assign(this.props.style, {
      background: styleConfig.palette.grey4,
      color: styleConfig.fontColor.normal,
      fontFamily: styleConfig.fontFamily,
      fontWeight: styleConfig.fontWeight,
    })

    return <div style={style}>
      {this.rootLeaf.getComponent()}
    </div>
  }
}

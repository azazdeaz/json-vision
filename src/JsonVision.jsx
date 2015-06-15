var React = require('react');
var assign = require('lodash/object/assign');
var {getStyles} = require('react-matterkit').utils;
var getSettings = require('./getSettings');
var Leaf = require('./Leaf');
var Utils = require('./Utils');

export default class JsonVision extends React.Component {

  static create() {//TODO
    // var parent = props.parent || document.createElement('div');
    //
    // React.render(<JsonVision
    //   title = {this.title}
    //   report = {change => this._report(change)}/>, parent);
    //
    // if (!props.parent && (!has(props, 'autoPlace') || props.autoPlace !== false)) {
    //   this.domElem.style.position = 'fixed';
    //   this.domElem.style.top = '0px';
    //   this.domElem.style.right = '15px';
    //   document.body.appendChild(this.domElem);
    // }
  }

  static defaultProps = {
    title: 'json vision',
    value: {},
    settings: [],
  }

  constructor(props) {
    super(props);

    this.rootLeaf = new Leaf(['', props.value], this);
  }

  getSettings = getSettings.bind(this)

  createAction = createAction.bind(this)

  createUtils = path => {
    return new Utils(path, this.createAction);
  }

  render() {
    var styleConfig = getStyles(this).get('config');
    var style = assign(this.props.style, {
      background: styleConfig.palette.grey4,
      color: styleConfig.fontColor.normal,
      fontFamily: styleConfig.fontFamily,
      fontWeight: styleConfig.fontWeight,
    });

    return <div style={style}>
      {this.rootLeaf.getComponent()}
    </div>;
  }
}


function createAction() {
  if (this.props.onChange) {
    this.props.onChange(this.props.value);
  }
}

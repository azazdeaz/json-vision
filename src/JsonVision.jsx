var React = require('react');
var assign = require('lodash/object/assign');
var includes = require('lodash/collection/includes');
var {getStyles} = require('react-matterkit').utils;
var getSettings = require('./getSettings');
var Leaf = require('./Leaf');
var Connect = require('./Connect');

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

    this.rootLeaf = new Leaf(this.getRootPath(this.props), this);
  }

  getRootPath(props) {
    return ['', props.value];
  }

  getSettings = getSettings.bind(this)

  createAction() {
    if (this.props.onChange) {
      this.props.onChange(this.props.value);
    }
  }

  createUtils(path) {
    return new Connect(path, this.createAction.bind(this));
  }

  componentWillUpdate(nextProps) {
    this.rootLeaf.setup(this.getRootPath(nextProps));
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

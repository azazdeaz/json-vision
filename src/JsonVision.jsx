var React = require('react');
var assign = require('lodash/object/assign');
var getSettings = require('./getSettings');
var Item = require('./Item');
var {getStyles} = require('react-matterkit').utils;
var FuncUtils = require('./FuncUtils');

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

  static childContextTypes = {
    getSettings: React.PropTypes.func.isRequired,
    createAction: React.PropTypes.func.isRequired,
    createUtils: React.PropTypes.func.isRequired,
  }

  static defaultProps = {
    title: 'json vision',
    value: {},
    settings: [],
  }

  constructor(props) {
    super(props);

    this.state = {
      getSettings: getSettings.bind(this),
      createAction: createAction.bind(this),
      createUtils: path => {
        return new FuncUtils(path, this.state.createAction);
      }
    };
  }

  getChildContext() {
    return {
      createAction: this.state.createAction,
      getSettings: this.state.getSettings,
      createUtils: this.state.createUtils,
    };
  }

  render() {
    var path = ['', this.props.value];

    var styleConfig = getStyles(this).get('config');
    var style = assign(this.props.style, {
      background: styleConfig.palette.grey4,
      color: styleConfig.fontColor.normal,
      fontFamily: styleConfig.fontFamily,
      fontWeight: styleConfig.fontWeight,
    });

    return <div style={style}>
      <Item
        hideHead = {this.props.hideHead}
        key = 'root'
        value = {this.props.value}
        name = {this.props.name || this.props.title}
        path = {path}
        settings = {this.state.getSettings(path)}/>
    </div>;
  }
}








function createAction(change) {

  if (this.props.onAction && this.props.onAction(change) === false) {

    return;
  }

  if (change) {

    switch (change.type) {

      case 'delete':
        delete change.object[change.key];
        break;

      case 'set':
        change.object[change.key] = change.value;
        break;

      case 'splice':
        // change.object[change.key].splice(change.index, change.removedCound, ...change.items);
        break;
    }
  }

  if (this.props.onChange) {
    this.props.onChange(this.props.value);
  }
}

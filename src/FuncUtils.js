export default class {

  constructor(path, reportChange) {

    this.path = path;
    this.reportChange = reportChange;
  }

  val() {
    console.warn('FuncUtils.val() is deprecated. Use the FuncUtils.value getter instead!');
    return this.path[this.path.length - 1];
  }

  get value() {
    return this._getAt(1);
  }
  set value(v) {
    this._setAt(1, v);
    this.reportChange();
  }

  get key() {
    return this._getAt(2);
  }

  get fullPath() {
    return this.path.reduce((path, val, idx) => {
      return path + (idx % 2 === 0 ? `/${val}` : '');
    }, '');
  }


  _getAt(pos) {
    var {path} = this;
    return path[path.length - pos];
  }

  _setAt(pos, value) {
    var {path} = this;
    var key = path[path.length - (pos+1)];
    path[path.length - (pos+2)][key] = value;
  }
}

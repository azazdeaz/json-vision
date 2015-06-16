export default class Contact {

  constructor(path, reportChange) {

    this.path = path;
    this.reportChange = reportChange;
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

  get parent() {
    return this._getAt(3);
  }

  get fullPath() {
    return this.path.reduce((path, val, idx) => {
      return path + (idx % 2 === 0 ? `/${val}` : '');
    }, '');
  }

  delete() {
    var parent = this.parent;
    delete parent[this.key];
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

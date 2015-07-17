export default class Connect {
  constructor(path, update, del, reportChange) {
    this.path = path
    this.update = update
    this.delete = del
    this.reportChange = reportChange
  }

  get value() {
    return this._getAt(1)
  }
  set value(v) {
    this.update(v)
  }

  get key() {
    return this._getAt(2)
  }

  get parent() {
    return this._getAt(3)
  }

  nthKey(n) {
    return this._getAt(n * 2)
  }

  nthParent(n) {
    return this._getAt(1 + n * 2)
  }

  get fullPath() {
    return this.path.reduce((path, val, idx) => {
      return path + (idx % 2 === 0 ? `/${val}` : '')
    }, '')
  }

  delete() {
    this.delete()
  }


  _getAt(pos) {
    var {path} = this
    return path[path.length - pos]
  }

  // _setAt(pos, value) {
  //   var {path} = this
  //   var key = path[path.length - (pos+1)]
  //   path[path.length - (pos+2)][key] = value
  //   this.reportChange()
  // }
}

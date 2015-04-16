export default class {

  constructor(path) {

    this.path = path;
  }

  val() {
    console.warn('FuncUtils.val() is deprecated. Use the FuncUtils.value getter instead!');
    return this.path[this.path.length - 1];
  }

  get value() {
    return this.path[this.path.length - 1];
  }

  get key() {
    return this.path[this.path.length - 2];
  }

  get fullPath() {
    return this.path.reduce((path, val, idx) => {
      return path + (idx % 2 === 0 ? `/${val}` : '');
    }, '');
  }
}

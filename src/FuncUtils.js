export default class {

  constructor(path) {

    this.path = path;
  }

  val() {
    return this.path[this.path.length - 1];
  }

  get value() {
    return this.path[this.path.length - 1];
  }

  get fullPath() {
    return this.path.reduce((path, val, idx) => {
      return path + (idx % 2 === 0 ? `/${val}` : '');
    }, '');
  }
}

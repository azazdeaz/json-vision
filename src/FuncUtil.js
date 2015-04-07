export default class {

  constructor(path) {

    this.path = path;
  }

  val() {
    return this.path[this.path.length - 1];
  }
}

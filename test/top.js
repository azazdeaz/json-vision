function importTest(name, path) {
  describe(name, function () {
    require(path)
  })
}

describe('json-vision', function () {
  importTest('settings-model', './settings-model/test.js')
  importTest('select', './select/test.js')
})

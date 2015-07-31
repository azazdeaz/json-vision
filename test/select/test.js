var assert = require('chai').assert
var getSettings = require('../../src/getSettings')
var model = require('../../src/defaultSettignsModel')


describe('select with string', () => {
  it('matches with {selector: "all"}', () => {
    var settingsList = [{selector: 'all', hiddenHead: true}]
    var path = ['', null, 'red', null]
    var resolvedSettings = getSettings(settingsList, model, path)

    assert.strictEqual(resolvedSettings.hiddenHead, true)
  })

  it('matches with {selector: "root"}', () => {
    var settingsList = [{selector: 'root', hidden: true}]
    var pathRoot = ['', null]
    var pathChild = ['', null, 'red', null]
    var resolvedRootSettings = getSettings(settingsList, model, pathRoot)
    var resolvedChildSettings = getSettings(settingsList, model, pathChild)

    assert.strictEqual(resolvedRootSettings.hidden, true)
    assert.strictEqual(resolvedChildSettings.hidden, undefined)
  })
})

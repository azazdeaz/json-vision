var includes = require('lodash/collection/includes')
var isArray = require('lodash/lang/isArray')
var minimatch = require('minimatch')
var Connect = require('./Connect')

export default function getSettings(settingsModel, path) {
// var __t = window.performance.now()
  var utils = new Connect(path)
  var settings = {
    input: {
      value: utils.value
    },
    label: utils.key
  }

  checkSettingsList(this.props.settings, [])
  // window.GET_SETTINGSTIME = window.GET_SETTINGSTIME || 0
  // window.GET_SETTINGSTIME += window.performance.now() - __t
  return settings

  function checkSettingsNode(settingsNode, path, preselectors) {
    var match = false

    if (typeof settingsNode.selector === 'function') {

      let selectorType = 'function'
      let selector = settingsNode.selector
      match = isMatches(selectorType, selector)
    }
    else if (typeof settingsNode.selector === 'object') {

      let selectorType = Object.keys(settingsNode.selector)[0]
      let selector = settingsNode.selector[selectorType]
      match = isMatches(selectorType, selector)
    }
    else {
      match = true
    }

    if (match) {

      if (preselectors.length === 0) {
        return true
      }
      else {

        let newSettingsNode = preselectors[0]
        let newPath = path.slice(0, path.length - 2)
        let newPreselectors = preselectors.slice(1)

        return checkSettingsNode(newSettingsNode, newPath, newPreselectors)
      }
    }

    function isMatches(selectorType, selector) {
      var utils = new Connect(path)

      if (selectorType === 'function') {

        match = selector(utils)
      }
      else if (selectorType === 'instanceOf') {

        if (isArray(selector)) {
          match = selector.some(s => utils.value instanceof s)
        }
        else {
          match = utils.value instanceof selector
        }
      }
      else if (selectorType === 'key') {

        if (isArray(selector)) {
          match = includes(selector, utils.key)
        }
        else {
          match = utils.key === selector
        }
      }
      else if (selectorType === 'value') {

        match = utils.value === selector
      }
      else if (selectorType === 'path') {
      }
      else if (selectorType === 'regexp') {
      }
      else if (selectorType === 'glob') {

        match = minimatch(utils.fullPath, selector)
      }
      else {
        throw Error()
      }
    }
  }

  function checkSettingsList(settingsList, preselectors) {

    settingsList.forEach(settingsNode => {

      if (typeof settingsNode === 'function') {
        settingsNode = settingsNode(utils)
      }

      if (typeof settingsNode !== 'object') {
        return
      }


      if (checkSettingsNode(settingsNode, path, preselectors)) {
        settingsModel.merge(settings, settingsNode, utils)
      }

      if (settingsNode.settings) {

        let newPreselectors = [settingsNode].concat(preselectors)
        checkSettingsList(settingsNode.settings, newPreselectors)
      }
    })
  }
}

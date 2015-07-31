var includes = require('lodash/collection/includes')
var isArray = require('lodash/lang/isArray')
var minimatch = require('minimatch')
var Connect = require('./Connect')

export default function getSettings(settingsList, settingsModel, path) {
// var __t = window.performance.now()
  var connect = new Connect(path)
  var settings = {
    input: {
      value: connect.value
    },
    label: connect.key
  }

  checkSettingsList(settingsList, [])
  // window.GET_SETTINGSTIME = window.GET_SETTINGSTIME || 0
  // window.GET_SETTINGSTIME += window.performance.now() - __t
  return settings

  function checkSettingsNode(settingsNode, path, preselectors) {
    var match = false

    if (typeof settingsNode.selector === 'function') {
      let selectorType = 'function'
      let selector = settingsNode.selector
      setMatch(selectorType, selector)
    }
    else if (typeof settingsNode.selector === 'string') {
      let selectorType = 'select'
      let selector = settingsNode.selector
      setMatch(selectorType, selector)
    }
    else if (typeof settingsNode.selector === 'object') {
      let selectorType = Object.keys(settingsNode.selector)[0]
      let selector = settingsNode.selector[selectorType]
      setMatch(selectorType, selector)
    }
    // else {
    //   match = true
    // }

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

    function setMatch(selectorType, selector) {
      var connect = new Connect(path)

      if (selectorType === 'function') {
        match = selector(connect)
      }
      else if (selectorType === 'select') {
        if (selector === 'all') {
          match = true
        }
        else if (selector === 'root') {
          match = path.length === 2
        }
      }
      else if (selectorType === 'instanceOf') {

        if (isArray(selector)) {
          match = selector.some(s => connect.value instanceof s)
        }
        else {
          match = connect.value instanceof selector
        }
      }
      else if (selectorType === 'key') {

        if (isArray(selector)) {
          match = includes(selector, connect.key)
        }
        else {
          match = connect.key === selector
        }
      }
      else if (selectorType === 'value') {

        match = connect.value === selector
      }
      else if (selectorType === 'path') {
      }
      else if (selectorType === 'regexp') {
      }
      else if (selectorType === 'glob') {

        match = minimatch(connect.fullPath, selector)
      }
      else {
        throw Error()
      }
    }
  }

  function checkSettingsList(settingsList, preselectors) {

    settingsList.forEach(settingsNode => {

      if (typeof settingsNode === 'function') {
        settingsNode = settingsNode(connect)
      }

      if (typeof settingsNode !== 'object') {
        return
      }


      if (checkSettingsNode(settingsNode, path, preselectors)) {
        settingsModel.merge(settings, settingsNode, connect)
      }

      if (settingsNode.settings) {

        let newPreselectors = [settingsNode].concat(preselectors)
        checkSettingsList(settingsNode.settings, newPreselectors)
      }
    })
  }
}

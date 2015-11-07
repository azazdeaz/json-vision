import {memorize, primitive, object, objectOf, arrayOf, func}
  from './settingsModel'

var inputShape = {
  value: primitive(),
  disabled: primitive(),
  draggable: primitive(),
  precision: primitive(),
  dragSpeed: primitive(),
  type: primitive(),
  min: primitive(),
  max: primitive(),
  hints: arrayOf(primitive()),
  label: primitive(),
  options: arrayOf(primitive()),
  maxVisibleHints: primitive(),
  mod: objectOf(primitive()),
  onChange: func(),
  prepareExportValue: func(),
  formatValue: func(),
  prettifyValue: func(),
  getElement: func(),
  style: objectOf(primitive()),

  addonIcon: primitive(),
  addonLabel: primitive(),
  addonBackground: primitive(),
  addonOnClick: func(),

  acceptValue: func(),
}

var simpleInput = object({...inputShape})
var input = object({...inputShape, types: arrayOf(simpleInput)})

export default memorize(object({
  shouldUpdate: func(),
  hidden: primitive(),
  hiddenHead: primitive(),
  children: primitive(),
  mutateValue: primitive(),//boolean
  includeInheriteds: primitive(),//boolean
  highlighted: primitive(),
  label: primitive(),
  labelStyle: objectOf(primitive()),
  draggable: primitive(),//boolean
  whitelist: arrayOf(primitive()),
  blacklist: arrayOf(primitive()),
  order: arrayOf(primitive()),
  onClick: func(),
  canDrop: func(),//(targetUtils, itemUtils, idx) => {},
  acceptDrop: func(),//(targetUtils, itemUtils, idx) => {},
  getDragPreview: func(),//connect => connect.value.getClonedDOMNode(),
  Component: func(),//ReactComponent //use custom component
  input: input,
  extraInputs: arrayOf(input),
  buttons: arrayOf(object({
    mod: objectOf(primitive()),
    label: primitive(),
    icon: primitive(),
    onClick: func(),
    hideWhenLeaved: primitive(),
    getElement: func(),
    style: objectOf(primitive()),
  })),
  contextMenu: object({
    items: arrayOf(primitive()),
    renderContent: func(),
  })
}))

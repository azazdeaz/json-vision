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

  addonIcon: primitive(),
  addonLabel: primitive(),
  addonBackground: primitive(),
  addonOnClick: func(),

  acceptType: func(),
}

var simpleInput = object({...inputShape})
var input = object({...inputShape, types: arrayOf(simpleInput)})

export default memorize(object({
  hidden: primitive(),
  hiddenHead: primitive(),
  children: primitive(),
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
  }))
}))

/**Settings Node
{
  selector: {key, value, function, instanceof, glob, path, regex, }
  children: [],
  highlighted: true,
  label: 'Prop',
  labelStyle: {color: style.palette.red}
  draggable: true,
  whitelist: ['foo', 'bar'],
  blacklist: ['qux', 'baz'],
  order: ['tux', 'baz'],
  onClick: connect => {}
  hidden: true,
  canDrop: (targetUtils, itemUtils, idx) => {},
  acceptDrop: (targetUtils, itemUtils, idx) => {},
  getDragPreview: connect => connect.value.getClonedDOMNode(),
  Component: ReactComponent //use custom component
  input: {
    type: 'number',
    dragSpeed: 0.1,
    ...
  },
  extraInputs: [
    {
      type: 'string'
      value: 8,
      dragSpeed: 0.1,
      options: ['first', 'secound', 'third'],
      types: [
        {--//--}
      ],
      chooseType: connect => return 0
    }
  ],
  buttons: [
    {
      kind: 'colored'
      label: 'Push'
      icon: 'github'
      onClick: connect => {},
      hideWhenLeaved: true,
    }
  ]
}

*/

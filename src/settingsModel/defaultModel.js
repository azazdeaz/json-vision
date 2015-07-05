import {memorize, primitive, object, objectOf, arrayOf, func}
  from './SettingsModel'

var simpleInput = object({
  value: primitive(),
  disabled: primitive(),
  draggable: primitive(),
  precision: primitive(),
  dragSpeed: primitive(),
  type: primitive(),
  min: primitive(),
  max: primitive(),
  hints: primitive(),
  maxVisibleHints: primitive(),
})

var input = object({
  value: primitive(),
  disabled: primitive(),
  draggable: primitive(),
  precision: primitive(),
  dragSpeed: primitive(),
  type: primitive(),
  min: primitive(),
  max: primitive(),
  hints: primitive(),
  maxVisibleHints: primitive(),
  types: arrayOf(simpleInput)
})

export default memorize(object({
  children: arrayOf(primitive()),
  highlighted: primitive(),
  label: objectOf(primitive()),
  labelStyle: primitive(),//object
  draggable: primitive(),//boolean
  whitelist: arrayOf(primitive(), {match: 'items', merge: 'union'}),
  blacklist: arrayOf(primitive(), {match: 'items', merge: 'union'}),
  order: arrayOf(primitive('replace')),
  onClick: func(),
  hidden: primitive(),
  canDrop: func(),//(targetUtils, itemUtils, idx) => {},
  acceptDrop: func(),//(targetUtils, itemUtils, idx) => {},
  getDragPreview: func(),//utils => utils.value.getClonedDOMNode(),
  Component: func(),//ReactComponent //use custom component
  input: input,
  extraInputs: arrayOf(input),
  buttons: arrayOf(object({
    mod: object(),
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
  onClick: utils => {}
  hidden: true,
  canDrop: (targetUtils, itemUtils, idx) => {},
  acceptDrop: (targetUtils, itemUtils, idx) => {},
  getDragPreview: utils => utils.value.getClonedDOMNode(),
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
      chooseType: utils => return 0
    }
  ],
  buttons: [
    {
      kind: 'colored'
      label: 'Push'
      icon: 'github'
      onClick: utils => {},
      hideWhenLeaved: true,
    }
  ]
}

*/

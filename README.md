> inspirited by [dat.GUI]

> based on React

> work in progress... (really not ready)

> will be renamed to QuickInterface

Generates rich user interface fully automatically for any JavaScript object and let it customise quickly and efficiently.
<img align="right" src="http://i.imgur.com/HfxSNTu.png">
####Basic Useage
```javascript
<QuickInterface
  value: {object}
  settings: {[optional, custom, settings]}
  onChange: {handleOnUserChangeAnyValue}/>
```

#### Preview of the customisation

In the settings property you can give an array of settings node like this:
```javascript
var settings = [{
  //select all the value with the key 'foo' 
  // and set a slider input for them
  selector: {key: 'foo'},
  input: {
    type: 'slider',
    min: 0,
    max: 100
  }
},{
  //select the values with matching path 
  // and set a string input for the with hints
  selector: {glob: '**/bar/*.string'},
  input: {
    type: 'string',
    hits: ['foo', 'bar', 'qux']
  }
}, {
  //qux will be a dropdown
  selector: {key: 'qux'},
  input: {
    options: ['baz', 'bar']
  },
}]
```
To make the setting dynamic you can replace any parameter with a function.
The function called with one argument (```connect```) which lets you easily access to current value. Example:
```javasctipt
connect.value, connect.key, connect.fullPath, connect.delete()

{
  //hide when qux = 'baz'
  selector: {inscaneOf: SomeClass},
  hidden: connect => connect.parent.qux === 'baz',
  label: connect => capitalise(connect.key)
}
```
There is a lot of more settings option like:
```javasctipt
{
  selector: {key, value, function, instanceOf, glob, path, regex}
  children: [],
  highlighted: true,
  label: 'Prop',
  labelStyle: {color: style.palette.red}
  draggable: true,
  canDrop: (targetUtils, itemUtils, idx) => {},
  acceptDrop: (targetUtils, itemUtils, idx) => {},
  getDragPreview: connect => connect.value.getClonedDOMNode(),
  whitelist: ['foo', 'bar'],
  blacklist: ['qux', 'baz'],
  order: ['tux', 'baz'],
  onClick: connect => {}
  hidden: true,
  Component: ReactComponent //use custom component
  input: {
    type: 'number',
    dragSpeed: 0.1,
    ...input settings
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
      chooseType: connect => return 0;
      //... input settings
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
```

[dat.GUI]:https://github.com/dataarts/dat.gui

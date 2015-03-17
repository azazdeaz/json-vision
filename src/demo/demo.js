var React = require('react');
var Page = React.createFactory(require('./Page.jsx'));
var demos = [
    require('./demos/first'),
];
var AceEditor = require('react-ace');
// var windooman = require('../windooman');

module.exports = function (JsonVision) {

  window.DEMO = {
    JsonVision,
    data: demos[0],
    refreshValue(value) {
      DEMO.data.value = value;
      page.setProps({value});
    },
  };

  var page = React.render(Page({
    value: DEMO.data.value,
    settings: DEMO.data.settings,
  }), document.body);

  // workspace = new Windooman();
  // document.body.appendChild(am.workspace.domElem);
  // workspace.loadWorkspace('base', skeleton);
  // workspace.load('base');

  // var source = 'var answer = 42;';
  //
  // var editor = React.render(React.createElement(AceEditor, {
  //   value: source,
  //   onChange: createAction,
  // }), document.body);
  //
  // function createAction(_source) {
  //   source = _source;
  //   if (editor) editor.setProps({value: source});
  // }
};


// var skeleton = {
//   "type": "container",
//   "direction": "column",
//   "children": [{
//     "type": "panel",
//     "size": 36,
//     "scaleMode": "fix",
//     "noHead": true,
//     "tabs": [{"name": "head"}]
//   }, {
//     "type": "container",
//     "direction": "row",
//     "size": 1,
//     "scaleMode": "flex",
//     "children": [{
//       "type": "panel",
//       "size": 1,
//       "scaleMode": "flex",
//       "tabs": [{"name": "settings"}]
//     }, {
//       "type": "panel",
//       "size": 1,
//       "scaleMode": "flex",
//       "tabs": [{"name": "demo"}]
//     }]
//   }]
// };

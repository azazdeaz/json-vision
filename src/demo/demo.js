var React = require('react');
var Page = require('./Page.jsx');
var demos = [
    require('./demos/first'),
]
// var windooman = require('../windooman');

module.exports = function (JsonVision) {

  window.DEMO = {
    JsonVision,
    data: demos[0],
  };

  React.render(React.createElement(Page, {}), document.body);

  // workspace = new Windooman();
  // document.body.appendChild(am.workspace.domElem);
  // workspace.loadWorkspace('base', skeleton);
  // workspace.load('base');
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

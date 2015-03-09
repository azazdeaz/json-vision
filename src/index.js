var React = require('react');
var JsonVision = require('./JsonVision.jsx');
var demo = require('./demo/demo');
var _ = require('lodash');

JsonVision.create = function  (props) {

  var parent = props.parent || document.createElement('div');

  var component = React.render(React.createElement(JVComponent, {
      title: this.title,
      report: change => this._report(change),
  }), parent);

  if (!props.parent && (!_.has(props, 'autoPlace') || props.autoPlace !== false)) {

      this.domElem.style.position = 'fixed';
      this.domElem.style.top = '0px';
      this.domElem.style.right = '15px';
      document.body.appendChild(this.domElem);
  }
};

JsonVision.runDemo = function () {

  demo(JsonVision);
};






module.exports = JsonVision;
if (window) window.JsonVision = JsonVision;

JsonVision.loadFonts = () => {

  function insertCssLink(href) {

      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = href;
      document.head.appendChild(link);
  }

  insertCssLink('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.css');
  insertCssLink('http://fonts.googleapis.com/css?family=Open+Sans:400,700,600,300&subset=latin,latin-ext');
};

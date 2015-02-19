var React = require('react'),
    JEditComponent = require('./template.jsx'),
    colors = require('colors.css');



function JsonVision(opt) {

    this.domElem = opt.parent || document.createElement('div');
    this.data = opt.data || {};
    this.styles = opt.styles || [];
    this.name = opt.name || 'json-vision';

    this.component = React.render(React.createElement(JEditComponent, {name: this.name}), this.domElem);
    this.component.setState({
        data: this.data,
        styles: this.styles
    });
}

module.exports = JsonVision;
if (window) window.JsonVision = JsonVision;

function insertCssLink(href) {

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    document.head.appendChild(link);
}

insertCssLink('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.css');
insertCssLink('http://fonts.googleapis.com/css?family=Open+Sans:400,700,600,300&subset=latin,latin-ext');

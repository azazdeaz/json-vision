var React = require('react'),
    JEditComponent = require('./template.jsx');



function JSONEdit(opt) {

    this.domElem = opt.parent || document.createElement('div');
    this.data = opt.data || {};
    this.name = opt.name || 'JEdit';

    this.component = React.render(React.createElement(JEditComponent, {data: this.data, name: this.name}), this.domElem);
}

window.JSONEdit = JSONEdit;

module.exports = JSONEdit;

function insertCssLink(href) {

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    document.head.appendChild(link);
}

insertCssLink('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.css');
insertCssLink('http://fonts.googleapis.com/css?family=Open+Sans:400,700,600,300&subset=latin,latin-ext');

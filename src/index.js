var React = require('react');
var JVComponent = require('./JsonVisionComponent.jsx');
var demo = require('./demo/demo');
var _ = require('lodash');


function JsonVision(opt) {

    this.domElem = opt.parent || document.createElement('div');
    this.value = opt.value || {};
    this.title = opt.title || 'json-vision';
    this.settings = opt.settings || [];

    this.component = React.render(React.createElement(JVComponent, {
        title: this.title,
        report: change => this._report(change),
    }), this.domElem);

    this.refresh();

    if (!opt.parent && (!_.has(opt, 'autoPlace') || opt.autoPlace !== false)) {

        this.domElem.style.position = 'fixed';
        this.domElem.style.top = '0px';
        this.domElem.style.right = '15px';
        document.body.appendChild(this.domElem);
    }
}

JsonVision.runDemo = function () {

  demo(JsonVision);
};

var p = JsonVision.prototype;

p.refresh = function () {

    this.component.setProps({
        value: this.value,
        settings: this.settings,
    });
};

p._report = function (change) {
    console.log('report change', change);
    switch (change.type) {

        case 'delete':
            delete change.object[change.key];
            break;

        case 'set':
            change.object[change.key] = change.value;
            break;

        case 'splice':
            change.object[change.key].splice(change.index, change.removedCound, ...change.items);
            break;
    }

    this.refresh();
};







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

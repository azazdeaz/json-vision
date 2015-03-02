var React = require('react'),
    JVComponent = require('./JsonVisionComponent.jsx'),
    colors = require('colors.css'),
    _ = require('lodash');


function JsonVision(opt) {

    this.domElem = opt.parent || document.createElement('div');
    this.data = opt.data || {};
    this.settings = opt.settings || [];
    this.name = opt.name || 'json-vision';


    this.component = React.render(React.createElement(JVComponent, {
        name: this.name,
        report: change => this._report(change),
        getByPath: path => this.getByPath(path),
    }), this.domElem);

    this.refresh();

    if (!_.has(opt, 'autoPlace') || opt.autoPlace !== false) {

        this.domElem.style.position = 'fixed';
        this.domElem.style.top = '0px';
        this.domElem.style.right = '15px';
        document.body.appendChild(this.domElem);
    }
}

var p = JsonVision.prototype;

p.refresh = function () {

    this.component.setProps({
        data: this.data,
        settings: this.settings,
    });
};

p.getByPath = function (path) {

    path = path.split('/');
    path.shift();

    var key = path.pop(),
        object = path.reduce((obj, key) => obj[key], this.data);

    return {value: object[key], key, object};
};

p._report = function (change) {

    console.log('report', JSON.stringify(change));

    var {key, object} = this.getByPath(change.path);


    switch (change.type) {

        case 'delete':
            delete object[key];
            break;

        case 'set':
            object[key] = change.value;
            break;

        case 'splice':
            object[key].splice(change.index, change.removedCound, ...change.items);
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

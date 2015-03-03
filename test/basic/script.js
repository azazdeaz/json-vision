var data = {
        foo: 1,
        baz: {
            foo: 'bar'
        },
        checkbox: false,
        container: [
            'foobar',
            'bazbar',
            {item3: 3},
        ],
        typeahed: 'dsdsds',
        // value: new JsonVision.Value({
        //     data: {foo: {bar: 2}},
        //     style: {
        //         textColor: 'blue'
        //     }
        // })
        doSomething: function () {
            console.log('bummmm!!!');
        },
        slider: 6,
    },
    settings = [
        {
            selector: '.baz.foo',
            baseColor   : 'red',
            options: ['tex', 'mex', 'bar', 'max'],
        },
        {
            selected: data.container,
            buttons: [{
                text: 'reset',
                icon: 'eraser',
                onClick: function() {

                },
            }],
        },
        {
            selector: {
                value: function (v) {return typeof(v) === 'number';},
            },
            buttons: [{icon: 'close', onClick: 'delete'}],
        },
        {
            selector: '.',
            buttons: [{icon: 'close', onClick: 'delete'}],
        }, {
            selector: '.checkbox',
            type: 'checkbox',
            tooltip: 'this is a tooltip',
        }, {
            selector: '.container',
            reorderableChildren: true,
            buttons: [{icon: 'plus', type: 'empty', onClick: function (path) {
                var container = editor.getByPath(path).value;
                container.push('valami');
                editor.refresh();
            }}]
        }, {
            selector: '.typeahead',
            type: 'typeahead',
            options: 'asdf,ast,avsd,agrs,ahr,sdh,sregt,sbgdf,gstg,dr,sgdr,sgrd,sgrd,sdgr,rse,ra,ga,gr,gara,grGtr,a,t,atgsgas,agrsagr,gsdrgsdr,gsr,gr'.split(',')
        }, {
            selector: '.doSomething',
            icon: 'bomb',
            text: 'bim',
        }, {
            selected: data.slider,
            type: 'slider',
            min: -100,
            max: 100,
            step: 0.1,
            tooltip: 'slider tooltip',
        }
    ],
    editor = new JsonVision({
        data: data,
        settings: settings,
        parent: document.querySelector('#cont'),
    });

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

        }
    },
    settings = {
        baseColor: 'green',
        select: [
            {
                path: /baz\/foo/,
                settings: {
                    baseColor: 'red',
                    options: ['tex', 'mex', 'bar', 'max'],
                }
            },{
                value: function (v) {return typeof(v) === 'number';},
                settings: {
                    buttons: [{icon: 'close', onClick: 'delete'}],
                }
            }
        ]
            select: {
                path: /baz\/foo/,

            }
            selector: /baz\/foo/,
            baseColor: '#FF4136',
            options: ['tex', 'mex', 'bar', 'max'],
        }, {
            selector: /./,
            buttons: [{icon: 'close', onClick: 'delete'}],
        }, {
            selector: /checkbox/,
            type: 'checkbox',
            tooltip: 'this is a tooltip',
        }, {
            selector: /container$/,
            reorderableChildren: true,
            buttons: [{icon: 'plus', onClick: function (path) {
                var container = editor.getByPath(path).value;
                container.push('valami');
                editor.refresh();
            }}]
        }, {
            selector: /typeahead$/,
            type: 'typeahead',
            options: 'asdf,ast,avsd,agrs,ahr,sdh,sregt,sbgdf,gstg,dr,sgdr,sgrd,sgrd,sdgr,rse,ra,ga,gr,gara,grGtr,a,t,atgsgas,agrsagr,gsdrgsdr,gsr,gr'.split(',')
        },
        {
            select: {
                value: function (v) {return v instanceof RegExp;},
                path: '**',
                settings: {
                    color: 'red'
                }
            },
        }
    },
    editor = new JsonVision({
        data: data,
        settings: settings,
        parent: document.querySelector('#cont'),
    });

editor.settings
    .baseColor('red')
    .select('o.**')
        .baseColor('red')
        .back()
    .select({value: v => typeof(v) === 'number'})
        .type('slider')
        .max(100)
        .min(0)
        .step(1)
    .select('xxx.**')
        .whitelist('yyy')

editor.settigns = {
    
}

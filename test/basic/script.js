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
    },
    styles = [
        {
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
        }
    ],
    editor = new JsonVision({
        data: data,
        styles: styles,
        parent: document.querySelector('#cont'),
    });

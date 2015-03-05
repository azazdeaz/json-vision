var value = {
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
        //     value: {foo: {bar: 2}},
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
            selected: value.baz.foo,
            baseColor   : 'red',
            options: ['tex', 'mex', 'bar', 'max'],
        },
        {
            selected: value.container,
            buttons: [
              {
                text: 'reset',
                icon: 'eraser',
                onClick: function() {
                  
                },
              }, {
                icon: 'list',
                dropdownMenu: {items: [
                  {text: 'item1', value: 'text1'},
                  {text: 'item2', value: 'text2'},
                  {text: 'item3', value: 'text3', onClick: function(){console.log('ggg');}},
                ]
              }
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
            selected: value.typeahead,
            type: 'typeahead',
            options: 'asdf,ast,avsd,agrs,ahr,sdh,sregt,sbgdf,gstg,dr,sgdr,sgrd,sgrd,sdgr,rse,ra,ga,gr,gara,grGtr,a,t,atgsgas,agrsagr,gsdrgsdr,gsr,gr'.split(',')
        }, {
            selector: '.doSomething',
            icon: 'bomb',
            text: 'bim',
        }, {
            selected: value.slider,
            type: 'slider',
            min: -100,
            max: 100,
            step: 0.1,
            tooltip: 'slider tooltip',
        }
    ],
    editor = new JsonVision({
        value: value,
        settings: settings,
        parent: document.querySelector('#cont'),
    });

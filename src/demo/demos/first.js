module.export = {
  objec: {
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
  settings: [
      {
          select: '.baz.foo',
          baseColor   : 'red',
          options: ['tex', 'mex', 'bar', 'max'],
      },
      {
          select: '.container',
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
          select: /container.*/,
          buttons: [{icon: 'close', onClick: 'delete', type: 'empty'}],
      }, {
          select: '.checkbox',
          type: 'checkbox',
          tooltip: 'this is a tooltip',
      }, {
          select: '.typeahead',
          type: 'typeahead',
          options: 'asdf,ast,avsd,agrs,ahr,sdh,sregt,sbgdf,gstg,dr,sgdr,sgrd,sgrd,sdgr,rse,ra,ga,gr,gara,grGtr,a,t,atgsgas,agrsagr,gsdrgsdr,gsr,gr'.split(',')
      }, {
          select: '.doSomething',
          icon: 'bomb',
          text: 'bim',
      }, {
          select: '.slider',
          type: 'slider',
          min: -100,
          max: 100,
          step: 0.1,
          tooltip: 'slider tooltip',
      }
  ]
};

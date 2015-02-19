var data = {
        foo: 1,
        baz: {
            foo: 'bar'
        }
    },
    styles = [
        {
            selector: /./,
            textColor: '#FF4136',
        }
    ],
    editor = new JsonVision({
        data: data,
        styles: styles,
        parent: document.querySelector('#cont'),
    });

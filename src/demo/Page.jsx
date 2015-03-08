var React = require('react');
var style = require('../react-matterkit/style');
var Accordion = require('../react-matterkit/accordion/Accordion.jsx');
var AccordionTab = require('../react-matterkit/accordion/AccordionTab.jsx');

var Page = React.createClass({
  render() {

    var s = {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    };

    return <div style={s}>
      <Head ref='head'/>
      <Body
        object={this.props.object}
        settings={this.props.settings}/>
    </div>;
  }
});

var Head = React.createClass({

  render () {

    var s = {
      width: '100%',
      height: 32,
      backgroundColor: style.palette.grey4,
    };

    return <div style={s}></div>;
  }
});


var Body = React.createClass({

  render () {

    var s = {
      flex: 1,
      position: 'relative',
      width: '100%',
      backgroundColor: style.palette.purple,
      // height: 32,
    };

    return <div style={s}>
      <Left/>
      <Right
        object={this.props.object}
        settings={this.props.settings}/>
    </div>;
  }
});

var Left = React.createClass({

  render () {

    var s = {
      position: 'absolute',
      height: '100%',
      width: '50%',
      backgroundColor: style.palette.grey3,
    };

    return <div style={s}>
      <Accordion>
        <AccordionTab label='first tab'>first tab content</AccordionTab>
        <AccordionTab label='second tab'>second tab content</AccordionTab>
        <AccordionTab label='third tab'>third tab content</AccordionTab>
      </Accordion>
    </div>;
  }
});

var Right = React.createClass({

  componentDidMount() {
    this.editor = new DEMO.JsonVision({
      value: DEMO.data.value,
      settings: DEMO.data.settings,
      parent: this.refs.cont.getDOMNode(),
    });
  },
  render () {

    var s = {
      position: 'absolute',
      height: '100%',
      width: '50%',
      right: 0,
      backgroundColor: style.palette.grey4,
    };

    return <div style={s} ref='cont' key='cont'/>;
  }
});

module.exports = Page;

var React = require('react');
var style = require('../react-matterkit/style');

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
      backgroundColor: style.palette.blue,
    };

    return <div style={s}>
    </div>;
  }
});

var Right = React.createClass({

  render () {

    var s = {
      position: 'absolute',
      height: '100%',
      width: '50%',
      right: 0,
      backgroundColor: style.palette.red,
    };

    return <div style={s}>
      <window.DEMO.JsonVision
        object={this.props.object}
        settings={this.props.settings}/>
    </div>;
  }
});

module.exports = Page;

require('whatwg-fetch');

import React from 'react/addons';
import JsonVision from 'SRC/JsonVision';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };

    window.testPerf = () => {
      var {Perf} = React.addons;
      Perf.start();
      this.forceUpdate();
      Perf.stop();
      Perf.printInclusive();
      Perf.printExclusive();
      Perf.printWasted();
    };
  }

  componentDidMount() {
    fetch('http://api.randomuser.me/?results=50')
      .then(response => response.json())
      .then(json => setTimeout(() => this.setState({users: json.results})));
  }

  handleChange = (users) => {
    this.setState({users});
  }

  render() {
    return <JsonVision
      value = {this.state.users}
      onChange = {this.handleChange}
      settings = {[
        {
          selector: {key: 'gender'},
          input: {options: ['male', 'female', 'other']}
        }, {
          selector: {key: 'zip'},
          input: {type: 'number'}
        }
      ]}/>;
  }
}

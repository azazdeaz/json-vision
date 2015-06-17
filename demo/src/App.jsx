require('whatwg-fetch');

import React from 'react/addons';
import JsonVision from 'SRC/JsonVision';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import {DragDropContext} from 'react-dnd';
import fakeData from './fakeData.json';

@DragDropContext(HTML5Backend)
export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      users: fakeData,
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
    // fetch('http://api.randomuser.me/?results=50')
    //   .then(response => response.json())
    //   .then(json => setTimeout(() => this.setState({users: json.results})));
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
          draggable: true,
        }, {
          selector: {key: 'gender'},
          input: {options: ['male', 'female', 'other']}
        }, {
          selector: {key: 'zip'},
          input: {type: 'number'}
        }
      ]}/>;
  }
}

require('whatwg-fetch');

import React from 'react';
import JsonVision from 'SRC/JsonVision';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    fetch('http://api.randomuser.me/?results=5')
      .then(response => response.json())
      .then(json => this.setState({users: json.results}));
  }

  render() {
    return <JsonVision value={this.state.users}/>;
  }
}

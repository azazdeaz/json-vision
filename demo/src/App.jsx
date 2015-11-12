require('whatwg-fetch')

import React from 'react'
import QuickInterface from 'quick-interface'
import HTML5Backend from 'react-dnd/modules/backends/HTML5'
import {DragDropContext} from 'react-dnd'
import sample from 'lodash/collection/sample'
import fakeData from './fakeData.json'
fakeData.results = sample(fakeData.results, 5)

const getUserSettings = user => ({
  labels: [`${user.name.title}. ${user.name.first} ${user.name.last}`],
})

const getGenderSettings = user => ({
  labels: [`gender:`],
  inputs: [{
    type: 'dropdown',
    value: user.gender,
    options: ['male', 'female']
  }]
})

@DragDropContext(HTML5Backend)
export default class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      ...fakeData,
    }

    window.testPerf = () => {
      var {Perf} = React.addons
      Perf.start()
      this.forceUpdate()
      Perf.stop()
      Perf.printInclusive()
      Perf.printExclusive()
      Perf.printWasted()
    }
  }

  componentDidMount() {
    // fetch('http://api.randomuser.me/?results=50')
    //   .then(response => response.json())
    //   .then(json => setTimeout(() => this.setState({users: json.results})))
  }

  handleChange = (users) => {
    this.setState({users})
  }

  render() {
    const {results} = this.state

    return <QuickInterface settings={{hideHead: true}}>
      {results.map(({user}, idx) => {
        return <QuickInterface key={idx} settings={getUserSettings(user)}>
          <QuickInterface settings={getGenderSettings(user)}/>

        </QuickInterface>
      })}
    </QuickInterface>
  }
}

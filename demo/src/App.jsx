require('whatwg-fetch')

import React from 'react'
import QuickInterface from 'quick-interface'
import HTML5Backend from 'react-dnd/modules/backends/HTML5'
import {DragDropContext} from 'react-dnd'
import capitalize from 'lodash/string/capitalize'
import {
  store,
  changeGender,
} from './store'

const getUserSettings = user => ({
  labels: [`${capitalize(user.name.title)}. ${capitalize(user.name.first)} ${capitalize(user.name.last)}`],
})

const getGenderSettings = user => ({
  labels: [`gender:`],
  inputs: [{
    type: 'dropdown',
    value: user.gender,
    options: ['male', 'female'],
    onChange: value => store.dispatch(changeGender(user.id, value)),
  }]
})

@DragDropContext(HTML5Backend)
export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      users: store.getState()
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
    store.subscribe(() => {
      const users = store.getState()
      console.log({users});
      this.setState({users})
    })
  }

  handleChange = (users) => {
    this.setState({users})
  }

  render() {
    const {users} = this.state

    return <QuickInterface settings={{hideHead: true}}>
      {users.map((user, idx) => {
        return <QuickInterface key={idx} settings={getUserSettings(user)}>
          <QuickInterface settings={getGenderSettings(user)}/>

        </QuickInterface>
      })}
    </QuickInterface>
  }
}

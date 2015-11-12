require('whatwg-fetch')

global.PPP = (function () {
  let data = {}
  return {
    clear() {
      data = {}
    },
    start(name) {
      const t = performance.now()
      return () => data[name] = (data[name] || 0) + (performance.now() - t)
    },
    log() {
      console.log(data)
    }
  }
}());

import React from 'react'
import Perf from 'react-addons-perf'
import QuickInterface from 'quick-interface'
import HTML5Backend from 'react-dnd/modules/backends/HTML5'
import {DragDropContext} from 'react-dnd'
import capitalize from 'lodash/string/capitalize'
import memorize from './memorize'
import {
  store,
  noOp,
  changeUserCount,
  changeGender,
  changeSpeed,
  changeTitle,
  changeFirstName,
  changeLastName,
} from './store'

const getHeadSettings = memorize(
  users => users.length,
  (count) => ({
    labels: ['user count'],
    inputs: [{
      type: 'number',
      value: count,
      dragSpeed: 1,
      onChange: value => store.dispatch(changeUserCount(value)),
    }],
  })
)
const getUserSettings = memorize(
  user => user.title,
  user => user.first,
  user => user.last,
  (title, first, last) => ({
    labels: [`${capitalize(title)}. ${capitalize(first)} ${capitalize(last)}`],
  })
)

const getGenderSettings = memorize(
  user => user.id,
  user => user.gender,
  (id, gender) => ({
    labels: [`gender`],
    inputs: [{
      type: 'dropdown',
      value: gender,
      options: ['male', 'female'],
      onChange: value => store.dispatch(changeGender(id, value)),
    }]
  })
)
const getNameSettings = memorize(
  user => user.id,
  user => user.title,
  user => user.first,
  user => user.last,
  (id, title, first, last) => ({
    inputs: [{
      type: 'dropdown',
      value: title,
      options: ['mr', 'mrs', 'miss', 'ms', 'dr'],
      onChange: value => store.dispatch(changeTitle(id, value)),
    }, {
      type: 'string',
      value: first,
      onChange: value => store.dispatch(changeFirstName(id, value)),
    }, {
      type: 'string',
      value: last,
      onChange: value => store.dispatch(changeLastName(id, value)),
    }]
  })
)

const getSpeedSettings = memorize(
  user => user.id,
  user => user.speed,
  (id, speed) => ({
    labels: [`speed`],
    inputs: [{
      type: 'number',
      value: speed,
      min: 0,
      max: 10,
      dragSpeed: 0.01,
      onChange: value => store.dispatch(changeSpeed(id, value)),
    }]
  })
)

@DragDropContext(HTML5Backend)
export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      users: store.getState()
    }

    window.testPerf = () => {
      PPP.clear()
      Perf.start()
      store.dispatch(noOp())
      Perf.stop()
      Perf.printInclusive()
      Perf.printExclusive()
      Perf.printWasted()
      PPP.log()
    }
  }

  componentDidMount() {
    store.subscribe(() => {
      const users = store.getState()
      this.setState({users})
    })
  }

  handleChange = (users) => {
    this.setState({users})
  }

  renderInterface() {
    const {users} = this.state
    return <QuickInterface settings={getHeadSettings(users)}>
      {users.map((user, idx) => {
        return <QuickInterface key={idx} settings={getUserSettings(user)}>
          <QuickInterface settings={getNameSettings(user)}/>
          <QuickInterface settings={getSpeedSettings(user)}/>
          <QuickInterface settings={getGenderSettings(user)}/>
        </QuickInterface>
      })}
    </QuickInterface>
  }

  render() {

    return <div style={{width: 300, display: 'flex'}}>
      {this.renderInterface()}
      {this.renderInterface()}
    </div>
  }
}

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

const createHeadSettings = ({count}) => ({
  labels: ['user count'],
  inputs: [{
    type: 'number',
    value: count,
    dragSpeed: 1,
    onChange: value => store.dispatch(changeUserCount(value)),
  }],
})

const createUserSettings = ({title, first, last}) => ({
  labels: [`${capitalize(title)}. ${capitalize(first)} ${capitalize(last)}`],
})

const createGenderSettings = ({id, gender}) => ({
  labels: [`gender`],
  inputs: [{
    type: 'dropdown',
    value: gender,
    options: ['male', 'female'],
    onChange: value => store.dispatch(changeGender(id, value)),
  }]
})

const createNameSettings = ({id, title, first, last}) => ({
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

const createSpeedSettings = ({id, speed}) => ({
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

          // <QuickInterface settings={getSpeedSettings(user)}/>
          // <QuickInterface settings={getGenderSettings(user)}/>
  renderInterface() {
    const {users} = this.state
    return (
      <QuickInterface
        count={users.length}
        createSettings={createHeadSettings}>
        {users.map((user, idx) => {
          return (
            <QuickInterface
              key = {idx}
              title = {user.title}
              first = {user.first}
              last = {user.last}
              createSettings={createUserSettings}>
              <QuickInterface
                id = {user.id}
                title = {user.title}
                first = {user.first}
                last = {user.last}
                createSettings={createNameSettings}/>
              <QuickInterface
                id = {user.id}
                speed = {user.speed}
                createSettings={createSpeedSettings}/>
              <QuickInterface
                id = {user.id}
                gender = {user.gender}
                createSettings={createGenderSettings}/>
            </QuickInterface>
          )
        })}
      </QuickInterface>
    )
  }

  render() {

    return <div style={{width: 300, display: 'flex'}}>
      {this.renderInterface()}
      {this.renderInterface()}
    </div>
  }
}

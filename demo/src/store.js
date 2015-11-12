import {createStore} from 'redux'
import fakeData from './fakeData.json'
import sample from 'lodash/collection/sample'
import findIndex from 'lodash/array/findIndex'

function generateRandomUsers(num) {
  return sample(fakeData.results, num)
    .map(({user}, id) => ({...user, ...user.name, id, speed: Math.random() * 3}))
}

const initialUsers = generateRandomUsers(23)

const CHANGE_GENDER = 'CHANGE_GENDER'
export const changeGender = (id, gender) => ({
  type: CHANGE_GENDER,
  id,
  gender,
})

const CHANGE_SPEED = 'CHANGE_SPEED'
export const changeSpeed = (id, speed) => ({
  type: CHANGE_SPEED,
  id,
  speed,
})

const CHANGE_USER_COUNT = 'CHANGE_USER_COUNT'
export const changeUserCount = (count) => ({
  type: CHANGE_USER_COUNT,
  count,
})

const CHANGE_TITLE = 'CHANGE_TITLE'
export const changeTitle = (id, title) => ({
  type: CHANGE_TITLE,
  id,
  title,
})

const CHANGE_FIRST_NAME = 'CHANGE_FIRST_NAME'
export const changeFirstName = (id, firstName) => ({
  type: CHANGE_FIRST_NAME,
  id,
  firstName,
})

const CHANGE_LAST_NAME = 'CHANGE_LAST_NAME'
export const changeLastName = (id, lastName) => ({
  type: CHANGE_LAST_NAME,
  id,
  lastName,
})

const NO_OP = 'NO_OP'
export const noOp = () => ({
  type: NO_OP,
})

function reducer(users=initialUsers, action) {
  switch (action.type) {
    case CHANGE_GENDER:
      return editUser(users, action.id, {gender: action.gender})
    case CHANGE_SPEED:
      return editUser(users, action.id, {speed: action.speed})
    case CHANGE_TITLE:
      return editUser(users, action.id, {title: action.title})
    case CHANGE_FIRST_NAME:
      return editUser(users, action.id, {first: action.firstName})
    case CHANGE_LAST_NAME:
      return editUser(users, action.id, {last: action.lastName})
    case CHANGE_USER_COUNT:
      return generateRandomUsers(action.count)
    case NO_OP:
      return [...users]
    default:
      return users
  }
}

function editUser(users, id, mod) {
  const index = findIndex(users, {id})
  return [
    ...users.slice(0, index),
    {...users[index], ...mod},
    ...users.slice(index + 1)
  ]
}

export const store = createStore(reducer)

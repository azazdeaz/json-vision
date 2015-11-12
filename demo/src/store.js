import {createStore} from 'redux'
import fakeData from './fakeData.json'
import sample from 'lodash/collection/sample'
import findIndex from 'lodash/array/findIndex'
const initialUsers =
  sample(fakeData.results, 5)
    .map(({user}, id) => ({...user, id}))

const CHANGE_GENDER = 'CHANGE_GENDER'
export const changeGender = (id, gender) => ({
  type: CHANGE_GENDER,
  id,
  gender,
})

function reducer(users=initialUsers, action) {
  switch (action.type) {
    case CHANGE_GENDER:
      return editUser(users, action.id, {gender: action.gender})
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

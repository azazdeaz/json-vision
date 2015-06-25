export default function (a, b) {
  var different = (
    !equals(a, b) ||
    !equals(a.input, b.input) ||
    a.input.value !== b.input.value ||
    a.children !== b.children ||
    !equalArraysOfObjects(a.extraInputs, b.extraInputs) ||
    !equalArraysOfObjects(a.buttons, b.buttons)
  )
  return !different
}

function equalArraysOfObjects(arrA, arrB) {
  if (typeof arrA !== typeof arrB) {
    return false
  }

  if (arrA === 'object') {
    if (arrA.length !== arrB.length) {
      return false
    }

    for (var i = 0; i < arrA.length; i++) {
      if (!equals(arrA[i], arrB[i])) {
        return false;
      }

      if (arrA.options) {
        //TODO
      }
    }
  }
}

function equals(objA, objB) {
  if (objA === objB) {
    return true
  }

  if (typeof objA !== 'object' || typeof objB !== 'object') {
    return false
  }

  var keysA = Object.keys(objA)
  var keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB)
  for (var i = 0; i < keysA.length; i++) {
    if (
      !bHasOwnProperty(keysA[i]) ||
      (objA[keysA[i]] !== objB[keysA[i]] &&
        !(
          typeof objA[keysA[i]] === 'object' &&
          typeof objB[keysB[i]] === 'object'
        )
      )
    ) {
      return false
    }
  }

  return true
}

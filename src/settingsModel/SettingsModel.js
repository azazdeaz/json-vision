
export function string() {
  return {
    getMatcher() {
      return (a, b) => a === b
    },

    getMerger() {
      return (a, b, connect) => {
        if (typeof b === 'function') {
          b = b(connect)
        }
      }
    }
  }
}

export function object(model) {
  var keys = Object.keys(model)

  return {
    getMatcher() {
      var matchers = keys.map(key => model[key].getMatcher())

      return (a, b) => {
        return keys.every((key, idx) => {
          matchers[idx](a[key], b[key])
        })
      }
    },

    getMerger() {
      var mergers = keys.map(key => model[key].getMerger())

      return (a, b, connect) => {
        return keys.every((key, idx) => {
          a[key] = mergers[idx](a[key], b[key], connect)
        })
      }
    }
  }
}

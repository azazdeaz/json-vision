export function memorize(model) {
  return {
    match: model.getMatcher(),
    merge: model.getMerger(),
  }
}


export function primitive() {
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

export function func() {
  return {
    getMatcher() {
      return (a, b) => (typeof a === 'function') === (typeof b === 'function')
    },

    getMerger() {
      return (a, b) => b || a
    }
  }
}

export function arrayOf(model) {
  return {
    getMatcher() {
      var matcher = model.getMatcher()

      return (a, b) => {
        if (a.length === undefined || b.length === undefined) {
          return a === b
        }

        if (a.length !== b.length) {
          return false
        }

        for (let i = 0, l = a.length; i < l; ++i) {
          if (!matcher(a[i], b[i])) {
            return false
          }
        }

        return true
      }
    },

    getMerger() {
      var merger = model.getMerger()

      return (a, b, connect) => {
        if (!a) {
          a = []
        }

        if (b) {
          for (let i = 0, l = b.length; i < l; ++i) {
            a.push(merger(null, b[i], connect))
          }
        }
      }
    }
  }
}

export function object(props) {
  var keys = Object.keys(props)

  return {
    getMatcher() {
      var matchers = keys.map(key => props[key].getMatcher())

      return (a, b) => {
        return keys.every((key, idx) => {
          matchers[idx](a[key], b[key])
        })
      }
    },

    getMerger() {
      var mergers = keys.map(key => props[key].getMerger())

      return (a, b, connect) => {
        return keys.every((key, idx) => {
          a[key] = mergers[idx](a[key], b[key], connect)
        })
      }
    }
  }
}

export default function object(props) {
  const keys = Object.keys(props)
  const keysLength = keys.length

  return {
    getMatcher() {
      const matchers = keys.map(key => props[key].getMatcher())

      return (a, b) => {
        var aType = typeof a
        var bType = typeof b

        if (aType !== bType) {
          return false
        }

        if (aType !== 'object') {
          return a === b
        }

        for (let i = 0; i < keysLength; i++) {
          let key = keys[i]
          if (!matchers[i](a[key], b[key])) {
            return false
          }
        }
        return true
      }
    },

    getMerger() {
      const mergers = keys.map(key => props[key].getMerger())

      return (a, b, connect) => {
        if (typeof b === 'function') {
          b = b(connect)
        }

        if (!a || typeof a !== 'object') {
          a = {}
        }

        for (let i = 0; i < keysLength; i++) {
          let key = keys[i]
          let aValue = a[key]
          let bValue = b[key]

          if (bValue !== undefined) {
            a[key] = mergers[i](aValue, bValue, connect)
          }
        }
        return a
      }
    }
  }
}

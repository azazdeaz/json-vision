export default function objectOf(model) {
  return {
    getMatcher() {
      var matcher = model.getMatcher()

      return (a, b) => {
        var aType = typeof a
        var bType = typeof b

        if (aType !== bType) {
          return false
        }

        if (aType !== 'object') {
          return a === b
        }

        var aKeys = Object.keys(a)
        var bKeys = Object.keys(b)

        if (aKeys.length !== bKeys.length) {
          return false
        }

        for (let i = 0, l = aKeys.length; i < l; ++i) {
          // suspect that aKeys and bKeys are the same
          // or at least they values will be different
          let key = aKeys[i]
          if (!matcher(a[key], b[key])) {
            return false
          }
        }

        return true
      }
    },

    getMerger() {
      var merger = model.getMerger()

      return (a, b, connect) => {
        if (typeof b === 'function') {
          b = b(connect)
        }

        var aType = typeof a
        var bType = typeof b

        if (bType !== 'object') {
          return a
        }

        if (b === null) {
          return b
        }
        //so b is an object and not null
        if (aType !== 'object' || a === null) {
          a = {}
        }
        //so a and b both are real objects
        var bKeys = Object.keys(b)
        for (let i = 0, l = bKeys.length; i < l; i++) {
          let key = bKeys[i]
          a[key] = merger(a[key], b[key])
        }
        return a
      }
    }
  }
}

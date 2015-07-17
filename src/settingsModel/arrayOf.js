export default function arrayOf(model) {
  return {
    getMatcher() {
      var matcher = model.getMatcher()

      return (a, b) => {
        if (
          typeof a !== 'object' || a.length === undefined ||
          typeof b !== 'object' || b.length === undefined
        ) {
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

        if (typeof b === 'function') {
          b = b(connect)
        }

        if (b === null) {
          return b
        }

        if (b) {
          for (let i = 0, l = b.length; i < l; ++i) {
            a.push(merger(null, b[i], connect))
          }
        }

        return a
      }
    }
  }
}

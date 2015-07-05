export default function object(props) {
  const keys = Object.keys(props)
  const keysLength = keys.length

  return {
    getMatcher() {
      const matchers = keys.map(key => props[key].getMatcher())

      return (a, b) => {
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

        for (let i = 0; i < keysLength; i++) {
          let key = keys[i]
          a[key] = mergers[i](a[key], b[key], connect)
        }
        return a
      }
    }
  }
}

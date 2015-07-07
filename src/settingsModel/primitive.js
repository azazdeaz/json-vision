export default function primitive() {
  return {
    getMatcher() {
      return (a, b) => {
        if (typeof a === 'object' || typeof b === 'object') {
          return true
        }
        return a === b
      }
    },

    getMerger() {
      return (a, b, connect) => {
        if (typeof b === 'function') {
          b = b(connect)
        }
        return b
      }
    }
  }
}

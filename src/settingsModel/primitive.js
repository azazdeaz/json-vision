export default function primitive() {
  return {
    getMatcher() {
      return (a, b) => a === b
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

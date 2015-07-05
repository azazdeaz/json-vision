export default function func() {
  return {
    getMatcher() {
      return (a, b) => (typeof a === 'function') === (typeof b === 'function')
    },

    getMerger() {
      return (a, b) => b || a
    }
  }
}

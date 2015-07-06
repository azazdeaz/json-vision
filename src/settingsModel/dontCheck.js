export default function dontCheck() {
  return {
    getMatcher() {
      return true
    },

    getMerger() {
      return (a, b, connect) => {
        return b === undefined ? a : b
      }
    }
  }
}

import { createSelectorCreator } from 'reselect'
import memoize from 'lodash/function/memoize'

const hashFn = (...args) => args.reduce(
  (acc, val) => acc + '-' + JSON.stringify(val)
)
const memorizedSelectorCreator = createSelectorCreator(memoize, hashFn)
// export default memorizedSelectorCreator
export default function (...args) {
  const end = PPP.start('select')
  memorizedSelectorCreator(...args)
  end()
}

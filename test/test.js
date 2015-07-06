var assert = require('chai').assert
var M = require('../src/settingsModel')
var {primitive, func, object, objectOf, arrayOf, memorize} = M


describe('basics', () => {
  it('exports properly', () => {
    assert.isFunction(primitive)
    assert.isFunction(func)
    assert.isFunction(object)
    assert.isFunction(objectOf)
    assert.isFunction(arrayOf)
    assert.isFunction(memorize)
  })
})

describe('memorize', () => {
  it('has match and merge functions', () => {
    var model = memorize(primitive())

    assert.isFunction(model.match)
    assert.isFunction(model.merge)
  })
  it('matches properly', () => {
    var model = memorize(primitive())

    assert.isTrue(model.match(1, 1))
    assert.isFalse(model.match(1, 2))
  })
  it('merges properly', () => {
    var model = memorize(primitive())

    assert.strictEqual(model.merge(1, 0), 0)
    assert.strictEqual(model.merge(undefined, 2), 2)
  })
})

function testAPI(type, ...args) {
  assert.isFunction(type)

  var model = type.call(null, ...args)
  assert.isObject(model)

  var matcher = model.getMatcher()
  assert.isFunction(matcher)

  var merger = model.getMerger()
  assert.isFunction(merger)
}

describe('primitive', () => {
  it('implements basic API', () => {
    testAPI(primitive)
  })
  it('matches properly', () => {
    var matcher = primitive().getMatcher()

    assert.isTrue(matcher(undefined, undefined))
    assert.isTrue(matcher(0, 0))
    assert.isFalse(matcher(0, 1))
    assert.isTrue(matcher('a', 'a'))
    assert.isFalse(matcher('a', 'b'))
    assert.isTrue(matcher(false, false))
    assert.isFalse(matcher(false, true))
    assert.isFalse(matcher(1, true))
  })
  it('merges properly', () => {
    var merger = primitive().getMerger()
    assert.strictEqual(merger(0, 1), 1)
    assert.strictEqual(merger(undefined, 1), 1)
  })
  it('resolves computed values', () => {
    var merger = primitive().getMerger()
    var fn = () => 1
    assert.strictEqual(merger(0, fn), 1)
  })
  it('passes connect to the computed value', () => {
    var merger = primitive().getMerger()
    var connect = {}
    var fn = _connect => assert.strictEqual(_connect, connect)
    merger(0, fn, connect)
  })
})

describe('func', () => {
  it('implements basic API', () => {
    testAPI(func)
  })
  it('matches properly', () => {
    var matcher = func().getMatcher()

    assert.isTrue(matcher(undefined, undefined))
    assert.isTrue(matcher(() => {}, () => {}))
    assert.isFalse(matcher(null, () => {}))
    assert.isFalse(matcher(() => {}, null))
    assert.isFalse(matcher('a', () => {}))
  })
  it('merges properly', () => {
    var merger = func().getMerger()
    var fn = () => {}
    assert.strictEqual(merger(() => {}, fn), fn)
    assert.strictEqual(merger(undefined, fn), fn)
  })
  it('isn\'t resolves values as computed values', () => {
    var merger = func().getMerger()
    var fn = () => 1
    assert.strictEqual(merger(0, fn), fn)
  })
})

describe('object', () => {
  it('implements basic API', () => {
    testAPI(object, {})
  })
  it('matches properly', () => {
    var matcher = object({
      foo: primitive()
    }).getMatcher()

    assert.isTrue(matcher(undefined, undefined))
    assert.isTrue(matcher({foo: 0}, {foo: 0}))
    assert.isFalse(matcher({foo: 0}, {foo: 1}))
    assert.isFalse(matcher(undefined, {foo: 1}))
    assert.isFalse(matcher({foo: 0}, undefined))
    assert.isTrue(matcher({foo: 0, bar: 2}, {foo: 0, bar: 3}))
  })
  it('merges properly', () => {
    var merger = object({
      foo: primitive()
    }).getMerger()

    assert.deepEqual(merger({foo: 0}, {foo: 1}), {foo: 1})
    assert.deepEqual(merger({foo: 4}, {}), {foo: 4})
    assert.deepEqual(merger({foo: 4}, {foo: undefined}), {foo: 4})
    assert.deepEqual(merger(undefined, {foo: 1}), {foo: 1})
  })
  it('isn\'t add unused properties', () => {
    var merger = object({
      foo: primitive(),
      bar: primitive()
    }).getMerger()

    var merged = merger({foo: 0}, {foo: 1})
    assert.property(merged, 'foo')
    assert.notProperty(merged, 'bar')
  })
  it('resolves computed values', () => {
    var merger = object({
      foo: primitive()
    }).getMerger()
    var fn = () => ({foo: 1})
    assert.deepEqual(merger({foo: 0}, fn), {foo: 1})
  })
  it('passes connect to the computed value', () => {
    var merger = object({}).getMerger()
    var connect = {}
    var fn = _connect => {
      assert.strictEqual(_connect, connect)
      return {}
    }
    merger({}, fn, connect)
  })
})

describe('objectOf', () => {
  it('implements basic API', () => {
    testAPI(objectOf, primitive())
  })
  it('matches properly', () => {
    var matcher = objectOf(primitive()).getMatcher()

    assert.isTrue(matcher(undefined, undefined))
    assert.isTrue(matcher({foo: 0}, {foo: 0}))
    assert.isFalse(matcher({foo: 0}, {foo: 1}))
    assert.isTrue(matcher({foo: 0, bar: 2}, {foo: 0, bar: 2}))
    assert.isFalse(matcher({foo: 0, bar: 2}, {foo: 0, bar: 3}))
    assert.isFalse(matcher({foo: 0, bar: 2}, {foo: 0, qux: 2}))
  })
  it('merges properly', () => {
    var merger = objectOf(primitive()).getMerger()

    assert.deepEqual(merger({foo: 0, bar: 2}, {foo: 1}), {foo: 1, bar: 2})
    assert.deepEqual(merger({foo: 0}, {foo: 1, bar: 2}), {foo: 1, bar: 2})
    assert.deepEqual(merger(undefined, {foo: 1, bar: 2}), {foo: 1, bar: 2})
  })
  it('resolves computed values', () => {
    var merger = objectOf(primitive()).getMerger()
    var fn = () => ({foo: 1})
    assert.deepEqual(merger({foo: 0}, fn), {foo: 1})
  })
  it('passes connect to the computed value', () => {
    var merger = objectOf(primitive()).getMerger()
    var connect = {}
    var fn = _connect => {
      assert.strictEqual(_connect, connect)
      return {}
    }
    merger({}, fn, connect)
  })
})

describe('arrayOf', () => {
  it('implements basic API', () => {
    testAPI(arrayOf, primitive())
  })
  it('matches properly', () => {
    var matcher = arrayOf(primitive()).getMatcher()

    assert.isTrue(matcher(undefined, undefined))
    assert.isTrue(matcher([1, 2, 3], [1, 2, 3]))
    assert.isFalse(matcher([2, 3], [1, 2, 3]))
    assert.isFalse(matcher([8, 2, 3], [1, 2, 3]))
  })
  it('merges properly', () => {
    var merger = arrayOf(primitive()).getMerger()

    assert.deepEqual(merger([1, 2, 3], [1, 2, 3]), [1, 2, 3, 1, 2, 3])
    assert.deepEqual(merger(undefined, [1, 2]), [1, 2])
  })
  it('resolves computed values', () => {
    var merger = arrayOf(primitive()).getMerger()
    var fnArray = () => [2, 3]
    var fnItem = () => 2
    assert.deepEqual(merger([1], fnArray), [1, 2, 3])
    assert.deepEqual(merger([1], [fnItem]), [1, 2])
  })
  it('passes connect to the computed value', () => {
    var merger = arrayOf(primitive()).getMerger()
    var connect = {}
    var fnArray = _connect => {
      assert.strictEqual(_connect, connect)
      return [2, 3]
    }
    var fnItem = _connect => {
      assert.strictEqual(_connect, connect)
      return 2
    }
    merger([1], fnArray, connect)
    merger([1], [fnItem], connect)
  })
})

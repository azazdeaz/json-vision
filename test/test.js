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
    assert.equal(merger(0, 1), 1)
  })
  it('resolves computed values', () => {
    var merger = primitive().getMerger()
    var fn = () => 1
    assert.equal(merger(0, fn), 1)
  })
  it('passes connect to the computed value', () => {
    var merger = primitive().getMerger()
    var connect = {}
    var fn = _connect => assert(_connect, connect)
    merger(0, fn, connect)
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

    assert.isTrue(matcher({foo: 0}, {foo: 0}))
    assert.isFalse(matcher({foo: 0}, {foo: 1}))
    assert.isTrue(matcher({foo: 0, bar: 2}, {foo: 0, bar: 3}))
  })
  it('merges properly', () => {
    var merger = object({
      foo: primitive()
    }).getMerger()

    assert.deepEqual(merger({foo: 0}, {foo: 1}), {foo: 1})
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
      assert(_connect, connect)
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
      assert(_connect, connect)
      return {}
    }
    merger({}, fn, connect)
  })
})

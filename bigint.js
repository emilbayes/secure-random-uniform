'use strict'

var assert = require('nanoassert')
var sodium = require('sodium-universal')

module.exports = function (limit) {
  assert.ok(limit > 0n, 'limit must be larger than 0')
  for (var width = 0n, n = limit; n > 0n; width++) {
    n >>= 64n
  }

  var max = (1n << (width * 64n))

  var buf = new BigUint64Array(Number(width))

  var min = max - (max % limit)

  var sample = 0n
  do {
    sodium.randombytes_buf(buf)
    sample = buf.reduce((s, n) => s << 64n | n, 0n)
  } while (sample >= min)

  return sample % limit
}

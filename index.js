'use strict'

var assert = require('nanoassert')
var sodium = require('sodium-universal')

var MAX = 0xffffffffffff

var buf = new Uint8Array(6)
module.exports = function secureRandom (limit) {
  assert.ok(Number.isInteger(limit), 'limit must be integer')
  assert.ok(limit > 0,  'limit must be larger than 0')
  assert.ok(limit <= MAX, 'limit must be at most 2^48 - 1')

  // Edge cases:
  // 1: MAX is divisible by limit
  // 2: limit > MAX / 2
  var min = MAX - (MAX % limit)

  var n = 0
  do {
    // Returns number in [0, 2^48)
    randombytes.randombytes_buf(buf)
    n = 0x10000000000 * buf[5]
        + 0x100000000 * buf[4]
        + (((buf[3] << 24) | (buf[2] << 16) | (buf[1] << 8) | (buf[0])) >>> 0)
  } while (n >= min)

  return n % limit
}

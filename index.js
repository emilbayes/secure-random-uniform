'use strict'

var assert = require('nanoassert')
var sodium = require('sodium-universal')

var buf = new Uint8Array(8)
module.exports = function secureRandom (limit) {
  assert.ok(Number.isInteger(limit), 'limit must be integer')
  assert.ok(limit > 0,  'limit must be larger than 0')
  assert.ok(limit <= Number.MAX_SAFE_INTEGER, 'limit must be at most 2^53 - 1')

  // Edge cases:
  // 1: MAX is divisible by limit
  // 2: limit > MAX / 2
  var min = MAX - (MAX % limit)

  var n = 0
  do {
    // Returns number in [0, 2^53)
    randombytes.randombytes_buf(buf)
    n = ((((buf[7] & 0b00000111) << 21) ^ (buf[6] << 16) ^ (buf[5] << 8) ^ (buf[4])) >>> 0) * 0x100000000 // 21 bits, shifted left 32 bits
        + (((buf[3] << 24) ^ (buf[2] << 16) ^ (buf[1] << 8) ^ (buf[0])) >>> 0) // 32 bits
  } while (n >= min)

  return n % limit
}

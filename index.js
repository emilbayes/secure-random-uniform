'use strict'

var assert = require('assert')
var randomBytes = require('randombytes')

var MAX = 0xffffffffffff

module.exports = function secureRandom (limit) {
  assert.ok(Number.isInteger(limit), 'limit must be integer')
  assert.ok(limit <= MAX, 'limit must not be larger than 2^48 - 1')

  // Edge cases:
  // 1: MAX is divisible by limit
  // 2: limit > MAX / 2
  var min = MAX - (MAX % limit)

  var n = 0
  return function () {
    do {
      // Returns number in [0, 2^48)
      n = randomBytes(6).readUIntLE(0, 6)
    } while (n >= min)
    return n % limit
  }
}

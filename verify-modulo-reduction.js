'use strict'

var assert = require('assert')

var i = 0
function random () {
  return i++ % 256
}

var MAX = 256 // Let's choose a smaller MAX
function verify (limit) {
  var min = MAX - (MAX % limit)

  assert.equal(min % limit, 0)

  var n
  do {
    n = random() // Stub out random
  } while (n >= min)
  return n % limit
}

// Choose a prime number that's not a divisor of MAX
function test (lim) {
  var samples = lim * 1e6 // Choose a multiple of our limit

  var freq = Array(lim).fill(0)

  while (samples--) {
    if (freq[verify(lim)]++ === Number.MAX_SAFE_INTEGER) break
  }

  assert.deepEqual(Array(lim).fill(1e6), freq)
}

test(9)
test(229)

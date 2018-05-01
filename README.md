# `secure-random-uniform`

> Generate secure, random, uniform integers, compensating for modulo bias

## Usage

```js
var secureRandom = require('secure-random-uniform')

// Numbers from [0, 2000)
secureRandom(2000)

// Numbers from [100, 110)
secureRandom(10) + 100

// Numbers from [-10, 10]
secureRandom(21) - 10
```

### BigInt support (Experimental!)

```js
var secureRandom = require('secure-random-uniform/bigint')

// Numbers from [0, 2^64)
secureRandom(2n ** 64n)

// Numbers from [0, googol)
secureRandom(10n ** 100n)
```

## API

#### `var num = secureRandomUniform(limit)`
Returns a number from the uniform distribution `[0, limit)` (limit exclusive).
Note that limit must not be larger than `2^53 - 1` (`Number.MAX_SAFE_INTEGER`).

## Background

### Modulo reduction: Bytes to integers

A naive implementation might look like:

```js
function insecureRandom (limit) {
  return secureRandomSource() % limit
}
```

However this will only yield a uniform distribution if `limit` is a divisor
of whatever is the maximum value of `secureRandomSource()`. Consider `limit = 3`
and the maximum value returned by `secureRandomSource()` being `5`. Then in the
long run the frequency of numbers returned will be `[0 = 2/5, 1 = 2/5, 2 = 1/5]`,
causing the distribution to be skewed (ie. not uniform).
This is called "Modulo Bias".

This module borrows from `arc4random_uniform` and keeps generating a new random
number until it hits a range that's congruent to `limit`. This is not as bad as
it sounds. The worst case is if `limit ≈ (2^48 - 1) / 2`, in which case it will
have a ~ 0.5 chance of doing a redraw. The number of redraws required can be
modelled by as `0.5^(redraws)` which quickly converges towards zero. In practise
only one draw is required on average.

See [`verify-modulo-reduction.js`](verify-modulo-reduction.js) for a deterministic test of the algorithm

### Random bytes to integers

The next issue is transforming random bytes into unsigned numbers. We can
efficiently transform bytes into signed 32-bit integers in JS with:

```js
(byte[3] << 24) | (byte[2] << 16) | (byte[1] << 8) | (byte[0])
```

To make the number unsigned we can do a zero-fill right shift, which will cause
the sign bit to become 0:

```js
((byte[3] << 24) | (byte[2] << 16) | (byte[1] << 8) | (byte[0])) >>> 0
```

To go beyond 32-bit integers, to the maximum of 53-bit integers representable in
Javascript `Number`s (IEEE 754), we can construct the remaining 21 bits and move
them up using a floating point multiplication.

```js
((((buf[6] & 0b00011111) << 16) | (buf[5] << 8) | (buf[4])) >>> 0) * 0x100000000
+ (((byte[3] << 24) | (byte[2] << 16) | (byte[1] << 8) | (byte[0])) >>> 0)
```

Note that the bitwise operations have been wrapped in parenthesis, otherwise
the add and multiplication operation will become 32-bit operations,
reducing the number modulo 2^32

See [`verify-readle.js`](verify-readle.js) for verification against a known
implementation of converting bytes to unsigned integers.

## License

[ISC](LICENSE.md)

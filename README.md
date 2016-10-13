# `secure-random-uniform`

> Generate secure, random, uniform integers, compensating for modulo bias

## Usage

```js
var secureRandom = require('secure-random-uniform')

// Numbers from [0, 2000)
var tt = secureRandom(2000)

tt() // sample
tt()
// ...
tt()
```

Other common use cases:

```js
// Numbers from [0, 2000] (inclusive)
var incl = secureRandom(2001)

// Numbers from [100, 200]
var h = secureRandom(100)

h() + 100
h() + 100

```

## API

#### `secureRandomUniform(limit)`
Returns a function that can be called repeatedly to sample from the uniform
distribution `[0, limit)` (limit exclusive). Note that limit must not be larger
than `2^48 - 1`.

## Background

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

See [`verification.js`](verification.js) for a deterministic test of the algorithm

## License

[ISC](LICENSE.md)

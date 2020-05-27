var sodium = require('sodium-native')
var rand = require('.')

var len = 23
var template = Array(len)
for (var i = 0; i < template.length; i++) {
  template[i] = 0
}

console.log('# The following 𝜒²-tests can be executed in the R language')
console.log('# This program will keep outputting new tests until it is killed')
while (true) {
  var s = template.slice()
  var r = template.slice()

  for (i = 0; i < 1e7; i++) {
    r[rand(len)]++
    s[sodium.randombytes_uniform(len)]++
  }

  console.log(`chisq.test(c(${s.join()}), c(${r.join()}))`)
}

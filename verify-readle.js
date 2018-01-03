var sodium = require('sodium-universal')
var buf = Buffer.alloc(6)

var a, b
while (true) {
  sodium.randombytes_buf(buf)
  b = buf.readUIntLE(0, 6)
  a = 0x10000000000 * buf[5]
      + 0x100000000 * buf[4]
      + (((buf[3] << 24) | (buf[2] << 16) | (buf[1] << 8) | (buf[0])) >>> 0)

  if(a !== b) {
    console.log('0x' + a.toString(16), a)
    console.log('0x' + b.toString(16), b)
    process.exit(1)
  }
}

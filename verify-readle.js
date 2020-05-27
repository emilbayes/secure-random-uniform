var sodium = require('sodium-native')
var buf = Buffer.alloc(8).fill(0xff)

var max = ((((buf[6] & 0b00011111) << 16) | (buf[5] << 8) | (buf[4])) >>> 0) * 0x100000000 + // 21 bits, shifted left 32 bits
          (((buf[3] << 24) | (buf[2] << 16) | (buf[1] << 8) | (buf[0])) >>> 0) // 32 bits

if (max !== Number.MAX_SAFE_INTEGER) {
  console.log('0b' + max.toString(2), max)
  console.log('0b' + Number.MAX_SAFE_INTEGER.toString(2), Number.MAX_SAFE_INTEGER)
  process.exit(1)
}

var a, b
while (true) {
  sodium.randombytes_buf(buf)
  b = buf.readUIntLE(0, 6)
  a = (((buf[5] << 8) | (buf[4])) >>> 0) * 0x100000000 +
      (((buf[3] << 24) | (buf[2] << 16) | (buf[1] << 8) | (buf[0])) >>> 0)

  if (a !== b) {
    console.log('0x' + a.toString(16), a)
    console.log('0x' + b.toString(16), b)
    process.exit(1)
  }
}

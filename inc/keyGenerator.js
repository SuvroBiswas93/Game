const crypto = require("crypto");

class KeyGenerator {
  static generateKey(keyLength) {
    return crypto.randomBytes(keyLength).toString("hex"); // 256-bit key
  }
}
module.exports = { KeyGenerator };

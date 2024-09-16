const crypto = require("crypto");

class HmacGenerator {
  static generateHmac(key, move) {
    return crypto.createHmac("sha256", key).update(move).digest("hex");
  }
}
module.exports = { HmacGenerator };

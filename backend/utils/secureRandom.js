const { Buffer } = require('safe-buffer');
const crypto = require('crypto');

function getSecureRandomBytes(length = 16) {
  return crypto.randomBytes(length);
}

module.exports = { getSecureRandomBytes };

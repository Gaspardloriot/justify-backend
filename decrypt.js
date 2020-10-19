const crypto = require('crypto');

const tokenDecrypt = (encrypted) => {
    const mykey = crypto.createDecipher('aes-128-cbc', 'token');
    let decrypted = mykey.update(encrypted, 'hex', 'utf8')
    decrypted += mykey.final('utf8');
    return decrypted;
  }

  module.exports=tokenDecrypt;
const sodium = require('sodium-universal')

class OnetimeKeys {
  constructor (sessionKey, nonce, oneTimeKey) {
    this.sessionKey = sessionKey
    this.nonce = nonce || new Uint8Array(sodium.crypto_stream_chacha20_ietf_NONCEBYTES)
    this.oneTimeKey = oneTimeKey || new Uint8Array(sodium.crypto_stream_chacha20_ietf_KEYBYTES)
  }

  transmit (mac, message) {
    this.nextKey(this.oneTimeKey)
    sodium.crypto_onetimeauth(mac, message, this.oneTimeKey)
  }

  receive (mac, message) {
    this.nextKey(this.oneTimeKey)
    return sodium.crypto_onetimeauth_verify(mac, message, this.oneTimeKey)
  }

  nextKey (oneTimeKey) {
    sodium.crypto_stream_chacha20_ietf(oneTimeKey, this.nonce, this.sessionKey)

    let n = 0
    while ((++this.nonce[n]) === 256) {
      if (++n === this.nonce.length) {
        throw new Error('Nonce overflowed')
      }
    }
  }

  destroy () {
    sodium.sodium_memzero(this.sessionKey)
    sodium.sodium_memzero(this.oneTimeKey)
    sodium.sodium_memzero(this.nonce)
  }
}

OnetimeKeys.MACBYTES = sodium.crypto_onetimeauth_BYTES
OnetimeKeys.KEYBYTES = sodium.crypto_stream_chacha20_ietf_KEYBYTES

module.exports = OnetimeKeys

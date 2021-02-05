# simple-one-time-keys

Generate cryptographic onetime keys in way similar to what's described
here, https://tools.ietf.org/html/rfc7539#section-2.6

```
npm install simple-one-time-keys
```

## Usage

``` js
const OneTimeKeys = require('simple-one-time-keys')

// Session key should be a secret unique shared unguessable key
const sender = new OneTimeKeys(sessionKey)
const receiver = new OneTimeKeys(sessionKey)

const mac = Buffer.alloc(OneTimeKeys.MACBYTES)
sender.transmit(mac, Buffer.from('first message'))

if (receiver.receive(mac, Buffer.from('first message'))) {
  console.log('mac is correct')
} else {
  console.log('mac is incorrect')
}

sender.transmit(mac, Buffer.from('second message'))
...
```

## API

#### `otk = new OneTimeKeys(sessionKey, [nonceBuffer], [macKeyBuffer])`

Make a new instance from a secret unique shared unguessable key.

Optionally you can pass in the buffers to which to store the internal nonce
and mac key in (defaults to uint8arrays).

#### `otk.transmit(mac, message)`

Generate a mac for the next message you transmit. The mac is written to the mac buffer.

#### `verified = otk.receive(mac, message)`

Verify an incoming mac and message.

#### `otk.destroy()`

Memzeros the internal state.

#### `OneTimeKeys.MACBYTES`

How many bytes the mac buffer should be.

#### `OneTimeKeys.KEYBYTES`

How many bytes the session key buffer should be.

## License

MIT

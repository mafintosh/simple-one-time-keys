const tape = require('tape')
const OnetimeKeys = require('./')
const sodium = require('sodium-universal')

tape('basic', function (t) {
  const sessionKey = Buffer.alloc(OnetimeKeys.KEYBYTES)
  sodium.randombytes_buf(sessionKey)

  const sender = new OnetimeKeys(sessionKey)
  const receiver = new OnetimeKeys(sessionKey)

  const mac = Buffer.alloc(OnetimeKeys.MACBYTES)

  sender.transmit(mac, Buffer.from('first'))
  t.ok(receiver.receive(mac, Buffer.from('first')))

  const firstMac = Buffer.from(mac)

  sender.transmit(mac, Buffer.from('second'))
  t.ok(receiver.receive(mac, Buffer.from('second')))

  sender.transmit(mac, Buffer.from('third'))
  t.ok(receiver.receive(mac, Buffer.from('third')))

  sender.transmit(mac, Buffer.from('first'))
  t.ok(receiver.receive(mac, Buffer.from('first')))

  t.notSame(mac, firstMac)

  sender.destroy()
  receiver.destroy()

  t.end()
})

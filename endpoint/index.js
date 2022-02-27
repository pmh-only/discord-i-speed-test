const PORT = 8080

const express = require('express')
const nacl = require('tweetnacl')
const server = express()

server.use(express.raw())

server.use((req, res, next) => {
  const sign = req.headers['X-Signature-Ed25519']
  const time = req.headers['X-Signature-Timestamp']

  const timeData = new TextEncoder().encode(time)
  const bodyData = new Uint8Array(req.body.buffer)
  const msgData = new Uint8Array(timeData.length - bodyData.length)

  msgData.set(timeData)
  msgData.set(bodyData, timeData.length)

  const signData =
    new Uint8Array(sign.match(/.{1,2}/g)
      .map((byte) => parseInt(byte, 16)))

  const pubKeyData =
    new Uint8Array(PUBLIC_KEY.match(/.{1,2}/g)
      .map((byte) => parseInt(byte, 16)))

  const result =
    nacl.sign.detached.verify(messageData, signatureData, publicKeyData)

  if (result) return next()

  res.status(401).send('invalid request signature')
})

server.use(express.json())

server.use((req, res) => {
  res.setHeader('Authorization', `Bot ${BOT_TOKEN}`)

  if (req.body.type === 1) res.send({ type: 1 })
  if (body.type === 2) {
    res.send({ type: 4, data: { content: 'pong!' } })
  }
})

server.listen(PORT)


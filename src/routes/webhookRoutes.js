const express = require('express')
const router = express.Router()

const { redisClient } = require('../config/redis')

router.post('/webhook/test', async (req, res) => {
  const eventId = req.body.event_id

  if (!eventId) {
    return res.status(400).json({ error: 'event_id required' })
  }

  const exists = await redisClient.get(`wh_${eventId}`)

  if (exists) {
    console.log('♻️ Duplicate webhook ignored:', eventId)
    return res.json({ status: 'duplicate ignored' })
  }

  await redisClient.set(`wh_${eventId}`, '1', { EX: 86400 })

  console.log('✅ Processing webhook:', eventId)

  res.json({ status: 'processed' })
})

module.exports = router

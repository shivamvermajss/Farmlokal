const axios = require('axios')
const { redisClient } = require('../config/redis')

async function getAccessToken() {

  // 1️⃣ check cache
  const cached = await redisClient.get('oauth_token')
  if (cached) {
    console.log('⚡ Token from Redis')
    return cached
  }

  // 2️⃣ acquire lock so only one refresh happens
  const lock = await redisClient.set('oauth_lock', '1', {
    NX: true,
    EX: 30
  })

  if (!lock) {
    // another request is refreshing — wait then read cache
    await new Promise(r => setTimeout(r, 500))
    return redisClient.get('oauth_token')
  }

  console.log('🔐 Fetching new OAuth token')

  // 3️⃣ fetch token
  const response = await axios.post(
    process.env.OAUTH_URL,
    {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      audience: process.env.AUDIENCE,
      grant_type: 'client_credentials'
    }
  )

  const token = response.data.access_token
  const ttl = response.data.expires_in || 3600

  // 4️⃣ store in Redis
  await redisClient.set('oauth_token', token, { EX: ttl - 60 })

  // 5️⃣ release lock
  await redisClient.del('oauth_lock')

  return token
}

module.exports = { getAccessToken }

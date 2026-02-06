const { createClient } = require('redis')

if (!process.env.REDIS_URL) {
  console.error('❌ REDIS_URL is not defined in environment variables')
}

const redisClient = createClient({
  url: process.env.REDIS_URL
})

redisClient.on('connect', () => {
  console.log('✅ Redis Connected')
})

redisClient.on('error', (err) => {
  console.error('❌ Redis Error:', err)
})

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect()
  }
}

module.exports = {
  redisClient,
  connectRedis
}

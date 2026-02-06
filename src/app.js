
require('dotenv').config()
const express = require('express')
const db = require('./config/db')
const { connectRedis } = require('./config/redis')
const getAccessToken = require('./utils/auth0Token')
const externalBreaker = require('./clients/externalClient')
const { redisClient } = require('./config/redis')
const productRoutes = require('./routes/productRoutes')
const limiter = require('./middlewares/rateLimiter')
const externalRoutes = require('./routes/externalRoutes')
const webhookRoutes = require('./routes/webhookRoutes')


const app = express()

// middleware
app.use(express.json())
app.use(limiter)

// test route
app.get('/', (req, res) => {
  res.send('Farmlokal Backend API Running')
})
app.get('/test-token', async (req, res) => {
  const token = await getAccessToken()
  res.json({ token })
})

app.use(productRoutes)
app.use(externalRoutes)
app.use(webhookRoutes)



// start server
const PORT = process.env.PORT || 3000

async function testDB() {
  try {
    const conn = await db.getConnection()
    console.log("✅ MySQL Connected")
    conn.release()
  } catch (err) {
    console.error("❌ MySQL Connection Error:", err.message)
  }
}

testDB()
connectRedis()




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

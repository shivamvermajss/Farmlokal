if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const db = require('./config/db')
const { connectRedis } = require('./config/redis')
const getAccessToken = require('./utils/auth0Token')
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

const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    // ✅ MySQL
    const conn = await db.getConnection()
    console.log('✅ MySQL Connected')
    conn.release()

    // ✅ Redis
    await connectRedis()

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })
  } catch (err) {
    console.error('❌ Server startup failed:', err)
    process.exit(1) // stop bad deployments
  }
}

startServer()

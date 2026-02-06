const express = require('express')
const router = express.Router()

const externalBreaker = require('../clients/externalClient')

router.get('/external-posts', async (req, res) => {
  try {
    const result = await externalBreaker.fire()
    res.json(result.data)
  } catch (err) {
    res.status(503).json({
      error: 'External service unavailable',
      message: err.message
    })
  }
})

module.exports = router

const express = require('express')
const router = express.Router()

const { getProducts } = require('../services/productService')

router.get('/products', async (req, res) => {
  try {
    const data = await getProducts(req.query)

    const nextCursor =
      data.length > 0 ? data[data.length - 1].id : null

    res.json({
      count: data.length,
      next_cursor: nextCursor,
      items: data
    })

  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch products',
      message: err.message
    })
  }
})

module.exports = router

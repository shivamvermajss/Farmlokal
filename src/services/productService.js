const { redisClient } = require('../config/redis')
const { fetchProducts } = require('../repositories/productRepo')

function buildCacheKey(q) {
  return 'products:' + JSON.stringify(q)
}

async function getProducts(query) {

  const q = {
    cursor: query.cursor || 0,
    limit: query.limit || 5,
    category: query.category,
    search: query.search,
    sort: query.sort,
    order: query.order
  }

  const key = buildCacheKey(q)

  // check cache
  const cached = await redisClient.get(key)
  if (cached) {
    console.log('⚡ Products from Redis cache')
    return JSON.parse(cached)
  }

  // fetch from DB
  const rows = await fetchProducts(q)

  // cache result (short TTL for freshness)
  await redisClient.set(key, JSON.stringify(rows), {
    EX: 60
  })

  return rows
}

module.exports = { getProducts }

const db = require('../config/db')

async function fetchProducts({
  cursor = 0,
  limit = 5,
  category,
  search,
  sort = 'id',
  order = 'ASC'
}) {

  cursor = parseInt(cursor) || 0
  limit = parseInt(limit) || 5

  let query = `
    SELECT id, name, category, price, stock, created_at
    FROM products
    WHERE id > ?
  `

  const params = [cursor]

  if (category) {
    query += ` AND category = ?`
    params.push(category)
  }

  if (search) {
    query += ` AND name LIKE ?`
    params.push(search + '%')
  }

  const allowedSort = ['id', 'price', 'created_at']
  if (!allowedSort.includes(sort)) sort = 'id'

  // ✅ safe order handling
  order = (order || 'ASC').toUpperCase() === 'DESC' ? 'DESC' : 'ASC'

  query += ` ORDER BY ${sort} ${order} LIMIT ?`
  params.push(limit)

  console.log("SQL:", query)
  console.log("Params:", params)

  const [rows] = await db.query(query, params)

  return rows
}

module.exports = { fetchProducts }

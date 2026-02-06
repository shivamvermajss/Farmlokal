# FarmLokal Backend Engineering Assignment

A production-style Node.js + Express backend built to demonstrate system design, performance optimization, and reliability patterns using MySQL and Redis.

This project implements OAuth2 authentication, external API integrations, Redis caching, cursor-based pagination, and reliability techniques such as rate limiting, retries, and circuit breakers.

---

# 🚀 Tech Stack

* Node.js (JavaScript)
* Express.js
* MySQL
* Redis
* Docker (for Redis)
* Auth0 (OAuth2 Client Credentials)

---

# 🔐 Authentication — OAuth2 Client Credentials

Implemented OAuth2 Client Credentials flow using Auth0.

Features:

* Machine-to-machine authentication
* Access token fetched from OAuth provider
* Token cached in Redis with TTL
* Concurrency-safe refresh using Redis lock
* Prevents duplicate token refresh under load

Test endpoint:

```
GET /test-token
```

---

# 🌍 External API Integrations

## ✅ Synchronous External API

Integrated external API using axios.

Reliability features:

* Request timeout
* Retry with backoff
* Circuit breaker pattern (opossum)

Endpoint:

```
GET /external-posts
```

---

## 🔁 Webhook / Callback API

Webhook endpoint with idempotency protection.

Features:

* Redis idempotency keys
* Duplicate event detection
* Safe retry handling

Endpoint:

```
POST /webhook/test
```

Body:

```json
{
  "event_id": "abc123"
}
```

---

# 📦 Product Listing API (Performance Critical)

Endpoint:

```
GET /products
```

Supports:

* Cursor-based pagination
* Sorting
* Search (prefix, index-friendly)
* Category filters
* Redis response caching

Examples:

```
/products
/products?cursor=5
/products?limit=10
/products?category=fruit
/products?search=A
/products?sort=price&order=DESC
```

---

# ⚡ Performance Optimizations

* Cursor pagination (no OFFSET scans)
* MySQL indexes on category + price and name
* Prefix search to keep index usage
* Query-level Redis caching
* Minimal DB queries
* Prepared parameter binding
* Whitelisted sort fields (SQL safe)

---

# 🧠 Reliability Techniques Implemented

At least two were required — this project includes four:

* Redis caching
* Rate limiting middleware
* Retry with backoff
* Circuit breaker
* Webhook idempotency keys

---

# 🗄 Database Schema

Products table:

```
id BIGINT PRIMARY KEY
name VARCHAR
category VARCHAR
price DECIMAL
stock INT
created_at TIMESTAMP
```

Indexes:

```
idx_category_price (category, price)
idx_name (name)
```

---

# 🧩 Architecture

```
routes → services → repositories → database
        ↓
      clients → external APIs
        ↓
      utils → retry / helpers
        ↓
   middlewares → rate limiting
```

Structure:

```
src/
  routes/
  services/
  repositories/
  clients/
  middlewares/
  config/
  utils/
```

---

# 🧪 Local Setup

## 1️⃣ Install dependencies

```
npm install
```

---

## 2️⃣ Environment variables (.env)

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=YOUR_PASSWORD
DB_NAME=farmlokal

OAUTH_URL=YOUR_AUTH0_TOKEN_URL
CLIENT_ID=YOUR_CLIENT_ID
CLIENT_SECRET=YOUR_SECRET
AUDIENCE=YOUR_API_IDENTIFIER
```

---

## 3️⃣ Start Redis (Docker)

```
docker run -d -p 6379:6379 redis
```

---

## 4️⃣ Run server

```
nodemon src/app.js
```

---

# ☁️ Deployment

Deployed on Render.

Deployed URL:

```
<< ADD YOUR RENDER URL HERE >>
```

---

# ⚖️ Tradeoffs & Design Choices

* Cursor pagination chosen over offset for scalability
* Short Redis TTL balances freshness vs speed
* Circuit breaker prevents cascading failures
* Query-hash cache keys allow filter caching
* Prefix search used to preserve index usage
* Rate limiting protects system under burst load

---

# ✅ Assignment Requirement Coverage

* OAuth2 Client Credentials ✔
* Redis token caching ✔
* Concurrency-safe refresh ✔
* External API + timeout + retry ✔
* Webhook + idempotency ✔
* Product API with pagination/filter/sort ✔
* Large dataset design ✔
* Redis caching ✔
* Reliability techniques ✔

---

# 👤 Author

Backend Engineering Assignment Submission — FarmLokal Hackathon

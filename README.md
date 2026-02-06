# FarmLokal Backend Assignment

Use of AI tools is allowed, but candidates must be able to explain and justify their implementation decisions.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-5.0-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![Redis](https://img.shields.io/badge/Redis-6.0-red)

## Overview

This is the backend for **FarmLokal**, a hyperlocal marketplace connecting households directly with local farmers. This project demonstrates a production-ready system design focusing on **performance, scalability, and reliability**.

**Deployed URL**: [https://farmlokal-backend.onrender.com](https://farmlokal-backend.onrender.com) _(Replace with your actual deployment URL)_

## Key Features

### 🚀 Performance & Scalability
- **Product Listing API**: Optimized with **cursor-based pagination** for large datasets (1M+ records).
- **Redis Caching**:
  - **Products**: Cached with short TTL (60s) for freshness.
  - **Auth Tokens**: OAuth2 tokens cached to minimize external calls.
- **Database Indexing**: SQL schema designed with indexes for fast filtering and sorting.

### 🛡 Reliability & Resilience
- **Rate Limiting**: Protects against abuse (30 requests/min per IP).
- **Circuit Breaker**: Uses `opossum` to handle external API failures gracefully.
- **Retry Mechanism**: Exponential backoff for transient failures.
- **Idempotency**: Webhook processing ensures events are handled exactly once using Redis keys.

### 🔐 Authentication
- **OAuth2 Client Credentials Flow**: Secure server-to-server communication.
- **Token Management**: Auto-refresh and concurrency locking (Mutex) in Redis to prevent "thundering herd" issues.

---

## Tech Stack

- **Runtime**: Node.js (Express)
- **Database**: MySQL (Relational Data), Redis (Caching & Locks)
- **Deployment**: Render / Docker
- **External Integration**: Axios + Opossum (Circuit Breaker)

---

## Architecture

The project follows a **Controller-Service-Repository** layered architecture:

```
src/
├── routes/          # API Route Definitions
├── middlewares/     # Rate Limiters, Auth Middleware
├── services/        # Business Logic (Caching, Complex Rules)
├── repositories/    # Database Access Layer (SQL Queries)
├── clients/         # External API Wrappers (Circuit Breakers)
├── config/          # DB & Redis Configuration
└── utils/           # Helpers (Auth0, Retry Logic)
```

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MySQL Server
- Redis Server

### 1. Clone the Repository
```bash
git clone https://github.com/shivamvermajss/Farmlokal.git
cd Farmlokal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=farmlokal

# Auth0 / OAuth2 Config
OAUTH_URL=https://your-domain.auth0.com/oauth/token
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
AUDIENCE=https://farmlokal-api

# Redis
REDIS_URL=redis://localhost:6379
```

### 4. Database Setup
Run the `schema.sql` script to create the table and seed data:

```bash
mysql -u root -p farmlokal < schema.sql
```

### 5. Start the Application
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

---

## API Documentation

### 1. Product Listing
**GET** `/products`

Retrieve a list of products with pagination and filtering.

**Query Parameters**:
- `cursor` (int): ID of the last item seen (for pagination).
- `limit` (int): Number of items (default 5).
- `search` (string): Search by name.
- `category` (string): Filter by category (e.g., 'Vegetables').
- `sort` (string): Field to sort by (`price`, `stock`).
- `order` (string): `ASC` or `DESC`.

**Response**:
```json
[
  {
    "id": 11,
    "name": "Fresh Paneer",
    "price": "350.00",
    "category": "Dairy"
  }
]
```

### 2. External Integration
**GET** `/external-posts`

Fetches data from a third-party API. Protected by a **Circuit Breaker**.
- **Success**: Returns data.
- **Failure**: Returns 503 if service is down/timed out.

### 3. Webhook (Idempotent)
**POST** `/webhook/test`

Simulates receiving an event webhook.
- **Body**: `{ "event_id": "12345" }`
- **Behavior**:
  - First request: Returns `processed`.
  - Second request (same ID): Returns `duplicate ignored`.

### 4. Auth Token Test
**GET** `/test-token`

Fetches an OAuth2 access token (demonstrates Auth0 integration).

---

## Design Decisions & Trade-offs

### 1. **Cursor-based Pagination**
- **Decision**: Used `id > cursor` instead of `OFFSET/LIMIT`.
- **Reason**: `OFFSET` becomes slow with large datasets (O(N)). Cursor is O(1) with an index.
- **Trade-off**: Harder to implement specialized sorts or jump to a specific page number.

### 2. **Redis Caching Strategy**
- **Decision**: Cache product lists with query parameters as the key.
- **TTL**: Short (60 seconds) to ensure inventory data is relatively fresh without hitting the DB on every request.
- **Trade-off**: Potential for slightly stale stock data, but significantly reduced DB load.

### 3. **Circuit Breaker**
- **Decision**: Wrapped external API calls with `opossum`.
- **Reason**: To prevent cascading failures if the external service hangs or goes down. FAILS FAST.

### 4. **Auth Token Caching with Locks**
- **Decision**: Implemented a Redis Mutex (Lock).
- **Reason**: When the token expires, multiple concurrent requests might try to refresh it simultaneously ("Thundering Herd"). The lock ensures only ONE request refreshes the token while others wait or use the old one.

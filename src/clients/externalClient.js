const axios = require('axios')
const CircuitBreaker = require('opossum')
const retry = require('../utils/retry')

// axios call with timeout
async function fetchExternalData() {
  return axios.get(
    'https://jsonplaceholder.typicode.com/posts',
    { timeout: 2000 } // timeout required by assignment
  )
}

// wrap with retry
function callWithRetry() {
  return retry(fetchExternalData, 3, 300)
}

// circuit breaker config
const breaker = new CircuitBreaker(callWithRetry, {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000
})

breaker.on('open', () => console.log('⚠️ Circuit OPEN'))
breaker.on('halfOpen', () => console.log('⏳ Circuit HALF-OPEN'))
breaker.on('close', () => console.log('✅ Circuit CLOSED'))

module.exports = breaker

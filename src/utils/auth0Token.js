const axios = require('axios')

async function getAccessToken() {
  try {
    const response = await axios.post(
      process.env.OAUTH_URL,
      {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        audience: process.env.AUDIENCE,
        grant_type: "client_credentials"
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    )

    return response.data.access_token

  } catch (err) {
    console.error(
      "Auth0 Token Error:",
      err.response?.data || err.message
    )
  }
}

module.exports = getAccessToken

const express = require('express')
const cors = require('cors')

const sentenceRoute = require('./routes/sentence')
const paragraphRoute = require('./routes/paragraph')

const app = express()
const port = process.env.PORT || 4000
const frontendUrl = process.env.FRONTEND_URL || '*'

app.use(
  cors({
    origin: frontendUrl,
  }),
)
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.use('/api/sentence', sentenceRoute)
app.use('/api/paragraph', paragraphRoute)

app.listen(port, () => {
  // Keep startup log simple and useful in local and cloud logs.
  console.log(`Server running on http://localhost:${port}`)
})

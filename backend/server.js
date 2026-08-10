import dotenv from 'dotenv'

// Load environment variables before importing app so Prisma and other
// modules read correct values from process.env
dotenv.config()

import app from './app.js'

const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(`GymSystem backend running on http://localhost:${port}`)
})

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import xss from 'xss-clean'
import routes from './src/routes/index.js'
import { errorHandler } from './src/middlewares/errorHandler.js'
import swaggerUi from 'swagger-ui-express'
import { buildSwaggerSpec } from './src/config/swagger.js'

const app = express()

// If behind a proxy (localtunnel, ngrok, etc.) trust the proxy so
// express-rate-limit can read X-Forwarded-For correctly.
app.set('trust proxy', 1)

app.use(cors())
// keep raw body for webhook verification (Stripe)
app.use(express.json({ verify: (req, _res, buf) => { req.rawBody = buf } }))
app.use(morgan('dev'))

// Security middlewares
app.use(helmet())
app.use(xss())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3000, // limit each IP to 3000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
})
app.use(limiter)

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'Gym System backend v1.0', db: 'gymsystem' })
})

const swaggerSpec = buildSwaggerSpec()
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/api', routes)
app.use(errorHandler)

export default app


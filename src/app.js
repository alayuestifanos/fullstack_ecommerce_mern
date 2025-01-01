import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())

import authRoutes from './routes/auth.routes'

app.use('api/v1/auth', authRoutes)
export default app

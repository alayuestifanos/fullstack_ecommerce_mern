import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())

import authRoutes from './routes/auth.routes'
import productRoutes from './routes/product.routes'
import orderRoutes from './routes/orderRoutes'

app.use('api/v1/auth', authRoutes)
app.use('api/v1/product', productRoutes)
app.use('api/v1/order', orderRoutes)
export default app

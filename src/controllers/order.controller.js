import Order from '../models/order.schema'
import asyncHandler from '../services/asyncHandler'

export const getAllOrders = asyncHandler(async (req, res) => {
  let query = {}
  if (req.user.role !== 'admin') {
    query.user = req.user._id
  }

  if (req.query.status && req.query.status !== 'all') {
    query.status = req.query.status
  }

  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })

  res.json(200).json({ success: true, count: orders.length, orders })
})

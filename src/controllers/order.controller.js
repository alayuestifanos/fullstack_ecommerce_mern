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

export const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params
  const order = await Order.findById(id).populate('user', 'name email')
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' })
  }
  if (
    req.user.role !== 'admin' &&
    order.user._id.toString() !== req.user._id.toString()
  ) {
    return res
      .status(403)
      .json({ success: false, message: 'Not authorized to view this order' })
  }
  res.status(200).json({ success: true, order })
})

export const getOrderStats = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ success: false, message: 'Admin access required' })
  }
  const totalOrders = await Order.countDocuments()
  const totalRevenue = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ])
  const byStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ])
  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        status: { $ne: 'cancelled' },
        createdAt: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        total: { $sum: '$total' },
      },
    },
    { $sort: { _id: 1 } },
  ])
  res.status(200).json({
    success: true,
    stats: {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      byStatus,
      monthlyRevenue,
    },
  })
})

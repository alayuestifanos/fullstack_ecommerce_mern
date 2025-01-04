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

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body

  if (!items || !items.length) {
    return res
      .status(400)
      .json({ success: false, message: 'Order must contain at least one item' })
  }
  if (!shippingAddress) {
    return res
      .status(400)
      .json({ success: false, message: 'Shipping address is required' })
  }

  let total = 0
  const orderItems = []

  for (const item of items) {
    const product = await Product.findById(item.productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found: ${item.productId}`,
      })
    }
    if (product.stock < item.qty) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for "${product.name}". Only ${product.stock} available.`,
      })
    }
    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      qty: item.qty,
    })
    total += product.price * item.qty
  }

  const order = await Order.create({
    orderId: await generateOrderId(),
    user: req.user._id,
    items: orderItems,
    total,
    shippingAddress,
    status: 'pending',
  })

  for (const item of items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.qty },
    })
  }

  const populated = await Order.findById(order._id).populate(
    'user',
    'name email',
  )
  res.status(201).json({ success: true, order: populated })
})

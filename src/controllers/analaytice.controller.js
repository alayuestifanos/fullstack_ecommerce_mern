import express from 'express'
import Order from '../models/order.schema'
import Product from '../models/product.schema'
import User from '../models/user.schema'
import Review from '../models/reviews.schema'
import Contact from '../models/contact.model'
import asyncHandler from '../services/asyncHandler'

export const getAnalytics = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ success: false, message: 'Admin access required' })
  }

  const [
    totalRevenue,
    totalOrders,
    totalProducts,
    totalUsers,
    totalReviews,
    unreadMessages,
    lowStockProducts,
    orderStatuses,
    monthlyRevenue,
    categoryRevenue,
    topProducts,
    recentOrders,
    userGrowth,
  ] = await Promise.all([
    // Total revenue (non-cancelled)
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    // Total orders
    Order.countDocuments(),
    // Total products
    Product.countDocuments(),
    // Total users
    User.countDocuments({ role: 'user' }),
    // Total reviews
    Review.countDocuments(),
    // Unread messages
    Contact.countDocuments({ status: 'new' }),
    // Low stock products
    Product.find({ stock: { $lt: 10 } })
      .sort({ stock: 1 })
      .limit(5)
      .select('name stock image'),
    // Order statuses
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    // Monthly revenue (last 7 months)
    Order.aggregate([
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
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    // Revenue by category
    Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'prod',
        },
      },
      { $unwind: '$prod' },
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: '$prod.category',
          revenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
        },
      },
      { $sort: { revenue: -1 } },
    ]),
    // Top 5 products by sales
    Order.aggregate([
      { $unwind: '$items' },
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          sold: { $sum: '$items.qty' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]),
    // Recent 5 orders
    Order.find().populate('user', 'name email').sort('-createdAt').limit(5),
    // User growth (last 6 months)
    User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 5)),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ])

  res.json({
    success: true,
    data: {
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      totalProducts,
      totalUsers,
      totalReviews,
      unreadMessages,
      lowStockProducts,
      orderStatuses: orderStatuses.reduce((acc, s) => {
        acc[s._id] = s.count
        return acc
      }, {}),
      monthlyRevenue,
      categoryRevenue,
      topProducts,
      recentOrders,
      userGrowth,
    },
  })
})

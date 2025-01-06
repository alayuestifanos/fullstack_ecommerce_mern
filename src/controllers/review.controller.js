import Review from '../models/reviews.schema'
import asyncHandler from '../services/asyncHandler'

export const GetProductReviews = asyncHandler(async (req, res) => {
  const { productId: id } = req.params
  const { page = 1, limit = 20, sort = '-createdAt' } = req.query
  const skip = (parseInt(page) - 1) * parseInt(limit)

  const reviews = await Review.find({ product: id })
    .populate('user', 'name')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))

  const total = await Review.countDocuments({ product: id })

  // Rating distribution
  const distribution = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId() } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: -1 } },
  ])

  res.status(200).json({
    success: true,
    count: reviews.length,
    total,
    pages: Math.ceil(total / parseInt(limit)),
    distribution,
    reviews,
  })
})

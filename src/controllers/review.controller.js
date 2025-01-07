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

export const CreateReview = asyncHandler(async (req, res) => {
  const { rating, title, comment } = req.body
  const { productId: id } = req.params

  // Check product exists
  const product = await Product.findById(id)
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: 'Product not found' })
  }

  // Check for existing review
  const existing = await Review.findOne({
    product: id,
    user: req.user._id,
  })
  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'You have already reviewed this product',
    })
  }

  const review = await Review.create({
    product: id,
    user: req.user._id,
    rating,
    title,
    comment,
  })

  // Recalculate product rating
  await Review.recalcProductRating(id)

  const populated = await review.populate('user', 'name')
  res.status(201).json({ success: true, review: populated })
})

import Review from '../models/reviews.schema'
import asyncHandler from '../services/asyncHandler'

export const getProductReviews = asyncHandler(async (req, res) => {
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

export const createReview = asyncHandler(async (req, res) => {
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

export const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { rating, title, comment } = req.body
  const review = await Review.findById(id)

  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' })
  }
  if (review.user.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ success: false, message: 'Not authorized to edit this review' })
  }

  review.rating = rating ?? review.rating
  review.title = title ?? review.title
  review.comment = comment ?? review.comment
  await review.save()

  await Review.recalcProductRating(review.product)
  const populated = await review.populate('user', 'name')
  res.status(200).json({ success: true, review: populated })
})

export const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params
  const review = await Review.findById(id)
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' })
  }
  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({ success: false, message: 'Not authorized' })
  }
  const productId = review.product
  await review.deleteOne()
  await Review.recalcProductRating(productId)
  res.status(200).json({ success: true, message: 'Review deleted' })
})

export const getAllReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query
  let query = {}
  if (status) query.status = status
  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ success: false, message: 'Admin access required' })
  }

  const reviews = await Review.find(query)
    .populate('user', 'name email')
    .populate('product', 'name image')
    .sort('-createdAt')
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit))

  const total = await Review.countDocuments(query)
  res.status(200).json({ success: true, count: reviews.length, total, reviews })
})

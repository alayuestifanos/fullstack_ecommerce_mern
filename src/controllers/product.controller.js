import { Product } from '../models/product.schema'
import asyncHandler from '../services/asyncHandler'

export const getAllProducts = asyncHandler(async (req, res) => {
  const {
    category,
    sort,
    search,
    featured,
    isNew,
    page = 1,
    limit = 50,
  } = req.query
  let query = {}

  if (category && category !== 'all') {
    query.category = category
  }

  if (featured === 'true') query.featured = true
  if (isNew === 'true') query.isNew = true

  if (search) {
    query.$text = { $search: search }
  }

  let sortOption = {}
  if (sort === 'price-asc') sortOption = { price: 1 }
  else if (sort === 'price-desc') sortOption = { price: -1 }
  else if (sort === 'name') sortOption = { name: 1 }
  else if (sort === 'rating') sortOption = { rating: -1 }
  else if (sort === 'newest') sortOption = { createdAt: -1 }
  else sortOption = { featured: -1, createdAt: -1 }

  const skip = (parseInt(page) - 1) * parseInt(limit)
  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit))

  const total = await Product.countDocuments(query)

  ;(res,
    status(200).json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      products,
    }))
})

export const createProduct = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ success: false, message: 'Admin access required' })
  }
  const product = await Product.create(req.body)
  res.status(201).json({ success: true, product })
})

export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  const product = await Product.findById(id)
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: 'Product not found' })
  }
  res.status(200).json({ success: true, product })
})

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ success: false, message: 'Admin access required' })
  }
  let product = await Product.findById(id)
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: 'Product not found' })
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({ success: true, product })
})

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ success: false, message: 'Admin access required' })
  }
  const product = await Product.findByIdAndDelete(id)
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: 'Product not found' })
  }
  res
    .status(200)
    .json({ success: true, message: 'Product deleted successfully' })
})

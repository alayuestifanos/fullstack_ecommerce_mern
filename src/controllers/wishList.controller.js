import WishList from '../models/wishList.schema'
import asyncHandler from '../services/asyncHandler'

export const getWishList = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    'items.product',
  )
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, items: [] })
  }
  res.status(200).json({ success: true, wishlist })
})

export const addToWishList = asyncHandler(async (req, res) => {
  const { productId: id } = req.params
  let wishlist = await Wishlist.findOne({ user: req.user._id })
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, items: [] })
  }

  const exists = wishlist.items.find((i) => i.product.toString() === id)
  if (exists) {
    return res
      .status(409)
      .json({ success: false, message: 'Already in wishlist' })
  }

  wishlist.items.push({ product: id })
  await wishlist.save()
  await wishlist.populate('items.product')

  res.status(201).json({ success: true, wishlist })
})

export const removeFromWishList = asyncHandler(async (req, res) => {
  const { productId: id } = req.params

  const wishlist = await Wishlist.findOne({ user: req.user._id })
  if (!wishlist) {
    return res
      .status(404)
      .json({ success: false, message: 'Wishlist not found' })
  }

  wishlist.items = wishlist.items.filter((i) => i.product.toString() !== id)
  await wishlist.save()
  await wishlist.populate('items.product')

  res.status(200).json({ success: true, wishlist })
})

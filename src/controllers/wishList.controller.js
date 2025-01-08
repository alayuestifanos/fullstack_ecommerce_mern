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

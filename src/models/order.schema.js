import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  product: {
    type: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        count: Number,
        price: Number,
      },
    ],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, default: 'United States' },
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
  },
  coupon: String,
  transactionId: String,
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pemding',
  },
  paymentMethod: {
    type: String,
    default: 'card',
  },
})

export default mongoose.model('Order', orderSchema)

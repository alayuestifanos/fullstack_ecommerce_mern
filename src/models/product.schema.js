import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name must be provided'],
      maxLength: [120, 'Product name should not be max than 120 chars'],
    },
    price: {
      type: Number,
      required: [true, 'Price must be provided'],
      maxLength: [5, 'Product price should not be max than 5 chars'],
    },
    description: {
      type: String,
    },
    photos: [
      {
        secure_url: {
          type: String,
          required: [true, 'Every product must have at least one url'],
        },
      },
    ],
    stock: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
    },
    image: { type: String, required: [true, 'Image URL is required'] },
    rating: {
      type: Number,
      min: [0, 'Rating can not be negative'],
      max: [5, 'Rating can not exceed 5'],
      default: 0,
    },
    reviews: {
      type: Number,
      min: [0, 'Reviews can not be negative'],
      default: 0,
    },
    featured: { type: Boolean, default: false },
    isNew: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

productSchema.index({ name: 'text', category: 'text' })
export default mongoose.model('Product', productSchema)

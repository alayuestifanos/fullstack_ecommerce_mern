import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name must be provided"],
      maxLength: [120, "Product name should not be max than 120 chars"],
    },
    price: {
      type: Number,
      required: [true, "Price must be provided"],
      maxLength: [5, "Product price should not be max than 5 chars"],
    },
    description: {
      type: String,
    },
    photos: [
      {
        secure_url: {
          type: String,
          required: [true, "Every product must have at least one url"],
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
      ref: "Collection",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);

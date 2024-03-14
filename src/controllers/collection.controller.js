import Collection from "../models/collection.schema.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";

export const createCollection = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new CustomError("Collection name is required", 401);
  }

  const collection = await Collection.create({ name });

  res.status(201).json({
    success: true,
    message: "Collection was created successfully",
    collection,
  });
});

export const updateCollection = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const { id: collectionId } = req.params;

  if (!name) {
    throw new CustomError("Collection name is required", 401);
  }

  let updatedCollection = await Collection.findByIdAndUpdate(
    collectionId,
    { name },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedCollection) {
    throw new CustomError("Collection not found", 400);
  }

  res.status(201).json({
    success: true,
    message: "Collection updated successfully",
    updatedCollection,
  });
});

export const deleteCollection = asyncHandler(async (req, res) => {
  const { id: collectionId } = req.params;

  const collection = Collection.findById(collectionId);

  if (!collection) {
    throw new CustomError("Collection to be deleted not found", 400);
  }
  await collection.remove();
  res.status(201).json({
    success: true,
    message: "Collection deleted successfully",
  });
});

export const getAllCollection = asyncHandler(async (req, res) => {
  const collections = Collection.find();

  if (!collections) {
    throw new CustomError("No collection found", 400);
  }
  res.status(201).json({
    success: true,
    collections,
  });
});

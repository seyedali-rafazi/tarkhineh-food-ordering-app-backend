const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    foodGroup: { type: ObjectId, ref: "FoodGroups", required: true },
    imageLink: { type: String, required: true },
    price: { type: Number, required: true },
    offPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    brand: { type: String, required: true },
    tags: [{ type: String }],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    likes: { type: [ObjectId], ref: "User", default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  ProductModel: mongoose.model("Product", ProductSchema),
};

const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const FoodGroupSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    englishTitle: { type: String, required: true, unique: true },
    category: { type: ObjectId, ref: "Category", required: true },
    brand: { type: String, required: true },
    type: {
      type: String,
      enum: ["product", "comment", "post", "ticket", "foodGroup"],
      default: "foodGroup",
      required: true,
    },
    foodParentId: {
      type: ObjectId,
      ref: "FoodGroups",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  FoodGroupSchemaModel: mongoose.model("FoodGroups", FoodGroupSchema),
};

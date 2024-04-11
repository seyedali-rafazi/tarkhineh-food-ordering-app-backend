const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const FoodGroupSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    englishTitle: { type: String, required: true, unique: true },
    category: { type: ObjectId, ref: "Category", required: true },
    type: {
      type: String,
      enum: ["product", "comment", "post", "ticket", "foodGroup"],
      default: "foodGroup",
      required: true,
    },
    foodParentId: {
      type: ObjectId,
      ref: "FoodGroup",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

FoodGroupSchema.index({ title: "text", englishTitle: "text" });


module.exports = {
  FoodGroupSchemaModel: mongoose.model("FoodGroup", FoodGroupSchema),
};

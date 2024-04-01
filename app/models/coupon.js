const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    type: {
      type: String,
      required: true,
      default: "fixedProduct",
      enum: ["fixedProduct", "percent"],
    },
    amount: { type: Number, required: true }, // if is percent, then number must be ≤ 100, else it’s amount of discount
    expireDate: { type: Date, required: true, default: undefined },
    isActive: { type: Boolean, required: true, default: true },
    usageCount: { type: Number, required: true, default: 0 },
    usageLimit: { type: Number, required: true },
    productIds: {
      type: [ObjectId],
      ref: "Product",
      default: [],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = {
  CouponModel: mongoose.model("Coupon", CouponSchema),
};

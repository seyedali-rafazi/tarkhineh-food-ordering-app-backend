const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const PaymentSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String },
    paymentMethod: { type: String, required: true, default: "ZARINPAL" },
    amount: { type: Number },
    description: { type: String, default: "بابت خرید محصول" },
    refId: { type: String, default: undefined },
    cardHash: { type: String, default: undefined },
    status: {
      type: String,
      default: "UNCOMPLETED",
      enum: ["UNCOMPLETED", "COMPLETED"],
    },
    isPaid: { type: Boolean, default: false },
    authority: { type: String, default: undefined },
    user: { type: ObjectId, ref: "User", required: true },
    paymentDate: { type: String },
    cart: { type: Object, default: {} },
  },

  {
    timestamps: true,
  }
);

module.exports = {
  PaymentModel: mongoose.model("Payment", PaymentSchema),
};

const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ProductSchema = new mongoose.Schema({
  quantity: { type: Number, default: 1 },
  productId: { type: ObjectId, ref: "Product" },
});

const CartSchema = new mongoose.Schema({
  products: { type: [ProductSchema], default: [] },
  coupon: { type: ObjectId, ref: "Coupon", default: null },
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    avatar: { type: String },
    biography: { type: String, default: null },
    address: { type: String, default: null },
    likedProducts: [{ type: ObjectId, ref: "Product" }],
    favoriteProduct: [{ type: ObjectId, ref: "Product" }], 
    email: { type: String, lowercase: true, trim: true },
    phoneNumber: { type: String, trim: true },
    password: { type: String },
    otp: {
      code: { type: Number, defaul: 0 },
      expiresIn: { type: Date, default: 0 },
    },
    resetLink: { type: String, default: null },
    isVerifiedPhoneNumber: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    Products: [{ type: ObjectId, ref: "Product" }],
    role: { type: String, default: "USER" },
    cart: { type: CartSchema },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

UserSchema.virtual("avatarUrl").get(function () {
  if (this.avatar) return `${process.env.SERVER_URL}/${this.avatar}`;
  return null;
});

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.avatarUrl = this.avatarUrl;
  delete obj.password;
  delete obj.avatar;
  return obj;
};

UserSchema.index({
  name: "text",
  email: "text",
  phoneNumber: "text",
  username: "text",
});

module.exports = {
  UserModel: mongoose.model("User", UserSchema),
};

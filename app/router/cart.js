const expressAsyncHandler = require("express-async-handler");
const { CartController } = require("../http/controllers/cart/cart.controller");
const router = require("express").Router();

router.post("/add", expressAsyncHandler(CartController.addToCart));
router.post("/remove", expressAsyncHandler(CartController.removeFromCart));
router.post("/deleteProduct", expressAsyncHandler(CartController.deleteFromCart));
router.post("/coupon", expressAsyncHandler(CartController.addCouponToCart));
router.delete(
  "/delete",
  expressAsyncHandler(CartController.removeCouponFromCart)
);
module.exports = {
  cartRoutes: router,
};

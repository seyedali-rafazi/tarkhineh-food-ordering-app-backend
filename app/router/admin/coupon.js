const expressAsyncHandler = require("express-async-handler");
const {
  CouponController,
} = require("../../http/controllers/admin/coupon/coupon.controller");
const router = require("express").Router();

router.post("/add", expressAsyncHandler(CouponController.addNewCoupon));
router.delete(
  "/remove/:id",
  expressAsyncHandler(CouponController.removeCoupon)
);
router.patch("/update/:id", expressAsyncHandler(CouponController.updateCoupon));
router.get("/list", expressAsyncHandler(CouponController.getAllCoupons));
router.get("/:id", expressAsyncHandler(CouponController.getOneCoupon));

module.exports = {
  couponAdminRoutes: router,
};

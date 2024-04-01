const { ROLES } = require("../../../utils/constants");
const { authorize } = require("../../http/middlewares/permission.guard");
const { categoryAdminRoutes } = require("./category");
const { foodGroupAdminRoutes } = require("./foodGroup");
const { couponAdminRoutes } = require("./coupon");
const { paymentAdminRoutes } = require("./payment");
const { productsAdminRoutes } = require("./product");
const { userAdminRoutes } = require("./user");

const router = require("express").Router();

router.use("/category", authorize(ROLES.ADMIN), categoryAdminRoutes);
router.use("/foodgroup", authorize(ROLES.ADMIN), foodGroupAdminRoutes);
router.use("/product", authorize(ROLES.ADMIN), productsAdminRoutes);
router.use("/coupon", authorize(ROLES.ADMIN), couponAdminRoutes);
router.use("/user", authorize(ROLES.ADMIN), userAdminRoutes);
router.use("/payment", authorize(ROLES.ADMIN), paymentAdminRoutes);

module.exports = {
  adminRoutes: router,
};

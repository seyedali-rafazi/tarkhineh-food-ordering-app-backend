const router = require("express").Router();
const expressAsyncHandler = require("express-async-handler");
const {
  ProductController,
} = require("../../http/controllers/admin/product/product.controller");

router.post("/add", expressAsyncHandler(ProductController.addNewProduct));
router.delete(
  "/remove/:id",
  expressAsyncHandler(ProductController.removeProduct)
);
router.patch(
  "/update/:id",
  expressAsyncHandler(ProductController.updateProduct)
);
router.patch(
  "/change-discount/:id",
  expressAsyncHandler(ProductController.changeProductDiscountStatus)
);

module.exports = {
  productsAdminRoutes: router,
};

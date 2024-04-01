const router = require("express").Router();
const expressAsyncHandler = require("express-async-handler");
const {
  CategoryController,
} = require("../../http/controllers/admin/category/category");

router.post("/add", expressAsyncHandler(CategoryController.addNewCategory));
router.patch(
  "/update/:id",
  expressAsyncHandler(CategoryController.updateCategory)
);
router.delete(
  "/remove/:id",
  expressAsyncHandler(CategoryController.removeCategory)
);

module.exports = {
  categoryAdminRoutes: router,
};

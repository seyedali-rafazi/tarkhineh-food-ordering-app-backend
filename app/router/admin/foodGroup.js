const router = require("express").Router();
const expressAsyncHandler = require("express-async-handler");
const {
  FoodGroupController,
} = require("../../http/controllers/admin/foodGroup/foodGruop");

router.post("/add", expressAsyncHandler(FoodGroupController.addNewFoodGroup));
router.patch(
  "/update/:id",
  expressAsyncHandler(FoodGroupController.updateFoodGroupy)
);
router.delete(
  "/remove/:id",
  expressAsyncHandler(FoodGroupController.removeFoodGroup)
);

module.exports = {
  foodGroupAdminRoutes: router,
};

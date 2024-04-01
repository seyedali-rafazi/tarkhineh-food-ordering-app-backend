const expressAsyncHandler = require("express-async-handler");
const {
  FoodGroupController,
} = require("../http/controllers/admin/foodGroup/foodGruop");

const router = require("express").Router();

router.get(
  "/list",
  expressAsyncHandler(FoodGroupController.getListOfFoodGroup)
);

router.get("/:id", expressAsyncHandler(FoodGroupController.getFoodGroupById));
module.exports = {
  foodGroupRoutes: router,
};

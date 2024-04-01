const Controller = require("../../controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const createHttpError = require("http-errors");
const {
  addFoodGroupSchema,
  updateFoodGroupSchema,
} = require("../../../validators/admin/foodGroup.schema");
const { FoodGroupSchemaModel } = require("../../../../models/foodGroups");

class FoodGroupController extends Controller {
  async getListOfFoodGroup(req, res) {
    const query = req.query;
    const foodGroup = await FoodGroupSchemaModel.find(query);
    if (!foodGroup)
      throw createHttpError.ServiceUnavailable("دسته بندی ها یافت نشد");

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        foodGroup,
      },
    });
  }

  async addNewFoodGroup(req, res) {
    const { title, englishTitle, description, type, parent, category, brand } =
      await addFoodGroupSchema.validateAsync(req.body);
    await this.findFoodGroupWithTitle(englishTitle);
    const foodGroup = await FoodGroupSchemaModel.create({
      title,
      englishTitle,
      description,
      type,
      parent,
      category,
      brand,
    });

    if (!foodGroup) throw createHttpError.InternalServerError("خطای داخلی");
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: "دسته بندی با موفقیت افزوده شد",
      },
    });
  }

  async findFoodGroupWithTitle(englishTitle) {
    const foodGroup = await FoodGroupSchemaModel.findOne({ englishTitle });
    if (foodGroup)
      throw createHttpError.BadRequest("دسته بندی با این عنوان وجود دارد.");
  }

  async checkExistFoodGroup(id) {
    const foodGroup = await FoodGroupSchemaModel.findById(id);
    if (!foodGroup)
      throw createHttpError.BadRequest("دسته بندی با این عنوان وجود ندارد.");
    return foodGroup;
  }

  async updateFoodGroupy(req, res) {
    const { id } = req.params;
    const { title, englishTitle, type, description } = req.body;
    await this.checkExistFoodGroup(id);
    await updateFoodGroupSchema.validateAsync(req.body);
    const updateResult = await FoodGroupSchemaModel.updateOne(
      { _id: id },
      {
        $set: { title, englishTitle, type, description },
      }
    );
    if (updateResult.modifiedCount == 0)
      throw createError.InternalServerError("به روزرسانی انجام نشد");
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "به روز رسانی با موفقیت انجام شد",
      },
    });
  }

  async removeFoodGroup(req, res) {
    const { id } = req.params;
    const foodGroup = await this.checkExistFoodGroup(id);
    const deleteResult = await FoodGroupSchemaModel.deleteMany({
      $or: [{ _id: foodGroup._id }, { parentId: foodGroup._id }],
    });
    if (deleteResult.deletedCount == 0)
      throw createError.InternalServerError("حدف دسته بندی انجام نشد");
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "حذف دسته بندی با موفقیت انجام شد",
      },
    });
  }

  async getFoodGroupById(req, res) {
    const { id } = req.params;
    const foodGroup = await this.checkExistFoodGroup(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        foodGroup,
      },
    });
  }
}

module.exports = {
  FoodGroupController: new FoodGroupController(),
};

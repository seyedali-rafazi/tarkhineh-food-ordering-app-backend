const Controller = require("../../controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const createHttpError = require("http-errors");
const {
  addCategorySchema,
  updateCategorySchema,
} = require("../../../validators/admin/category.shcema");
const { CategoryModel } = require("../../../../models/category");

class CategoryController extends Controller {
  async getListOfCategories(req, res) {
    const query = req.query;
    const categories = await CategoryModel.find(query);
    if (!categories)
      throw createHttpError.ServiceUnavailable("دسته بندی ها یافت نشد");

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        categories,
      },
    });
  }
  async addNewCategory(req, res) {
    const { title, englishTitle, description, type, parent } =
      await addCategorySchema.validateAsync(req.body);
    await this.findCategoryWithTitle(englishTitle);
    const category = await CategoryModel.create({
      title,
      englishTitle,
      description,
      type,
      parent,
    });

    if (!category) throw createHttpError.InternalServerError("خطای داخلی");
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: "دسته بندی با موفقیت افزوده شد",
      },
    });
  }
  async findCategoryWithTitle(englishTitle) {
    const category = await CategoryModel.findOne({ englishTitle });
    if (category)
      throw createHttpError.BadRequest("دسته بندی با این عنوان وجود دارد.");
  }
  async checkExistCategory(id) {
    const category = await CategoryModel.findById(id);
    if (!category)
      throw createHttpError.BadRequest("دسته بندی با این عنوان وجود ندارد.");
    return category;
  }
  async updateCategory(req, res) {
    const { id } = req.params;
    const { title, englishTitle, type, description } = req.body;
    await this.checkExistCategory(id);
    await updateCategorySchema.validateAsync(req.body);
    const updateResult = await CategoryModel.updateOne(
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
  async removeCategory(req, res) {
    const { id } = req.params;
    const category = await this.checkExistCategory(id);
    const deleteResult = await CategoryModel.deleteMany({
      $or: [{ _id: category._id }, { parentId: category._id }],
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
  async getCategoryById(req, res) {
    const { id } = req.params;
    const category = await this.checkExistCategory(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        category,
      },
    });
  }
}

module.exports = {
  CategoryController: new CategoryController(),
};

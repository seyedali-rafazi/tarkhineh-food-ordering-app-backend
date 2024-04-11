const Joi = require("joi");
const createHttpError = require("http-errors");
const { MongoIDPattern } = require("../../../../utils/constants");

const addFoodGroupSchema = Joi.object({
  title: Joi.string()
    .required()
    .min(3)
    .max(100)
    .error(
      createHttpError.BadRequest(
        "عنوان فارسی   گروه غذا دسته بندی صحیح نمیباشد"
      )
    ),
  category: Joi.string()
    .required()
    .regex(MongoIDPattern)
    .error(createHttpError.BadRequest("دسته بندی مورد نظر  صحیح نمی باشد")),

  englishTitle: Joi.string()
    .required()
    .min(3)
    .max(100)
    .error(
      createHttpError.BadRequest(
        "عنوان انگلیسی  گروه غذادسته بندی صیحیح نمی باشد"
      )
    ),
  description: Joi.string()
    .required()
    .min(3)
    .max(200)
    .error(
      createHttpError.BadRequest("توضیحات دسته بندی  گروه غذاصحیح نمی باشد")
    ),

  type: Joi.string()
    .required()
    .min(3)
    .max(100)
    .valid("foodGroup", "post", "comment", "ticket")
    .error(createHttpError.BadRequest("نوع دسته بندی  گروه غذاصحیح نمی باشد")),

  foodParentId: Joi.string()
    .allow("")
    .pattern(MongoIDPattern)
    .error(
      createHttpError.BadRequest("شناسه ارسال شده  گروه غذا صحیح نمیباشد")
    ),
});

const updateFoodGroupSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest("عنوان فارسی دسته بندی صحیح نمیباشد")),
  englishTitle: Joi.string()
    .min(3)
    .max(100)
    .error(
      createHttpError.BadRequest("عنوان انگلیسی دسته بندی صیحیح نمی باشد")
    ),
  description: Joi.string()
    .required()
    .min(3)
    .max(200)
    .error(createHttpError.BadRequest("توضیحات دسته بندی صحیح نمی باشد")),
  type: Joi.string()
    .required()
    .min(3)
    .max(100)
    .valid("product", "post", "comment", "ticket")
    .error(createHttpError.BadRequest("نوع دسته بندی صحیح نمی باشد")),
});

module.exports = {
  addFoodGroupSchema,
  updateFoodGroupSchema,
};

const Joi = require("joi");
const createHttpError = require("http-errors");
const { MongoIDPattern } = require("../../../../utils/constants");

const addCategorySchema = Joi.object({
  title: Joi.string()
    .required()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest("عنوان فارسی دسته بندی صحیح نمیباشد")),
  englishTitle: Joi.string()
    .required()
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
    .valid("foodgroup", "post", "comment", "ticket")
    .error(createHttpError.BadRequest("نوع دسته بندی صحیح نمی باشد")),
  parent: Joi.string()
    .allow("")
    .pattern(MongoIDPattern)
    .error(createHttpError.BadRequest("شناسه ارسال شده صحیح نمیباشد")),
});

const updateCategorySchema = Joi.object({
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
    .valid("foodgroup", "post", "comment", "ticket")
    .error(createHttpError.BadRequest("نوع دسته بندی صحیح نمی باشد")),
});

module.exports = {
  addCategorySchema,
  updateCategorySchema,
};

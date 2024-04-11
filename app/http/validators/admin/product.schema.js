const createError = require("http-errors");
const Joi = require("joi");
const { MongoIDPattern } = require("../../../../utils/constants");

const addProductSchema = Joi.object({
  title: Joi.string()
    .required()
    .min(3)
    .max(30)
    .error(createError.BadRequest("عنوان محصول صحیح نمیباشد")),
  description: Joi.string()
    .required()
    .error(createError.BadRequest("توضیحات ارسال شده صحیح نمیباشد")),
  slug: Joi.string()
    .required()
    .error(createError.BadRequest("اسلاگ ارسال شده صحیح نمیباشد")),
  imageLink: Joi.string()
    .required()
    .error(createError.BadRequest("لینک عکس دوره صحیح نمیباشد")),
  foodGroup: Joi.string()
    .required()
    .regex(MongoIDPattern)
    .error(createError.BadRequest("دسته بندی غذا نظر  صحیح نمی باشد")),
  category: Joi.string()
    .required()
    .regex(MongoIDPattern)
    .error(createError.BadRequest("دسته بندی غذا نظر  صحیح نمی باشد")),
  price: Joi.number()
    .required()
    .error(createError.BadRequest("قیمت وارد شده صحیح نمیباشد")),
  discount: Joi.number()
    .allow(0)
    .error(createError.BadRequest("تخفیف وارد شده صحیح نمیباشد")),
  offPrice: Joi.number()
    .allow(0)
    .error(createError.BadRequest("قیمت تخفیف خورده وارد شده صحیح نمیباشد")),
});

const changeCourseDiscountSchema = Joi.object({
  offPrice: Joi.number()
    .required()
    .error(createError.BadRequest("قیمت وارد شده صحیح نمیباشد")),
  discount: Joi.number()
    .required()
    .allow(0)
    .error(createError.BadRequest("تخفیف وارد شده صحیح نمیباشد")),
});

module.exports = {
  addProductSchema,
  changeCourseDiscountSchema,
};

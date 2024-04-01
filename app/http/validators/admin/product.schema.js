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
  brand: Joi.string()
    .required()
    .error(createError.BadRequest("برند محصول صحیح نمی باشد.")),
  countInStock: Joi.number()
    .required()
    .error(createError.BadRequest("موجودی محصول صحیح نمی باشد.")),
  imageLink: Joi.string()
    .required()
    .error(createError.BadRequest("لینک عکس دوره صحیح نمیباشد")),
  tags: Joi.array()
    .min(0)
    .max(20)
    .error(createError.BadRequest("برچسب ها نمیتواند بیشتر از 20 ایتم باشد")),
    
  foodGroup: Joi.string()
    .required()
    .regex(MongoIDPattern)
    .error(createError.BadRequest("دسته بندی غذا نظر  صحیح نمی باشد")),

  offPrice: Joi.number().error(
    createError.BadRequest("قیمت وارد شده صحیح نمیباشد")
  ),
  price: Joi.number()
    .required()
    .error(createError.BadRequest("قیمت وارد شده صحیح نمیباشد")),
  discount: Joi.number()
    .allow(0)
    .error(createError.BadRequest("تخفیف وارد شده صحیح نمیباشد")),
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

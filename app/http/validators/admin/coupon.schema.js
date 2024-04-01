const Joi = require("joi");
const createHttpError = require("http-errors");
const { MongoIDPattern } = require("../../../../utils/constants");

const addCouponSchema = Joi.object({
  code: Joi.string()
    .required()
    .min(5)
    .max(30)
    .error(createHttpError.BadRequest("کد تخفیف صحیح نمیباشد")),
  type: Joi.string()
    .required()
    .valid("fixedProduct", "percent")
    .error(createHttpError.BadRequest("نوع کد تخفیف را به درستی وارد کنید")),
  amount: Joi.number()
    .required()
    .error(createHttpError.BadRequest("مقدار کد تخفیف را به درستی وارد کنید")),
  expireDate: Joi.date()
    .allow()
    .error(createHttpError.BadRequest("مقدار کد تخفیف را به درستی وارد کنید")),
  usageLimit: Joi.number()
    .required()
    .error(createHttpError.BadRequest("ظرفیت کد تخفیف را به درستی وارد کنید")),
  productIds: Joi.array()
    .items(Joi.string().required().regex(MongoIDPattern))
    .error(createHttpError.BadRequest("شناسه محصول صحیح نمی باشد")),
});

module.exports = {
  addCouponSchema,
};

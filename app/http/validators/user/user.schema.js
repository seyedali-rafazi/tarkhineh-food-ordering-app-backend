const Joi = require("joi");
const createHttpError = require("http-errors");

const getOtpSchema = Joi.object({
  phoneNumber: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(createHttpError.BadRequest("شماره موبایل وارد شده صحیح نمیباشد")),
});

const checkOtpSchema = Joi.object({
  otp: Joi.string()
    .min(5)
    .max(6)
    .error(createHttpError.BadRequest("کد ارسال شده صحیح نمیباشد")),
  phoneNumber: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(createHttpError.BadRequest("شماره موبایل وارد شده صحیح نمیباشد")),
});

const completeProfileSchema = Joi.object({
  name: Joi.string()
    .min(5)
    .max(100)
    .error(createHttpError.BadRequest("نام کاربری وارد شده صحیح نمی باشد")),
  email: Joi.string()
    .email()
    .error(createHttpError.BadRequest("ایمیل وارد شده صحیح نمی باشد")),
  address: Joi.string()
    .min(5)
    .max(100)
    .error(createHttpError.BadRequest("آدرس وارد شده صحیح نمی باشد")),
});

const updateProfileSchema = Joi.object({
  name: Joi.string()
    .min(5)
    .max(50)
    .error(createHttpError.BadRequest("نام کاربری وارد شده صحیح نمی باشد")),
  email: Joi.string()
    .email()
    .error(createHttpError.BadRequest("ایمیل وارد شده صحیح نمی باشد")),
  phoneNumber: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(createHttpError.BadRequest("شماره موبایل وارد شده صحیح نمیباشد")),
  biography: Joi.string()
    .max(30)
    .allow("")
    .error(createHttpError.BadRequest("حوزه تخصصی صحیح نمی باشد.")),
  address: Joi.string()
    .min(5)
    .max(100)
    .error(createHttpError.BadRequest("آدرس وارد شده صحیح نمی باشد")),
});

module.exports = {
  getOtpSchema,
  completeProfileSchema,
  checkOtpSchema,
  updateProfileSchema,
};

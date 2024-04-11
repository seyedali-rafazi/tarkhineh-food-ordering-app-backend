const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Controller = require("../controller");
const {
  generateRandomNumber,
  toPersianDigits,
  setAccessToken,
  setRefreshToken,
  verifyRefreshToken,
  getUserCartDetail,
} = require("../../../../utils/functions");
const createError = require("http-errors");
const { UserModel } = require("../../../models/user");
const Kavenegar = require("kavenegar");
const CODE_EXPIRES = 90 * 1000; //90 seconds in miliseconds
const { StatusCodes: HttpStatus } = require("http-status-codes");
const path = require("path");
const { ROLES } = require("../../../../utils/constants");
const {
  checkOtpSchema,
  completeProfileSchema,
  updateProfileSchema,
} = require("../../validators/user/user.schema");
const { PaymentModel } = require("../../../models/payment");

class userAuthController extends Controller {
  constructor() {
    super();
    this.code = 0;
    this.phoneNumber = null;
  }

  async getOtp(req, res) {
    let { phoneNumber, password } = req.body;

    if (!phoneNumber || !password)
      throw createError.BadRequest(
        "شماره موبایل و رمز عبور معتبر را وارد کنید"
      );

    const user = await UserModel.findOne({ phoneNumber });
    if (!user) {
      // Create User if does not exist

      phoneNumber = phoneNumber.trim();
      this.phoneNumber = phoneNumber;

      const hashedPassword = await bcrypt.hash(password, 10);
      this.hashedPassword = hashedPassword;
      const user = await this.saveUser(phoneNumber, hashedPassword);
      await setAccessToken(res, user);
      await setRefreshToken(res, user);
      let WELLCOME_MESSAGE = `  ثبت نام انجام شد ، به ترخینه هوکس خوش آمدید  `;

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: WELLCOME_MESSAGE,
          user,
        },
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw createError.Unauthorized("رمز عبور نامعتبر است.");
    await setAccessToken(res, user);
    await setRefreshToken(res, user);
    let WELLCOME_MESSAGE = `کد تایید شد، به فرانت هوکس خوش آمدید`;
    if (!user.isActive)
      WELLCOME_MESSAGE = `کد تایید شد، لطفا اطلاعات خود را تکمیل کنید`;

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: WELLCOME_MESSAGE,
        user,
      },
    });
  }

  // async checkOtp(req, res) {
  //   const { phoneNumber, password } = req.body;

  //   if (!phoneNumber || !password)
  //     throw createError.BadRequest(
  //       "شماره موبایل و رمز عبور معتبر را وارد کنید"
  //     );

  //   const user = await UserModel.findOne({ phoneNumber });
  //   if (!user)
  //     throw createError.Unauthorized("کاربری با این شماره موبایل یافت نشد.");

  //   const isPasswordValid = await bcrypt.compare(password, user.password);
  //   if (!isPasswordValid)
  //     throw createError.Unauthorized("رمز عبور نامعتبر است.");

  //   // Generate new access token and refresh token
  //   await setAccessToken(res, user);
  //   await setRefreshToken(res, user);
  //   let WELLCOME_MESSAGE = `کد تایید شد، به فرانت هوکس خوش آمدید`;
  //   if (!user.isActive)
  //     WELLCOME_MESSAGE = `کد تایید شد، لطفا اطلاعات خود را تکمیل کنید`;

  //   return res.status(HttpStatus.OK).json({
  //     statusCode: HttpStatus.OK,
  //     data: {
  //       message: WELLCOME_MESSAGE,
  //       user,
  //     },
  //   });
  // }

  async saveUser(phoneNumber, password) {
    return await UserModel.create({
      phoneNumber,
      password, // Save hashed password
      role: ROLES.USER,
    });
  }

  async checkUserExist(phoneNumber) {
    const user = await UserModel.findOne({ phoneNumber });
    return user;
  }
  async updateUser(phoneNumber, objectData = {}) {
    Object.keys(objectData).forEach((key) => {
      if (["", " ", 0, null, undefined, "0", NaN].includes(objectData[key]))
        delete objectData[key];
    });
    const updatedResult = await UserModel.updateOne(
      { phoneNumber },
      { $set: objectData }
    );
    return !!updatedResult.modifiedCount;
  }

  async completeProfile(req, res) {
    await completeProfileSchema.validateAsync(req.body);
    const { user } = req;
    const { name, email, address } = req.body;

    const duplicateUser = await UserModel.findOne({ email });

    if (duplicateUser)
      throw createError.BadRequest(
        "کاربری با این ایمیل قبلا ثبت نام کرده است."
      );

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: user._id },
      { $set: { name, email, address, isActive: true } },
      { new: true }
    );
    // await setAuthCookie(res, updatedUser);
    await setAccessToken(res, updatedUser);
    await setRefreshToken(res, updatedUser);

    return res.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      data: {
        message: "اطلاعات شما با موفقیت تکمیل شد",
        user: updatedUser,
      },
    });
  }

  async updateProfile(req, res) {
    const { _id: userId } = req.user;
    await updateProfileSchema.validateAsync(req.body);
    const { name, email, address, biography, phoneNumber } = req.body;

    const updateResult = await UserModel.updateOne(
      { _id: userId },
      {
        $set: { name, email, address, biography, phoneNumber },
      }
    );
    if (!updateResult.modifiedCount === 0)
      throw createError.BadRequest("اطلاعات ویرایش نشد");
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "اطلاعات با موفقیت آپدیت شد",
      },
    });
  }

  async refreshToken(req, res) {
    const userId = await verifyRefreshToken(req);
    const user = await UserModel.findById(userId);
    await setAccessToken(res, user);
    await setRefreshToken(res, user);
    return res.status(HttpStatus.OK).json({
      StatusCode: HttpStatus.OK,
      data: {
        user,
      },
    });
  }
  async getUserProfile(req, res) {
    const { _id: userId } = req.user;
    const user = await UserModel.findById(userId, { password: 0 });
    const cart = (await getUserCartDetail(userId))?.[0];
    const payments = await PaymentModel.find({ user: userId });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        user,
      },
    });
  }

  logout(req, res) {
    const cookieOptions = {
      maxAge: 1,
      expires: Date.now(),
      httpOnly: true,
      signed: true,
      sameSite: "Lax",
      secure: true,
      path: "/",
      domain:
        process.env.NODE_ENV === "development" ? "localhost" : ".fronthooks.ir",
    };
    res.cookie("accessToken", null, cookieOptions);
    res.cookie("refreshToken", null, cookieOptions);

    return res.status(HttpStatus.OK).json({
      StatusCode: HttpStatus.OK,
      roles: null,
      auth: false,
    });
  }
}

module.exports = {
  UserAuthController: new userAuthController(),
};

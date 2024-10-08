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
const { ProductModel } = require("../../../models/product");

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

    phoneNumber = phoneNumber.trim();
    this.phoneNumber = phoneNumber;
    this.code = generateRandomNumber(6);

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
      let WELLCOME_MESSAGE = `ثبت نام موفقیت امیز بود خوش امدید `;

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: WELLCOME_MESSAGE,
          user,
        },
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw createError.Unauthorized("Incorrect password");
    await setAccessToken(res, user);
    await setRefreshToken(res, user);
    let WELLCOME_MESSAGE = `Welcome to Morent`;
    if (!user.isActive) WELLCOME_MESSAGE = `Please complete your profile`;

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: WELLCOME_MESSAGE,
        user,
      },
    });
  }

  async saveUser(phoneNumber, password) {
    return await UserModel.create({
      phoneNumber,
      password, // Save hashed password
      role: ROLES.USER,
      isActive: false,
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
        message: "Your information has been successfully completed",
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
    const user = await UserModel.findById(userId, { password: 0 }).populate([
      {
        path: "favoriteProduct",
        select: { title: 1, price: 1, offPrice: 1, imageLink: 1 },
      },
    ]);
    const cart = (await getUserCartDetail(userId))?.[0];
    const payments = await PaymentModel.find({ user: userId });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        user,
        cart,
        payments,
      },
    });
  }

  async setFavoriteProduct(req, res) {
    const { id: productId } = req.params;
    const user = req.user;

    // Validate if the product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw createHttpError.NotFound("محصولی با این شناسه یافت نشد");
    }

    // Update the user's favorite product
    if (user.favoriteProduct && user.favoriteProduct.includes(productId)) {
      // Remove the product from the user's favorite list
      user.favoriteProduct = user.favoriteProduct.filter(
        (id) => id.toString() !== productId
      );
    } else {
      // Add the product to the user's favorite list
      user.favoriteProduct.push(productId);
    }

    // Save the updated user document
    await user.save();

    let message;
    if (user.favoriteProduct.includes(productId)) {
      message = "Added to you favourite list";
    } else {
      message = "Remove from your favourite list";
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message,
        favoriteProduct: {
          productId,
        },
      },
    });
  }

  logout(req, res) {
    const cookieOptions = {
      maxAge: 1,
      expires: Date.now(),
      httpOnly: true,
      signed: true,
      sameSite: "None", // Updated to 'None'
      secure: process.env.NODE_ENV === "production", // Set secure to true in production
      path: "/",
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

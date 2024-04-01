const { getUserCartDetail } = require("../../../../../utils/functions");
const { PaymentModel } = require("../../../../models/payment");
const { UserModel } = require("../../../../models/user");
const Controller = require("../../controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");

class UserController extends Controller {
  // ADMIN ROUTES :
  async getAllUsers(req, res) {
    let { page, limit } = req.query;
    page = page || 1;
    limit = limit || 20;
    const skip = (page - 1) * limit;
    const { search } = req.query;
    const searchTerm = new RegExp(search, "ig");
    // const databaseQuery = {};
    // if (search) databaseQuery["$text"] = { $search: search };
    const users = await UserModel.find({
      $or: [
        { name: searchTerm },
        { email: searchTerm },
        { phoneNumber: searchTerm },
      ],
    })
      .populate([
        {
          path: "Products",
          model: "Product",
        },
      ])
      .limit(limit)
      .skip(skip)
      .sort({
        createdAt: -1,
      });
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        users,
      },
    });
  }
  async userProfile(req, res) {
    const { userId } = req.params;
    const user = await UserModel.findById(userId, { otp: 0 });
    const cart = (await getUserCartDetail(userId))?.[0];
    const payments = await PaymentModel.find({ user: userId });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        user,
        payments,
        cart,
      },
    });
  }
}

module.exports = {
  UserController: new UserController(),
};

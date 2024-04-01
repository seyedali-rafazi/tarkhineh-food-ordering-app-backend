const expressAsyncHandler = require("express-async-handler");

const { verifyAccessToken } = require("../http/middlewares/user.middleware");
const {
  PaymentController,
} = require("../http/controllers/payment/payment.controller");

const router = require("express").Router();

router.post(
  "/create",
  verifyAccessToken,
  expressAsyncHandler(PaymentController.createPayment)
);



module.exports = {
  paymentRoutes: router,
};

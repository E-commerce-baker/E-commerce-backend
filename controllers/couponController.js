const asyncHandler = require("express-async-handler");

const { Coupon } = require("../models/CouponModel");
const {
  deleteOne,
  updateOne,
  getOne,
  createOne,
  getAll,
} = require("./factory");
const { ErrorHandler } = require("../utils/errorHandler");

/**
 * @description get all Coupon
 * @route api/Coupons
 * @method get
 * @access privet
 */
exports.getCoupons = getAll(Coupon);

/**
 * @description create new Coupon
 * @param {name} req
 * @method post
 * @route api/Coupons
 * @access privet
 */
exports.createCoupon = createOne(Coupon);

/**
 * @description get Coupon
 * @param {id} req
 * @method get
 * @route api/Coupons/:id
 * @access privet
 */
exports.getCoupon = getOne(Coupon);

/**
 * @description update Coupon
 * @param {id} req
 * @method put
 * @route api/Coupons/:id
 * @access privet
 */
exports.updateCoupon = updateOne(Coupon);

/**
 * @description delete Coupon
 * @param {id} req
 * @method delete
 * @route api/Coupons/:id
 * @access privet
 */
exports.deleteCoupon = deleteOne(Coupon);

exports.isExsit = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id);
  if (!coupon) next(new ErrorHandler("coupon not found", 404));

  next();
});

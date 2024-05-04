const asyncHandler = require("express-async-handler");

const { ErrorHandler } = require("../utils/errorHandler");
const { User } = require("../models/UserModel");

exports.addProductToWishList = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const isProductAlreadyInWishList = user.wishList.includes(productId);

  if (isProductAlreadyInWishList) {
    return next(new ErrorHandler("Product is already in wishlist", 400));
  }

  user.wishList.push(productId);

  await user.save();

  res.status(200).json({
    success: true,
    message: "Product added to wishlist",
  });
});

exports.removeProductToWishList = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { wishList: req.params.productId },
  });

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist",
  });
});


exports.getLoggedUserWishList = asyncHandler(async (req, res, next) => {
  await User.findById(req.user._id)
    .populate("wishList")
    .then((user) => {
      res.status(200).json({
        success: true,
        wishList: user.wishList,
      });
    })
});

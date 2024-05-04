const asyncHandler = require("express-async-handler");
const { ErrorHandler } = require("../utils/errorHandler");
const { User } = require("../models/UserModel");

exports.addAddresses = asyncHandler(async (req, res, next) => {
  // Insert into array
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Address added successfully",
  });
});

exports.removeAddresses = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { addresses: { _id: req.params.addressId } },
  });
  res.status(200).json({
    success: true,
    message: "Address removed successfully",
  });
});

exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("addresses");
  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }

  res.status(200).json({
    success: true,
    addresses: user.addresses,
  });
});

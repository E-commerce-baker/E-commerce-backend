const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const { ErrorHandler } = require("../utils/errorHandler");
const { User } = require("../models/UserModel");
const {
  uploadSingleImage,
  resizeImage,
} = require("../middlewares/uploadImageMiddleware");

// Image upload
exports.upload = uploadSingleImage("profileImage");

// Image processing
const arr = ["users", "user", "jpeg", 226, 226, 95];
exports.resizeImage = resizeImage(arr);

/**
 * @description signup
 * @route POST /api/auth/signup
 * @access public
 */
exports.signup = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  let { profileImage } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    next(new ErrorHandler("User already exists", 400));
  }

  const emailx = await User.findOne({ email });
  if (emailx) {
    next(new ErrorHandler("email already exists", 400));
  }

  if (!profileImage) {
    profileImage = `${process.env.HOST}/users/av.png`;
  }

  const doc = await User.create({ username, email, password, profileImage });
  const userJwt = await doc.generateAccessToken();

  doc.tokens.push({ token: userJwt });
  await doc.save();
  // const { password: pass, tokens, ...userData } = user._doc;
  res.status(201).json({
    success: true,
    data: {
      user: doc,
      token: userJwt,
    },
  });
});

/**
 * @description login
 * @route POST /api/auth/signup
 * @access public
 */
exports.login = asyncHandler(async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    let user;

    if (username) {
      user = await User.findOne({ username });
    } else if (email) {
      user = await User.findOne({ email });
    } else {
      return next(new ErrorHandler("Username or email is required", 400));
    }

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid password", 401));
    }

    const userJwt = await user.generateAccessToken();
    user.tokens.push({ token: userJwt });
    await user.save();
    // remove password form res
    const { password: pass, ...userData } = user._doc;
    return res.status(200).json({
      success: true,
      data: {
        user: userData,
        token: userJwt,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @description logout
 * @route POST /api/auth/logout
 * @access public
 */
exports.logout = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  user.tokens = user.tokens.filter((t) => t.token !== token);

  res.status(200).json({
    success: true,
    data: {
      message: "Logout successfully",
    },
  });
});

/**
 * @description protect route
 */
exports.protect = asyncHandler(async (req, res, next) => {
  try {
    // 1) check if token exist
    const { authorization } = req.headers;
    if (!authorization.startsWith("Bearer") || !authorization) {
      next(new ErrorHandler("Please login to access this resource", 401));
    }
    const token = authorization.split(" ")[1];

    // 2) verify token
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    // console.log(decoded);
    // 3) ckeck if user exist
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      next(new ErrorHandler("User not found......", 404));
    }
    // console.log(token);
    //4) ckeck if user logged out
    const chackToken = user.tokens.find((t) => t.token === token);
    // console.log(chackToken);

    if (!chackToken) {
      next(new ErrorHandler("User not found..&&&", 404));
    }
    // 5) chack if user active
    if (user.active === false) {
      next(new ErrorHandler("User is not active", 401));
    }
    // 6) check if user change password
    if (user.passwordChangedAt) {
      const pass = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
      if (pass > decoded.iat) {
        next(new ErrorHandler("User recently changed password", 401));
      }
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * @description isAdmin primetions
 */
exports.isAdmin = asyncHandler((req, res, next) => {
  if (req.user.role === "admin") {
    console.log("..............///");
    return next();
  }
  console.log(req.user);
  next(new ErrorHandler("You are not allwoed to access this route", 403));
});

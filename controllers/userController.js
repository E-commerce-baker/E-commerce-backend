const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const { ErrorHandler } = require("../utils/errorHandler");
const { User } = require("../models/UserModel");
const {
  deleteOne,
  updateOne,
  applySlugify,
  getOne,
  createOne,
  getAll,
} = require("./factory");

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
 * @description get all User
 * @route api/users
 * @method get
 * @access private
 */
exports.getUsers = getAll(User);

/**
 * @description create new User
 * @param {name} req
 * @method post
 * @route api/users
 * @access private
 */
exports.createUser = createOne(User);

/**
 * @description get User
 * @param {id} req
 * @method get
 * @route api/users/:id
 * @access private
 */
exports.getUser = getOne(User);

/**
 * @description update User
 * @param {id} req
 * @method put
 * @route api/users/:id
 * @access private
 */
exports.updateUser = updateOne(User);


exports.updateUserWithoutPass = asyncHandler((req, res, next) => {
  delete req.body.password;
  console.log(req.body);
  next();
});


exports.updateLoggedUser = asyncHandler(async (req, res, next) => {
  delete req.body.password;
  delete req.body.role;
  delete req.body.active;
  if (req.body.email) {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(200).json({
        message: `email already exists`,
      });
    }
  }
  console.log(req.body);
  next();
});

/**
 * @description update User password
 * @param {id} req
 * @method put
 * @route api/user/changePassword/:id
 * @access private
 */
exports.changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
  // console.log(isMatch);
  if (!isMatch) {
    return res.status(200).json({
      message: `current password is incorrect`,
    });
  }
  const docs = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.newPassword, 10),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!docs) {
    return next(new ErrorHandler(`user not found`, 404));
  }

  await docs.save();
  return res.status(200).json({
    message: `password updated successfully`,
    data: docs,
  });
});

/**
 * @description update User password
 * @param {id} req
 * @method put
 * @route api/user/changePassword
 * @access public
 */
exports.changeLoggedPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
  // console.log(isMatch);
  if (!isMatch) {
    return res.status(200).json({
      message: `current password is incorrect`,
    });
  }
  const docs = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.newPassword, 10),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!docs) {
    return next(new ErrorHandler(`user not found`, 404));
  }
  const token = user.generateAccessToken();
  await docs.save();
  return res.status(200).json({
    message: `password updated successfully`,
    data: { user: docs, token },
  });
});

/**
 * @description delete User
 * @param {id} req
 * @method delete
 * @route api/users/:id
 * @access private
 */
exports.deleteUser = deleteOne(User);

exports.unActive = async(req, res, next) => {
  const user= await User.findOne({_id: req.params.id});
  if(!user){
    return res.status(404).json({
      message: `user not found`
      
    })
  }
  req.body.active = !user.active
  next();
};

exports.applySlugify = applySlugify();

exports.getMe = asyncHandler(async (req, res, next) => {
  // console.log(req.user);
  req.params.id = req.user._id.toString();
  next();
});
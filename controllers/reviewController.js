const { Review } = require("../models/ReviewModel");
const { ErrorHandler } = require("../utils/errorHandler");

const {
  deleteOne,
  updateOne,
  getOne,
  createOne,
  getAll,
} = require("./factory");

/**
 * @description get all Review
 * @route api/Reviews
 * @method get
 * @access public
 */
exports.getReviews = getAll(Review);

exports.getId = (req, res, next) => {
  // console.log(JSON.stringify(req.params));
  if (req.params.productId) {
    req.filterobj = { product: req.params.productId };
  }
  next();
};


exports.exist = async (req, res, next) => {
  const review = await Review.findOne({ user: req.user._id, product: req.params.productId });
  if (review) {
    return next(new ErrorHandler("You already reviewed this product!!!!", 400));
  }
  req.body.user = req.user._id.toString();
  req.body.product = req.params.productId || req.params.id;
  // console.log(req.body.user);
  next();
};

/**
 * @description create new Review
 * @param {title, rating, user, product} req
 * @method post
 * @route api/Reviews
 * @access private/user
 */
exports.createReview = createOne(Review);

/**
 * @description get Review
 * @param {id} req
 * @method get
 * @route api/Reviews/:id
 * @access public
 */
exports.getReview = getOne(Review);

/**
 * @description update Review
 * @param {id} req
 * @method put
 * @route api/Reviews/:id
 * @access private/user
 */
exports.updateReview = updateOne(Review);

exports.existToDele = (req, res, next)=>{
  const review = Review.findOne({_id: req.params.id});
  if(!review){
    return next(new ErrorHandler("Review not found", 404));
  }
  next();
}

/**
 * @description delete Review
 * @param {id} req
 * @method delete
 * @route api/Reviews/:id
 * @access private/user || private/admin
 */
exports.deleteReview = deleteOne(Review);

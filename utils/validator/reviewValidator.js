const asyncHandler = require("express-async-handler");
const Joi = require("joi");

const { ErrorHandler } = require("../errorHandler");
const { Review } = require("../../models/ReviewModel");

/**
 * @desc creae Review Validation
 * @method post /api/reviews
 * @access privet
 */
exports.createReviewValidation = asyncHandler(async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string(),
      rating: Joi.number().required().min(0).max(5),
      user: Joi.string().required().hex().length(24).required(),
      product: Joi.string().required().hex().length(24),
    }).options({ abortEarly: false });

    await schema.validateAsync(req.body);

    next();
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
exports.updateReviewValidation = asyncHandler(async (req, res, next) => {
  try {
    const schema = Joi.object({
      id: Joi.string().required().hex().length(24),
      title: Joi.string(),
      rating: Joi.number().min(0).max(5),
    });

    const review = await Review.findById(req.params.id);
    if (!review) {
      return next(new ErrorHandler("Review not found", 404));
    }

    if (review.user._id.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("You can't update this review", 400));
    }

    await schema.validateAsync({ ...req.params, ...req.body });

    return next();
  } catch (error) {
    return next(new ErrorHandler(error.message, error.status || 400));
  }
});

exports.deleteReviewValidation = asyncHandler(async (req, res, next) => {
  try {
    const schema = Joi.object({
      id: Joi.string().required().hex().length(24),
    });

    if (req.user.role !== "admin") {
      const review = await Review.findById(req.params.id);
      console.log(review);
      if (!review) {
        return next(new ErrorHandler("Review not found", 404));
      }
      console.log(review.user._id.toString());
      console.log(req.user._id.toString());
      if (review.user._id.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("You can't delete this review", 400));
      }
    }

    await schema.validateAsync({ ...req.params });
    return next();
  } catch (error) {
    return next(new ErrorHandler(error.message, error.status || 400));
  }
});

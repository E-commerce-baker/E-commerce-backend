const router = require("express").Router({mergeParams: true});
const { protect } = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");
const {
  createReviewValidation,
  updateReviewValidation,
  deleteReviewValidation,
} = require("../utils/validator/reviewValidator");

router
  .route("/")
  .get(reviewController.getId, reviewController.getReviews)
  .post(
    protect,
    reviewController.exist,
    createReviewValidation,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .put(protect, updateReviewValidation, reviewController.updateReview)
  .delete(
    protect,
    reviewController.existToDele,
    deleteReviewValidation,
    reviewController.deleteReview
  );

module.exports = router;

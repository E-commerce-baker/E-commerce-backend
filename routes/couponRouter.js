const router = require("express").Router();
const { isAdmin, protect } = require("../controllers/authController");
const couponController = require("../controllers/couponController");
const brandMiddleware = require("../middlewares/brandMiddleware");

// router.use(protect, isAdmin);

router
  .route("/")
  .get(couponController.getCoupons)
  .post(couponController.createCoupon);

router
  .route("/:id")
  .get(couponController.isExsit,couponController.getCoupon)
  .put(couponController.isExsit, couponController.updateCoupon)
  .delete(couponController.isExsit, couponController.deleteCoupon);

module.exports = router;

const router = require("express").Router({ mergeParams: true });
const cartController = require("../controllers/cartController");
const cartMiddleware = require("../middlewares/cartMiddleware");
const {protect} = require("../controllers/authController");

router.use(protect);
router
  .route("/")
  .get(cartController.createfilter, cartController.getCarts)
  .post(cartController.createCartParam, cartController.createCart);

router
  .route("/:id")
  .get(cartMiddleware.validateGetCartParams, cartController.getCart)
  .put(cartController.updateCart)
  .delete(cartMiddleware.validateGetCartParams, cartController.deleteCart);

module.exports = router;

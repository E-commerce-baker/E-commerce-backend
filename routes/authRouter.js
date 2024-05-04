const router = require("express").Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.route("/signup").post(
  authController.upload,
  authController.resizeImage,
  authMiddleware.validatesignupSchema,
  authController.signup
);

router.route("/login").post(
  authMiddleware.validateloginSchema,
  authController.login
);

router.route("/logout").delete(authController.protect, authController.logout);


module.exports = router;

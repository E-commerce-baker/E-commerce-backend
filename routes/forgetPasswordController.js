const { Router } = require("express");

const router = Router();
const forgetPasswordController = require("../controllers/forgetPasswordController");

router.route("/")
  .post(
    forgetPasswordController.checkpassword
  );

router
  .route("/:email/:token")
  .get(
    forgetPasswordController.resetpassword
  )
  .post(
    forgetPasswordController.updateresetpassword
  );


module.exports = router;

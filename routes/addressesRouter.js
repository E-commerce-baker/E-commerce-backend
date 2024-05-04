const router = require("express").Router({ mergeParams: true });
const {  protect } = require("../controllers/authController");
const addressesController = require("../controllers/addressesController");

router.use(protect);

router.post("/", addressesController.addAddresses);
router.delete("/:addressId", addressesController.removeAddresses);
router.get("/", addressesController.getLoggedUserAddresses);


module.exports = router;

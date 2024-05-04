const router = require("express").Router({ mergeParams: true });
const {  protect } = require("../controllers/authController");
const wishListController = require("../controllers/wishListController");

router.use(protect);

router.post("/", wishListController.addProductToWishList);
router.delete("/:productId", wishListController.removeProductToWishList);
router.get("/", wishListController.getLoggedUserWishList);


module.exports = router;

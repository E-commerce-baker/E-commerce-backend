const router = require("express").Router();
const { isAdmin, protect } = require("../controllers/authController");
const brandController = require("../controllers/brandController");
const brandMiddleware = require("../middlewares/brandMiddleware");

router
  .route("/")
  .get(brandController.getBrands)
  .post(
    protect,
    isAdmin,
    brandController.upload,
    brandController.resizeImage,
    brandMiddleware.validateCreateBrand,
    brandController.applySlugify,
    brandController.createBrand
  );

router
  .route("/:id")
  .get(brandMiddleware.validateGetBrandParams, brandController.getBrand)
  .put(
    protect,
    isAdmin,
    brandController.upload,
    brandController.resizeImage,
    brandMiddleware.validateUpdateBrand,
    brandController.isExsit,
    brandController.applySlugify,
    brandController.updateBrand
  )
  .delete(
    protect,
    isAdmin,
    brandMiddleware.validateGetBrandParams,
    brandController.deleteBrand
  );

module.exports = router;

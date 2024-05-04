const { Router } = require("express");

const router = Router({ mergeParams: true });
const productController = require("../controllers/productController");
const productMiddleware = require("../middlewares/productMiddleware");
const { isAdmin, protect } = require("../controllers/authController");
const reviewRouter = require("./reviewRouter");

// Product Routes
router.get("/search", productController.searchProduct);

router.use('/:productId/reviews', reviewRouter)

router
  .route("/")
  .get(productController.createfilter, productController.getProducts)
  .post(
    protect,
    // isAdmin,
    productController.uploadProductImage,
    productController.ressizeProductImage,
    productController.createproduct,
    productController.applySlugify,
    productMiddleware.validateCreateProduct,
    productController.createProduct
  );

router
  .route("/:id")
  .get(
    productController.createfilter,
    productMiddleware.validateGetProductParams,
    productController.getProduct
  )
  .put(
    protect,
    isAdmin,
    productController.uploadProductImage,
    productController.ressizeProductImage,
    productMiddleware.validateUpdateProduct,
    productController.applySlugify,
    productController.updateProduct
  )
  .delete(
    protect,
    isAdmin,
    productMiddleware.validateGetProductParams,
    productController.deleteProduct
  );

module.exports = router;

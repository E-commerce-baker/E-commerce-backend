const { Router } = require("express");

const router = Router();
const categoryController = require("../controllers/categoryController");
const categoryMiddleware = require("../middlewares/categoryMiddleware");

// Nested route
const subCategoryRouter = require("./subCategoryRouter");
const productRouter = require("./productRouter");
const { protect, isAdmin } = require("../controllers/authController");

router.use("/:categoryId/subcategories", subCategoryRouter);
router.use("/:categoryId/products", productRouter);

router
  .route("/")
  .get(protect, categoryController.getCategories)
  .post(
    protect,
    // isAdmin,
    categoryController.upload,
    categoryController.resizeImage,
    categoryMiddleware.validateCreateCategory,
    categoryController.isExsit,
    categoryController.applySlugify,
    categoryController.createCategory
  );

router
  .route("/:id")
  .get(
    categoryMiddleware.validateGetCategoryParams,
    categoryController.getCategory
  )
  .put(
    protect,
    isAdmin,
    categoryController.upload,
    categoryController.resizeImage,
    categoryMiddleware.validateUpdateCategory,
    categoryController.applySlugify,
    categoryController.updateCategory
  )
  .delete(
    protect,
    isAdmin,
    categoryMiddleware.validateGetCategoryParams,
    categoryController.deleteCategory
  );

module.exports = router;

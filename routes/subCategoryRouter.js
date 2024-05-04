const router = require("express").Router({ mergeParams: true });
const { isAdmin, protect } = require("../controllers/authController");
const SubCategoryController = require("../controllers/subCategoryController");
const subCategoryMiddleware = require("../middlewares/subCategoryMiddleware");

router
  .route("/")
  .get( SubCategoryController.filter, SubCategoryController.getSubCategories)
  .post(
    protect,
    isAdmin,
    subCategoryMiddleware.createSubCategory,
    SubCategoryController.isExsit,
    SubCategoryController.applySlugify,
    SubCategoryController.createSubCategory
  );

router
  .route("/:id")
  .get(
    subCategoryMiddleware.getSubCategoryParams,
    SubCategoryController.getSubCategory
  )
  .put(
    protect,
    isAdmin,
    subCategoryMiddleware.updateSubCategory,
    SubCategoryController.applySlugify,
    SubCategoryController.updateSubCategory
  )
  .delete(
    protect,
    isAdmin,
    subCategoryMiddleware.getSubCategoryParams,
    SubCategoryController.deleteSubCategory
  );

module.exports = router;

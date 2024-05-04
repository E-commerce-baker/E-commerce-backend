const asyncHandler = require("express-async-handler");

const { SubCategory } = require("../models/SubCategoryModel");
const {
  deleteOne,
  updateOne,
  applySlugify,
  getOne,
  createOne,
  getAll,
} = require("./factory");

/**
 * @description get list of subcategories || all subcategories
 * @route api/categories/:categoryId/subcategories || api/subcategories
 * @method get
 * @access public
 */
exports.getSubCategories = getAll(SubCategory);

exports.filter= (req, res, next) => {
  if(req.params.categoryId){
    req.filterobj = { category: req.params.categoryId };
  }
  next()
}

/**
 * @description create new SubCategory
 * @route api/categories/:categoryId/subcategories || api/subCategories
 * @param {name, category_id} req
 * @method post
 * @access public
 */
exports.createSubCategory = createOne(SubCategory);

/**
 * @description get SubCategory
 * @param {id} req
 * @method get
 * @route api/categories/:categoryId/subcategories || api/subcategories/:id
 * @access public
 */
exports.getSubCategory = getOne(SubCategory);

/**
 * @description update SubCategory
 * @param {id, name, category_id} req
 * @method put
 * @route api/subcategories/:id
 * @access public
 */
exports.updateSubCategory = updateOne(SubCategory);

/**
 * @description delete SubCategory
 * @param {id} req
 * @method delete
 * @route api/subcategories/:id
 * @access public
 */
exports.deleteSubCategory = deleteOne(SubCategory);

exports.applySlugify = applySlugify();

exports.isExsit = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const category = await SubCategory.findOne({ name });
  if (category)
    return res.status(400).json({
      success: false,
      message: `SubCategory is already exist`,
    });
  next();
});

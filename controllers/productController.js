const {
  uploadMixOfImage,
  resizeMixOfImage,
} = require("../middlewares/uploadImageMiddleware");
const { Product } = require("../models/ProductModel");
const {
  deleteOne,
  updateOne,
  applySlugify,
  getOne,
  createOne,
  getAll,
  search,
} = require("./factory");

exports.uploadProductImage = uploadMixOfImage([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

const arr = ['products']
exports.ressizeProductImage = resizeMixOfImage(arr);

/**
 * @description get all Products
 * @route api/products || api/:categoryId/products
 * @method get
 * @access public
 */
exports.getProducts = getAll(Product);

/**
 * @description create filter object
 * @param {categoryId} req
 * @method get
 * @route api/:categoryId/products
 */
exports.createfilter = (req, res, next) => {
  // console.log(req.params);
  if (req.params.categoryId) {
    req.filterobj = { category: req.params.categoryId };
  }
  next();
};
/**
 * @description create new Products
 * @param {categoryId} req
 * @method post
 * @route api/:categoryId/products
 */
exports.createproduct = (req, res, next) => {
  // console.log(req.params);
  if (req.params.categoryId) {
    req.body.category = req.params.categoryId;
  }
  next();
};
/**
 * @description create new Products
 * @param {name} req
 * @method post
 * @route api/Products
 * @access private
 */
exports.createProduct = createOne(Product);

/**
 * @description get Product
 * @param {id} req
 * @method get
 * @route api/products/:id
 * @access public
 */
exports.getProduct = getOne(Product, "reviews");

/**
 * @description update Product
 * @param {id} req
 * @method put
 * @route api/products/:id
 * @access public
 */
exports.updateProduct = updateOne(Product);

/**
 * @description delete Product
 * @param {id} req
 * @method delete
 * @route api/products/:id
 * @access public
 */
exports.deleteProduct = deleteOne(Product);

/**
 * @description search Product
 * @param {keyword} req
 * @method get
 *@route api/products/search
 * @access public
 */

exports.searchProduct = search(Product);

exports.applySlugify = applySlugify();

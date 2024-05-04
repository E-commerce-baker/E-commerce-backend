const asyncHandler = require("express-async-handler");
const { Cart } = require("../models/CartModel");
const { ErrorHandler } = require("../utils/errorHandler");
const {
  deleteOne,
  updateOne,
  getOne,
  createOne,
  getAll,
} = require("./factory");
const { Product } = require("../models/ProductModel");
const { ErrorHandler } = require("../utils/errorHandler");

/**
 * @description get all Cart
 * @route api/Carts
 * @method get
 * @access public
 */
exports.getCarts = getAll(Cart);

/**
 * @description create filter object
 * @param {userId} req
 * @method get
 * @route api/:userId/Carts
 */
exports.createfilter = (req, res, next) => {
  if (req.params.userId) {
    req.filterobj = { user_id: req.params.userId };
  }
  next();
};
/**
 * @description create new Carts
 * @param {userId} req
 * @method post
 * @route api/:userId/Carts
 */
exports.createCartParam = (req, res, next) => {
  if (req.params.userId) {
    req.body.user_id = req.params.userId;
  }
  next();
};
/**
 * @description Add to Cart
 * @param {object} req - Request object containing user_id and products
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 * @method POST
 * @route api/carts
 * @access public
 */
exports.createCart = asyncHandler(async (req, res, next) => {
  const { products } = req.body;
  // 1) get proudect
  const product = await Product.findById(products[0].product_id);
  if (!product) {
    next(new ErrorHandler("product not found"));
  }
  // 2) get cart for logged user
  let cart = await Cart.findOne({ user_id: req.user_id });

  if (!cart) {
    cart = await Cart.create({
      user_id: req.user._id,
      products: [
        {
          product_id: products[0].product_id,
          color: products[0].color,
          price: product.price,
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: cart,
    });
  } else {
    
    console.log("object");
  }
});

/**
 * @description get Cart
 * @param {id} req
 * @method get
 * @route api/Carts/:id
 * @access public
 */
exports.getCart = getOne(Cart);

/**
 * @description update Cart
 * @param {id} req
 * @method put
 * @route api/Carts/:id
 * @access public
 */
exports.updateCart = updateOne(Cart);

/**
 * @description delete Cart
 * @param {id} req
 * @method delete
 * @route api/Carts/:id
 * @access public
 */
exports.deleteCart = deleteOne(Cart);

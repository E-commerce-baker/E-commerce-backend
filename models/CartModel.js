const mongoose = require("mongoose");
const { Product } = require("./ProductModel");
const { User } = require("./UserModel");
const { ErrorHandler } = require("../utils/errorHandler");

const { Schema } = mongoose;

const cartSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    products: [
      {
        product_id: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        color: String,
        price: Number
      },
    ],
    total_price: { type: Number, default: 0 },
    total_price_after_discount : Number,

  },
  { timestamps: true }
);

cartSchema.pre("save", async function (next) {
  // console.log(this);
  const user = await User.findById(this.user_id);
  if (!user) {
    next(new ErrorHandler("User not found", 403));
  }

  const productsInCart = await Product.find({
    _id: { $in: this.products.map((product) => product.product_id) },
  });
  console.log(productsInCart.length);
  console.log(this.products.length);
  if (productsInCart.length !== this.products.length) {
    next(new ErrorHandler("Product not foundXX", 403));
  }
  // console.log(productsInCart);

  // Calculate total price
  let totalPrice = 0;
  productsInCart.forEach((product) => {
    const cartProduct = this.products.find(
      (cartProductx) =>
        cartProductx.product_id.toString() === product._id.toString()
    );
    if (cartProduct) {
      totalPrice += product.price * cartProduct.quantity;
    }
  });
  this.total_price = totalPrice;

  // console.log(this);
  next();
});

cartSchema.pre(["find", "findOne", "findById", "save"], function (next) {
  this.populate("user_id", "username");
  this.populate("products.product_id", "name image brand imageCover price ");
  // console.log(this);
  next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = { Cart };

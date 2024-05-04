const Router = require("express").Router();
const categoryRouter = require("./categoryRouter");
const subCategoryRouter = require("./subCategoryRouter");
const brandRouter = require("./brandRouter");
const productRouter = require("./productRouter");
const userRouter = require("./userRouter");
const cartRouter = require("./cartRouter");
const forgetPasswordController = require("./forgetPasswordController");
const authRouter = require("./authRouter");
const reviewRouter = require("./reviewRouter");
const wishListRouter = require("./wishListRouter");
const addressestRouter = require("./addressesRouter");
const couponRouter = require("./couponRouter");

Router.use("/categories", categoryRouter);
Router.use("/subcategories", subCategoryRouter);
Router.use("/brands", brandRouter);
Router.use("/products", productRouter);
Router.use("/addToCarts", cartRouter);
Router.use("/forgetpassword", forgetPasswordController);
Router.use("/users", userRouter);
Router.use("/auth", authRouter);
Router.use("/reviews", reviewRouter);
Router.use("/wishList", wishListRouter);
Router.use("/addresses", addressestRouter);
Router.use("/coupons", couponRouter);

module.exports = Router;

const mongoose = require("mongoose");

const couponScema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "coupon name required"],
  },
  expired: {
    type: Date,
    required: [true, "coupon expired is required"],
  },
  discount: {
    type: Number,
    required: [true, "coupon discount is required"],
  },
});

const Coupon = mongoose.model("Coupon", couponScema);

module.exports ={
    Coupon
}
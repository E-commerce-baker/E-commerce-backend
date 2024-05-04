const mongoose = require("mongoose");
const { Product } = require("./ProductModel");

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    title: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "username",
  });
  next();
});

reviewSchema.statics.getAverageRating = async function (productId) {
  const res = await this.aggregate([
    {
      $match: {
        product: productId,
      },
    },
    {
      $group: {
        _id: "product",
        averageRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  await Product.findByIdAndUpdate(productId, {
    averageRating: res[0].averageRating,
    reviewCount: res[0].count,
  });
};

reviewSchema.post("save", async function () {
  await this.constructor.getAverageRating(this.product);
});

reviewSchema.post("remove", async function () {
  await this.constructor.getAverageRating(this.product);
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = { Review };

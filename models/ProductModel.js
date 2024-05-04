const mongoose = require("mongoose");
const { Category } = require("./CategoryModel");
const { SubCategory } = require("./SubCategoryModel");
const { Brand } = require("./BrandModel");
const { ErrorHandler } = require("../utils/errorHandler");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 20,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      min: 0,
    },

    priceAfterDiscount: {
      type: Number,
    },

    colors: [String],

    imageCover: {
      type: String,
      required: true,
    },

    images: [String],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },

    averageRating: {
      type: Number,
      min: [1],
      max: [5],
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// chack if category id &subcategories id& brand id is exist in db or not
productSchema.pre("save", async function (next) {
  // console.log(this.category);
  // const category = await Category.findById(this.category);
  // if (!category) {
  //   return next(new ErrorHandler("category not found", 404));
  // }

  // if (this.subcategories.length > 0) {
  //   const subCategories = await SubCategory.find({
  //     _id: { $in: this.subcategories },
  //   }).select("category -_id");
  //   if (subCategories.length > 0) {
  //     subCategories.forEach((subCategory) => {
  //       if (subCategory.category.toString() !== this.category.toString()) {
  //         return next(
  //           new ErrorHandler("subCategories not belong to this category ", 404)
  //         );
  //       }
  //     });
  //   }
  //   if (
  //     subCategories.length !== this.subcategories.length &&
  //     subCategories.length < 1
  //   ) {
  //     return next(new ErrorHandler("subCategories not found", 404));
  //   }
  // }

  // if (this.brand) {
  //   const brand = await Brand.findById(this.brand);
  //   if (!brand) {
  //     return next(new ErrorHandler("brand not found", 404));
  //   }
  // }

  next();
});

//all find findById and anther with regiler
productSchema.pre(["find", "findOne", "findById", "save"], function (next) {
  this.populate("category", "name -_id");
  next();
});

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };

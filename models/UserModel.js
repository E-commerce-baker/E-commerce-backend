const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const slugify = require("slugify");

const { Schema } = mongoose;
const saltRounds = 10;

const addressSchema = new Schema({
  city: { type: String, required: true },
  phone: { type: Number, required: true },
  alias: { type: String, required: true },
  details: { type: String, required: true },
});
const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: [true, "duplicate email"] },
    password: { type: String, required: true, min: 8 },
    passwordChangedAt: Date,
    firstName: { type: String },
    lastName: { type: String },
    slug: { type: String },
    profileImage: String,
    active: { type: Boolean, default: true },
    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["user", "admin"],
    },
    wishList: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    addresses: [addressSchema],
    tokens: [{ token: { type: String, required: true } }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  this.slug = slugify(this.username, { lower: true });
  if (!this.isModified("password")) {
    return next();
  }
  // Hash the password
  this.password = await bcrypt.hashSync(this.password, saltRounds);

  next();
});

userSchema.methods.generateAccessToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRE_TIME,
  });
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };

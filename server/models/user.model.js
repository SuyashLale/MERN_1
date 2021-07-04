/**
 * Setup the User schema using Mongoose
 */
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      default: "subscriber",
    },
    cart: {
      type: Array,
      default: [],
    },
    address: String,
    //   wishlist: [{ type: String, ref: "Product" }],
  },
  { timestamps: true } // For CreatedAt and UpdatedAt fields.
);

module.exports = mongoose.model("User", userSchema);

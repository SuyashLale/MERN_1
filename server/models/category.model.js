/**
 * Setup the Category Schema using Mongoose
 */
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Name is required",
    minlength: [3, "Name is too short"],
    maxlength: [32, "Name is too long"],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true,
  },
}, {timestamps:true});

module.exports = mongoose.model("Category", categorySchema);
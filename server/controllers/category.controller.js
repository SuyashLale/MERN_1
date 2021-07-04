/**
 * Import 3rd party Modules
 */
const slugify = require("slugify");

/**
 * Import Models
 */
const Category = require("../models/category.model");
const SubCategory = require("../models/subCategory.model");
const Product = require("../models/product.model");

/**
 * Create a new Category.
 * Name comes in the body from react.
 */
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({ name, slug: slugify(name) }).save();
    res.json(category);
  } catch (error) {
    //   console.log(error);
    res.status(400).send("Create Category failed - " + error.message);
  }
};

/**
 * Get Category
 * Addition: Send all the products that belong to this category in the response.
 */
exports.readCategory = async (req, res) => {
  try {
    let category = await Category.findOne({ slug: req.params.slug }).exec();
    let products = await Product.find({ category })
      .populate("category")
      .populate("postedBy: _id name")
      .exec();
    res.json({
      category,
      products,
    });
  } catch (error) {
    // console.log(error);
    res.status(400).send("Get Category failed - " + error.message);
  }
};

/**
 * Update Category
 */
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    res.send(
      await Category.findOneAndUpdate(
        { slug: req.params.slug },
        { name, slug: slugify(name) },
        { new: true }
      )
    );
  } catch (error) {
    // console.log(error.message);
    res.status(400).send("Category update failed - " + error.message);
  }
};

/**
 * Delete Category
 */
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete({
      slug: req.params.slug,
    });
    res.send(deletedCategory);
  } catch (error) {
    // console.log(error);
    res.status(400).send("Delete Category failed - " + error.message);
  }
};

/**
 * List all Categories
 */
exports.listCategories = async (req, res) => {
  try {
    res.send(await Category.find({}).sort({ createdAt: -1 }).exec());
  } catch (error) {
    // console.log(error);
    res.status(400).send("List Categories failed - " + error.message);
  }
};

/**
 * Get all sub-categories for a parent category
 */

exports.listSubCategories = (req, res) => {
  SubCategory.find({ parent: req.params._id })
    .exec()
    .then((subCategories) => {
      console.log(subCategories);
      res.send(subCategories);
    })
    .catch((error) => {
      res.status(400);
      res.json({
        error: error.message,
      });
    });
};

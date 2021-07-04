/**
 * Import 3rd party Modules
 */
const slugify = require("slugify");

/**
 * Import Models
 */
const SubCategory = require("../models/subCategory.model");
const Product = require("../models/product.model");

/**
 * Create a new Category.
 * Name comes in the body from react.
 */
exports.createSubCategory = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const subCategory = await new SubCategory({
      name,
      slug: slugify(name),
      parent,
    }).save();
    res.json(subCategory);
  } catch (error) {
    //   console.log(error);
    res.status(400).send("Create Sub-Category failed - " + error.message);
  }
};

/**
 * Get Category
 * New addition: Send the products that belong to this sub-category in the response.
 */
exports.readSubCategory = async (req, res) => {
  try {
    let subCategory = await SubCategory.findOne({
      slug: req.params.slug,
    }).exec();
    let products = await Product.find({ subCategories: subCategory })
      .populate("category")
      .exec();
    res.json({
      subCategory,
      products,
    });
  } catch (error) {
    // console.log(error);
    res.status(400).send("Get Sub-Category failed - " + error.message);
  }
};

/**
 * Update Category
 */
exports.updateSubCategory = async (req, res) => {
  try {
    const { name, parent } = req.body;
    res.send(
      await SubCategory.findOneAndUpdate(
        { slug: req.params.slug },
        { name, parent, slug: slugify(name) },
        { new: true }
      )
    );
  } catch (error) {
    // console.log(error.message);
    res.status(400).send("Sub-Category update failed - " + error.message);
  }
};

/**
 * Delete Category
 */
exports.deleteSubCategory = async (req, res) => {
  try {
    const deletedSubCategory = await SubCategory.findOneAndDelete({
      slug: req.params.slug,
    });
    res.send(deletedSubCategory);
  } catch (error) {
    // console.log(error);
    res.status(400).send("Delete Sub-Category failed - " + error.message);
  }
};

/**
 * List all Categories
 */
exports.listSubCategories = async (req, res) => {
  try {
    res.send(await SubCategory.find({}).sort({ createdAt: -1 }).exec());
  } catch (error) {
    // console.log(error);
    res.status(400).send("List Sub-Categories failed - " + error.message);
  }
};

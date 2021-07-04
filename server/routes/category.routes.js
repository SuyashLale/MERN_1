/**
 * Import Packages
 * 1. Express
 * 2. Express Router
 */
const express = require("express");
const router = express.Router();

/**
 * Import Controllers
 */
const {
  createCategory,
  readCategory,
  updateCategory,
  deleteCategory,
  listCategories,
  listSubCategories,
} = require("../controllers/category.controller");

/**
 * Import Middlewares
 */
const { authCheck, adminCheck } = require("../middlewares/auth.middleware");

/**
 *Implement Routes & Apply Middlewares
 */
/**
 * Endpoint for Creating a new category
 */
router.post("/category", authCheck, adminCheck, createCategory);

/**
 * Endpoint for Getting a category.
 * This will be a public endpoint, hence no need to apply MWs.
 */
router.get("/category/:slug", readCategory);

/**
 * Endpoint for Updating a category
 */
router.put("/category/:slug", authCheck, adminCheck, updateCategory);

/**
 * Endpoint for Deleting acategory
 */
router.delete("/category/:slug", authCheck, adminCheck, deleteCategory);

/**
 * Endpoint for Listing all the categories.
 * Doesnt need the user to be an ADMIN for this end-point.
 */
router.get("/categories", listCategories);

/**
 * Endpoint for getting all the Sub-Categories based on the Parent Category ID.
 * Doesnt need the user to be an ADMIN for this end-point.
 */
router.get("/category/sub-categories/:_id", listSubCategories);

/**
 * Export the Router Object to the main server.
 */
module.exports = router;

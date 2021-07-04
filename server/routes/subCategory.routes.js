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
  createSubCategory,
  readSubCategory,
  updateSubCategory,
  deleteSubCategory,
  listSubCategories,
} = require("../controllers/subCategory.controller");

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
router.post("/sub-category", authCheck, adminCheck, createSubCategory);

/**
 * Endpoint for Getting a category.
 * This will be a public endpoint, hence no need to apply MWs.
 */
router.get("/sub-category/:slug", readSubCategory);

/**
 * Endpoint for Updating a category
 */
router.put("/sub-category/:slug", authCheck, adminCheck, updateSubCategory);

/**
 * Endpoint for Deleting acategory
 */
router.delete("/sub-category/:slug", authCheck, adminCheck, deleteSubCategory);

/**
 * Endpoint for Listing all the categories.
 * Doesnt need the user to be an ADMIN for this end-point.
 */
router.get("/sub-categories", listSubCategories);

/**
 * Export the Router Object to the main server.
 */
module.exports = router;

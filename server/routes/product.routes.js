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
  createProduct,
  readProduct,
  submitUpdatedProduct,
  deleteProduct,
  listProducts,
  getProductsSorted,
  getProductCount,
  updateProductStarRating,
  getRelatedProducts,
  searchFilters,
} = require("../controllers/product.controller");

/**
 * Import Middlewares
 */
const { authCheck, adminCheck } = require("../middlewares/auth.middleware");

/**
 *Implement Routes & Apply Middlewares
 */
/**
 * Endpoint for Creating a new Product
 */
router.post("/product", authCheck, adminCheck, createProduct);

/**
 * Endpoint for Landing on the Update Page for a product --> ADMIN
 * Endpoint for Landing on the Single Product Information page --> USER
 */
router.get("/product/:slug", readProduct);

/**
 * Endpoint for getting the #Products
 */
router.get("/products/total", getProductCount);

/**
 * Endpoint for submitting the updated product
 */
router.put("/product/:slug", authCheck, adminCheck, submitUpdatedProduct);

/**
 * Endpoint for Deleting a product
 */
router.delete("/product/:slug", authCheck, adminCheck, deleteProduct);

/**
 * Endpoint for Listing all the products.
 * Doesnt need the user to be an ADMIN for this end-point.
 */
router.get("/products/:count", listProducts);

/**
 * Endpoint for getting the latest arrivals:
 *  get products based on the latest created timestamp.
 * Using Post - so that easy to send data in the req.body like sorting order, qty limit etc.
 */
router.post("/products", getProductsSorted);

/**
 * Endpoint for updating the star-rating on the product.
 * Only Logged-in users should be able to leave a rating.
 */
router.put("/product/star/:productId", authCheck, updateProductStarRating);

/**
 * Endpoint for getting all products in the same category.
 */
router.get("/product/related/:productId", getRelatedProducts);

/**
 * Endpoint for searching/filtering products based on different parameters.
 */
router.post("/search/filters", searchFilters);

/**
 * Export the Router Object to the main server.
 */
module.exports = router;

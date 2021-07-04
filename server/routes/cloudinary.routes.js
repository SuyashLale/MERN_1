/**
 * Import Packages
 * 1. Express
 * 2. Express Router
 */
const express = require("express");
const router = express.Router();

/**
 * Import Middlewares
 */
const { authCheck, adminCheck } = require("../middlewares/auth.middleware");

/**
 * Import Controllers
 */
const {
  uploadImages,
  removeImage,
} = require("../controllers/cloudinary.controller");

/**
 * Endpoint for uploading Images to Cloudinary
 */
router.post("/upload-images", authCheck, adminCheck, uploadImages);

/**
 * Endpoint for removing an Image
 */
router.post("/remove-image", authCheck, adminCheck, removeImage);

/**
 * Export the Router Object to the main server.
 */
module.exports = router;

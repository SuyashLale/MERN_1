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
  createOrUpdateUser,
  currentUser,
} = require("../controllers/auth.controller");

/**
 * Import Middlewares
 */
const { authCheck } = require("../middlewares/auth.middleware");
const { adminCheck } = require("../middlewares/auth.middleware");

/**
 *Implement Routes & Apply Middlewares
 */
/**
 * Endpoint for creating a new user/updating an existing user in the DB.
 */
router.post("/create-or-update-user", authCheck, createOrUpdateUser);

/**
 * Endpoint for returning the current/logged-in user to react.
 * Configuring it as a POST request so that it is not hit unnecessarily via browser.
 */
router.post("/current-user", authCheck, currentUser);

/**
 * Endpoint for checking whether a user has an ADMIN role.
 * After checking, it returns the current user to front end.
 */
router.post("/admin", authCheck, adminCheck, currentUser);

/**
 * Export the Router Object to the main server.
 */
module.exports = router;

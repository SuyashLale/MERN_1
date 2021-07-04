/**
 * Import Packages
 * 1. Express
 * 2. Express Router
 */
const express = require("express");
const router = express.Router();

/**
 *Implement Routes
 */
router.get("/user", (req, res) => {
  res.json({
    data: "You've hit the /api/user endpoint",
  });
});

module.exports = router;

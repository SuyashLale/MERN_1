const admin = require("../firebase/index");
const User = require("../models/user.model");

/**
 * Middleware to
 * 1. Authenticate the user token sent from the front-end against Firebase.
 * 2. Add the authenticated user to the request obj so that it avaiable in the controller.
 * 3. Call next() to pass on the call.
 */
exports.authCheck = async (req, res, next) => {
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    console.log("FIREBASE USER IN AUTH CHECK: ", firebaseUser);
    req.user = firebaseUser;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      error: "Invalid or expired token.",
    });
  }
};

/**
 * Middleware to
 * 1. Check whether the user is an Admin or not.
 * 2. This MW will be applied after the AuthCheck MW.
 */
exports.adminCheck = async (req, res, next) => {
  const { email } = req.user;
  const user = await User.findOne({ email }).exec();
  if (user.role !== "admin") {
    res.status(403).json({
      err: "Access Denied! Admin-only resource.",
    });
  }
  next();
};

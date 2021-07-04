/**
 * Import Models
 */
const User = require("../models/user.model");

/**
 * Updates an existing user based on the email,
 * Creates a new user, if email not found.
 */
exports.createOrUpdateUser = async (req, res) => {
  const { name, email, picture } = req.user;
  const user = await User.findOneAndUpdate(
    { email },
    { name: email.split("@")[0], picture },
    { new: true }
  );
  if (user) {
    // Found an existing user in the DB, then send it to react as json
    console.log("User Updated --> ", user);
    res.json(user);
  } else {
    // Create a new user in the DB, then send it to react as json
    const newUser = await new User({
      email,
      name: email.split("@")[0],
      picture,
    }).save();
    console.log("User Created --> ", newUser);
    res.json(newUser);
  }
};

/**
 * Get the current/logged-in user from the DB
 * using the email address and return as json.
 * Throw Error, otherwise.
 */
exports.currentUser = async (req, res) => {
  await User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) throw new Error(err);
    res.json(user);
  });
};

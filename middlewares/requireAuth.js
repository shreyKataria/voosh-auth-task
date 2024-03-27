const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new Error("Not authorized to access this route"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new Error("no user found with this id"));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new Error("Not authorized to access"));
  }
};

const adminView = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "You do not have permission to perform this action" });
  }
};

module.exports = {
  requireAuth,
  adminView,
};

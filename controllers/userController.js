const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// helper
const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ user, token, message: "successful" });
};

const googleLogin = async (req, res) => {
  const user = req.user;
  await user.getSignedToken(),
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    };
};

// register
const Register = async (req, res, next) => {
  const { email, name, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return console.log(error);
  }

  if (existingUser) {
    return res.status(400).json({ message: "user already exist" });
  }

  if (!name || !email || !password) {
    return res.status(401).json({ message: "require all the fields" });
  }

  //   const hashPassword = bcrypt.hashSync(password);

  try {
    const user = await User.create({
      email,
      name,
      password,
    });

    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

const LogIn = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new Error("Please provide email and password"));
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new Error(" Invalid credentials"));
    }

    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      return next(new Error("wrong password"));
    }
    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  googleLogin,
  Register,
  LogIn,
};

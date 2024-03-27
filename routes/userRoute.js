const passport = require("passport");
const {
  googleLogin,
  googleLoginCallback,
  Register,
  LogIn,
  GetAllUserProfiles,
  ProfileDetails,
} = require("../controllers/userController");

const express = require("express");
const { requireAuth } = require("../middlewares/requireAuth");
const router = express.Router();

// routes

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleLogin
);
router.post("/register", Register);
router.post("/login", LogIn);

module.exports = router;

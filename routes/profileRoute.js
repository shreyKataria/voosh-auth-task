// const { viewProfile } = require("../controllers/profileController");

const express = require("express");
const router = express.Router();

const passport = require("passport");

const {
  viewProfile,
  editProfile,
  viewAllProfile,
  adminRole,
} = require("../controllers/profileController");
const passportLocalStrategy = require("../config/passportLocalStrategy");
const { requireAuth, adminView } = require("../middlewares/requireAuth");

router.get("/view", requireAuth, viewProfile);
router.post("/edit", requireAuth, editProfile);
router.get("/view-all", viewAllProfile);
router.get("/profile-view/:userId", requireAuth, adminRole, adminView);

module.exports = router;

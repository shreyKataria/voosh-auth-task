// const { use } = require("passport");
const User = require("../models/userModel");

const sanitizeUser = (user) => {
  const { password, ...userWithoutPassword } = user._doc;
  return userWithoutPassword;
};

const viewProfile = (req, res) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(sanitizeUser(user));
    })
    .catch((err) => res.status(500).json({ message: "Server error" }));
};

const editProfile = (req, res) => {
  const { name, bio, phone, email, photo, profileVisibility } = req.body;

  const profileUpdates = {};
  if (name) profileUpdates.name = name;
  if (bio) profileUpdates.bio = bio;
  if (phone) profileUpdates.phone = phone;
  if (email) profileUpdates.email = email;
  if (photo) profileUpdates.photo = photo;
  if (profileVisibility) profileUpdates.profileVisibility = profileVisibility;

  User.findByIdAndUpdate(req.user.id, { $set: profileUpdates }, { new: true })
    .then((user) => {
      if (!user) return res.status(404).json({ msg: "User not found" });
      res.json(sanitizeUser(user));
    })
    .catch((err) => res.status(500).json({ msg: "Server error" }));
};

const viewAllProfile = (req, res) => {
  User.find({ profileVisibility: "public" })
    .then((users) => {
      const sanitizedUsers = users.map(sanitizeUser);
      res.json(sanitizedUsers);
    })
    .catch((err) => res.status(500).json({ msg: "Server error" }));
};

const adminRole = (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }

  User.findById(req.params.userId)
    .then((user) => {
      if (!user) return res.status(404).json({ msg: "User not found" });
      res.json(sanitizeUser(user));
    })
    .catch((err) => res.status(500).json({ msg: "Server error" }));
};

module.exports = {
  viewProfile,
  editProfile,
  viewAllProfile,
  adminRole,
};

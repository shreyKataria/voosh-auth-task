const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    function (req, email, password, done) {
      User.findOne({ email: email }, async function (err, user) {
        if (err) {
          req.flash("error", "error in passport auth");
          console.log("error in passport auth ", err);
          return done(err);
        }
        // if(!user || user.password != password)
        // console.log(!bcript.compare(password, user.password));
        if (!user || !(await bcrypt.compare(password, user.password))) {
          req.flash("error", "invalid email / password");
          console.log("invalid email / password");
          return done(null, false);
        }
        return done(null, user);
      });
    }
  )
);

//for serializeUser
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//for deserializeUser
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log(err);
      return done(err);
    }
    return done(null, user);
  });
});

//check req user sign in or not
passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/");
};

//set user in locals for views
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;

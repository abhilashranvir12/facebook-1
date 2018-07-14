const passport = require("passport");
const User = require("../models/User");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    function(email, password, cb) {
      User.findOne({ email: email }, function(err, user) {
        if (err) {
          return cb(err);
        }
        if (user) {
          if (!bcrypt.compareSync(password, user.password)) {
            return cb(null, false, {
              message: "Invalid credentials"
            });
          }
        }

        return cb(null, user);
      });
    }
  )
);

passport.serializeUser(function(user, cb) {
  return cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, ['-password'],cb);
});

module.exports = passport;

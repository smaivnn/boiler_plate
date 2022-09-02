const passport = require("passport");
const local = require("./localStrategy");
const User = require("../model/User");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null);
  });

  passport.deserializeUser((id, done) => {});

  local();
};

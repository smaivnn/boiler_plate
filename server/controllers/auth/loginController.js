const User = require("../../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const handleLogin = async (req, res) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return res.status(503).json({ success: false });
    }
    if (!user) {
      return res.status(401).json({ success: false, message: info.message });
    }

    req.login(user, { session: false }, async (loginError) => {
      if (loginError) {
        console.log(loginError);
        return res.send({ success: false, message: loginError });
      }

      const roles = Object.values(user.roles);
      const accessToken = jwt.sign(
        {
          userInfo: {
            userId: user.userId,
            name: user.name,
            roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "5s",
        }
      );

      const refreshToken = jwt.sign(
        {
          userInfo: {
            userId: user.userId,
          },
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "15s",
        }
      );

      user.refreshToken = refreshToken;
      const result = await user.save();

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });

      res.json({ success: true, accessToken });
    });
  })(req, res);
};

module.exports = { handleLogin };

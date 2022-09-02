const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { User } = require("../model/User");

const passportConfig = { usernameField: "userId", passwordField: "password" };

/**
 * passportConfig의 userId과 password가 아래의 매개변수가 된다.
 * done은 passport.authenticate의 공백함수.
 */
const passportVerify = async (userId, password, done) => {
  try {
    const foundUser = await User.findOne({ userId }).exec();
    if (!foundUser) {
      done(null, false, { message: `존재하지 않는 사용자입니다.` });
      return;
    }

    const comparePwd = await bcrypt.compare(password, foundUser.password);
    if (comparePwd) {
      done(null, foundUser);
    } else {
      done(null, false, { message: `비밀번호가 일치하지 않습니다.` });
    }
  } catch (error) {
    console.error(error);
    done(error);
  }
};

module.exports = () => {
  passport.use(new localStrategy(passportConfig, passportVerify));
};

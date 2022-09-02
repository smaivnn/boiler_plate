const { User } = require("../../model/User");

const handlelogout = async (req, res) => {
  const { userId } = req.body;
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ userId }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  if (refreshToken !== foundUser.refreshToken) return res.sendStatus(204);

  foundUser.refreshToken = "";
  const result = await foundUser.save();
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ success: true });
};

module.exports = { handlelogout };

const { User } = require("../../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); // Forbidden

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const accessToken = jwt.sign(
      {
        userInfo: {
          userId: foundUser.userId,
          name: foundUser.name,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10s" }
    );

    res.json({
      success: true,
      accessToken,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError")
      return res.status(419).json({
        success: false,
        message: `Refresh Token Expired`,
      });

    return res.status(401).json({
      success: false,
      message: `Refresh Invalid Token`,
    });
  }
};

module.exports = { handleRefreshToken };

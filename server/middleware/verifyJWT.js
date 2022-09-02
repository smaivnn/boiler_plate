const jwt = require("jsonwebtoken");

/**
 * client측에서 header에 Bearer 쿠키를 통해 accessToken을 전달해준다.
 * 해당 토큰이 유효한지 검사한다.
 */
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

  try {
    const token = authHeader.split(" ")[1];
    req.decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError")
      return res.status(419).json({
        success: false,
        message: `Access Token Expired`,
      });

    return res.status(401).json({
      success: false,
      message: `Access Invalid Token`,
    });
  }
};

module.exports = verifyJWT;

const express = require("express");
const router = express.Router();
const registerController = require("../controllers/auth/registerController");
const getUserController = require("../controllers/auth/getUserController");
const loginController = require("../controllers/auth/loginController");
const logoutController = require("../controllers/auth/logoutController");
const refreshTokenController = require("../controllers/auth/refreshTokenController");

const verifyJWT = require("../middleware/verifyJWT");

router.post("/regist", registerController.handleRegist);
router.post("/login", loginController.handleLogin);
router.get("/user", verifyJWT, getUserController.handleFetchUser);
router.get("/refresh", refreshTokenController.handleRefreshToken);
router.post("/logout", logoutController.handlelogout);

module.exports = router;

const express = require("express");
const router = express.Router();
const testController = require("../controllers/test/testController");

router.post("/", testController.handleTest);

module.exports = router;

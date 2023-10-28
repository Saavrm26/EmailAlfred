const express = require("express");
const { getLoginPage } = require("../controllers/viewController");

const router = express.Router();
router.use("/", getLoginPage);
module.exports = router;

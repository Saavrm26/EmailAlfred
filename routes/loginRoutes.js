const express = require("express");
const { authCallBack } = require("../controllers/authController");

const router = express.Router();

router.use("/auth_callback", authCallBack);

module.exports = router;

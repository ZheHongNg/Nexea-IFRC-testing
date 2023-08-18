const express = require("express");
const router = express.Router();
const { getLogin, getCookies } = require("../controllers/loginController");

router.route("/login-user").post(getLogin);
router.route("/get-cookie").get(getCookies);

module.exports = router;

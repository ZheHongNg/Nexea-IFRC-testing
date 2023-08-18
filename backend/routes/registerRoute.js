const express = require("express");
const router = express.Router();
const {
  getUser,
  createRegister,
  verifyUser,
  resendConfEmail,
} = require("../controllers/registerController");

router.route("/get-user").get(getUser);

router.route("/register-user").post(createRegister);

router.route("/confirm/:confirmationCode").get(verifyUser);

router.route("/resendConfirm").post(resendConfEmail);

module.exports = router;

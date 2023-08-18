const express = require("express");
const router = express.Router();
const { getCountries } = require("../controllers/countryController");

router.route("/get-countries").get(getCountries);

module.exports = router;

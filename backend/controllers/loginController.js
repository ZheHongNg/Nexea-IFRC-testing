const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/UserSchema");
// @desc get
// @route
// @access

const getCookies = async (req, res) => {
  try {
    const cookieValue = req.cookies.jwt_token;
    if (cookieValue) {
      return res.status(200).json({ value: cookieValue });
    } else {
      return res.status(404).json({ message: "No cookie found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getLogin = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    console.log(rememberMe);

    /*find user from database by email */
    const userFind = await User.findOne({ email: email });
    if (!userFind) {
      return res.status(404).json({ message: "User does not exist" });
    }

    /*compare the password from userFind with password from frontend to check if the password is matched*/
    const passwordMatched = await bcrypt.compare(password, userFind.password);
    if (!passwordMatched) {
      return res.status(401).json({ message: "Wrong password" });
    }

    if (userFind.status != "Active") {
      return res.status(401).json({
        message: "Pending Account. Please Verify Your Email!",
      });
    }

    // generate a token with user's email and secretkey in 24h expire
    const token = await jwt.sign({ email: email }, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    /*if rememberMe is checked, pass token to cookie and database. if no, clear the cookie*/
    if (rememberMe) {
      await User.updateOne(
        { email: email },
        { $set: { rememberMeToken: token } }
      );
      res.cookie("jwt_token", token, { maxAge: 86400, httpOnly: true });
    } else {
      res.clearCookie("jwt_token");
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};

// // @desc
// // @route
// // @access
// const getLogin = (req, res) => {
//   res.status(200);
//   res.send({ status: "Login" });
// };

module.exports = { getLogin, getCookies };

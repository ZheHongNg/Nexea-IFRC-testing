const User = require("../models/UserSchema");
const jwt = require("jsonwebtoken");
const sendConfirmationEmail = require("../config/nodemailer.config");

const getUser = async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (error) {
    res.json(error);
  }
};

// @desc Register a new user
// @route POST
// @access public
const createRegister = async (req, res, next) => {
  const {
    firstname,
    lastname,
    email,
    phone,
    department,
    country,
    password,
    confirmpassword,
  } = req.body;
  try {
    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    const newUser = await User.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      phone: phone,
      department: department,
      country: country,
      password: password,
      confirmpassword: confirmpassword,
      confirmationCode: token,
    });
    res.status(201).send(newUser);
    sendConfirmationEmail(
      newUser.firstname,
      newUser.email,
      newUser.confirmationCode
    );
  } catch (error) {
    next(error);
  }
};

const verifyUser = async (req, res) => {
  const confirmationCode = req.params.confirmationCode;
  jwt.verify(confirmationCode, process.env.SECRET_KEY, async (err) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(500).json({ message: "Confirmation Code Expired!" });
      } else {
        return res.status(500).json({ message: err.name });
      }
    } else {
      await User.updateOne(
        { confirmationCode },
        { $set: { status: "Active" }, $unset: { confirmationCode } }
      )
        .then((result) => {
          if (result.matchedCount === 0) {
            return res.status(404).json({ message: "User Not found." });
          } else if (result.modifiedCount > 0) {
            return res.json("Success");
          } else {
            return res.status(500).json({ message: "No changes made." });
          }
        })
        .catch((err) => {
          return res.status(500).json({ message: err });
        });
    }
  });
};

const resendConfEmail = async (req, res) => {
  let searchField = {};
  if (req.body.email) {
    searchField = { name: "email", value: req.body.email };
  } else if (req.body.confirmationCode) {
    searchField = {
      name: "confirmationCode",
      value: req.body.confirmationCode,
    };
  }

  try {
    const user = await User.findOne({ [searchField.name]: searchField.value });

    if (!user) {
      return res.status(404).json({ message: "User Not found." });
    }

    if (user.status === "Active") {
      return res.status(500).json({ message: "User already verified." });
    }

    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    await User.updateOne({ _id: user._id }, { confirmationCode: token }).then(
      (result) => {
        if (result.modifiedCount === 0) {
          return res.status(500).json({ message: "No changes made." });
        }
      }
    );

    sendConfirmationEmail(user.firstname, user.email, token);

    return res.json("Success");
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports = { createRegister, getUser, verifyUser, resendConfEmail };

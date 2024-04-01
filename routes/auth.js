// Imports
const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyjwt = require("../middlewares/authMiddleware");

// Register API
router.post("/register", async (req, res) => {
  try {
    //getting data from request body
    const { name, email, mobile, password } = req.body;

    //validation
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        errorMessage: "Fill in all mandatory fields",
      });
    }

    //checking if email or mobile already exists
    const isExistingEmail = await User.findOne({ email });
    const isExistingMobile = await User.findOne({ mobile });

    //if user already exists
    if (isExistingEmail || isExistingMobile) {
      return res.status(409).json({
        errorMessage: "user already exists",
      });
    }

    //encrypting the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Adding user to the database
    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    //token generation using jwt
    const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    //sending JSON response
    res.status(200).json({
      name: user.name,
      message: "User Registered Successfully",
      token: token,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

//Login API
router.post("/login", async (req, res) => {
  try {
    //getting data from request body
    const { emailOrMobile, password } = req.body;

    //validation
    if (!emailOrMobile || !password) {
      return res.status(400).json({
        errorMessage: "Bad Request",
      });
    }

    //finding data from database on the basis of email
    const userDetails = await User.findOne({ 
      $or: [{email: emailOrMobile}, { mobile: emailOrMobile }]
     });

    //handling the case where details not present in database
    if (!userDetails) {
      return res.status(404).json({
        errorMessage: "User not found",
      });
    }

    //checking whether password match or not
    const doesPasswordMatch = await bcrypt.compare(
      password,
      userDetails.password
    );

    //case: password did not match
    if (!doesPasswordMatch) {
      return res.status(401).json({
        errorMessage: "Invalid Credentials !!!",
      });
    }

    //case: password matched
    const token = await jwt.sign(
      { userId: userDetails._id },
      process.env.JWT_SECRET
    );

    //sending JSON response
    res.status(200).json({
      name: userDetails.name,
      message: "User Logged In Successfully",
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

//Protected Routing
router.get("/protected", verifyjwt, async (req, res) => {
  const user = await User.findOne({ _id: req.body.userId });

  res.status(200).send({ message: "Authorized User",  name: user.name });
});

module.exports = router;

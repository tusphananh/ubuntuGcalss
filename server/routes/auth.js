const express = require("express");
const router = express.Router();

const User = require("../models/user");

const checkValidPhone = require("../utils/checkUser").checkValidPhone;
const checkValidName = require("../utils/checkUser").checkValidName;
const checkExistUser = require("../utils/checkUser").checkExistUser;
// @route POST api/auth/login
// @description Login a user
// @access PUBLIC
router.post("/login", async (req, res) => {
  const { phone } = req.body;
  await checkValidPhone(phone, (data) => {
    if (!data.success) {
      return res.status(400).json({
        message: data.message,
      });
    }
  });

  await checkExistUser(phone, (data) => {
    if (!data.success) {
      return res.status(400).json({
        message: data.message,
      });
    }
  });

  return res.status(200).json({
    message: "Need OTP for login success",
  });
});

// @router POST api/auth/register
// @description Register a user
// @access PUBLIC
router.post("/register", async (req, res) => {
  const { phone, firstName, lastName } = req.body;
  await checkValidPhone(phone, (data) => {
    if (!data.success) {
      return res.status(400).json({
        message: data.message,
      });
    }
  });

  await checkValidName(firstName, lastName, (data) => {
    if (!data.success) {
      return res.status(400).json({
        message: data.message,
      });
    }
  });

  await checkExistUser(phone, (data) => {
    if (data.success) {
      return res.status(400).json({
        message: data.message,
      });
    }
  });

  const newUser = new User({ phone, firstName, lastName });
  await newUser.save();

  return res.status(200).json({
    message: "Register Successful",
  });
});

module.exports = router;
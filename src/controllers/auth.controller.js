const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");

async function userRegisterController(req, res, next) {
  const { email, password, name } = req.body;

  const isExist = await userModel.findOne({ email: email });

  if (isExist) {
    return res.status(422).json({
      message: "User already exists with email",
      status: "failed",
    });
  }
  const user = await userModel.create({
    email,
    password,
    name,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  res.status(201).json({
    user: { _id: user._id, email: user.email, name: user.name },
    token,
  });

  await emailService.sendRegistrationEmail(user.email, user.name);
}

async function userLoginController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      message: "Email or Password is incorrect",
    });
  }
  const isvalidPass = await user.comparePassword(password);

  if (!isvalidPass) {
    return res.status(401).json({
      message: "Email or Password is incorrect",
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  res.status(200).json({
    message: "Login Successfull",
    user: { _id: user._id, email: user.email, name: user.name },
    token,
  });

  await emailService.sendLoginEmail(user.email, user.name);
}

module.exports = { userRegisterController, userLoginController };

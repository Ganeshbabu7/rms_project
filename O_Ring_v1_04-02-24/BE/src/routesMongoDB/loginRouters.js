const express = require("express");
const router = express.Router();
const { mongoose } = require("mongoose");
const { dbUrl } = require("../config/mongoDbConfig");
const { userModel } = require("../schema/userSchema");
const {
  createToken,
  hashCompare,
  hashPassword,
  tokenValidation,
} = require("../auth/auth");
const mysqlConnection = require("../config/mySqlConfig");

// Mongoose Connect :
mongoose.set("strictQuery", true);
mongoose.connect(dbUrl);

// User or Data Collector Signup Router :
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkEmail = await userModel.findOne({ email: email });
    if (!checkEmail) {
      req.body.password = await hashPassword(password);
      const result = new userModel(req.body);
      await result.save();
      res.status(201).send({ message: "User Created Successfully", result });
    } else res.status(400).send({ message: "Email Already Exists" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" }, error);
  }
});

// User or Data Collector Login Router :
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (user) {
      if (await hashCompare(password, user.password)) {
        const token = await createToken({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        });
        res
          .status(200)
          .send({ message: "Login Successful", token, result: user });
      } else res.status(400).send({ message: "Invalid Credentials" });
    } else res.status(400).send({ message: "User Does Not Exists" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" }, error);
  }
});

// Forgot Password :
router.post("/forgetPassword", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await userModel.findOne({ email: email });
    if (user) {
      const hash = await hashPassword(newPassword);
      const result = await userModel.findOneAndUpdate(
        { email: email },
        { $set: { password: hash } },
        { $new: true }
      );
      res.status(200).send({ message: "Password Reset Successful", result });
    } else res.status(400).send({ message: "User Does Not Exists" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" }, error);
  }
});

// User or Data Collector Details Router :
router.post("/userDetails", tokenValidation, async (req, res) => {
  try {
    const id = req.userId;
    const user = await userModel.findOne({ _id: id });
    if (user) {
      res.status(200).send({ message: "User Details", result: user });
    } else res.status(400).send({ message: "User Does Not Exists" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" }, error);
  }
});

module.exports = router;

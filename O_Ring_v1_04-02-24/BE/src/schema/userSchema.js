const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    password: { type: String },
    role: { type: String },
  },
  { timestamps: true },
  { versionKey: false },
  { collection: "userDetails" }
);

const userModel = mongoose.model("userDetaisls", userSchema);

module.exports = { userModel };

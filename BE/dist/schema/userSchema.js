"use strict";

var mongoose = require("mongoose");
var validator = require("validator");
var userSchema = mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  role: {
    type: String
  }
}, {
  timestamps: true
}, {
  versionKey: false
}, {
  collection: "userDetails"
});
var userModel = mongoose.model("userDetaisls", userSchema);
module.exports = {
  userModel: userModel
};
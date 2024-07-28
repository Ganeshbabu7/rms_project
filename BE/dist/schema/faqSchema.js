"use strict";

var mongoose = require("mongoose");
var fqaSchema = mongoose.Schema({
  sNo: {
    type: Number
  },
  question: {
    type: String
  },
  answer: {
    type: String
  }
}, {
  timestamps: true
}, {
  versionKey: false
}, {
  collection: "FAQ Registry"
});
var fqaModel = mongoose.model("FAQ Registry", fqaSchema);
module.exports = {
  fqaModel: fqaModel
};
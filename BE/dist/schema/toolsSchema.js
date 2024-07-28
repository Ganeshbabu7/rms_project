"use strict";

var mongoose = require("mongoose");
var toolsSchema = mongoose.Schema({
  sNo: {
    type: Number
  },
  date: {
    type: String
  },
  materialItem: {
    type: String
  },
  currentQuantity: {
    type: Number
  }
}, {
  timestamps: true
}, {
  versionKey: false
}, {
  collection: "Tools Registry"
});
var toolsModel = mongoose.model("Tools Registry", toolsSchema);
module.exports = {
  toolsModel: toolsModel
};
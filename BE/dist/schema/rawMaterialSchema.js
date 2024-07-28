"use strict";

var mongoose = require("mongoose");
var rawMaterialSchema = mongoose.Schema({
  sNo: {
    type: Number
  },
  date: {
    type: String
  },
  materialItem: {
    type: String
  },
  supplier: {
    type: String
  },
  currentQuantity: {
    type: Number
  },
  thresholdQuantity: {
    type: Number
  }
}, {
  timestamps: true
}, {
  versionKey: false
}, {
  collection: "Rawmaterial Registry"
});
var rawMaterialModel = mongoose.model("Rawmaterial Registry", rawMaterialSchema);
module.exports = {
  rawMaterialModel: rawMaterialModel
};
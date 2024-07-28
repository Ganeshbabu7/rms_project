"use strict";

var mongoose = require("mongoose");
var batchNoSchema = mongoose.Schema({
  batchNo: {
    type: String
  },
  batchCode: {
    type: String
  },
  itemName: {
    type: String
  },
  quantity: {
    type: Number
  }
}, {
  timestamps: true
}, {
  versionKey: false
}, {
  collection: "batch numbers"
});
var batchNoModel = mongoose.model("batch numbers", batchNoSchema);
module.exports = {
  batchNoModel: batchNoModel
};
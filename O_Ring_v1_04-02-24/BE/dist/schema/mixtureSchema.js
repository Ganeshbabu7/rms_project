"use strict";

var mongoose = require("mongoose");
var mixtureSchema = mongoose.Schema({
  batchCode: {
    type: String
  },
  chemicalMixture: {
    type: String
  },
  quantity: {
    type: String
  }
}, {
  timestamps: true
}, {
  versionKey: false
}, {
  collection: "Mixture Formula"
});
var mixtureModel = mongoose.model("Mixture Formula", mixtureSchema);
module.exports = {
  mixtureModel: mixtureModel
};
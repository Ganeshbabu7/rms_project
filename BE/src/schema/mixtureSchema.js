const mongoose = require("mongoose");

const mixtureSchema = mongoose.Schema(
  {
    batchCode: { type: String },
    chemicalMixture: { type: String },
    quantity: { type: String },
  },
  { timestamps: true },
  { versionKey: false },
  { collection: "Mixture Formula" }
);

const mixtureModel = mongoose.model("Mixture Formula", mixtureSchema);

module.exports = { mixtureModel };

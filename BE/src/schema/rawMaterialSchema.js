const mongoose = require("mongoose");

const rawMaterialSchema = mongoose.Schema(
  {
    sNo: { type: Number },
    date: { type: String },
    materialItem: { type: String },
    supplier: { type: String },
    currentQuantity: { type: Number },
    thresholdQuantity: { type: Number },
  },
  { timestamps: true },
  { versionKey: false },
  { collection: "Rawmaterial Registry" }
);

const rawMaterialModel = mongoose.model(
  "Rawmaterial Registry",
  rawMaterialSchema
);

module.exports = { rawMaterialModel };

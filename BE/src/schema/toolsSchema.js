const mongoose = require("mongoose");

const toolsSchema = mongoose.Schema(
  {
    sNo: { type: Number },
    date: { type: String },
    materialItem: { type: String },
    currentQuantity: { type: Number },
  },
  { timestamps: true },
  { versionKey: false },
  { collection: "Tools Registry" }
);

const toolsModel = mongoose.model("Tools Registry", toolsSchema);

module.exports = { toolsModel };

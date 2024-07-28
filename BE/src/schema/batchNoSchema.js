const mongoose = require("mongoose");

const batchNoSchema = mongoose.Schema(
  {
    batchNo: { type: String },
    batchCode: { type: String },
    itemName: { type: String },
    quantity: { type: Number },
  },
  { timestamps: true },
  { versionKey: false },
  { collection: "batch numbers" }
);

const batchNoModel = mongoose.model("batch numbers", batchNoSchema);

module.exports = { batchNoModel };

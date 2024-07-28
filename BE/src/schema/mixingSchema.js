const mongoose = require("mongoose");

const mixingSchema = mongoose.Schema(
  {
    sNo: { type: Number },
    date: { type: String },
    batchNo: { type: String },
    batchCode: { type: String },
    item: { type: String },
    party: { type: String },
    jobType: { type: String },
    totalKgs: { type: Number },
  },
  { timestamps: true },
  { versionKey: false },
  { collection: "Mixing Registry" }
);

const mixingModel = mongoose.model("Mixing Registry", mixingSchema);

module.exports = { mixingModel };

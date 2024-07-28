const mongoose = require("mongoose");

const fqaSchema = mongoose.Schema(
  {
    sNo: { type: Number },
    question: { type: String },
    answer: { type: String },
  },
  { timestamps: true },
  { versionKey: false },
  { collection: "FAQ Registry" }
);

const fqaModel = mongoose.model("FAQ Registry", fqaSchema);

module.exports = { fqaModel };

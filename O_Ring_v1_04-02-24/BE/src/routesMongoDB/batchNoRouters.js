const express = require("express");
const router = express.Router();
const { mongoose } = require("mongoose");
const { tokenValidation } = require("../auth/auth");
const { dbUrl } = require("../config/mongoDbConfig");
const { userModel } = require("../schema/userSchema");
const { batchNoModel } = require("../schema/batchNoSchema");
const { generateBatchCode } = require("../functions/batchCodeFunction");

// Mongoose Connect :
mongoose.set("strictQuery", true);
mongoose.connect(dbUrl);

// Batch No Router :
router.post("/", tokenValidation, async (req, res) => {
  try {
    const id = req.userId;
    const { action, batchId, ...requestData } = req.body;
    const user = await userModel.findOne({ _id: id });
    if (user) {
      if (action == "create") {
        const batchNo = await generateBatchCode();
        console.log("batchNo: ", batchNo);
        const result = new batchNoModel({ ...requestData, batchNo });
        await result.save();
        res.status(201).send({ message: "Batch Created Successfully", result });
      } else if (action == "read") {
        const result = await batchNoModel.find({});
        res.status(200).send({ message: "Batch List", result });
      } else if (action == "readOne") {
        const result = await batchNoModel.findOne({ _id: batchId });
        res.status(200).send({ message: "Batch Details", result });
      } else if (action == "update") {
        const result = await batchNoModel.findOneAndUpdate(
          { _id: batchId },
          { $set: req.body },
          { new: true }
        );
        res.status(200).send({ message: "Batch Updated Successfully", result });
      } else if (action == "delete") {
        const result = await batchNoModel.findOneAndDelete({ _id: batchId });
        res.status(200).send({ message: "Batch Deleted Successfully", result });
      } else res.status(400).send({ message: "Action Does Not Exists" });
    } else res.status(400).send({ message: "User Does Not Exists" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" }, error);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { mongoose } = require("mongoose");
const { tokenValidation } = require("../auth/auth");
const { dbUrl } = require("../config/mongoDbConfig");
const { userModel } = require("../schema/userSchema");
const { rawMaterialModel } = require("../schema/rawMaterialSchema");

// Mongoose Connect :
mongoose.set("strictQuery", true);
mongoose.connect(dbUrl);

// Raw Material Router :
router.post("/", tokenValidation, async (req, res) => {
  try {
    const id = req.userId;
    const { action, rawMaterialId } = req.body;
    const user = await userModel.findOne({ _id: id });
    if (user) {
      if (action == "create") {
        const result = new rawMaterialModel(req.body);
        await result.save();
        res
          .status(201)
          .send({ message: "Raw Material Added Successfully", result });
      } else if (action == "read") {
        const result = await rawMaterialModel.find({});
        res.status(200).send({ message: "Raw Material List", result });
      } else if (action == "readOne") {
        const result = await rawMaterialModel.findOne({ _id: rawMaterialId });
        res.status(200).send({ message: "Raw Material Detail", result });
      } else if (action == "update") {
        const result = await rawMaterialModel.findOneAndUpdate(
          { _id: rawMaterialId },
          { $set: req.body },
          { new: true }
        );
        res
          .status(200)
          .send({ message: "Raw Material Updated Successfully", result });
      } else if (action == "delete") {
        const result = await rawMaterialModel.findOneAndDelete({
          _id: rawMaterialId,
        });
        res
          .status(200)
          .send({ message: "Raw Material Deleted Successfully", result });
      } else res.status(400).send({ message: "Action Does Not Exists" });
    } else res.status(400).send({ message: "User Does Not Exists" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" }, error);
  }
});

module.exports = router;
